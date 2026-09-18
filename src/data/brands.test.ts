import { describe, expect, it } from "vitest";
import { filterBrandsByCategory, filterBrandsByGender, notableBrands, parseGf } from "./brands";

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

describe("parseGf", () => {
  it("M·F 는 그대로, 없음·알 수 없는 값은 A", () => {
    expect(parseGf("M")).toBe("M");
    expect(parseGf("F")).toBe("F");
    expect(parseGf("A")).toBe("A");
    expect(parseGf(null)).toBe("A");
    expect(parseGf(undefined)).toBe("A");
    expect(parseGf("X")).toBe("A");
  });
});

describe("filterBrandsByGender", () => {
  it("A 는 전체, M·F 는 그 성별 + 공용만", () => {
    expect(filterBrandsByGender(notableBrands, "A")).toBe(notableBrands);
    const men = filterBrandsByGender(notableBrands, "M");
    expect(men.length).toBeLessThan(notableBrands.length);
    expect(men.every((b) => b.gender === "M" || b.gender === "U")).toBe(true);
    expect(filterBrandsByGender(notableBrands, "F").some((b) => b.gender === "M")).toBe(false);
  });
});
