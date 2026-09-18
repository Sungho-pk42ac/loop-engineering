// 가로 캐러셀 다음 스크롤 위치: 한 화면(pageWidth)씩 넘기고, 끝에 닿아 있으면 처음(0)으로.
export function nextScrollLeft(scrollLeft: number, pageWidth: number, maxScrollLeft: number): number {
  // 1px 여유: 소수점 스크롤 위치 때문에 끝을 놓치지 않게
  if (scrollLeft >= maxScrollLeft - 1) return 0;
  return Math.min(scrollLeft + pageWidth, maxScrollLeft);
}

// 한 번에 넘길 폭: 화면에 온전히 들어가는 슬라이드 수 × 슬라이드 폭(최소 1장) — scroll-snap 지점과 맞춘다.
// 1/3 폭 슬라이드가 반올림돼 조금 넓게 읽혀도(1280 → 427) 3장으로 세도록 1% 여유를 둔다(#151).
export function pageStep(visibleWidth: number, slideWidth: number): number {
  if (slideWidth <= 0) return visibleWidth;
  return Math.max(1, Math.floor(visibleWidth / slideWidth + 0.01)) * slideWidth;
}

// 이전 스크롤 위치: 한 번에 step 만큼 뒤로, 처음에 닿아 있으면 마지막(max)으로.
export function prevScrollLeft(scrollLeft: number, step: number, maxScrollLeft: number): number {
  if (scrollLeft <= 1) return maxScrollLeft;
  return Math.max(scrollLeft - step, 0);
}
