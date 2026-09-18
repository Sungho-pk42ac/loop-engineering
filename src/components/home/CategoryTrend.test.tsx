import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { categoryTrend, trendProductsOf } from "@/data/categoryTrend";
import { formatPrice } from "@/lib/format";
import { CategoryTrend } from "./CategoryTrend";

describe("categoryTrend 데이터", () => {
  it("브랜드마다 상품 목록이 따로 있고, 없는 id 는 첫 브랜드로 떨어진다", () => {
    expect(categoryTrend.brands).toHaveLength(10);
    categoryTrend.brands.forEach((brand) => {
      const items = trendProductsOf(brand.id);
      expect(items.length).toBeGreaterThan(0);
      items.forEach((p) => expect(p.brand).toBe(brand.name));
    });
    expect(trendProductsOf("없는브랜드")).toEqual(trendProductsOf(categoryTrend.brands[0].id));
  });
});

describe("CategoryTrend", () => {
  afterEach(cleanup);

  const chips = () => within(screen.getByRole("group", { name: "브랜드" })).getAllByRole("button");

  it("두 줄 제목·더보기(새 탭)와 브랜드 칩 10개, 첫 브랜드가 선택된 1줄 캐러셀", () => {
    render(<CategoryTrend />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent(categoryTrend.titleLine);
    expect(heading).toHaveTextContent(categoryTrend.keyword);

    const first = categoryTrend.brands[0];
    const more = screen.getByRole("link", { name: categoryTrend.moreLabel });
    expect(more).toHaveAttribute("href", `/products?brand=${first.id}`);
    expect(more).toHaveAttribute("target", "_blank");
    expect(more).toHaveAttribute("rel", "noopener noreferrer");

    expect(chips()).toHaveLength(10);
    expect(chips()[0]).toHaveAttribute("aria-pressed", "true");
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(trendProductsOf(first.id).length);
    expect(screen.getAllByText(formatPrice(trendProductsOf(first.id)[0].price)).length).toBeGreaterThan(0);
  });

  it("칩을 누르면 그 칩만 선택되고 목록·더보기 링크가 바뀐다. URL 은 그대로", () => {
    render(<CategoryTrend />);
    const href = location.href;
    const target = categoryTrend.brands[3];

    fireEvent.click(screen.getByRole("button", { name: new RegExp(target.name) }));

    const pressed = chips().filter((b) => b.getAttribute("aria-pressed") === "true");
    expect(pressed).toHaveLength(1);
    expect(pressed[0]).toHaveTextContent(target.name);
    expect(screen.getByRole("link", { name: categoryTrend.moreLabel })).toHaveAttribute("href", `/products?brand=${target.id}`);
    within(screen.getByRole("list"))
      .getAllByRole("article")
      .forEach((card) => expect(card).toHaveTextContent(target.name));
    expect(location.href).toBe(href);
  });
});
