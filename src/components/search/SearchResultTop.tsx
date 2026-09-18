import Link from "next/link";
import { relatedKeywords, resultCounts, resultTabs } from "@/data/search";
import { searchResultHref } from "@/lib/search";
import { Icon } from "../Icon";
import { SearchLayer } from "../SearchLayer";
import { SearchFilterBar } from "./SearchFilterBar";
import { SearchResultCount } from "./SearchResultCount";
import { BackButton } from "./BackButton";

const container = "px-4";
const mobileIconClass = "flex size-7 shrink-0 items-center justify-center text-icon md:hidden";
// 선택 탭 밑줄 2px 은 design-tokens §5.2 예외(원본 실측).
const tabClass = "-mb-px flex shrink-0 items-center border-b-2 whitespace-nowrap";
const active = "border-line-strong font-semibold text-ink";
const inactive = "border-transparent text-ink-muted";

// 검색 결과 상단(#108). 원본 실측(#159): 모든 폭에서 내용도 전체 폭·좌우 16.
// 연관 검색어 줄은 흐름 속에서 스크롤되어 사라지고, 결과 탭 44 + 서브탭 40 묶음만 검색창 줄 아래 sticky.
// sticky top = 우리 헤더(데스크톱 152 · 모바일 192) + 검색창 줄 52.
// ponytail: 헤더 높이가 바뀌면(#59 스크롤 숨김 등) top 값들도 같이 고쳐야 한다.
export function SearchResultTop({ keyword, query }: { keyword: string; query: string }) {
  return (
    <>
      <div className="sticky top-48 z-sticky bg-surface-subtle md:top-38">
        <div className={`${container} flex h-13 items-center gap-2 py-2`}>
          <BackButton className={mobileIconClass}>
            <Icon d="M15 5l-7 7 7 7" />
          </BackButton>
          <div className="min-w-0 flex-1">
            <SearchLayer keyword={keyword} />
          </div>
          <Link href="/products" aria-label="장바구니" className={mobileIconClass}>
            <Icon d="M6 8h12l-1 12H7L6 8zM9 8V6a3 3 0 0 1 6 0v2" />
          </Link>
        </div>
      </div>

      <nav aria-label="연관 검색어" className={`${container} flex h-9 items-start overflow-x-auto bg-surface pt-1 pb-3`}>
        {relatedKeywords.map((word) => (
          <Link key={word} href={searchResultHref(word)} className="shrink-0 px-2 text-body whitespace-nowrap text-ink first:pl-0">
            {word}
          </Link>
        ))}
      </nav>

      <div className="sticky top-61 z-sticky bg-surface-subtle md:top-51">
        <div className="h-11 border-b border-line bg-surface-subtle">
          <nav aria-label="검색 결과 탭" className={`${container} flex h-full gap-4 overflow-x-auto`}>
            {resultTabs.map(({ label, available }) => (
              <Link
                key={label}
                href={available ? `/search/goods?${query}` : "/products"}
                aria-current={available ? "page" : undefined}
                className={`text-body ${tabClass} ${available ? active : inactive}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="h-10 border-b border-line bg-surface-sunken">
          <nav aria-label="상품 구분" className={`${container} flex h-full gap-4`}>
            <Link href={`/search/goods?${query}`} aria-current="page" className={`gap-1 text-label ${tabClass} ${active}`}>
              새 상품<span className="font-regular">{resultCounts.newGoods.toLocaleString("ko-KR")}</span>
            </Link>
            <Link href="/products" className={`gap-1 text-label ${tabClass} ${inactive}`}>
              <span className="relative">
                USED
                <span data-used-dot aria-hidden="true" className="absolute top-0 -right-1.5 size-1 rounded-full bg-accent" />
              </span>
              <span>{resultCounts.used.toLocaleString("ko-KR")}</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* 필터 줄·적용 필터 줄(#110)은 개수 줄 위(원본 순서) */}
      <SearchFilterBar />
      <p className={`${container} flex h-8 items-end pb-3 text-label text-ink-muted`}>
        <SearchResultCount />
      </p>
    </>
  );
}
