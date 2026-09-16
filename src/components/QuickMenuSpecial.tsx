import Image from "next/image";
import Link from "next/link";
import { specialCards } from "@/data/quickMenu";
import { Icon } from "./Icon";

// 배너 아래 퀵메뉴 스페셜 그리드(#14). 원본: 140×60 카드(옅은 배경 + 가운데 그림 + 하단 가운데 11px 라벨),
// 원본 합성 이미지 대신 surface-subtle 배경 위에 상품 사진(contain)을 얹고 라벨은 배경 위에 둬 대비를 지킨다.
// 가운데 정렬 wrap·간격 4px, 끝에 좁은 '스페셜 전체보기' 타일. 호버 변화 없음. 모바일 가로 스크롤 배치는 #16.
export function QuickMenuSpecial() {
  return (
    <section aria-label="스페셜" className="px-4 pt-3 md:px-6">
      <ul className="flex flex-wrap justify-center gap-1">
        {specialCards.map(({ id, label, imageUrl }) => (
          <li key={id}>
            <Link href="/products" className="relative block h-15 w-35 overflow-hidden rounded-sm bg-surface-subtle">
              <Image src={imageUrl} alt={label} fill sizes="140px" className="object-contain pb-4" />
              <span className="absolute inset-x-2 bottom-1 truncate text-center text-caption font-medium text-ink">{label}</span>
            </Link>
          </li>
        ))}
        <li>
          <Link href="/products" className="flex h-15 w-22 flex-col items-center gap-2 rounded-sm pt-2 text-caption font-medium text-ink">
            <span className="flex size-7 items-center justify-center rounded-full border border-line bg-surface text-icon">
              <Icon d="M5 12h14M13 6l6 6-6 6" />
            </span>
            스페셜 전체보기
          </Link>
        </li>
      </ul>
    </section>
  );
}
