import { describe, expect, it } from "vitest";
import { getActiveIndex, SPY_LEAD } from "./scrollSpy";

const tops = [0, 200, 500, 900];

describe("getActiveIndex", () => {
  it("맨 위는 첫 구역", () => {
    expect(getActiveIndex(tops, 0)).toBe(0);
    expect(getActiveIndex(tops, 200 - SPY_LEAD - 1)).toBe(0);
  });

  it("다음 구역 top 이 52px 앞에 오면 미리 바뀐다 (실측 249)", () => {
    expect(SPY_LEAD).toBe(52);
    expect(getActiveIndex(tops, 200 - SPY_LEAD)).toBe(1);
    expect(getActiveIndex(tops, 500 - SPY_LEAD - 1)).toBe(1);
    expect(getActiveIndex(tops, 500 - SPY_LEAD)).toBe(2);
  });

  // 원본 실측 전환 지점이 566 구역 56px 앞 · 1530 구역 50px 앞으로 서로 달라(이슈 완료 조건 두 개가 상충)
  // 고정값 하나로는 둘 다 못 맞춘다. 52 를 쓰므로 두 샘플 모두 실측에서 6px 안쪽에서 전환한다.
  it("원본 샘플(566·1530 구역)을 실측 범위(50~56) 안에서 전환한다", () => {
    const original = [0, 566, 1530];
    expect(getActiveIndex(original, 566 - SPY_LEAD)).toBe(1);
    expect(getActiveIndex(original, 566 - SPY_LEAD - 1)).toBe(0);
    expect(getActiveIndex(original, 1530 - SPY_LEAD)).toBe(2);
    expect(getActiveIndex(original, 1530 - SPY_LEAD - 1)).toBe(1);
    [56, 50].forEach((measured) => expect(Math.abs(SPY_LEAD - measured)).toBeLessThanOrEqual(6));
  });

  it("클릭 이동(scrollTop = offsetTop) 직후에는 그 구역을 유지한다", () => {
    expect(getActiveIndex(tops, 200)).toBe(1);
    expect(getActiveIndex(tops, 900)).toBe(3);
    // 구역 높이가 앞당김(52)보다 짧아도 클릭한 구역을 건너뛰지 않는다
    const shorts = [0, 40, 80, 400];
    shorts.forEach((top, i) => expect(getActiveIndex(shorts, top)).toBe(i));
  });

  it("맨 아래는 마지막 구역", () => {
    expect(getActiveIndex(tops, 5000)).toBe(3);
  });
});
