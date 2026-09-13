import { describe, expect, it } from "vitest";
import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("천 단위 콤마와 원 단위를 붙인다", () => {
    expect(formatPrice(12000)).toBe("12,000원");
    expect(formatPrice(900)).toBe("900원");
    expect(formatPrice(1234567)).toBe("1,234,567원");
  });
});
