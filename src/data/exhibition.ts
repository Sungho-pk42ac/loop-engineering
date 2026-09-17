export interface ExhibitionProduct {
  id: string;
  brand: string;
  name: string;
  /** 원 단위 정수 */
  price: number;
  imageUrl: string;
}

export interface Exhibition {
  title: string;
  subtitle: string;
  /** 종료 시각(ISO) — 카운트다운(#21)이 쓴다 */
  endsAt: string;
  moreLabel: string;
  products: ExhibitionProduct[];
}

// 기획전 자리표시자 — 패캠 스토어 캠페인. 상품 이미지는 public/images 재사용.
export const exhibition: Exhibition = {
  title: "주방 소품 기획전",
  subtitle: "머그·도마·텀블러 최대 30% 할인",
  endsAt: "2026-09-30T23:59:59+09:00",
  moreLabel: "관련 세일 상품 더보기",
  products: [
    { id: "ex-1", brand: "패캠 키친", name: "미니멀 화이트 머그컵 2개 세트", price: 21000, imageUrl: "/images/product-01.png" },
    { id: "ex-2", brand: "우드웍스", name: "원목 도마 대·소 세트", price: 26000, imageUrl: "/images/product-02.png" },
    { id: "ex-3", brand: "데일리백", name: "코튼 캔버스 에코백", price: 15000, imageUrl: "/images/product-03.png" },
    { id: "ex-4", brand: "향기로운 집", name: "아로마 소이 캔들 우디", price: 19000, imageUrl: "/images/product-04.png" },
    { id: "ex-5", brand: "캠프온", name: "스테인리스 텀블러 500ml", price: 22000, imageUrl: "/images/product-05.png" },
    { id: "ex-6", brand: "홈웨어랩", name: "리넨 룸슬리퍼", price: 12000, imageUrl: "/images/product-06.png" },
  ],
};
