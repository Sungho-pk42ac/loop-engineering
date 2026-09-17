import { describe, expect, it } from "vitest";
import { filterBrandsByCategory, notableBrands } from "./brands";

describe("filterBrandsByCategory", () => {
  it("null(전체)이면 전체 목록 그대로", () => {
    expect(filterBrandsByCategory(notableBrands, null)).toBe(notableBrands);
  });

  it("카테고리를 주면 그 카테고리 브랜드만, 순서 유지", () => {
    const beauty = filterBrandsByCategory(notableBrands, "뷰티");
    expect(beauty.length).toBeGreaterThan(0);
    expect(beauty.every((b) => b.category === "뷰티")).toBe(true);
    expect(beauty).toEqual(notableBrands.filter((b) => b.category === "뷰티"));
  });
});
