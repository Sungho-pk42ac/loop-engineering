import Link from "next/link";
import {
  certificationIconLink,
  certificationLinks,
  companyInfo,
  customerCenter,
  footerColumns,
  notices,
  paymentBenefits,
  paymentMethods,
  snsLinks,
  termsLinks,
  type BenefitIcon,
  type FooterLink as FooterLinkData,
  type SnsName,
} from "@/data/footer";
import { STORE_TABS } from "./Header";
import { Icon } from "./Icon";

const BENEFIT_ICON: Record<BenefitIcon, string> = {
  card: "M3 7h18v10H3zM3 11h18",
  percent: "M6 18L18 6M7.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM16.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  gift: "M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-1-3-5-3-5 0M12 7c1-3 5-3 5 0",
  coin: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9 12h6",
  truck: "M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
};

const SNS_ICON: Record<SnsName, string> = {
  instagram: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17.5 6.5h.01",
  youtube: "M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM10 9l5 3-5 3z",
  facebook: "M14 21v-8h3l.5-3H14V8.5c0-1 .5-1.5 1.5-1.5H17.5V4.2A15 15 0 0 0 15 4c-2.5 0-4 1.5-4 4.2V10H8v3h3v8",
  blog: "M4 4h16v16H4zM8 9h8M8 13h8M8 17h5",
};

// 원본이 새 탭으로 여는 링크는 target=_blank + rel. 앱에 없는 페이지라 대상은 모두 /products.
function FooterLink({ link, className }: { link: FooterLinkData; className: string }) {
  return (
    <Link
      href="/products"
      className={className}
      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {link.label}
    </Link>
  );
}

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

// 푸터 윗부분(#52: 스토어 타일·공지·결제 혜택) + 아랫부분(#53: 링크 5열·고객센터·회사 정보·약관·인증·SNS).
// 회사 정보·약관·전화는 모두 가상 값(클론 규칙).
export function Footer() {
  return (
    <footer className="bg-surface-subtle">
      <div className="mx-auto flex max-w-page flex-col gap-8 px-4 pt-10 pb-16 md:px-6">
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

        <section aria-label="사이트 링크" className="grid grid-cols-2 gap-4 border-t border-line pt-8 md:grid-cols-5 lg:gap-6">
          {footerColumns.map((column, i) => (
            <div key={column.title}>
              <h2 className="mb-3 text-label font-bold text-ink">{column.title}</h2>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} className="text-detail text-ink-secondary hover:underline" />
                  </li>
                ))}
              </ul>
              {i === footerColumns.length - 1 && (
                <div className="mt-4 flex flex-col gap-1 text-detail text-ink-secondary">
                  <p className="text-label font-bold">고객센터 {customerCenter.phone}</p>
                  {customerCenter.hours.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <a href={`mailto:${customerCenter.email}`} className="underline">
                    {customerCenter.email}
                  </a>
                </div>
              )}
            </div>
          ))}
        </section>

        <section aria-label="회사 정보" className="flex flex-col gap-4 border-t border-line pt-8 text-detail text-ink-secondary">
          <p>{companyInfo.copyright}</p>
          <div className="flex flex-col gap-1">
            {companyInfo.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p>
              {companyInfo.links.map((link) => (
                <FooterLink key={link.label} link={link} className="underline" />
              ))}
            </p>
          </div>
          <p>{companyInfo.notice}</p>

          <ul aria-label="약관" className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {termsLinks.map((link, i) => (
              <li key={link.label} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">·</span>}
                <FooterLink link={link} className={i === 0 ? "font-bold text-ink hover:underline" : "hover:underline"} />
              </li>
            ))}
          </ul>
          <ul aria-label="인증" className="flex flex-wrap gap-x-4 gap-y-1">
            {certificationLinks.map((link) => (
              <li key={link.label}>
                <FooterLink link={link} className="underline" />
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-1">
            <span className="text-icon-muted">
              <Icon d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" size={16} />
            </span>
            <FooterLink link={certificationIconLink} className="underline" />
          </p>
          <ul aria-label="SNS" className="flex gap-2">
            {snsLinks.map(({ name, label }) => (
              <li key={name}>
                <Link
                  href="/products"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-8 items-center justify-center rounded-full bg-surface-muted text-icon hover:opacity-80"
                >
                  <Icon d={SNS_ICON[name]} size={16} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </footer>
  );
}
