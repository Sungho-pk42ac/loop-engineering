import type { ExhibitionProduct } from "./exhibition";

// 스포츠 종목 아이템 추천(#31) — 제목 두 줄은 고정 문구, 상품 30개는 패캠 스토어 자리표시자(이미지·상세 id 는 기존 6종 순환).
export interface SportsPicks {
  /** 제목 1줄 */
  titleLine: string;
  /** 제목 2줄 — 종목 키워드 한 단어 */
  keyword: string;
  moreLabel: string;
  products: ExhibitionProduct[];
}

const brands = ["패캠 키친", "우드웍스", "데일리백", "캠프온", "모닝머그", "라이트룸"];
const names = ["보틀 홀더", "러닝 파우치", "스포츠 타월", "쿨링 텀블러", "메쉬 백", "그립 장갑"];
const discounts = [10, undefined, 20, 15, undefined, 30];
const shipping = ["오늘 출발", undefined, "무료배송", undefined, "오늘 출발", "무료배송"];

export const sportsPicks: SportsPicks = {
  titleLine: "이번 주 많이 찾은",
  keyword: "러닝",
  moreLabel: "더보기",
  products: Array.from({ length: 30 }, (_, i) => ({
    id: `sports-${i + 1}`,
    brand: brands[i % brands.length],
    name: `${brands[i % brands.length]} ${names[i % names.length]} ${Math.floor(i / 6) + 1}호`,
    price: 12000 + (i % 6) * 4000,
    imageUrl: `/images/product-0${(i % 6) + 1}.png`,
    discountRate: discounts[i % discounts.length],
    shippingBadge: shipping[i % shipping.length],
  })),
};

/** 카드 상세 링크용 기존 상품 id(1~6) 순환 */
export function detailIdOf(index: number): string {
  return String((index % 6) + 1);
}
