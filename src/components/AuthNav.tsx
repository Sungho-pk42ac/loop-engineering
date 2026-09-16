"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getCurrentUser, logout, subscribeAuth } from "@/lib/auth";
import { Button } from "@/components/ui";

const getEmail = () => getCurrentUser()?.email ?? null;
// SSR 에서는 비로그인으로 렌더한다.
const getServerEmail = () => null;

export function AuthNav() {
  const email = useSyncExternalStore(subscribeAuth, getEmail, getServerEmail);

  if (!email) {
    return (
      <Link href="/login" className="text-label text-ink-link hover:underline">
        로그인
      </Link>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="min-w-0 truncate text-label text-ink-secondary">{email}</span>
      <Button variant="ghost" size="sm" className="shrink-0" onClick={logout}>
        로그아웃
      </Button>
    </div>
  );
}
