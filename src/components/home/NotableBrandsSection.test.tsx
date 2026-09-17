import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { notableBrands } from "@/data/brands";
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
});
