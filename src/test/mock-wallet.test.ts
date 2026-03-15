import { describe, it, expect } from "vitest";
import { generateMockWalletCheck } from "@/lib/mock-wallet";

/** Matches the SOL/USD rate used in mock-wallet.ts */
const MOCK_SOL_PRICE_USD = 145;

describe("generateMockWalletCheck", () => {
  it("returns all required fields", () => {
    const result = generateMockWalletCheck();
    expect(result).toHaveProperty("total_balance_sol");
    expect(result).toHaveProperty("total_balance_usd");
    expect(result).toHaveProperty("risk_score");
    expect(result).toHaveProperty("risk_level");
    expect(result).toHaveProperty("coins");
  });

  it("returns exactly 10 coins", () => {
    const result = generateMockWalletCheck();
    expect(result.coins).toHaveLength(10);
  });

  it("includes expected coin symbols", () => {
    const result = generateMockWalletCheck();
    const symbols = result.coins.map((c) => c.symbol);
    expect(symbols).toContain("SOL");
    expect(symbols).toContain("BONK");
    expect(symbols).toContain("JUP");
  });

  it("assigns valid tags to every coin", () => {
    const validTags = ["ACCUMULATE", "HOLD", "CAUTION", "AVOID", "EXIT"];
    const result = generateMockWalletCheck();
    for (const coin of result.coins) {
      expect(validTags).toContain(coin.tag);
    }
  });

  it("assigns a valid risk level", () => {
    const validLevels = ["low", "medium", "high", "critical"];
    const result = generateMockWalletCheck();
    expect(validLevels).toContain(result.risk_level);
  });

  it("produces a risk_score between 0 and 100", () => {
    for (let i = 0; i < 20; i++) {
      const result = generateMockWalletCheck();
      expect(result.risk_score).toBeGreaterThanOrEqual(0);
      expect(result.risk_score).toBeLessThanOrEqual(100);
    }
  });

  it("derives total_balance_sol from total_balance_usd", () => {
    const result = generateMockWalletCheck();
    const expectedSol = Math.round((result.total_balance_usd / MOCK_SOL_PRICE_USD) * 1000) / 1000;
    expect(result.total_balance_sol).toBe(expectedSol);
  });

  it("total_balance_usd equals the sum of coin usd_values", () => {
    const result = generateMockWalletCheck();
    const sum = result.coins.reduce((s, c) => s + c.usd_value, 0);
    expect(result.total_balance_usd).toBeCloseTo(sum, 2);
  });

  it("each coin has a non-negative usd_value and coin_score", () => {
    const result = generateMockWalletCheck();
    for (const coin of result.coins) {
      expect(coin.usd_value).toBeGreaterThanOrEqual(0);
      expect(coin.coin_score).toBeGreaterThanOrEqual(0);
      expect(coin.coin_score).toBeLessThanOrEqual(100);
    }
  });

  it("each coin has a non-empty symbol and mint", () => {
    const result = generateMockWalletCheck();
    for (const coin of result.coins) {
      expect(coin.symbol.length).toBeGreaterThan(0);
      expect(coin.mint.length).toBeGreaterThan(0);
    }
  });
});
