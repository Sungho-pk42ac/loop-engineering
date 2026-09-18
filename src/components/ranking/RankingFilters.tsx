"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { rankingChips, rankingDropdowns, rankingTabs, pickValue } from "@/data/ranking";
import { Icon, ICON_PATHS } from "../Icon";

const container = "mx-auto max-w-page px-4 md:px-6";

// 랭킹 필터(#128): ① 칩 줄 ② 텍스트 탭 줄(둘은 헤더 아래 sticky) ③ 정렬 줄(흘러감).
// 선택 상태는 URL 쿼리 — 클릭하면 그 쿼리만 교체(router.replace, 다른 쿼리 유지), 기본값이면 쿼리를 뺀다.
// sticky top = 우리 헤더 높이(데스크톱 152 · 모바일 192). ponytail: 헤더 높이가 바뀌면 같이 고친다.
export function RankingFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openParam, setOpenParam] = useState<string | null>(null);

  function setParam(param: string, value: string, defaultValue: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === defaultValue) next.delete(param);
    else next.set(param, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const sectionId = pickValue(
    searchParams.get("sectionId"),
    rankingChips.map((c) => c.sectionId),
    rankingChips[0].sectionId,
  );
  const categoryCode = pickValue(
    searchParams.get("categoryCode"),
    rankingTabs.map((t) => t.categoryCode),
    rankingTabs[0].categoryCode,
  );

  return (
    <>
      <div className="sticky top-48 z-sticky bg-surface pt-3 md:top-38">
        <div className={`${container} flex h-8 gap-1 overflow-x-auto`} role="group" aria-label="랭킹 구분">
          {rankingChips.map((chip) => {
            const selected = chip.sectionId === sectionId;
            return (
              <button
                key={chip.sectionId}
                type="button"
                aria-pressed={selected}
                onClick={() => setParam("sectionId", chip.sectionId, rankingChips[0].sectionId)}
                className={`flex h-8 shrink-0 items-center gap-1 rounded-sm border px-2 text-label whitespace-nowrap ${
                  selected ? "border-line-strong bg-surface font-semibold text-ink" : "border-line-muted text-ink-muted"
                }`}
              >
                {chip.icon && <Icon d={chip.icon} size={16} />}
                {chip.label}
              </button>
            );
          })}
        </div>
        <div className="mt-2 h-10 bg-surface-subtle">
          <nav aria-label="랭킹 카테고리" className={`${container} flex h-full items-center overflow-x-auto`}>
            {rankingTabs.map((tab) => {
              const selected = tab.categoryCode === categoryCode;
              return (
                <button
                  key={tab.categoryCode}
                  type="button"
                  aria-current={selected ? "true" : undefined}
                  onClick={() => setParam("categoryCode", tab.categoryCode, rankingTabs[0].categoryCode)}
                  className={`shrink-0 px-2 text-label whitespace-nowrap first:pl-0 ${
                    selected ? "font-semibold text-ink" : "text-ink-muted"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className={`${container} flex items-center justify-between gap-4 py-3`}>
        <div className="flex items-center gap-1 text-label text-ink-muted">
          10분 전
          <button type="button" aria-label="랭킹 안내" className="flex text-icon-muted">
            <Icon d={ICON_PATHS.info} size={16} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {rankingDropdowns.map(({ param, defaultValue, options }) => {
            const value = pickValue(
              searchParams.get(param),
              options.map((o) => o.value),
              defaultValue,
            );
            const current = options.find((o) => o.value === value) ?? options[0];
            const open = openParam === param;
            return (
              <div key={param} className="relative">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={open}
                  onClick={() => setOpenParam(open ? null : param)}
                  className="flex items-center gap-1 text-label whitespace-nowrap text-ink-muted"
                >
                  {current.label}
                  <span className={open ? "rotate-180" : undefined}>
                    <Icon d={ICON_PATHS.chevronDown} size={12} />
                  </span>
                </button>
                {open && (
                  <ul
                    role="menu"
                    aria-label={current.label}
                    className="absolute top-full right-0 z-dropdown min-w-16 rounded-sm border border-line bg-surface py-1"
                  >
                    {options.map((option) => (
                      <li key={option.value} role="none">
                        <button
                          type="button"
                          role="menuitemradio"
                          aria-checked={option.value === value}
                          onClick={() => {
                            setOpenParam(null);
                            setParam(param, option.value, defaultValue);
                          }}
                          className={`flex h-8 w-full items-center px-3 text-left text-label whitespace-nowrap ${
                            option.value === value ? "text-ink" : "text-ink-muted"
                          }`}
                        >
                          {option.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
