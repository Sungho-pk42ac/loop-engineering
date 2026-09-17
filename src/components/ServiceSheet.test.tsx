import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { SHEET_DELAY_MS, SHEET_STORAGE_KEY, ServiceSheet } from "./ServiceSheet";

const today = () => new Date().toLocaleDateString("sv-SE");

const mockMedia = (mobile: boolean) =>
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: query === "(max-width: 767px)" ? mobile : false }));

const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

describe("ServiceSheet", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    document.body.style.overflow = "";
    mockMedia(true);
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("모바일에서 0.5초 뒤 딤·시트가 뜨고 스크롤 잠금·오늘 날짜 기록, 링크 13개 모두 /products·이미지 alt", () => {
    render(<ServiceSheet />);
    expect(screen.queryByRole("dialog")).toBeNull();

    advance(SHEET_DELAY_MS);
    const dialog = screen.getByRole("dialog", { name: "서비스 바로가기" });
    expect(document.body.style.overflow).toBe("hidden");
    expect(localStorage.getItem(SHEET_STORAGE_KEY)).toBe(today());

    const links = within(dialog).getAllByRole("link");
    expect(links).toHaveLength(13);
    links.forEach((a) => expect(a).toHaveAttribute("href", "/products"));
    within(dialog).getAllByRole("img").forEach((img) => expect(img.getAttribute("alt")).toBeTruthy());
    expect(screen.getByRole("button", { name: "닫기" })).toHaveFocus();
  });

  it("딤·시트·그리드·뱃지 토큰 클래스", () => {
    render(<ServiceSheet />);
    advance(SHEET_DELAY_MS);
    const dialog = screen.getByRole("dialog");

    expect(dialog).toHaveClass("z-modal", "bg-surface-subtle");
    expect(document.querySelector(".bg-surface-overlay")).toHaveClass("z-overlay");
    expect(within(dialog).getAllByRole("list")[0]).toHaveClass("grid-cols-2", "gap-1", "px-4");
    expect(within(dialog).getByText("광고")).toHaveClass("rounded-xs", "text-caption");
  });

  it.each([
    ["닫기 버튼", () => fireEvent.click(screen.getByRole("button", { name: "닫기" }))],
    ["Esc", () => fireEvent.keyDown(document, { key: "Escape" })],
  ])("%s(으)로 닫으면 즉시 스크롤 잠금 해제, 애니메이션 뒤 DOM 에서 제거", (_, doClose) => {
    render(<ServiceSheet />);
    advance(SHEET_DELAY_MS);

    doClose();
    expect(document.body.style.overflow).toBe("");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    advance(250); // 딤 페이드 + 시트 내려감
    advance(250); // 시트 페이드
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("오늘 이미 떴거나 데스크톱이면 뜨지 않는다", () => {
    localStorage.setItem(SHEET_STORAGE_KEY, today());
    render(<ServiceSheet />);
    advance(SHEET_DELAY_MS);
    expect(screen.queryByRole("dialog")).toBeNull();
    cleanup();

    localStorage.clear();
    mockMedia(false);
    render(<ServiceSheet />);
    advance(SHEET_DELAY_MS);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
