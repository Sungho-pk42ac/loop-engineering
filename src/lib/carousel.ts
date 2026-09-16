// 가로 캐러셀 다음 스크롤 위치: 한 화면(pageWidth)씩 넘기고, 끝에 닿아 있으면 처음(0)으로.
export function nextScrollLeft(scrollLeft: number, pageWidth: number, maxScrollLeft: number): number {
  // 1px 여유: 소수점 스크롤 위치 때문에 끝을 놓치지 않게
  if (scrollLeft >= maxScrollLeft - 1) return 0;
  return Math.min(scrollLeft + pageWidth, maxScrollLeft);
}

// 한 번에 넘길 폭: 화면에 온전히 들어가는 슬라이드 수 × 슬라이드 폭(최소 1장) — scroll-snap 지점과 맞춘다.
export function pageStep(visibleWidth: number, slideWidth: number): number {
  if (slideWidth <= 0) return visibleWidth;
  return Math.max(1, Math.floor(visibleWidth / slideWidth)) * slideWidth;
}
