"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { banners } from "@/data/banners";
import { nextScrollLeft, pageStep, prevScrollLeft } from "@/lib/carousel";
import { Icon } from "./Icon";

export const AUTOPLAY_MS = 3000;
// 이동 중 연속 클릭은 무시한다(원본 500ms 전환).
const MOVE_LOCK_MS = 500;

type Direction = "prev" | "next";

// 뷰포트 폭 전체 가로 슬라이드 줄. 3초마다 한 화면씩 넘기고 끝에서 처음으로(#11). 호버해도 멈추지 않는다(원본).
// 호버 시 이전·다음 버튼(#12): 양 끝은 반대쪽 끝으로, 누르면 자동 넘김 타이머를 다시 센다(원본).
// 간격 없이 붙인 줄이라 배너 라운드(2xl)는 쓰지 않는다(원본과 같음).
// 원본 실측(#151): 최대 1440 가운데, 768 이상 화면 1/3 폭(4:3) 3장, 767 이하 앞뒤 16 남긴 한 장. 글자는 좌하단 20·오른쪽 72 자리,
// 덮개는 아래로 갈수록 짙어지는 검정 그라데이션(두 모드 모두 검정 — scrim). 원본 투명도 12% 는 우리 밝은 상품 사진 위
// 흰 글자 대비가 1.3:1 로 §2.3 미달이라 90% 로 올렸다(원본 결함 미모방, 그라데이션 지점은 원본 그대로).
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
    <div className="group relative mx-auto max-w-wide">
      <section
        ref={ref}
        aria-label="기획전 배너"
        className="flex snap-x snap-mandatory scroll-px-4 overflow-x-auto px-4 md:scroll-px-0 md:px-0"
      >
        {banners.map((banner) => (
          <Link key={banner.id} href={banner.href} className="relative aspect-4/3 w-full shrink-0 snap-start bg-surface md:w-1/3">
            <Image src={banner.imageUrl} alt={banner.title.replace("\n", " ")} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-surface-image-tint" />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-b from-transparent from-30% via-surface-overlay via-60% to-scrim opacity-90"
            />
            <div className="absolute right-18 bottom-5 left-5 text-ink-inverse dark:text-ink">
              <p className="line-clamp-2 text-title font-semibold whitespace-pre-line">{banner.title}</p>
              <p className="mt-2 line-clamp-2 text-label font-semibold whitespace-pre-line">{banner.subtitle}</p>
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
          <Icon d={direction === "prev" ? "M14 6l-6 6 6 6" : "M10 6l6 6-6 6"} />
        </button>
      ))}
    </div>
  );
}
