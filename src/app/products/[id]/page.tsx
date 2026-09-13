import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { getProduct } from "@/lib/products";

// 데이터는 DB 에서 요청 시점에 읽는다(목록 페이지와 동일).
export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <article className="mx-auto max-w-page px-4 py-6 md:px-6 md:py-10">
      <Link href="/products" className="mb-6 inline-block text-label text-ink-link hover:text-accent-hover">
        ← 목록으로 돌아가기
      </Link>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-10">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-subtle">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-title font-semibold text-ink">{product.name}</h1>
          <p className="text-title font-bold text-price">{formatPrice(product.price)}</p>
          <p className="text-body-lg text-ink-secondary">{product.description}</p>
        </div>
      </div>
    </article>
  );
}
