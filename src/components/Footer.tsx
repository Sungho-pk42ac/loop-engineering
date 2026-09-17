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
  type FooterLink as FooterLinkData,
  type SnsName,
} from "@/data/footer";
import { STORE_TABS } from "./Header";
import { Icon } from "./Icon";

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
    <div className="flex items-center justify-between pb-2">
      <h2 className="text-body font-medium text-ink">{title}</h2>
      <Link href="/products" className="text-label font-regular text-ink-muted underline">
        전체보기
      </Link>
    </div>
  );
}

// 푸터 윗부분(#52: 스토어 타일·공지·결제 혜택) + 아랫부분(#53: 링크 5열·고객센터·회사 정보·약관·인증·SNS).
// 윗부분 원본 실측(#149): 전체 폭 좌우 16, 글자 없는 작은 타일(로고 자리)·13px 행·블록마다 옅은 아래 구분선, 767 이하 3열·6열 그리드.
// 원본 로고·카드사 이름은 옮기지 않아 칸만 두고 이름은 sr-only.
// 회사 정보·약관·전화는 모두 가상 값(클론 규칙).
export function Footer() {
  return (
    <footer className="bg-surface-muted">
      <div className="flex flex-col px-4 pb-16 md:pt-4">
        <ul aria-label="스토어 바로가기" className="grid grid-cols-3 gap-1 border-b border-line-subtle py-6 md:flex md:flex-wrap">
          {STORE_TABS.map((store) => (
            <li key={store} className="md:w-20">
              <Link href="/products" className="block h-8 rounded-sm bg-surface-sunken">
                <span className="sr-only">{store}</span>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-6 border-b border-line-subtle pb-4">
          <SectionTitle title="공지사항" />
          <ul>
            {notices.map(({ title, date, isNew }) => (
              <li key={title}>
                <Link href="/products" className="flex items-start justify-between gap-4 py-1 text-label font-regular text-ink">
                  <span className="relative pr-3">
                    {title}
                    {isNew && (
                      <>
                        <span data-new-dot aria-hidden="true" className="absolute top-0 right-0 size-1 rounded-full bg-accent" />
                        <span className="sr-only">새 글</span>
                      </>
                    )}
                  </span>
                  <span className="w-18 shrink-0 text-label font-regular text-ink-muted">{date}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 border-b border-line-subtle pb-4">
          <SectionTitle title="결제 혜택" />
          <ul className="pt-1">
            {paymentBenefits.map(({ lead, detail }) => (
              <li key={lead} className="flex items-start py-1">
                <span aria-hidden="true" className="size-5 shrink-0 rounded-full bg-surface" />
                <p className="pl-2 text-label font-regular">
                  <span className="text-ink">{lead}</span> <span className="text-ink-muted">{detail}</span>
                </p>
              </li>
            ))}
          </ul>
          <ul aria-label="결제수단" className="mt-3 mb-2 grid grid-cols-6 gap-1 md:flex">
            {paymentMethods.map((method) => (
              <li key={method} className="h-7 rounded-sm bg-surface md:w-13">
                <span className="sr-only">{method}</span>
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
