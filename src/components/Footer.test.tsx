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

  it("윗부분 링크는 같은 탭 /products, 최신 공지 1건에만 파란 점", () => {
    const { container } = render(<Footer />);

    const top = [
      screen.getByRole("list", { name: "스토어 바로가기" }),
      screen.getByRole("heading", { name: "공지사항" }).closest("section")!,
      screen.getByRole("heading", { name: "결제 혜택" }).closest("section")!,
    ];
    top.flatMap((el) => within(el as HTMLElement).queryAllByRole("link")).forEach((a) => {
      expect(a).toHaveAttribute("href", "/products");
      expect(a).not.toHaveAttribute("target");
    });
    expect(container.querySelectorAll("[data-new-dot]")).toHaveLength(1);
  });
});

describe("Footer 아랫부분", () => {
  afterEach(cleanup);

  it("열 제목 5개·약관 5개(첫 항목 굵게)·SNS 4개·mailto 1개", () => {
    render(<Footer />);

    const columns = screen.getByRole("region", { name: "사이트 링크" });
    expect(within(columns).getAllByRole("heading", { level: 2 })).toHaveLength(5);
    const terms = within(screen.getByRole("list", { name: "약관" })).getAllByRole("link");
    expect(terms).toHaveLength(5);
    expect(terms[0]).toHaveClass("font-bold");
    expect(within(screen.getByRole("list", { name: "SNS" })).getAllByRole("link")).toHaveLength(4);
    expect(screen.getAllByRole("link").filter((a) => a.getAttribute("href")?.startsWith("mailto:"))).toHaveLength(1);
  });

  it("새 탭 링크는 모두 rel=noopener noreferrer, mailto 를 뺀 모든 링크는 /products", () => {
    render(<Footer />);

    const links = within(screen.getByRole("contentinfo")).getAllByRole("link");
    links.forEach((a) => {
      if (a.getAttribute("target") === "_blank") expect(a).toHaveAttribute("rel", "noopener noreferrer");
      if (!a.getAttribute("href")?.startsWith("mailto:")) expect(a).toHaveAttribute("href", "/products");
    });
    expect(links.some((a) => a.getAttribute("target") === "_blank")).toBe(true);
  });

  it("원본 브랜드명 없이 가상 회사 정보가 보인다", () => {
    render(<Footer />);

    const text = screen.getByRole("contentinfo").textContent ?? "";
    expect(text).not.toMatch(/무신사|MUSINSA/i);
    expect(text).toContain("(주)패캠 스토어");
    expect(text).toContain("000-00-00000");
  });
});
