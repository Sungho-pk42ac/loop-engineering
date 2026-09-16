import { Suspense } from "react";
import { RankingFilters } from "@/components/ranking/RankingFilters";

interface RankingPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// 랭킹 화면(이슈 128): 필터 영역 + 빈 목록 자리. 상품 그리드는 후속 이슈 129.
export default async function RankingPage({ searchParams }: RankingPageProps) {
  await searchParams; // 쿼리마다 요청 시 렌더(목록 연결은 후속 이슈)
  return (
    <>
      <h1 className="sr-only">랭킹</h1>
      <Suspense>
        <RankingFilters />
      </Suspense>
      <section aria-label="랭킹 상품 목록" />
    </>
  );
}
