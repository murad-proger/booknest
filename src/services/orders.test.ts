import { describe, it, expect, vi, type Mock } from "vitest";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createOrderFromCart } from "@/services/orders";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
  },
}));

/*
см. комментарий в src/lib/auth-utils.test.ts — auth() размечен как union нескольких сигнатур,
vi.mocked(auth) путает их между собой.
*/
const mockedAuth = auth as unknown as Mock<() => Promise<Session | null>>;

describe("createOrderFromCart", () => {
  it("бросает ошибку, если пользователь не авторизован", async () => {
    mockedAuth.mockResolvedValue(null);

    await expect(createOrderFromCart()).rejects.toThrow("Unauthorized");
  });

  it("бросает ошибку, если корзина пустая или её нет", async () => {
    mockedAuth.mockResolvedValue({
      user: { id: "1" },
    } as never);

    // $transaction в проде вызывает переданный колбэк с объектом tx.
    // Здесь мы сами это эмулируем: подсовываем колбэку "фейковый" tx,
    // у которого cart.findUnique возвращает null (корзины нет).
    vi.mocked(prisma.$transaction).mockImplementation((callback) => {
      const tx = {
        cart: {
          findUnique: vi.fn().mockResolvedValue(null),
        },
      };
      return (callback as (tx: unknown) => unknown)(tx) as never;
    });

    await expect(createOrderFromCart()).rejects.toThrow("Cart is empty");
  });

  it("бросает ошибку, если в корзине есть запись, но items пустой", async () => {
    mockedAuth.mockResolvedValue({
      user: { id: "1" },
    } as never);

    vi.mocked(prisma.$transaction).mockImplementation((callback) => {
      const tx = {
        cart: {
          findUnique: vi.fn().mockResolvedValue({ id: 1, userId: 1, items: [] }),
        },
      };
      return (callback as (tx: unknown) => unknown)(tx) as never;
    });

    await expect(createOrderFromCart()).rejects.toThrow("Cart is empty");
  });
});
