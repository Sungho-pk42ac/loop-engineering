import { describe, expect, it } from "vitest";
import { nextScrollLeft, pageStep, prevScrollLeft } from "./carousel";

describe("nextScrollLeft", () => {
  it("한 화면씩 넘긴다", () => {
    expect(nextScrollLeft(0, 1440, 4320)).toBe(1440);
  });

  it("남은 거리가 한 화면보다 짧으면 끝에서 멈춘다", () => {
    expect(nextScrollLeft(1440, 1440, 2000)).toBe(2000);
  });

  it("마지막 화면이면 처음(0)으로 돌아간다", () => {
    expect(nextScrollLeft(1440, 1440, 1440)).toBe(0);
    expect(nextScrollLeft(1439.5, 1440, 1440)).toBe(0);
  });
});

describe("pageStep", () => {
  it("화면에 온전히 들어가는 슬라이드 수만큼 넘긴다", () => {
    expect(pageStep(1440, 480)).toBe(1440);
    expect(pageStep(1000, 480)).toBe(960);
  });

  it("슬라이드가 화면보다 넓거나 1장만 들어가면 1장씩", () => {
    expect(pageStep(375, 248)).toBe(248);
    expect(pageStep(200, 248)).toBe(248);
  });
});

describe("prevScrollLeft", () => {
  it("한 화면씩 뒤로 간다", () => {
    expect(prevScrollLeft(2880, 1440, 4320)).toBe(1440);
  });

  it("남은 거리가 한 화면보다 짧으면 처음에서 멈춘다", () => {
    expect(prevScrollLeft(560, 1440, 2000)).toBe(0);
  });

  it("첫 화면이면 마지막 화면으로 간다", () => {
    expect(prevScrollLeft(0, 1440, 1440)).toBe(1440);
    expect(prevScrollLeft(0.5, 1440, 1440)).toBe(1440);
  });
});
