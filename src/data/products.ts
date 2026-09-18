// 상품 SSOT — PRD(docs/prd/README.md §4) 샘플 데이터 6개. 페이지·컴포넌트가 직접 import 한다.
export interface Product {
  id: string;
  name: string;
  /** 원 단위 정수 */
  price: number;
  /** /images/ 로 시작하는 로컬 경로 */
  imageUrl: string;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "미니멀 화이트 머그컵",
    price: 12000,
    imageUrl: "/images/product-01.png",
    description:
      "군더더기 없는 300ml 세라믹 머그컵입니다. 전자레인지와 식기세척기 모두 사용할 수 있습니다.",
  },
  {
    id: "2",
    name: "원목 도마 세트",
    price: 29000,
    imageUrl: "/images/product-02.png",
    description:
      "아카시아 원목으로 만든 대·소 2종 도마 세트입니다. 자연스러운 나뭇결이 그대로 살아 있습니다.",
  },
  {
    id: "3",
    name: "코튼 캔버스 에코백",
    price: 18000,
    imageUrl: "/images/product-03.png",
    description:
      "두툼한 12온스 캔버스로 만든 데일리 에코백입니다. 안주머니가 1개 있어 소지품 정리가 편합니다.",
  },
  {
    id: "4",
    name: "아로마 소이 캔들",
    price: 22000,
    imageUrl: "/images/product-04.png",
    description:
      "100% 천연 소이왁스로 만든 향초입니다. 은은한 우디 향이 약 40시간 동안 이어집니다.",
  },
  {
    id: "5",
    name: "스테인리스 텀블러 500ml",
    price: 25000,
    imageUrl: "/images/product-05.png",
    description:
      "이중 진공 단열 구조로 6시간 보온, 12시간 보냉이 가능합니다. 누수 방지 뚜껑이 적용되어 있습니다.",
  },
  {
    id: "6",
    name: "리넨 룸슬리퍼",
    price: 15000,
    imageUrl: "/images/product-06.png",
    description:
      "통기성 좋은 리넨 소재의 실내 슬리퍼입니다. 논슬립 밑창으로 미끄러짐을 막아 줍니다.",
  },
];
