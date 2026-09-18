import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { signUp, USERS_KEY } from "@/lib/auth";
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

  it("이미 있는 이메일이면 오류를 보여주고 이동하지 않는다", async () => {
    await signUp("new@b.com", "x");
    submit("new@b.com", "pw1234", "pw1234");

    expect(await screen.findByRole("alert")).toHaveTextContent("이미 가입된 이메일입니다.");
    expect(push).not.toHaveBeenCalled();
  });

  it("새 이메일이면 계정을 저장하고 /login 으로 이동한다", async () => {
    submit("new@b.com", "pw1234", "pw1234");

    await waitFor(() => expect(push).toHaveBeenCalledWith("/login"));
    // 비밀번호 원문은 저장하지 않는다(#275) — email·salt·hash 만
    const users = JSON.parse(localStorage.getItem(USERS_KEY)!) as { email: string }[];
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe("new@b.com");
    expect(localStorage.getItem(USERS_KEY)).not.toContain("pw1234");
    expect(screen.getByRole("link", { name: "로그인" })).toHaveAttribute("href", "/login");
  });
});
