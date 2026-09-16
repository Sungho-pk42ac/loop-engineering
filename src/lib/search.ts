// 서버·클라이언트 양쪽에서 쓰는 검색 결과 경로.
export const searchResultHref = (keyword: string) =>
  `/search/goods?keyword=${encodeURIComponent(keyword)}&keywordType=keyword&gf=A`;
