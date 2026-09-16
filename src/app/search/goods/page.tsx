import { SearchResultTop } from "@/components/search/SearchResultTop";

interface SearchGoodsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SearchGoodsPage({ searchParams }: SearchGoodsPageProps) {
  const params = await searchParams;
  const keyword = typeof params.keyword === "string" ? params.keyword : "";
  const query = new URLSearchParams(
    Object.entries(params).flatMap(([k, v]) => (Array.isArray(v) ? v.map((x) => [k, x]) : v === undefined ? [] : [[k, v]])),
  ).toString();

  // 상품 그리드는 #109.
  return <SearchResultTop keyword={keyword} query={query} />;
}
