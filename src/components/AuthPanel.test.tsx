import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AuthPanel } from "./AuthPanel";

const back = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ back }) }));

describe("AuthPanel", () => {
  afterEach(() => {
    cleanup();
    back.mockClear();
  });

  it("회색 배경 위 600px 흰 패널·52px 상단 바·14px 제목 (실측 277)", () => {
    render(
      <AuthPanel title="로그인">
        <p>폼</p>
      </AuthPanel>,
    );

    const title = screen.getByRole("heading", { name: "로그인" });
    expect(title).toHaveClass("text-body", "text-ink");
    const bar = title.parentElement!;
    expect(bar).toHaveClass("h-13", "bg-surface-subtle", "px-4", "py-3");
    const panel = bar.parentElement!;
    expect(panel).toHaveClass("max-w-150", "bg-surface", "mx-auto");
    expect(panel.parentElement).toHaveClass("bg-surface-subtle");
    // 전역 <main> 이 없는 화면이라 패널이 본문 랜드마크를 맡는다
    const main = screen.getByRole("main");
    expect(main).toHaveClass("px-4");
    expect(main).toContainElement(screen.getByText("폼"));
  });

  it("뒤로 가기 버튼은 모바일 전용이고 누르면 router.back()", () => {
    render(
      <AuthPanel title="회원가입">
        <p>폼</p>
      </AuthPanel>,
    );

    const button = screen.getByRole("button", { name: "뒤로 가기" });
    expect(button).toHaveClass("md:hidden");
    fireEvent.click(button);
    expect(back).toHaveBeenCalledTimes(1);
  });
});
