"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { ExhibitionProduct, SwatchColor } from "@/data/exhibition";
import { formatPrice } from "@/lib/format";
import { parseLikes, readLikesRaw, subscribeLikes, toggleLike } from "@/lib/likes";

const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;

const SWATCH: Record<SwatchColor, { className: string; label: string }> = {
  ink: { className: "bg-ink", label: "검정" },
  surface: { className: "bg-surface", label: "흰색" },
  accent: { className: "bg-accent", label: "파랑" },
  "price-sale": { className: "bg-price-sale", label: "빨강" },
};

// 기획전 상품 카드(#24). 원본 실측: 평면 카드(라운드·테두리·그림자 없음), 이미지 5:6 + 검정 2% 틴트, 우하단 20px 하트(회색 채움·흰 선),
// 텍스트 8/4/12/8 — 브랜드 11/600 1줄 · 상품명 12 2줄 · 할인율(빨강 600)+가격(600) 모바일 12·데스크톱 13 · 배송(파란 아이콘+글자, 배경 없음).
// 사진 위 하트 선은 다크 모드에서도 흰색(dark:stroke-icon), 배송 글자는 다크에서 대비용 accent-hover. 이미지 5:6·브랜드 caption 은 design-tokens 예외.
// 이미지·브랜드·상품명이 각각 새 탭 링크이고 가격 줄·하트는 링크 밖(중첩 인터랙티브 없음). 좋아요는 localStorage 목업.
// productHref: 이미지·상품명 링크 대상. 기본은 기획전처럼 /products, 상세가 있는 섹션(#31)은 /products/<id> 를 넘긴다.
export function ExhibitionProductCard({ product, productHref = "/products" }: { product: ExhibitionProduct; productHref?: string }) {
  const liked = parseLikes(useSyncExternalStore(subscribeLikes, readLikesRaw, () => "[]")).includes(product.id);
  const priceText = "text-detail font-semibold md:text-label";

  return (
    <article className="flex h-full flex-col bg-surface text-ink">
      <div className="relative aspect-5/6">
        <Link href={productHref} {...newTab} className="absolute inset-0">
          <Image src={product.imageUrl} alt={product.name} fill sizes="(min-width: 1440px) 260px, (min-width: 768px) 18vw, 29vw" className="object-cover" />
          <span aria-hidden="true" className="absolute inset-0 bg-surface-image-tint" />
        </Link>
        {product.colors && product.colors.length > 0 && (
          <ul aria-label="컬러" className="absolute top-1 left-1 flex flex-col gap-1">
            {product.colors.map((color) => (
              <li key={color} className={`size-2 rounded-full border border-line ${SWATCH[color].className}`}>
                <span className="sr-only">{SWATCH[color].label}</span>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          aria-label="좋아요"
          aria-pressed={liked}
          onClick={() => toggleLike(product.id)}
          className="absolute right-1 bottom-1 flex size-5 items-center justify-center"
        >
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" className={`stroke-icon-inverse dark:stroke-icon ${liked ? "fill-icon-like" : "fill-icon-muted"}`}>
            <path d="M10 16.5s-6.5-4-6.5-8.3A3.4 3.4 0 0 1 10 5.9a3.4 3.4 0 0 1 6.5 2.3c0 4.3-6.5 8.3-6.5 8.3z" strokeWidth="1" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-2 pr-1 pb-3 pl-2">
        <Link href="/products" {...newTab} className="line-clamp-1 text-caption font-semibold">
          {product.brand}
        </Link>
        <Link href={productHref} {...newTab} className="line-clamp-2 text-detail">
          {product.name}
        </Link>
        <p className="flex items-center gap-1">
          {product.discountRate !== undefined && (
            <span className={`${priceText} text-price-sale`}>{product.discountRate}%</span>
          )}
          <span className={`${priceText} text-price`}>{formatPrice(product.price)}</span>
        </p>
        {product.shippingBadge && (
          <p className="flex items-center gap-1 pt-1 text-caption font-semibold text-accent dark:text-accent-hover">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="shrink-0">
              <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
            </svg>
            <span className="truncate">{product.shippingBadge}</span>
          </p>
        )}
      </div>
    </article>
  );
}
