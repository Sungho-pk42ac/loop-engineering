import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductPage from "./page";

const product = {
  id: "1",
  name: "미니멀 화이트 머그컵",
  price: 12000,
  imageUrl: "/images/product-01.png",
  description: "군더더기 없는 300ml 세라믹 머그컵입니다.",
};

vi.mock("@/lib/products", () => ({
  getProduct: (id: string) => Promise.resolve(id === "1" ? product : null),
}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

describe("/products/[id]", () => {
  it("이미지(alt=상품명)·상품명·콤마 포맷 가격·설명·목록 링크를 보여준다", async () => {
    render(await ProductPage({ params: Promise.resolve({ id: "1" }) }));

    expect(screen.getByRole("img", { name: "미니멀 화이트 머그컵" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "미니멀 화이트 머그컵" })).toBeInTheDocument();
    expect(screen.getByText("12,000원")).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /목록으로 돌아가기/ })).toHaveAttribute("href", "/products");
  });

  it("없는 id 는 notFound() 를 호출한다", async () => {
    await expect(ProductPage({ params: Promise.resolve({ id: "999" }) })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
