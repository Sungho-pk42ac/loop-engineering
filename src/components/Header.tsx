import Link from "next/link";
import { AuthNav } from "./AuthNav";

// 원본 순서. 첫 탭은 원본 브랜드명 대신 우리 스토어명(클론 규칙 — 사칭 금지).
export const STORE_TABS = ["FC STORE", "BEAUTY", "SPORTS", "OUTLET", "BOUTIQUE", "KICKS", "KIDS", "USED", "SNAP"] as const;

// 24x24 stroke 아이콘 path. 앱에 해당 페이지가 없어 모두 /products 로 간다.
const ICON_LINKS = [
  { label: "오프라인 스토어", d: "M4 10h16M5 10V20h14V10M3 10l2-6h14l2 6M10 20v-5h4v5" },
  { label: "검색", d: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5" },
  { label: "좋아요", d: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" },
  { label: "마이", d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" },
  { label: "장바구니", d: "M6 8h12l-1 12H7L6 8zM9 8V6a3 3 0 0 1 6 0v2" },
] as const;

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const iconLinkClass = "flex size-8 shrink-0 items-center justify-center rounded-sm text-icon-inverse hover:opacity-80";

export function Header() {
  return (
    <header className="sticky top-0 z-sticky border-b border-line bg-surface">
      <div className="bg-surface-inverse text-ink-inverse">
        <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-2 px-4 md:flex-nowrap md:px-6">
          <Link href="/products" aria-label="메뉴" className={`${iconLinkClass} my-2`}>
            <Icon d="M4 7h16M4 12h16M4 17h16" />
          </Link>
          {/* 모바일에서는 둘째 줄로 내려가 이 줄만 가로 스크롤된다. */}
          <nav aria-label="스토어" className="order-last basis-full overflow-x-auto md:order-none md:min-w-0 md:flex-1 md:basis-auto">
            <ul className="flex h-10 items-center gap-4 whitespace-nowrap">
              {STORE_TABS.map((tab) => (
                <li key={tab}>
                  <Link href="/products" className="text-label font-bold hover:opacity-80">
                    {tab}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-1 md:flex-none">
            {ICON_LINKS.map(({ label, d }) => (
              <Link key={label} href="/products" aria-label={label} className={iconLinkClass}>
                <Icon d={d} />
              </Link>
            ))}
            <div className="ml-2 min-w-0">
              <AuthNav />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto flex h-14 max-w-page items-center px-4 md:px-6">
        <Link href="/products" className="shrink-0 text-title-sm font-bold text-ink">
          패캠 스토어
        </Link>
      </div>
    </header>
  );
}
