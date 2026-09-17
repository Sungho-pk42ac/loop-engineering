import "@testing-library/jest-dom/vitest";

// jsdom 에는 matchMedia 가 없다. 기본값은 데스크톱(호버 가능한 정밀 포인터, 동작 줄이기 꺼짐)으로 둔다.
// 모바일·줄임 모션 동작을 보는 테스트는 각자 vi.stubGlobal("matchMedia", …) 로 덮어쓴다.
window.matchMedia ??= (query: string) =>
  ({
    matches: query === "(hover: hover) and (pointer: fine)",
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;
