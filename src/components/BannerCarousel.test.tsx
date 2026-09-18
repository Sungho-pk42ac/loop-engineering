import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { banners } from "@/data/banners";
import { AUTOPLAY_MS, BannerCarousel } from "./BannerCarousel";

describe("BannerCarousel", () => {
  afterEach(cleanup);

  it("배너 4장 이상이 같은 탭 /products 링크로, 이미지·제목·부제와 함께 렌더된다", () => {
    render(<BannerCarousel />);

    const links = within(screen.getByRole("region", { name: "기획전 배너" })).getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(4);
    expect(links).toHaveLength(banners.length);

    links.forEach((link, i) => {
      const banner = banners[i];
      expect(link).toHaveAttribute("href", "/products");
      expect(link).not.toHaveAttribute("target");

      const img = within(link).getByRole("img");
      expect(img.getAttribute("alt")).toBeTruthy();
      expect(decodeURIComponent(img.getAttribute("src") ?? "")).toContain("/images/");
      expect(link).toHaveTextContent(banner.title.replace("\n", " "));
      expect(within(link).getByText(banner.subtitle)).toBeInTheDocument();
    });
  });

  it("3초마다 scrollTo 로 넘기고, 언마운트하면 타이머를 해제한다", () => {
    vi.useFakeTimers();
    const scrollTo = vi.fn();
    Element.prototype.scrollTo = scrollTo;
    // jsdom 은 레이아웃이 없어 넘칠 폭을 흉내 낸다.
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(2880);
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(1440);
    const { unmount } = render(<BannerCarousel />);

    vi.advanceTimersByTime(AUTOPLAY_MS);
    expect(scrollTo).toHaveBeenCalledTimes(1);
    unmount();
    vi.advanceTimersByTime(AUTOPLAY_MS * 3);
    expect(scrollTo).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("이전·다음 배너 보기 버튼(type=button)이 있고 인디케이터는 없다", () => {
    render(<BannerCarousel />);

    for (const name of ["이전 배너 보기", "다음 배너 보기"]) {
      expect(screen.getByRole("button", { name })).toHaveAttribute("type", "button");
    }
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("이전·다음 꺾쇠는 40×40 · 선 1.5 · 각진 끝(butt/miter), 원본 실측(#156)", () => {
    render(<BannerCarousel />);

    for (const name of ["이전 배너 보기", "다음 배너 보기"]) {
      const svg = screen.getByRole("button", { name }).querySelector("svg")!;
      expect(svg).toHaveAttribute("width", "40");
      expect(svg).toHaveAttribute("height", "40");
      expect(svg).toHaveAttribute("viewBox", "0 0 40 40");
      expect(svg).toHaveAttribute("stroke-width", "1.5");
      const path = svg.querySelector("path")!;
      expect(path).toHaveAttribute("stroke-linecap", "butt");
      expect(path).toHaveAttribute("stroke-linejoin", "miter");
    }
  });
});
