import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { banners } from "@/data/banners";
import { BannerCarousel } from "./BannerCarousel";

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
});
