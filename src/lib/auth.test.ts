import { beforeEach, describe, expect, it } from "vitest";
import { getCurrentUser, login, logout, SESSION_KEY, signUp, USERS_KEY } from "./auth";

const stored = () => JSON.parse(localStorage.getItem(USERS_KEY)!) as { email: string; salt: string; hash: string }[];

describe("auth (localStorage 목업)", () => {
  beforeEach(async () => {
    localStorage.clear();
    await signUp("a@b.com", "pw1234");
  });

  it("계정이 일치하면 true 를 반환하고 세션을 기록한다", async () => {
    expect(await login("a@b.com", "pw1234")).toBe(true);
    expect(JSON.parse(localStorage.getItem(SESSION_KEY)!)).toEqual({ email: "a@b.com" });
    expect(getCurrentUser()).toEqual({ email: "a@b.com" });
  });

  it("계정이 일치하지 않으면 false 를 반환하고 세션이 없다", async () => {
    expect(await login("a@b.com", "wrong")).toBe(false);
    expect(await login("없는@b.com", "pw1234")).toBe(false);
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    expect(getCurrentUser()).toBeNull();
  });

  it("logout 후 getCurrentUser 는 null 이다", async () => {
    await login("a@b.com", "pw1234");
    logout();
    expect(getCurrentUser()).toBeNull();
  });

  it("세션 값이 깨져 있으면 null 이다", () => {
    localStorage.setItem(SESSION_KEY, "{not json");
    expect(getCurrentUser()).toBeNull();
  });
});

describe("signUp — 비밀번호는 salt + SHA-256 해시로만 저장한다 (#275)", () => {
  beforeEach(() => localStorage.clear());

  it("저장된 문자열에 비밀번호 원문이 없고, 키는 email·salt·hash 뿐이다", async () => {
    expect(await signUp("new@b.com", "pw1234")).toBe("ok");

    const raw = localStorage.getItem(USERS_KEY)!;
    expect(raw).not.toContain("pw1234");
    expect(Object.keys(stored()[0]).sort()).toEqual(["email", "hash", "salt"]);
    // salt 16바이트 hex 32자 · SHA-256 hex 64자
    expect(stored()[0].salt).toMatch(/^[0-9a-f]{32}$/);
    expect(stored()[0].hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("같은 비밀번호로 가입한 두 계정의 salt·hash 가 서로 다르다", async () => {
    await signUp("one@b.com", "pw1234");
    await signUp("two@b.com", "pw1234");

    const [a, b] = stored();
    expect(a.salt).not.toBe(b.salt);
    expect(a.hash).not.toBe(b.hash);
  });

  it("같은 이메일로 다시 가입하면 duplicate 이고 배열 길이가 그대로다", async () => {
    await signUp("new@b.com", "pw1234");
    expect(await signUp("new@b.com", "other")).toBe("duplicate");
    expect(stored()).toHaveLength(1);
  });

  it("같은 이메일로 동시에 두 번 제출해도 하나만 저장된다(연타 경합)", async () => {
    const [a, b] = await Promise.all([signUp("race@b.com", "pw1234"), signUp("race@b.com", "pw1234")]);

    expect([a, b].sort()).toEqual(["duplicate", "ok"]);
    expect(stored()).toHaveLength(1);
  });

  it("서로 다른 이메일을 동시에 가입하면 둘 다 남는다", async () => {
    await Promise.all([signUp("one@b.com", "pw1234"), signUp("two@b.com", "pw1234")]);

    expect(stored().map((u) => u.email).sort()).toEqual(["one@b.com", "two@b.com"]);
  });

  it("가입 직후 자동 로그인되지 않고, 가입한 계정으로 login 할 수 있다", async () => {
    await signUp("new@b.com", "pw1234");
    expect(getCurrentUser()).toBeNull();
    expect(await login("new@b.com", "pw1234")).toBe(true);
  });
});
