"use client";

import { useSearchParams } from "next/navigation";
import { parseGf, type Gf } from "@/data/brands";
import { detailIdOf } from "@/data/exhibition";
import { sportsPicks } from "@/data/sportsPicks";
import { columnStep, ScrollRow } from "../ScrollRow";
import { ExhibitionProductCard } from "./ExhibitionProductCard";
import { SectionHeader } from "./SectionHeader";

function toColumns<T>(items: T[]): T[][] {
  const columns: T[][] = [];
  for (let i = 0; i < items.length; i += 2) columns.push(items.slice(i, i + 2));
  return columns;
}

// 스포츠 종목 아이템 추천(#31): 두 줄 제목(고정 문구 + 키워드)·더보기(현재 gf 유지, 새 탭)와 상품 30개 2줄 가로 캐러셀.
// 캐러셀·카드는 기획전(#23·#24) 부품을 그대로 쓰고, 카드 이미지·상품명만 상세(/products/<id>)로 간다.
export function SportsPicksSection() {
  const gf = parseGf(useSearchParams().get("gf"));
  return <SportsPicks gf={gf} />;
}

/** 본문. 페이지 Suspense 폴백(서버 HTML)에서는 gf="A" 로 쓴다 */
export function SportsPicks({ gf }: { gf: Gf }) {
  const columns = toColumns(sportsPicks.products);

  return (
    <section aria-labelledby="sports-picks" className="pb-4">
      <SectionHeader
        id="sports-picks"
        titleLine={sportsPicks.titleLine}
        keyword={sportsPicks.keyword}
        moreLabel={sportsPicks.moreLabel}
        moreHref={`/products?gf=${gf}`}
      />

      <ScrollRow
        listClassName="scrollbar-none flex overflow-x-auto px-4 md:snap-x md:snap-mandatory md:scroll-pl-4"
        prevLabel="이전 상품 보기"
        nextLabel="다음 상품 보기"
        step={columnStep}
      >
        {columns.map((column, c) => (
          <li key={column[0].id} className="grid w-34 shrink-0 snap-start auto-rows-fr md:w-65">
            {column.map((product, r) => (
              <ExhibitionProductCard key={product.id} product={product} productHref={`/products/${detailIdOf(c * 2 + r)}`} />
            ))}
          </li>
        ))}
      </ScrollRow>
    </section>
  );
}
