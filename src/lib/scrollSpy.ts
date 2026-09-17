// 스크롤 스파이: 구역 top 들(오름차순)과 현재 scrollTop 으로 선택할 구역 번호. 1px 여유로 클릭 이동(scrollTop = offsetTop) 직후도 그 구역.
export function getActiveIndex(offsetTops: number[], scrollTop: number): number {
  let active = 0;
  offsetTops.forEach((top, i) => {
    if (top <= scrollTop + 1) active = i;
  });
  return active;
}
