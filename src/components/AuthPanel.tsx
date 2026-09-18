"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Icon, ICON_PATHS } from "./Icon";

// 로그인·회원가입 단독 화면 틀(#277). 원본 실측: 회색 배경 위 600px 흰 패널,
// 52px 상단 바(회색, 14px 제목), 모바일에서만 왼쪽 뒤로 가기 버튼. 내용 좌우 16.
export function AuthPanel({ title, children }: { title: string; children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="flex-1 bg-surface-subtle">
      <div className="mx-auto min-h-full max-w-150 bg-surface">
        <div className="flex h-13 items-center gap-1 bg-surface-subtle px-4 py-3">
          <button type="button" aria-label="뒤로 가기" onClick={() => router.back()} className="-ml-1 text-icon md:hidden">
            <Icon d={ICON_PATHS.chevronLeft} />
          </button>
          {/* 상단 바 제목은 화면 크롬 라벨이라 heading 이 아니다 — 문서의 h1 은 각 페이지가 갖는다(#282) */}
          <p className="text-body text-ink">{title}</p>
        </div>
        {/* 헤더·푸터가 없는 화면이라 본문 랜드마크는 여기서 준다 */}
        <main className="px-4">{children}</main>
      </div>
    </div>
  );
}
