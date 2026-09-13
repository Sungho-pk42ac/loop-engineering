import type { HTMLAttributes } from "react";

type Tone = "neutral" | "sale" | "soldout" | "info";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const toneClass: Record<Tone, string> = {
  neutral: "bg-surface-subtle text-ink-secondary",
  sale: "bg-price-sale text-ink-inverse",
  soldout: "bg-soldout text-ink-inverse",
  info: "bg-accent text-ink-inverse",
};

export function Badge({ tone = "neutral", className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-xs px-1 text-caption font-medium ${toneClass[tone]} ${className}`}
      {...props}
    />
  );
}
