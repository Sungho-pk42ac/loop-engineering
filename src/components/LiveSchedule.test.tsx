import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { liveBroadcasts } from "@/data/lives";
import { LiveSchedule } from "./LiveSchedule";

describe("LiveSchedule", () => {
  afterEach(cleanup);

  it("제목·'더보기'(/products)·카드 8장이 가로 스크롤 줄로 렌더된다", () => {
    render(<LiveSchedule />);

    const section = screen.getByRole("region", { name: "라이브 편성표" });
    expect(within(section).getByRole("link", { name: "더보기" })).toHaveAttribute("href", "/products");
    const list = within(section).getByRole("list");
    expect(list).toHaveClass("overflow-x-auto");
    expect(within(list).getAllByRole("listitem")).toHaveLength(8);
  });

  it("배지는 MM.DD 오후 HH:MM · 내일 오후 HH:MM · 라이브 종료 중 하나, 혜택 문구는 줄 수 말줄임", () => {
    render(<LiveSchedule />);

    for (const live of liveBroadcasts) {
      expect(live.badge).toMatch(/^(\d{2}\.\d{2} 오후 \d{2}:\d{2}|내일 오후 \d{2}:\d{2}|라이브 종료)$/);
      expect(screen.getAllByText(live.badge, { selector: "span" }).length).toBeGreaterThan(0);
    }
    expect(screen.getByText(liveBroadcasts[0].benefit).className).toMatch(/line-clamp-/);
  });

  it("카드·더보기 링크는 새 탭(rel=noopener noreferrer) /products, 이미지 alt 는 한글", () => {
    render(<LiveSchedule />);

    screen.getAllByRole("link").forEach((a) => {
      expect(a).toHaveAttribute("href", "/products");
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", "noopener noreferrer");
    });
    screen.getAllByRole("img").forEach((img) => expect(img.getAttribute("alt")).toMatch(/[가-힣]/));
  });

  it("원본 실측 여백(#173): 머리 줄·카드 줄 px-4, 스냅 여백 md:scroll-px-4, 더보기 -mr-1, 혜택 mt-1·line-clamp-4", () => {
    render(<LiveSchedule />);

    const section = screen.getByRole("region", { name: "라이브 편성표" });
    const header = within(section).getByRole("heading", { name: "라이브 편성표" }).parentElement!;
    const list = within(section).getByRole("list");
    expect(header).toHaveClass("px-4");
    expect(header.className).not.toMatch(/md:px-6/);
    expect(list).toHaveClass("px-4", "md:scroll-px-4");
    expect(list.className).not.toMatch(/md:px-6|md:scroll-px-6/);
    expect(within(section).getByRole("link", { name: "더보기" })).toHaveClass("-mr-1");
    expect(screen.getByText(liveBroadcasts[0].benefit)).toHaveClass("mt-1", "line-clamp-4");
  });
});
