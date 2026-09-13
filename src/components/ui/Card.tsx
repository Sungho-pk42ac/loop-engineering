import type { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement>;

// 카드 컨테이너. 무신사처럼 기본은 플랫(그림자 없음), 호버 시에만 옅은 그림자.
export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-line bg-surface transition-shadow hover:shadow-sm ${className}`}
      {...props}
    />
  );
}
