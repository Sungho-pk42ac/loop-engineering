import { prisma } from "@/lib/prisma";
import type { Product } from "../../generated/prisma/client";

export type { Product };

// 상품 목록 — API 라우트와 페이지가 같은 조회를 공유한다(id 순).
export function getProducts(): Promise<Product[]> {
  return prisma.product.findMany({ orderBy: { id: "asc" } });
}
