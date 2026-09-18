"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { serviceSheetAd, serviceSheetBottomLinks, serviceSheetTiles } from "@/data/serviceSheet";

export const SHEET_STORAGE_KEY = "fc-service-sheet-shown";
export const SHEET_DELAY_MS = 500;
const STEP_MS = 250;

type Phase = "hidden" | "open" | "sliding" | "fading";

const today = () => new Date().toLocaleDateString("sv-SE"); // 로컬 YYYY-MM-DD

// 모바일 진입 시 서비스 바로가기 시트(#164). 원본: 모바일에서 들어오면 0.5초 뒤 딤 + 맨 위 시트 페이드인, 스크롤 잠금,
// '닫기'로만 닫힘(딤 클릭 없음), 하루 한 번. 여는 순간 날짜를 기록한다. 닫힘은 딤 페이드 + 시트 88px 내려감 → 시트 페이드 → 제거.
export function ServiceSheet() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const closeRef = useRef<HTMLButtonElement>(null);
  const overflowRef = useRef<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      if (!window.matchMedia?.("(max-width: 767px)").matches) return;
      try {
        if (localStorage.getItem(SHEET_STORAGE_KEY) === today()) return;
        localStorage.setItem(SHEET_STORAGE_KEY, today());
      } catch {
        return;
      }
      overflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setPhase("open");
    }, SHEET_DELAY_MS);
    return () => {
      clearTimeout(id);
      if (overflowRef.current !== null) document.body.style.overflow = overflowRef.current;
    };
  }, []);

  useEffect(() => {
    if (phase !== "open") return;
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [phase]);

  useEffect(() => {
    if (phase !== "sliding" && phase !== "fading") return;
    const id = setTimeout(() => setPhase(phase === "sliding" ? "fading" : "hidden"), STEP_MS);
    return () => clearTimeout(id);
  }, [phase]);

  function close() {
    if (overflowRef.current !== null) {
      document.body.style.overflow = overflowRef.current;
      overflowRef.current = null;
    }
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setPhase(reduce ? "hidden" : "sliding");
  }

  if (phase === "hidden") return null;
  const closing = phase !== "open";

  return createPortal(
    <>
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-overlay overscroll-none bg-surface-overlay transition-opacity duration-base ease-out starting:opacity-0 motion-reduce:transition-none ${
          closing ? "opacity-0" : "opacity-100"
        }`}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-sheet-title"
        className={`fixed inset-x-0 top-0 z-modal max-h-full overflow-y-auto bg-surface-subtle pt-3 transition duration-base ease-out starting:opacity-0 motion-reduce:transition-none ${
          closing ? "translate-y-22" : ""
        } ${phase === "fading" ? "opacity-0" : "opacity-100"}`}
      >
        <h1 id="service-sheet-title" className="sr-only">
          서비스 바로가기
        </h1>
        <ul className="grid grid-cols-2 gap-1 px-4">
          {serviceSheetTiles.map(({ label, imageUrl }) => (
            <li key={label}>
              <Link href="/products" onClick={close} className="relative block aspect-3/1 overflow-hidden rounded-sm">
                <Image src={imageUrl} alt={label} fill sizes="50vw" className="object-cover" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="px-4 pt-1">
          <Link href="/products" onClick={close} className="relative block aspect-video overflow-hidden rounded-sm">
            <Image src={serviceSheetAd.imageUrl} alt={serviceSheetAd.label} fill sizes="100vw" className="object-cover" />
            <span className="absolute top-2 right-2 rounded-xs bg-surface/60 px-1 text-caption font-medium text-ink">
              {serviceSheetAd.badge}
            </span>
          </Link>
        </div>
        <div className="flex h-12 gap-2 pr-2 pl-4">
          {serviceSheetBottomLinks.map(({ label, imageUrl }, i) => (
            <Link
              key={label}
              href="/products"
              onClick={close}
              className={`relative block h-10 overflow-hidden rounded-sm ${i === 0 ? "w-28" : "w-24"}`}
            >
              <Image src={imageUrl} alt={label} fill sizes="112px" className="object-cover" />
            </Link>
          ))}
          <button ref={closeRef} type="button" onClick={close} className="ml-auto px-2 pt-3 pb-4 text-label font-medium text-ink focus-visible:-outline-offset-2">
            닫기
          </button>
        </div>
      </section>
    </>,
    document.body,
  );
}
