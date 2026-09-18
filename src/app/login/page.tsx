"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthPanel } from "@/components/AuthPanel";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui";
import { login } from "@/lib/auth";

const inputClass = "h-10 rounded-md border border-line bg-surface-subtle px-3 text-body text-ink";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (login(String(form.get("email")), String(form.get("password")))) {
      router.push("/products");
    } else {
      setError(true);
    }
  }

  return (
    <AuthPanel title="로그인">
      <div className="flex flex-col gap-6 py-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="email" className="flex flex-col gap-2 text-label text-ink">
            이메일
            <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
          </label>
          <label htmlFor="password" className="flex flex-col gap-2 text-label text-ink">
            비밀번호
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </label>
          <Button type="submit" size="lg">
            로그인
          </Button>
          {error && (
            <p role="alert" className="text-label text-danger">
              이메일 또는 비밀번호가 올바르지 않습니다.
            </p>
          )}
        </form>
        <Link href="/signup" className="text-label text-ink-link hover:underline">
          회원가입
        </Link>
      </div>
    </AuthPanel>
  );
}
