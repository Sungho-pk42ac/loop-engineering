import Link from "next/link";

const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;

// 홈 섹션 머리(#31·#34 공통): 두 줄 제목(고정 문구 + 키워드)과 오른쪽 밑줄 '더보기'(새 탭).
export function SectionHeader({
  id,
  titleLine,
  keyword,
  moreLabel,
  moreHref,
  layout = "px-4",
}: {
  id: string;
  titleLine: string;
  keyword: string;
  moreLabel: string;
  moreHref: string;
  /** 본문과 같은 컨테이너·화면 여백. 전체 폭 캐러셀 섹션(#31)은 기본값 px-4 */
  layout?: string;
}) {
  return (
    <div className={`flex items-end justify-between gap-4 pt-3 pb-2 ${layout}`}>
      <h2 id={id} className="text-title-sm font-medium text-ink">
        <span className="block">{titleLine}</span>
        <span className="block">{keyword}</span>
      </h2>
      <Link href={moreHref} {...newTab} className="shrink-0 px-1 py-2 text-label text-ink-muted underline">
        {moreLabel}
      </Link>
    </div>
  );
}
