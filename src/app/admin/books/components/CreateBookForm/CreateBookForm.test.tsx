import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateBookForm from "./CreateBookForm";

vi.mock("@/actions/books", () => ({
  createBookAction: vi.fn(),
}));

describe("CreateBookForm", () => {
  it("показывает ошибку валидации при пустом title", async () => {
    const user = userEvent.setup();
    render(<CreateBookForm />);

    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(await screen.findByText("Title is required")).toBeInTheDocument();
  });
});