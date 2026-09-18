import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { sportsPicks } from "@/data/sportsPicks";
import { SportsPicksSection } from "./SportsPicks";

let query = "";
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(query) }));

describe("SportsPicks", () => {
  afterEach(() => {
    cleanup();
    query = "";
  });

  it("두 줄 제목과 더보기(현재 gf·새 탭), 상품 30개가 2줄 열로", () => {
    query = "gf=M";
    render(<SportsPicksSection />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent(sportsPicks.titleLine);
    expect(heading).toHaveTextContent(sportsPicks.keyword);
    const more = screen.getByRole("link", { name: sportsPicks.moreLabel });
    expect(more).toHaveAttribute("href", "/products?gf=M");
    expect(more).toHaveAttribute("target", "_blank");
    expect(more).toHaveAttribute("rel", "noopener noreferrer");

    const columns = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(columns).toHaveLength(sportsPicks.products.length / 2);
    columns.forEach((li) => expect(within(li).getAllByRole("article")).toHaveLength(2));
  });

  it("gf 가 없으면 더보기는 gf=A", () => {
    render(<SportsPicksSection />);
    expect(screen.getByRole("link", { name: sportsPicks.moreLabel })).toHaveAttribute("href", "/products?gf=A");
  });

  it("카드 이미지·상품명은 상세(/products/1~6) 새 탭, 브랜드는 /products, 가격은 formatPrice", () => {
    render(<SportsPicksSection />);

    const first = within(screen.getByRole("list")).getAllByRole("article")[0];
    const links = within(first).getAllByRole("link");
    links.forEach((a) => {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", "noopener noreferrer");
    });
    expect(links[0]).toHaveAttribute("href", "/products/1");
    expect(links.filter((a) => a.getAttribute("href") === "/products")).toHaveLength(1);
    expect(within(first).getByRole("img")).toHaveAttribute("alt", sportsPicks.products[0].name);
    expect(first).toHaveTextContent("12,000원");
  });

  it("모바일 카드 폭(#33): 열은 w-34(136 ≈ 원본 134)·md 이상은 w-65, 2줄 구조 유지", () => {
    render(<SportsPicksSection />);

    within(screen.getByRole("list"))
      .getAllByRole("listitem")
      .forEach((li) => {
        expect(li).toHaveClass("w-34", "md:w-65", "grid", "auto-rows-fr");
        expect(within(li).getAllByRole("article")).toHaveLength(2);
      });
  });

  it("호버 이전·다음 버튼(#32): 공용 ScrollRow — 처음엔 '다음'만, 누르면 열 단위 이동, 끝엔 '이전'만", () => {
    render(<SportsPicksSection />);
    const list = screen.getByRole("list");
    expect(screen.queryByRole("button", { name: /상품 보기/ })).toBeNull();

    const scrollTo = (left: number) => {
      Object.defineProperty(list, "clientWidth", { configurable: true, value: 1280 });
      Object.defineProperty(list, "scrollWidth", { configurable: true, value: 3932 });
      Object.defineProperty(list, "scrollLeft", { configurable: true, value: left, writable: true });
      fireEvent.scroll(list);
    };
    scrollTo(0);
    expect(screen.queryByRole("button", { name: "이전 상품 보기" })).toBeNull();
    const scrollBy = vi.fn();
    list.scrollBy = scrollBy;
    fireEvent.click(screen.getByRole("button", { name: "다음 상품 보기" }));
    expect(scrollBy).toHaveBeenCalledWith(expect.objectContaining({ behavior: "smooth" }));

    scrollTo(1000);
    expect(screen.getByRole("button", { name: "이전 상품 보기" })).toBeInTheDocument();
    scrollTo(2652);
    expect(screen.getByRole("button", { name: "이전 상품 보기" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "다음 상품 보기" })).toBeNull();
  });
});
