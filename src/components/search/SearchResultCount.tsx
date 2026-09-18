"use client";

import { useSearchParams } from "next/navigation";
import { searchGoodsItems } from "@/data/search";
import { filterSearchGoods } from "@/lib/searchGoods";

/** 개수 줄(#108)의 'N개' — 필터(#110) 결과 수를 쓴다. */
export function SearchResultCount() {
  const count = filterSearchGoods(searchGoodsItems, useSearchParams()).length;
  return <>{count.toLocaleString("ko-KR")}개</>;
}
