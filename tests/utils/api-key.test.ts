import { encodedApiKey, decodedApiKey } from "@/utils/api-key";
import { randomUUID } from "crypto";
import { describe, expect, it } from "vitest";

// Mock the ENCRYPTION_KEY
const ENCRYPTION_KEY = "533x5hY4SN8RYUw1DgLEPFWABD3vN6XI9gb9aLhAtOE";

describe("API Key Encoding and Decoding", () => {
  const appId = randomUUID();

  it("should generate a valid API key", () => {
    const apiKey = encodedApiKey(appId, ENCRYPTION_KEY);
    expect(typeof apiKey).toBe("string");
    expect(apiKey.length).toBeGreaterThan(0);
  });

  it("should decode a valid API key correctly", () => {
    const apiKey = encodedApiKey(appId, ENCRYPTION_KEY);
    const result = decodedApiKey(apiKey, ENCRYPTION_KEY);

    expect(result.isValid).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.appId).toBe(appId);
    expect(typeof result.data?.timestamp).toBe("number");
  });

  it("should return invalid for tampered API key", () => {
    const apiKey = encodedApiKey(appId, ENCRYPTION_KEY);
    const tampered = apiKey.slice(0, 10) + "X" + apiKey.slice(10);
    const result = decodedApiKey(tampered, ENCRYPTION_KEY);
    console.log("## RESULT", apiKey);

    expect(result.isValid).toBe(false);
    expect(result.data).toBeUndefined();
  });

  it("should return invalid if API key structure is malformed", () => {
    const malformed = Buffer.from("bad-data-without-colon").toString("base64");
    const result = decodedApiKey(malformed, ENCRYPTION_KEY);

    expect(result.isValid).toBe(false);
  });

  it("should return invalid if decoding throws an error", () => {
    const invalidBase64 = "!!!notbase64!!!";
    const result = decodedApiKey(invalidBase64, ENCRYPTION_KEY);

    expect(result.isValid).toBe(false);
  });
});
