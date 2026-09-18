import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { serviceButtons } from "@/data/quickMenu";
import { QuickMenuServices } from "./QuickMenuServices";

describe("QuickMenuServices", () => {
  afterEach(cleanup);

  it("서비스 버튼 약 10개 + 마지막 '서비스 전체보기', 모두 아이콘·한글 라벨·같은 탭 /products", () => {
    render(<QuickMenuServices />);

    const links = within(screen.getByRole("navigation", { name: "서비스 바로가기" })).getAllByRole("link");
    expect(links).toHaveLength(serviceButtons.length);
    expect(links.length).toBeGreaterThanOrEqual(10);
    expect(links.at(-1)).toHaveTextContent("서비스 전체보기");
    links.forEach((a) => {
      expect(a).toHaveAttribute("href", "/products");
      expect(a).not.toHaveAttribute("target");
      expect(a.querySelector("svg")).not.toBeNull();
      expect(a.textContent).toMatch(/[가-힣]/);
    });
  });

  it("영역 좌우는 md 이상에서도 16, 버튼은 세로 padding·가운데 정렬(실측 166)", () => {
    render(<QuickMenuServices />);

    const nav = screen.getByRole("navigation", { name: "서비스 바로가기" });
    expect(nav).toHaveClass("md:px-4");
    expect(nav).not.toHaveClass("md:px-6");
    within(nav)
      .getAllByRole("link")
      .forEach((a) => expect(a).toHaveClass("py-1", "justify-center", "h-9", "pl-1", "pr-2"));
    // 모바일 한 줄 가로 스크롤(#16) 유지
    expect(nav.querySelector("ul")).toHaveClass("w-max", "px-4");
  });
});
