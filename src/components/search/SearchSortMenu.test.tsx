import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { SearchSortMenu } from "./SearchSortMenu";

let query = "keyword=%EB%A8%B8%EA%B7%B8&gf=M";
const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/search/goods",
  useSearchParams: () => new URLSearchParams(query),
}));

const trigger = () => screen.getByRole("button", { expanded: false }) ?? screen.getAllByRole("button")[0];

describe("SearchSortMenu", () => {
  afterEach(() => {
    cleanup();
    replace.mockClear();
    query = "keyword=%EB%A8%B8%EA%B7%B8&gf=M";
  });

  it("Esc 로 메뉴가 닫힌다", () => {
    render(<SearchSortMenu />);
    fireEvent.click(trigger());
    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("기본 트리거는 '추천순', 누르면 항목 10개가 열린다", () => {
    render(<SearchSortMenu />);

    expect(trigger()).toHaveTextContent("추천순");
    fireEvent.click(trigger());
    const menu = screen.getByRole("menu");
    expect(screen.getAllByRole("button")[0]).toHaveAttribute("aria-expanded", "true");
    // 단일 6개 + 그룹 상위 4개 = menuitem 10개, 그룹은 aria-expanded 를 갖는다
    // 단일 6 + 정렬 안내 1 + 그룹 상위 4
    expect(within(menu).getAllByRole("menuitem")).toHaveLength(11);
    expect(within(menu).getAllByRole("menuitem", { expanded: false })).toHaveLength(4);
  });

  it("'낮은 가격순'을 고르면 메뉴가 닫히고 sortCode 만 바뀐다(다른 쿼리 유지)", () => {
    render(<SearchSortMenu />);

    fireEvent.click(trigger());
    fireEvent.click(screen.getByRole("menuitem", { name: "낮은 가격순" }));
    expect(replace).toHaveBeenCalledWith("/search/goods?keyword=%EB%A8%B8%EA%B7%B8&gf=M&sortCode=LOW_PRICE", { scroll: false });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("'판매금액순' 펼침 → '1주일' 선택, 다시 열면 그 그룹이 펼쳐진 채 '1주일'만 검정", () => {
    render(<SearchSortMenu />);

    fireEvent.click(trigger());
    fireEvent.click(screen.getByRole("menuitem", { name: "판매금액순" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "1주일" }));
    expect(replace).toHaveBeenCalledWith(expect.stringContaining("sortCode=SALE_ONE_WEEK_AMOUNT"), { scroll: false });

    cleanup();
    query = "keyword=%EB%A8%B8%EA%B7%B8&gf=M&sortCode=SALE_ONE_WEEK_AMOUNT";
    render(<SearchSortMenu />);
    expect(trigger()).toHaveTextContent("판매금액순 1주일");
    fireEvent.click(trigger());
    expect(screen.getByRole("menuitem", { name: "1주일" })).toHaveClass("text-ink");
    expect(screen.getByRole("menuitem", { name: "1일" })).toHaveClass("text-ink-muted");
  });
});
