"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { popularKeywords, risingKeywords, searchPlaceholders, type RankChange } from "@/data/search";
import { addRecentSearch, clearRecentSearches, parseRecent, readRecentRaw, removeRecentSearch, subscribeRecent } from "@/lib/recentSearches";
import { searchResultHref } from "@/lib/search";
import { Icon, ICON_PATHS } from "./Icon";

// 레이어는 sticky 헤더의 쌓임 맥락(z-sticky)을 벗어나도록 body 에 portal 로 렌더한다.
// 자리표시 문구는 클라이언트에서만 무작위로 고른다(SSR·하이드레이션은 첫 문구).
const clientIndex = Math.floor(Math.random() * searchPlaceholders.length);
const noopSubscribe = () => () => {};

const CHANGE: Record<RankChange, { mark: string; label: string; className: string }> = {
  up: { mark: "▲", label: "상승", className: "text-rank-up" },
  down: { mark: "▼", label: "하락", className: "text-rank-down" },
  same: { mark: "-", label: "유지", className: "text-ink-tertiary" },
};

const itemClass = "flex items-center gap-3 py-2 text-body text-ink hover:underline";

// keyword 가 있으면 검색 결과 화면용 흰 검색창 버튼(검색어 표시)으로 그린다.
export function SearchLayer({ keyword }: { keyword?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const placeholder =
    searchPlaceholders[
      useSyncExternalStore(
        noopSubscribe,
        () => clientIndex,
        () => 0,
      )
    ];

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const recent = parseRecent(
    useSyncExternalStore(
      subscribeRecent,
      readRecentRaw,
      () => "[]",
    ),
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = inputRef.current?.value.trim() ?? "";
    addRecentSearch(value);
    setOpen(false);
    router.push(value ? searchResultHref(value) : "/products");
  }

  return (
    <>
      {keyword !== undefined ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-9 w-full min-w-0 items-center gap-2 rounded-sm bg-surface px-2 text-left text-body text-ink"
        >
          <span className="min-w-0 flex-1 truncate">{keyword}</span>
          <span className="text-icon">
            <Icon d={ICON_PATHS.search} />
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-10 w-full min-w-0 items-center gap-2 rounded-md bg-surface-subtle px-3 text-left text-body text-ink-tertiary"
        >
          <span className="text-icon-muted">
            <Icon d={ICON_PATHS.search} />
          </span>
          <span className="truncate">{placeholder}</span>
        </button>
      )}

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="검색"
            className="fixed inset-0 z-modal overflow-y-auto bg-surface"
          >
            <div className="mx-auto flex max-w-page flex-col gap-8 px-4 py-4 md:px-6">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="search"
                  defaultValue={keyword}
                  aria-label="검색어"
                  placeholder="검색어를 입력하세요"
                  className="h-10 min-w-0 flex-1 rounded-md bg-surface-subtle px-3 text-body text-ink"
                />
                <button
                  type="button"
                  aria-label="닫기"
                  onClick={() => setOpen(false)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-sm text-icon hover:opacity-80"
                >
                  <Icon d={ICON_PATHS.close} />
                </button>
              </form>

              {/* 최근 검색어(#270): 이력이 없으면 블록 자체를 렌더하지 않는다. 칩 줄은 회색 띠 위 가로 스크롤. */}
              {recent.length > 0 && (
                <section aria-labelledby="recent-searches" className="-mx-4 md:-mx-6">
                  <div className="flex h-9 items-center justify-between px-4 pt-3">
                    <h2 id="recent-searches" className="text-body font-medium text-ink">
                      최근 검색어
                    </h2>
                    <button type="button" onClick={clearRecentSearches} className="text-label text-ink-muted underline">
                      모두삭제
                    </button>
                  </div>
                  <ul className="scrollbar-none flex h-12 overflow-x-auto bg-surface-subtle pt-1 pr-3 pb-2 pl-4">
                    {recent.map(({ keyword: word }) => (
                      <li key={word} className="mt-1 mr-1 flex h-8 shrink-0 items-center rounded-sm border border-line bg-surface pr-1 dark:bg-surface-muted">
                        <button
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            router.push(searchResultHref(word));
                          }}
                          className="h-full px-2 text-label whitespace-nowrap text-ink"
                        >
                          {word}
                        </button>
                        {/* 아이콘은 원본대로 12, -m-2 p-2 로 누르는 영역만 28 로 키운다(WCAG 2.5.8 최소 24) */}
                        <button
                          type="button"
                          aria-label={`${word} 삭제`}
                          onClick={() => removeRecentSearch(word)}
                          className="-m-2 flex shrink-0 items-center justify-center p-2 text-icon-muted"
                        >
                          <Icon d={ICON_PATHS.close} size={12} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <section aria-labelledby="popular-keywords">
                  <h2 id="popular-keywords" className="mb-2 text-title-sm font-semibold text-ink">
                    인기 검색어
                  </h2>
                  <ol>
                    {popularKeywords.map(({ keyword, change }, i) => (
                      <li key={keyword}>
                        <Link href="/products" onClick={() => setOpen(false)} className={itemClass}>
                          <span className="w-6 text-label font-bold">{i + 1}</span>
                          <span className="flex-1">{keyword}</span>
                          <span aria-hidden="true" className={`text-caption ${CHANGE[change].className}`}>
                            {CHANGE[change].mark}
                          </span>
                          <span className="sr-only">{CHANGE[change].label}</span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </section>
                <section aria-labelledby="rising-keywords">
                  <h2 id="rising-keywords" className="mb-2 text-title-sm font-semibold text-ink">
                    급상승 검색어
                  </h2>
                  <ol>
                    {risingKeywords.map((keyword, i) => (
                      <li key={keyword}>
                        <Link href="/products" onClick={() => setOpen(false)} className={itemClass}>
                          <span className="w-6 text-label font-bold">{i + 1}</span>
                          <span className="flex-1">{keyword}</span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>
              <Link
                href="/products"
                onClick={() => setOpen(false)}
                className="text-label text-ink-link hover:underline"
              >
                검색어 더보기
              </Link>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
