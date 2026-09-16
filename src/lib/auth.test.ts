import { beforeEach, describe, expect, it } from "vitest";
import { getCurrentUser, login, logout, SESSION_KEY, signUp, USERS_KEY } from "./auth";

describe("auth (localStorage 목업)", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(USERS_KEY, JSON.stringify([{ email: "a@b.com", password: "pw1234" }]));
  });

  it("계정이 일치하면 true 를 반환하고 세션을 기록한다", () => {
    expect(login("a@b.com", "pw1234")).toBe(true);
    expect(JSON.parse(localStorage.getItem(SESSION_KEY)!)).toEqual({ email: "a@b.com" });
    expect(getCurrentUser()).toEqual({ email: "a@b.com" });
  });

  it("계정이 일치하지 않으면 false 를 반환하고 세션이 없다", () => {
    expect(login("a@b.com", "wrong")).toBe(false);
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    expect(getCurrentUser()).toBeNull();
  });

  it("logout 후 getCurrentUser 는 null 이다", () => {
    login("a@b.com", "pw1234");
    logout();
    expect(getCurrentUser()).toBeNull();
  });

  it("세션 값이 깨져 있으면 null 이다", () => {
    localStorage.setItem(SESSION_KEY, "{not json");
    expect(getCurrentUser()).toBeNull();
  });
});

describe("signUp", () => {
  beforeEach(() => localStorage.clear());

  it("빈 스토리지에서 가입하면 ok 이고 계정이 저장된다", () => {
    expect(signUp("new@b.com", "pw1234")).toBe("ok");
    expect(JSON.parse(localStorage.getItem(USERS_KEY)!)).toEqual([{ email: "new@b.com", password: "pw1234" }]);
  });

  it("같은 이메일로 다시 가입하면 duplicate 이고 배열 길이가 그대로다", () => {
    signUp("new@b.com", "pw1234");
    expect(signUp("new@b.com", "other")).toBe("duplicate");
    expect(JSON.parse(localStorage.getItem(USERS_KEY)!)).toHaveLength(1);
  });

  it("가입 직후 자동 로그인되지 않고, 가입한 계정으로 login 할 수 있다", () => {
    signUp("new@b.com", "pw1234");
    expect(getCurrentUser()).toBeNull();
    expect(login("new@b.com", "pw1234")).toBe(true);
  });
});
