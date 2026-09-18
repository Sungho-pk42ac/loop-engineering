"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { products } from "@/data/products";
import { searchGoodsItems } from "@/data/search";
import { filterSearchGoods, sortSearchGoods } from "@/lib/searchGoods";
import { ProductCard } from "../ProductCard";
import { Icon } from "../Icon";
import { SearchSortMenu } from "./SearchSortMenu";

export const GRID_TOTAL = 120;
export const GRID_BATCH = 60;

const byId = new Map(products.map((p) => [p.id, p]));

// 검색 결과 그리드(#109). 원본 실측: 간격 0, 데스크톱 한 줄 6칸(최대 1440 가운데), 모바일 기본 3칸 ↔ 2칸 토글(URL 불변),
// 끝 근처에서 다음 묶음 자동 추가(더보기 버튼·페이지 번호 없음). 가상 목록은 총량이 작아 생략.
export function SearchResultGrid() {
  const searchParams = useSearchParams();
  const results = sortSearchGoods(filterSearchGoods(searchGoodsItems, searchParams), searchParams.get("sortCode"));
  const total = results.length; // 필터 결과 수가 무한 스크롤 총량(이슈 110)
  const [visible, setVisible] = useState(GRID_BATCH);
  const [mobileCols, setMobileCols] = useState<2 | 3>(3);
  const sentinelRef = useRef<HTMLDivElement>(null);
  // 센티널이 계속 보이는 동안에는 한 묶음만 붙인다. 화면(+여유) 밖으로 나갔다 들어와야 다음 묶음이 붙는다(실측 228).
  const wasVisibleRef = useRef(false);
  const lastTotalRef = useRef(total);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    // 필터가 바뀌어 총량이 달라지면 이전 교차 상태는 버린다(그대로 두면 다음 묶음이 안 붙는다)
    if (lastTotalRef.current !== total) {
      lastTotalRef.current = total;
      wasVisibleRef.current = false;
    }
    if (!sentinel || visible >= total) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const on = entries.some((e) => e.isIntersecting);
        if (on && !wasVisibleRef.current) setVisible((v) => Math.min(v + GRID_BATCH, total));
        wasVisibleRef.current = on;
      },
      { rootMargin: "2000px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visible, total]);

  return (
    <div className="relative bg-surface-subtle">
      {/* 개수 줄 오른쪽 16×16 열 보기 버튼(모바일만, 누르는 영역 24). 위치는 SearchResultTop 개수 줄(h-8 pb-3) 기준 —
          열린 PR 195·206 이 그 파일을 고치고 있어 여기서 올렸다. 개수 줄 높이가 바뀌면 같이 고친다. */}
      {/* 개수 줄 오른쪽: 정렬 메뉴(#111). 모바일은 열 보기 버튼(right-3 + p-1 = 오른쪽 40) 왼쪽이라 right-11(44) */}
      <div className="absolute -top-8 right-11 md:right-4">
        <SearchSortMenu />
      </div>
      <button
        type="button"
        aria-label={mobileCols === 3 ? "2열 보기" : "3열 보기"}
        onClick={() => setMobileCols((c) => (c === 3 ? 2 : 3))}
        className="absolute -top-8 right-3 p-1 text-icon md:hidden"
      >
        <Icon d={mobileCols === 3 ? "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" : "M3 4h4v4H3zM10 4h4v4h-4zM17 4h4v4h-4zM3 10h4v4H3zM10 10h4v4h-4zM17 10h4v4h-4z"} size={16} />
      </button>
      <ul className={`mx-auto grid max-w-wide md:grid-cols-6 ${mobileCols === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {results.slice(0, visible).map((item) => (
          <li key={item.id}>
            <ProductCard product={byId.get(item.productId)!} variant="flat" sizes="(min-width: 768px) 17vw, 50vw" />
          </li>
        ))}
      </ul>
      {visible < total && <div ref={sentinelRef} aria-hidden="true" className="h-px" />}
    </div>
  );
}
