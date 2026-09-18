import { beforeEach, describe, expect, it } from "vitest";
import {
  addRecentSearch,
  clearRecentSearches,
  parseRecent,
  readRecentRaw,
  RECENT_SEARCHES_KEY,
  removeRecentSearch,
} from "./recentSearches";

const items = () => parseRecent(readRecentRaw());

describe("recentSearches", () => {
  beforeEach(() => localStorage.clear());

  it("맨 앞에 쌓이고 at 은 ISO 문자열", () => {
    addRecentSearch("머그컵");
    addRecentSearch("도마");

    expect(items().map((i) => i.keyword)).toEqual(["도마", "머그컵"]);
    expect(new Date(items()[0].at).toISOString()).toBe(items()[0].at);
  });

  it("같은 검색어는 중복되지 않고 앞으로 옮겨진다", () => {
    ["머그컵", "도마", "머그컵"].forEach(addRecentSearch);

    expect(items().map((i) => i.keyword)).toEqual(["머그컵", "도마"]);
  });

  it("최대 10개만 남는다", () => {
    Array.from({ length: 12 }, (_, i) => `검색어${i}`).forEach(addRecentSearch);

    expect(items()).toHaveLength(10);
    expect(items()[0].keyword).toBe("검색어11");
  });

  it("빈 문자열·공백은 저장하지 않고, 저장 시 앞뒤 공백을 다듬는다", () => {
    addRecentSearch("   ");
    expect(items()).toHaveLength(0);

    addRecentSearch("  머그컵  ");
    expect(items()[0].keyword).toBe("머그컵");
  });

  it("항목 삭제·전체 삭제", () => {
    ["머그컵", "도마"].forEach(addRecentSearch);

    removeRecentSearch("머그컵");
    expect(items().map((i) => i.keyword)).toEqual(["도마"]);

    clearRecentSearches();
    expect(items()).toEqual([]);
  });

  it("JSON 이 깨졌거나 형태가 다르면 빈 배열", () => {
    localStorage.setItem(RECENT_SEARCHES_KEY, "{잘못된 JSON");
    expect(items()).toEqual([]);

    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(["문자열", { keyword: "머그컵", at: "2026-01-01T00:00:00.000Z" }]));
    expect(items().map((i) => i.keyword)).toEqual(["머그컵"]);
  });
});
