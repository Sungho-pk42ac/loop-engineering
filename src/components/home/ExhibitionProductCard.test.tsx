import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import type { ExhibitionProduct } from "@/data/exhibition";
import { LIKES_KEY } from "@/lib/likes";
import { ExhibitionProductCard } from "./ExhibitionProductCard";

const product: ExhibitionProduct = {
  id: "ex-t",
  brand: "테스트브랜드",
  name: "테스트 상품 이름",
  price: 21000,
  imageUrl: "/images/product-01.png",
  discountRate: 30,
  shippingBadge: "오늘 출발",
  colors: ["ink", "accent"],
};

describe("ExhibitionProductCard", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it("이미지(alt=상품명) → 브랜드(굵게) → 상품명(2줄) → 할인율(price-sale)+가격(formatPrice) → 배송 표시 순서", () => {
    render(<ExhibitionProductCard product={product} />);
    const card = screen.getByRole("article");

    expect(within(card).getByRole("img", { name: product.name })).toBeInTheDocument();
    const text = card.textContent ?? "";
    const order = [product.brand, product.name, "30%", "21,000원", "오늘 출발"].map((t) => text.indexOf(t));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(screen.getByText(product.brand)).toHaveClass("font-semibold");
    expect(screen.getByText(product.name)).toHaveClass("line-clamp-2");
    expect(screen.getByText("30%")).toHaveClass("text-price-sale");
  });

  it("할인율·배송·컬러 점은 데이터에 있을 때만", () => {
    render(<ExhibitionProductCard product={{ ...product, discountRate: undefined, shippingBadge: undefined, colors: undefined }} />);
    expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
    expect(screen.queryByText("오늘 출발")).not.toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "컬러" })).not.toBeInTheDocument();
  });

  it("컬러가 있으면 좌상단에 세로 점 목록", () => {
    render(<ExhibitionProductCard product={product} />);
    const dots = within(screen.getByRole("list", { name: "컬러" })).getAllByRole("listitem");
    expect(dots).toHaveLength(2);
    expect(screen.getByRole("list", { name: "컬러" })).toHaveClass("flex-col");
  });

  it("링크는 모두 새 탭 /products + rel, 링크 안에 링크·버튼이 중첩되지 않는다", () => {
    render(<ExhibitionProductCard product={product} />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(2);
    links.forEach((a) => {
      expect(a).toHaveAttribute("href", "/products");
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", "noopener noreferrer");
      expect(a.querySelector("a, button")).toBeNull();
    });
    expect(screen.getByRole("link", { name: product.brand })).toBeInTheDocument();
  });

  it("하트는 button·aria-pressed 로 토글되고 localStorage 로 새로 그려도 유지된다", () => {
    const { unmount } = render(<ExhibitionProductCard product={product} />);
    const heart = screen.getByRole("button", { name: "좋아요" });
    expect(heart).toHaveAttribute("type", "button");
    expect(heart).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(heart);
    expect(screen.getByRole("button", { name: "좋아요" })).toHaveAttribute("aria-pressed", "true");
    expect(JSON.parse(localStorage.getItem(LIKES_KEY)!)).toEqual([product.id]);

    unmount();
    render(<ExhibitionProductCard product={product} />);
    expect(screen.getByRole("button", { name: "좋아요" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "좋아요" }));
    expect(screen.getByRole("button", { name: "좋아요" })).toHaveAttribute("aria-pressed", "false");
  });
});
