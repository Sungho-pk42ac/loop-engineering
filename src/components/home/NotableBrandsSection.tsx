"use client";

import Link from "next/link";
import { useState } from "react";
import { brandCategories, filterBrandsByCategory, notableBrands, type BrandCategory } from "@/data/brands";
import { Badge } from "../ui/Badge";

// 주목할 만한 브랜드(#26). 원본 실측: 제목 줄(18/500, 좌우 16) 아래 원형 로고 칸(56×96)이 세로 6줄 열 우선으로 가로로 흐르고,
// 넘치면 섹션 안에서만 가로 스크롤. 칸 = 원 56 + 원 아래에 겹친 혜택 배지 + 2줄 이름(11px). 호버 변화 없음, 새 탭.
// 로고 에셋 대신 첫 글자 원(#22 방식). 원본 세로 간격 6 → 8, 제목 줄·섹션 아래 11 → 12(목록 py-1 포커스 링 자리 4 포함).
// 카테고리 칩(#27): 전체 + 12개, 누르면 URL 변화 없이 목록 교체·가로 스크롤 처음으로(목록 key 로 새로 그림).
// 선택 칩 재클릭은 해제 없음. 선택 굵기는 원본 실측 600(semibold). 아이콘 에셋이 없어 3·4·5·6·11번째 칩에 작은 원 자리.
const CHIPS: { label: string; value: BrandCategory | null }[] = [
  { label: "전체", value: null },
  ...brandCategories.map((c) => ({ label: c, value: c })),
];
const ICON_CHIP_INDEXES = new Set([2, 3, 4, 5, 10]);

export function NotableBrandsSection() {
  const [selected, setSelected] = useState<BrandCategory | null>(null);
  const brands = filterBrandsByCategory(notableBrands, selected);

  return (
    <section aria-labelledby="notable-brands" className="pb-2">
      <h2 id="notable-brands" className="px-4 pt-3 pb-1 text-title-sm font-medium text-ink">
        주목할 만한 브랜드
      </h2>
      <div role="group" aria-label="브랜드 카테고리" className="scrollbar-none flex gap-1 overflow-x-auto px-4 pt-1 pb-3">
        {CHIPS.map(({ label, value }, i) => {
          const active = value === selected;
          return (
            <button
              key={label}
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(value)}
              className={`flex h-8 min-w-8 shrink-0 items-center justify-center gap-1 rounded-sm border px-1 text-label whitespace-nowrap ${
                active ? "border-line-strong bg-surface font-semibold text-ink" : "border-line font-regular text-ink-muted"
              }`}
            >
              {ICON_CHIP_INDEXES.has(i) && <span aria-hidden="true" className="size-4 shrink-0 rounded-full bg-surface-sunken" />}
              {label}
            </button>
          );
        })}
      </div>
      <ul
        key={selected ?? "전체"}
        className="scrollbar-none grid grid-flow-col grid-rows-6 justify-start gap-x-3 gap-y-2 overflow-x-auto px-4 py-1 md:snap-x md:snap-mandatory md:scroll-px-4">
        {brands.map(({ id, name, badge }) => (
          <li key={id} className="w-14 md:snap-start">
            <Link
              href="/products"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={badge ? `${name}, ${badge}` : name}
              className="flex h-24 flex-col items-center"
            >
              <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-body font-semibold text-ink">
                <span aria-hidden="true">{name.charAt(0)}</span>
                {badge && (
                  <Badge tone="outline" className="absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    {badge}
                  </Badge>
                )}
              </span>
              <span className="mt-3 line-clamp-2 w-full text-center text-caption break-keep text-ink-muted">{name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
