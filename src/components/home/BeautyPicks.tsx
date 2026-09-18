"use client";

import { useSearchParams } from "next/navigation";
import { parseGf, type Gf } from "@/data/brands";
import { beautyPicks } from "@/data/beautyPicks";
import { detailIdOf } from "@/data/exhibition";
import { ExhibitionProductCard } from "./ExhibitionProductCard";
import { SectionHeader } from "./SectionHeader";

export function BeautyPicksSection() {
  const gf = parseGf(useSearchParams().get("gf"));
  return <BeautyPicks gf={gf} />;
}

// 트렌드 뷰티 추천(#34): 두 줄 제목·더보기(현재 gf 유지) + 상품 10개 5열×2줄 고정 그리드(캐러셀·호버 버튼 없음).
// 모바일은 #33 과 같은 좁은 카드(136)로 5열×2줄이 가로 스크롤된다. 카드는 #24 부품, '옵션비 별도'만 note 로 붙인다.
export function BeautyPicks({ gf }: { gf: Gf }) {
  return (
    <section aria-labelledby="beauty-picks" className="pb-4">
      <SectionHeader
        id="beauty-picks"
        titleLine={beautyPicks.titleLine}
        keyword={beautyPicks.keyword}
        moreLabel={beautyPicks.moreLabel}
        moreHref={`/products?gf=${gf}&sort=popular`}
      />

      <ul className="scrollbar-none mx-auto grid max-w-page grid-flow-col grid-rows-2 overflow-x-auto px-4 md:grid-flow-row md:grid-cols-5 md:px-6">
        {beautyPicks.products.map((product, i) => (
          <li key={product.id} className="w-34 md:w-auto">
            <ExhibitionProductCard
              product={product}
              productHref={`/products/${detailIdOf(i)}`}
              note={product.optionExtra ? "옵션비 별도" : undefined}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
