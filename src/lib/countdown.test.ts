import { describe, expect, it } from "vitest";
import { formatCountdown } from "./countdown";

const s = 1000;
const m = 60 * s;
const h = 60 * m;
const d = 24 * h;

describe("formatCountdown", () => {
  it("일·시·분·초를 `종료까지 N일 HH:MM:SS 남음` 으로 만든다(2자리 0 채움)", () => {
    expect(formatCountdown(1 * d + 2 * h + 3 * m + 4 * s)).toBe("종료까지 1일 02:03:04 남음");
    expect(formatCountdown(12 * d + 23 * h + 59 * m + 59 * s)).toBe("종료까지 12일 23:59:59 남음");
  });

  it("하루 미만은 0일, 1초 미만 자투리는 버린다", () => {
    expect(formatCountdown(59 * s + 999)).toBe("종료까지 0일 00:00:59 남음");
  });

  it("0 이하이면 `기획전 종료`", () => {
    expect(formatCountdown(0)).toBe("기획전 종료");
    expect(formatCountdown(-5 * s)).toBe("기획전 종료");
    expect(formatCountdown(999)).toBe("종료까지 0일 00:00:00 남음");
  });
});
