export interface GnbTab {
  label: string;
  href: string;
}

// 원본 순서. 앱에 해당 페이지가 없어 모두 /products 로 간다.
export const gnbTabs: GnbTab[] = [
  { label: "콘텐츠", href: "/products" },
  { label: "추천", href: "/products" },
  { label: "랭킹", href: "/products" },
  { label: "세일", href: "/products" },
  { label: "발매", href: "/products" },
];

// 추천 화면이 곧 /products 다.
export const CURRENT_TAB_BY_PATH: Record<string, string> = { "/products": "추천" };

// 기획전 탭 — 두 줄 라벨(\n), 패캠 스토어 자리표시자 문구.
export const promoTab: GnbTab = { label: "주방 소품\n기획전", href: "/products" };
