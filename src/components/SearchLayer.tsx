"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { popularKeywords, risingKeywords, searchPlaceholders, type RankChange } from "@/data/search";
import { searchResultHref } from "@/lib/search";
import { Icon, ICON_PATHS } from "./Icon";

// 레이어는 sticky 헤더의 쌓임 맥락(z-sticky)을 벗어나도록 body 에 portal 로 렌더한다.
// 헤더 검색창 문구는 원본처럼 3.8초마다 위로 밀려 교체된다(실측 252). SSR·첫 렌더는 항상 첫 문구라 하이드레이션이 어긋나지 않는다.
const ROLL_MS = 3800;

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
  const [rolled, setRolled] = useState(0);

  useEffect(() => {
    // 동작 줄이기 설정이면 자동 롤링을 걸지 않고 첫 문구를 고정한다(BannerCarousel 과 같은 규칙).
    if (keyword !== undefined || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setRolled((i) => (i + 1) % searchPlaceholders.length), ROLL_MS);
    return () => clearInterval(timer);
  }, [keyword]);

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
    const value = inputRef.current?.value.trim() ?? "";
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
          className="flex h-10 w-full min-w-0 items-center gap-2 rounded-md bg-surface-subtle px-3 text-left text-body text-ink-muted"
        >
          {/* 문구는 세로로 밀려 교체된다(창 높이 = text-body 줄높이 20).
              translateY 의 % 는 트랙 자기 높이(20 × 문구 수) 기준이라 한 칸 = 100 / 문구 수 % 다. */}
          <span className="h-5 min-w-0 flex-1 overflow-hidden">
            <span
              className="block transition-transform duration-base ease-standard motion-reduce:transition-none"
              style={{ transform: `translateY(-${(rolled * 100) / searchPlaceholders.length}%)` }}
            >
              {searchPlaceholders.map((text, i) => (
                // 창 밖 문구는 접근성 트리에서도 빼 버튼 이름이 문구 3개로 이어지지 않게 한다
                <span key={text} aria-hidden={i !== rolled} className="block h-5 truncate">
                  {text}
                </span>
              ))}
            </span>
          </span>
          <span className="shrink-0 text-icon-muted">
            <Icon d={ICON_PATHS.search} />
          </span>
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
