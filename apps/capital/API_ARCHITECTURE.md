# API Architecture - Ultramar Capital (MVP)

## Overview

Backend API para Ultramar Capital enfocado en **MVP**: Estrategias, Posiciones y Portfolio. Este documento especifica cómo cada estrategia se conecta a APIs externas reales (Deribit, Polymarket, Aave) y ejecuta sus operaciones.

## Technology Stack MVP

- **Framework**: Next.js 16 API Routes
- **Database**: Supabase (PostgreSQL)
- **External APIs**:
  - Aave Protocol (lending rates)
  - Deribit API (derivatives, options)
  - Polymarket API (prediction markets)
- **Background Jobs**: Vercel Cron Jobs / Supabase Edge Functions
- **Type Safety**: TypeScript + Zod

---

## API Routes Structure (MVP)

```
app/api/
├── strategies/
│   ├── route.ts                           # GET all strategies
│   ├── lending-markets/
│   │   ├── rates/route.ts                # GET current Aave rates
│   │   ├── arbitrage/route.ts            # GET arbitrage opportunities
│   │   └── execute/route.ts              # POST execute arbitrage (internal)
│   ├── derivative-arbitrage/
│   │   ├── deribit/
│   │   │   ├── instruments/route.ts      # GET Deribit instruments
│   │   │   ├── orderbook/route.ts        # GET order book data
│   │   │   └── volatility/route.ts       # GET IV surface
│   │   └── positions/route.ts            # GET current hedged positions
│   ├── polymarket-arbitrage/
│   │   ├── markets/route.ts              # GET active Polymarket markets
│   │   ├── clobs/route.ts                # GET CLOB data
│   │   ├── synthetic-options/route.ts    # GET calculated synthetic options
│   │   └── hedge-positions/route.ts      # GET Deribit hedge positions
│   └── private-equities/
│       ├── assets/route.ts               # GET tokenized assets
│       ├── valuations/route.ts           # GET NAV calculations
│       └── rebalance/route.ts            # POST rebalance portfolio
├── portfolio/
│   ├── summary/route.ts                  # GET portfolio total
│   ├── positions/route.ts                # GET all user positions
│   └── performance/route.ts              # GET historical performance
└── positions/
    ├── route.ts                          # POST create position (deposit)
    ├── [id]/route.ts                     # GET/DELETE position (withdraw)
    └── [id]/pnl/route.ts                 # GET position P&L
```

---

## Strategy 1: Lending Markets (HF1)

### Descripción Técnica
Arbitraje de tasas de interés entre diferentes protocolos de lending (Aave V3, Compound, Spark) en múltiples redes (Ethereum, Polygon, Arbitrum).

### APIs Externas Necesarias

1. **Aave V3 Subgraph** (The Graph)
   - Endpoint: `https://api.thegraph.com/subgraphs/name/aave/protocol-v3`
   - Datos: Tasas de lending/borrowing en tiempo real

2. **Compound V3 API**
   - Endpoint: `https://api.compound.finance/api/v2/`
   - Datos: Tasas de suministro/préstamo

3. **Spark Protocol** (Fork de Aave)
   - Endpoint: Similar a Aave
   - Datos: Tasas en DAI principalmente

### Data Model Específico

```typescript
interface LendingRate {
  protocol: 'AAVE' | 'COMPOUND' | 'SPARK'
  network: 'ETHEREUM' | 'POLYGON' | 'ARBITRUM'
  asset: 'USDC' | 'USDT' | 'DAI'
  supplyAPY: number
  borrowAPY: number
  utilization: number
  totalSupply: number
  timestamp: Date
}

interface ArbitrageOpportunity {
  borrowFrom: {
    protocol: string
    network: string
    rate: number
  }
  supplyTo: {
    protocol: string
    network: string
    rate: number
  }
  asset: string
  netAPY: number // Supply APY - Borrow APY - gas costs
  estimatedGasCost: number
  profitable: boolean
}
```

### API Endpoints

#### **GET /api/strategies/lending-markets/rates**
Obtiene tasas actuales de todos los protocolos.

**Response:**
```typescript
{
  rates: Array<{
    protocol: string
    network: string
    asset: string
    supplyAPY: number
    borrowAPY: number
    utilization: number
    lastUpdated: string
  }>
}
```

#### **GET /api/strategies/lending-markets/arbitrage**
Calcula oportunidades de arbitraje actuales.

**Query Params:**
- `asset?: 'USDC' | 'USDT' | 'DAI'`
- `minAPY?: number` (default: 2.0)

**Response:**
```typescript
{
  opportunities: Array<{
    borrowFrom: { protocol: string, network: string, rate: number }
    supplyTo: { protocol: string, network: string, rate: number }
    asset: string
    netAPY: number
    profitable: boolean
  }>
}
```

**Implementación Ejemplo:**
```typescript
// app/api/strategies/lending-markets/arbitrage/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const asset = searchParams.get('asset') || 'USDC'

  // 1. Fetch Aave rates from Subgraph
  const aaveRates = await fetchAaveRates(asset)

  // 2. Fetch Compound rates
  const compoundRates = await fetchCompoundRates(asset)

  // 3. Calculate arbitrage opportunities
  const opportunities = calculateArbitrage(aaveRates, compoundRates)

  return NextResponse.json({ opportunities })
}

async function fetchAaveRates(asset: string) {
  const query = `
    query GetReserveData {
      reserves(where: { symbol: "${asset}" }) {
        symbol
        liquidityRate
        variableBorrowRate
        totalLiquidity
      }
    }
  `

  const response = await fetch('https://api.thegraph.com/subgraphs/name/aave/protocol-v3', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })

  const data = await response.json()
  return data.data.reserves.map(r => ({
    protocol: 'AAVE',
    supplyAPY: parseFloat(r.liquidityRate) / 1e25, // Ray to percentage
    borrowAPY: parseFloat(r.variableBorrowRate) / 1e25
  }))
}

function calculateArbitrage(aaveRates, compoundRates) {
  const opportunities = []

  // Find best supply rate
  const bestSupply = [...aaveRates, ...compoundRates].sort((a, b) => b.supplyAPY - a.supplyAPY)[0]

  // Find best borrow rate (lowest)
  const bestBorrow = [...aaveRates, ...compoundRates].sort((a, b) => a.borrowAPY - b.borrowAPY)[0]

  const netAPY = bestSupply.supplyAPY - bestBorrow.borrowAPY - 0.5 // -0.5% gas costs

  if (netAPY > 2.0) {
    opportunities.push({
      borrowFrom: { protocol: bestBorrow.protocol, rate: bestBorrow.borrowAPY },
      supplyTo: { protocol: bestSupply.protocol, rate: bestSupply.supplyAPY },
      netAPY,
      profitable: true
    })
  }

  return opportunities
}
```

### Background Job: Rate Monitor
```typescript
// app/api/cron/update-lending-rates/route.ts
export async function GET() {
  // Runs every 5 minutes
  // 1. Fetch all lending rates
  // 2. Store in database
  // 3. Calculate new APY for strategy
  // 4. Update strategy_performance table
}
```

---

## Strategy 2: Derivative Arbitrage (General)

### Descripción Técnica
Arbitraje de derivados usando opciones sintéticas replicadas con portafolios Delta-hedged en Deribit.

### API Externa: Deribit

**Base URL**: `https://www.deribit.com/api/v2/`

**Autenticación**: API Key + Secret (OAuth2)

**Endpoints Clave**:
- `GET /public/get_instruments` - Lista de instrumentos
- `GET /public/get_order_book` - Order book para un instrumento
- `GET /public/get_index_price` - Precio del índice (BTC, ETH)
- `GET /public/get_volatility_index` - DVOL index
- `POST /private/buy` - Comprar opción
- `POST /private/sell` - Vender opción

### Data Model

```typescript
interface DeribitInstrument {
  instrumentName: string // e.g., "BTC-31DEC24-100000-C"
  kind: 'option' | 'future'
  strike: number
  expirationTimestamp: number
  optionType: 'call' | 'put'
  baseCurrency: 'BTC' | 'ETH'
}

interface OptionPosition {
  instrument: string
  side: 'long' | 'short'
  amount: number // Contract size
  entryPrice: number
  currentPrice: number
  delta: number
  gamma: number
  vega: number
  theta: number
  hedgeAmount: number // BTC/ETH needed for delta hedge
}
```

### API Endpoints

#### **GET /api/strategies/derivative-arbitrage/deribit/instruments**
Lista instrumentos activos en Deribit.

**Query Params:**
- `currency: 'BTC' | 'ETH'`
- `kind?: 'option' | 'future'`

**Response:**
```typescript
{
  instruments: Array<{
    instrumentName: string
    strike: number
    expiration: string
    optionType: 'call' | 'put'
    markPrice: number
    markIV: number
    delta: number
    vega: number
  }>
}
```

**Implementación:**
```typescript
// app/api/strategies/derivative-arbitrage/deribit/instruments/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const currency = searchParams.get('currency') || 'BTC'

  const response = await fetch(
    `https://www.deribit.com/api/v2/public/get_instruments?currency=${currency}&kind=option`
  )

  const data = await response.json()

  const instruments = data.result.map(inst => ({
    instrumentName: inst.instrument_name,
    strike: inst.strike,
    expiration: new Date(inst.expiration_timestamp).toISOString(),
    optionType: inst.option_type,
    markPrice: inst.mark_price,
    // Greeks would need another API call
  }))

  return NextResponse.json({ instruments })
}
```

#### **GET /api/strategies/derivative-arbitrage/deribit/volatility**
Obtiene superficie de volatilidad implícita.

**Response:**
```typescript
{
  dvol: number // Deribit Volatility Index
  surface: Array<{
    strike: number
    expiry: string
    iv: number // Implied Volatility %
  }>
}
```

---

## Strategy 3: Polymarket Arbitrage (HF2)

### Descripción Técnica
Arbitraje de opciones sintéticas en Polymarket usando la fórmula:
```
Synthetic Call = Binary(Yes) - PV(Strike)
Synthetic Put = Binary(No) + PV(Strike)
```

Hedging de vega con opciones reales en Deribit.

### APIs Externas

1. **Polymarket CLOB API**
   - Base: `https://clob.polymarket.com/`
   - Docs: https://docs.polymarket.com/

2. **Polymarket Subgraph** (The Graph)
   - Endpoint: `https://api.thegraph.com/subgraphs/name/polymarket/polymarket`

3. **Deribit** (para hedging)

### Data Model

```typescript
interface PolymarketEvent {
  id: string
  slug: string
  title: string
  endDate: string
  markets: Array<{
    id: string
    question: string
    outcomeTokens: ['Yes', 'No']
    yesPrice: number // 0-1
    noPrice: number // 0-1
    liquidity: number
  }>
}

interface SyntheticOption {
  polymarketEventId: string
  marketId: string
  syntheticType: 'call' | 'put'
  calculatedPrice: number
  impliedStrike: number
  syntheticIV: number
  hedgeInstrument?: string // Deribit instrument for vega hedge
  hedgeRatio: number
}
```

### API Endpoints

#### **GET /api/strategies/polymarket-arbitrage/markets**
Lista mercados activos en Polymarket relevantes para opciones sintéticas.

**Response:**
```typescript
{
  markets: Array<{
    id: string
    title: string
    question: string
    endDate: string
    yesPrice: number
    noPrice: number
    volume24h: number
    isBinary: boolean
  }>
}
```

**Implementación:**
```typescript
// app/api/strategies/polymarket-arbitrage/markets/route.ts
export async function GET() {
  // Fetch from Polymarket API
  const response = await fetch('https://gamma-api.polymarket.com/events', {
    headers: {
      'Accept': 'application/json'
    }
  })

  const events = await response.json()

  // Filter for binary markets with price action
  const binaryMarkets = events
    .filter(e => e.markets.length === 1) // Binary outcomes
    .flatMap(e => e.markets.map(m => ({
      id: m.id,
      title: e.title,
      question: m.question,
      endDate: e.endDate,
      yesPrice: parseFloat(m.outcomePrices[0]),
      noPrice: parseFloat(m.outcomePrices[1]),
      volume24h: m.volume24hr,
      isBinary: true
    })))

  return NextResponse.json({ markets: binaryMarkets })
}
```

#### **GET /api/strategies/polymarket-arbitrage/synthetic-options**
Calcula precios de opciones sintéticas a partir de mercados de Polymarket.

**Query Params:**
- `marketId: string`

**Response:**
```typescript
{
  syntheticCall: {
    price: number
    impliedStrike: number
    iv: number
    delta: number
  }
  syntheticPut: {
    price: number
    impliedStrike: number
    iv: number
    delta: number
  }
  underlyingEvent: {
    title: string
    expiry: string
  }
}
```

**Implementación (Simplificada):**
```typescript
export async function GET(request: NextRequest) {
  const marketId = request.nextUrl.searchParams.get('marketId')

  // 1. Get market data from Polymarket
  const market = await fetchPolymarketMarket(marketId)

  // 2. Calculate synthetic option prices
  const yesPrice = market.yesPrice
  const noPrice = market.noPrice

  // PV(Strike) assuming risk-free rate = 5%
  const daysToExpiry = (new Date(market.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  const discountFactor = Math.exp(-0.05 * daysToExpiry / 365)

  // Synthetic Call = Binary(Yes) - PV(Strike)
  // Assuming Strike = 0.5 for simplicity
  const syntheticCallPrice = yesPrice - (0.5 * discountFactor)

  // Synthetic Put = Binary(No) + PV(Strike)
  const syntheticPutPrice = noPrice + (0.5 * discountFactor)

  // Calculate implied IV using Black-Scholes (simplified)
  const impliedIV = calculateImpliedVolatility(syntheticCallPrice, 0.5, daysToExpiry)

  return NextResponse.json({
    syntheticCall: {
      price: syntheticCallPrice,
      impliedStrike: 0.5,
      iv: impliedIV,
      delta: calculateDelta(syntheticCallPrice, 0.5, impliedIV, daysToExpiry)
    },
    syntheticPut: {
      price: syntheticPutPrice,
      impliedStrike: 0.5,
      iv: impliedIV,
      delta: -1 + calculateDelta(syntheticCallPrice, 0.5, impliedIV, daysToExpiry)
    },
    underlyingEvent: {
      title: market.title,
      expiry: market.endDate
    }
  })
}

function calculateImpliedVolatility(price: number, strike: number, daysToExpiry: number): number {
  // Newton-Raphson method to solve for IV
  // Simplified implementation
  return 0.30 // 30% placeholder
}

function calculateDelta(callPrice: number, strike: number, iv: number, daysToExpiry: number): number {
  // Black-Scholes delta calculation
  // Simplified
  return 0.5 // Placeholder
}
```

#### **GET /api/strategies/polymarket-arbitrage/hedge-positions**
Calcula posiciones de hedging necesarias en Deribit para neutralizar vega.

**Response:**
```typescript
{
  hedges: Array<{
    polymarketMarketId: string
    deribitInstrument: string
    hedgeSize: number // Contracts
    reason: string
  }>
}
```

---

## Strategy 4: Private Equities (HF3)

### Descripción Técnica
Tokenización de activos de private equity con rebalanceo automático basado en NAV.

### API Externa: Custom Valuation API

Por ahora será manual/mockup, pero eventualmente:
- **Third-party NAV providers** (Bloomberg, PitchBook API)
- **Smart contracts** para tokenización (ERC-20 tokens)

### Data Model

```typescript
interface TokenizedAsset {
  id: string
  symbol: string
  name: string
  assetType: 'STARTUP' | 'REAL_ESTATE' | 'VENTURE_DEBT'
  totalSupply: number // Total tokens
  navPerToken: number // Net Asset Value per token
  lastValuation: Date
  companyInfo: {
    name: string
    sector: string
    fundingRound: string
    valuation: number
  }
}

interface PortfolioAllocation {
  assetId: string
  targetWeight: number // 0-1
  currentWeight: number
  rebalanceNeeded: boolean
  rebalanceAmount: number
}
```

### API Endpoints

#### **GET /api/strategies/private-equities/assets**
Lista activos tokenizados disponibles.

**Response:**
```typescript
{
  assets: Array<{
    id: string
    symbol: string
    name: string
    navPerToken: number
    totalValue: number
    sector: string
    ytdReturn: number
  }>
}
```

#### **GET /api/strategies/private-equities/valuations**
Obtiene valoraciones actuales (NAV) de cada activo.

**Response:**
```typescript
{
  valuations: Array<{
    assetId: string
    navPerToken: number
    lastUpdated: string
    priceChange24h: number
  }>
}
```

#### **POST /api/strategies/private-equities/rebalance**
Ejecuta rebalanceo del portafolio según pesos target.

**Request Body:**
```typescript
{
  strategyId: 'private-equities'
  targetAllocations: Array<{
    assetId: string
    targetWeight: number
  }>
}
```

**Response:**
```typescript
{
  trades: Array<{
    assetId: string
    action: 'BUY' | 'SELL'
    amount: number
    reason: string
  }>
  newAllocations: Array<{
    assetId: string
    weight: number
  }>
}
```

---

## Portfolio & Positions API

### **GET /api/portfolio/summary**
Obtiene resumen total del portafolio del usuario.

**Response:**
```typescript
{
  totalValue: number
  totalPnl: number
  totalPnlPercent: number
  return30d: number
  positions: Array<{
    strategyId: string
    strategyName: string
    value: number
    pnl: number
    pnlPercent: number
    allocation: number // % of total portfolio
  }>
}
```

**Implementación:**
```typescript
// app/api/portfolio/summary/route.ts
export async function GET(request: NextRequest) {
  // TODO: Get user from session
  const userId = 'mock-user-id'

  // Get all user positions from database
  const { data: positions } = await supabase
    .from('positions')
    .select(`
      *,
      strategies (id, name, current_price_per_share)
    `)
    .eq('user_id', userId)

  let totalValue = 0
  let totalPnl = 0

  const positionsSummary = positions.map(pos => {
    const currentValue = pos.balance * pos.strategies.current_price_per_share
    const pnl = currentValue - pos.total_deposited + pos.total_withdrawn
    const pnlPercent = (pnl / pos.total_deposited) * 100

    totalValue += currentValue
    totalPnl += pnl

    return {
      strategyId: pos.strategy_id,
      strategyName: pos.strategies.name,
      value: currentValue,
      pnl,
      pnlPercent,
      allocation: 0 // Will calculate after
    }
  })

  // Calculate allocations
  positionsSummary.forEach(pos => {
    pos.allocation = (pos.value / totalValue) * 100
  })

  // Calculate 30d return (from strategy_performance table)
  const return30d = await calculate30DayReturn(userId)

  return NextResponse.json({
    totalValue,
    totalPnl,
    totalPnlPercent: (totalPnl / (totalValue - totalPnl)) * 100,
    return30d,
    positions: positionsSummary
  })
}
```

### **POST /api/positions**
Crea una nueva posición (depósito en estrategia).

**Request Body:**
```typescript
{
  strategyId: string
  amount: number // USD amount
}
```

**Response:**
```typescript
{
  position: {
    id: string
    strategyId: string
    balance: number // Tokens received
    value: number // USD value
    entryPrice: number
  }
  transaction: {
    id: string
    type: 'DEPOSIT'
    amount: number
  }
}
```

---

## Background Jobs (Critical)

### Vercel Cron Jobs

#### **Every 5 minutes**: Update Lending Rates
```typescript
// app/api/cron/update-lending-rates/route.ts
export async function GET() {
  // 1. Fetch Aave, Compound rates
  // 2. Store in lending_rates table
  // 3. Calculate new strategy APY
  // 4. Update strategies table
}
```

#### **Every 15 minutes**: Update Deribit Data
```typescript
// app/api/cron/update-deribit-data/route.ts
export async function GET() {
  // 1. Fetch Deribit instruments, prices, Greeks
  // 2. Store in deribit_instruments table
  // 3. Calculate strategy performance
}
```

#### **Every 15 minutes**: Update Polymarket Data
```typescript
// app/api/cron/update-polymarket-data/route.ts
export async function GET() {
  // 1. Fetch active markets
  // 2. Calculate synthetic option prices
  // 3. Store in polymarket_markets table
}
```

#### **Daily**: Calculate NAV for Private Equities
```typescript
// app/api/cron/calculate-nav/route.ts
export async function GET() {
  // 1. Fetch latest valuations (manual/API)
  // 2. Calculate NAV per token
  // 3. Update tokenized_assets table
}
```

#### **Daily**: Update Strategy Performance
```typescript
// app/api/cron/update-strategy-performance/route.ts
export async function GET() {
  // For each strategy:
  // 1. Calculate daily APY
  // 2. Calculate TVL
  // 3. Calculate price_per_share
  // 4. Insert into strategy_performance table
}
```

---

## Database Schema (MVP)

```sql
-- Strategies (seedear con las 4 estrategias)
CREATE TABLE strategies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  risk_level TEXT CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  current_apy DECIMAL(5, 2) DEFAULT 0,
  current_tvl DECIMAL(20, 2) DEFAULT 0,
  current_price_per_share DECIMAL(20, 8) DEFAULT 1.0,
  is_active BOOLEAN DEFAULT TRUE
);

-- User positions
CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL, -- Por ahora mock, después Supabase auth
  strategy_id TEXT REFERENCES strategies(id),
  balance DECIMAL(20, 8) DEFAULT 0, -- Tokens held
  total_deposited DECIMAL(20, 2) DEFAULT 0,
  total_withdrawn DECIMAL(20, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, strategy_id)
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  strategy_id TEXT REFERENCES strategies(id),
  type TEXT CHECK (type IN ('DEPOSIT', 'WITHDRAW', 'PROFIT', 'LOSS')),
  amount DECIMAL(20, 2) NOT NULL,
  balance_before DECIMAL(20, 8),
  balance_after DECIMAL(20, 8),
  price_per_share DECIMAL(20, 8),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Strategy performance history
CREATE TABLE strategy_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strategy_id TEXT REFERENCES strategies(id),
  date DATE NOT NULL,
  apy_snapshot DECIMAL(5, 2),
  tvl_snapshot DECIMAL(20, 2),
  price_per_share DECIMAL(20, 8),
  daily_return DECIMAL(10, 6),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(strategy_id, date)
);

-- Lending Markets: Rate snapshots
CREATE TABLE lending_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  protocol TEXT NOT NULL, -- 'AAVE', 'COMPOUND', 'SPARK'
  network TEXT NOT NULL,
  asset TEXT NOT NULL,
  supply_apy DECIMAL(8, 4),
  borrow_apy DECIMAL(8, 4),
  utilization DECIMAL(5, 2),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Deribit: Instruments cache
CREATE TABLE deribit_instruments (
  instrument_name TEXT PRIMARY KEY,
  kind TEXT, -- 'option', 'future'
  base_currency TEXT,
  strike DECIMAL(20, 2),
  expiration_timestamp BIGINT,
  option_type TEXT, -- 'call', 'put'
  mark_price DECIMAL(20, 8),
  mark_iv DECIMAL(8, 4),
  delta DECIMAL(8, 6),
  gamma DECIMAL(8, 6),
  vega DECIMAL(8, 6),
  theta DECIMAL(8, 6),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Polymarket: Markets cache
CREATE TABLE polymarket_markets (
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

-- Private Equities: Tokenized assets
CREATE TABLE tokenized_assets (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  asset_type TEXT,
  total_supply DECIMAL(20, 8),
  nav_per_token DECIMAL(20, 8),
  last_valuation_date DATE,
  company_name TEXT,
  sector TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Environment Variables

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Deribit
DERIBIT_API_KEY=your-api-key
DERIBIT_API_SECRET=your-api-secret

# The Graph (for Aave, Polymarket)
THEGRAPH_API_KEY=your-api-key

# Polymarket
POLYMARKET_API_KEY=your-api-key # If needed

# For future Web3 integration
ALCHEMY_API_KEY=your-alchemy-key
PRIVATE_KEY=your-wallet-private-key # For executing trades
```

---

## Next Steps de Implementación

1. ✅ Crear database schema en Supabase
2. ✅ Seedear tabla `strategies` con las 4 estrategias
3. ✅ Implementar `/api/strategies/lending-markets/rates`
4. ✅ Implementar `/api/strategies/lending-markets/arbitrage`
5. ✅ Implementar `/api/strategies/derivative-arbitrage/deribit/instruments`
6. ✅ Implementar `/api/strategies/polymarket-arbitrage/markets`
7. ✅ Implementar `/api/portfolio/summary`
8. ✅ Implementar `/api/positions` (POST - deposit)
9. ✅ Setup Vercel Cron Jobs para background updates
10. ✅ Conectar frontend a APIs reales

---

**Last Updated**: 2025-11-30
**Version**: 1.0.0 (MVP)
