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
      <ul aria-label="이미지 목록" className="hidden shrink-0 flex-col gap-1 md:flex">
        {images.map((src, i) => (
          <li key={i}>
            <button
              type="button"
              aria-label={`이미지 ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => show(i)}
              className={`relative block aspect-5/6 w-18 border-2 bg-surface-subtle transition-colors ${
                i === index ? "border-line-strong" : "border-transparent"
              }`}
            >
              <Image src={src} alt={name} fill sizes="72px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>

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
        <button
          ref={zoomRef}
          type="button"
          aria-label="크게 보기"
          onClick={() => setViewer(index)}
          className="absolute right-4 bottom-4 flex h-6 items-center gap-1 rounded-sm bg-surface-overlay px-2 text-detail text-ink-inverse dark:text-ink"
        >
          <span>
            {index + 1} / {images.length}
          </span>
          <Icon d={ZOOM} size={16} />
        </button>
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

  useEffect(() => {
    closeRef.current?.focus();
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
  }, [onClose]);

  // 뷰어 배경(scrim)은 다크에서도 검정이라 화살표 원은 다크에서 반전 토큰으로 흰 원 유지
  const arrow =
    "absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-icon dark:bg-surface-inverse dark:text-icon-inverse";

  return (
    <div role="dialog" aria-modal="true" aria-label="상품 이미지 크게 보기" className="fixed inset-0 z-modal bg-scrim">
      <div className="flex h-full items-center justify-center px-16 py-16">
        <div className="relative aspect-5/6 h-full max-w-full">
          <Image src={images[i]} alt={name} fill sizes="100vw" className="object-contain" />
        </div>
      </div>
      {i > 0 && (
        <button type="button" aria-label="이전 이미지" onClick={() => setI(i - 1)} className={`${arrow} left-4`}>
          <Icon d={PREV} />
        </button>
      )}
      {i < images.length - 1 && (
        <button type="button" aria-label="다음 이미지" onClick={() => setI(i + 1)} className={`${arrow} right-4`}>
          <Icon d={NEXT} />
        </button>
      )}
      <button
        ref={closeRef}
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute top-4 right-4 flex size-10 items-center justify-center text-ink-inverse dark:text-ink"
      >
        <Icon d={ICON_PATHS.close} size={24} />
      </button>
      <p className="absolute inset-x-0 bottom-4 text-center text-body text-ink-inverse dark:text-ink">
        {i + 1}/{images.length}
      </p>
    </div>
  );
}
