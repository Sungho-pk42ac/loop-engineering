import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/data/products";

export interface ProductCardProps {
  product: Pick<Product, "id" | "name" | "price" | "imageUrl">;
}

// 목록 카드. 카드 전체가 상세(/products/[id]) 링크다.
export function ProductCard({ product }: ProductCardProps) {
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
