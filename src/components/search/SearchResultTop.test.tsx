import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { resultTabs } from "@/data/search";
import { SearchResultTop } from "./SearchResultTop";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), back: vi.fn() }) }));

const query = "keyword=%EB%8B%88%ED%8A%B8&keywordType=keyword&gf=A";

describe("SearchResultTop", () => {
  afterEach(cleanup);

  it("검색창 버튼에 검색어가 보이고, 누르면 검색 레이어가 열린다", () => {
    render(<SearchResultTop keyword="니트" query={query} />);

    fireEvent.click(screen.getByRole("button", { name: "니트" }));
    expect(screen.getByRole("dialog", { name: "검색" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("검색어를 입력하세요")).toHaveValue("니트");
  });

  it("상품 탭은 현재 쿼리를 유지하고 나머지 5개 탭은 /products", () => {
    render(<SearchResultTop keyword="니트" query={query} />);

    const tabs = within(screen.getByRole("navigation", { name: "검색 결과 탭" })).getAllByRole("link");
    expect(tabs.map((a) => a.textContent)).toEqual(resultTabs.map((t) => t.label));
    expect(tabs[0]).toHaveAttribute("href", `/search/goods?${query}`);
    expect(tabs[0]).toHaveAttribute("aria-current", "page");
    tabs.slice(1).forEach((a) => expect(a).toHaveAttribute("href", "/products"));
  });

  it("모바일 전용 뒤로·장바구니 아이콘 버튼(aria-label, md 이상 숨김)", () => {
    render(<SearchResultTop keyword="니트" query={query} />);

    expect(screen.getByRole("button", { name: "뒤로" })).toHaveClass("md:hidden");
    expect(screen.getByRole("link", { name: "장바구니" })).toHaveClass("md:hidden");
  });
});
