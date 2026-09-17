import { describe, it, expect, vi, beforeEach } from "vitest";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { refundPayment } from "@/services/checkout";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    order: { findUnique: vi.fn() },
    payment: { updateMany: vi.fn() },
  },
}));

vi.mock("@/lib/stripe", () => ({
  stripe: {
    refunds: { create: vi.fn() },
  },
}));

/*
checkout.ts на верхнем уровне импортирует createOrderFromCart из
@/services/orders, а тот тянет @/lib/auth → next-auth → next/server,
который вне рантайма Next.js не резолвится (та же проблема, что и с
серверными экшенами на Уровне 2). refundPayment эту функцию не использует,
поэтому просто мокаем модуль целиком, не трогая прод-код.
*/
vi.mock("@/services/orders", () => ({
  createOrderFromCart: vi.fn(),
}));

const succeededPayment = {
  id: 10,
  status: "SUCCEEDED",
  providerPaymentId: "pi_123",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("refundPayment", () => {
  it("бросает NOT_FOUND, если заказа нет", async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValue(null as never);

    await expect(refundPayment(1)).rejects.toThrow("NOT_FOUND");
  });

  it("бросает NOT_REFUNDABLE, если среди платежей нет SUCCEEDED", async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValue({
      id: 1,
      payments: [{ id: 5, status: "PENDING", providerPaymentId: null }],
    } as never);

    await expect(refundPayment(1)).rejects.toThrow("NOT_REFUNDABLE");
  });

  it("бросает NOT_REFUNDABLE, если платёж уже перехвачен другим вызовом (updateMany.count === 0)", async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValue({
      id: 1,
      payments: [succeededPayment],
    } as never);

    /*
      Эмулируем гонку: между findUnique и updateMany кто-то другой
      (например, параллельный запрос) уже перевёл платёж из SUCCEEDED
      в другой статус, поэтому guard-условие "status: SUCCEEDED" в
      updateMany не находит ни одной строки — count 0.
    */
    vi.mocked(prisma.payment.updateMany).mockResolvedValue({ count: 0 });

    await expect(refundPayment(1)).rejects.toThrow("NOT_REFUNDABLE");
    expect(stripe.refunds.create).not.toHaveBeenCalled();
  });

  it("happy path: блокирует платёж (REFUND_PENDING) и создаёт refund в Stripe", async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValue({
      id: 1,
      payments: [succeededPayment],
    } as never);
    vi.mocked(prisma.payment.updateMany).mockResolvedValue({ count: 1 });
    const refund = { id: "re_1" };
    vi.mocked(stripe.refunds.create).mockResolvedValue(refund as never);

    const result = await refundPayment(1);

    expect(prisma.payment.updateMany).toHaveBeenCalledWith({
      where: { id: succeededPayment.id, status: "SUCCEEDED" },
      data: { status: "REFUND_PENDING" },
    });
    expect(stripe.refunds.create).toHaveBeenCalledWith({
      payment_intent: succeededPayment.providerPaymentId,
    });
    expect(result).toEqual({ refund });
  });

  it("Stripe отвечает charge_already_refunded → ALREADY_REFUNDED, статус остаётся REFUND_PENDING", async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValue({
      id: 1,
      payments: [succeededPayment],
    } as never);
    vi.mocked(prisma.payment.updateMany).mockResolvedValue({ count: 1 });

    /*
      StripeInvalidRequestError создаём через конструктор реального класса
      из пакета stripe — так проверяется именно ветка `instanceof`, как в проде,
      а не абстрактный Error с похожим полем `code`.
    */
    const stripeError = Object.assign(
      Object.create(Stripe.errors.StripeInvalidRequestError.prototype),
      { code: "charge_already_refunded" }
    );
    vi.mocked(stripe.refunds.create).mockRejectedValue(stripeError);

    await expect(refundPayment(1)).rejects.toThrow("ALREADY_REFUNDED");

    /*
      updateMany должен был вызваться только один раз — на блокировку.
      Отката обратно в SUCCEEDED быть не должно: webhook charge.refunded
      сам доведёт статус до REFUNDED.
    */
    expect(prisma.payment.updateMany).toHaveBeenCalledTimes(1);
  });

  it("Stripe отвечает произвольной ошибкой → платёж откатывается в SUCCEEDED, ошибка пробрасывается", async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValue({
      id: 1,
      payments: [succeededPayment],
    } as never);
    vi.mocked(prisma.payment.updateMany).mockResolvedValue({ count: 1 });

    const genericError = new Error("Stripe is down");
    vi.mocked(stripe.refunds.create).mockRejectedValue(genericError);

    await expect(refundPayment(1)).rejects.toThrow("Stripe is down");

    expect(prisma.payment.updateMany).toHaveBeenNthCalledWith(2, {
      where: { id: succeededPayment.id, status: "REFUND_PENDING" },
      data: { status: "SUCCEEDED" },
    });
  });
});
