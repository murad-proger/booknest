import { describe, it, expect } from "vitest";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageDropzone from "./ImageDropzone";

/* ImageDropzone — контролируемый компонент (files/onChange приходят снаружи), поэтому в тесте нужен минимальный "хозяин состояния" сверху. */
function ControlledDropzone() {
  const [files, setFiles] = useState<File[]>([]);
  return <ImageDropzone files={files} onChange={setFiles} />;
}

describe("ImageDropzone", () => {
  it("показывает превью после выбора файла и удаляет по клику на ×", async () => {
    const user = userEvent.setup();
    const { container } = render(<ControlledDropzone />);

    const file = new File(["dummy content"], "cover.png", {
      type: "image/png",
    });

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    await user.upload(input, file);

    expect(await screen.findByAltText("cover.png")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Remove cover.png" }));

    expect(screen.queryByAltText("cover.png")).not.toBeInTheDocument();
  });
});