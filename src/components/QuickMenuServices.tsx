import Link from "next/link";
import { serviceButtons } from "@/data/quickMenu";
import { Icon } from "./Icon";

// 스페셜 그리드 아래 서비스 바로가기 줄(#15). 원본: 높이 36 흰 버튼·1px 테두리·radius 4, 24px 아이콘 + 13px/500 라벨,
// md 이상: 가운데 정렬 wrap(좁으면 줄바꿈), 호버 변화 없음. '서비스 전체보기'도 같은 모양.
// md 미만(#16, 원본 모바일): 줄바꿈 없는 한 줄을 이 줄만 가로 스크롤, 앞뒤 16px, 스크롤바 숨김.
// 실측(이슈 166): 영역 좌우는 md 이상에서도 16(원본 래퍼 padding 6/16/12, design-tokens §6 예외로 기록). 버튼은 원본 padding
// `5px 8px 5px 5px`·내용 가운데 정렬을 토큰 반올림해 py-1·justify-center 로 적는다 — h-9 고정이라 지금 렌더 크기는 그대로다.
export function QuickMenuServices() {
  return (
    <nav aria-label="서비스 바로가기" className="scrollbar-none overflow-x-auto pt-1 pb-3 md:overflow-visible md:px-4 md:pt-2">
      <ul className="flex w-max gap-1 px-4 md:w-auto md:flex-wrap md:justify-center md:px-0">
        {serviceButtons.map(({ label, icon }) => (
          <li key={label} className="shrink-0">
            <Link
              href="/products"
              className="flex h-9 items-center justify-center gap-1 rounded-sm border border-line bg-surface py-1 pr-2 pl-1 text-label font-medium whitespace-nowrap text-ink"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-xs bg-surface-subtle text-icon">
                <Icon d={icon} size={16} />
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
