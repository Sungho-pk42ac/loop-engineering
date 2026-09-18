"use client";

import { filterDropdowns, quickFilters, reviewGradeOptions, searchCategories } from "@/data/search";
import { FilterOption } from "./FilterOption";

/** 탭별 적용 수(레이어 탭 라벨 뒤 숫자) */
export function countByTab(params: URLSearchParams): number[] {
  return filterDropdowns.map((tab) =>
    tab.keys.reduce((sum, key) => {
      const value = params.get(key);
      if (!value) return sum;
      return sum + (key === "category" ? value.split(",").filter(Boolean).length : 1);
    }, 0),
  );
}

// 필터 레이어 본문(#112). 원본 실측: 탭 하나당 가로 슬라이드 하나(translateX, 전환 없음), 슬라이드마다 독립 세로 스크롤,
// 구역 제목(14/500) + 옵션 2열 그리드(행 34, 박스 16). 옵션을 누르면 적용 버튼 없이 즉시 쿼리·목록·개수가 바뀐다.
export function SearchFilterSlides({
  tab,
  params,
  onChange,
}: {
  tab: number;
  params: URLSearchParams;
  onChange: (change: (params: URLSearchParams) => void) => void;
}) {
  const categories = (params.get("category") ?? "").split(",").filter(Boolean);
  const grade = params.get("minReviewGrade");

  const toggleCategory = (code: string) =>
    onChange((next) => {
      const rest = categories.includes(code) ? categories.filter((c) => c !== code) : [...categories, code];
      return rest.length > 0 ? next.set("category", rest.join(",")) : next.delete("category");
    });

  // 라디오는 원본처럼 해제되지 않는다(이미 선택된 항목은 change 이벤트가 나지 않음)
  const setGrade = (value: string) => onChange((next) => next.set("minReviewGrade", value));

  const toggleBenefit = (key: string, value: string) =>
    onChange((next) => (next.get(key) === value ? next.delete(key) : next.set(key, value)));

  const slide = "w-full shrink-0 overflow-y-auto px-4 pt-2 pb-16";
  const grid = "grid grid-cols-2 gap-x-2";
  const title = "flex h-9 items-center text-body font-medium text-ink";

  return (
    <div className="flex-1 overflow-hidden">
      <div className="flex h-full" style={{ transform: `translateX(-${tab * 100}%)` }}>
        <div className={slide} inert={tab !== 0}>
          <h3 className={title}>분류</h3>
          <div className={grid}>
            {searchCategories.map(({ label, code }) => (
              <FilterOption
                key={code}
                type="checkbox"
                label={label}
                checked={categories.includes(code)}
                onChange={() => toggleCategory(code)}
              />
            ))}
          </div>
        </div>

        {/* 가격 구역은 #113 */}
        <div className={slide} inert={tab !== 1} />

        <div className={slide} inert={tab !== 2}>
          <h3 className={title}>별점</h3>
          <div className={grid}>
            {reviewGradeOptions.map(({ label, value }) => (
              <FilterOption
                key={value}
                type="radio"
                name="minReviewGrade"
                label={label}
                checked={grade === value}
                onChange={() => setGrade(value)}
              />
            ))}
          </div>
        </div>

        <div className={slide} inert={tab !== 3}>
          <h3 className={title}>혜택</h3>
          <div className={grid}>
            {quickFilters
              .filter((f) => f.key !== "minReviewGrade")
              .map(({ label, key, value }) => (
                <FilterOption
                  key={key}
                  type="checkbox"
                  label={label}
                  checked={params.get(key) === value}
                  onChange={() => toggleBenefit(key, value)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
