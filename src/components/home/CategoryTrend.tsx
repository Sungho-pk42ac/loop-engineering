"use client";

import { useState } from "react";
import { categoryTrend, trendProductsOf } from "@/data/categoryTrend";
import { detailIdOf } from "@/data/exhibition";
import { ScrollRow } from "../ScrollRow";
import { ExhibitionProductCard } from "./ExhibitionProductCard";
import { SectionHeader } from "./SectionHeader";

// 카테고리 트렌드(#35): 두 줄 제목·더보기 + 브랜드 로고 칩 10개 줄 + 칩으로 통째로 교체되는 1줄 상품 캐러셀.
// 칩은 #27 처럼 목록을 교체한다(거르지 않는다). URL 은 바뀌지 않고, 바뀐 브랜드는 '더보기' 링크에만 실린다.
// 칩 줄·캐러셀 모두 모바일에서 가로 스크롤(#30·#33), 카드는 기획전 부품(#24).
export function CategoryTrend() {
  const [brandId, setBrandId] = useState(categoryTrend.brands[0].id);
  const products = trendProductsOf(brandId);

  return (
    <section aria-labelledby="category-trend" className="pb-4">
      <SectionHeader
        id="category-trend"
        titleLine={categoryTrend.titleLine}
        keyword={categoryTrend.keyword}
        moreLabel={categoryTrend.moreLabel}
        moreHref={`/products?brand=${brandId}`}
      />

      <div role="group" aria-label="브랜드" className="scrollbar-none flex gap-1 overflow-x-auto px-4 pb-2">
        {categoryTrend.brands.map(({ id, name, initial }) => {
          const active = id === brandId;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => setBrandId(id)}
              className={`flex h-8 shrink-0 items-center gap-1 rounded-sm border px-1 text-label whitespace-nowrap ${
                active ? "border-line-strong bg-surface font-semibold text-ink" : "border-line font-regular text-ink-muted"
              }`}
            >
              <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-sunken text-caption text-ink">
                {initial}
              </span>
              {name}
            </button>
          );
        })}
      </div>

      {/* key 로 다시 마운트해 브랜드가 바뀌면 캐러셀이 맨 앞에서 시작한다(목록이 통째로 교체되므로) */}
      <ScrollRow
        key={brandId}
        listClassName="scrollbar-none flex overflow-x-auto px-4 md:snap-x md:snap-mandatory md:scroll-pl-4"
        prevLabel="이전 상품 보기"
        nextLabel="다음 상품 보기"
      >
        {products.map((product, i) => (
          <li key={product.id} className="w-34 shrink-0 snap-start md:w-65">
            <ExhibitionProductCard product={product} productHref={`/products/${detailIdOf(i)}`} />
          </li>
        ))}
      </ScrollRow>
    </section>
  );
}
