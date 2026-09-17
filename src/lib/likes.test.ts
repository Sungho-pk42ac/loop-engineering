import { beforeEach, describe, expect, it } from "vitest";
import { LIKES_KEY, parseLikes, readLikesRaw, toggleLike } from "./likes";

describe("likes (localStorage 목업)", () => {
  beforeEach(() => localStorage.clear());

  it("toggleLike 는 id 를 넣었다 뺐다 하고 localStorage 에 저장한다", () => {
    toggleLike("ex-1");
    expect(parseLikes(readLikesRaw())).toEqual(["ex-1"]);
    toggleLike("ex-2");
    toggleLike("ex-1");
    expect(JSON.parse(localStorage.getItem(LIKES_KEY)!)).toEqual(["ex-2"]);
  });

  it("깨진 값·배열 아닌 값은 빈 목록", () => {
    expect(parseLikes("{oops")).toEqual([]);
    expect(parseLikes('{"a":1}')).toEqual([]);
    expect(parseLikes('["a", 3]')).toEqual(["a"]);
  });
});
