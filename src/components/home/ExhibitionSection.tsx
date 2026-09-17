import Link from "next/link";
import { exhibition } from "@/data/exhibition";
import { ExhibitionCountdown } from "./ExhibitionCountdown";
import { ExhibitionProducts } from "./ExhibitionProducts";

const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;

// 기획전 섹션(#20). 원본 실측: 퀵메뉴 바로 아래, 전체 폭 캠페인 단색 배경으로 제목 배너(114)와 섹션이 이어짐,
// 제목 배너는 전폭 링크 띠(112, overflow hidden) 가운데 600×112 제목 자리(좁으면 좌우가 같게 잘림)와 상단 +80 전폭 h-8 줄 띠(600폭 컨테이너·한 줄 넘침 숨김, #178), 맨 아래 가운데 최대 600·높이 36 반투명 검정 버튼(새 탭), 호버 변화 없음.
// 원본 흰 글자는 캠페인 배경 대비 2.3:1 이라 §2.3 에 따라 검정 글자. 배너 하단 줄은 카운트다운↔혜택 교대(#21). 브랜드 칩 필터·목록은 ExhibitionProducts(#22). 캐러셀(#23)·카드 구성(#24)은 후속.
export function ExhibitionSection() {
  const { title, subtitle, endsAt, moreLabel, brands, products } = exhibition;

  return (
    <section aria-label="기획전" className="bg-surface-campaign pb-4 text-ink dark:text-ink-inverse">
      <Link href="/products" {...newTab} className="relative block h-28 overflow-hidden bg-surface-campaign focus-visible:-outline-offset-2 focus-visible:outline-ink dark:focus-visible:outline-ink-inverse">
        <span className="absolute top-0 left-1/2 -ml-75 flex h-28 w-150 justify-center pt-6">
          <span className="text-heading font-bold whitespace-nowrap md:text-display">{title}</span>
        </span>
        <span className="absolute inset-x-0 top-20 h-8">
          <span className="mx-auto block max-w-150 px-4 pb-3">
            <span className="block w-full overflow-hidden text-center whitespace-nowrap">
              <ExhibitionCountdown endsAt={endsAt} subtitle={subtitle} />
            </span>
          </span>
        </span>
      </Link>

      <ExhibitionProducts brands={brands} products={products} />

      <div className="px-4 pt-3">
        <Link
          href="/products"
          {...newTab}
          className="mx-auto flex h-9 max-w-150 items-center justify-center rounded-sm bg-surface-campaign-action px-3 text-label font-medium"
        >
          {moreLabel}
        </Link>
      </div>
    </section>
  );
}
