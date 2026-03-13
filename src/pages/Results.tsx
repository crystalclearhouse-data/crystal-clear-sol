import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/RiskBadge";
import { CoinTagPill } from "@/components/CoinTagPill";
import { UpsellPanel } from "@/components/UpsellPanel";
import { Footer } from "@/components/Footer";
import { shortAddress } from "@/lib/constants";
import type { WalletCheckResult } from "@/lib/constants";

import { Shield, ArrowLeft, AlertTriangle } from "lucide-react";

const Results = () => {
  const [searchParams] = useSearchParams();
  const address = searchParams.get("address") || "";
  const email = searchParams.get("email") || "";
  const [data, setData] = useState<WalletCheckResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!address) return;

    const fetchData = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        
        const resp = await fetch(
          `${supabaseUrl}/functions/v1/wallet-check?address=${encodeURIComponent(address)}`,
          {
            headers: {
              "apikey": supabaseKey,
              "Content-Type": "application/json",
            },
          }
        );

        if (!resp.ok) throw new Error("API error");
        const json = await resp.json();
        setData(json);
      } catch (e) {
        console.error("Failed to fetch wallet check:", e);
        const { generateMockWalletCheck } = await import("@/lib/mock-wallet");
        setData(generateMockWalletCheck());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  if (!address) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No wallet address provided.</p>
          <Link to="/">
            <Button variant="hero">Go back</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Use summary.top_risky_coins from API if available, otherwise compute from coins
  const riskyCoins = data?.summary?.top_risky_coins
    ? data.coins.filter((c) => data.summary!.top_risky_coins.includes(c.symbol)).slice(0, 3)
    : data?.coins
        .filter((c) => c.tag === "AVOID" || c.tag === "EXIT")
        .sort((a, b) => b.usd_value - a.usd_value)
        .slice(0, 3);

  const avoidExitPct = data?.summary?.percent_high_risk_usd != null
    ? Math.round(data.summary.percent_high_risk_usd * 100)
    : data && data.total_balance_usd > 0
      ? Math.round(data.coins.filter((c) => c.tag === "AVOID" || c.tag === "EXIT").reduce((s, c) => s + c.usd_value, 0) / data.total_balance_usd * 100)
      : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 px-4 py-8 md:py-16">
        <div className="container max-w-3xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-neon-teal" />
              <span className="font-bold text-gradient-teal-pink">ClearSignal</span>
            </div>
          </div>

          {!loading && data && <UpsellPanel address={address} email={email} />}

          {loading && (
            <div className="rounded-xl border border-border bg-card p-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-neon-teal border-t-transparent animate-spin" />
              <p className="text-muted-foreground">Scanning wallet…</p>
              <p className="text-xs text-muted-foreground font-mono">{shortAddress(address)}</p>
            </div>
          )}

          {!loading && data && (
            <>
              <div className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Wallet summary for</p>
                    <p className="font-mono text-lg text-foreground">{shortAddress(address)}</p>
                  </div>
                  <RiskBadge level={data.risk_level} large />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold text-foreground">${data.total_balance_usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">SOL Equivalent</p>
                    <p className="text-2xl font-bold text-foreground">{data.total_balance_sol.toLocaleString()} SOL</p>
                  </div>
                </div>

                <p className="text-muted-foreground">
                  About <span className="text-foreground font-semibold">{avoidExitPct}%</span> of your stack is in coins we'd mark{" "}
                  <span className="text-tag-avoid font-medium">AVOID</span>/<span className="text-tag-exit font-medium">EXIT</span> – {avoidExitPct > 40 ? "you're playing on hard mode." : "not too bad, but there's room to clean up."}
                </p>
              </div>

              {riskyCoins && riskyCoins.length > 0 && (
                <div className="rounded-xl border border-risk-high/30 bg-risk-high/5 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-risk-high font-semibold">
                    <AlertTriangle className="w-5 h-5" />
                    Top {riskyCoins.length} coins increasing your risk right now:
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {riskyCoins.map((c) => (
                      <div key={c.mint} className="flex items-center gap-2 bg-card rounded-lg px-3 py-2 border border-border">
                        <span className="font-mono text-sm text-foreground">{c.symbol}</span>
                        <CoinTagPill tag={c.tag} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted">
                        <th className="text-left px-4 py-3 text-muted-foreground font-medium">Coin</th>
                        <th className="text-right px-4 py-3 text-muted-foreground font-medium">USD Value</th>
                        <th className="text-right px-4 py-3 text-muted-foreground font-medium">Score</th>
                        <th className="text-center px-4 py-3 text-muted-foreground font-medium">Tag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.coins
                        .sort((a, b) => b.usd_value - a.usd_value)
                        .map((coin) => (
                          <tr key={coin.mint} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3 font-mono font-medium text-foreground">{coin.symbol}</td>
                            <td className="px-4 py-3 text-right text-foreground">
                              ${coin.usd_value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3 text-right text-muted-foreground">{coin.coin_score}</td>
                            <td className="px-4 py-3 text-center">
                              <CoinTagPill tag={coin.tag} />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <UpsellPanel address={address} email={email} />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Results;
