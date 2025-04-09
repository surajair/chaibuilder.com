# Testing with Vitest

This project uses Vitest for unit testing.

## Running tests

- `pnpm test`: Run all tests once
- `pnpm test:watch`: Run tests in watch mode
- `pnpm test:ui`: Open the Vitest UI for visual test debugging
- `pnpm test:coverage`: Generate test coverage report

## Test Structure

- `tests/components/`: Tests for React components
- `tests/utils/`: Tests for utility functions
- `tests/setup.ts`: Global test setup and custom matchers

## Writing Tests

### Component Tests

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import YourComponent from "@/components/YourComponent";

describe("YourComponent", () => {
  it("renders correctly", () => {
    render(<YourComponent />);
    expect(screen.getByText("Expected text")).toBeInTheDocument();
  });
});
```

### Utility Tests

```ts
import { describe, expect, it } from "vitest";
import { yourUtil } from "@/utils/your-util";

describe("yourUtil", () => {
  it("works as expected", () => {
    expect(yourUtil("input")).toBe("expected output");
  });
});
```

## Best Practices

1. Keep tests simple and focused on one behavior
2. Use descriptive test names that explain what's being tested
3. Follow the AAA pattern: Arrange, Act, Assert
4. Mock external dependencies
5. Test both success and error cases
