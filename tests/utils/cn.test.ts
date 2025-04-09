import { cn } from "@/lib/utils";
import { describe, expect, it } from "vitest";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    const result = cn("text-red-500", "bg-blue-500", "p-4");
    expect(result).toBe("text-red-500 bg-blue-500 p-4");
  });

  it("should override conflicting class names", () => {
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBe("text-blue-500");
  });

  it("should handle conditional classes", () => {
    const condition = true;
    const result = cn(
      "base-class",
      condition && "conditional-class",
      !condition && "not-applied"
    );
    expect(result).toBe("base-class conditional-class");
  });
});
