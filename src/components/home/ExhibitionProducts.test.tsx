import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { exhibition } from "@/data/exhibition";
import { ExhibitionProducts } from "./ExhibitionProducts";

const renderProducts = () => render(<ExhibitionProducts brands={exhibition.brands} products={exhibition.products} />);
const items = () => within(screen.getByRole("list")).getAllByRole("listitem");

describe("ExhibitionProducts", () => {
  afterEach(cleanup);

  it("첫 칩 '전체' + 브랜드마다 칩, 원형 로고 자리에 브랜드 첫 글자, 한 줄 8칸 두 줄", () => {
    renderProducts();

    const group = screen.getByRole("group", { name: "브랜드 필터" });
    const chips = within(group).getAllByRole("button");
    expect(chips[0]).toHaveTextContent("전체");
    expect(chips).toHaveLength(exhibition.brands.length + 1);
    expect(chips[1].querySelector(".rounded-full")).toHaveTextContent(exhibition.brands[0].charAt(0));
    chips.forEach((chip) => expect(chip).toHaveAttribute("type", "button"));
    expect(chips[0].parentElement!.children).toHaveLength(8);
  });

  it("브랜드 칩을 누르면 그 칩만 선택(aria-pressed)·목록은 그 브랜드만, URL 은 그대로, '전체'로 복귀", () => {
    renderProducts();
    const href = location.href;
    const brand = exhibition.brands[2];

    fireEvent.click(screen.getByRole("button", { name: new RegExp(brand) }));
    const pressed = screen.getAllByRole("button").filter((b) => b.getAttribute("aria-pressed") === "true");
    expect(pressed).toHaveLength(1);
    expect(pressed[0]).toHaveTextContent(brand);
    expect(pressed[0]).toHaveClass("bg-surface-campaign-chip-active");
    items().forEach((li) => expect(li).toHaveTextContent(brand));
    expect(location.href).toBe(href);

    fireEvent.click(screen.getByRole("button", { name: /전체/ }));
    expect(items()).toHaveLength(exhibition.products.length);
    expect(screen.getByRole("button", { name: /전체/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("선택 칩을 다시 눌러도 해제되지 않는다(원본)", () => {
    renderProducts();
    const chip = screen.getByRole("button", { name: new RegExp(exhibition.brands[0]) });

    fireEvent.click(chip);
    fireEvent.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "true");
  });
});
