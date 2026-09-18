import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { specialCards } from "@/data/quickMenu";
import { QuickMenuSpecial } from "./QuickMenuSpecial";

describe("QuickMenuSpecial", () => {
  afterEach(cleanup);

  it("스페셜 카드 20장 뒤에 '스페셜 전체보기' 타일, 모두 /products 링크", () => {
    render(<QuickMenuSpecial />);

    const links = within(screen.getByRole("region", { name: "스페셜" })).getAllByRole("link");
    expect(links).toHaveLength(specialCards.length + 1);
    expect(links.at(-1)).toHaveTextContent("스페셜 전체보기");
    links.forEach((a) => {
      expect(a).toHaveAttribute("href", "/products");
      expect(a).not.toHaveAttribute("target");
    });
  });

  it("영역은 모든 폭 좌우 16·옅은 회색, 카드 배경 없이 이미지가 칸을 덮는다(실측 158)", () => {
    render(<QuickMenuSpecial />);

    const section = screen.getByRole("region", { name: "스페셜" });
    expect(section).toHaveClass("px-4", "pt-3", "bg-surface-subtle");
    expect(section).not.toHaveClass("md:px-6");
    const cards = within(section).getAllByRole("link").slice(0, -1);
    expect(cards).toHaveLength(specialCards.length);
    cards.forEach((a) => expect(a).not.toHaveClass("bg-surface-subtle"));
    // 라벨은 이미지 위 surface 밴드에 얹는다(대비 4.5:1) — 밴드·글자가 같은 토큰 쌍이라 다크도 안전
    cards.forEach((a) => expect(a.querySelector("span")).toHaveClass("bg-surface/90", "text-ink"));
    screen.getAllByRole("img").forEach((img) => {
      expect(img).toHaveClass("object-cover");
      expect(img).not.toHaveClass("object-contain", "pb-4");
    });
  });

  it("'스페셜 전체보기' 타일은 gap-1·한 줄 글자·옅은 테두리 원·16px 화살표", () => {
    render(<QuickMenuSpecial />);

    const tile = within(screen.getByRole("region", { name: "스페셜" })).getAllByRole("link").at(-1)!;
    expect(tile).toHaveClass("gap-1", "whitespace-nowrap");
    expect(tile.querySelector("span")).toHaveClass("border-line-subtle");
    const svg = tile.querySelector("svg")!;
    expect(svg).toHaveAttribute("width", "16");
    expect(svg).toHaveAttribute("height", "16");
  });

  it("카드 이미지는 비어 있지 않은 한글 alt, 로컬 /images/ 경로", () => {
    render(<QuickMenuSpecial />);

    const imgs = screen.getAllByRole("img");
    expect(imgs).toHaveLength(specialCards.length);
    imgs.forEach((img, i) => {
      expect(img).toHaveAttribute("alt", specialCards[i].label);
      expect(img.getAttribute("alt")).toMatch(/[가-힣]/);
      expect(decodeURIComponent(img.getAttribute("src") ?? "")).toContain("/images/");
    });
  });
});
