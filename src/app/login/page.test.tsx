import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { signUp } from "@/lib/auth";
import LoginPage from "./page";

const push = vi.fn();
const back = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, back }) }));

describe("/login 폼 (실측 278)", () => {
  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
    render(<LoginPage />);
  });
  afterEach(cleanup);

  it("상단 브랜드 줄이 h1 이고 안내 부제가 따라온다 (실측 282)", () => {
    const brand = screen.getByRole("heading", { level: 1 });
    expect(brand).toHaveTextContent("패캠 스토어");
    expect(brand).toHaveClass("mt-8", "text-center", "text-title-sm", "font-bold", "text-ink");

    const lead = screen.getByText("하나의 계정으로 패캠 스토어의 모든 서비스를 이용하세요");
    expect(lead).toHaveClass("my-4", "text-center", "text-body", "font-regular", "text-ink");
    // 좌측 정렬 '로그인' 제목은 더 이상 heading 이 아니다
    expect(screen.queryByRole("heading", { name: "로그인" })).toBeNull();
    // 폼 첫 칸은 브랜드 줄 아래
    expect(brand.compareDocumentPosition(screen.getByLabelText("이메일")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("보이는 라벨 없이 placeholder 만 쓰고, 라벨은 sr-only 로 남아 접근성 이름이 유지된다", () => {
    const email = screen.getByLabelText("이메일");
    const password = screen.getByLabelText("비밀번호");

    expect(email).toHaveAttribute("placeholder", "통합계정 또는 이메일");
    expect(password).toHaveAttribute("placeholder", "비밀번호 입력");
    expect(screen.getByText("이메일")).toHaveClass("sr-only");
    expect(screen.getByText("비밀번호")).toHaveClass("sr-only");
    expect(email).toHaveClass("h-9", "rounded-sm", "border-line", "bg-surface", "px-2", "text-body");
    expect(email.closest("form")).toHaveClass("gap-3");
    expect(email).toHaveAttribute("autoComplete", "email");
    expect(password).toHaveAttribute("autoComplete", "current-password");
  });

  it("비밀번호 보이기 토글이 type 과 aria-label 을 바꾼다", () => {
    const password = screen.getByLabelText("비밀번호");
    expect(password).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByRole("button", { name: "비밀번호 보이기" }));
    expect(password).toHaveAttribute("type", "text");

    fireEvent.click(screen.getByRole("button", { name: "비밀번호 숨기기" }));
    expect(password).toHaveAttribute("type", "password");
  });

  it("자동 로그인 체크박스는 켜고 끌 수 있고, 제출 버튼은 44px cta 다", () => {
    const auto = screen.getByLabelText("자동 로그인");
    expect(auto).not.toBeChecked();
    fireEvent.click(auto);
    expect(auto).toBeChecked();

    const submit = screen.getByRole("button", { name: "로그인" });
    expect(submit).toHaveAttribute("type", "submit");
    expect(submit).toHaveClass("h-11", "rounded-sm", "font-medium", "w-full");
  });

  it("가입한 계정으로 로그인하면 /products 로 가고, 틀리면 경고 문구가 남는다", async () => {
    await signUp("a@b.com", "pw1234");

    fireEvent.change(screen.getByLabelText("이메일"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText("비밀번호"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: "로그인" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("이메일 또는 비밀번호가 올바르지 않습니다.");
    expect(push).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("비밀번호"), { target: { value: "pw1234" } });
    fireEvent.click(screen.getByRole("button", { name: "로그인" }));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/products"));
  });
});
