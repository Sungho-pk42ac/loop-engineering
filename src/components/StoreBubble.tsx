"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

export const BUBBLE_ANIMATED_KEY = "storeBubbleAnimated";
// 진입: 작게 → 원래 크기. @starting-style(starting:) 이라 새로 삽입될 때만 동작. 250ms = duration-base.
export const BUBBLE_ENTER_CLASS =
  "motion-safe:transition-transform motion-safe:duration-250 motion-safe:ease-out motion-safe:starting:scale-75";

type Mode = "animate" | "static";

// 페이지 로드당 한 번만 읽는다. 헤더에 말풍선이 두 자리(데스크톱 스토어 바·모바일 로고 줄)라,
// 한쪽이 키를 먼저 저장해도 다른 쪽이 같은 모드(첫 방문이면 둘 다 애니메이션)를 보게 한다(#134).
let cachedMode: Mode | undefined;

function readMode(): Mode {
  if (cachedMode) return cachedMode;
  try {
    cachedMode = window.sessionStorage.getItem(BUBBLE_ANIMATED_KEY) === null ? "animate" : "static";
  } catch {
    cachedMode = "static";
  }
  return cachedMode;
}

/** 테스트 전용: 페이지 새로 로드한 것처럼 캐시를 비운다 */
export function resetBubbleModeCache() {
  cachedMode = undefined;
}

const noopSubscribe = () => () => {};

// 팬스토어 안내 말풍선. 누르면 닫히고, 닫힘은 저장하지 않는다(새로고침하면 다시 뜸 — 원본 동작).
export function StoreBubble() {
  const [open, setOpen] = useState(true);
  // 서버에서는 그리지 않는다 — sessionStorage 에 따라 클래스가 달라져 하이드레이션이 어긋나지 않게.
  const mode = useSyncExternalStore<Mode | null>(noopSubscribe, readMode, () => null);

  useEffect(() => {
    if (mode !== "animate") return;
    try {
      window.sessionStorage.setItem(BUBBLE_ANIMATED_KEY, "1");
    } catch {
      // 저장 불가(프라이빗 모드 등)면 다음에도 애니메이션 — 무해
    }
  }, [mode]);

  if (!open || !mode) return null;

  return (
    <button
      type="button"
      onClick={() => setOpen(false)}
      className={`absolute left-0 top-full z-dropdown mt-2 origin-top-left rounded-md bg-accent px-3 py-2 text-left text-detail whitespace-nowrap text-ink-inverse dark:text-ink ${
        mode === "animate" ? BUBBLE_ENTER_CLASS : ""
      }`}
    >
      <span aria-hidden="true" className="absolute -top-1 left-3 size-2 rotate-45 bg-accent" />
      <span className="relative block">패캠 팬스토어 굿즈를 만나보세요</span>
      <span className="relative block">지금 확인해 보세요</span>
    </button>
  );
}
