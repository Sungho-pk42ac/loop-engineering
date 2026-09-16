"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CURRENT_TAB_BY_PATH, gnbTabs, promoTab } from "@/data/gnb";

// -mb-px: 현재 탭 밑줄이 헤더 하단 선을 덮어 1px 로 보이게 한다.
export function GnbTabs() {
  const current = CURRENT_TAB_BY_PATH[usePathname()];

  return (
    <nav aria-label="메인 메뉴" className="mx-auto -mb-px max-w-page overflow-x-auto px-4 md:px-6">
      <ul className="flex h-12 items-stretch gap-6 whitespace-nowrap">
        {gnbTabs.map(({ label, href }) => {
          const active = label === current;
          return (
            <li key={label} className="flex">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center border-b text-label ${
                  active ? "border-line-strong font-bold text-ink" : "border-transparent font-medium text-ink-secondary hover:text-ink"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
        <li className="flex">
          <Link href={promoTab.href} className="flex items-center whitespace-pre-line text-label font-semibold text-accent hover:text-accent-hover">
            {promoTab.label}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
