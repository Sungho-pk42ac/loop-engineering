"use client";

import { quickFilters, searchCategories } from "@/data/search";
import { Icon } from "../Icon";

const CLOSE = "M6 6l12 12M18 6L6 18";

export interface AppliedFiltersProps {
  params: URLSearchParams;
  onRemove: (change: (params: URLSearchParams) => void) => void;
  onReset: () => void;
  className?: string;
}

/** 적용 필터 줄(#110) — 필터 줄 아래와 필터 레이어 안(#112)에서 같이 쓴다. 항목 × 는 그 쿼리만, 초기화는 전부 + gf=A. */
export function AppliedFilters({ params, onRemove, onReset, className = "" }: AppliedFiltersProps) {
  const gf = params.get("gf") ?? "A";
  const quick = quickFilters.filter((f) => params.get(f.key) === f.value);
  const categories = (params.get("category") ?? "").split(",").filter(Boolean);
  const items = [
    ...categories.map((code) => ({
      label: searchCategories.find((c) => c.code === code)?.label ?? code,
      drop: (p: URLSearchParams) => {
        const rest = categories.filter((c) => c !== code);
        return rest.length > 0 ? p.set("category", rest.join(",")) : p.delete("category");
      },
    })),
    ...quick.map(({ label, key }) => ({ label, drop: (p: URLSearchParams) => p.delete(key) })),
    ...(gf === "M" || gf === "F"
      ? [{ label: gf === "M" ? "남성" : "여성", drop: (p: URLSearchParams) => p.set("gf", "A") }]
      : []),
  ];

  if (items.length === 0) return null;

  return (
    <div className={`scrollbar-none flex items-center gap-3 overflow-x-auto ${className}`}>
      {items.map(({ label, drop }) => (
        <button
          key={label}
          type="button"
          onClick={() => onRemove(drop)}
          aria-label={`${label} 필터 제거`}
          className="flex shrink-0 items-center gap-1 text-label font-regular text-ink-muted"
        >
          {label}
          <span className="text-icon-muted">
            <Icon d={CLOSE} size={12} />
          </span>
        </button>
      ))}
      <button type="button" onClick={onReset} className="ml-auto shrink-0 text-label font-regular text-ink-muted underline">
        초기화
      </button>
    </div>
  );
}

/** 적용된 필터 개수(상세필터 점·탭 숫자용) */
export function countFilters(params: URLSearchParams): number {
  const gf = params.get("gf") ?? "A";
  const categories = (params.get("category") ?? "").split(",").filter(Boolean);
  return categories.length + quickFilters.filter((f) => params.get(f.key) === f.value).length + (gf === "M" || gf === "F" ? 1 : 0);
}
