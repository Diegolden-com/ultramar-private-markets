-- Ultramar Capital - Initial Database Schema
-- Created: 2025-11-30
-- Version: 1.0.0 (MVP)

-- =============================================================================
-- STRATEGIES TABLE
-- =============================================================================
-- Core table storing all investment strategies with current metrics
CREATE TABLE IF NOT EXISTS strategies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  current_apy DECIMAL(5, 2) DEFAULT 0.00,
  current_tvl DECIMAL(20, 2) DEFAULT 0.00,
  current_price_per_share DECIMAL(20, 8) DEFAULT 1.00000000,
  is_active BOOLEAN DEFAULT TRUE,
  min_deposit DECIMAL(20, 2) DEFAULT 100.00,
  max_capacity DECIMAL(20, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for active strategies queries
CREATE INDEX IF NOT EXISTS idx_strategies_active ON strategies(is_active, risk_level);

-- =============================================================================
-- USER POSITIONS TABLE
-- =============================================================================
-- Tracks user positions in each strategy
CREATE TABLE IF NOT EXISTS positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  strategy_id TEXT NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
  balance DECIMAL(20, 8) DEFAULT 0.00000000,
  total_deposited DECIMAL(20, 2) DEFAULT 0.00,
  total_withdrawn DECIMAL(20, 2) DEFAULT 0.00,
  entry_price DECIMAL(20, 8),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, strategy_id)
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_positions_user ON positions(user_id);
CREATE INDEX IF NOT EXISTS idx_positions_strategy ON positions(strategy_id);

-- =============================================================================
-- TRANSACTIONS TABLE
-- =============================================================================
-- Complete transaction history for all users
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  strategy_id TEXT NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('DEPOSIT', 'WITHDRAW', 'PROFIT', 'LOSS')),
  amount DECIMAL(20, 2) NOT NULL,
  balance_before DECIMAL(20, 8),
  balance_after DECIMAL(20, 8),
  price_per_share DECIMAL(20, 8),
  status TEXT DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
  tx_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for transaction queries
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_strategy ON transactions(strategy_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type, created_at DESC);

-- =============================================================================
-- STRATEGY PERFORMANCE TABLE
-- =============================================================================
-- Daily snapshots of strategy performance for historical charts
CREATE TABLE IF NOT EXISTS strategy_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id TEXT NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  apy_snapshot DECIMAL(5, 2),
  tvl_snapshot DECIMAL(20, 2),
  price_per_share DECIMAL(20, 8),
  daily_return DECIMAL(10, 6),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(strategy_id, date)
);

-- Index for performance queries
CREATE INDEX IF NOT EXISTS idx_performance_strategy_date ON strategy_performance(strategy_id, date DESC);

-- =============================================================================
-- LENDING RATES TABLE (HF1 Strategy)
-- =============================================================================
-- Cache of lending and borrowing rates from Aave V3 protocol
CREATE TABLE IF NOT EXISTS lending_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocol TEXT NOT NULL,
  network TEXT NOT NULL,
  asset TEXT NOT NULL,
  supply_apy DECIMAL(8, 4),
  borrow_apy DECIMAL(8, 4),
  utilization DECIMAL(5, 2),
  total_supply DECIMAL(20, 2),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for rate queries
CREATE INDEX IF NOT EXISTS idx_lending_rates_asset ON lending_rates(asset, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_lending_rates_network ON lending_rates(network, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_lending_rates_protocol ON lending_rates(protocol, asset, network, timestamp DESC);

-- =============================================================================
-- DERIBIT INSTRUMENTS TABLE (HF2 Strategy - Derivatives)
-- =============================================================================
-- Cache of Deribit options and futures data
CREATE TABLE IF NOT EXISTS deribit_instruments (
  instrument_name TEXT PRIMARY KEY,
  kind TEXT CHECK (kind IN ('option', 'future')),
  base_currency TEXT,
  strike DECIMAL(20, 2),
  expiration_timestamp BIGINT,
  option_type TEXT CHECK (option_type IN ('call', 'put', NULL)),
  mark_price DECIMAL(20, 8),
  mark_iv DECIMAL(8, 4),
  delta DECIMAL(8, 6),
  gamma DECIMAL(8, 6),
  vega DECIMAL(8, 6),
  theta DECIMAL(8, 6),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for instrument queries
CREATE INDEX IF NOT EXISTS idx_deribit_currency ON deribit_instruments(base_currency, kind);
CREATE INDEX IF NOT EXISTS idx_deribit_expiration ON deribit_instruments(expiration_timestamp);

-- =============================================================================
-- POLYMARKET MARKETS TABLE (HF2 Strategy - Polymarket Arbitrage)
-- =============================================================================
-- Cache of Polymarket prediction markets
CREATE TABLE IF NOT EXISTS polymarket_markets (
  market_id TEXT PRIMARY KEY,
  event_id TEXT,
  title TEXT,
  question TEXT,
  end_date TIMESTAMPTZ,
  yes_price DECIMAL(8, 6),
  no_price DECIMAL(8, 6),
  volume_24h DECIMAL(20, 2),
  liquidity DECIMAL(20, 2),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for market queries
CREATE INDEX IF NOT EXISTS idx_polymarket_end_date ON polymarket_markets(end_date DESC);
CREATE INDEX IF NOT EXISTS idx_polymarket_event ON polymarket_markets(event_id);

-- =============================================================================
-- TOKENIZED ASSETS TABLE (HF3 Strategy - Private Equities)
-- =============================================================================
-- Tokenized private equity and alternative assets
CREATE TABLE IF NOT EXISTS tokenized_assets (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  asset_type TEXT CHECK (asset_type IN ('STARTUP', 'REAL_ESTATE', 'VENTURE_DEBT')),
  total_supply DECIMAL(20, 8),
  nav_per_token DECIMAL(20, 8),
  last_valuation_date DATE,
  company_name TEXT,
  sector TEXT,
  funding_round TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for asset queries
CREATE INDEX IF NOT EXISTS idx_tokenized_assets_type ON tokenized_assets(asset_type);

-- =============================================================================
-- ARBITRAGE OPPORTUNITIES TABLE (Optional - for caching)
-- =============================================================================
-- Temporary storage for calculated arbitrage opportunities
CREATE TABLE IF NOT EXISTS arbitrage_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id TEXT NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
  asset TEXT,
  supply_network TEXT,
  supply_apy DECIMAL(8, 4),
  borrow_network TEXT,
  borrow_apy DECIMAL(8, 4),
  spread_apy DECIMAL(8, 4),
  net_apy DECIMAL(8, 4),
  estimated_gas_cost DECIMAL(10, 4),
  profitable BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '15 minutes'
);

-- Index for opportunity queries
CREATE INDEX IF NOT EXISTS idx_arbitrage_strategy ON arbitrage_opportunities(strategy_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_arbitrage_expires ON arbitrage_opportunities(expires_at);

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to strategies table
DROP TRIGGER IF EXISTS update_strategies_updated_at ON strategies;
CREATE TRIGGER update_strategies_updated_at
  BEFORE UPDATE ON strategies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to positions table
DROP TRIGGER IF EXISTS update_positions_updated_at ON positions;
CREATE TRIGGER update_positions_updated_at
  BEFORE UPDATE ON positions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
-- Note: RLS policies will be enabled once Supabase Auth is integrated

-- Enable RLS on user-facing tables
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies will be added in future migration once auth is implemented
-- Example (commented out for now):
-- CREATE POLICY "Users can view own positions"
--   ON positions FOR SELECT
--   USING (auth.uid()::text = user_id);

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE strategies IS 'Investment strategies with current performance metrics';
COMMENT ON TABLE positions IS 'User positions in strategies (token balances)';
COMMENT ON TABLE transactions IS 'Complete transaction history for deposits, withdrawals, and P&L';
COMMENT ON TABLE strategy_performance IS 'Daily performance snapshots for historical charts';
COMMENT ON TABLE lending_rates IS 'Aave V3 lending rates cache (updated every 5 minutes)';
COMMENT ON TABLE deribit_instruments IS 'Deribit derivatives cache (updated every 15 minutes)';
COMMENT ON TABLE polymarket_markets IS 'Polymarket prediction markets cache';
COMMENT ON TABLE tokenized_assets IS 'Private equity and alternative assets metadata';
COMMENT ON TABLE arbitrage_opportunities IS 'Calculated arbitrage opportunities (auto-expires)';

-- =============================================================================
-- END OF INITIAL SCHEMA
-- =============================================================================
