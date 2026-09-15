import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EmptyCart from "@/components/Cart/EmptyCart/EmptyCart";

describe("EmptyCart", () => {
  it("показывает текст пустой корзины и ссылку на книги", () => {
    render(<EmptyCart />);

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    
    expect(
      screen.getByRole("link", { name: "Browse books" })
    ).toBeInTheDocument();
  });
});