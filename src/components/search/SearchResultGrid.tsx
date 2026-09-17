"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { products } from "@/data/products";
import { searchGoodsItems } from "@/data/search";
import { sortSearchGoods } from "@/lib/searchGoods";
import { ProductCard } from "../ProductCard";
import { Icon } from "../Icon";
import { SearchSortMenu } from "./SearchSortMenu";

export const GRID_TOTAL = 120;
export const GRID_BATCH = 24;

const byId = new Map(products.map((p) => [p.id, p]));

// 검색 결과 그리드(#109). 원본 실측: 간격 0, 데스크톱 한 줄 6칸(최대 1440 가운데), 모바일 기본 3칸 ↔ 2칸 토글(URL 불변),
// 끝 근처에서 다음 묶음 자동 추가(더보기 버튼·페이지 번호 없음). 가상 목록은 총량이 작아 생략.
export function SearchResultGrid() {
  const sortCode = useSearchParams().get("sortCode");
  const results = sortSearchGoods(searchGoodsItems, sortCode);
  const [visible, setVisible] = useState(GRID_BATCH);
  const [mobileCols, setMobileCols] = useState<2 | 3>(3);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // visible 이 바뀔 때마다 다시 관찰해, 추가 뒤에도 센티널이 보이면 곧바로 다음 묶음을 붙인다.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || visible >= GRID_TOTAL) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setVisible((v) => Math.min(v + GRID_BATCH, GRID_TOTAL));
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visible]);

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
      {visible < GRID_TOTAL && <div ref={sentinelRef} aria-hidden="true" className="h-px" />}
    </div>
  );
}
