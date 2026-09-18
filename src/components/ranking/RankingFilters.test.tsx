import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { rankingChips } from "@/data/ranking";
import { RankingFilters } from "./RankingFilters";

let params = new URLSearchParams("subPan=product");
const replace = vi.fn((url: string) => {
  params = new URLSearchParams(url.split("?")[1] ?? "");
});
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/main/musinsa/ranking",
  useSearchParams: () => params,
}));

describe("RankingFilters", () => {
  afterEach(() => {
    cleanup();
    replace.mockClear();
    params = new URLSearchParams("subPan=product");
  });

  it("두 번째 칩을 누르면 sectionId 만 교체(다른 쿼리 유지)하고 그 칩이 선택된다", () => {
    const { rerender } = render(<RankingFilters />);
    const second = rankingChips[1];

    fireEvent.click(screen.getByRole("button", { name: second.label }));
    expect(replace).toHaveBeenCalledWith(`/main/musinsa/ranking?subPan=product&sectionId=${second.sectionId}`, {
      scroll: false,
    });

    rerender(<RankingFilters />);
    const chip = screen.getByRole("button", { name: second.label });
    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(chip).toHaveClass("font-semibold");
  });

  it("텍스트 탭은 categoryCode, 기간 드롭다운 DAILY 는 period=DAILY", () => {
    render(<RankingFilters />);

    fireEvent.click(screen.getByRole("button", { name: "머그·컵" }));
    expect(replace).toHaveBeenLastCalledWith(expect.stringContaining("categoryCode=101"), { scroll: false });

    fireEvent.click(screen.getByRole("button", { name: "실시간" }));
    fireEvent.click(screen.getByRole("menuitemradio", { name: "일간" }));
    expect(replace).toHaveBeenLastCalledWith(expect.stringContaining("period=DAILY"), { scroll: false });
  });

  it("드롭다운: 열면 aria-expanded·패널, 옵션 선택 시 닫히고 라벨 교체, 다른 드롭다운을 열면 앞의 것은 닫힌다", () => {
    const { rerender } = render(<RankingFilters />);

    const period = screen.getByRole("button", { name: "실시간" });
    fireEvent.click(period);
    expect(period).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("menuitemradio", { name: "주간" }));
    rerender(<RankingFilters />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "주간" })).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(screen.getByRole("button", { name: "전체 연령" }));
    fireEvent.click(screen.getByRole("button", { name: "품절 포함" }));
    expect(screen.getAllByRole("menu")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "전체 연령" })).toHaveAttribute("aria-expanded", "false");
  });

  it("기본값을 고르면 해당 쿼리를 URL 에서 뺀다", () => {
    params = new URLSearchParams("subPan=product&period=DAILY");
    render(<RankingFilters />);

    fireEvent.click(screen.getByRole("button", { name: "일간" }));
    fireEvent.click(screen.getByRole("menuitemradio", { name: "실시간" }));
    expect(replace).toHaveBeenLastCalledWith("/main/musinsa/ranking?subPan=product", { scroll: false });
  });
});
