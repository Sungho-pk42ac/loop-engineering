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
  check: "M5 12l4 4 10-10",
  chevronDown: "M6 9l6 6 6-6",
  chevronLeft: "M14 6l-6 6 6 6",
  eye: "M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  eyeOff: "M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M6.7 6.8C4 8.3 2 12 2 12s3.6 6 10 6c1.7 0 3.2-.4 4.5-1M9.9 6.2A9.9 9.9 0 0 1 12 6c6.4 0 10 6 10 6a18 18 0 0 1-2.7 3.3",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01",
} as const;
