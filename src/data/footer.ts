export interface Notice {
  title: string;
  /** 표시 그대로의 날짜 문구(예: "2일 전", "2026.09.01") */
  date: string;
  isNew: boolean;
}

export interface PaymentBenefit {
  /** 앞부분(진한 글자) */
  lead: string;
  /** 뒷부분(흐린 글자) */
  detail: string;
}

// 패캠 스토어 자리표시자 문구 — 원본 공지·카드사 이름은 옮기지 않는다.
export const notices: Notice[] = [
  { title: "패캠 스토어 서비스 점검 안내", date: "2일 전", isNew: true },
  { title: "개인정보 처리방침 개정 안내", date: "2026.09.01", isNew: false },
  { title: "추석 연휴 배송 일정 안내", date: "2026.08.25", isNew: false },
];

export const paymentBenefits: PaymentBenefit[] = [
  { lead: "패캠카드", detail: "결제 시 5% 할인" },
  { lead: "첫 구매", detail: "10% 쿠폰 즉시 지급" },
  { lead: "5만원 이상 구매", detail: "시 사은품 증정" },
  { lead: "간편결제", detail: "이용 시 적립금 2배" },
  { lead: "모든 상품", detail: "무료배송" },
];

export const paymentMethods: string[] = [
  "패캠카드",
  "간편결제",
  "계좌이체",
  "무통장입금",
  "휴대폰결제",
  "포인트",
  "상품권",
  "후불결제",
];

// ── 푸터 아랫부분(#53) — 실제 회사 정보·약관 문구 없이 가상 값 ──

export interface FooterLink {
  label: string;
  /** 원본이 새 탭으로 여는 외부 링크 */
  external: boolean;
}

export interface FooterLinkColumn {
  title: string;
  links: FooterLink[];
}

const internal = (label: string): FooterLink => ({ label, external: false });
const external = (label: string): FooterLink => ({ label, external: true });

export const footerColumns: FooterLinkColumn[] = [
  { title: "스토어", links: ["패캠 스토어", "뷰티", "스포츠", "아울렛", "키즈"].map(internal) },
  { title: "서비스", links: ["랭킹", "세일", "발매", "콘텐츠", "기획전", "이벤트"].map(internal) },
  { title: "파트너", links: [external("입점 문의"), external("광고 문의"), external("제휴 문의")] },
  { title: "회사", links: [external("회사 소개"), external("채용"), internal("공지사항")] },
  { title: "고객 지원", links: ["자주 묻는 질문", "1:1 문의", "배송 조회"].map(internal) },
];

export const customerCenter = {
  phone: "0000-0000",
  hours: ["평일 09:00 ~ 18:00", "점심 12:00 ~ 13:00 (주말·공휴일 휴무)"],
  email: "help@example.com",
};

export const companyInfo = {
  copyright: "© 패캠 스토어. 모든 권리 보유.",
  lines: ["(주)패캠 스토어 · 대표 홍길동 · 서울특별시 가상구 가상로 00", "사업자등록번호 000-00-00000 · 통신판매업신고 제0000-가상-0000호"],
  /** 회사 정보 줄 끝 밑줄 링크(원본은 새 탭) */
  links: [external("사업자정보확인")],
  notice:
    "패캠 스토어는 강의 실습용 가상 쇼핑몰입니다. 표시된 회사 정보·상품·가격은 모두 자리표시자이며 실제 거래가 이루어지지 않습니다.",
};

export const termsLinks: FooterLink[] = ["개인정보처리방침", "이용약관", "청소년보호정책", "위치정보 이용약관", "고객센터 운영정책"].map(internal);

export const certificationLinks: FooterLink[] = [external("구매안전서비스 가입 확인"), external("정보보호 관리체계 인증")];

export const certificationIconLink: FooterLink = external("품질경영 인증");

export type SnsName = "instagram" | "youtube" | "facebook" | "blog";

export const snsLinks: { name: SnsName; label: string }[] = [
  { name: "instagram", label: "인스타그램" },
  { name: "youtube", label: "유튜브" },
  { name: "facebook", label: "페이스북" },
  { name: "blog", label: "블로그" },
];
