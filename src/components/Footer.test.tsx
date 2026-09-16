import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer 윗부분", () => {
  afterEach(cleanup);

  it("스토어 타일 9개·공지 3줄·결제 혜택 5줄·결제수단 칩 8개", () => {
    render(<Footer />);

    expect(within(screen.getByRole("list", { name: "스토어 바로가기" })).getAllByRole("listitem")).toHaveLength(9);
    const notices = within(screen.getByRole("heading", { name: "공지사항" }).closest("section")!);
    expect(notices.getAllByRole("listitem")).toHaveLength(3);
    const benefits = within(screen.getByRole("heading", { name: "결제 혜택" }).closest("section")!);
    expect(benefits.getAllByRole("listitem")).toHaveLength(5 + 8);
    expect(within(screen.getByRole("list", { name: "결제수단" })).getAllByRole("listitem")).toHaveLength(8);
  });

  it("모든 링크는 같은 탭 /products, 최신 공지 1건에만 파란 점", () => {
    const { container } = render(<Footer />);

    const links = within(screen.getByRole("contentinfo")).getAllByRole("link");
    links.forEach((a) => {
      expect(a).toHaveAttribute("href", "/products");
      expect(a).not.toHaveAttribute("target");
    });
    expect(container.querySelectorAll("[data-new-dot]")).toHaveLength(1);
  });
});
