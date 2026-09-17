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
});
