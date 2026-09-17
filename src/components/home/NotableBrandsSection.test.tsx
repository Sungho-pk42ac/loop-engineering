import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { brandCategories, notableBrands } from "@/data/brands";
import { NotableBrandsSection } from "./NotableBrandsSection";

describe("NotableBrandsSection", () => {
  afterEach(cleanup);

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

  it("호버 이전·다음 버튼(#28): 넘치지 않으면 없음, 처음엔 '다음'만·누르면 3열(204)씩, 끝엔 '이전'만", () => {
    render(<NotableBrandsSection />);
    const list = screen.getByRole("list");
    expect(screen.queryByRole("button", { name: /브랜드 보기/ })).toBeNull();

    const scrollTo = (left: number) => {
      Object.defineProperty(list, "clientWidth", { configurable: true, value: 1024 });
      Object.defineProperty(list, "scrollWidth", { configurable: true, value: 1380 });
      Object.defineProperty(list, "scrollLeft", { configurable: true, value: left, writable: true });
      fireEvent.scroll(list);
    };
    scrollTo(0);
    expect(screen.queryByRole("button", { name: "이전 브랜드 보기" })).toBeNull();
    const scrollBy = vi.fn();
    list.scrollBy = scrollBy;
    fireEvent.click(screen.getByRole("button", { name: "다음 브랜드 보기" }));
    expect(scrollBy).toHaveBeenCalledWith(expect.objectContaining({ left: 204 }));

    scrollTo(356);
    expect(screen.getByRole("button", { name: "이전 브랜드 보기" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "다음 브랜드 보기" })).toBeNull();
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
});
