"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthPanel } from "@/components/AuthPanel";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui";
import { Icon, ICON_PATHS } from "@/components/Icon";
import { login } from "@/lib/auth";

// 실측(278): 36px 칸·radius 4·1px 테두리·흰 배경·좌우 8·14px. 보이는 라벨 없이 placeholder 만 쓴다(라벨은 sr-only 로 남김).
const inputClass = "h-9 w-full rounded-sm border border-line bg-surface px-2 text-body text-ink";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        {/* 실측(282): 가운데 워드마크(원본은 3사 로고 SVG — 클론 규칙상 우리 텍스트로) + 14px 안내 부제 */}
        <div>
          <h1 className="mt-8 text-center text-title-sm font-bold text-ink">패캠 스토어</h1>
          <p className="my-4 text-center text-body font-regular text-ink">
            하나의 계정으로 패캠 스토어의 모든 서비스를 이용하세요
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label htmlFor="email" className="sr-only">
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="통합계정 또는 이메일"
            className={inputClass}
          />
          <label htmlFor="password" className="sr-only">
            비밀번호
          </label>
          <div className="relative flex">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="비밀번호 입력"
              className={`${inputClass} pr-8`}
            />
            <button
              type="button"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보이기"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-2 flex items-center text-icon"
            >
              <Icon d={showPassword ? ICON_PATHS.eyeOff : ICON_PATHS.eye} size={20} />
            </button>
          </div>
          {/* 체크박스는 FilterOption(#112)과 같은 방식 — 네이티브 input 을 sr-only 로 숨기고 박스를 직접 그린다 */}
          <label htmlFor="autoLogin" className="flex cursor-pointer items-center py-1 text-body text-ink">
            <input id="autoLogin" name="autoLogin" type="checkbox" className="peer sr-only" />
            <span
              aria-hidden="true"
              className="flex size-4 shrink-0 items-center justify-center rounded-xs border border-icon-muted bg-surface text-icon-inverse peer-checked:border-line-strong peer-checked:bg-surface-inverse peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
            >
              <Icon d={ICON_PATHS.check} size={10} />
            </span>
            <span className="ml-2">자동 로그인</span>
          </label>
          <Button type="submit" size="cta" className="w-full">
            로그인
          </Button>
          {error && (
            <p role="alert" className="text-label text-danger">
              이메일 또는 비밀번호가 올바르지 않습니다.
            </p>
          )}
        </form>
        {/* 실측(279): 쿠폰 문구 2줄 + 전폭 버튼 3개(소셜 2개는 준비 중) + 찾기 줄.
            외부 상표 로고는 넣지 않고 글자만 쓴다(클론 규칙). */}
        <div className="flex flex-col gap-3 pt-6">
          <p className="text-center text-label font-medium text-ink">
            지금 가입하면,
            <br />
            신규 할인 쿠폰 즉시 발급
          </p>
          {/* 공용 Button 은 disabled 를 회색으로 칠하는 계약이라 여기선 쓰지 않는다 — 원본 색을 보여주는 게 이 버튼의 사양이고,
              비활성은 disabled 속성·커서·접근 이름('준비 중')으로 알린다. 배경이 다크에서 안 뒤집히므로 글자는 검정 고정. */}
          <button
            type="button"
            disabled
            className="h-10 w-full rounded-sm bg-surface-kakao text-body font-medium text-ink disabled:cursor-not-allowed dark:text-ink-inverse"
          >
            카카오로 시작하기<span className="sr-only"> (준비 중)</span>
          </button>
          <button
            type="button"
            disabled
            className="h-10 w-full rounded-sm border border-line bg-surface text-body font-medium text-ink disabled:cursor-not-allowed"
          >
            Apple로 시작하기<span className="sr-only"> (준비 중)</span>
          </button>
          <Link
            href="/signup"
            className="flex h-10 w-full items-center justify-center rounded-sm border border-line bg-surface text-body font-medium text-ink hover:bg-surface-subtle"
          >
            이메일로 가입하기
          </Link>
          <div className="flex justify-center divide-x divide-line-subtle text-label text-ink-tertiary">
            <Link href="/products" className="px-3">
              아이디 찾기
            </Link>
            <Link href="/products" className="px-3">
              비밀번호 찾기
            </Link>
          </div>
        </div>
      </div>
    </AuthPanel>
  );
}
