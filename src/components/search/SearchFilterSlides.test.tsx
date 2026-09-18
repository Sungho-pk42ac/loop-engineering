import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { searchGoodsItems } from "@/data/search";
import { filterSearchGoods } from "@/lib/searchGoods";
import { SearchFilterBar } from "./SearchFilterBar";

let query = "keyword=%EB%A8%B8%EA%B7%B8&sortCode=NEW";
const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/search/goods",
  useSearchParams: () => new URLSearchParams(query),
}));

const openLayer = (name: RegExp) =>
  fireEvent.click(within(screen.getByRole("group", { name: "상세 필터" })).getByRole("button", { name }));
const lastUrl = () => new URLSearchParams(replace.mock.lastCall![0].split("?")[1]);

describe("필터 레이어 본문(#112)", () => {
  afterEach(() => {
    cleanup();
    replace.mockClear();
    query = "keyword=%EB%A8%B8%EA%B7%B8&sortCode=NEW";
  });

  it("탭을 누르면 전환 없이 그 슬라이드로 이동한다(translateX)", () => {
    render(<SearchFilterBar />);
    openLayer(/^카테고리/);

    const dialog = screen.getByRole("dialog");
    const track = dialog.querySelector("[style*='translateX']") as HTMLElement;
    expect(track.style.transform).toBe("translateX(-0%)");
    fireEvent.click(within(dialog).getByRole("tab", { name: /혜택/ }));
    expect((dialog.querySelector("[style*='translateX']") as HTMLElement).style.transform).toBe("translateX(-300%)");
  });

  it("'할인' 체크 시 즉시 쿼리·탭 숫자·적용 필터 줄·개수가 갱신되고 keyword·sortCode 는 유지", () => {
    render(<SearchFilterBar />);
    openLayer(/^혜택/);

    fireEvent.click(within(screen.getByRole("dialog")).getByLabelText("할인"));
    const params = lastUrl();
    expect(params.get("discount")).toBe("Y");
    expect(params.get("keyword")).toBe("머그");
    expect(params.get("sortCode")).toBe("NEW");

    cleanup();
    query = "keyword=%EB%A8%B8%EA%B7%B8&sortCode=NEW&discount=Y";
    render(<SearchFilterBar />);
    openLayer(/^혜택/);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByLabelText("할인")).toBeChecked();
    expect(within(dialog).getByRole("tab", { name: "혜택 1" })).toBeInTheDocument();
    const count = filterSearchGoods(searchGoodsItems, new URLSearchParams(query)).length;
    expect(within(dialog).getByRole("button", { name: `${count.toLocaleString("ko-KR")}개의 상품보기` })).toBeInTheDocument();
    expect(within(dialog).getByLabelText("할인 필터 제거")).toBeInTheDocument();
  });

  it("카테고리 체크박스는 콤마로 쌓이고, 별점 라디오는 빠른 필터 칩과 같은 쿼리를 쓴다", () => {
    query = "keyword=%EB%A8%B8%EA%B7%B8&category=kitchen";
    render(<SearchFilterBar />);
    openLayer(/^카테고리/);

    fireEvent.click(within(screen.getByRole("dialog")).getByLabelText("욕실"));
    expect(lastUrl().get("category")).toBe("kitchen,bath");

    cleanup();
    replace.mockClear();
    query = "keyword=%EB%A8%B8%EA%B7%B8&minReviewGrade=4.5";
    render(<SearchFilterBar />);
    expect(within(screen.getByRole("group", { name: "빠른 필터" })).getByRole("button", { name: "별점" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    openLayer(/^별점/);
    expect(within(screen.getByRole("dialog")).getByLabelText("4.5점 이상")).toBeChecked();
  });
});
