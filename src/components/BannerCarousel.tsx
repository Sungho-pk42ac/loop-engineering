"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { banners } from "@/data/banners";
import { nextScrollLeft, pageStep, prevScrollLeft } from "@/lib/carousel";
import { Chevron } from "./Chevron";

export const AUTOPLAY_MS = 3000;
// 이동 중 연속 클릭은 무시한다(원본 500ms 전환).
const MOVE_LOCK_MS = 500;

type Direction = "prev" | "next";

// 뷰포트 폭 전체 가로 슬라이드 줄. 3초마다 한 화면씩 넘기고 끝에서 처음으로(#11). 호버해도 멈추지 않는다(원본).
// 호버 시 이전·다음 버튼(#12): 양 끝은 반대쪽 끝으로, 누르면 자동 넘김 타이머를 다시 센다(원본).
// 간격 없이 붙인 전폭 줄이라 배너 라운드(2xl)는 쓰지 않는다(원본과 같음).
export function BannerCarousel() {
  const ref = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const lastMove = useRef(0);

  const move = useCallback((direction: Direction) => {
    const el = ref.current;
    const max = el ? el.scrollWidth - el.clientWidth : 0;
    if (!el || max <= 0) return;
    const step = pageStep(el.clientWidth, el.firstElementChild?.clientWidth ?? el.clientWidth);
    const left = direction === "next" ? nextScrollLeft(el.scrollLeft, step, max) : prevScrollLeft(el.scrollLeft, step, max);
    el.scrollTo({ left, behavior: "smooth" });
  }, []);

  const startAutoplay = useCallback(() => {
    clearInterval(timer.current);
    // 동작 줄이기 설정이면 자동 넘김을 걸지 않는다.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(() => move("next"), AUTOPLAY_MS);
  }, [move]);

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(timer.current);
  }, [startAutoplay]);

  function handleArrow(direction: Direction, timeStamp: number) {
    if (lastMove.current && timeStamp - lastMove.current < MOVE_LOCK_MS) return;
    lastMove.current = timeStamp;
    move(direction);
    startAutoplay();
  }

  return (
    <div className="group relative">
      <section ref={ref} aria-label="기획전 배너" className="flex snap-x snap-mandatory overflow-x-auto">
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.href}
            className="relative aspect-4/3 w-62 shrink-0 snap-start bg-surface-subtle md:w-120"
          >
            <Image src={banner.imageUrl} alt={banner.title.replace("\n", " ")} fill sizes="(min-width: 768px) 480px, 248px" className="object-cover" />
            {/* 밝은 이미지 위 흰 글씨 가독성용 딤(검정 60%) */}
            <div className="absolute inset-0 bg-surface-overlay" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-ink-inverse md:p-6 dark:text-ink">
              <p className="whitespace-pre-line text-title-sm font-semibold md:text-title-lg md:font-bold">{banner.title}</p>
              <p className="text-detail">{banner.subtitle}</p>
            </div>
          </Link>
        ))}
      </section>
      {/* 원본: 배너 줄 호버 때만 보이고(페이드 없음), 버튼 자체 호버·누름 변화 없음, 그림자 없음. 터치 기기는 hover 가 없어 보이지 않는다.
          키보드는 배너 안에 포커스가 오면 보인다(group-focus-within). 다크 모드도 흰 원 유지. */}
      {(["prev", "next"] as const).map((direction) => (
        <button
          key={direction}
          type="button"
          aria-label={direction === "prev" ? "이전 배너 보기" : "다음 배너 보기"}
          onClick={(e) => handleArrow(direction, e.timeStamp)}
          className={`invisible absolute inset-y-0 my-auto flex size-10 items-center justify-center rounded-full border border-line bg-surface text-icon group-focus-within:visible group-hover:visible dark:bg-surface-inverse dark:text-icon-inverse ${
            direction === "prev" ? "left-4" : "right-4"
          }`}
        >
          <Chevron direction={direction} />
        </button>
      ))}
    </div>
  );
}
