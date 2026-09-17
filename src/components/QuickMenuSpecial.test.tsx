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
