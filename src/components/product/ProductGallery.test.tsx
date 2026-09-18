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

  it("인디케이터는 알약 2개(텍스트 + 크게 보기)로 나뉜다. 배경은 대비 때문에 60% 유지 (실측 223)", () => {
    render(<ProductGallery name="머그컵" images={["/images/product-01.png", "/images/product-02.png"]} />);

    const zoom = screen.getByRole("button", { name: "크게 보기" });
    expect(zoom).toHaveClass("size-6", "rounded-sm", "bg-surface-overlay");
    expect(zoom.querySelector("svg")).toHaveAttribute("width", "20");
    const text = screen.getByText("1 / 2");
    expect(text.tagName).toBe("SPAN");
    expect(text).toHaveClass("h-6", "rounded-sm", "bg-surface-overlay", "text-label");
    expect(text.parentElement).toHaveClass("gap-1");
  });

  it("두 번째 썸네일을 누르면 인디케이터 2 / N, 그 썸네일만 선택 테두리", () => {
    renderGallery();

    fireEvent.click(screen.getByRole("button", { name: "이미지 2" }));
    expect(screen.getByText(`2 / ${images.length}`)).toBeInTheDocument();
    const thumbs = within(screen.getByRole("list", { name: "이미지 목록" })).getAllByRole("button");
    // 선택 테두리는 이미지를 깎지 않도록 이미지 위 오버레이에 겹쳐 그린다(ring), 전환 250ms (실측 223)
    thumbs.forEach((b, i) => expect(b.querySelector("span")).toHaveClass(i === 1 ? "ring-scrim" : "ring-transparent"));
    // 링은 이미지 위 오버레이에 건다(inset 그림자는 자식 아래에 깔린다). 버튼은 outline 을 비워 base 포커스 링을 살린다
    thumbs.forEach((b) => expect(b.querySelector("span")).toHaveClass("ring-2", "ring-inset", "transition-shadow", "duration-base"));
    thumbs.forEach((b) => expect(b.className).not.toMatch(/outline-/));
  });

  it("크게 보기 → 전체화면 뷰어, 다음 화살표로 n/N +1, Esc 로 닫힘", () => {
    renderGallery();

    fireEvent.click(screen.getByRole("button", { name: "크게 보기" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveClass("z-modal");
    expect(within(dialog).getByText(`1/${images.length}`)).toBeInTheDocument();

    // 원본은 첫 장에서도 이전·다음을 모두 보여준다 — 경계에서는 disabled 로 막는다(실측 224)
    const prev = within(dialog).getByRole("button", { name: "이전 이미지" });
    const next = within(dialog).getByRole("button", { name: "다음 이미지" });
    expect(prev).toBeDisabled();
    expect(next).toBeEnabled();

    fireEvent.click(next);
    expect(within(dialog).getByText(`2/${images.length}`)).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "이전 이미지" })).toBeEnabled();
    // 닫기 28·아래 n/N 은 label 회색(실측 224)
    expect(within(dialog).getByRole("button", { name: "닫기" })).toHaveClass("size-7", "top-3");
    expect(within(dialog).getByText(`2/${images.length}`)).toHaveClass("text-label", "text-ink-tertiary");

    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(screen.getByRole("button", { name: "크게 보기" })).toHaveFocus();
  });
});
