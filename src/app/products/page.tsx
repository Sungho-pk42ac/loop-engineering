import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

// 데이터는 DB 에서 요청 시점에 읽는다.
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
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
  );
}
