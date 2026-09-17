export type BrandBadge = "단독" | "발매" | "쿠폰";

export interface Brand {
  id: string;
  name: string;
  badge?: BrandBadge;
}

// 주목할 만한 브랜드(#26) — 패캠 스토어 자리표시자 브랜드명(원본 브랜드명·로고 복제 금지). 원본 120칸 중 대부분에 혜택 배지.
// 원본처럼 6줄 × 20열 = 120칸. 한 단어가 칸 폭(56)을 넘지 않게 짧은 이름(5자 이하)으로 조합한다.
const prefixes = ["패캠", "우드", "모닝", "코튼", "블루", "그린", "캔들", "리틀", "선데", "하루", "포근", "라탄"];
const suffixes = ["키친", "웍스", "하우스", "머그", "랩", "마켓", "룸", "앤코", "데이", "백"];
const names = suffixes.flatMap((suffix) => prefixes.map((prefix) => prefix + suffix));
const badges: (BrandBadge | undefined)[] = ["단독", "쿠폰", undefined, "발매", "쿠폰", "단독", "쿠폰"];

export const notableBrands: Brand[] = names.map((name, i) => ({
  id: `brand-${i + 1}`,
  name,
  badge: badges[i % badges.length],
}));
