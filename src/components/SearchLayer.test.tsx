import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { popularKeywords, risingKeywords } from "@/data/search";
import { addRecentSearch, parseRecent, readRecentRaw } from "@/lib/recentSearches";
import { searchResultHref } from "@/lib/search";
import { Header } from "./Header";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }), usePathname: () => "/products" }));

function openLayer() {
  render(<Header />);
  fireEvent.click(screen.getByRole("button", { name: /할인|신상품|가방/ }));
  return screen.getByRole("dialog", { name: "검색" });
}

describe("헤더 로고·검색창 줄 / SearchLayer", () => {
  afterEach(() => {
    cleanup();
    push.mockClear();
    localStorage.clear();
  });

  it("최근 검색어: 이력이 없으면 블록이 없고, 있으면 제목·모두삭제·칩이 보인다 (#270)", () => {
    expect(within(openLayer()).queryByRole("heading", { name: "최근 검색어" })).toBeNull();
    cleanup();

    addRecentSearch("머그컵");
    addRecentSearch("도마");
    const layer = openLayer();

    expect(within(layer).getByRole("heading", { name: "최근 검색어" })).toBeInTheDocument();
    expect(within(layer).getByRole("button", { name: "모두삭제" })).toBeInTheDocument();
    // 최근 것이 앞
    const chips = within(layer).getAllByRole("button", { name: /^(도마|머그컵)$/ });
    expect(chips.map((b) => b.textContent)).toEqual(["도마", "머그컵"]);

    // 항목 × 는 그 항목만 지운다
    fireEvent.click(within(layer).getByRole("button", { name: "도마 삭제" }));
    expect(parseRecent(readRecentRaw()).map((i) => i.keyword)).toEqual(["머그컵"]);
    expect(within(layer).queryByRole("button", { name: "도마" })).toBeNull();

    // 모두삭제 → 블록이 사라진다
    fireEvent.click(within(layer).getByRole("button", { name: "모두삭제" }));
    expect(screen.queryByRole("heading", { name: "최근 검색어" })).toBeNull();
  });

  it("최근 검색어 칩을 누르면 결과로 이동하며 레이어가 닫히고, 검색하면 맨 앞에 쌓인다 (#270)", () => {
    addRecentSearch("머그컵");
    const layer = openLayer();

    fireEvent.click(within(layer).getByRole("button", { name: "머그컵" }));
    expect(push).toHaveBeenCalledWith(searchResultHref("머그컵"));
    expect(screen.queryByRole("dialog")).toBeNull();

    cleanup();
    const reopened = openLayer();
    const input = within(reopened).getByLabelText("검색어");
    fireEvent.change(input, { target: { value: "도마" } });
    fireEvent.submit(input.closest("form")!);
    expect(parseRecent(readRecentRaw()).map((i) => i.keyword)).toEqual(["도마", "머그컵"]);
  });

  it("스토어 바 아래 줄에 패캠 스토어 로고 링크와 검색창, 앱테크·알림 링크가 있다", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "패캠 스토어" })).toHaveAttribute("href", "/products");
    expect(screen.getByRole("button", { name: /할인|신상품|가방/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "앱테크" })).toHaveAttribute("href", "/products");
    expect(screen.getByRole("link", { name: "알림" })).toHaveAttribute("href", "/products");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("검색창을 누르면 레이어가 열리고 입력칸에 포커스, 닫기 버튼으로 닫힌다", () => {
    const dialog = openLayer();

    expect(within(dialog).getByPlaceholderText("검색어를 입력하세요")).toHaveFocus();
    fireEvent.click(within(dialog).getByRole("button", { name: "닫기" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Esc 키로 닫힌다", () => {
    openLayer();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("인기 검색어 1~10위(변동 표시)와 급상승 검색어 1~10위가 순위와 함께 렌더된다", () => {
    const dialog = openLayer();

    const popular = within(within(dialog).getByRole("region", { name: "인기 검색어" })).getAllByRole("link");
    expect(popular).toHaveLength(10);
    popular.forEach((link, i) => {
      expect(link).toHaveTextContent(`${i + 1}${popularKeywords[i].keyword}`);
      expect(within(link).getByText(/^(상승|하락|유지)$/)).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/products");
    });

    const rising = within(within(dialog).getByRole("region", { name: "급상승 검색어" })).getAllByRole("link");
    expect(rising).toHaveLength(10);
    rising.forEach((link, i) => expect(link).toHaveTextContent(`${i + 1}${risingKeywords[i]}`));
  });

  it("검색어 입력 후 Enter 면 검색 결과로 이동하고 레이어가 닫힌다", () => {
    const dialog = openLayer();

    fireEvent.change(within(dialog).getByPlaceholderText("검색어를 입력하세요"), { target: { value: "니트" } });
    fireEvent.submit(within(dialog).getByPlaceholderText("검색어를 입력하세요"));

    expect(push).toHaveBeenCalledWith("/search/goods?keyword=%EB%8B%88%ED%8A%B8&keywordType=keyword&gf=A");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("빈 검색어로 Enter 면 기존처럼 /products", () => {
    const dialog = openLayer();

    fireEvent.submit(within(dialog).getByPlaceholderText("검색어를 입력하세요"));
    expect(push).toHaveBeenCalledWith("/products");
  });
});
