import type { ExhibitionProduct } from "./exhibition";

// 카테고리 트렌드(#35) — 브랜드 로고 칩 10개 + 칩마다 교체되는 1줄 상품 캐러셀.
// 무신사 브랜드·상품을 가져오지 않는다. 브랜드·상품명은 패캠 스토어 자리표시자이고 이미지는 기존 6종을 순환한다.
export interface TrendBrand {
  id: string;
  name: string;
  /** 로고 에셋이 없어 이름 첫 글자를 원형 칩에 띄운다 */
  initial: string;
}

export interface CategoryTrend {
  /** 제목 1줄(고정 문구) */
  titleLine: string;
  /** 제목 2줄 — '<카테고리명> 추천' */
  keyword: string;
  moreLabel: string;
  brands: TrendBrand[];
  products: Record<string, ExhibitionProduct[]>;
}

const brandNames = [
  "패캠 키친",
  "우드웍스",
  "데일리백",
  "캠프온",
  "모닝머그",
  "라이트룸",
  "코지홈",
  "그린테이블",
  "슬로우핏",
  "노트앤펜",
];

const itemNames = ["머그 세트", "우드 도마", "코튼 백", "캔들 홀더", "티 포트", "오브제 조명"];
const discounts = [15, undefined, 25, 10, undefined, 30];
const shipping = ["오늘 출발", undefined, "무료배송", undefined, "오늘 출발", "무료배송"];

const brands: TrendBrand[] = brandNames.map((name, i) => ({
  id: `trend-brand-${i + 1}`,
  name,
  initial: name.charAt(0),
}));

/** 브랜드마다 상품 10개 — 브랜드가 바뀌면 목록이 통째로 교체된다 */
function productsOf(brand: TrendBrand, index: number): ExhibitionProduct[] {
  return Array.from({ length: 10 }, (_, i) => {
    const slot = (index + i) % 6;
    return {
      id: `${brand.id}-${i + 1}`,
      brand: brand.name,
      name: `${brand.name} ${itemNames[slot]} ${i + 1}호`,
      price: 12000 + slot * 3000 + i * 500,
      imageUrl: `/images/product-0${slot + 1}.png`,
      discountRate: discounts[slot],
      shippingBadge: shipping[slot],
    };
  });
}

export const categoryTrend: CategoryTrend = {
  titleLine: "카테고리 트렌드",
  keyword: "주방 소품 추천",
  moreLabel: "더보기",
  brands,
  products: Object.fromEntries(brands.map((brand, i) => [brand.id, productsOf(brand, i)])),
};

/** 선택 브랜드의 상품 목록. 없는 id 면 첫 브랜드로 떨어뜨린다 */
export function trendProductsOf(brandId: string): ExhibitionProduct[] {
  return categoryTrend.products[brandId] ?? categoryTrend.products[categoryTrend.brands[0].id];
}
