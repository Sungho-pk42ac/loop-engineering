import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { USERS_KEY } from "@/lib/auth";
import SignUpPage from "./page";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

function submit(email: string, password: string, confirm: string) {
  fireEvent.change(screen.getByLabelText("이메일"), { target: { value: email } });
  fireEvent.change(screen.getByLabelText("비밀번호"), { target: { value: password } });
  fireEvent.change(screen.getByLabelText("비밀번호 확인"), { target: { value: confirm } });
  fireEvent.click(screen.getByRole("button", { name: "가입하기" }));
}

describe("/signup", () => {
  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
    render(<SignUpPage />);
  });
  afterEach(cleanup);

  it("비밀번호와 확인이 다르면 오류를 보여주고 이동하지 않는다", () => {
    submit("new@b.com", "pw1234", "pw9999");

    expect(screen.getByRole("alert")).toHaveTextContent("비밀번호가 일치하지 않습니다.");
    expect(push).not.toHaveBeenCalled();
    expect(localStorage.getItem(USERS_KEY)).toBeNull();
  });

  it("이미 있는 이메일이면 오류를 보여주고 이동하지 않는다", () => {
    localStorage.setItem(USERS_KEY, JSON.stringify([{ email: "new@b.com", password: "x" }]));
    submit("new@b.com", "pw1234", "pw1234");

    expect(screen.getByRole("alert")).toHaveTextContent("이미 가입된 이메일입니다.");
    expect(push).not.toHaveBeenCalled();
  });

  it("새 이메일이면 계정을 저장하고 /login 으로 이동한다", () => {
    submit("new@b.com", "pw1234", "pw1234");

    expect(push).toHaveBeenCalledWith("/login");
    expect(JSON.parse(localStorage.getItem(USERS_KEY)!)).toEqual([{ email: "new@b.com", password: "pw1234" }]);
    expect(screen.getByRole("link", { name: "로그인" })).toHaveAttribute("href", "/login");
  });
});
