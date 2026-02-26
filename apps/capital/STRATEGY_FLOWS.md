# Strategy Flow Diagrams

Diagramas de flujo detallados de cada estrategia y sus interacciones con APIs externas.

---

## 1. Lending Markets Strategy Flow

```mermaid
sequenceDiagram
    participant User
    participant API as API Route
    participant DB as Supabase DB
    participant Aave as Aave Subgraph
    participant Compound as Compound API
    participant Spark as Spark Protocol

    Note over API: Cron Job runs every 5 minutes

    API->>Aave: GET lending rates (USDC, USDT, DAI)
    Aave-->>API: { supplyAPY: 3.2%, borrowAPY: 4.1% }

    API->>Compound: GET lending rates
    Compound-->>API: { supplyAPY: 2.8%, borrowAPY: 3.9% }

    API->>Spark: GET lending rates
    Spark-->>API: { supplyAPY: 3.5%, borrowAPY: 4.0% }

    API->>API: Calculate arbitrage opportunities
    Note over API: netAPY = bestSupply - bestBorrow - gasCosts

    API->>DB: Store rates in lending_rates table
    API->>DB: Update strategy APY and TVL

    User->>API: GET /api/strategies/lending-markets/arbitrage
    API->>DB: Fetch latest rates
    DB-->>API: Current rates
    API-->>User: { opportunities: [...], netAPY: 8.13% }

    User->>API: POST /api/positions (deposit $1000)
    API->>DB: Create position record
    API->>DB: Create transaction (DEPOSIT)
    API->>DB: Update strategy TVL
    DB-->>API: Position created
    API-->>User: { positionId, balance: 1000 tokens }
```

---

## 2. Derivative Arbitrage Strategy Flow (Deribit)

```mermaid
sequenceDiagram
    participant User
    participant API as API Route
    participant DB as Supabase DB
    participant Deribit as Deribit API
    participant BS as Black-Scholes Engine

    Note over API: Cron Job runs every 15 minutes

    API->>Deribit: GET /public/get_instruments?currency=BTC&kind=option
    Deribit-->>API: [{ instrument: "BTC-31DEC24-100000-C", ... }]

    loop For each instrument
        API->>Deribit: GET /public/get_order_book?instrument_name=...
        Deribit-->>API: { mark_price, mark_iv, greeks }
    end

    API->>DB: Store in deribit_instruments table

    API->>BS: Calculate theoretical prices
    BS-->>API: { theoreticalPrice, impliedVol }

    API->>API: Find mispriced options
    Note over API: Compare market IV vs theoretical IV

    API->>DB: Update strategy performance

    User->>API: GET /api/strategies/derivative-arbitrage/deribit/instruments
    API->>DB: Fetch cached instruments
    DB-->>API: Instruments with Greeks
    API-->>User: { instruments: [...] }

    User->>API: GET /api/strategies/derivative-arbitrage/positions
    API->>DB: Get user's hedged positions
    DB-->>API: Positions with P&L
    API-->>User: { positions: [...], totalDelta: 0.02 }
```

---

## 3. Polymarket Arbitrage Strategy Flow

```mermaid
sequenceDiagram
    participant User
    participant API as API Route
    participant DB as Supabase DB
    participant Poly as Polymarket API
    participant Deribit as Deribit API
    participant Calc as Options Calculator

    Note over API: Cron Job runs every 15 minutes

    API->>Poly: GET /events (active markets)
    Poly-->>API: [{ eventId, markets: [...] }]

    API->>Poly: GET /markets/:id (binary outcomes)
    Poly-->>API: { yesPrice: 0.65, noPrice: 0.35 }

    API->>Calc: Calculate synthetic option prices
    Note over Calc: SyntheticCall = Binary(Yes) - PV(Strike)<br/>SyntheticPut = Binary(No) + PV(Strike)
    Calc-->>API: { syntheticCallPrice, syntheticPutPrice, IV }

    API->>Deribit: GET comparable real options
    Deribit-->>API: { realCallPrice, realCallIV }

    API->>API: Calculate arbitrage opportunity
    Note over API: If syntheticIV > realIV + threshold:<br/>Sell synthetic, Buy real (vega hedge)

    API->>DB: Store polymarket_markets
    API->>DB: Store arbitrage opportunities

    User->>API: GET /api/strategies/polymarket-arbitrage/synthetic-options?marketId=123
    API->>DB: Fetch market data
    DB-->>API: Market prices
    API->>Calc: Calculate synthetic Greeks
    Calc-->>API: { delta, gamma, vega, theta }
    API-->>User: { syntheticCall: {...}, syntheticPut: {...} }

    User->>API: GET /api/strategies/polymarket-arbitrage/hedge-positions
    API->>DB: Get active arbitrage positions
    API->>Deribit: Get hedge instrument prices
    Deribit-->>API: Current hedge values
    API-->>User: { hedges: [...], netVega: 0.01 }
```

---

## 4. Private Equities Strategy Flow

```mermaid
sequenceDiagram
    participant User
    participant API as API Route
    participant DB as Supabase DB
    participant NAV as NAV Provider
    participant Rebalancer as Portfolio Optimizer

    Note over API: Daily Cron Job for NAV updates

    API->>NAV: GET valuations for all assets
    Note over NAV: Could be manual uploads,<br/>Bloomberg API, or PitchBook
    NAV-->>API: { assetId: "STARTUP-A", valuation: $50M }

    API->>API: Calculate NAV per token
    Note over API: navPerToken = totalValuation / totalSupply

    API->>DB: Update tokenized_assets table

    API->>DB: Get all user positions
    DB-->>API: Current allocations

    API->>Rebalancer: Calculate drift from target weights
    Rebalancer-->>API: { trades: [{ asset, action, amount }] }

    alt Rebalancing needed
        API->>DB: Execute virtual trades
        API->>DB: Update positions
    end

    API->>DB: Update strategy performance

    User->>API: GET /api/strategies/private-equities/assets
    API->>DB: Fetch tokenized assets
    DB-->>API: Assets with latest NAV
    API-->>User: { assets: [...] }

    User->>API: GET /api/strategies/private-equities/valuations
    API->>DB: Get NAV history
    DB-->>API: Valuation timeline
    API-->>User: { valuations: [...] }

    User->>API: POST /api/strategies/private-equities/rebalance
    API->>Rebalancer: Optimize portfolio
    Rebalancer-->>API: Target allocations
    API->>DB: Execute rebalance trades
    DB-->>API: Updated positions
    API-->>User: { trades: [...], newAllocations: [...] }
```

---

## 5. User Portfolio Flow (General)

```mermaid
flowchart TD
    Start([User Opens App]) --> ViewStrategies[View Strategies Page]

    ViewStrategies --> FetchStrategies[GET /api/strategies]
    FetchStrategies --> DisplayCards[Display Strategy Cards<br/>APY, TVL, Risk]

    DisplayCards --> UserClick{User Clicks<br/>Strategy}

    UserClick -->|Info Button| ViewBacktest[GET /info/strategy-name<br/>View Backtesting Results]
    UserClick -->|Strategy Card| ViewDetail[GET /api/strategies/:id<br/>View Strategy Detail]

    ViewDetail --> ShowPerf[GET /api/strategies/:id/performance<br/>Show Equity Curve Chart]

    ShowPerf --> UserDeposit{User Wants<br/>to Deposit?}

    UserDeposit -->|No| ViewDashboard[Go to Dashboard]
    UserDeposit -->|Yes| Deposit[POST /api/positions<br/>amount: $1000]

    Deposit --> CreatePosition[Create Position in DB]
    CreatePosition --> CreateTx[Create Transaction Record]
    CreateTx --> UpdateTVL[Update Strategy TVL]
    UpdateTVL --> ReturnPos[Return Position Object]

    ReturnPos --> ViewDashboard

    ViewDashboard --> GetPortfolio[GET /api/portfolio/summary]
    GetPortfolio --> CalcMetrics[Calculate:<br/>- Total Value<br/>- Total P&L<br/>- 30d Return]
    CalcMetrics --> DisplayDash[Display Dashboard<br/>with Charts & Positions]

    DisplayDash --> UserAction{User Action?}

    UserAction -->|View Transactions| GetTx[GET /api/portfolio/transactions]
    UserAction -->|View Performance| GetPerf[GET /api/portfolio/performance]
    UserAction -->|Withdraw| Withdraw[POST /api/positions/:id/withdraw]

    Withdraw --> UpdatePos[Update Position]
    UpdatePos --> CreateWithdrawTx[Create WITHDRAW Transaction]
    CreateWithdrawTx --> ViewDashboard

    GetTx --> DisplayTxHistory[Display Transaction History]
    GetPerf --> DisplayPerfChart[Display Performance Chart]

    style Deposit fill:#90EE90
    style Withdraw fill:#FFB6C1
    style ViewDashboard fill:#87CEEB
```

---

## 6. Background Jobs Flow

```mermaid
flowchart LR
    subgraph "Every 5 Minutes"
        Cron5[Vercel Cron Job] --> UpdateLending[Update Lending Rates]
        UpdateLending --> FetchAave[Fetch Aave]
        UpdateLending --> FetchCompound[Fetch Compound]
        FetchAave --> StoreLending[Store in lending_rates]
        FetchCompound --> StoreLending
        StoreLending --> CalcAPY1[Recalculate Strategy APY]
        CalcAPY1 --> UpdateStrat1[Update strategies table]
    end

    subgraph "Every 15 Minutes"
        Cron15[Vercel Cron Job] --> UpdateDeribit[Update Deribit Data]
        Cron15 --> UpdatePoly[Update Polymarket Data]

        UpdateDeribit --> FetchInst[Fetch Instruments]
        UpdateDeribit --> FetchOB[Fetch Order Books]
        FetchInst --> StoreDeribit[Store in deribit_instruments]
        FetchOB --> StoreDeribit
        StoreDeribit --> CalcAPY2[Recalculate Strategy APY]

        UpdatePoly --> FetchMarkets[Fetch Markets]
        UpdatePoly --> CalcSynthetic[Calculate Synthetic Options]
        FetchMarkets --> StorePoly[Store in polymarket_markets]
        CalcSynthetic --> StorePoly
        StorePoly --> CalcAPY3[Recalculate Strategy APY]
    end

    subgraph "Daily"
        CronDaily[Vercel Cron Job] --> UpdateNAV[Calculate NAV]
        CronDaily --> UpdatePerf[Update Strategy Performance]

        UpdateNAV --> FetchVal[Fetch Valuations]
        FetchVal --> StoreNAV[Store in tokenized_assets]
        StoreNAV --> CalcAPY4[Recalculate Strategy APY]

        UpdatePerf --> ForEachStrat[For Each Strategy]
        ForEachStrat --> CalcDaily[Calculate Daily Metrics]
        CalcDaily --> StorePerf[Store in strategy_performance]
    end

    UpdateStrat1 --> UpdateFrontend[Frontend Polls for Updates]
    CalcAPY2 --> UpdateFrontend
    CalcAPY3 --> UpdateFrontend
    CalcAPY4 --> UpdateFrontend

    style Cron5 fill:#FFE4B5
    style Cron15 fill:#FFE4B5
    style CronDaily fill:#FFE4B5
    style UpdateFrontend fill:#90EE90
```

---

## 7. Lending Markets Arbitrage Execution Flow

```mermaid
flowchart TD
    Start[Background Job Triggered] --> FetchRates[Fetch All Protocol Rates]

    FetchRates --> Aave[Aave:<br/>Supply: 3.2%<br/>Borrow: 4.1%]
    FetchRates --> Compound[Compound:<br/>Supply: 2.8%<br/>Borrow: 3.9%]
    FetchRates --> Spark[Spark:<br/>Supply: 3.5%<br/>Borrow: 4.0%]

    Aave --> FindBest[Find Best Rates]
    Compound --> FindBest
    Spark --> FindBest

    FindBest --> BestSupply[Best Supply:<br/>Spark 3.5%]
    FindBest --> BestBorrow[Best Borrow:<br/>Compound 3.9%]

    BestSupply --> CalcNet[Calculate Net APY]
    BestBorrow --> CalcNet

    CalcNet --> Formula[Net APY = 3.5% - 3.9% + ...<br/>Wait, that's negative!]

    Formula --> Recheck{Is Arbitrage<br/>Profitable?}

    Recheck -->|No| NoAction[No Action Taken]
    Recheck -->|Yes| CheckConditions{Check:<br/>- Gas costs<br/>- Liquidity<br/>- Flash loan availability}

    CheckConditions -->|Not Viable| NoAction
    CheckConditions -->|Viable| Execute[Execute Arbitrage]

    Execute --> Step1[1. Flash Loan from Aave]
    Step1 --> Step2[2. Borrow from Compound at 3.9%]
    Step2 --> Step3[3. Supply to Spark at 3.5%]
    Step3 --> Step4[4. Repay Flash Loan]

    Step4 --> RecordTrade[Record Trade in DB]
    RecordTrade --> UpdateAPY[Update Strategy APY]

    NoAction --> End[End]
    UpdateAPY --> End

    style Execute fill:#90EE90
    style NoAction fill:#FFB6C1
```

---

## 8. Polymarket Synthetic Option Calculation

```mermaid
flowchart TD
    Start[Polymarket Market Data] --> GetPrices[Yes Price: 0.65<br/>No Price: 0.35]

    GetPrices --> GetExpiry[Event End Date:<br/>31-DEC-2024]

    GetExpiry --> CalcDays[Days to Expiry:<br/>45 days]

    CalcDays --> CalcDiscount[Calculate Discount Factor:<br/>df = e^(-0.05 * 45/365)]

    CalcDiscount --> PVStrike[PV of Strike:<br/>Assume K = $50,000<br/>PV = 50000 * df]

    PVStrike --> SynthCall[Synthetic Call Price =<br/>Yes_Price - PV_Strike_Normalized]

    PVStrike --> SynthPut[Synthetic Put Price =<br/>No_Price + PV_Strike_Normalized]

    SynthCall --> CallPrice[Call Price: $0.42]
    SynthPut --> PutPrice[Put Price: $0.58]

    CallPrice --> CalcIV[Calculate Implied Volatility<br/>Using Black-Scholes]
    PutPrice --> CalcIV

    CalcIV --> Newton[Newton-Raphson Method:<br/>Find σ where BS(σ) = Market Price]

    Newton --> IV[Implied Vol: 45%]

    IV --> CompareReal{Compare to<br/>Real Options<br/>on Deribit}

    CompareReal --> DeribitIV[Deribit IV: 35%]

    DeribitIV --> ArbCheck{Polymarket IV<br/>> Deribit IV?}

    ArbCheck -->|Yes| Opportunity[Arbitrage Opportunity!<br/>Sell Polymarket (expensive)<br/>Buy Deribit (cheap)]

    ArbCheck -->|No| NoArb[No Arbitrage]

    Opportunity --> CalcHedge[Calculate Vega Hedge:<br/>hedge_ratio = vega_poly / vega_deribit]

    CalcHedge --> StoreOpp[Store Opportunity in DB]

    NoArb --> End[End]
    StoreOpp --> End

    style Opportunity fill:#90EE90
    style NoArb fill:#FFB6C1
```

---

## 9. Database Update Flow

```mermaid
erDiagram
    strategies ||--o{ positions : "has many"
    strategies ||--o{ transactions : "tracks"
    strategies ||--o{ strategy_performance : "historical data"

    positions ||--o{ transactions : "generates"

    strategies ||--o{ lending_rates : "uses (lending markets)"
    strategies ||--o{ deribit_instruments : "uses (derivatives)"
    strategies ||--o{ polymarket_markets : "uses (polymarket)"
    strategies ||--o{ tokenized_assets : "uses (private equity)"

    strategies {
        string id PK
        string name
        decimal current_apy
        decimal current_tvl
        decimal price_per_share
    }

    positions {
        uuid id PK
        string user_id FK
        string strategy_id FK
        decimal balance
        decimal total_deposited
    }

    transactions {
        uuid id PK
        string user_id FK
        string strategy_id FK
        string type
        decimal amount
    }

    strategy_performance {
        uuid id PK
        string strategy_id FK
        date date
        decimal apy_snapshot
        decimal price_per_share
    }

    lending_rates {
        uuid id PK
        string protocol
        decimal supply_apy
        decimal borrow_apy
    }

    deribit_instruments {
        string instrument_name PK
        decimal mark_price
        decimal mark_iv
        decimal delta
    }

    polymarket_markets {
        string market_id PK
        decimal yes_price
        decimal no_price
    }

    tokenized_assets {
        string id PK
        decimal nav_per_token
    }
```

---

## 10. Error Handling Flow

```mermaid
flowchart TD
    APICall[API Request] --> TryCatch{Try/Catch Block}

    TryCatch -->|Success| ValidateInput[Validate Input with Zod]

    ValidateInput -->|Valid| ProcessRequest[Process Request]
    ValidateInput -->|Invalid| ValidationError[Return 400<br/>Validation Error]

    ProcessRequest --> ExternalAPI{Call External API}

    ExternalAPI -->|Success| ProcessData[Process Data]
    ExternalAPI -->|Timeout| RetryLogic{Retry Logic<br/>Attempts < 3?}
    ExternalAPI -->|API Error| LogError[Log Error to Console]

    RetryLogic -->|Yes| ExternalAPI
    RetryLogic -->|No| ReturnError[Return 503<br/>Service Unavailable]

    LogError --> CheckFallback{Fallback Data<br/>Available?}

    CheckFallback -->|Yes| UseCached[Use Cached Data]
    CheckFallback -->|No| ReturnError

    ProcessData --> UpdateDB{Update Database}

    UpdateDB -->|Success| ReturnSuccess[Return 200 OK]
    UpdateDB -->|DB Error| ReturnDBError[Return 500<br/>Database Error]

    UseCached --> ReturnSuccess

    TryCatch -->|Uncaught Error| CatchAll[Catch-All Error Handler]
    CatchAll --> LogCritical[Log Critical Error]
    LogCritical --> Return500[Return 500<br/>Internal Server Error]

    style ReturnSuccess fill:#90EE90
    style ValidationError fill:#FFB6C1
    style ReturnError fill:#FFB6C1
    style ReturnDBError fill:#FFB6C1
    style Return500 fill:#FF6B6B
```

---

**Last Updated**: 2025-11-30
