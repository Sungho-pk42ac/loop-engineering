import Link from "next/link";
import { AuthNav } from "./AuthNav";
import { GnbTabs } from "./GnbTabs";
import { Icon, ICON_PATHS } from "./Icon";
import { SearchLayer } from "./SearchLayer";
import { StoreBubble } from "./StoreBubble";

// 원본 순서. 첫 탭은 원본 브랜드명 대신 우리 스토어명(클론 규칙 — 사칭 금지).
export const STORE_TABS = ["FC STORE", "BEAUTY", "SPORTS", "OUTLET", "BOUTIQUE", "KICKS", "KIDS", "USED", "SNAP"] as const;

// 24x24 stroke 아이콘 path. 앱에 해당 페이지가 없어 모두 /products 로 간다.
const ICON_LINKS = [
  { label: "오프라인 스토어", d: "M4 10h16M5 10V20h14V10M3 10l2-6h14l2 6M10 20v-5h4v5" },
  { label: "검색", d: ICON_PATHS.search },
  { label: "좋아요", d: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" },
  { label: "마이", d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" },
  { label: "장바구니", d: "M6 8h12l-1 12H7L6 8zM9 8V6a3 3 0 0 1 6 0v2" },
] as const;

// 9번째 스토어 탭 글자 앞 자리표시 아이콘(원본 20px 아이콘 자리)
const TAB_ICON = "M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z";

// 로고 줄 오른쪽 아이콘 링크
const LOGO_ROW_LINKS = [
  { label: "앱테크", d: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v10M9 9.5c0-1.4 1.3-2 3-2s3 .8 3 2-1.3 1.8-3 2.5-3 1.1-3 2.5 1.3 2 3 2 3-.6 3-2" },
  { label: "알림", d: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2zM10 21h4" },
] as const;

const iconBase = "flex size-8 shrink-0 items-center justify-center rounded-sm hover:opacity-80";
const iconLinkClass = `${iconBase} text-icon-inverse`;

export function Header() {
  return (
    <header className="sticky top-0 z-sticky bg-surface-inverse text-ink-inverse">
      {/* 스토어 바(#134 원본 실측): 1280 이상 전체 폭 56·탭 16/500·아이콘 링크 글자 라벨, 768~1279 축소, 767 이하 없음. */}
      <div className="hidden h-14 pr-2 pl-1 md:flex">
        <div className="relative flex">
          <Link
            href="/products"
            aria-label="메뉴"
            className="flex w-6 items-center justify-center text-icon-inverse *:size-5 xl:w-auto xl:px-2 xl:*:size-7"
          >
            <Icon d="M4 7h16M4 12h16M4 17h16" />
          </Link>
          <StoreBubble />
        </div>
        <nav aria-label="스토어" className="flex min-w-0 flex-1 items-center overflow-x-auto">
          <span aria-hidden="true" className="mx-1 h-4 w-px shrink-0 bg-line-inverse" />
          <ul className="flex whitespace-nowrap">
            {STORE_TABS.map((tab, i) => (
              <li key={tab} className="flex">
                <Link href="/products" className="flex h-14 items-center px-1 text-detail font-medium hover:opacity-80 focus-visible:-outline-offset-2 xl:px-2 xl:text-body-lg">
                  {i === STORE_TABS.length - 1 && (
                    <span aria-hidden="true" className="mr-1 hidden text-icon-inverse xl:inline">
                      <Icon d={TAB_ICON} />
                    </span>
                  )}
                  {tab}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex shrink-0">
          {ICON_LINKS.map(({ label, d }, i) => (
            <Link
              key={label}
              href="/products"
              className={`h-14 items-center gap-1 px-1 text-detail font-medium hover:opacity-80 xl:px-2 xl:text-body ${i === 0 ? "hidden xl:flex" : "flex"}`}
            >
              {i > 0 && (
                <span aria-hidden="true" className="hidden text-icon-inverse xl:inline">
                  <Icon d={d} size={16} />
                </span>
              )}
              {label}
            </Link>
          ))}
          <div className="flex items-center pl-1">
            <AuthNav />
          </div>
        </div>
      </div>
      <div className="mx-auto flex h-14 max-w-page items-center gap-4 px-4 md:px-6">
        {/* 767 이하는 스토어 바가 없어 팬스토어 말풍선(#55)을 로고 아래에 띄운다 */}
        <div className="relative shrink-0">
          <Link href="/products" className="text-title-sm font-bold text-ink-inverse">
            패캠 스토어
          </Link>
          <div className="md:hidden">
            <StoreBubble />
          </div>
        </div>
        <div className="min-w-10 flex-1">
          <SearchLayer />
        </div>
        <div className="flex min-w-0 items-center gap-1">
          {LOGO_ROW_LINKS.map(({ label, d }) => (
            <Link key={label} href="/products" aria-label={label} className={iconLinkClass}>
              <Icon d={d} />
            </Link>
          ))}
          <div className="min-w-0 md:hidden">
            <AuthNav />
          </div>
        </div>
      </div>
      <GnbTabs />
    </header>
  );
}
