export interface GnbTab {
  label: string;
  href: string;
}

// 원본 순서. 앱에 페이지가 없는 탭은 /products 로 간다.
export const gnbTabs: GnbTab[] = [
  { label: "콘텐츠", href: "/products" },
  { label: "추천", href: "/products" },
  { label: "랭킹", href: "/main/musinsa/ranking" },
  { label: "세일", href: "/products" },
  { label: "발매", href: "/products" },
];

// 추천 화면이 곧 /products 다.
export const CURRENT_TAB_BY_PATH: Record<string, string> = { "/products": "추천", "/main/musinsa/ranking": "랭킹" };

// 기획전 탭 — 두 줄 라벨(\n), 패캠 스토어 자리표시자 문구.
export const promoTabs: GnbTab[] = [
  { label: "주방 소품\n기획전", href: "/products" },
  { label: "홈카페\n모음전", href: "/products" },
  { label: "캠핑 용품\n특가", href: "/products" },
  { label: "데스크 정리\n기획전", href: "/products" },
  { label: "가을 침구\n미리 보기", href: "/products" },
  { label: "선물 추천\n모음", href: "/products" },
];
