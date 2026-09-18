import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { menuCategories } from "@/data/menu";
import { CategoryMenu } from "./CategoryMenu";

describe("CategoryMenu", () => {
  afterEach(cleanup);

  it("대분류 18개 버튼과 같은 순서의 구역 18개, 첫 대분류만 선택", () => {
    render(<CategoryMenu categories={menuCategories} />);

    const buttons = within(screen.getByRole("list", { name: "대분류" })).getAllByRole("button");
    expect(buttons).toHaveLength(18);
    buttons.forEach((b) => expect(b).toHaveAttribute("type", "button"));
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual(menuCategories.map((c) => c.label));
    expect(buttons[0]).toHaveAttribute("aria-current", "true");
    expect(buttons[0]).toHaveClass("bg-surface", "text-ink", "font-semibold");
    buttons.slice(1).forEach((b) => {
      expect(b).not.toHaveAttribute("aria-current");
      expect(b).toHaveClass("text-ink-muted");
      expect(b.className).not.toMatch(/hover:/);
    });
  });

  it("창 스크롤을 잠그지 않는다 — 아래 푸터까지 내려갈 수 있어야 한다 (실측 290)", () => {
    document.body.style.overflow = "";
    const { unmount } = render(<CategoryMenu categories={menuCategories} />);

    expect(document.body.style.overflow).toBe("");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("대분류를 누르면 우측 scrollTop 이 그 구역 offsetTop 으로, 우측 스크롤하면 선택이 따라간다", () => {
    render(<CategoryMenu categories={menuCategories} />);
    const sections = screen.getAllByRole("region");
    sections.forEach((s, i) => Object.defineProperty(s, "offsetTop", { value: i * 200 }));
    const right = sections[0].parentElement!;
    const buttons = within(screen.getByRole("list", { name: "대분류" })).getAllByRole("button");

    fireEvent.click(buttons[5]);
    expect(right.scrollTop).toBe(1000);
    expect(buttons[5]).toHaveAttribute("aria-current", "true");

    right.scrollTop = 1450;
    fireEvent.scroll(right);
    expect(buttons[7]).toHaveAttribute("aria-current", "true");
    expect(buttons[5]).not.toHaveAttribute("aria-current");
  });
});
