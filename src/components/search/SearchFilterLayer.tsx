"use client";

import { useEffect, useRef } from "react";
import { filterDropdowns } from "@/data/search";
import { AppliedFilters } from "./AppliedFilters";
import { countByTab, SearchFilterSlides } from "./SearchFilterSlides";
import { Icon, ICON_PATHS } from "../Icon";

// 필터 레이어 틀(#110). 원본 실측: ≥768 가운데 모달 480×584(radius 8), <768 바텀시트(위쪽만 radius 8), 딤 검정 60%.
// 딤 클릭·닫기(X)·'N개의 상품보기'로 닫히고 Esc 로는 닫히지 않는다(원본). 본문 옵션 UI 는 #112·#113 몫이라 자리만 둔다.
export function SearchFilterLayer({
  tab,
  onTab,
  resultCount,
  params,
  onChange,
  onClose,
  onReset,
}: {
  tab: number;
  onTab: (index: number) => void;
  resultCount: number;
  params: URLSearchParams;
  onChange: (change: (params: URLSearchParams) => void) => void;
  onClose: () => void;
  onReset: () => void;
}) {
  const counts = countByTab(params);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" onClick={onClose} className="fixed inset-0 z-overlay bg-surface-overlay" />
      <section
        role="dialog"
        aria-modal="true"
        aria-label="필터"
        className="fixed inset-x-0 top-16 bottom-0 z-modal flex flex-col rounded-t-lg bg-surface md:inset-0 md:m-auto md:h-146 md:w-120 md:rounded-lg"
      >
        <div className="flex h-12 items-center justify-between px-4">
          <h2 className="text-body-lg font-medium text-ink">필터</h2>
          <button ref={closeRef} type="button" aria-label="닫기" onClick={onClose} className="flex size-6 items-center justify-center text-icon">
            <Icon d={ICON_PATHS.close} size={22} />
          </button>
        </div>

        <div role="tablist" aria-label="필터 종류" className="scrollbar-none flex gap-2 overflow-x-auto px-4">
          {filterDropdowns.map((dropdown, i) => (
            <button
              key={dropdown.label}
              type="button"
              role="tab"
              aria-selected={i === tab}
              onClick={() => onTab(i)}
              className={`flex h-10 shrink-0 items-center border-b-2 px-2 text-body ${
                i === tab ? "border-line-strong font-semibold text-ink" : "border-transparent font-regular text-ink-muted"
              }`}
            >
              {counts[i] > 0 ? `${dropdown.label} ${counts[i]}` : dropdown.label}
            </button>
          ))}
        </div>

        <AppliedFilters params={params} onRemove={onChange} onReset={onReset} className="bg-surface-subtle px-4 py-3" />

        <SearchFilterSlides tab={tab} params={params} onChange={onChange} />

        <div className="flex flex-col items-center gap-2 px-4 pt-2 pb-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-full items-center justify-center rounded-sm bg-surface-inverse text-body text-ink-inverse"
          >
            {resultCount.toLocaleString("ko-KR")}개의 상품보기
          </button>
          <button type="button" onClick={onReset} className="text-label font-regular text-ink-muted underline">
            선택 초기화
          </button>
        </div>
      </section>
    </>
  );
}
