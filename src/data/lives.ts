export interface LiveBroadcast {
  id: string;
  imageUrl: string;
  /** 굵은 첫 줄(브랜드·방송명) — 이미지 alt 로도 쓴다 */
  brand: string;
  benefit: string;
  /** 배지 문구: `MM.DD 오후 HH:MM` · `내일 오후 HH:MM` · `라이브 종료` */
  badge: string;
}

// 라이브 편성표 자리표시자 — 패캠 스토어 라이브, 상품 이미지 재사용.
export const liveBroadcasts: LiveBroadcast[] = [
  { id: "live-1", imageUrl: "/images/product-01.png", brand: "패캠 키친 라이브", benefit: "머그컵 전 품목 최대 30% 할인과 방송 중 구매 고객 전원 코스터 증정", badge: "09.18 오후 07:00" },
  { id: "live-2", imageUrl: "/images/product-02.png", brand: "우드웍스 원목 도마 특집", benefit: "라이브 단독 세트 구성, 선착순 100명 추가 5% 쿠폰", badge: "09.19 오후 08:00" },
  { id: "live-3", imageUrl: "/images/product-03.png", brand: "데일리 에코백 라이브", benefit: "신상 컬러 첫 공개와 2개 구매 시 10% 추가 할인. 방송 중 댓글 이벤트로 파우치를 드립니다.", badge: "내일 오후 06:30" },
  { id: "live-4", imageUrl: "/images/product-04.png", brand: "향기로운 집 캔들 쇼", benefit: "소이 캔들 1+1", badge: "09.20 오후 09:00" },
  { id: "live-5", imageUrl: "/images/product-05.png", brand: "캠핑 텀블러 라이브", benefit: "보온·보냉 텀블러 라이브 특가와 무료 각인 서비스", badge: "09.21 오후 07:30" },
  { id: "live-6", imageUrl: "/images/product-06.png", brand: "홈웨어 룸슬리퍼 특가", benefit: "리넨 슬리퍼 전 사이즈 방송 한정가", badge: "09.22 오후 08:00" },
  { id: "live-7", imageUrl: "/images/product-01.png", brand: "주방 소품 모음전", benefit: "주방 소품 20종 최대 40% 할인", badge: "라이브 종료" },
  { id: "live-8", imageUrl: "/images/product-03.png", brand: "가방 신상 미리보기", benefit: "사전 알림 신청 시 적립금 2천원", badge: "라이브 종료" },
];
