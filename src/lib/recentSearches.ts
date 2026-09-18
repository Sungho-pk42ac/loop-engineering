// 최근 검색어 localStorage 목업(#270) — 서버 없음. likes.ts 와 같은 read raw / parse / mutate / subscribe 4종 패턴.
export const RECENT_SEARCHES_KEY = "fc-store:recent-searches";
const CHANGE_EVENT = "fc-store:recent-searches-change";
const MAX = 10;

/** at 은 ISO 문자열 — #271 의 MM.DD 표시가 쓴다 */
export interface RecentSearch {
  keyword: string;
  at: string;
}

// 스냅샷은 원문 문자열(같은 값이면 같은 참조라 useSyncExternalStore 가 안정적)
export function readRecentRaw(): string {
  if (typeof window === "undefined") return "[]";
  try {
    return window.localStorage.getItem(RECENT_SEARCHES_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

export function parseRecent(raw: string): RecentSearch[] {
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter(
      (v): v is RecentSearch =>
        typeof v === "object" && v !== null && typeof (v as RecentSearch).keyword === "string" && typeof (v as RecentSearch).at === "string",
    );
  } catch {
    return [];
  }
}

function save(next: RecentSearch[]): void {
  window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** 맨 앞 삽입. 같은 검색어는 앞으로 옮기고 최대 10개만 남긴다 */
export function addRecentSearch(keyword: string): void {
  const value = keyword.trim();
  if (!value) return;
  const rest = parseRecent(readRecentRaw()).filter((item) => item.keyword !== value);
  save([{ keyword: value, at: new Date().toISOString() }, ...rest].slice(0, MAX));
}

export function removeRecentSearch(keyword: string): void {
  save(parseRecent(readRecentRaw()).filter((item) => item.keyword !== keyword));
}

export function clearRecentSearches(): void {
  save([]);
}

// 같은 탭(위 함수들)과 다른 탭(storage 이벤트) 모두 구독
export function subscribeRecent(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
