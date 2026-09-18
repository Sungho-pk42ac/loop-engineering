import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { searchGoodsItems } from "@/data/search";
import { filterSearchGoods } from "@/lib/searchGoods";
import { SearchFilterBar } from "./SearchFilterBar";

let query = "keyword=%EB%A8%B8%EA%B7%B8&sortCode=LOW_PRICE";
const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/search/goods",
  useSearchParams: () => new URLSearchParams(query),
}));

const lastUrl = () => new URLSearchParams(replace.mock.lastCall![0].split("?")[1]);

describe("SearchFilterBar", () => {
  afterEach(() => {
    cleanup();
    replace.mockClear();
    query = "keyword=%EB%A8%B8%EA%B7%B8&sortCode=LOW_PRICE";
  });

  it("빠른 필터 '별점'을 누르면 minReviewGrade 가 붙고 keyword·sortCode 는 유지", () => {
    render(<SearchFilterBar />);

    const quick = within(screen.getByRole("group", { name: "빠른 필터" }));
    const chip = quick.getByRole("button", { name: "별점" });
    expect(chip).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(chip);
    const params = lastUrl();
    expect(params.get("minReviewGrade")).toBe("4.5");
    expect(params.get("keyword")).toBe("머그");
    expect(params.get("sortCode")).toBe("LOW_PRICE");
  });

  it("필터가 있으면 적용 필터 줄과 상세필터 점이 보이고, × 는 그 쿼리만 뺀다", () => {
    query = "keyword=%EB%A8%B8%EA%B7%B8&minReviewGrade=4.5&gf=M";
    render(<SearchFilterBar />);

    const quick = within(screen.getByRole("group", { name: "빠른 필터" }));
    expect(quick.getByRole("button", { name: "별점" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "상세필터" }).querySelector(".bg-accent")).not.toBeNull();
    // 별점 칩 라벨은 선택 값(reviewGradeOptions)으로 표시된다(#112)
    fireEvent.click(screen.getByLabelText("4.5점 이상 필터 제거"));
    const params = lastUrl();
    expect(params.get("minReviewGrade")).toBeNull();
    expect(params.get("gf")).toBe("M");
  });

  it("'남' 재클릭은 gf=A, 초기화는 필터 쿼리를 모두 빼고 gf=A(정렬 유지)", () => {
    query = "keyword=%EB%A8%B8%EA%B7%B8&sortCode=NEW&gf=M&discount=Y&freeDelivery=Y";
    render(<SearchFilterBar />);

    fireEvent.click(screen.getByRole("button", { name: "남" }));
    expect(lastUrl().get("gf")).toBe("A");

    fireEvent.click(screen.getByRole("button", { name: "초기화" }));
    const params = lastUrl();
    expect(params.get("gf")).toBe("A");
    expect(params.get("discount")).toBeNull();
    expect(params.get("freeDelivery")).toBeNull();
    expect(params.get("sortCode")).toBe("NEW");
  });

  it("드롭다운 칩을 누르면 필터 레이어가 열리고 딤·닫기·'N개의 상품보기'로 닫힌다(Esc 는 안 닫힘)", () => {
    query = "keyword=%EB%A8%B8%EA%B7%B8&discount=Y";
    render(<SearchFilterBar />);

    fireEvent.click(screen.getByRole("button", { name: /혜택/ }));
    const dialog = screen.getByRole("dialog", { name: "필터" });
    expect(within(dialog).getAllByRole("tab")).toHaveLength(4);
    const count = filterSearchGoods(searchGoodsItems, new URLSearchParams(query)).length;
    expect(within(dialog).getByRole("button", { name: `${count.toLocaleString("ko-KR")}개의 상품보기` })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: "닫기" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
