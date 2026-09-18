"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon, ICON_PATHS } from "../Icon";

const ZOOM = "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5M11 8v6M8 11h6";
const PREV = "M14 6l-6 6 6 6";
const NEXT = "M10 6l6 6-6 6";

// 상품 상세 갤러리(#62). 원본 실측: 데스크톱은 왼쪽 세로 썸네일 열(72×86, 간격 4, 클릭으로만 교체, 선택 2px 검은 테두리) +
// 16 옆 5:6 메인 이미지 가로 슬라이드, 모바일은 썸네일 없이 전폭 스와이프. 오른쪽 아래 n / N + 확대 버튼 → 전체화면 뷰어(Esc 닫힘).
// 슬라이드는 라이브러리 없이 scroll-snap.
export function ProductGallery({ name, images }: { name: string; images: string[] }) {
  const [index, setIndex] = useState(0);
  const [viewer, setViewer] = useState<number | null>(null);
  const slidesRef = useRef<HTMLUListElement>(null);
  const zoomRef = useRef<HTMLButtonElement>(null);
  // 닫으면 포커스를 '크게 보기' 버튼으로 돌려준다. 부모가 다시 그려져도 뷰어 effect 가 다시 돌지 않게 고정.
  const closeViewer = useCallback(() => {
    setViewer(null);
    zoomRef.current?.focus();
  }, []);

  function show(i: number) {
    const el = slidesRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "auto" });
    setIndex(i);
  }

  return (
    <div className="flex gap-4">
      {/* 썸네일 열은 absolute 라 행 높이에 끼지 않는다 → 열이 메인 이미지 높이에서 잘리고 넘치면 세로 스크롤(실측 223) */}
      <div className="relative hidden w-18 shrink-0 md:block">
        {/* 좌우 4px 은 포커스 링(2px + offset 2) 자리 — overflow-y-auto 가 가로도 잘라서 필요하다 */}
        <ul aria-label="이미지 목록" className="scrollbar-none absolute -inset-x-1 inset-y-0 flex flex-col gap-1 overflow-y-auto px-1">
          {images.map((src, i) => (
            <li key={i}>
              <button
                type="button"
                aria-label={`이미지 ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => show(i)}
                className="relative block aspect-5/6 w-18 bg-surface-subtle"
              >
                <Image src={src} alt={name} fill sizes="72px" className="object-cover" />
                {/* 선택 링은 이미지 위에 그려야 보인다 — inset box-shadow 는 자식 아래에 깔린다(실측 223) */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 ring-2 ring-inset transition-shadow duration-base ${
                    i === index ? "ring-scrim" : "ring-transparent"
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative min-w-0 flex-1">
        <ul
          ref={slidesRef}
          aria-label="상품 이미지"
          onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / (e.currentTarget.clientWidth || 1)))}
          className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto"
        >
          {images.map((src, i) => (
            <li key={i} className="relative aspect-5/6 w-full shrink-0 snap-start bg-surface-subtle">
              <Image src={src} alt={name} fill priority={i === 0} sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" />
            </li>
          ))}
        </ul>
        {/* 원본은 알약 2개(텍스트 + 아이콘)가 4px 떨어져 있다(실측 223). 배경 20% 는 원본 사진이 어두워 성립하는 값이라
            우리 밝은 자리표시자 사진에서는 흰 글자 대비가 2.2:1 로 떨어진다 → 접근성 우선으로 surface-overlay(60%) 유지 */}
        <div className="absolute right-4 bottom-4 flex items-center gap-1">
          <span className="flex h-6 items-center rounded-sm bg-surface-overlay px-2 text-label text-ink-inverse dark:text-ink">
            {index + 1} / {images.length}
          </span>
          <button
            ref={zoomRef}
            type="button"
            aria-label="크게 보기"
            onClick={() => setViewer(index)}
            className="flex size-6 items-center justify-center rounded-sm bg-surface-overlay text-ink-inverse dark:text-ink"
          >
            <Icon d={ZOOM} size={20} />
          </button>
        </div>
      </div>

      {viewer !== null && (
        <GalleryViewer name={name} images={images} start={viewer} onClose={closeViewer} />
      )}
    </div>
  );
}

function GalleryViewer({ name, images, start, onClose }: { name: string; images: string[]; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const closeRef = useRef<HTMLButtonElement>(null);
  const slidesRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    // 연 장면부터 보여준다(스와이프·화살표 모두 같은 스크롤러를 쓴다)
    const el = slidesRef.current;
    if (el) el.scrollTo({ left: start * el.clientWidth, behavior: "auto" });
    // 뷰어가 열린 동안 뒤 페이지 스크롤 잠금
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [onClose, start]);

  function go(next: number) {
    const el = slidesRef.current;
    if (el) el.scrollTo({ left: next * el.clientWidth, behavior: "auto" });
    setI(next);
  }

  // 뷰어 배경(scrim)은 다크에서도 검정이라 화살표 원은 다크에서 반전 토큰으로 흰 원 유지.
  // 실측(224): 이미지는 폭 기준(모바일 전폭 375×450 · md 600×720), 화살표는 이미지 바깥 16(= 원 40 + 16 → -14)이고
  // 원본 모바일에는 화살표가 없다 → 그 폭에서는 가로 스와이프(snap)로 넘긴다. 닫기 28 은 md 에서 이미지 오른쪽 가장자리.
  const arrow =
    "absolute top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-icon md:flex disabled:bg-surface-muted disabled:text-icon-muted disabled:cursor-not-allowed dark:bg-surface-inverse dark:text-icon-inverse";

  return (
    <div role="dialog" aria-modal="true" aria-label="상품 이미지 크게 보기" className="fixed inset-0 z-modal bg-scrim">
      <div className="relative mx-auto flex h-full w-full flex-col justify-center md:w-150">
        <div className="relative">
          <ul
            ref={slidesRef}
            aria-label="크게 본 이미지"
            onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / (e.currentTarget.clientWidth || 1)))}
            className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto"
          >
            {images.map((src, n) => (
              <li key={n} className="relative aspect-5/6 w-full shrink-0 snap-start md:h-180 md:w-150">
                <Image src={src} alt={name} fill sizes="(min-width: 768px) 600px, 100vw" className="object-contain" />
              </li>
            ))}
          </ul>
          <button type="button" aria-label="이전 이미지" disabled={i === 0} onClick={() => go(i - 1)} className={`${arrow} -left-14`}>
            <Icon d={PREV} size={40} />
          </button>
          <button
            type="button"
            aria-label="다음 이미지"
            disabled={i === images.length - 1}
            onClick={() => go(i + 1)}
            className={`${arrow} -right-14`}
          >
            <Icon d={NEXT} size={40} />
          </button>
        </div>
        <button
          ref={closeRef}
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute top-3 right-4 flex size-7 items-center justify-center text-ink-inverse md:right-0 dark:text-ink"
        >
          <Icon d={ICON_PATHS.close} size={24} />
        </button>
        <p className="absolute inset-x-0 bottom-10 text-center text-label text-ink-tertiary md:bottom-3">
          {i + 1}/{images.length}
        </p>
      </div>
    </div>
  );
}
