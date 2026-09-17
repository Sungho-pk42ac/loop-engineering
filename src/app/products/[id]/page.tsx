import Image from "next/image";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { products } from "@/data/products";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// 6개 상세 경로를 빌드 시 정적 생성한다.
export function generateStaticParams() {
  return products.map(({ id }) => ({ id }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  // 원본 실측(#61): 최대 1440 가운데 회색 영역에 좌측(갤러리·탭 자리, 남는 폭) + 우측 흰 정보 패널(426 → 4px 배수 424)이
  // 간격 16 으로 2단, 패널은 헤더 아래 sticky. md 미만은 1단(이미지 전폭 → 정보 좌우 16). 원본 min-width 가로 스크롤은 따르지 않는다.
  // 원본의 "목록으로 돌아가기" 링크는 없다(클론 결정).
  return (
    <div className="bg-surface-subtle">
      <article className="mx-auto flex max-w-wide flex-col md:flex-row md:items-start md:gap-4 md:pt-4">
        <div className="min-w-0 flex-1">
          <div className="relative aspect-square bg-surface">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 bg-surface p-4 md:sticky md:top-38 md:w-106 md:shrink-0">
          <h1 className="text-title font-semibold text-ink">{product.name}</h1>
          <p className="text-title font-bold text-price">{formatPrice(product.price)}</p>
          <p className="text-body-lg text-ink-secondary">{product.description}</p>
        </div>
      </article>
    </div>
  );
}
