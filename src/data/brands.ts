export type BrandBadge = "단독" | "발매" | "쿠폰";

// 카테고리 칩(#27) — '전체' 다음 12개. 아이콘 자리는 원본처럼 3·4·5·6·11번째 칩(전체 포함 순서).
export const brandCategories = [
  "의류",
  "신발",
  "가방",
  "액세서리",
  "뷰티",
  "스포츠",
  "키즈",
  "라이프",
  "디지털",
  "아울렛",
  "부티크",
  "유즈드",
] as const;
export type BrandCategory = (typeof brandCategories)[number];

// 성별 파라미터 gf(#29): A 전체 · M 남성 · F 여성. 브랜드는 남성·여성·공용(U) 중 하나.
export type Gf = "A" | "M" | "F";
export type BrandGender = "M" | "F" | "U";

/** gf 쿼리 값 해석: 없음·알 수 없는 값은 A(전체) */
export function parseGf(value: string | null | undefined): Gf {
  return value === "M" || value === "F" ? value : "A";
}

export interface Brand {
  id: string;
  name: string;
  badge?: BrandBadge;
  category: BrandCategory;
  gender: BrandGender;
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
  category: brandCategories[i % brandCategories.length],
  gender: (["U", "M", "F"] as const)[i % 3],
}));

/** 성별로 거르기: A 는 전체, M·F 는 그 성별 + 공용 */
export function filterBrandsByGender(brands: Brand[], gf: Gf): Brand[] {
  return gf === "A" ? brands : brands.filter((b) => b.gender === gf || b.gender === "U");
}

// null = 전체
export function filterBrandsByCategory(brands: Brand[], category: BrandCategory | null): Brand[] {
  return category === null ? brands : brands.filter((b) => b.category === category);
}
