import { BannerCarousel } from "@/components/BannerCarousel";
import { QuickMenuSpecial } from "@/components/QuickMenuSpecial";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";

export default function ProductsPage() {
  return (
    <>
      <BannerCarousel />
      <QuickMenuSpecial />
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
    </>
  );
}
