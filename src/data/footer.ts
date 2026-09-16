export interface Notice {
  title: string;
  /** 표시 그대로의 날짜 문구(예: "2일 전", "2026.09.01") */
  date: string;
  isNew: boolean;
}

export type BenefitIcon = "card" | "percent" | "gift" | "coin" | "truck";

export interface PaymentBenefit {
  icon: BenefitIcon;
  text: string;
}

// 패캠 스토어 자리표시자 문구 — 원본 공지·카드사 이름은 옮기지 않는다.
export const notices: Notice[] = [
  { title: "패캠 스토어 서비스 점검 안내", date: "2일 전", isNew: true },
  { title: "개인정보 처리방침 개정 안내", date: "2026.09.01", isNew: false },
  { title: "추석 연휴 배송 일정 안내", date: "2026.08.25", isNew: false },
];

export const paymentBenefits: PaymentBenefit[] = [
  { icon: "card", text: "패캠카드 결제 시 5% 할인" },
  { icon: "percent", text: "첫 구매 10% 쿠폰 즉시 지급" },
  { icon: "gift", text: "5만원 이상 구매 시 사은품 증정" },
  { icon: "coin", text: "간편결제 이용 시 적립금 2배" },
  { icon: "truck", text: "모든 상품 무료배송" },
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
