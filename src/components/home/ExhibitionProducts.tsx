"use client";

import { useState } from "react";
import { filterByBrand, type ExhibitionProduct } from "@/data/exhibition";
import { ScrollRow } from "../ScrollRow";
import { ExhibitionProductCard } from "./ExhibitionProductCard";

const CHIPS_PER_ROW = 8;
// 원본: 상품이 적으면(브랜드 선택 시 6개 관측) 1줄, 많으면 열마다 위아래 2줄. 경계 개수는 원본에서 미확인(6개 1줄 관측만).
const TWO_ROWS_OVER = 6;

// 원본: 한 번에 "온전히 보이는 열 수 - 1" 만큼(1440 에서 4열 = 1040) 이동해 반쯤 보이던 열을 건너뛰지 않는다.
function columnStep(el: HTMLElement): number {
  const column = el.firstElementChild?.clientWidth ?? el.clientWidth;
  const fullyVisible = Math.floor((el.clientWidth - 16) / column);
  return Math.max(1, fullyVisible - 1) * column;
}

function toColumns<T>(items: T[], perColumn: number): T[][] {
  const columns: T[][] = [];
  for (let i = 0; i < items.length; i += perColumn) columns.push(items.slice(i, i + perColumn));
  return columns;
}

// 기획전 브랜드 칩 필터 + 상품 목록(#22). 원본 실측: '전체' + 브랜드 칩이 한 줄 8칸 × 2줄 고정(nowrap, 넘치면 두 줄 블록째 가로 스크롤),
// 알약 칩 h32 · 왼쪽 24 원형 로고 자리 · 13px, 기본 흰색 20% / 선택 흰색 + 600, 호버 변화 없음. 선택 칩을 다시 눌러도 해제 안 됨.
// 누르면 URL 변화 없이 목록만 즉시 교체. 원본 흰 글자·캠페인색 글자는 대비 미달이라 검정(#20 규칙). 로고 에셋 대신 브랜드 첫 글자.
export function ExhibitionProducts({ brands, products }: { brands: string[]; products: ExhibitionProduct[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const chips: { label: string; value: string | null }[] = [
    { label: "전체", value: null },
    ...brands.map((b) => ({ label: b, value: b })),
  ];
  const rows = [chips.slice(0, CHIPS_PER_ROW), chips.slice(CHIPS_PER_ROW)].filter((row) => row.length > 0);
  const visible = filterByBrand(products, selected);
  const columns = toColumns(visible, visible.length > TWO_ROWS_OVER ? 2 : 1);

  return (
    <>
      <div role="group" aria-label="브랜드 필터" className="scrollbar-none mb-3 overflow-x-auto px-4">
        <div className="flex w-max flex-col gap-2">
          {rows.map((row, r) => (
            <div key={r} className="flex gap-1">
              {row.map(({ label, value }) => {
                const active = value === selected;
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelected(value)}
                    className={`flex h-8 shrink-0 items-center gap-1 rounded-full py-1 pr-3 pl-1 text-label whitespace-nowrap ${
                      active ? "bg-surface-campaign-chip-active font-semibold" : "bg-surface-campaign-chip font-regular"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="flex size-6 items-center justify-center rounded-full bg-surface-campaign-chip-icon text-caption font-semibold"
                    >
                      {value === null ? "" : label.charAt(0)}
                    </span>
                    {label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <ScrollRow
        key={selected ?? "전체"}
        listClassName="scrollbar-none flex overflow-x-auto px-4 md:snap-x md:snap-mandatory md:scroll-pl-4"
        prevLabel="이전"
        nextLabel="다음"
        step={columnStep}
      >
        {columns.map((column) => (
          <li key={column[0].id} className="grid w-28 shrink-0 snap-start auto-rows-fr md:w-65">
            {column.map((product) => (
              <ExhibitionProductCard key={product.id} product={product} />
            ))}
          </li>
        ))}
      </ScrollRow>
    </>
  );
}
