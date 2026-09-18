import { SearchResultGrid } from "@/components/search/SearchResultGrid";
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

  return (
    <>
      <SearchResultTop keyword={keyword} query={query} />
      <SearchResultGrid />
    </>
  );
}
