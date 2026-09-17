"use client";

import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { CURRENT_TAB_BY_PATH, gnbTabs, promoTabs } from "@/data/gnb";

// GNB 탭 줄(#8). 원본 실측(#136): 전체 폭 48px, 칸 간격 없이 좌우 8, 14px 기본 흰색 60%·선택 굵게 + 글자 폭 밑줄(줄 맨 아래),
// 호버 변화 없음. 2번째 탭 뒤 광고 칸, 뒤에 두 줄 기획전 탭 6개. 밑줄은 §5.2 에 따라 1px(원본 2px), 기획전 6색은 강조 토큰 하나로.
function Tab({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <li className="flex">
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`flex px-2 text-body focus-visible:-outline-offset-2 ${active ? "font-bold text-ink-inverse" : "font-regular text-ink-inverse-muted"}`}
      >
        <span className={`flex items-center border-b ${active ? "border-ink-inverse" : "border-transparent"}`}>{label}</span>
      </Link>
    </li>
  );
}

export function GnbTabs() {
  const current = CURRENT_TAB_BY_PATH[usePathname()];

  return (
    <nav aria-label="메인 메뉴" className="overflow-x-auto px-2">
      <ul className="flex h-12 items-stretch whitespace-nowrap">
        {gnbTabs.map(({ label, href }, i) => (
          <Fragment key={label}>
            <Tab label={label} href={href} active={label === current} />
            {i === 1 && (
              <li className="flex">
                <Link href="/products" aria-label="광고" className="flex px-2 focus-visible:-outline-offset-2">
                  <span className="h-12 w-16 bg-surface-muted" />
                </Link>
              </li>
            )}
          </Fragment>
        ))}
        {promoTabs.map(({ label, href }) => (
          <li key={label} className="flex">
            <Link href={href} className="flex items-center px-2 text-detail font-semibold whitespace-pre text-ink-promo-inverse focus-visible:-outline-offset-2">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
