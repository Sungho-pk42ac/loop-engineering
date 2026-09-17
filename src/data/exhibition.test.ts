import { describe, expect, it } from "vitest";
import { exhibition, filterByBrand } from "./exhibition";

describe("filterByBrand", () => {
  it("null('전체')이면 전체 상품", () => {
    expect(filterByBrand(exhibition.products, null)).toHaveLength(exhibition.products.length);
  });

  it("브랜드를 주면 그 브랜드 상품만", () => {
    const brand = exhibition.brands[3];
    const result = filterByBrand(exhibition.products, brand);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.brand === brand)).toBe(true);
  });

  it("없는 브랜드면 빈 배열", () => {
    expect(filterByBrand(exhibition.products, "없는 브랜드")).toEqual([]);
  });
});
