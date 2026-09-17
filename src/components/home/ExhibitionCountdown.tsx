"use client";

import { useSyncExternalStore } from "react";
import { formatCountdown } from "@/lib/countdown";

export const SWAP_SECONDS = 4;

// 1초마다 바뀌는 현재 시각(초). 구독자가 있을 때만 타이머가 돈다.
function subscribeSecond(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}
const getSecond = () => Math.floor(Date.now() / 1000);
// 서버·하이드레이션 첫 렌더는 시간을 모른다고 보고 혜택 문구만 그린다(hydration 불일치 방지).
const getServerSecond = () => null;

// 기획전 배너 하단 줄(#21). 원본 실측: 카운트다운과 혜택 문구가 같은 자리에 겹쳐 4초마다 교차 페이드,
// 13px/400/18 · 투명도 80% · 숫자 고정폭 · 줄바꿈 없음. 페이드는 원본 1s 대신 §7 토큰 250ms.
export function ExhibitionCountdown({ endsAt, subtitle }: { endsAt: string; subtitle: string }) {
  const second = useSyncExternalStore(subscribeSecond, getSecond, getServerSecond);
  const showCountdown = second !== null && Math.floor(second / SWAP_SECONDS) % 2 === 0;
  const remaining = second === null ? 0 : new Date(endsAt).getTime() - second * 1000;

  const line = "col-start-1 row-start-1 whitespace-nowrap transition-opacity duration-250 motion-reduce:transition-none";

  return (
    <span className="grid w-full text-center text-label font-regular">
      <span className={`${line} tabular-nums ${showCountdown ? "opacity-80" : "opacity-0"}`}>
        {second === null ? "" : formatCountdown(remaining)}
      </span>
      <span className={`${line} truncate ${showCountdown ? "opacity-0" : "opacity-80"}`}>{subtitle}</span>
    </span>
  );
}
