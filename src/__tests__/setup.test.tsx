import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

// 테스트 환경(Vitest + jsdom + React Testing Library) 배선 확인용 스모크 테스트
describe("테스트 환경", () => {
  it("React 컴포넌트를 렌더링하고 역할(role)로 찾을 수 있다", () => {
    // Given
    const Heading = () => <h1>패캠 스토어</h1>;

    // When
    render(<Heading />);

    // Then
    expect(screen.getByRole("heading", { name: "패캠 스토어" })).toBeInTheDocument();
  });
});
