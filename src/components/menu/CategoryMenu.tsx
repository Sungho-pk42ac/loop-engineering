"use client";

import { useEffect, useRef, useState } from "react";
import { menuTabs, type MenuCategory } from "@/data/menu";
import { getActiveIndex } from "@/lib/scrollSpy";

const GENDERS = ["전체", "남성", "여성"] as const;

// 카테고리 메뉴 뼈대(#116). 원본 실측: 가운데 600 칸(모바일 전폭), 탭 줄 44 + (데스크톱)전체/남성/여성 줄 40 아래
// 좌측 대분류(90 → 4px 배수 88) · 우측 내용이 각자 세로 스크롤하고 화면 끝까지 채워 창 스크롤이 없다.
// 탭 밑줄 2px 은 §5.2 예외(원본 실측). 비선택 대분류 글자는 원본 #8a8a8a 대신 대비 4.5:1 을 위해 ink-muted.
// 대분류 클릭 = 우측 scrollTop 을 구역 top 으로 즉시 이동(URL 불변), 우측 스크롤 = 좌측 선택 갱신. 호버 변화 없음.
// 탭 전환(#118)·성별 전환(#119)·구역 내부(#117)는 후속이라 모양만 둔다.
export function CategoryMenu({ categories }: { categories: MenuCategory[] }) {
  const [active, setActive] = useState(0);
  const panesRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // 두 목록 높이 = 화면 끝 - 자기 top. 이 화면 동안 창 스크롤을 잠근다(원본은 창 scrollY 0 유지).
  useEffect(() => {
    const panes = panesRef.current;
    if (!panes) return;
    const fit = () => {
      panes.style.height = `${window.innerHeight - panes.getBoundingClientRect().top}px`;
    };
    const overflow = document.body.style.overflow;
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    fit();
    window.addEventListener("resize", fit);
    return () => {
      window.removeEventListener("resize", fit);
      document.body.style.overflow = overflow;
    };
  }, []);

  const sections = () => Array.from(rightRef.current?.querySelectorAll("section") ?? []);

  function select(index: number) {
    const right = rightRef.current;
    const section = sections()[index];
    if (!right || !section) return;
    right.scrollTop = section.offsetTop;
    setActive(index);
  }

  return (
    <div className="bg-surface-subtle">
      <div className="mx-auto md:max-w-150">
        <nav aria-label="메뉴 탭" className="flex h-11 px-2">
          {menuTabs.map((tab) => {
            const current = tab === "카테고리";
            return (
              <span
                key={tab}
                aria-current={current ? "page" : undefined}
                className={`flex px-2 text-body whitespace-nowrap ${current ? "font-semibold text-ink" : "font-regular text-ink-muted"}`}
              >
                <span className={`flex items-center border-b-2 ${current ? "border-line-strong" : "border-transparent"}`}>{tab}</span>
              </span>
            );
          })}
        </nav>
        {/* 실측(247): 줄 아래 칸 전폭 1px 구분선, 선택은 굵은 검정(밑줄 없음)·비선택은 얇은 회색 */}
        <div role="group" aria-label="성별" className="hidden h-10 items-center border-b border-line px-2 md:flex">
          {GENDERS.map((gender) => (
            <span
              key={gender}
              className={`px-2 text-label ${gender === "전체" ? "font-semibold text-ink" : "font-regular text-ink-muted"}`}
            >
              {gender}
            </span>
          ))}
        </div>

        <div ref={panesRef} className="flex">
          <ul aria-label="대분류" className="w-22 shrink-0 overflow-y-auto bg-surface-subtle">
            {categories.map(({ id, label }, i) => (
              <li key={id}>
                <button
                  type="button"
                  aria-current={i === active ? "true" : undefined}
                  onClick={() => select(i)}
                  className={`flex w-full py-2 pr-3 pl-4 text-left text-label focus-visible:-outline-offset-2 ${
                    i === active ? "bg-surface font-semibold text-ink" : "font-regular text-ink-muted"
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <div
            ref={rightRef}
            onScroll={(e) => setActive(getActiveIndex(sections().map((s) => s.offsetTop), e.currentTarget.scrollTop))}
            className="relative min-w-0 flex-1 overflow-y-auto bg-surface"
          >
            {categories.map(({ id, label }) => (
              <section key={id} aria-labelledby={id} className="last:min-h-full">
                <h2 id={id} className="px-4 py-3 text-body font-semibold text-ink">
                  {label}
                </h2>
                <div className="h-40" />
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
