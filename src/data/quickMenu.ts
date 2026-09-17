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

export interface QuickMenuService {
  label: string;
  /** 24px 아이콘 자리에 들어갈 stroke path */
  icon: string;
}

// 서비스 바로가기 10개 + '서비스 전체보기'(#15). 앱에 서비스 페이지가 없어 모두 /products.
export const serviceButtons: QuickMenuService[] = [
  { label: "타임세일", icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2" },
  { label: "라이브", icon: "M4 7h16v11H4zM10 10l4 2.5-4 2.5z" },
  { label: "랭킹", icon: "M6 20V10M12 20V4M18 20v-7" },
  { label: "쿠폰", icon: "M3 7h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4zM14 7v12" },
  { label: "기획전", icon: "M4 4h16v16H4zM4 9h16M9 9v11" },
  { label: "신상품", icon: "M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" },
  { label: "오늘 도착", icon: "M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
  { label: "선물하기", icon: "M4 11h16v9H4zM3 7h18v4H3zM12 7v13" },
  { label: "이벤트", icon: "M4 20l5-14 9 9-14 5zM14 4v2M18 6l-1.5 1.5M20 10h-2" },
  { label: "스타일 콘텐츠", icon: "M4 5h16v14H4zM4 15l5-5 4 4 3-3 4 4" },
  { label: "서비스 전체보기", icon: "M4 6h16M4 12h16M4 18h16" },
];
