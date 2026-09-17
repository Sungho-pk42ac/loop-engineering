import {
  groupSortCode,
  searchSortGroups,
  searchSortSingles,
  sortPeriods,
  type SearchGoodsItem,
  type SortPeriodCode,
} from "@/data/search";

export interface ResolvedSort {
  /** 트리거에 보이는 글자 — 하위 선택이면 '상위 하위' */
  label: string;
  /** 단일 항목 코드 또는 그룹 prefix/suffix 조합 */
  code: string;
  groupIndex?: number;
  period?: SortPeriodCode;
}

const DEFAULT: ResolvedSort = { label: searchSortSingles[0].label, code: searchSortSingles[0].code };

/** sortCode 해석. 없거나 알 수 없는 값은 추천순(기본). */
export function resolveSort(sortCode: string | null | undefined): ResolvedSort {
  if (!sortCode) return DEFAULT;
  const single = searchSortSingles.find((o) => o.code === sortCode);
  if (single) return { label: single.label, code: single.code };
  for (const [groupIndex, group] of searchSortGroups.entries()) {
    for (const period of sortPeriods) {
      if (groupSortCode(group, period.code) === sortCode) {
        return { label: `${group.label} ${period.label}`, code: sortCode, groupIndex, period: period.code };
      }
    }
  }
  return DEFAULT;
}

// 자리표시자 데이터라 기간별 수치는 두지 않고, 기간 하위는 같은 그룹 지표로 정렬한다(URL·트리거 글자만 기간 반영).
const METRIC: Record<string, (item: SearchGoodsItem) => number> = {
  NEW: (i) => Date.parse(i.createdAt),
  LOW_PRICE: (i) => -i.price,
  HIGH_PRICE: (i) => i.price,
  DISCOUNT_RATE: (i) => i.discountRate,
  REVIEW: (i) => i.reviewCount,
  SALE_AMOUNT: (i) => i.saleAmount,
  SALE_COUNT: (i) => i.saleCount,
  VIEW: (i) => i.viewCount,
  LIKE: (i) => i.likeCount,
};

function metricKeyOf(sort: ResolvedSort): string | null {
  if (sort.groupIndex === undefined) return sort.code === "RECOMMEND" ? null : sort.code;
  const group = searchSortGroups[sort.groupIndex];
  return group.suffix ? `${group.prefix}_${group.suffix}` : group.prefix;
}

/** 큰 값이 앞. 추천순은 원래 순서. 동률은 원래 순서를 지킨다. */
export function sortSearchGoods(items: SearchGoodsItem[], sortCode: string | null | undefined): SearchGoodsItem[] {
  const key = metricKeyOf(resolveSort(sortCode));
  const metric = key ? METRIC[key] : undefined;
  if (!metric) return items;
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => metric(b.item) - metric(a.item) || a.index - b.index)
    .map(({ item }) => item);
}
