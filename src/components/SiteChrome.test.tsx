import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { SiteChrome } from "./SiteChrome";

let pathname = "/products";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

const renderChrome = () =>
  render(
    <SiteChrome header={<header>헤더</header>} footer={<footer>푸터</footer>}>
      <p>본문</p>
    </SiteChrome>,
  );

describe("SiteChrome", () => {
  afterEach(() => {
    cleanup();
    pathname = "/products";
  });

  it("일반 경로는 헤더 → main → 푸터를 그대로 렌더한다", () => {
    renderChrome();

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("본문");
  });

  it("/menu/category 는 푸터를 모바일에서만 감춘다 — 폭 분기는 CSS (이슈 293)", () => {
    pathname = "/menu/category";
    renderChrome();

    const footer = screen.getByRole("contentinfo");
    expect(footer.parentElement).toHaveClass("hidden", "md:block");
    // 헤더·본문은 그대로
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("본문");
  });

  it("다른 경로의 푸터는 래퍼 없이 그대로 렌더된다", () => {
    renderChrome();

    expect(screen.getByRole("contentinfo").parentElement).not.toHaveClass("hidden");
  });

  it.each(["/login", "/signup"])("%s 는 헤더·푸터 없이 본문만 렌더한다 (이슈 277)", (path) => {
    pathname = path;
    renderChrome();

    expect(screen.queryByRole("banner")).toBeNull();
    expect(screen.queryByRole("contentinfo")).toBeNull();
    expect(screen.queryByRole("main")).toBeNull();
    expect(screen.getByText("본문")).toBeInTheDocument();
  });
});
