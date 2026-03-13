export const CLEARSIGNAL_APP_URL = import.meta.env.VITE_CLEARSIGNAL_APP_URL || "https://clearsignal.app";
export const CLEARSIGNAL_API_URL = import.meta.env.VITE_CLEARSIGNAL_API_URL || "";

export function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address.trim());
}

export function shortAddress(address: string): string {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export type RiskLevel = "low" | "medium" | "high" | "critical";
export type CoinTag = "ACCUMULATE" | "HOLD" | "CAUTION" | "AVOID" | "EXIT";

export interface CoinData {
  symbol: string;
  mint: string;
  usd_value: number;
  coin_score: number;
  tag: CoinTag;
}

export interface WalletCheckResult {
  total_balance_sol: number;
  total_balance_usd: number;
  risk_score: number;
  risk_level: RiskLevel;
  coins: CoinData[];
}
