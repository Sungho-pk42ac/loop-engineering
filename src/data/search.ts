import { products } from "./products";

export type RankChange = "up" | "down" | "same";

export interface PopularKeyword {
  keyword: string;
  change: RankChange;
}

// 검색창 자리표시 문구. 클라이언트에서 하나를 고른다.
export const searchPlaceholders: string[] = [
  "주방 소품 기획전 최대 20% 할인",
  "이번 주 신상품을 만나보세요",
  "데일리 가방 모음 보러가기",
];

// 인기 검색어 1~10위 (순서 = 순위)
export const popularKeywords: PopularKeyword[] = [
  { keyword: "머그컵", change: "same" },
  { keyword: "에코백", change: "up" },
  { keyword: "원목 도마", change: "down" },
  { keyword: "텀블러", change: "up" },
  { keyword: "캔들", change: "same" },
  { keyword: "수납함", change: "up" },
  { keyword: "러그", change: "down" },
  { keyword: "쿠션 커버", change: "same" },
  { keyword: "데스크 매트", change: "up" },
  { keyword: "무드등", change: "down" },
];

// 급상승 검색어 1~10위
export const risingKeywords: string[] = [
  "유리 화병",
  "캠핑 머그",
  "린넨 앞치마",
  "북엔드",
  "세라믹 접시",
  "우드 트레이",
  "미니 가습기",
  "코스터",
  "파우치",
  "벽시계",
];

// 검색 결과 화면 자리표시자 — 실제 검색 로직은 없다.
export const relatedKeywords: string[] = ["머그컵 세트", "대용량 머그", "캠핑 머그", "세라믹 컵", "유리컵", "텀블러"];

export interface ResultTab {
  label: string;
  /** 앱에 있는 탭만 true — 나머지는 /products */
  available: boolean;
}

export const resultTabs: ResultTab[] = [
  { label: "상품", available: true },
  { label: "브랜드", available: false },
  { label: "스냅/코디", available: false },
  { label: "혜택", available: false },
  { label: "콘텐츠", available: false },
  { label: "발매", available: false },
];

export const resultCounts = { newGoods: 1284, used: 57 };


// ── 검색 결과 정렬(#111) ──
// (가격은 products.ts 가 SSOT — 아래 자리표시자 결과가 그대로 참조한다)
export const sortPeriods = [
  { label: "1일", code: "ONE_DAY" },
  { label: "3일", code: "THREE_DAY" },
  { label: "1주일", code: "ONE_WEEK" },
  { label: "1개월", code: "ONE_MONTH" },
  { label: "3개월", code: "THREE_MONTH" },
  { label: "6개월", code: "SIX_MONTH" },
  { label: "1년", code: "ONE_YEAR" },
] as const;

export type SortPeriodCode = (typeof sortPeriods)[number]["code"];

/** 원본 브랜드명이 들어간 '무신사 추천순'은 클론 규칙상 '추천순'으로 둔다(#111). */
export const searchSortSingles = [
  { label: "추천순", code: "RECOMMEND" },
  { label: "신상품순", code: "NEW" },
  { label: "낮은 가격순", code: "LOW_PRICE" },
  { label: "높은 가격순", code: "HIGH_PRICE" },
  { label: "할인율순", code: "DISCOUNT_RATE" },
  { label: "후기 많은순", code: "REVIEW" },
] as const;

/** 기간 하위 7개를 펼치는 그룹. 코드는 `<prefix>_<기간>_<suffix>` 형태 */
export const searchSortGroups = [
  { label: "판매금액순", prefix: "SALE", suffix: "AMOUNT" },
  { label: "판매수량순", prefix: "SALE", suffix: "COUNT" },
  { label: "조회순", prefix: "VIEW", suffix: "" },
  { label: "좋아요순", prefix: "LIKE", suffix: "" },
] as const;

export function groupSortCode(group: (typeof searchSortGroups)[number], period: SortPeriodCode): string {
  return group.suffix ? `${group.prefix}_${period}_${group.suffix}` : `${group.prefix}_${period}`;
}

export interface SearchGoodsItem {
  id: string;
  /** src/data/products.ts 의 상품 id(상세 링크·이미지·이름) */
  productId: string;
  /** 화면에 보이는 가격과 같아야 하므로 products.ts 값을 그대로 쓴다(가격 SSOT) */
  price: number;
  recommendRank: number;
  /** ISO 날짜 */
  createdAt: string;
  discountRate: number;
  reviewCount: number;
  saleAmount: number;
  saleCount: number;
  viewCount: number;
  likeCount: number;
  /** 필터(#110) — 성별·별점·할인·무료배송 */
  gender: "M" | "F" | "A";
  reviewGrade: number;
  discount: boolean;
  freeDelivery: boolean;
}

// 자리표시자 결과 120개 — 상품 6종을 반복하고 정렬용 수치만 서로 다르게 둔다(원본 수치는 옮기지 않는다).
export const searchGoodsItems: SearchGoodsItem[] = Array.from({ length: 120 }, (_, i) => ({
  id: `goods-${i + 1}`,
  productId: String((i % 6) + 1),
  price: products[i % products.length].price,
  recommendRank: i,
  createdAt: new Date(Date.UTC(2026, 8, 1 + ((i * 5) % 30))).toISOString(),
  discountRate: (i * 13) % 40,
  reviewCount: (i * 37) % 900,
  saleAmount: (i * 101) % 5000,
  saleCount: (i * 53) % 700,
  viewCount: (i * 89) % 9000,
  likeCount: (i * 29) % 1200,
  gender: (["A", "M", "F"] as const)[i % 3],
  reviewGrade: [4.9, 4.6, 4.3, 3.8, 5, 4.1][i % 6],
  discount: i % 3 !== 2,
  freeDelivery: i % 4 === 0,
}));

/** 빠른 필터 칩(#110) — 라벨·쿼리 키·켜짐 값 */
export const quickFilters = [
  { label: "할인", key: "discount", value: "Y" },
  { label: "별점", key: "minReviewGrade", value: "4.5" },
  { label: "무료배송", key: "freeDelivery", value: "Y" },
] as const;

/** 필터 레이어 탭 = 드롭다운 칩(#110) */
export const filterDropdowns = [
  { label: "카테고리", keys: [] as string[] },
  { label: "가격", keys: [] as string[] },
  { label: "별점", keys: ["minReviewGrade"] },
  { label: "혜택", keys: ["discount", "freeDelivery"] },
] as const;
