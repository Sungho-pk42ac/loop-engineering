// 브라우저 전용 localStorage 목업 인증. 서버·쿠키 없음.
// ponytail: 목업 — 평문 저장, 실제 인증은 서버로 옮길 때
export const USERS_KEY = "fc-store:users";
export const SESSION_KEY = "fc-store:session";
const CHANGE_EVENT = "fc-store:auth-change";

export interface StoredUser {
  email: string;
  password: string;
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

export function login(email: string, password: string): boolean {
  const users = read<StoredUser[]>(USERS_KEY);
  const found = Array.isArray(users) && users.some((u) => u.email === email && u.password === password);
  if (found) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
  return found;
}

// 같은 이메일이 있으면 저장하지 않는다. 세션은 건드리지 않는다(자동 로그인 없음).
export function signUp(email: string, password: string): "ok" | "duplicate" {
  const stored = read<StoredUser[]>(USERS_KEY);
  const users = Array.isArray(stored) ? stored : [];
  if (users.some((u) => u.email === email)) return "duplicate";
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users.concat({ email, password })));
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
