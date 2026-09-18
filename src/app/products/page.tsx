import { BannerCarousel } from "@/components/BannerCarousel";
import { LiveSchedule } from "@/components/LiveSchedule";
import { QuickMenuServices } from "@/components/QuickMenuServices";
import { QuickMenuSpecial } from "@/components/QuickMenuSpecial";
import { ExhibitionSection } from "@/components/home/ExhibitionSection";
import { NotableBrands, NotableBrandsSection } from "@/components/home/NotableBrandsSection";
import { BeautyPicks, BeautyPicksSection } from "@/components/home/BeautyPicks";
import { CategoryTrend } from "@/components/home/CategoryTrend";
import { SportsPicks, SportsPicksSection } from "@/components/home/SportsPicks";
import { GenderToggle } from "@/components/GenderToggle";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { Suspense } from "react";

export default function ProductsPage() {
  return (
    <>
      <Suspense>
        <GenderToggle />
      </Suspense>
      <BannerCarousel />
      <QuickMenuSpecial />
      <QuickMenuServices />
      {/* 원본: 기획전은 퀵메뉴 바로 아래 */}
      <ExhibitionSection />
      {/* 서버 HTML 에도 섹션이 있도록 폴백은 전체(A) 목록 — 레이아웃 밀림 방지 */}
      <Suspense fallback={<NotableBrands gf="A" />}>
        <NotableBrandsSection />
      </Suspense>
      <Suspense fallback={<SportsPicks gf="A" />}>
        <SportsPicksSection />
      </Suspense>
      <Suspense fallback={<BeautyPicks gf="A" />}>
        <BeautyPicksSection />
      </Suspense>
      <CategoryTrend />
      <section className="mx-auto max-w-page px-4 py-6 md:px-6 md:py-10">
        <h1 className="mb-6 text-title-lg font-bold text-ink md:text-heading">상품 목록</h1>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>
      {/* 원본: 라이브 편성표는 페이지 마지막 섹션(푸터 바로 위) */}
      <LiveSchedule />
    </>
  );
}
