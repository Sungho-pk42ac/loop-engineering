// 24x24 stroke 아이콘. d 는 path 데이터, 색은 currentColor 를 따른다.
export function Icon({ d, size = 20 }: { d: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="shrink-0">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const ICON_PATHS = {
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5",
  close: "M6 6l12 12M18 6L6 18",
} as const;
