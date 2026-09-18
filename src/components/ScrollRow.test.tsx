import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ScrollRow } from "./ScrollRow";

// jsdom 은 레이아웃이 없어 스크롤 치수를 흉내 낸다: 보이는 폭 1000, 전체 2400 → 끝 1400.
function setMetrics(el: HTMLElement, scrollLeft: number) {
  Object.defineProperty(el, "clientWidth", { configurable: true, value: 1000 });
  Object.defineProperty(el, "scrollWidth", { configurable: true, value: 2400 });
  Object.defineProperty(el, "scrollLeft", { configurable: true, value: scrollLeft, writable: true });
}

function renderRow() {
  render(
    <ScrollRow listClassName="overflow-x-auto" prevLabel="이전 라이브 보기" nextLabel="다음 라이브 보기">
      <li>카드</li>
    </ScrollRow>,
  );
  const list = screen.getByRole("list");
  return list;
}

const scrollTo = (list: HTMLElement, left: number) =>
  act(() => {
    setMetrics(list, left);
    fireEvent.scroll(list);
  });

describe("ScrollRow", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("처음 위치에서는 '다음'만 있고 '이전'은 DOM 에 없다. 두 버튼은 한글 aria-label·평소 숨김(호버 시 표시)", () => {
    const list = renderRow();
    scrollTo(list, 0);

    const next = screen.getByRole("button", { name: "다음 라이브 보기" });
    expect(screen.queryByRole("button", { name: "이전 라이브 보기" })).not.toBeInTheDocument();
    expect(next).toHaveClass("invisible", "opacity-0", "group-hover:visible", "group-hover:opacity-100");
  });

  it("'다음'을 누르면 한 화면씩 스크롤하고, 중간에서는 두 버튼, 끝에서는 '다음'이 사라진다", () => {
    const list = renderRow();
    scrollTo(list, 0);
    const scrollBy = vi.fn();
    list.scrollBy = scrollBy;

    fireEvent.click(screen.getByRole("button", { name: "다음 라이브 보기" }));
    expect(scrollBy).toHaveBeenCalledWith(expect.objectContaining({ left: 1000 }));

    scrollTo(list, 1000);
    expect(screen.getByRole("button", { name: "이전 라이브 보기" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다음 라이브 보기" })).toBeInTheDocument();

    scrollTo(list, 1400);
    expect(screen.getByRole("button", { name: "이전 라이브 보기" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "다음 라이브 보기" })).not.toBeInTheDocument();
  });

  it("이전·다음 꺾쇠는 SVG 40×40·선 1.5·각진 끝(원본 실측 175)", () => {
    const list = renderRow();
    scrollTo(list, 1000); // 가운데 — 두 버튼이 모두 있는 위치

    ["이전 라이브 보기", "다음 라이브 보기"].forEach((name) => {
      const svg = screen.getByRole("button", { name }).querySelector("svg")!;
      expect(svg).toHaveAttribute("width", "40");
      expect(svg).toHaveAttribute("height", "40");
      expect(svg).toHaveAttribute("viewBox", "0 0 40 40");
      expect(svg).toHaveAttribute("stroke-width", "1.5");
      const path = svg.querySelector("path")!;
      expect(path).toHaveAttribute("stroke-linecap", "butt");
      expect(path).toHaveAttribute("stroke-linejoin", "miter");
    });
  });

  it("step 을 주면 그 거리만큼 이동한다(기본은 clientWidth)", () => {
    render(
      <ScrollRow listClassName="overflow-x-auto" prevLabel="이전" nextLabel="다음" step={() => 520}>
        <li>카드</li>
      </ScrollRow>,
    );
    const list = screen.getByRole("list");
    scrollTo(list, 0);
    const scrollBy = vi.fn();
    list.scrollBy = scrollBy;

    fireEvent.click(screen.getByRole("button", { name: "다음" }));
    expect(scrollBy).toHaveBeenCalledWith(expect.objectContaining({ left: 520 }));
  });
});
