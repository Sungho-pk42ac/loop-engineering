import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BUBBLE_ANIMATED_KEY, BUBBLE_ENTER_CLASS, resetBubbleModeCache, StoreBubble } from "./StoreBubble";

const bubble = () => screen.queryByRole("button", { name: /패캠 팬스토어 굿즈를 만나보세요/ });

describe("StoreBubble", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    resetBubbleModeCache();
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("첫 렌더에 문구 2줄 버튼이 보이고, 누르면 사라진다. 닫기 버튼은 없다", () => {
    render(<StoreBubble />);

    expect(bubble()).toHaveTextContent("지금 확인해 보세요");
    expect(screen.queryByRole("button", { name: /닫기/ })).not.toBeInTheDocument();
    fireEvent.click(bubble()!);
    expect(bubble()).not.toBeInTheDocument();
  });

  it("sessionStorage 키가 없으면 애니메이션 클래스를 붙이고 키를 저장한다. localStorage 는 쓰지 않는다", () => {
    const localSet = vi.spyOn(Storage.prototype, "setItem");
    render(<StoreBubble />);

    expect(bubble()!.className).toContain(BUBBLE_ENTER_CLASS);
    expect(sessionStorage.getItem(BUBBLE_ANIMATED_KEY)).not.toBeNull();
    expect(localStorage.length).toBe(0);
    localSet.mock.contexts.forEach((ctx) => expect(ctx).toBe(sessionStorage));
  });

  it("키가 있으면 애니메이션 클래스 없이 렌더된다", () => {
    sessionStorage.setItem(BUBBLE_ANIMATED_KEY, "1");
    render(<StoreBubble />);

    expect(bubble()!.className).not.toContain(BUBBLE_ENTER_CLASS);
  });

  it("두 자리에 렌더돼도(헤더 데스크톱·모바일) 첫 방문이면 둘 다 애니메이션 클래스(#134)", () => {
    render(
      <>
        <StoreBubble />
        <StoreBubble />
      </>,
    );

    const bubbles = screen.getAllByRole("button", { name: /패캠 팬스토어 굿즈를 만나보세요/ });
    expect(bubbles).toHaveLength(2);
    bubbles.forEach((b) => expect(b.className).toContain(BUBBLE_ENTER_CLASS));
  });
});
