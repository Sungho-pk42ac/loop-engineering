import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { login, SESSION_KEY, USERS_KEY } from "@/lib/auth";
import { Header, STORE_TABS } from "./Header";
import { BUBBLE_ENTER_CLASS, resetBubbleModeCache } from "./StoreBubble";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => "/products" }));

describe("Header / AuthNav", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it("스토어 바에 탭 9개(원본 순서)와 메뉴·아이콘 링크가 모두 /products 로 간다", () => {
    render(<Header />);

    const tabs = screen.getAllByRole("link").filter((a) => (STORE_TABS as readonly string[]).includes(a.textContent ?? ""));
    expect(tabs.map((a) => a.textContent)).toEqual([...STORE_TABS]);
    for (const name of ["메뉴", "오프라인 스토어", "검색", "좋아요", "마이", "장바구니"]) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", "/products");
    }
    tabs.forEach((a) => expect(a).toHaveAttribute("href", "/products"));
  });

  it("세션이 없으면 로그인 / 회원가입 링크를 보여준다", () => {
    render(<Header />);

    // 데스크톱 스토어 바(md 이상)·모바일 로고 줄(md 미만)에 하나씩(#134)
    const logins = screen.getAllByRole("link", { name: "로그인 / 회원가입" });
    expect(logins).toHaveLength(2);
    logins.forEach((a) => expect(a).toHaveAttribute("href", "/login"));
    expect(screen.getByRole("link", { name: "패캠 스토어" })).toHaveAttribute("href", "/products");
  });

  it("세션이 있으면 이메일과 로그아웃 버튼, 클릭 시 세션 삭제 후 로그인 링크로 바뀐다", async () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: "a@b.com" }));
    render(<Header />);

    expect(await screen.findAllByText("a@b.com")).toHaveLength(2);
    fireEvent.click(screen.getAllByRole("button", { name: "로그아웃" })[0]);

    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    screen.getAllByRole("link", { name: "로그인 / 회원가입" }).forEach((a) => expect(a).toHaveAttribute("href", "/login"));
    expect(screen.queryByText("a@b.com")).not.toBeInTheDocument();
  });

  it("이미 렌더된 Header 도 login() 직후 이메일로 바뀐다 (레이아웃은 재마운트되지 않음)", () => {
    localStorage.setItem(USERS_KEY, JSON.stringify([{ email: "a@b.com", password: "pw1234" }]));
    render(<Header />);

    act(() => {
      login("a@b.com", "pw1234");
    });

    expect(screen.getAllByText("a@b.com")).toHaveLength(2);
  });

  it("스토어 바(#134): md 이상만 보이는 56px 전체 폭 줄, 탭 9개 text-body-lg(xl)·아이콘 링크 보이는 글자 라벨·햄버거 뒤 구분선", () => {
    render(<Header />);

    const nav = screen.getByRole("navigation", { name: "스토어" });
    const bar = nav.parentElement!;
    expect(bar).toHaveClass("hidden", "h-14", "md:flex");
    expect(bar).not.toHaveClass("max-w-page");
    expect(nav.querySelector(".bg-line-inverse")).not.toBeNull();
    const tabs = screen.getAllByRole("link").filter((a) => (STORE_TABS as readonly string[]).includes(a.textContent ?? ""));
    tabs.forEach((a) => expect(a).toHaveClass("xl:text-body-lg", "font-medium", "h-14"));
    for (const name of ["검색", "좋아요", "마이", "장바구니"]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveTextContent(name);
      expect(link.querySelector("svg")).not.toBeNull();
    }
    expect(screen.getByRole("link", { name: "오프라인 스토어" }).querySelector("svg")).toBeNull();
    screen.getAllByRole("link", { name: "로그인 / 회원가입" }).forEach((a) => expect(a).toHaveClass("h-6"));
  });

  it("팬스토어 말풍선(#55)은 스토어 바(md 이상)와 모바일 로고 줄(md 미만)에 하나씩", () => {
    sessionStorage.clear();
    resetBubbleModeCache();
    render(<Header />);

    const bubbles = screen.getAllByRole("button", { name: /패캠 팬스토어 굿즈를 만나보세요/ });
    expect(bubbles).toHaveLength(2);
    // 세션 첫 방문이면 두 자리 모두 첫 등장 애니메이션
    bubbles.forEach((b) => expect(b.className).toContain(BUBBLE_ENTER_CLASS));
    expect(screen.getByRole("navigation", { name: "스토어" }).parentElement!.contains(bubbles[0])).toBe(true);
    expect(bubbles[1].parentElement).toHaveClass("md:hidden");
  });
});
