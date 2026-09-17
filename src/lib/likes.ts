// 좋아요 localStorage 목업 — 상품 id 목록. 서버 없음.
export const LIKES_KEY = "fc-store:likes";
const CHANGE_EVENT = "fc-store:likes-change";

// 스냅샷은 원문 문자열(같은 값이면 같은 참조라 useSyncExternalStore 가 안정적)
export function readLikesRaw(): string {
  if (typeof window === "undefined") return "[]";
  try {
    return window.localStorage.getItem(LIKES_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

export function parseLikes(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function toggleLike(id: string): void {
  const likes = parseLikes(readLikesRaw());
  const next = likes.includes(id) ? likes.filter((v) => v !== id) : likes.concat(id);
  window.localStorage.setItem(LIKES_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// 같은 탭(toggleLike)과 다른 탭(storage 이벤트) 모두 구독
export function subscribeLikes(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
