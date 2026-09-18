export interface MenuCategory {
  id: string;
  label: string;
}

// 카테고리 메뉴 상단 탭(#116 모양만, 전환은 #118).
export const menuTabs = ["카테고리", "브랜드", "서비스", "오프라인 스토어", "팬 스토어"] as const;

// 대분류 18개 — 패캠 스토어 자리표시자 라벨(원본 카테고리명 목록을 옮기지 않는다). 중분류는 #117.
export const menuCategories: MenuCategory[] = [
  "주방",
  "식기",
  "컵·머그",
  "텀블러",
  "조리도구",
  "수납·정리",
  "욕실",
  "침구",
  "쿠션·패브릭",
  "조명",
  "캔들·향",
  "데스크",
  "문구",
  "가방",
  "캠핑",
  "반려 용품",
  "선물",
  "시즌 오프",
].map((label, i) => ({ id: `category-${i + 1}`, label }));
