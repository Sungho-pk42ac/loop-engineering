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
  /** 종료 시각(ISO) — 카운트다운(#21) */
  endsAt: string;
  moreLabel: string;
  /** 칩 순서(#22) — 원본처럼 15개, '전체' 포함 한 줄 8칸 × 2줄 */
  brands: string[];
  products: ExhibitionProduct[];
}

const brands = [
  "패캠 키친",
  "우드웍스",
  "데일리백",
  "향기로운 집",
  "캠프온",
  "홈웨어랩",
  "모닝머그",
  "라이트룸",
  "그린테이블",
  "슬로우데이",
  "스토리지랩",
  "페이퍼앤코",
  "리빙노트",
  "코튼하우스",
  "블루포트",
];

const kinds = ["머그컵 세트", "원목 트레이", "캔버스 파우치", "소이 캔들", "스테인리스 텀블러", "리넨 슬리퍼"];

// 기획전 자리표시자 — 패캠 스토어 캠페인. 브랜드마다 상품 2개(총 30개, 원본 전체 개수). 이미지는 public/images 재사용.
export const exhibition: Exhibition = {
  title: "주방 소품 기획전",
  subtitle: "머그·도마·텀블러 최대 30% 할인",
  endsAt: "2026-09-30T23:59:59+09:00",
  moreLabel: "관련 세일 상품 더보기",
  brands,
  products: brands.flatMap((brand, b) =>
    [0, 1].map((k) => {
      const i = b * 2 + k;
      return {
        id: `ex-${i + 1}`,
        brand,
        name: `${brand} ${kinds[i % kinds.length]} ${k + 1}호`,
        price: 12000 + ((i * 3) % 10) * 2000,
        imageUrl: `/images/product-0${(i % 6) + 1}.png`,
      };
    }),
  ),
};

/** 선택 브랜드의 상품만. null('전체')이면 전부 */
export function filterByBrand(products: ExhibitionProduct[], brand: string | null): ExhibitionProduct[] {
  return brand === null ? products : products.filter((p) => p.brand === brand);
}
