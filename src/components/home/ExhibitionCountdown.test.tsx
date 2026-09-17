import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { ExhibitionCountdown, SWAP_SECONDS } from "./ExhibitionCountdown";

// 종료까지 1일 02:03:04 남은 시각(카운트다운이 보이는 4초 구간의 시작 초)
const endsAt = "2026-09-30T00:00:00Z";
const start = new Date(endsAt).getTime() - (1 * 86400 + 2 * 3600 + 3 * 60 + 4) * 1000;

describe("ExhibitionCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(start - (start % (SWAP_SECONDS * 2000)));
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("1초마다 남은 시간이 줄고, 언마운트하면 타이머를 해제한다", () => {
    const { unmount } = render(<ExhibitionCountdown endsAt={endsAt} subtitle="혜택 문구" />);
    const first = screen.getByText(/^종료까지 \d+일 \d{2}:\d{2}:\d{2} 남음$/).textContent;

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    const second = screen.getByText(/^종료까지 /).textContent;
    expect(second).not.toBe(first);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("카운트다운과 혜택 문구가 4초마다 교대로 보인다", () => {
    render(<ExhibitionCountdown endsAt={endsAt} subtitle="혜택 문구" />);
    const countdown = () => screen.getByText(/^종료까지 /);
    const subtitle = () => screen.getByText("혜택 문구");

    expect(countdown()).toHaveClass("opacity-80");
    expect(subtitle()).toHaveClass("opacity-0");

    act(() => {
      vi.advanceTimersByTime(SWAP_SECONDS * 1000);
    });
    expect(countdown()).toHaveClass("opacity-0");
    expect(subtitle()).toHaveClass("opacity-80");
  });
});
