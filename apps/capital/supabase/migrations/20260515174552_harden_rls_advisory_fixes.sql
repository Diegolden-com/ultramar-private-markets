-- Harden RLS, grants, and advisor-sensitive function settings for the capital
-- schema. Supabase exposes the public schema through the Data API, so table
-- privileges and row policies should be explicit.

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at DESC);

ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategy_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lending_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deribit_instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polymarket_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokenized_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arbitrage_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

REVOKE ALL ON TABLE
  public.strategies,
  public.positions,
  public.transactions,
  public.strategy_performance,
  public.lending_rates,
  public.deribit_instruments,
  public.polymarket_markets,
  public.tokenized_assets,
  public.arbitrage_opportunities,
  public.waitlist
FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.update_updated_at_column()
FROM PUBLIC, anon, authenticated;

GRANT SELECT ON TABLE
  public.strategies,
  public.strategy_performance,
  public.lending_rates,
  public.deribit_instruments,
  public.polymarket_markets,
  public.tokenized_assets,
  public.arbitrage_opportunities
TO anon, authenticated;

GRANT SELECT ON TABLE
  public.positions,
  public.transactions
TO authenticated;

GRANT INSERT ON TABLE public.waitlist TO anon, authenticated;

GRANT ALL ON TABLE
  public.strategies,
  public.positions,
  public.transactions,
  public.strategy_performance,
  public.lending_rates,
  public.deribit_instruments,
  public.polymarket_markets,
  public.tokenized_assets,
  public.arbitrage_opportunities,
  public.waitlist
TO service_role;

GRANT EXECUTE ON FUNCTION public.update_updated_at_column()
TO service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON TABLES FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON FUNCTIONS FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON SEQUENCES FROM anon, authenticated;

DROP POLICY IF EXISTS "Public can read active strategies" ON public.strategies;
CREATE POLICY "Public can read active strategies"
  ON public.strategies
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Public can read strategy performance" ON public.strategy_performance;
CREATE POLICY "Public can read strategy performance"
  ON public.strategy_performance
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.strategies
      WHERE strategies.id = strategy_performance.strategy_id
        AND strategies.is_active = true
    )
  );

DROP POLICY IF EXISTS "Public can read lending rates" ON public.lending_rates;
CREATE POLICY "Public can read lending rates"
  ON public.lending_rates
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read deribit instruments" ON public.deribit_instruments;
CREATE POLICY "Public can read deribit instruments"
  ON public.deribit_instruments
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read polymarket markets" ON public.polymarket_markets;
CREATE POLICY "Public can read polymarket markets"
  ON public.polymarket_markets
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read tokenized assets" ON public.tokenized_assets;
CREATE POLICY "Public can read tokenized assets"
  ON public.tokenized_assets
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read fresh arbitrage opportunities" ON public.arbitrage_opportunities;
CREATE POLICY "Public can read fresh arbitrage opportunities"
  ON public.arbitrage_opportunities
  FOR SELECT
  TO anon, authenticated
  USING (expires_at > now());

DROP POLICY IF EXISTS "Users can read own positions" ON public.positions;
CREATE POLICY "Users can read own positions"
  ON public.positions
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) IS NOT NULL
    AND user_id = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Users can read own transactions" ON public.transactions;
CREATE POLICY "Users can read own transactions"
  ON public.transactions
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) IS NOT NULL
    AND user_id = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Allow anyone to join waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Allow public to view waitlist status" ON public.waitlist;
DROP POLICY IF EXISTS "Public can join waitlist" ON public.waitlist;
CREATE POLICY "Public can join waitlist"
  ON public.waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

NOTIFY pgrst, 'reload schema';
