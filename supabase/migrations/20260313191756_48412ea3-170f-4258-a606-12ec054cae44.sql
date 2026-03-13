-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  utm_source TEXT,
  utm_campaign TEXT
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads" ON public.leads
  FOR INSERT WITH CHECK (true);

-- Create wallet_checks table
CREATE TYPE public.risk_level_enum AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TABLE public.wallet_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_balance_sol NUMERIC,
  total_balance_usd NUMERIC,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level risk_level_enum,
  summary JSONB
);

ALTER TABLE public.wallet_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read wallet checks" ON public.wallet_checks
  FOR SELECT USING (true);

CREATE POLICY "Service can insert wallet checks" ON public.wallet_checks
  FOR INSERT WITH CHECK (true);