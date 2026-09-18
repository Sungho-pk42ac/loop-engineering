import type { ExhibitionProduct } from "./exhibition";

// 트렌드 뷰티 추천(#34) — 5열×2줄 고정 그리드용 자리표시자 10개.
export interface BeautyPicksProduct extends ExhibitionProduct {
  /** 가격 아래 '옵션비 별도' 표시 */
  optionExtra?: boolean;
}

export interface BeautyPicks {
  titleLine: string;
  keyword: string;
  moreLabel: string;
  products: BeautyPicksProduct[];
}

const brands = ["향기로운 집", "모닝머그", "라이트룸", "코튼하우스", "슬로우데이"];
const names = ["수분 크림", "핸드 워시", "바디 로션", "향기 미스트", "클렌징 바"];

export const beautyPicks: BeautyPicks = {
  titleLine: "요즘 많이 찾는",
  keyword: "뷰티",
  moreLabel: "더보기",
  products: Array.from({ length: 10 }, (_, i) => ({
    id: `beauty-${i + 1}`,
    brand: brands[i % brands.length],
    name: `${brands[i % brands.length]} ${names[i % names.length]} ${Math.floor(i / 5) + 1}호`,
    price: 14000 + (i % 5) * 6000,
    imageUrl: `/images/product-0${(i % 6) + 1}.png`,
    discountRate: i % 3 === 0 ? 15 : undefined,
    optionExtra: i % 4 === 0,
  })),
};
