export interface ServiceSheetLink {
  label: string;
  imageUrl: string;
}

// 모바일 진입 시트(#164) — 패캠 스토어 자리표시자 라벨, 이미지는 상품 이미지 재사용. 링크는 모두 /products.
const image = (n: number) => `/images/product-0${(n % 6) + 1}.png`;

export const serviceSheetTiles: ServiceSheetLink[] = [
  "타임세일",
  "라이브",
  "랭킹",
  "쿠폰",
  "기획전",
  "신상품",
  "오늘 도착",
  "선물하기",
  "이벤트",
  "스타일 콘텐츠",
].map((label, i) => ({ label, imageUrl: image(i) }));

export const serviceSheetAd: ServiceSheetLink & { badge: string } = {
  label: "주방 소품 기획전 최대 20% 할인",
  imageUrl: "/images/product-01.png",
  badge: "광고",
};

export const serviceSheetBottomLinks: ServiceSheetLink[] = [
  { label: "패캠 스토어 앱", imageUrl: "/images/product-02.png" },
  { label: "오늘의 특가", imageUrl: "/images/product-03.png" },
];
