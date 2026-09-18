"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { filterDropdowns, quickFilters, searchGoodsItems } from "@/data/search";
import { AppliedFilters, countFilters } from "./AppliedFilters";
import { filterSearchGoods, FILTER_KEYS } from "@/lib/searchGoods";
import { Icon } from "../Icon";
import { SearchFilterLayer } from "./SearchFilterLayer";

const CHEVRON = "M6 9l6 6 6-6";
const SLIDERS = "M4 6h16M4 12h16M4 18h16M9 4v4M15 10v4M7 16v4";
const QUICK_ICON: Record<string, string> = {
  할인: "M6 18L18 6M7.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM16.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  별점: "M12 4l2.4 5 5.6.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.6-.8z",
  무료배송: "M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
};

const chipBase = "flex h-8 shrink-0 items-center gap-1 rounded-sm border px-1 text-label whitespace-nowrap";
const chipOff = "border-line font-regular text-ink-muted";

// 검색 결과 필터 줄(#110). 원본 실측: 빠른 필터 칩 줄(30px 칩, 선택 시 파랑 글자·테두리·5% 배경) → 회색 띠에 상세필터·남/여·드롭다운 칩,
// 필터가 하나라도 있으면 그 아래 적용 필터 줄(항목 ×, 오른쪽 초기화). 상태는 URL 쿼리가 SSOT — keyword·keywordType·sortCode 는 항상 유지한다.
export function SearchFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [layerTab, setLayerTab] = useState<number | null>(null);

  const gf = searchParams.get("gf") ?? "A";
  const filterCount = countFilters(searchParams);
  const resultCount = filterSearchGoods(searchGoodsItems, searchParams).length;

  function apply(change: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    change(params);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  // 별점은 값이 여러 개(빠른 칩 4.5 · 레이어 라디오 4 등)라 키 존재로 켜짐을 판정한다(AppliedFilters·countFilters 와 같은 기준, #112 QA).
  const quickOn = (key: string, value: string) =>
    key === "minReviewGrade" ? searchParams.get(key) !== null : searchParams.get(key) === value;

  const toggleQuick = (key: string, value: string) =>
    apply((params) => (quickOn(key, value) ? params.delete(key) : params.set(key, value)));

  const toggleGender = (value: "M" | "F") => apply((params) => params.set("gf", gf === value ? "A" : value));

  const reset = () =>
    apply((params) => {
      FILTER_KEYS.forEach((key) => params.delete(key));
      params.set("gf", "A");
    });

  return (
    <div>
      <div role="group" aria-label="빠른 필터" className="scrollbar-none flex gap-1 overflow-x-auto px-4 pt-3">
        {quickFilters.map(({ label, key, value }) => {
          const on = quickOn(key, value);
          return (
            <button
              key={label}
              type="button"
              aria-pressed={on}
              onClick={() => toggleQuick(key, value)}
              className={`${chipBase} ${on ? "border-accent bg-surface-accent-subtle font-semibold text-accent" : chipOff}`}
            >
              <Icon d={QUICK_ICON[label]} size={20} />
              {label}
            </button>
          );
        })}
      </div>

      <div role="group" aria-label="상세 필터" className="scrollbar-none flex items-center gap-1 overflow-x-auto bg-surface-subtle px-4 py-2">
        <button
          type="button"
          aria-label="상세필터"
          onClick={() => setLayerTab(0)}
          className={`relative flex size-8 shrink-0 items-center justify-center rounded-sm border ${
            filterCount > 0 ? "border-line-strong text-ink" : "border-line text-ink-muted"
          }`}
        >
          <Icon d={SLIDERS} size={16} />
          {filterCount > 0 && <span aria-hidden="true" className="absolute top-1 right-1 size-1 rounded-full bg-accent" />}
        </button>
        {(["M", "F"] as const).map((value) => {
          const on = gf === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={on}
              onClick={() => toggleGender(value)}
              className={`${chipBase} justify-center px-2 ${on ? "border-line-strong font-semibold text-ink" : chipOff}`}
            >
              {value === "M" ? "남" : "여"}
            </button>
          );
        })}
        {filterDropdowns.map((dropdown, i) => {
          const on = dropdown.keys.some((key) => searchParams.get(key));
          return (
            <button
              key={dropdown.label}
              type="button"
              onClick={() => setLayerTab(i)}
              className={`${chipBase} px-2 ${on ? "border-line-strong font-semibold text-ink" : chipOff}`}
            >
              {dropdown.label}
              <Icon d={CHEVRON} size={12} />
            </button>
          );
        })}
      </div>

      <AppliedFilters params={searchParams} onRemove={apply} onReset={reset} className="bg-surface-subtle px-4 pb-3" />

      {layerTab !== null && (
        <SearchFilterLayer
          tab={layerTab}
          onTab={setLayerTab}
          resultCount={resultCount}
          params={searchParams}
          onChange={apply}
          onClose={() => setLayerTab(null)}
          onReset={reset}
        />
      )}
    </div>
  );
}
