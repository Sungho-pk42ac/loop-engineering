import { describe, expect, it } from "vitest";
import { searchGoodsItems, searchSortSingles } from "@/data/search";
import { resolveSort, sortSearchGoods } from "./searchGoods";

const ids = (items: ReturnType<typeof sortSearchGoods>) => items.map((i) => i.id);

describe("resolveSort", () => {
  it("없거나 알 수 없는 코드는 추천순", () => {
    expect(resolveSort(null).code).toBe("RECOMMEND");
    expect(resolveSort("NOPE").label).toBe(searchSortSingles[0].label);
  });

  it("그룹 코드는 '상위 하위' 라벨과 그룹·기간을 돌려준다", () => {
    const sort = resolveSort("SALE_ONE_WEEK_AMOUNT");
    expect(sort.label).toBe("판매금액순 1주일");
    expect(sort.groupIndex).toBe(0);
    expect(sort.period).toBe("ONE_WEEK");
  });
});

describe("sortSearchGoods", () => {
  it("추천순·잘못된 코드는 원래 순서", () => {
    expect(ids(sortSearchGoods(searchGoodsItems, "RECOMMEND"))).toEqual(ids(searchGoodsItems));
    expect(ids(sortSearchGoods(searchGoodsItems, "NOPE"))).toEqual(ids(searchGoodsItems));
  });

  it("단일 6종이 기대 순서", () => {
    const low = sortSearchGoods(searchGoodsItems, "LOW_PRICE");
    expect(low[0].price).toBe(Math.min(...searchGoodsItems.map((i) => i.price)));
    const high = sortSearchGoods(searchGoodsItems, "HIGH_PRICE");
    expect(high[0].price).toBe(Math.max(...searchGoodsItems.map((i) => i.price)));
    expect(sortSearchGoods(searchGoodsItems, "NEW")[0].createdAt).toBe(
      searchGoodsItems.map((i) => i.createdAt).sort().at(-1),
    );
    expect(sortSearchGoods(searchGoodsItems, "DISCOUNT_RATE")[0].discountRate).toBe(
      Math.max(...searchGoodsItems.map((i) => i.discountRate)),
    );
    expect(sortSearchGoods(searchGoodsItems, "REVIEW")[0].reviewCount).toBe(
      Math.max(...searchGoodsItems.map((i) => i.reviewCount)),
    );
  });

  it("그룹 4종은 기간과 무관하게 그룹 지표로 정렬(자리표시자 한계)", () => {
    const byAmount = sortSearchGoods(searchGoodsItems, "SALE_ONE_WEEK_AMOUNT");
    expect(byAmount[0].saleAmount).toBe(Math.max(...searchGoodsItems.map((i) => i.saleAmount)));
    expect(ids(byAmount)).toEqual(ids(sortSearchGoods(searchGoodsItems, "SALE_ONE_YEAR_AMOUNT")));
    expect(sortSearchGoods(searchGoodsItems, "SALE_ONE_DAY_COUNT")[0].saleCount).toBe(
      Math.max(...searchGoodsItems.map((i) => i.saleCount)),
    );
    expect(sortSearchGoods(searchGoodsItems, "VIEW_ONE_MONTH")[0].viewCount).toBe(
      Math.max(...searchGoodsItems.map((i) => i.viewCount)),
    );
    expect(sortSearchGoods(searchGoodsItems, "LIKE_THREE_DAY")[0].likeCount).toBe(
      Math.max(...searchGoodsItems.map((i) => i.likeCount)),
    );
  });

  it("동률은 원래 순서를 지킨다", () => {
    const items = [
      { ...searchGoodsItems[0], id: "a", likeCount: 10 },
      { ...searchGoodsItems[1], id: "b", likeCount: 10 },
      { ...searchGoodsItems[2], id: "c", likeCount: 20 },
    ];
    expect(ids(sortSearchGoods(items, "LIKE_ONE_DAY"))).toEqual(["c", "a", "b"]);
  });
});
