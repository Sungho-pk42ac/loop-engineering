import { describe, expect, it } from "vitest";
import { getActiveIndex } from "./scrollSpy";

const tops = [0, 200, 500, 900];

describe("getActiveIndex", () => {
  it("맨 위는 첫 구역", () => {
    expect(getActiveIndex(tops, 0)).toBe(0);
    expect(getActiveIndex(tops, 198)).toBe(0);
  });

  it("구역 경계에 닿으면 그 구역(1px 여유)", () => {
    expect(getActiveIndex(tops, 200)).toBe(1);
    expect(getActiveIndex(tops, 499)).toBe(2);
  });

  it("맨 아래는 마지막 구역", () => {
    expect(getActiveIndex(tops, 5000)).toBe(3);
  });
});
