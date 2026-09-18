"use client";

import { Icon } from "../Icon";

const CHECK = "M5 12l4 4 10-10";

// 필터 레이어 옵션 행(#112). 원본 실측: 34px 행, 16×16 박스(체크박스 radius 2·라디오 원) + 라벨 8px,
// 기본 회색 13/400 · 선택 검정 13/600. 네이티브 input 을 시각적으로만 숨겨 키보드·스크린리더 동작을 유지한다.
// 미선택 테두리는 원본 #ccc(1.6:1) 대신 icon-muted(3.4:1) — 컨트롤 경계 대비(§2.3·원본 결함 미모방).
export function FilterOption({
  type,
  name,
  label,
  checked,
  onChange,
}: {
  type: "checkbox" | "radio";
  name?: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex h-9 cursor-pointer items-center">
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={`flex size-4 shrink-0 items-center justify-center border peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
          type === "radio" ? "rounded-full" : "rounded-xs"
        } ${checked ? "border-line-strong bg-surface-inverse text-icon-inverse" : "border-icon-muted bg-surface"}`}
      >
        {checked && (type === "radio" ? <span className="size-2 rounded-full bg-surface" /> : <Icon d={CHECK} size={10} />)}
      </span>
      <span className={`ml-2 text-label ${checked ? "font-semibold text-ink" : "font-regular text-ink-muted"}`}>{label}</span>
    </label>
  );
}
