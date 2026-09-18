// 캐러셀 이전·다음 버튼 꺾쇠(원본 실측 #156): SVG 40×40 안 6.9×14, 선 1.5px, 각진 끝(butt/miter). 색은 currentColor.
// 배너 캐러셀·라이브 편성표(#175)가 같이 쓴다.
const PATHS = { prev: "M22.5 13l-6.9 7 6.9 7", next: "M17.5 13l6.9 7-6.9 7" } as const;

export function Chevron({ direction }: { direction: keyof typeof PATHS }) {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="shrink-0">
      <path d={PATHS[direction]} strokeLinecap="butt" strokeLinejoin="miter" />
    </svg>
  );
}
