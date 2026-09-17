import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { exhibition } from "@/data/exhibition";
import { formatPrice } from "@/lib/format";
import { ExhibitionSection } from "./ExhibitionSection";

describe("ExhibitionSection", () => {
  afterEach(cleanup);

  it("캠페인 배경 섹션에 제목 배너가 새 탭 /products 링크다", () => {
    render(<ExhibitionSection />);

    const section = screen.getByRole("region", { name: "기획전" });
    expect(section).toHaveClass("bg-surface-campaign");
    const banner = within(section).getByRole("link", { name: new RegExp(exhibition.title) });
    expect(banner).toHaveAttribute("href", "/products");
    expect(banner).toHaveAttribute("target", "_blank");
    expect(banner).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("제목 배너는 전폭 112 띠 + 가운데 600×112 제목 자리 + 상단 +80 한 줄 띠(#178)", () => {
    render(<ExhibitionSection />);

    const banner = screen.getByRole("link", { name: new RegExp(exhibition.title) });
    expect(banner).toHaveClass("relative", "block", "h-28", "overflow-hidden", "bg-surface-campaign");
    expect(banner).not.toHaveClass("max-w-150");
    const titleBox = screen.getByText(exhibition.title).parentElement!;
    expect(titleBox).toHaveClass("absolute", "left-1/2", "-ml-75", "h-28", "w-150");
    const line = within(banner).getAllByText(exhibition.subtitle)[0].closest(".overflow-hidden.whitespace-nowrap")!;
    expect(line).toHaveClass("w-full");
    expect(line.parentElement).toHaveClass("mx-auto", "max-w-150", "px-4", "pb-3");
    expect(line.parentElement!.parentElement).toHaveClass("absolute", "inset-x-0", "top-20", "h-8");
  });

  it("상품 그리드는 next/image + alt 상품명, 가격은 formatPrice", () => {
    render(<ExhibitionSection />);

    const items = within(screen.getByRole("list")).getAllByRole("article");
    expect(items).toHaveLength(exhibition.products.length);
    exhibition.products.forEach((product) => {
      expect(screen.getByRole("img", { name: product.name })).toBeInTheDocument();
      expect(screen.getAllByText(formatPrice(product.price)).length).toBeGreaterThan(0);
    });
  });

  it("맨 아래 '관련 세일 상품 더보기' 버튼이 새 탭 /products", () => {
    render(<ExhibitionSection />);

    const more = screen.getByRole("link", { name: exhibition.moreLabel });
    expect(more).toHaveAttribute("href", "/products");
    expect(more).toHaveAttribute("target", "_blank");
    expect(more).toHaveAttribute("rel", "noopener noreferrer");
  });
});
