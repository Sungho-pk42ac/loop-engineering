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
