import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { brandCategories, filterBrandsByGender, notableBrands } from "@/data/brands";
import { NotableBrandsSection } from "./NotableBrandsSection";

let query = "";
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(query) }));

describe("NotableBrandsSection", () => {
  afterEach(() => {
    cleanup();
    query = "";
  });

  it("제목 h2 와 브랜드 24개 이상, 항목은 원형 로고 → (있으면) 배지 → 이름(line-clamp-2) 순서", () => {
    render(<NotableBrandsSection />);

    expect(screen.getByRole("heading", { level: 2, name: "주목할 만한 브랜드" })).toBeInTheDocument();
    const list = screen.getByRole("list");
    expect(list).toHaveClass("grid-rows-6", "grid-flow-col", "overflow-x-auto");
    const items = within(list).getAllByRole("listitem");
    expect(items.length).toBeGreaterThanOrEqual(24);
    expect(items).toHaveLength(120);

    items.forEach((li, i) => {
      const brand = notableBrands[i];
      const logo = li.querySelector(".rounded-full")!;
      const name = li.querySelector(".line-clamp-2")!;
      expect(logo).toHaveTextContent(brand.name.charAt(0));
      expect(name).toHaveTextContent(brand.name);
      expect(logo.compareDocumentPosition(name) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      const badge = within(li).queryByText(brand.badge ?? "없음");
      if (brand.badge) {
        expect(badge).toHaveClass("text-caption");
        expect(logo.compareDocumentPosition(badge!) & Node.DOCUMENT_POSITION_FOLLOWING || logo.contains(badge)).toBeTruthy();
        expect(badge!.compareDocumentPosition(name) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      } else {
        expect(badge).toBeNull();
      }
    });
  });

  it("브랜드 링크는 새 탭 /products", () => {
    render(<NotableBrandsSection />);

    within(screen.getByRole("list"))
      .getAllByRole("link")
      .forEach((a) => {
        expect(a).toHaveAttribute("href", "/products");
        expect(a).toHaveAttribute("target", "_blank");
        expect(a).toHaveAttribute("rel", "noopener noreferrer");
      });
  });

  it("칩(#27): 전체 + 카테고리 12개, 첫 진입 '전체' 선택, 선택 칩만 border-line-strong·semibold·aria-pressed", () => {
    render(<NotableBrandsSection />);

    const chips = within(screen.getByRole("group", { name: "브랜드 카테고리" })).getAllByRole("button");
    expect(chips.map((c) => c.textContent)).toEqual(["전체", ...brandCategories]);
    chips.forEach((c, i) => {
      expect(c).toHaveAttribute("type", "button");
      expect(c).toHaveAttribute("aria-pressed", String(i === 0));
      expect(c).toHaveClass(i === 0 ? "border-line-strong" : "border-line");
    });
    expect(chips[0]).toHaveClass("font-semibold");
  });

  it("칩을 누르면 URL 그대로 그 카테고리 브랜드만, 가로 스크롤은 처음으로, '전체'로 복귀", () => {
    render(<NotableBrandsSection />);
    const href = location.href;
    screen.getByRole("list").scrollLeft = 300;

    fireEvent.click(screen.getByRole("button", { name: "뷰티" }));
    const list = screen.getByRole("list");
    const names = within(list).getAllByRole("listitem").map((li) => li.querySelector(".line-clamp-2")!.textContent);
    expect(names).toEqual(notableBrands.filter((b) => b.category === "뷰티").map((b) => b.name));
    expect(list.scrollLeft).toBe(0);
    expect(location.href).toBe(href);
    expect(screen.getByRole("button", { name: "뷰티" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "전체" }));
    expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(notableBrands.length);
  });

  it("gf(#29): ?gf=F 면 여성+공용 브랜드만, 잘못된 값이면 전체", () => {
    query = "gf=F";
    render(<NotableBrandsSection />);
    expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(filterBrandsByGender(notableBrands, "F").length);
    cleanup();

    query = "gf=X";
    render(<NotableBrandsSection />);
    expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(notableBrands.length);
  });
});
