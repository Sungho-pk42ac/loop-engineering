// 스크롤 스파이: 구역 top 들(오름차순)과 현재 scrollTop 으로 선택할 구역 번호.
// 원본은 다음 구역 top 이 상단에 닿기 전에 미리 바뀐다(실측 50~56px) → 4px 배수로 가장 가까운 52 로 앞당긴다.
// 이 여유가 클릭 이동(scrollTop = offsetTop) 직후 보정(기존 1px)도 흡수한다.
export const SPY_LEAD = 52;

export function getActiveIndex(offsetTops: number[], scrollTop: number): number {
  let active = 0;
  offsetTops.forEach((top, i) => {
    // 앞당김이 구역 높이보다 크면 클릭한 구역을 건너뛴다 → 앞 구역 높이 안으로 제한한다
    const lead = i === 0 ? SPY_LEAD : Math.min(SPY_LEAD, top - offsetTops[i - 1] - 1);
    if (top <= scrollTop + lead) active = i;
  });
  return active;
}
