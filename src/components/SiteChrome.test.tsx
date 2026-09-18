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

  it.each(["/login", "/signup"])("%s 는 헤더·푸터 없이 본문만 렌더한다 (#277)", (path) => {
    pathname = path;
    renderChrome();

    expect(screen.queryByRole("banner")).toBeNull();
    expect(screen.queryByRole("contentinfo")).toBeNull();
    expect(screen.queryByRole("main")).toBeNull();
    expect(screen.getByText("본문")).toBeInTheDocument();
  });
});
