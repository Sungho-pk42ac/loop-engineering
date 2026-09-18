// 브라우저 전용 localStorage 목업 인증. 서버·쿠키 없음.
// 비밀번호 원문은 저장하지 않는다 — 계정마다 무작위 salt(16바이트)를 만들고 SHA-256(salt + password) 해시만 남긴다(#275).
// ponytail: SHA-256 은 느린 해시(KDF)가 아니라 실서비스용이 아니다. 새 의존성 없이 원문만 없애는 목업 수준.
//           실제 인증을 서버로 옮길 때 bcrypt/argon2 로 교체한다.
export const USERS_KEY = "fc-store:users";
export const SESSION_KEY = "fc-store:session";
const CHANGE_EVENT = "fc-store:auth-change";

export interface StoredUser {
  email: string;
  /** hex 32자 — 계정별 무작위 */
  salt: string;
  /** hex 64자 — SHA-256(salt + password) */
  hash: string;
}

export interface SessionUser {
  email: string;
}

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as T);
  } catch {
    return null;
  }
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function newSalt(): string {
  return toHex(crypto.getRandomValues(new Uint8Array(16)));
}

async function hashPassword(salt: string, password: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(salt + password));
  return toHex(new Uint8Array(digest));
}

export async function login(email: string, password: string): Promise<boolean> {
  const users = read<StoredUser[]>(USERS_KEY);
  const user = Array.isArray(users) ? users.find((u) => u.email === email) : undefined;
  const found = user !== undefined && (await hashPassword(user.salt, password)) === user.hash;
  if (found) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
  return found;
}

// 같은 이메일이 있으면 저장하지 않는다. 세션은 건드리지 않는다(자동 로그인 없음).
export async function signUp(email: string, password: string): Promise<"ok" | "duplicate"> {
  // 해시를 먼저 만든다 — 중복 검사와 저장 사이에 await 가 끼면 연타 시 두 호출이 같은 배열을 읽어
  // 나중 쓰기가 먼저 쓴 계정을 덮어쓴다(lost update). 읽기·검사·쓰기를 한 틱에 묶는다.
  const salt = newSalt();
  const hash = await hashPassword(salt, password);
  const stored = read<StoredUser[]>(USERS_KEY);
  const users = Array.isArray(stored) ? stored : [];
  if (users.some((u) => u.email === email)) return "duplicate";
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users.concat({ email, salt, hash })));
  return "ok";
}

export function logout(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// 세션 변경 구독 — 같은 탭(login/logout)과 다른 탭(storage 이벤트) 모두.
export function subscribeAuth(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function getCurrentUser(): SessionUser | null {
  const session = read<SessionUser>(SESSION_KEY);
  return session && typeof session.email === "string" ? { email: session.email } : null;
}
