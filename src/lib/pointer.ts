import { useSyncExternalStore } from "react";

// 원본은 모바일 UA 에서 캐러셀 이전·다음 버튼을 렌더하지 않는다(#176·#157). UA 대신 기기 입력으로 판단한다.
// 서버·첫 렌더는 false(버튼 없음) — 호버해야 보이는 버튼이라 깜빡임이 없다. matchMedia 가 없으면 false.
const QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia?.(QUERY);
  mql?.addEventListener?.("change", onChange);
  return () => mql?.removeEventListener?.("change", onChange);
}

export function useHoverPointer(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia?.(QUERY).matches ?? false,
    () => false,
  );
}
