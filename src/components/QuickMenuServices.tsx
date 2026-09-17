import Link from "next/link";
import { serviceButtons } from "@/data/quickMenu";
import { Icon } from "./Icon";

// 스페셜 그리드 아래 서비스 바로가기 줄(#15). 원본: 높이 36 흰 버튼·1px 테두리·radius 4, 24px 아이콘 + 13px/500 라벨,
// 가운데 정렬 wrap(좁으면 줄바꿈), 호버 변화 없음. '서비스 전체보기'도 같은 모양. 모바일 가로 스크롤은 #16.
export function QuickMenuServices() {
  return (
    <nav aria-label="서비스 바로가기" className="px-4 pt-2 pb-3 md:px-6">
      <ul className="flex flex-wrap justify-center gap-1">
        {serviceButtons.map(({ label, icon }) => (
          <li key={label}>
            <Link
              href="/products"
              className="flex h-9 items-center gap-1 rounded-sm border border-line bg-surface pr-2 pl-1 text-label font-medium whitespace-nowrap text-ink"
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
