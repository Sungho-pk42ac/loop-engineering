import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { popularKeywords, risingKeywords } from "@/data/search";
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
