import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { login, SESSION_KEY, USERS_KEY } from "@/lib/auth";
import { Header } from "./Header";

describe("Header / AuthNav", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it("세션이 없으면 로그인 링크를 보여준다", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "로그인" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: "패캠 스토어" })).toHaveAttribute("href", "/products");
  });

  it("세션이 있으면 이메일과 로그아웃 버튼, 클릭 시 세션 삭제 후 로그인 링크로 바뀐다", async () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: "a@b.com" }));
    render(<Header />);

    expect(await screen.findByText("a@b.com")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "로그아웃" }));

    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    expect(screen.getByRole("link", { name: "로그인" })).toHaveAttribute("href", "/login");
    expect(screen.queryByText("a@b.com")).not.toBeInTheDocument();
  });

  it("이미 렌더된 Header 도 login() 직후 이메일로 바뀐다 (레이아웃은 재마운트되지 않음)", () => {
    localStorage.setItem(USERS_KEY, JSON.stringify([{ email: "a@b.com", password: "pw1234" }]));
    render(<Header />);

    act(() => {
      login("a@b.com", "pw1234");
    });

    expect(screen.getByText("a@b.com")).toBeInTheDocument();
  });
});
