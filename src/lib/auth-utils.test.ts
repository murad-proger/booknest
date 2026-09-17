import { describe, it, expect, vi, type Mock } from "vitest";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth-utils";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

/*
auth() в NextAuth v5 типизирован как объединение нескольких сигнатур
(обычный геттер сессии / обёртка над middleware / обёртка над route-
хендлером — в зависимости от переданных аргументов). Мы вызываем его
без аргументов, но vi.mocked(auth) выводит тип по всему объединению и
иногда попадает на сигнатуру middleware, из-за чего mockResolvedValue(null)
не проходит проверку типов. Явно указываем ту сигнатуру, которую реально
используем — просто () => Promise<Session | null>.
*/
const mockedAuth = auth as unknown as Mock<() => Promise<Session | null>>;

describe("requireAdmin", () => {
  it("возвращает null, если сессии нет", async () => {
    mockedAuth.mockResolvedValue(null);

    const result = await requireAdmin();

    expect(result).toBeNull();
  });

  it("возвращает null, если у пользователя роль не ADMIN", async () => {
    mockedAuth.mockResolvedValue({
      user: { id: "1", role: "USER" },
    } as never);

    const result = await requireAdmin();

    expect(result).toBeNull();
  });

  it("возвращает сессию, если роль ADMIN", async () => {
    const session = { user: { id: "1", role: "ADMIN" } };
    mockedAuth.mockResolvedValue(session as never);

    const result = await requireAdmin();

    expect(result).toEqual(session);
  });
});