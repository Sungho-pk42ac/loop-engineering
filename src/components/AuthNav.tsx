"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getCurrentUser, logout, subscribeAuth } from "@/lib/auth";

const getEmail = () => getCurrentUser()?.email ?? null;
// SSR 에서는 비로그인으로 렌더한다.
const getServerEmail = () => null;

// 검은 스토어 바 위에 놓인다. ui/Button 에 반전 변형이 없어 테두리 버튼을 여기서 그린다.
// 원본 실측(#134): 높이 24·좌우 여백·테두리/글자 흰색 80%, 1279 이하 11px. 호버는 기존 opacity-80 유지(원본 미확인).
const outlineClass =
  "inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-sm border border-ink-inverse-soft px-2 text-caption font-medium text-ink-inverse-soft hover:opacity-80 xl:text-label";

export function AuthNav() {
  const email = useSyncExternalStore(subscribeAuth, getEmail, getServerEmail);

  if (!email) {
    return (
      <Link href="/login" className={outlineClass}>
        로그인 / 회원가입
      </Link>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="min-w-0 max-w-24 truncate text-label text-ink-inverse md:max-w-40">{email}</span>
      <button type="button" className={outlineClass} onClick={logout}>
        로그아웃
      </button>
    </div>
  );
}
