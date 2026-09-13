import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge, Button, Card } from "./index";

// 프리미티브가 시멘틱 토큰 클래스만 쓰는지, 변형이 올바르게 매핑되는지 확인
describe("UI 프리미티브", () => {
  it("Button 은 기본 primary/md 이며 variant·size 에 따라 토큰 클래스를 바꾼다", () => {
    render(
      <>
        <Button>기본</Button>
        <Button variant="accent" size="lg">강조</Button>
        <Button disabled>비활성</Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "기본" })).toHaveClass("bg-brand", "h-10");
    expect(screen.getByRole("button", { name: "강조" })).toHaveClass("bg-accent", "h-12");
    expect(screen.getByRole("button", { name: "비활성" })).toBeDisabled();
  });

  it("Badge 는 tone 에 따라 커머스 토큰(세일·품절)을 쓴다", () => {
    render(
      <>
        <Badge tone="sale">30%</Badge>
        <Badge tone="soldout">품절</Badge>
      </>,
    );
    expect(screen.getByText("30%")).toHaveClass("bg-price-sale");
    expect(screen.getByText("품절")).toHaveClass("bg-soldout");
  });

  it("Card 는 surface·line 토큰으로 플랫한 컨테이너를 만든다", () => {
    render(<Card data-testid="card">내용</Card>);
    expect(screen.getByTestId("card")).toHaveClass("bg-surface", "border-line", "rounded-xl");
  });

  it("프리미티브 코드에 HEX·px 리터럴이나 Tailwind 기본 팔레트가 없다", async () => {
    const fs = await import("node:fs");
    const src = ["Button", "Badge", "Card"]
      .map((f) => fs.readFileSync(`${process.cwd()}/src/components/ui/${f}.tsx`, "utf8"))
      .join("\n");
    expect(src).not.toMatch(/#[0-9a-fA-F]{3,6}\b|\[\d+px\]|-(zinc|gray|slate|neutral)-\d{2,3}/);
  });
});
