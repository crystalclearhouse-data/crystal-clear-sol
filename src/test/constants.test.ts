import { describe, it, expect } from "vitest";
import { isValidSolanaAddress, shortAddress } from "@/lib/constants";

describe("isValidSolanaAddress", () => {
  it("accepts a valid 44-character base58 address", () => {
    expect(isValidSolanaAddress("7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV")).toBe(true);
  });

  it("accepts a valid 32-character base58 address", () => {
    expect(isValidSolanaAddress("11111111111111111111111111111111")).toBe(true);
  });

  it("rejects addresses shorter than 32 characters", () => {
    expect(isValidSolanaAddress("abc123")).toBe(false);
  });

  it("rejects addresses longer than 44 characters", () => {
    expect(isValidSolanaAddress("A".repeat(45))).toBe(false);
  });

  it("rejects addresses containing invalid base58 characters (0, O, I, l)", () => {
    expect(isValidSolanaAddress("0" + "A".repeat(43))).toBe(false);
    expect(isValidSolanaAddress("O" + "A".repeat(43))).toBe(false);
    expect(isValidSolanaAddress("I" + "A".repeat(43))).toBe(false);
    expect(isValidSolanaAddress("l" + "A".repeat(43))).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(isValidSolanaAddress("")).toBe(false);
  });

  it("trims whitespace before validating", () => {
    expect(isValidSolanaAddress("  7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV  ")).toBe(true);
  });
});

describe("shortAddress", () => {
  it("returns first 4 and last 4 characters separated by an ellipsis", () => {
    expect(shortAddress("7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV")).toBe("7EcD…FLtV");
  });

  it("handles short strings gracefully", () => {
    const result = shortAddress("abcdefgh");
    expect(result).toBe("abcd…efgh");
  });
});
