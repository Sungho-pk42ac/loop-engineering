"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

export const BUBBLE_ANIMATED_KEY = "storeBubbleAnimated";
// 진입: 작게 → 원래 크기. @starting-style(starting:) 이라 새로 삽입될 때만 동작. 250ms = duration-base.
export const BUBBLE_ENTER_CLASS =
  "motion-safe:transition-transform motion-safe:duration-250 motion-safe:ease-out motion-safe:starting:scale-75";

type Mode = "animate" | "static";

function readMode(): Mode {
  try {
    return window.sessionStorage.getItem(BUBBLE_ANIMATED_KEY) === null ? "animate" : "static";
  } catch {
    return "static";
  }
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
