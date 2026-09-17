import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { exhibition } from "@/data/exhibition";
import { ExhibitionProducts } from "./ExhibitionProducts";

// jsdom 에는 요소 scrollTo 가 없다(칩 자동 스크롤 #184).
Element.prototype.scrollTo ??= () => {};

const renderProducts = () => render(<ExhibitionProducts brands={exhibition.brands} products={exhibition.products} />);
const items = () => within(screen.getByRole("list")).getAllByRole("article");

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
    const pressed = within(screen.getByRole("group", { name: "브랜드 필터" }))
      .getAllByRole("button")
      .filter((b) => b.getAttribute("aria-pressed") === "true");
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

  it("칩을 누르면 칩 상자만 선택 칩 중심이 가운데로 오게 부드럽게 스크롤(#184)", () => {
    renderProducts();
    const group = screen.getByRole("group", { name: "브랜드 필터" });
    const chip = screen.getByRole("button", { name: new RegExp(exhibition.brands[10]) });
    const scrollTo = vi.fn();
    group.scrollTo = scrollTo;
    Object.defineProperty(group, "clientWidth", { value: 375 });
    group.scrollLeft = 40;
    group.getBoundingClientRect = () => DOMRect.fromRect({ x: 0, width: 375 });
    chip.getBoundingClientRect = () => DOMRect.fromRect({ x: 600, width: 80 });

    fireEvent.click(chip);
    expect(scrollTo).toHaveBeenCalledWith({ left: 40 + 600 + 40 - 187.5, behavior: "smooth" });
  });

  it("줄임 모션 설정이면 칩 상자 스크롤은 즉시 이동", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    renderProducts();
    const group = screen.getByRole("group", { name: "브랜드 필터" });
    const scrollTo = vi.fn();
    group.scrollTo = scrollTo;

    fireEvent.click(screen.getByRole("button", { name: new RegExp(exhibition.brands[3]) }));
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "auto" }));
    vi.unstubAllGlobals();
  });

  it("상품이 많으면 열마다 위아래 2칸(열 우선), 적으면 1칸 — 가로 스크롤 캐러셀", () => {
    renderProducts();
    const list = screen.getByRole("list");
    expect(list).toHaveClass("overflow-x-auto");
    const columns = within(list).getAllByRole("listitem");
    expect(columns).toHaveLength(Math.ceil(exhibition.products.length / 2));
    expect(within(columns[0]).getAllByRole("article").map((a) => a.textContent)).toEqual(
      exhibition.products.slice(0, 2).map((p) => expect.stringContaining(p.name)),
    );

    fireEvent.click(screen.getByRole("button", { name: new RegExp(exhibition.brands[0]) }));
    within(screen.getByRole("list"))
      .getAllByRole("listitem")
      .forEach((column) => expect(within(column).getAllByRole("article")).toHaveLength(1));
  });
});
