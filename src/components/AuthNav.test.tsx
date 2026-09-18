import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { login, SESSION_KEY, signUp } from "@/lib/auth";
import { Header, STORE_TABS } from "./Header";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => "/products" }));

describe("Header / AuthNav", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it("스토어 바에 탭 9개(원본 순서)와 아이콘 링크는 /products, 메뉴는 /menu/category(#116)", () => {
    render(<Header />);

    const tabs = screen.getAllByRole("link").filter((a) => (STORE_TABS as readonly string[]).includes(a.textContent ?? ""));
    expect(tabs.map((a) => a.textContent)).toEqual([...STORE_TABS]);
    expect(screen.getByRole("link", { name: "메뉴" })).toHaveAttribute("href", "/menu/category");
    for (const name of ["오프라인 스토어", "검색", "좋아요", "마이", "장바구니"]) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", "/products");
    }
    tabs.forEach((a) => expect(a).toHaveAttribute("href", "/products"));
  });

  it("세션이 없으면 로그인 / 회원가입 링크를 보여준다", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "로그인 / 회원가입" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: "패캠 스토어" })).toHaveAttribute("href", "/products");
  });

  it("세션이 있으면 이메일과 로그아웃 버튼, 클릭 시 세션 삭제 후 로그인 링크로 바뀐다", async () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: "a@b.com" }));
    render(<Header />);

    expect(await screen.findByText("a@b.com")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "로그아웃" }));

    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    expect(screen.getByRole("link", { name: "로그인 / 회원가입" })).toHaveAttribute("href", "/login");
    expect(screen.queryByText("a@b.com")).not.toBeInTheDocument();
  });

  it("이미 렌더된 Header 도 login() 직후 이메일로 바뀐다 (레이아웃은 재마운트되지 않음)", async () => {
    await signUp("a@b.com", "pw1234");
    render(<Header />);

    await act(async () => {
      await login("a@b.com", "pw1234");
    });

    expect(screen.getByText("a@b.com")).toBeInTheDocument();
  });
});
