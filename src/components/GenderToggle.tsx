"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseGf, type Gf } from "@/data/brands";

const OPTIONS: { label: string; value: Gf }[] = [
  { label: "전체", value: "A" },
  { label: "남성", value: "M" },
  { label: "여성", value: "F" },
];

const CURSOR_X: Record<Gf, string> = { A: "translate-x-0", M: "translate-x-11", F: "translate-x-22" };

// 하단 가운데 고정 성별 토글(#29). 원본 실측: 144×44 흰 알약(그림자·테두리 없음), 칸 3개 12px(기본 500·선택 600 흰 글자),
// 선택 배경은 버튼이 아니라 뒤에 깔린 검정 커서가 옆으로 미끄러진다(약 290ms 감속).
// 4px 배수로 칸 46 → 44·안쪽 여백 3 → 4(알약 140), 커서 높이 38 → 36, 이동 290ms → duration-base.
// 원본은 누르면 전체 새로고침·스크롤 맨 위지만, 이슈 사양대로 쿼리만 바꾸고 스크롤을 유지한다.
// 실측(222): 배경 흰색 92% → surface-floating(흰 90%, 다크 검정 90%), 모바일은 하단 탭바(#139 h-14) 위 12px = bottom-17, 768 이상은 원본과 같은 12.
export function GenderToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gf = parseGf(searchParams.get("gf"));

  function select(value: Gf) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("gf", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div role="group" aria-label="성별" className="fixed bottom-17 left-1/2 z-sticky flex h-11 w-35 -translate-x-1/2 rounded-full bg-surface-floating px-1 md:bottom-3">
      <span
        aria-hidden="true"
        className={`absolute top-1 left-1 h-9 w-11 rounded-full bg-surface-inverse transition-transform duration-base ease-out motion-reduce:transition-none ${CURSOR_X[gf]}`}
      />
      {OPTIONS.map(({ label, value }) => {
        const active = value === gf;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            onClick={() => select(value)}
            className={`relative w-11 rounded-full text-detail transition-colors motion-reduce:transition-none ${active ? "font-semibold text-ink-inverse" : "font-medium text-ink"}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
