import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

// This is a simple example test
// Replace with an actual component import from your project when needed
const Button = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded">
      {children}
    </button>
  );
};

describe("Button", () => {
  it("renders button with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("has the expected default classes", () => {
    render(<Button>Styled Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-blue-500");
    expect(button).toHaveClass("text-white");
  });
});
