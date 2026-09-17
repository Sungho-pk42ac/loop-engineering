import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { products } from "@/data/products";
import ProductPage, { generateStaticParams } from "./page";

const product = products[0];
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

describe("/products/[id]", () => {
  it("이미지(alt=상품명)·상품명·콤마 포맷 가격·설명, 목록으로 돌아가기 링크는 없다(#61)", async () => {
    render(await ProductPage({ params: Promise.resolve({ id: "1" }) }));

    expect(screen.getByRole("img", { name: "미니멀 화이트 머그컵" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "미니멀 화이트 머그컵" })).toBeInTheDocument();
    expect(screen.getByText("12,000원")).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /목록으로 돌아가기/ })).toBeNull();
    const panel = screen.getByRole("heading", { name: "미니멀 화이트 머그컵" }).parentElement!;
    expect(panel).toHaveClass("md:sticky", "md:top-38", "bg-surface");
    expect(panel.parentElement).toHaveClass("md:flex-row", "max-w-wide");
  });

  it("generateStaticParams 는 상품 6개 경로를 만든다", () => {
    expect(generateStaticParams()).toEqual(["1", "2", "3", "4", "5", "6"].map((id) => ({ id })));
  });

  it("없는 id 는 notFound() 를 호출한다", async () => {
    await expect(ProductPage({ params: Promise.resolve({ id: "999" }) })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
