export interface QuickMenuCard {
  id: string;
  label: string;
  imageUrl: string;
}

// 스페셜 카드 20장 — 패캠 스토어 자리표시자 라벨, 이미지는 상품 이미지 재사용.
const labels = [
  "주방 소품",
  "홈카페",
  "캠핑 용품",
  "데스크 정리",
  "욕실 소품",
  "침구 모음",
  "수납 정리",
  "조명 기획",
  "가방 모음",
  "선물 추천",
  "여행 준비",
  "반려 용품",
  "문구 모음",
  "향 좋은 집",
  "식기 세트",
  "텀블러",
  "리빙 신상",
  "단독 판매",
  "시즌 오프",
  "오늘의 특가",
];

export const specialCards: QuickMenuCard[] = labels.map((label, i) => ({
  id: `special-${i + 1}`,
  label,
  imageUrl: `/images/product-0${(i % 6) + 1}.png`,
}));
