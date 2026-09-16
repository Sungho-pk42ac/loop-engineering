"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CURRENT_TAB_BY_PATH, gnbTabs, promoTab } from "@/data/gnb";

export function GnbTabs() {
  const current = CURRENT_TAB_BY_PATH[usePathname()];

  return (
    <nav aria-label="메인 메뉴" className="mx-auto max-w-page overflow-x-auto px-4 md:px-6">
      <ul className="flex h-12 items-stretch gap-6 whitespace-nowrap">
        {gnbTabs.map(({ label, href }) => {
          const active = label === current;
          return (
            <li key={label} className="flex">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center border-b text-label ${
                  active ? "border-ink-inverse font-bold text-ink-inverse" : "border-transparent font-medium text-ink-inverse opacity-70 hover:opacity-100"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
        <li className="flex">
          <Link href={promoTab.href} className="flex items-center whitespace-pre-line text-label font-semibold text-ink-promo-inverse hover:underline">
            {promoTab.label}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
