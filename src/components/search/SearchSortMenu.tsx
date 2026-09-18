"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { groupSortCode, searchSortGroups, searchSortSingles, sortPeriods } from "@/data/search";
import { resolveSort } from "@/lib/searchGoods";
import { Icon } from "../Icon";

const CHEVRON_DOWN = "M6 9l6 6 6-6";
const CHEVRON_UP = "M6 15l6-6 6 6";
const INFO = "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01";

// 원본 비선택 항목은 #8A8A8A(ink-tertiary)지만 흰 배경에서 3.3:1 이라 §2.3 에 따라 ink-muted(4.5:1)를 쓴다(#111).
const itemClass = "flex h-8 w-full items-center justify-between px-3 text-left text-label font-regular";

// 검색 결과 정렬 드롭다운(#111). 원본 실측: 개수 줄 오른쪽 13px 회색 트리거 + 꺾쇠, 아래 4px·오른쪽 +4px 에 115 폭 메뉴(테두리 1px·radius 4·그림자 없음),
// 항목 32 높이·기본 회색/선택 검정(체크 없음), 뒤 4개는 기간 하위 7개를 회색 띠로 펼침. 선택하면 sortCode 만 바꾸고 다른 쿼리는 유지, 전환 없음.
export function SearchSortMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = resolveSort(searchParams.get("sortCode"));
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(sort.groupIndex ?? null);

  function select(code: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortCode", code);
    setOpen(false);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function toggle() {
    setExpanded(sort.groupIndex ?? null);
    setOpen((v) => !v);
  }

  return (
    <div className="relative" onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
        className="flex items-center gap-1 text-label font-regular text-ink-muted"
      >
        {sort.label}
        <Icon d={open ? CHEVRON_UP : CHEVRON_DOWN} size={12} />
      </button>

      {open && (
        <div role="menu" className="absolute top-full -right-1 z-dropdown mt-1 w-29 rounded-sm border border-line bg-surface py-1">
          {searchSortSingles.map(({ label, code }, i) =>
            i === 0 ? (
              <div key={code} role="none" className="flex items-center">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => select(code)}
                  className={`${itemClass} pr-1 ${sort.code === code ? "text-ink" : "text-ink-muted"}`}
                >
                  {label}
                </button>
                <button type="button" role="menuitem" aria-label="정렬 안내" className="flex h-8 items-center pr-3 text-icon-muted">
                  <Icon d={INFO} size={16} />
                </button>
              </div>
            ) : (
              <button
                key={code}
                type="button"
                role="menuitem"
                onClick={() => select(code)}
                className={`${itemClass} ${sort.code === code ? "text-ink" : "text-ink-muted"}`}
              >
                {label}
              </button>
            ),
          )}

          {searchSortGroups.map((group, groupIndex) => {
            const openGroup = expanded === groupIndex;
            return (
              <div key={group.label} role="none">
                <button
                  type="button"
                  role="menuitem"
                  aria-expanded={openGroup}
                  onClick={() => setExpanded(openGroup ? null : groupIndex)}
                  className={`${itemClass} ${openGroup || sort.groupIndex === groupIndex ? "text-ink" : "text-ink-muted"}`}
                >
                  {group.label}
                  <Icon d={openGroup ? CHEVRON_UP : CHEVRON_DOWN} size={16} />
                </button>
                {openGroup && (
                  <div role="group" aria-label={group.label} className="bg-surface-subtle">
                    {sortPeriods.map((period) => {
                      const code = groupSortCode(group, period.code);
                      return (
                        <button
                          key={code}
                          type="button"
                          role="menuitem"
                          onClick={() => select(code)}
                          className={`${itemClass} ${sort.code === code ? "text-ink" : "text-ink-muted"}`}
                        >
                          {period.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
