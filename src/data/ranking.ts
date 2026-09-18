// 랭킹 필터 정의 — 라벨은 패캠 스토어 자리표시자(원본 칩·탭 라벨은 옮기지 않는다).

export interface RankingChip {
  label: string;
  sectionId: string;
  /** 칩 앞 16px 아이콘 path(선택) */
  icon?: string;
}

export interface RankingTab {
  label: string;
  categoryCode: string;
}

export interface DropdownOption {
  value: string;
  label: string;
}

export interface RankingDropdown {
  param: string;
  /** 기본값을 고르면 URL 에서 쿼리를 뺀다 */
  defaultValue: string;
  options: DropdownOption[];
}

export const rankingChips: RankingChip[] = [
  { label: "전체", sectionId: "200" },
  { label: "급상승", sectionId: "201", icon: "M4 16l6-6 4 4 6-6M14 8h6v6" },
  { label: "신상품", sectionId: "202", icon: "M12 3v4M12 17v4M3 12h4M17 12h4" },
  { label: "리빙", sectionId: "203" },
  { label: "주방", sectionId: "204" },
  { label: "가방", sectionId: "205" },
  { label: "문구", sectionId: "206" },
  { label: "선물", sectionId: "207" },
];

export const rankingTabs: RankingTab[] = [
  { label: "전체", categoryCode: "000" },
  { label: "머그·컵", categoryCode: "101" },
  { label: "도마·식기", categoryCode: "102" },
  { label: "에코백", categoryCode: "103" },
  { label: "캔들·향", categoryCode: "104" },
  { label: "텀블러", categoryCode: "105" },
  { label: "슬리퍼", categoryCode: "106" },
  { label: "수납", categoryCode: "107" },
  { label: "조명", categoryCode: "108" },
];

export const rankingDropdowns: RankingDropdown[] = [
  {
    param: "gf",
    defaultValue: "A",
    options: [
      { value: "A", label: "전체" },
      { value: "M", label: "남성" },
      { value: "F", label: "여성" },
    ],
  },
  {
    param: "ageBand",
    defaultValue: "AGE_BAND_ALL",
    options: [
      { value: "AGE_BAND_ALL", label: "전체 연령" },
      { value: "AGE_BAND_20", label: "20대" },
      { value: "AGE_BAND_30", label: "30대" },
    ],
  },
  {
    param: "period",
    defaultValue: "REALTIME",
    options: [
      { value: "REALTIME", label: "실시간" },
      { value: "DAILY", label: "일간" },
      { value: "WEEKLY", label: "주간" },
    ],
  },
  {
    param: "excludeSoldOut",
    defaultValue: "false",
    options: [
      { value: "false", label: "품절 포함" },
      { value: "true", label: "품절 제외" },
    ],
  },
];

/** 쿼리 값이 목록에 없거나 비어 있으면 기본값 */
export function pickValue<T extends string>(raw: string | null, allowed: readonly T[], fallback: T): T {
  return raw !== null && (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback;
}
