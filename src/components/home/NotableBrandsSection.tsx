import Link from "next/link";
import { notableBrands } from "@/data/brands";
import { Badge } from "../ui/Badge";

// 주목할 만한 브랜드(#26). 원본 실측: 제목 줄(18/500, 좌우 16) 아래 원형 로고 칸(56×96)이 세로 6줄 열 우선으로 가로로 흐르고,
// 넘치면 섹션 안에서만 가로 스크롤. 칸 = 원 56 + 원 아래에 겹친 혜택 배지 + 2줄 이름(11px). 호버 변화 없음, 새 탭.
// 로고 에셋 대신 첫 글자 원(#22 방식). 원본 세로 간격 6 → 8, 제목 줄·섹션 아래 11 → 12(목록 py-1 포커스 링 자리 4 포함).
export function NotableBrandsSection() {
  return (
    <section aria-labelledby="notable-brands" className="pb-2">
      <h2 id="notable-brands" className="px-4 pt-3 pb-2 text-title-sm font-medium text-ink">
        주목할 만한 브랜드
      </h2>
      <ul className="scrollbar-none grid grid-flow-col grid-rows-6 justify-start gap-x-3 gap-y-2 overflow-x-auto px-4 py-1 md:snap-x md:snap-mandatory md:scroll-px-4">
        {notableBrands.map(({ id, name, badge }) => (
          <li key={id} className="w-14 md:snap-start">
            <Link
              href="/products"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={badge ? `${name}, ${badge}` : name}
              className="flex h-24 flex-col items-center"
            >
              <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-body font-semibold text-ink">
                <span aria-hidden="true">{name.charAt(0)}</span>
                {badge && (
                  <Badge tone="outline" className="absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    {badge}
                  </Badge>
                )}
              </span>
              <span className="mt-3 line-clamp-2 w-full text-center text-caption break-keep text-ink-muted">{name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
