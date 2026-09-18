import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import PriceFilter from "./PriceFilter";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

const replaceMock = vi.fn();

describe("PriceFilter", () => {
  beforeEach(() => {
    replaceMock.mockClear();
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as unknown as ReturnType<typeof useSearchParams>
    );
    vi.mocked(useRouter).mockReturnValue({
      replace: replaceMock,
    } as unknown as ReturnType<typeof useRouter>);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("вызывает router.replace с нужным query после дебаунса", () => {
    const { container } = render(<PriceFilter />);

    const minInput = container.querySelector(
      'input[name="priceMin"]'
    ) as HTMLInputElement;

    fireEvent.change(minInput, { target: { value: "15" } });

    // сразу после ввода replace ещё не должен был вызваться — ждём дебаунс
    expect(replaceMock).not.toHaveBeenCalled();

    vi.advanceTimersByTime(400);

    expect(replaceMock).toHaveBeenCalledWith("/books?priceMin=15");
  });
});