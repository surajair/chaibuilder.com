import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

// Automatically clean up after each test
afterEach(() => {
  cleanup();
});

// Define global expect matchers
expect.extend({
  // Add custom matchers here if needed
});
