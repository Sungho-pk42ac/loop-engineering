import { products } from "./products";

// 상품 상세 전용 필드(#62~). products.ts 의 이름·가격은 그대로 두고 상세에서만 쓰는 값을 id 로 붙인다.
export interface ProductDetail {
  id: string;
  /** 갤러리 이미지(3장 이상). 첫 장은 그 상품 자신의 이미지, 나머지는 다른 상품 이미지 재사용 */
  images: string[];
}

export const productDetails: Record<string, ProductDetail> = Object.fromEntries(
  products.map((p, i) => [
    p.id,
    { id: p.id, images: [0, 1, 2, 3].map((k) => products[(i + k) % products.length].imageUrl) },
  ]),
);
