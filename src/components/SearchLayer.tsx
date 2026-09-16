"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { popularKeywords, risingKeywords, searchPlaceholders, type RankChange } from "@/data/search";
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

export function SearchLayer() {
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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOpen(false);
    router.push("/products");
  }

  return (
    <>
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
