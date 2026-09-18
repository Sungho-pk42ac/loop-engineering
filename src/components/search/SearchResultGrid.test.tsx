import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { GRID_BATCH, GRID_TOTAL, SearchResultGrid } from "./SearchResultGrid";

let query = "";
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => "/search/goods",
  useSearchParams: () => new URLSearchParams(query),
}));

let intersect: (on?: boolean) => void = () => {};
let rootMargin = "";

class MockObserver {
  constructor(
    private cb: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    rootMargin = options?.rootMargin ?? "";
  }
  observe() {
    intersect = (on = true) =>
      this.cb([{ isIntersecting: on } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
  disconnect() {}
}

describe("SearchResultGrid", () => {
  beforeEach(() => vi.stubGlobal("IntersectionObserver", MockObserver));
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    query = "";
  });

  const cards = () => within(screen.getByRole("list")).getAllByRole("listitem");

  it("간격 0 그리드: 데스크톱 6칸·모바일 기본 3칸, 카드 이미지는 next/image + alt 상품명", () => {
    render(<SearchResultGrid />);

    const list = screen.getByRole("list");
    expect(list).toHaveClass("grid-cols-3", "md:grid-cols-6", "max-w-wide");
    expect(list.className).not.toMatch(/\bgap-/);
    expect(cards()).toHaveLength(GRID_BATCH);
    within(list)
      .getAllByRole("img")
      .forEach((img) => expect(img.getAttribute("alt")).toBeTruthy());
    // 같은 줄 카드 높이가 달라도 칸을 채워 회색 틈이 없게(#109 QA)
    within(list)
      .getAllByRole("link")
      .forEach((a) => expect(a).toHaveClass("h-full", "bg-surface"));
  });

  it("열 보기 버튼: 3칸 ↔ 2칸, aria-label 2열 보기 ↔ 3열 보기, URL 불변", () => {
    render(<SearchResultGrid />);
    const href = location.href;

    fireEvent.click(screen.getByRole("button", { name: "2열 보기" }));
    expect(screen.getByRole("list")).toHaveClass("grid-cols-2");
    fireEvent.click(screen.getByRole("button", { name: "3열 보기" }));
    expect(screen.getByRole("list")).toHaveClass("grid-cols-3");
    expect(location.href).toBe(href);
  });

  it("센티널 교차 1회 = 한 묶음만, 보이는 상태가 이어지면 더 붙지 않는다 (실측 228)", () => {
    render(<SearchResultGrid />);
    expect(cards()).toHaveLength(GRID_BATCH);

    act(() => intersect());
    expect(cards()).toHaveLength(GRID_BATCH * 2);
    // 같은 교차 상태에서 콜백이 연달아 와도 늘지 않는다(연쇄 발동 방지)
    for (let i = 0; i < 5; i++) act(() => intersect());
    expect(cards()).toHaveLength(GRID_BATCH * 2);
    // 발동 거리는 바닥 약 2,000px
    expect(rootMargin).toBe("2000px 0px");
  });

  it("필터로 총량이 바뀌면 교차 상태를 버려 다음 묶음이 계속 붙는다", () => {
    query = "discount=Y";
    const { rerender } = render(<SearchResultGrid />);

    act(() => intersect());
    const narrowed = cards().length;
    query = "";
    rerender(<SearchResultGrid />);
    act(() => intersect());
    expect(cards().length).toBeGreaterThan(narrowed);
  });

  it("센티널이 나갔다 다시 들어오면 다음 묶음이 붙고, 총량에서 멈춘다", () => {
    render(<SearchResultGrid />);

    act(() => intersect());
    act(() => intersect(false));
    act(() => intersect());
    expect(cards()).toHaveLength(Math.min(GRID_BATCH * 3, GRID_TOTAL));

    for (let i = 0; i < 10; i++) {
      act(() => intersect(false));
      act(() => intersect());
    }
    expect(cards()).toHaveLength(GRID_TOTAL);
    // 총량에 닿으면 센티널(div.h-px)이 사라진다
    expect(screen.getByRole("list").parentElement!.querySelector("div.h-px")).toBeNull();
  });
});
