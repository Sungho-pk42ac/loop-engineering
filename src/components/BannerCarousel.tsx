import Image from "next/image";
import Link from "next/link";
import { banners } from "@/data/banners";

// 뷰포트 폭 전체 가로 슬라이드 줄. 자동 넘김(#11)·이전/다음 버튼(#12)은 후속.
// 간격 없이 붙인 전폭 줄이라 배너 라운드(2xl)는 쓰지 않는다(원본과 같음).
export function BannerCarousel() {
  return (
    <section aria-label="기획전 배너" className="flex snap-x snap-mandatory overflow-x-auto">
      {banners.map((banner) => (
        <Link
          key={banner.id}
          href={banner.href}
          className="relative aspect-4/3 w-62 shrink-0 snap-start bg-surface-subtle md:w-120"
        >
          <Image src={banner.imageUrl} alt={banner.title.replace("\n", " ")} fill sizes="(min-width: 768px) 480px, 248px" className="object-cover" />
          {/* 밝은 이미지 위 흰 글씨 가독성용 딤(검정 60%) */}
          <div className="absolute inset-0 bg-surface-overlay" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-ink-inverse md:p-6 dark:text-ink">
            <p className="whitespace-pre-line text-title-sm font-semibold md:text-title-lg md:font-bold">{banner.title}</p>
            <p className="text-detail">{banner.subtitle}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}
