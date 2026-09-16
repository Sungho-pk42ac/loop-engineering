import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { GnbTabs } from "./GnbTabs";

const pathname = vi.fn(() => "/products");
vi.mock("next/navigation", () => ({ usePathname: () => pathname() }));

describe("GnbTabs", () => {
  afterEach(cleanup);

  it("콘텐츠·추천·랭킹·세일·발매 순서 뒤에 기획전 탭, 모두 /products 로 간다", () => {
    render(<GnbTabs />);

    const links = within(screen.getByRole("navigation", { name: "메인 메뉴" })).getAllByRole("link");
    expect(links.map((a) => a.textContent)).toEqual(["콘텐츠", "추천", "랭킹", "세일", "발매", "주방 소품\n기획전"]);
    links.forEach((a) => expect(a).toHaveAttribute("href", "/products"));
  });

  it("/products 에서는 추천 탭 하나만 aria-current·굵은 글씨·밑줄", () => {
    render(<GnbTabs />);

    const current = screen.getAllByRole("link").filter((a) => a.getAttribute("aria-current") === "page");
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent("추천");
    expect(current[0]).toHaveClass("font-bold", "border-ink-inverse");
  });

  it("다른 경로에서는 현재 탭이 없다", () => {
    pathname.mockReturnValueOnce("/login");
    render(<GnbTabs />);

    expect(screen.getAllByRole("link").some((a) => a.hasAttribute("aria-current"))).toBe(false);
  });
});
