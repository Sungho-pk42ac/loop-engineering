import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/data/products";

export interface ProductCardProps {
  product: Pick<Product, "id" | "name" | "price" | "imageUrl">;
  /** flat: 간격 0 그리드용 — 테두리·라운드 없음, 이미지 5:6(검색 결과 #109). 기본은 기존 카드 */
  variant?: "default" | "flat";
  sizes?: string;
}

// 목록 카드. 카드 전체가 상세(/products/[id]) 링크다.
export function ProductCard({ product, variant = "default", sizes }: ProductCardProps) {
  if (variant === "flat") {
    return (
      <Link href={`/products/${product.id}`} className="block bg-surface focus-visible:-outline-offset-2">
        {/* fill(absolute) 이미지는 링크 포커스 링을 덮어 위치 지정 없는 이미지로 둔다 */}
        <div className="bg-surface-subtle">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={400}
            height={480}
            sizes={sizes}
            className="aspect-5/6 h-auto w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-1 px-2 pt-2 pb-4">
          <p className="line-clamp-2 text-body text-ink">{product.name}</p>
          <p className="text-label font-semibold text-price">{formatPrice(product.price)}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.id}`} className="block" aria-label={product.name}>
      <Card>
        <div className="relative aspect-square bg-surface-subtle">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1 p-4">
          <p className="text-body text-ink">{product.name}</p>
          <p className="text-label font-semibold text-price">{formatPrice(product.price)}</p>
        </div>
      </Card>
    </Link>
  );
}
