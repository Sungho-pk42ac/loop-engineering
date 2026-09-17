"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { filterByBrand, type ExhibitionProduct } from "@/data/exhibition";
import { formatPrice } from "@/lib/format";
import { Card } from "../ui";

const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;
const CHIPS_PER_ROW = 8;

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

  return (
    <>
      <div role="group" aria-label="브랜드 필터" className="scrollbar-none mx-auto mb-3 max-w-page overflow-x-auto px-4 md:px-6">
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

      <ul className="mx-auto grid max-w-page grid-cols-2 gap-4 px-4 md:grid-cols-3 md:px-6 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
        {visible.map((product) => (
          <li key={product.id}>
            <Link href="/products" {...newTab} className="block text-ink">
              <Card>
                <div className="relative aspect-square bg-surface-subtle">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1280px) 240px, (min-width: 768px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1 p-2">
                  <p className="text-detail">{product.brand}</p>
                  <p className="line-clamp-2 text-body">{product.name}</p>
                  <p className="text-label font-bold text-price">{formatPrice(product.price)}</p>
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
