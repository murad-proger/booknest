import { describe, it, expect } from "vitest";
import { bookSchema } from "@/lib/validation";

describe("bookSchema", () => {
  it("проходит валидацию с корректными данными", () => {
    const valid = { title: "Дюна", author: "Фрэнк Герберт", price: 15 };

    expect(() => bookSchema.parse(valid)).toThrow();
  });

  it("не проходит валидацию с пустым title", () => {
    const result = bookSchema.safeParse({
      title: "",
      author: "Фрэнк Герберт",
      price: 15,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Title is required");
    }
  });
});