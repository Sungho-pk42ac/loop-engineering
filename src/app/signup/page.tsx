"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthPanel } from "@/components/AuthPanel";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui";
import { signUp } from "@/lib/auth";

const inputClass = "h-10 rounded-md border border-line bg-surface-subtle px-3 text-body text-ink";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    if (password !== String(form.get("passwordConfirm"))) {
      setError("비밀번호가 일치하지 않습니다.");
    } else if (signUp(String(form.get("email")), password) === "duplicate") {
      setError("이미 가입된 이메일입니다.");
    } else {
      router.push("/login");
    }
  }

  return (
    <AuthPanel title="회원가입">
      <div className="flex flex-col gap-6 py-6">
        {/* 상단 바 제목이 heading 이 아니게 되면서(#282) 이 페이지의 h1 을 남긴다. 보이는 제목은 #281 소관 */}
        <h1 className="sr-only">회원가입</h1>
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
              autoComplete="new-password"
              className={inputClass}
            />
          </label>
          <label htmlFor="passwordConfirm" className="flex flex-col gap-2 text-label text-ink">
            비밀번호 확인
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              required
              autoComplete="new-password"
              className={inputClass}
            />
          </label>
          <Button type="submit" size="lg">
            가입하기
          </Button>
          {error && (
            <p role="alert" className="text-label text-danger">
              {error}
            </p>
          )}
        </form>
        <Link href="/login" className="text-label text-ink-link hover:underline">
          로그인
        </Link>
      </div>
    </AuthPanel>
  );
}
