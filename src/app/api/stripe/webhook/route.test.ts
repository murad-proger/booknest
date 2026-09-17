import { describe, it, expect, vi, beforeEach } from "vitest";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { clearCartByUserId } from "@/services/cart";
import { POST } from "./route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
  },
}));

vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: { constructEvent: vi.fn() },
  },
}));

/*
clearCartByUserId дёргает tx.cart / tx.cartItem напрямую — чтобы не тащить
это в каждый мок tx, мокаем сам сервис (тот же приём, что и с
@/services/orders в checkout.test.ts).
*/
vi.mock("@/services/cart", () => ({
  clearCartByUserId: vi.fn(),
}));

function buildRequest(body: unknown, signature: string | null = "sig_test") {
  const headers = new Headers();
  if (signature !== null) {
    headers.set("stripe-signature", signature);
  }

  return new Request("http://localhost/api/stripe/webhook", {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });
}

/*
Мок $transaction подставляет колбэку наш "фейковый" tx с нужными
методами — сам колбэк (реальный код из route.ts) выполняется как есть.
*/
function mockTransaction(tx: Record<string, unknown>) {
  vi.mocked(prisma.$transaction).mockImplementation(
    (callback) => (callback as (tx: unknown) => unknown)(tx) as never
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/stripe/webhook", () => {
  it("возвращает 400, если заголовок stripe-signature отсутствует", async () => {
    const response = await POST(buildRequest({}, null));

    expect(response.status).toBe(400);
    // До проверки подписи дело даже не доходит — Stripe вообще не дёргаем.
    expect(stripe.webhooks.constructEvent).not.toHaveBeenCalled();
  });

  it("возвращает 400, если подпись не проходит верификацию", async () => {
    vi.mocked(stripe.webhooks.constructEvent).mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const response = await POST(buildRequest({}));

    expect(response.status).toBe(400);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("checkout.session.completed (happy path): Payment SUCCEEDED, Order PAID, корзина очищена", async () => {
    const event = {
      id: "evt_1",
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: { orderId: "42" },
          payment_intent: "pi_42",
        },
      },
    };
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(event as never);

    const tx = {
      webhookEvent: { create: vi.fn().mockResolvedValue({ id: 1 }) },
      order: {
        findUnique: vi.fn().mockResolvedValue({ userId: 7 }),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
      payment: {
        findFirst: vi.fn().mockResolvedValue({ id: 100, status: "PENDING" }),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
    };
    mockTransaction(tx);

    const response = await POST(buildRequest({}));

    expect(response.status).toBe(200);
    expect(tx.payment.updateMany).toHaveBeenCalledWith({
      where: { id: 100, status: "PENDING" },
      data: { providerPaymentId: "pi_42", status: "SUCCEEDED" },
    });
    expect(tx.order.updateMany).toHaveBeenCalledWith({
      where: { id: 42, status: "PENDING" },
      data: { status: "PAID" },
    });
    expect(clearCartByUserId).toHaveBeenCalledWith(7, tx);
  });

  it("идемпотентность: повторная доставка того же event.id не создаёт дублирующих изменений", async () => {
    const event = {
      id: "evt_1",
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: { orderId: "42" },
          payment_intent: "pi_42",
        },
      },
    };
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(event as never);

    // Первая доставка: webhookEvent.create проходит успешно.
    const firstTx = {
      webhookEvent: { create: vi.fn().mockResolvedValue({ id: 1 }) },
      order: {
        findUnique: vi.fn().mockResolvedValue({ userId: 7 }),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
      payment: {
        findFirst: vi.fn().mockResolvedValue({ id: 100, status: "PENDING" }),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
    };
    mockTransaction(firstTx);
    const firstResponse = await POST(buildRequest({}));
    expect(firstResponse.status).toBe(200);
    expect(firstTx.order.updateMany).toHaveBeenCalledTimes(1);

    /*
      Вторая доставка того же event.id: unique-констрейнт в БД на eventId
      бросает P2002 — код это ловит и возвращает `false` из транзакции,
      не доходя до payment/order. Здесь это эмулируется тем, что
      webhookEvent.create второй раз реджектится с этой ошибкой.
    */
    const secondTx = {
      webhookEvent: {
        create: vi.fn().mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
            code: "P2002",
            clientVersion: "test",
          })
        ),
      },
      order: { findUnique: vi.fn(), updateMany: vi.fn() },
      payment: { findFirst: vi.fn(), updateMany: vi.fn() },
    };
    mockTransaction(secondTx);

    const secondResponse = await POST(buildRequest({}));

    expect(secondResponse.status).toBe(200);
    expect(secondTx.order.findUnique).not.toHaveBeenCalled();
    expect(secondTx.payment.updateMany).not.toHaveBeenCalled();
    expect(secondTx.order.updateMany).not.toHaveBeenCalled();
    expect(clearCartByUserId).toHaveBeenCalledTimes(1); // только от первой доставки
  });

  it("guard по статусу: заказ уже не PENDING (событие пришло не в том порядке) → изменения откатываются, ответ 400", async () => {
    const event = {
      id: "evt_1",
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: { orderId: "42" },
          payment_intent: "pi_42",
        },
      },
    };
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(event as never);

    const tx = {
      webhookEvent: { create: vi.fn().mockResolvedValue({ id: 1 }) },
      order: {
        findUnique: vi.fn().mockResolvedValue({ userId: 7 }),
        /*
          Заказ уже не в PENDING (например, обработан параллельно) —
          guard в updateMany не находит строку под условие.
        */
        updateMany: vi.fn().mockResolvedValue({ count: 0 }),
      },
      payment: {
        findFirst: vi.fn().mockResolvedValue({ id: 100, status: "PENDING" }),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
    };
    mockTransaction(tx);

    const response = await POST(buildRequest({}));

    expect(response.status).toBe(400);
    /*
      Payment успел обновиться до того, как сработал guard на заказе, но
      это внутри одной и той же $transaction — в проде такой Payment-апдейт
      будет отменён вместе со всей транзакцией на уровне реальной БД.
      Здесь мы проверяем именно то, что мокаем: код выбросил ошибку и не
      дошёл до clearCartByUserId.
    */
    expect(clearCartByUserId).not.toHaveBeenCalled();
  });
});