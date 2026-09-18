import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { gnbTabs, promoTabs } from "@/data/gnb";
import { GnbTabs } from "./GnbTabs";

const pathname = vi.fn(() => "/products");
vi.mock("next/navigation", () => ({ usePathname: () => pathname() }));

describe("GnbTabs", () => {
  afterEach(cleanup);

  it("콘텐츠·추천·광고·랭킹·세일·발매 뒤에 기획전 탭 6개, 광고·기획전은 /products", () => {
    render(<GnbTabs />);

    const nav = screen.getByRole("navigation", { name: "메인 메뉴" });
    expect(nav).toHaveClass("px-2");
    expect(nav).not.toHaveClass("max-w-page");
    expect(nav.querySelector("ul")!.className).not.toMatch(/\bgap-/);
    const links = within(nav).getAllByRole("link");
    expect(links.map((a) => a.getAttribute("aria-label") ?? a.textContent)).toEqual([
      "콘텐츠",
      "추천",
      "광고",
      "랭킹",
      "세일",
      "발매",
      ...promoTabs.map((t) => t.label),
    ]);
    const tabs = links.filter((a) => gnbTabs.some((t) => t.label === a.textContent));
    tabs.forEach((a) => {
      expect(a).toHaveClass("px-2", "text-body");
      expect(a.getAttribute("href")).toBe(gnbTabs.find((t) => t.label === a.textContent)!.href);
    });
    links.slice(6).forEach((a) => {
      expect(a).toHaveClass("text-detail", "font-semibold", "text-ink-promo-inverse");
      expect(a).toHaveAttribute("href", "/products");
    });
    expect(links[2]).toHaveAttribute("href", "/products");
    // 랭킹만 랭킹 경로, 나머지 탭은 /products (#128 이 dev 에서 추가한 기대)
    expect(links.find((a) => a.textContent === "랭킹")).toHaveAttribute("href", "/main/musinsa/ranking");
    links.forEach((a) => expect(a.className).not.toMatch(/hover:/));
  });

  it("/products 에서는 추천 탭 하나만 aria-current·굵은 글씨, 밑줄은 링크가 아닌 글자 요소에", () => {
    render(<GnbTabs />);

    const current = screen.getAllByRole("link").filter((a) => a.getAttribute("aria-current") === "page");
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent("추천");
    expect(current[0]).toHaveClass("font-bold");
    expect(current[0]).not.toHaveClass("border-ink-inverse");
    expect(current[0].firstElementChild).toHaveClass("border-b", "border-ink-inverse");
    screen
      .getAllByRole("link")
      .filter((a) => gnbTabs.some((t) => t.label === a.textContent) && a !== current[0])
      .forEach((a) => expect(a).toHaveClass("font-regular", "text-ink-inverse-muted"));
  });

  it("랭킹 경로에서는 랭킹 탭이 현재 탭", () => {
    pathname.mockReturnValueOnce("/main/musinsa/ranking");
    render(<GnbTabs />);

    const current = screen.getAllByRole("link").filter((a) => a.getAttribute("aria-current") === "page");
    expect(current.map((a) => a.textContent)).toEqual(["랭킹"]);
  });

  it("다른 경로에서는 현재 탭이 없다", () => {
    pathname.mockReturnValueOnce("/login");
    render(<GnbTabs />);

    expect(screen.getAllByRole("link").some((a) => a.hasAttribute("aria-current"))).toBe(false);
  });
});
