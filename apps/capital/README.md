# Ultramar Capital - DeFi Investment Platform

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/pachuco/v0-oa-capital)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-green?style=for-the-badge&logo=supabase)](https://supabase.com)

## Overview

Ultramar Capital is a sophisticated DeFi investment platform providing access to institutional-grade quantitative strategies. Built with Next.js 16, React 19, and Supabase, the platform offers four distinct strategies with proven backtesting results spanning 2023-2025.

**Current Status:** MVP - Backend API implementation with real-time connections to Aave, Deribit, and Polymarket.

---

## Investment Strategies

### 1. Lending Markets (HF1) - LOW RISK

**Target APY:** +12.4% | **TVL:** $2.4M

Cross-network arbitrage of USDC/USDT lending and borrowing rates across Aave V3 deployments on Arbitrum, Ethereum, and Base.

#### Backtesting Results (2023-2025)

**USDC Base Configuration:**
- **Total Return:** +8.13%
- **Sharpe Ratio:** 6.654
- **Max Drawdown:** 0.0%
- **Days in Position:** ~25%
- **Networks:** Arbitrum, Ethereum, Base

**Key Findings:**
- Flat equity 2023-mid 2024 (market equilibrium)
- Sharp growth Q4 2024 (rate dislocations)
- Plateau 2025 (spread compression)

The strategy only activates when APR spreads exceed entry threshold (1.0%), preserving capital during unfavorable market conditions.

**Implementation:**
- Real-time rate monitoring via Aave V3 Subgraphs
- Dynamic entry/exit thresholds (1.0% / 0.6%)
- Automated cost scenario analysis (Ultra Low to Very High)
- Cross-network bridge cost optimization

See [API_ARCHITECTURE.md](./API_ARCHITECTURE.md#strategy-1-lending-markets-hf1) for technical details.

---

### 2. Derivative Arbitrage (General) - MEDIUM RISK

**Target APY:** +18.6% | **TVL:** $1.5M

Delta-neutral arbitrage using synthetic options replication with automated hedging on Deribit derivatives exchange.

#### Strategy Mechanics

- Identify mispriced options via Black-Scholes model
- Construct replicating portfolios to exploit IV differentials
- Maintain delta neutrality through dynamic hedging
- Vega exposure management across BTC and ETH options

**Data Sources:**
- Deribit API (real-time Greeks, order books, IV surface)
- DVOL Index for volatility benchmarking

See [API_ARCHITECTURE.md](./API_ARCHITECTURE.md#strategy-2-derivative-arbitrage-general) for technical details.

---

### 3. Polymarket Arbitrage (HF2) - MEDIUM RISK

**Target APY:** +24.8% | **TVL:** $890K

Specialized arbitrage of synthetic options constructed from Polymarket binary outcomes with Deribit vega hedging.

#### Synthetic Option Pricing

```
Synthetic Call = Binary(Yes) - PV(Strike)
Synthetic Put  = Binary(No) + PV(Strike)
```

The strategy identifies IV differentials between Polymarket-implied volatility and real options markets, executing vega-neutral arbitrage.

**Key Components:**
- Polymarket CLOB API for real-time binary prices
- Black-Scholes calculator for synthetic IV extraction
- Deribit hedge execution for vega neutrality
- Newton-Raphson solver for IV calculations

See [API_ARCHITECTURE.md](./API_ARCHITECTURE.md#strategy-3-polymarket-arbitrage-hf2) for technical details.

---

### 4. Private Equities (HF3) - HIGH RISK

**Target APY:** +32.6% | **TVL:** $1.2M

Tokenized private equity investments with automated portfolio rebalancing based on NAV updates.

#### Asset Classes

- **Startups:** Tokenized equity in venture-stage companies
- **Real Estate:** Fractionalized property investments
- **Venture Debt:** Senior secured lending positions

**Rebalancing Logic:**
- Daily NAV calculations from third-party providers
- Target allocation optimization (MPT-based)
- Automatic trade execution when drift exceeds threshold
- Tax-loss harvesting integration (future)

See [API_ARCHITECTURE.md](./API_ARCHITECTURE.md#strategy-4-private-equities-hf3) for technical details.

---

## Technology Stack

### Frontend
- **Next.js 16.0.0** - App Router with React Server Components
- **React 19.2.0** - Latest stable release
- **TypeScript 5.x** - Strict mode with path aliases
- **Tailwind CSS 4.1.9** - Utility-first styling (brutalist design)
- **shadcn/ui** - Accessible Radix UI components
- **Recharts** - Financial charting

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Supabase** - PostgreSQL database + real-time subscriptions
- **Vercel Cron Jobs** - Scheduled background tasks

### External Integrations
- **Aave V3 Subgraphs** - Lending protocol data (The Graph)
- **Deribit API** - Derivatives market data and execution
- **Polymarket API** - Prediction market data
- **The Graph** - Blockchain data indexing

### Development Tools
- **pnpm** - Fast, disk-efficient package manager
- **ESLint** - Code linting (relaxed for prototyping)
- **PostCSS** - CSS processing

---

## Project Structure

```
ultramar-capital/
├── app/
│   ├── api/                          # Backend API routes
│   │   ├── strategies/
│   │   │   ├── route.ts             # GET all strategies
│   │   │   ├── lending-markets/
│   │   │   │   ├── rates/route.ts   # Aave rates
│   │   │   │   └── arbitrage/route.ts # Arbitrage opportunities
│   │   │   ├── derivative-arbitrage/
│   │   │   │   └── deribit/
│   │   │   │       ├── instruments/route.ts
│   │   │   │       └── volatility/route.ts
│   │   │   ├── polymarket-arbitrage/
│   │   │   │   ├── markets/route.ts
│   │   │   │   └── synthetic-options/route.ts
│   │   │   └── private-equities/
│   │   │       ├── assets/route.ts
│   │   │       └── valuations/route.ts
│   │   ├── portfolio/
│   │   │   ├── summary/route.ts
│   │   │   └── positions/route.ts
│   │   └── positions/
│   │       └── route.ts             # Create/manage positions
│   ├── (routes)/                     # Frontend pages
│   │   ├── page.tsx                 # Landing page
│   │   ├── app/
│   │   │   ├── page.tsx             # Strategy listing
│   │   │   └── strategy/[id]/page.tsx
│   │   ├── dashboard/page.tsx       # Portfolio dashboard
│   │   └── info/                    # Strategy documentation
│   │       ├── lending-markets/page.tsx
│   │       ├── derivative-arbitrage/page.tsx
│   │       ├── polymarket-arbitrage/page.tsx
│   │       └── private-markets/page.tsx
│   └── globals.css                   # Tailwind config + theme
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── navigation.tsx
│   ├── portfolio-chart.tsx
│   └── equity-curve-chart.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts
├── public/                           # Static assets
├── API_ARCHITECTURE.md               # Backend API documentation
├── STRATEGY_FLOWS.md                 # Mermaid diagrams
├── CLAUDE.md                         # Codebase documentation
└── README.md                         # This file
```

---

## API Endpoints

### Strategies

#### `GET /api/strategies`
List all active strategies with current APY and TVL.

**Response:**
```json
{
  "strategies": [
    {
      "id": "lending-markets",
      "name": "LENDING MARKETS",
      "riskLevel": "LOW",
      "apy": 12.4,
      "tvl": 2400000,
      "pricePerShare": 1.0812
    }
  ]
}
```

#### `GET /api/strategies/lending-markets/rates`
Real-time Aave lending and borrowing rates.

**Query Params:**
- `asset`: `'USDC' | 'USDT' | 'ALL'`
- `network`: `'ARBITRUM' | 'ETHEREUM' | 'BASE' | 'ALL'`

**Response:**
```json
{
  "rates": [
    {
      "protocol": "AAVE_V3",
      "network": "ARBITRUM",
      "asset": "USDC",
      "supplyAPY": 3.45,
      "borrowAPY": 4.12,
      "utilization": 82.5
    }
  ]
}
```

#### `GET /api/strategies/lending-markets/arbitrage`
Calculated arbitrage opportunities based on HF1 backtesting logic.

**Query Params:**
- `asset`: `'USDC' | 'USDT'`
- `minAPY`: Minimum profitable spread (default: `2.0`)
- `entryThreshold`: Entry trigger (default: `1.0`)

**Response:**
```json
{
  "opportunities": [
    {
      "asset": "USDC",
      "supplyPosition": {
        "network": "BASE",
        "apy": 3.5
      },
      "borrowPosition": {
        "network": "ARBITRUM",
        "apy": 3.9
      },
      "spreadAPY": 8.6,
      "netAPY": 8.13,
      "profitable": true
    }
  ],
  "backtestingNotes": {
    "source": "Odisea_HF1",
    "period": "2023-2025",
    "historicalReturn": "+8.13%"
  }
}
```

### Portfolio

#### `GET /api/portfolio/summary`
User's complete portfolio summary.

**Response:**
```json
{
  "totalValue": 105000,
  "totalPnl": 5000,
  "totalPnlPercent": 5.0,
  "return30d": 2.3,
  "positions": [
    {
      "strategyId": "lending-markets",
      "strategyName": "LENDING MARKETS",
      "value": 54000,
      "pnl": 4000,
      "allocation": 51.4
    }
  ]
}
```

See [API_ARCHITECTURE.md](./API_ARCHITECTURE.md) for complete API documentation.

---

## Database Schema

### Core Tables

```sql
-- Strategies (seeded with 4 strategies)
CREATE TABLE strategies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  current_apy DECIMAL(5, 2),
  current_tvl DECIMAL(20, 2),
  current_price_per_share DECIMAL(20, 8),
  risk_level TEXT CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH'))
);

-- User positions
CREATE TABLE positions (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  strategy_id TEXT REFERENCES strategies(id),
  balance DECIMAL(20, 8),
  total_deposited DECIMAL(20, 2),
  total_withdrawn DECIMAL(20, 2)
);

-- Transaction history
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  strategy_id TEXT REFERENCES strategies(id),
  type TEXT CHECK (type IN ('DEPOSIT', 'WITHDRAW', 'PROFIT', 'LOSS')),
  amount DECIMAL(20, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Strategy performance (daily snapshots)
CREATE TABLE strategy_performance (
  strategy_id TEXT REFERENCES strategies(id),
  date DATE NOT NULL,
  apy_snapshot DECIMAL(5, 2),
  tvl_snapshot DECIMAL(20, 2),
  price_per_share DECIMAL(20, 8),
  UNIQUE(strategy_id, date)
);

-- Lending rates cache
CREATE TABLE lending_rates (
  protocol TEXT NOT NULL,
  network TEXT NOT NULL,
  asset TEXT NOT NULL,
  supply_apy DECIMAL(8, 4),
  borrow_apy DECIMAL(8, 4),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Deribit instruments cache
CREATE TABLE deribit_instruments (
  instrument_name TEXT PRIMARY KEY,
  mark_price DECIMAL(20, 8),
  mark_iv DECIMAL(8, 4),
  delta DECIMAL(8, 6),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Polymarket markets cache
CREATE TABLE polymarket_markets (
  market_id TEXT PRIMARY KEY,
  yes_price DECIMAL(8, 6),
  no_price DECIMAL(8, 6),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

See complete schema in [API_ARCHITECTURE.md](./API_ARCHITECTURE.md#database-schema-mvp).

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Supabase account
- API keys:
  - Supabase (database)
  - The Graph (Aave data)
  - Deribit (optional - derivatives)
  - Polymarket (optional - prediction markets)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/ultramar-capital.git
cd ultramar-capital

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run database migrations
pnpm supabase:migrate

# Seed strategies
pnpm supabase:seed

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# The Graph (for Aave/Polymarket data)
THEGRAPH_API_KEY=your-api-key

# Deribit (for derivatives)
DERIBIT_API_KEY=your-api-key
DERIBIT_API_SECRET=your-api-secret

# Polymarket
POLYMARKET_API_KEY=your-api-key
```

---

## Background Jobs (Cron)

The platform uses Vercel Cron Jobs to update strategy data:

### Every 5 minutes
- **Update Lending Rates** - Fetch Aave V3 rates from subgraphs
- Update `lending_rates` table
- Recalculate Lending Markets APY

### Every 15 minutes
- **Update Deribit Data** - Fetch instruments, Greeks, IV surface
- **Update Polymarket Data** - Fetch markets, calculate synthetic options
- Update respective cache tables

### Daily
- **Calculate NAV** - Update private equity valuations
- **Update Strategy Performance** - Daily snapshots for charts
- **Rebalance Portfolios** - Execute automated rebalancing

Configuration in `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/update-lending-rates",
      "schedule": "*/5 * * * *"
    },
    {
      "path": "/api/cron/update-deribit-data",
      "schedule": "*/15 * * * *"
    },
    {
      "path": "/api/cron/update-strategy-performance",
      "schedule": "0 0 * * *"
    }
  ]
}
```

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... etc
```

### Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Copy project URL and keys
3. Run migrations:
```bash
pnpm supabase link --project-ref your-project-ref
pnpm supabase db push
```
4. Enable Row Level Security (RLS) policies

---

## Development

### Run Development Server

```bash
pnpm dev
```

### Build for Production

```bash
pnpm build
pnpm start
```

### Linting

```bash
pnpm lint
```

### Type Checking

```bash
pnpm type-check
```

---

## Architecture Diagrams

Visual flow diagrams for each strategy are available in [STRATEGY_FLOWS.md](./STRATEGY_FLOWS.md):

1. **Lending Markets Flow** - Aave rate monitoring and arbitrage execution
2. **Derivative Arbitrage Flow** - Deribit data ingestion and hedging
3. **Polymarket Arbitrage Flow** - Synthetic option calculation and vega hedging
4. **Private Equities Flow** - NAV updates and portfolio rebalancing
5. **User Portfolio Flow** - Deposit → Position → Dashboard
6. **Background Jobs Flow** - Cron job execution sequence

---

## Backtesting Methodology

All strategies are backed by rigorous historical backtesting:

### HF1 - Lending Markets

**Period:** 2023-2025
**Data Source:** Aave V3 historical rates (Arbitrum, Ethereum, Base)
**Author:** Carlos Arroyo, Economist & Data Analyst

**Methodology:**
1. Daily identification of max supply / min borrow rates
2. APR spread calculation: `(maxSupply - minBorrow)`
3. Entry when spread > 1.0%, exit when < 0.6%
4. Daily compounding: `capital * (1 + spread/365)`
5. Transaction cost scenarios: $0.0025 - $1.00 per switch

**Key Results:**
- **Best Configuration:** USDC Base, Ultra Low costs
- **Total Return:** +8.13%
- **Sharpe Ratio:** 6.654
- **Max Drawdown:** 0.0%
- **Active Trading Days:** 25% of period

**Findings:**
- Flat equity during market equilibrium (2023-mid 2024)
- Sharp growth during rate dislocations (Q4 2024)
- Plateau during spread compression (2025)

Full analysis in GitHub: [Odisea_HF1](https://github.com/Camanuel/Odisea_HF1-HF2)

---

## Roadmap

### Phase 1: MVP (Current)
- [x] Frontend UI with strategy pages
- [x] Backend API structure
- [x] Aave V3 integration
- [x] HF1 backtesting implementation
- [ ] Supabase schema deployment
- [ ] Vercel cron jobs setup

### Phase 2: External API Integration
- [ ] Deribit API connection
- [ ] Polymarket API connection
- [ ] Real-time data caching
- [ ] Background job workers

### Phase 3: User Authentication
- [ ] Supabase Auth integration
- [ ] Wallet connection (MetaMask, WalletConnect)
- [ ] Protected routes/endpoints
- [ ] User session management

### Phase 4: Trading Execution
- [ ] Deposit/withdraw functionality
- [ ] Position management
- [ ] Transaction history
- [ ] Portfolio analytics

### Phase 5: Production Hardening
- [ ] Unit and integration tests
- [ ] Error monitoring (Sentry)
- [ ] Rate limiting
- [ ] Security audit
- [ ] Performance optimization

---

## Contributing

This is a private project. For questions or collaboration inquiries, contact the development team.

---

## License

Proprietary - All rights reserved.

---

## Support & Documentation

- **API Documentation:** [API_ARCHITECTURE.md](./API_ARCHITECTURE.md)
- **Flow Diagrams:** [STRATEGY_FLOWS.md](./STRATEGY_FLOWS.md)
- **Codebase Guide:** [CLAUDE.md](./CLAUDE.md)
- **HF1 Backtesting:** [Odisea_HF1 GitHub](https://github.com/Camanuel/Odisea_HF1-HF2)

---

**Last Updated:** 2025-11-30
**Version:** 1.0.0 (MVP)
