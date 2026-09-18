import Image from "next/image";
import Link from "next/link";
import { specialCards } from "@/data/quickMenu";
import { Icon } from "./Icon";

// 배너 아래 퀵메뉴 스페셜 그리드(#14). 원본: 140×60 카드에 이미지가 칸 전체를 덮고 하단 가운데 11px 라벨,
// 영역은 옅은 회색(#f5f5f5) 위 좌우 16·위 12 (실측 158). 라벨은 원본처럼 이미지 위에 얹되,
// 자리표시자 사진이 어두워 검정 글자가 묻히므로 surface 90% 밴드를 깔아 대비를 지킨다(밴드·글자가 같이 뒤집혀 다크도 안전).
// md 이상: 가운데 정렬 wrap·간격 4px, 끝에 좁은 '스페셜 전체보기' 타일. 호버 변화 없음.
// md 미만(#16, 원본 모바일): 줄바꿈 없는 한 줄을 이 줄만 가로 스크롤, 앞뒤 16px, 스크롤바 숨김. 카드 크기는 그대로.
// overflow-x 는 세로도 자르므로 ul py-1 로 포커스 링(2px+offset 2px)이 잘리지 않게 한다.
export function QuickMenuSpecial() {
  return (
    <section aria-label="스페셜" className="scrollbar-none overflow-x-auto bg-surface-subtle px-4 pt-3 md:overflow-visible">
      <ul className="flex w-max gap-1 py-1 md:w-auto md:flex-wrap md:justify-center md:py-0">
        {specialCards.map(({ id, label, imageUrl }) => (
          <li key={id} className="shrink-0">
            <Link href="/products" className="relative block h-15 w-35 overflow-hidden rounded-sm">
              <Image src={imageUrl} alt={label} fill sizes="140px" className="object-cover" />
              <span className="absolute inset-x-0 bottom-0 truncate bg-surface/90 px-2 py-1 text-center text-caption font-medium text-ink">{label}</span>
            </Link>
          </li>
        ))}
        <li className="shrink-0">
          <Link href="/products" className="flex h-15 w-22 flex-col items-center gap-1 rounded-sm pt-2 text-caption font-medium whitespace-nowrap text-ink">
            <span className="flex size-7 items-center justify-center rounded-full border border-line-subtle bg-surface text-icon">
              <Icon d="M5 12h14M13 6l6 6-6 6" size={16} />
            </span>
            스페셜 전체보기
          </Link>
        </li>
      </ul>
    </section>
  );
}
