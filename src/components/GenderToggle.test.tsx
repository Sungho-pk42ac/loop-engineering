import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { GenderToggle } from "./GenderToggle";

let query = "";
const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/products",
  useSearchParams: () => new URLSearchParams(query),
}));

describe("GenderToggle", () => {
  afterEach(() => {
    cleanup();
    replace.mockClear();
    query = "";
  });

  it("하단 가운데 고정 알약에 전체·남성·여성 버튼, gf 없으면 '전체' 선택", () => {
    render(<GenderToggle />);

    const group = screen.getByRole("group", { name: "성별" });
    expect(group).toHaveClass("fixed", "bottom-3", "left-1/2", "rounded-full");
    const buttons = within(group).getAllByRole("button");
    expect(buttons.map((b) => b.textContent)).toEqual(["전체", "남성", "여성"]);
    buttons.forEach((b, i) => {
      expect(b).toHaveAttribute("type", "button");
      expect(b).toHaveAttribute("aria-pressed", String(i === 0));
    });
    expect(buttons[0]).toHaveClass("text-ink-inverse");
  });

  it("?gf=F 면 '여성' 선택·커서 이동, 누르면 스크롤 유지하며 쿼리만 교체", () => {
    query = "gf=F&x=1";
    render(<GenderToggle />);

    expect(screen.getByRole("button", { name: "여성" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("group", { name: "성별" }).querySelector("[aria-hidden]")).toHaveClass("translate-x-22");

    fireEvent.click(screen.getByRole("button", { name: "남성" }));
    expect(replace).toHaveBeenCalledWith("/products?gf=M&x=1", { scroll: false });
  });

  it("잘못된 gf 값은 '전체'", () => {
    query = "gf=X";
    render(<GenderToggle />);
    expect(screen.getByRole("button", { name: "전체" })).toHaveAttribute("aria-pressed", "true");
  });
});
