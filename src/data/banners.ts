export interface Banner {
  id: string;
  /** 1~2줄. 줄바꿈은 \n */
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
}

// 전용 배너 이미지가 없어 상품 이미지를 재사용한다. 문구는 패캠 스토어 자리표시자.
export const banners: Banner[] = [
  { id: "b1", title: "매일 쓰는 머그\n새로 들였어요", subtitle: "주방 소품 기획전", imageUrl: "/images/product-01.png", href: "/products" },
  { id: "b2", title: "원목 도마\n선물 추천", subtitle: "최대 20% 할인", imageUrl: "/images/product-02.png", href: "/products" },
  { id: "b3", title: "가볍게 드는\n캔버스 에코백", subtitle: "데일리 가방 모음", imageUrl: "/images/product-03.png", href: "/products" },
  { id: "b4", title: "책상 위를\n정리하는 법", subtitle: "홈오피스 기획전", imageUrl: "/images/product-04.png", href: "/products" },
  { id: "b5", title: "이번 주\n신상품", subtitle: "패캠 스토어 단독", imageUrl: "/images/product-05.png", href: "/products" },
  { id: "b6", title: "시즌 오프\n마지막 기회", subtitle: "한정 수량", imageUrl: "/images/product-06.png", href: "/products" },
];
