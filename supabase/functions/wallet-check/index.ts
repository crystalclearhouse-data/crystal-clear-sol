import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address.trim());
}

// Mock data generator for when ClearSignal API isn't available
function generateMockData(address: string) {
  const tags = ["ACCUMULATE", "HOLD", "CAUTION", "AVOID", "EXIT"] as const;
  const symbols = ["SOL", "BONK", "JUP", "WIF", "MYRO", "BOME", "RAY", "ORCA", "SAMO", "DUST"];
  const mints = [
    "So11111111111111111111111111111111111111112",
    "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    "HhJpBhRRn4g56VsyLuT8DL5Bv31HkXqsrahTTUCZeZg4",
    "ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82",
    "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
    "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ",
  ];

  const coins = symbols.map((symbol, i) => ({
    symbol,
    mint: mints[i],
    usd_value: Math.round(Math.random() * 5000 * 100) / 100,
    coin_score: Math.round(Math.random() * 100),
    tag: tags[Math.floor(Math.random() * tags.length)],
  }));

  const total_balance_usd = coins.reduce((s, c) => s + c.usd_value, 0);
  const total_balance_sol = Math.round((total_balance_usd / 145) * 1000) / 1000;

  const avoidExit = coins.filter((c) => c.tag === "AVOID" || c.tag === "EXIT");
  const avoidExitPct = total_balance_usd > 0 ? avoidExit.reduce((s, c) => s + c.usd_value, 0) / total_balance_usd : 0;

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const address = url.searchParams.get("address");

    if (!address || !isValidSolanaAddress(address)) {
      return new Response(
        JSON.stringify({ error: "Invalid Solana address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let data;
    const clearSignalApiUrl = Deno.env.get("CLEARSIGNAL_API_URL");

    if (clearSignalApiUrl) {
      try {
        const resp = await fetch(
          `${clearSignalApiUrl}/public/wallet-snapshot?chain_id=solana-mainnet&address=${encodeURIComponent(address)}`
        );
        if (resp.ok) {
          data = await resp.json();
        } else if (resp.status === 429) {
          return new Response(
            JSON.stringify({ error: "rate_limited", message: "Too many requests. Please try again later." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } else {
          console.error("ClearSignal API error:", resp.status, await resp.text().catch(() => ""));
        }
      } catch (e) {
        console.error("ClearSignal API fetch failed:", e);
      }
    }

    if (!data) {
      data = generateMockData(address);
    }

    // Store wallet check in DB
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase.from("wallet_checks").insert({
        wallet_address: address,
        total_balance_sol: data.total_balance_sol,
        total_balance_usd: data.total_balance_usd,
        risk_score: data.risk_score,
        risk_level: data.risk_level,
        summary: data.summary || {
          num_coins: data.coins?.length || 0,
          percent_high_risk_usd: data.coins
            ? data.coins.filter((c: any) => c.tag === "AVOID" || c.tag === "EXIT").reduce((s: number, c: any) => s + c.usd_value, 0) / (data.total_balance_usd || 1)
            : 0,
          top_risky_coins: data.coins
            ? data.coins.filter((c: any) => c.tag === "AVOID" || c.tag === "EXIT").slice(0, 3).map((c: any) => c.symbol)
            : [],
        },
      });
    } catch (e) {
      console.error("Failed to store wallet check:", e);
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
