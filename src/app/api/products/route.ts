import { getProducts } from "@/lib/products";

// GET /api/products — 상품 목록. 프론트 그리드가 그대로 렌더링할 Product[] 를 id 순으로 내려준다.
export async function GET() {
  return Response.json(await getProducts());
}
