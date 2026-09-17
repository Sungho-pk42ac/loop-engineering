import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { GRID_BATCH, GRID_TOTAL, SearchResultGrid } from "./SearchResultGrid";

let query = "";
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => "/search/goods",
  useSearchParams: () => new URLSearchParams(query),
}));

let intersect: () => void = () => {};

class MockObserver {
  constructor(private cb: IntersectionObserverCallback) {}
  observe() {
    intersect = () => this.cb([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
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

  it("센티널이 보이면 다음 묶음을 붙이고, 총량에 닿으면 더 늘지 않는다", () => {
    render(<SearchResultGrid />);

    act(() => intersect());
    expect(cards()).toHaveLength(GRID_BATCH * 2);
    for (let i = 0; i < 10; i++) act(() => intersect());
    expect(cards()).toHaveLength(GRID_TOTAL);
  });
});
