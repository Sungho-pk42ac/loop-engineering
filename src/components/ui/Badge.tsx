import type { HTMLAttributes } from "react";

type Tone = "neutral" | "sale" | "soldout" | "info" | "overlay";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  /** 기본 medium. 이미지 위 라이브 배지처럼 원본이 400 인 곳은 regular */
  weight?: "regular" | "medium";
}

const toneClass: Record<Tone, string> = {
  neutral: "bg-surface-subtle text-ink-secondary",
  sale: "bg-price-sale text-ink-inverse",
  soldout: "bg-soldout text-ink-inverse",
  info: "bg-accent text-ink-inverse",
  // 이미지 위 어두운 라벨(라이브 방송 시각 등) — 다크 모드에서도 흰 글자
  overlay: "bg-surface-overlay text-ink-inverse dark:text-ink",
};

export function Badge({ tone = "neutral", weight = "medium", className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-xs px-1 text-caption ${weight === "regular" ? "font-regular" : "font-medium"} ${toneClass[tone]} ${className}`}
      {...props}
    />
  );
}
