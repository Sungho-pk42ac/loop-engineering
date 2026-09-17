"use client";

import { useCallback, useRef, useSyncExternalStore, type ReactNode } from "react";
import { Icon } from "./Icon";

type Edge = "start" | "middle" | "end" | "none";

function edgeOf(el: HTMLElement | null): Edge {
  if (!el || el.scrollWidth - el.clientWidth <= 1) return "none";
  if (el.scrollLeft <= 1) return "start";
  if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) return "end";
  return "middle";
}

// 열 단위(2줄) 캐러셀 공통: 한 번에 "온전히 보이는 열 수 - 1" 만큼 이동해 반쯤 보이던 열을 건너뛰지 않는다(#23·#31).
export function columnStep(el: HTMLElement): number {
  const column = el.firstElementChild?.clientWidth ?? el.clientWidth;
  const fullyVisible = Math.floor((el.clientWidth - 16) / column);
  return Math.max(1, fullyVisible - 1) * column;
}

export interface ScrollRowProps {
  /** 스크롤 컨테이너(ul) 클래스 */
  listClassName: string;
  prevLabel: string;
  nextLabel: string;
  /** 한 번에 이동할 거리(px). 기본은 한 화면(clientWidth) */
  step?: (el: HTMLElement) => number;
  children: ReactNode;
}

// 가로 스크롤 줄 + 호버 이전·다음 원형 버튼(#18, 원본 라이브 편성표 실측).
// 처음에는 '이전', 끝에서는 '다음'을 DOM 에서 뺀다(루프 없음). 누르면 한 화면(clientWidth)씩 부드럽게 이동.
// 버튼은 줄 호버(hover 기기만)·키보드 포커스(has-focus-visible) 때만 보이고, 평소 invisible 이라 터치 기기에서 탭을 가로채지 않는다.
// 키보드로 카드를 다 지나지 않아도 되게 버튼을 목록 앞에 둔다(위치는 absolute).
export function ScrollRow({ listClassName, prevLabel, nextLabel, step, children }: ScrollRowProps) {
  const ref = useRef<HTMLUListElement>(null);

  const subscribe = useCallback((onChange: () => void) => {
    const el = ref.current;
    el?.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    return () => {
      el?.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, []);
  // 서버·하이드레이션은 처음 위치로 그린다('다음'만).
  const edge = useSyncExternalStore(subscribe, () => edgeOf(ref.current), () => "start" as Edge);

  function move(direction: -1 | 1) {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * (step ? step(el) : el.clientWidth), behavior: reduce ? "auto" : "smooth" });
  }

  const buttonClass =
    "invisible absolute top-1/2 z-dropdown flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface text-icon opacity-0 shadow-md transition-all group-has-focus-visible:visible group-has-focus-visible:opacity-100 group-hover:visible group-hover:opacity-100";

  return (
    <div className="group relative">
      {(edge === "middle" || edge === "end") && (
        <button type="button" aria-label={prevLabel} onClick={() => move(-1)} className={`${buttonClass} left-4`}>
          <Icon d="M14 6l-6 6 6 6" size={24} />
        </button>
      )}
      {(edge === "start" || edge === "middle") && (
        <button type="button" aria-label={nextLabel} onClick={() => move(1)} className={`${buttonClass} right-4`}>
          <Icon d="M10 6l6 6-6 6" size={24} />
        </button>
      )}
      <ul ref={ref} className={listClassName}>
        {children}
      </ul>
    </div>
  );
}
