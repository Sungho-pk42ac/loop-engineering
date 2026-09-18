"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** 전역 헤더·푸터 없이 단독 패널로 보여줄 경로(#277) */
const BARE_PATHS = ["/login", "/signup"];

// 루트 레이아웃의 헤더·푸터 게이트. 중첩 레이아웃으로는 이미 렌더된 루트의 헤더·푸터를 벗길 수 없고,
// 라우트 그룹으로 쪼개면 폴더를 전부 옮겨야 해 다른 브랜치와 충돌이 커서 경로 게이트로 간다.
// Header·Footer 는 서버 컴포넌트라 import 하지 않고 prop 슬롯으로 받는다.
export function SiteChrome({ header, footer, children }: { header: ReactNode; footer: ReactNode; children: ReactNode }) {
  if (BARE_PATHS.includes(usePathname())) return <>{children}</>;

  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}
