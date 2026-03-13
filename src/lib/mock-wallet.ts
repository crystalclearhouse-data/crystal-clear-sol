import type { WalletCheckResult, CoinTag } from "./constants";

const MOCK_COINS: Array<{ symbol: string; mint: string; tag: CoinTag }> = [
  { symbol: "SOL", mint: "So11111111111111111111111111111111111111112", tag: "ACCUMULATE" },
  { symbol: "BONK", mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", tag: "HOLD" },
  { symbol: "JUP", mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", tag: "ACCUMULATE" },
  { symbol: "WIF", mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", tag: "CAUTION" },
  { symbol: "MYRO", mint: "HhJpBhRRn4g56VsyLuT8DL5Bv31HkXqsrahTTUCZeZg4", tag: "AVOID" },
  { symbol: "BOME", mint: "ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82", tag: "EXIT" },
  { symbol: "RAY", mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", tag: "HOLD" },
  { symbol: "ORCA", mint: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE", tag: "ACCUMULATE" },
  { symbol: "SAMO", mint: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", tag: "AVOID" },
  { symbol: "DUST", mint: "DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ", tag: "EXIT" },
];

export function generateMockWalletCheck(): WalletCheckResult {
  const coins = MOCK_COINS.map((c) => ({
    ...c,
    usd_value: Math.round(Math.random() * 5000 * 100) / 100,
    coin_score: Math.round(Math.random() * 100),
  }));

  const total_balance_usd = coins.reduce((s, c) => s + c.usd_value, 0);
  const total_balance_sol = Math.round((total_balance_usd / 145) * 1000) / 1000;

  const avoidExit = coins.filter((c) => c.tag === "AVOID" || c.tag === "EXIT");
  const avoidExitPct = avoidExit.reduce((s, c) => s + c.usd_value, 0) / total_balance_usd;

  let risk_score: number;
  let risk_level: "low" | "medium" | "high" | "critical";

  if (avoidExitPct > 0.6) {
    risk_score = 70 + Math.round(Math.random() * 30);
    risk_level = "critical";
  } else if (avoidExitPct > 0.4) {
    risk_score = 50 + Math.round(Math.random() * 20);
    risk_level = "high";
  } else if (avoidExitPct > 0.2) {
    risk_score = 30 + Math.round(Math.random() * 20);
    risk_level = "medium";
  } else {
    risk_score = Math.round(Math.random() * 30);
    risk_level = "low";
  }

  return { total_balance_sol, total_balance_usd, risk_score, risk_level, coins };
}
