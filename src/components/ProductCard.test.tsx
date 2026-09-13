import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "./ProductCard";

const product = { id: "1", name: "미니멀 화이트 머그컵", price: 12000, imageUrl: "/images/product-01.png" };

describe("ProductCard", () => {
  it("이미지(alt=상품명)·상품명·콤마 포맷 가격을 보여주고 카드 전체가 상세 링크다", () => {
    render(<ProductCard product={product} />);

    const img = screen.getByRole("img", { name: "미니멀 화이트 머그컵" });
    expect(decodeURIComponent(img.getAttribute("src") ?? "")).toContain("/images/product-01.png");
    expect(screen.getByText("미니멀 화이트 머그컵")).toBeInTheDocument();
    expect(screen.getByText("12,000원")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "미니멀 화이트 머그컵" })).toHaveAttribute("href", "/products/1");
  });
});
