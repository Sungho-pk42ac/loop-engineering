import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { productDetails } from "@/data/productDetails";
import { ProductGallery } from "./ProductGallery";

// jsdom 에는 요소 scrollTo 가 없다.
Element.prototype.scrollTo ??= () => {};

const images = productDetails["1"].images;
const renderGallery = () => render(<ProductGallery name="미니멀 화이트 머그컵" images={images} />);

describe("ProductGallery", () => {
  afterEach(cleanup);

  it("5:6 슬라이드와 모든 이미지 alt 상품명, 첫 이미지는 그 상품 자신", () => {
    renderGallery();

    expect(images.length).toBeGreaterThanOrEqual(3);
    expect(images[0]).toBe("/images/product-01.png");
    within(screen.getByRole("list", { name: "상품 이미지" }))
      .getAllByRole("listitem")
      .forEach((li) => expect(li).toHaveClass("aspect-5/6"));
    screen.getAllByRole("img").forEach((img) => expect(img).toHaveAttribute("alt", "미니멀 화이트 머그컵"));
  });

  it("두 번째 썸네일을 누르면 인디케이터 2 / N, 그 썸네일만 선택 테두리", () => {
    renderGallery();

    fireEvent.click(screen.getByRole("button", { name: "이미지 2" }));
    expect(screen.getByText(`2 / ${images.length}`)).toBeInTheDocument();
    const thumbs = within(screen.getByRole("list", { name: "이미지 목록" })).getAllByRole("button");
    thumbs.forEach((b, i) => expect(b).toHaveClass(i === 1 ? "border-line-strong" : "border-transparent"));
  });

  it("크게 보기 → 전체화면 뷰어, 다음 화살표로 n/N +1, Esc 로 닫힘", () => {
    renderGallery();

    fireEvent.click(screen.getByRole("button", { name: "크게 보기" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveClass("z-modal");
    expect(within(dialog).getByText(`1/${images.length}`)).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole("button", { name: "다음 이미지" }));
    expect(within(dialog).getByText(`2/${images.length}`)).toBeInTheDocument();

    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(screen.getByRole("button", { name: "크게 보기" })).toHaveFocus();
  });
});
