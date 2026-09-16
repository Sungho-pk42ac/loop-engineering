import Link from "next/link";
import { notices, paymentBenefits, paymentMethods, type BenefitIcon } from "@/data/footer";
import { STORE_TABS } from "./Header";
import { Icon } from "./Icon";

const BENEFIT_ICON: Record<BenefitIcon, string> = {
  card: "M3 7h18v10H3zM3 11h18",
  percent: "M6 18L18 6M7.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM16.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  gift: "M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-1-3-5-3-5 0M12 7c1-3 5-3 5 0",
  coin: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9 12h6",
  truck: "M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
};

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-title-sm font-semibold text-ink">{title}</h2>
      <Link href="/products" className="text-label text-ink-secondary underline">
        전체보기
      </Link>
    </div>
  );
}

// 푸터 윗부분(#52). 아랫부분 링크·고객센터·회사 정보는 #53.
export function Footer() {
  return (
    <footer className="bg-surface-subtle">
      <div className="mx-auto flex max-w-page flex-col gap-8 px-4 py-10 md:px-6">
        <ul aria-label="스토어 바로가기" className="flex gap-2 overflow-x-auto">
          {STORE_TABS.map((store) => (
            <li key={store} className="shrink-0 lg:flex-1">
              <Link
                href="/products"
                className="flex h-12 items-center justify-center whitespace-nowrap rounded-md bg-surface-muted px-4 text-label font-bold text-ink hover:opacity-80"
              >
                {store}
              </Link>
            </li>
          ))}
        </ul>

        <section>
          <SectionTitle title="공지사항" />
          <ul>
            {notices.map(({ title, date, isNew }) => (
              <li key={title}>
                <Link href="/products" className="flex items-center justify-between gap-4 py-2 text-body text-ink hover:underline">
                  <span className="flex min-w-0 items-center gap-2">
                    {isNew && (
                      <>
                        <span data-new-dot aria-hidden="true" className="size-2 shrink-0 rounded-full bg-accent" />
                        <span className="sr-only">새 글</span>
                      </>
                    )}
                    <span className="truncate">{title}</span>
                  </span>
                  <span className="shrink-0 text-detail text-ink-secondary">{date}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-line pt-8">
          <SectionTitle title="결제 혜택" />
          <ul className="flex flex-col gap-2">
            {paymentBenefits.map(({ icon, text }) => (
              <li key={text} className="flex items-center gap-2 text-body text-ink-secondary">
                <span className="text-icon-muted">
                  <Icon d={BENEFIT_ICON[icon]} />
                </span>
                {text}
              </li>
            ))}
          </ul>
          <ul aria-label="결제수단" className="mt-4 flex gap-2 overflow-x-auto">
            {paymentMethods.map((method) => (
              <li
                key={method}
                className="flex h-8 shrink-0 items-center whitespace-nowrap rounded-sm bg-surface-muted px-3 text-caption text-ink-secondary"
              >
                {method}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </footer>
  );
}
