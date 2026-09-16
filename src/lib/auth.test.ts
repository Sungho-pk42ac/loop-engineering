import { beforeEach, describe, expect, it } from "vitest";
import { getCurrentUser, login, logout, SESSION_KEY, USERS_KEY } from "./auth";

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
