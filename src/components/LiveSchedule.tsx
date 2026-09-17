import Image from "next/image";
import Link from "next/link";
import { liveBroadcasts } from "@/data/lives";
import { Badge } from "./ui";

const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;

// 라이브 편성표(#17). 원본 실측: 제목 18/500 + 오른쪽 밑줄 '더보기'(새 탭), 카드 줄 가로 스크롤(앞뒤 16px, 간격 4px,
// 데스크톱만 스냅), 카드 모바일 136·데스크톱 260, 이미지 5:6 + 왼쪽 아래 배지, 브랜드 2줄·혜택 4줄 말줄임, 호버 변화 없음.
// 원본은 페이지 마지막 섹션(푸터 바로 위). 좌우 여백은 §6(px-4 md:px-6), 스냅은 scroll-px 로 여백을 지킨다.
// 카드 라운드 4px 는 §5.1 예외(원본). 이전·다음 버튼은 #18, 모바일 세부는 #19.
export function LiveSchedule() {
  return (
    <section aria-labelledby="live-schedule-title" className="pb-4">
      <div className="flex h-12 items-center justify-between px-4 md:px-6">
        <h2 id="live-schedule-title" className="text-title-sm font-medium text-ink">
          라이브 편성표
        </h2>
        <Link href="/products" {...newTab} className="px-1 py-2 text-label text-ink-muted underline">
          더보기
        </Link>
      </div>
      <ul className="scrollbar-none flex gap-1 overflow-x-auto px-4 md:snap-x md:snap-mandatory md:scroll-px-6 md:px-6">
        {liveBroadcasts.map((live) => (
          <li key={live.id} className="w-34 shrink-0 snap-start md:w-65">
            <Link href="/products" {...newTab} className="flex h-full flex-col overflow-hidden rounded-sm bg-surface">
              <div className="relative aspect-5/6 bg-surface-subtle">
                <Image src={live.imageUrl} alt={live.brand} fill sizes="(min-width: 768px) 260px, 136px" className="object-cover" />
                <Badge tone="overlay" weight="regular" className="absolute bottom-2 left-2 h-4">
                  {live.badge}
                </Badge>
              </div>
              <div className="px-2 pt-2 pb-3">
                <p className="line-clamp-2 text-label font-semibold text-ink">{live.brand}</p>
                <p className="line-clamp-4 text-label text-ink-muted">{live.benefit}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
