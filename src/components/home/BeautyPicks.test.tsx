import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { beautyPicks } from "@/data/beautyPicks";
import { BeautyPicksSection } from "./BeautyPicks";

let query = "";
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(query) }));

describe("BeautyPicks", () => {
  afterEach(() => {
    cleanup();
    query = "";
  });

  it("두 줄 제목·더보기(현재 gf·새 탭)와 상품 10개 5열×2줄 그리드(캐러셀 버튼 없음)", () => {
    query = "gf=F";
    render(<BeautyPicksSection />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent(beautyPicks.titleLine);
    expect(heading).toHaveTextContent(beautyPicks.keyword);
    const more = screen.getByRole("link", { name: beautyPicks.moreLabel });
    expect(more).toHaveAttribute("href", "/products?gf=F&sort=popular");
    expect(more).toHaveAttribute("target", "_blank");
    expect(more).toHaveAttribute("rel", "noopener noreferrer");

    const list = screen.getByRole("list");
    expect(list).toHaveClass("grid-rows-2", "md:grid-cols-5", "overflow-x-auto");
    // 고정 그리드라 캐러셀 예외가 아니라 공통 컨테이너 규칙을 따른다(1200 안, 데스크톱 좌우 24)
    expect(list).toHaveClass("mx-auto", "max-w-page", "px-4", "md:px-6");
    expect(within(list).getAllByRole("listitem")).toHaveLength(10);
    expect(screen.queryByRole("button", { name: /보기/ })).toBeNull();
  });

  it("옵션비 별도는 데이터가 켜진 카드에만, 링크는 새 탭 상세·브랜드", () => {
    render(<BeautyPicksSection />);

    const cards = within(screen.getByRole("list")).getAllByRole("article");
    const expected = beautyPicks.products.filter((p) => p.optionExtra).length;
    expect(screen.getAllByText("옵션비 별도")).toHaveLength(expected);
    expect(expected).toBeGreaterThan(0);
    cards.forEach((card, i) => {
      const hasNote = within(card).queryByText("옵션비 별도") !== null;
      expect(hasNote).toBe(Boolean(beautyPicks.products[i].optionExtra));
      within(card)
        .getAllByRole("link")
        .forEach((a) => {
          expect(a).toHaveAttribute("target", "_blank");
          expect(a).toHaveAttribute("rel", "noopener noreferrer");
        });
      expect(within(card).getAllByRole("link")[0]).toHaveAttribute("href", `/products/${(i % 6) + 1}`);
    });
    expect(screen.getAllByRole("img")[0]).toHaveAttribute("alt", beautyPicks.products[0].name);
  });
});
