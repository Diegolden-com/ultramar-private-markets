# OA Capital Web3 App (v0-oak) - Codebase Documentation

## Project Overview

**OA Capital v0-oak** is a DeFi investment platform prototype that provides access to sophisticated investment strategies in decentralized finance. Built with Next.js 16 and React 19, this application showcases three distinct investment strategies through a brutalist, accessible interface.

**Status:** Prototype/MVP stage with placeholder data
**Deployment:** Vercel (https://vercel.com/pachuco/v0-oa-capital)
**Current Branch:** backend
**Origin:** Auto-generated and synced from v0.app (Vercel's AI design tool)

### Key Characteristics
- Wallet functionality is stubbed (not yet implemented)
- All financial data is demo/placeholder
- Built for demonstration purposes
- Auto-syncs with v0.app deployments

---

## Technology Stack

### Core Framework
- **Next.js 16.0.0** - App Router architecture (file-based routing)
- **React 19.2.0** - Latest stable release
- **TypeScript 5.x** - Strict mode enabled with path aliases (@/*)

### UI & Styling
- **Tailwind CSS 4.1.9** - Latest v4 with CSS-first configuration
- **shadcn/ui** - Built on Radix UI primitives (40+ packages)
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **next-themes** - Dark/light mode theming
- **class-variance-authority + clsx + tailwind-merge** - Utility class management

### Data Visualization
- **Recharts** - Charting library for equity curves and portfolio performance
- Custom chart wrappers: `portfolio-chart.tsx`, `equity-curve-chart.tsx`

### Forms & Validation
- **React Hook Form 7.60.0** - Form state management
- **Zod 3.25.76** - Schema validation
- **@hookform/resolvers** - Zod integration

### Additional Libraries
- **date-fns** - Date manipulation
- **embla-carousel-react** - Carousel functionality
- **sonner** - Toast notifications
- **vaul** - Drawer/modal components
- **cmdk** - Command menu
- **@vercel/analytics** - Analytics tracking

### Development Tools
- **pnpm** - Package manager
- **PostCSS** - CSS processing
- **ESLint** - Linting (currently ignored during builds)

---

## Project Structure

```
v0-oak/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (fonts, theme, analytics)
│   ├── page.tsx                  # Landing page (/)
│   ├── globals.css               # Global styles (Tailwind + custom theme)
│   ├── app/                      # Strategy routes
│   │   ├── page.tsx              # Strategy listing (/app)
│   │   └── strategy/
│   │       └── [id]/
│   │           └── page.tsx      # Dynamic strategy detail
│   ├── dashboard/
│   │   └── page.tsx              # User portfolio dashboard
│   └── info/                     # Backtesting & documentation
│       ├── page.tsx              # Info hub
│       ├── lending-markets/
│       │   └── page.tsx          # HF1 backtesting results
│       ├── polymarket-options/
│       │   └── page.tsx          # Options strategy info
│       └── private-markets/
│           └── page.tsx          # Private equity whitepaper
├── components/                   # React components
│   ├── ui/                       # shadcn/ui atomic components
│   ├── navigation.tsx            # Desktop header navigation
│   ├── bottom-navigation.tsx    # Mobile bottom nav (sticky)
│   ├── theme-provider.tsx       # Dark/light mode context
│   ├── oak-leaf-logo.tsx        # Custom SVG logo
│   ├── portfolio-chart.tsx      # Dashboard performance chart
│   └── equity-curve-chart.tsx   # Strategy equity curve chart
├── lib/
│   └── utils.ts                 # cn() helper for className merging
├── public/                       # Static assets (SVGs, placeholder images)
├── styles/                       # Additional global styles
├── components.json               # shadcn/ui configuration
├── tsconfig.json                 # TypeScript config (strict mode)
├── next.config.mjs               # Next.js config (relaxed validation)
├── postcss.config.mjs            # PostCSS config (Tailwind v4)
└── package.json                  # Dependencies (pnpm)
```

**File Count:** 17 TypeScript/JavaScript source files
**Main Pages:** 9 route pages
**Reusable Components:** 7 custom components

---

## Application Features

### 1. Landing Page (`/`)
- Hero section with value proposition
- Feature grid (transparent, secure, efficient)
- Call-to-action buttons linking to /app
- Footer with copyright

### 2. Strategies App (`/app`)
Three investment strategies with distinct risk profiles:

#### **Lending Markets** (LOW RISK)
- APY: +12.4% | TVL: $2.4M
- Automated lending across DeFi protocols with dynamic rate optimization
- Strategy ID: `lending-markets`

#### **Polymarket Synthetic Options** (MEDIUM RISK)
- APY: +24.8% | TVL: $890K
- Synthetic options on prediction markets with automated hedging
- Strategy ID: `polymarket-options`

#### **Private Equities** (HIGH RISK)
- APY: +32.6% | TVL: $1.2M
- Tokenized private equity with portfolio rebalancing
- Strategy ID: `private-markets`

### 3. Strategy Details (`/app/strategy/[id]`)
**Dynamic route handler for individual strategy pages**

Components:
- Strategy header with APY, TVL, risk level
- User balance/position display (placeholder $0.00)
- 30-day P&L tracking
- Interactive equity curve chart (30-day performance)
- Buy/Sell action buttons (non-functional prototype)
- Featured companies carousel (private equities strategy only)
- Collapsible chart information sections

**Current Implementation:**
- Static data defined inline in page component
- No API calls or database connections
- Buy/Sell buttons are UI-only (no Web3 integration)

### 4. Dashboard (`/dashboard`)
**User portfolio overview page**

Features:
- Portfolio metrics cards:
  - Total Portfolio Value
  - Total P&L (All Time)
  - 30-day Return
- Interactive portfolio chart with time period toggles (7D, 30D, 90D, ALL)
- Active positions table (responsive mobile/desktop layouts)
- Transaction history table
- CSV download buttons (stubbed functionality)

**Data Source:** Hardcoded mock data in component

### 5. Info/Backtesting Pages (`/info/*`)

#### Main Info Page (`/info`)
- Navigation links to detailed backtesting results
- FAQ section covering:
  - Platform basics
  - Risk explanations
  - Return expectations
  - Withdrawal process

#### Lending Markets Results (`/info/lending-markets`)
**Comprehensive backtesting analysis of "Odisea HF1" strategy**

Content:
- Cross-network arbitrage methodology
- Performance metrics tables (USDC and USDT configurations)
- Multiple cost scenarios (Ultra Low to Very High)
- Historical analysis showing +8.13% returns (USDC) vs +2.18% (USDT)
- Author: Carlos Arroyo (Economist & Data Analyst)

#### Polymarket Options (`/info/polymarket-options`)
**Strategy development documentation**

Content:
- Status: In development
- Problem statement: Limited historical derivatives data
- Solution: Live data collection via PostgreSQL + Deribit API
- Synthetic asset arbitrage formulas (Black-Scholes based)
- Technical implementation roadmap
- Note: Contains Spanish language content

#### Private Markets (`/info/private-markets`)
**Business plan and whitepaper**

Content:
- Tokenized private equity exchange concept
- AI-driven compliance monitoring vision
- Technical architecture (4 layers):
  1. Onboarding
  2. Compliance
  3. Trading
  4. Investor protection
- Business model and revenue streams
- Regulatory strategy (US, EU, LATAM, APAC)
- Competition analysis
- Exit strategy

---

## Architecture & Patterns

### Frontend Architecture
**Pattern:** Next.js App Router (file-based routing, server-first)

**Component Strategy:**
- Pages are **Server Components** by default
- Client components marked with `"use client"` directive
- Used for interactivity (theme toggle, charts, forms)

**Route Structure:**
```
/ (root)                    → Landing page
/app                        → Strategy listing
/app/strategy/[id]          → Dynamic strategy detail (3 strategies)
/dashboard                  → User portfolio
/info                       → Info hub
/info/lending-markets       → Backtesting results (HF1)
/info/polymarket-options    → Options strategy info (HF2)
/info/private-markets       → Private equity whitepaper
```

### State Management
**No global state library** (Redux/Zustand not needed for prototype)

State handled via:
- **Theme:** React Context (ThemeProvider) with localStorage persistence
- **Forms:** React Hook Form (uncontrolled components)
- **Navigation:** Next.js `usePathname` hook for active link detection
- **Local component state:** React `useState` for UI toggles

### Data Layer
**Current Implementation:** Static/hardcoded data

- Strategy data: Defined inline in page components as arrays/objects
- Chart data: Mock data arrays in chart components
- No API calls, no database connections

**Future Architecture (implied from documentation):**
- Backend: Next.js API routes or separate backend service
- Database: PostgreSQL (mentioned for Supabase in HF2 page)
- DeFi integrations: Aave, Deribit APIs (mentioned in strategy docs)
- Web3 wallet: MetaMask/WalletConnect for authentication

### Responsive Design
**Mobile-First Approach:**
- Bottom navigation for mobile (<768px), hidden on desktop
- Responsive breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- Layout transformations:
  - Mobile: Stacked cards, full-width buttons
  - Desktop: Multi-column grids, sidebar layouts
- Touch-optimized: Carousels, collapsible sections
- Table → Card transformations for mobile

---

## Design System

### Visual Design Language
**Brutalist/Minimalist DeFi Aesthetic**

Characteristics:
- Heavy use of borders: `border-2 border-foreground`
- Monospace fonts for headings (Space Mono)
- High contrast black/white with green accents
- **Zero border radius** (`--radius: 0rem`) for sharp corners
- Grid-based, geometric layouts
- Minimal shadows/gradients

### Typography
```css
Headings: Space Mono (monospace, bold, 700 weight)
Body: Inter (sans-serif, variable weight)
Labels: ALL CAPS convention
```

### Color System
**Tailwind v4 with OKLCH color space**

Defined in `app/globals.css`:
```css
--color-accent: oklch(0.75 0.15 142);         /* Green accent */
--color-destructive: oklch(0.55 0.22 25);     /* Red for errors */
--color-background: oklch(1 0 0);              /* White (light mode) */
--color-foreground: oklch(0.2 0 0);            /* Near-black text */
```

**Dark Mode:**
```css
.dark {
  --color-background: oklch(0.15 0 0);         /* Very dark gray */
  --color-foreground: oklch(0.98 0 0);         /* Off-white text */
}
```

### Component Patterns
**Consistent UI Patterns:**

1. **Border-wrapped cards:**
   ```tsx
   <div className="border-2 border-foreground p-6">
     <div className="border-b-2 border-foreground pb-4 mb-4">
       {/* Header */}
     </div>
     {/* Content */}
   </div>
   ```

2. **Responsive grid-to-stack:**
   ```tsx
   <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
     {/* Cards */}
   </div>
   ```

3. **Collapsible details:**
   ```tsx
   <details className="group">
     <summary className="cursor-pointer">
       {/* Toggle */}
     </summary>
     {/* Expandable content */}
   </details>
   ```

4. **Icon + text combinations:**
   ```tsx
   <Button>
     <Icon className="mr-2 h-4 w-4" />
     TEXT
   </Button>
   ```

### Theme System
**Implementation:**
- Provider: `components/theme-provider.tsx`
- Storage: localStorage with key `theme`
- Toggle: Theme switcher button in navigation
- Modes: `light`, `dark`, `system`
- CSS variables automatically swap via `.dark` class

---

## Key Configuration Files

### `next.config.mjs`
```javascript
{
  eslint: { ignoreDuringBuilds: true },        // Skip linting in builds
  typescript: { ignoreBuildErrors: true },     // Skip TS errors in builds
  images: { unoptimized: true }                // No image optimization
}
```
**Purpose:** Relaxed validation for rapid prototyping

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "strict": true,                             // Strict TypeScript
    "paths": { "@/*": ["./*"] }                // Path alias for imports
  }
}
```

### `components.json` (shadcn/ui config)
```json
{
  "style": "new-york",                          // Component style variant
  "rsc": true,                                  // React Server Components
  "tailwind": { "cssVariables": true }         // Use CSS variables
}
```

### `app/globals.css`
**Key Features:**
- Tailwind v4 CSS-first configuration (no tailwind.config.js)
- OKLCH color space for better color handling
- Custom CSS variables for theming
- Dark mode via `.dark` class
- Custom scrollbar utilities
- Zero border radius for brutalist aesthetic

**Structure:**
```css
@import "tailwindcss";
@theme {
  /* Tailwind v4 inline theme configuration */
}
/* Custom base styles */
/* Utility classes */
```

---

## Important Code Patterns & Conventions

### 1. File Naming
- **Files:** kebab-case (`portfolio-chart.tsx`)
- **Components:** PascalCase (`PortfolioChart`)
- **Utilities:** camelCase (`cn`)

### 2. Import Patterns
**Path Aliases:**
```tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

**Export Patterns:**
```tsx
// Pages: default exports
export default function Page() { }

// Utilities: named exports
export function cn(...inputs) { }
```

### 3. Component Structure
**Standard Pattern:**
```tsx
"use client" // Only if client interactivity needed

import { ... } from "..."

interface ComponentProps {
  // TypeScript props
}

export default function Component({ props }: ComponentProps) {
  // Hooks at top
  // Event handlers
  // Render logic

  return (
    <div className={cn("...")}>
      {/* JSX */}
    </div>
  )
}
```

### 4. Styling Patterns
**Utility-First with cn() Helper:**
```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  variant === "primary" && "variant-classes"
)}>
```

### 5. Data Structures
**Strategy Object Pattern:**
```tsx
interface Strategy {
  id: string                    // URL-safe identifier
  name: string                  // Display name
  description: string           // Short description
  apy: string                   // Annual percentage yield
  tvl: string                   // Total value locked
  risk: "LOW" | "MEDIUM" | "HIGH"
}
```

**Chart Data Pattern:**
```tsx
const chartData = [
  { date: "2024-01-01", value: 10000 },
  // ...
]
```

### 6. Responsive Patterns
**Common Breakpoint Usage:**
```tsx
// Mobile-first approach
<div className="
  flex flex-col          // Mobile: stack vertically
  sm:flex-row           // 640px+: horizontal
  md:grid md:grid-cols-2 // 768px+: grid layout
  lg:grid-cols-3         // 1024px+: 3 columns
">
```

**Conditional Rendering:**
```tsx
// Mobile only
<div className="md:hidden">
  <BottomNavigation />
</div>

// Desktop only
<div className="hidden md:block">
  <Navigation />
</div>
```

### 7. Accessibility Patterns
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`
- ARIA labels on interactive elements
- Keyboard navigation (Radix UI handles this)
- Focus indicators via Tailwind utilities
- Screen reader-friendly table layouts

---

## Authentication & Authorization

### Current State: **NOT IMPLEMENTED**

**Wallet Connection:**
- UI shows "WALLET NOT CONNECTED" badge in navigation
- No actual Web3 wallet integration
- Buy/Sell buttons are non-functional
- All user data is placeholder ($0.00 balances)

**Future Implementation (Implied):**
- MetaMask/WalletConnect integration
- Web3 wallet authentication (non-custodial: "Your keys, your crypto")
- Smart contract interactions for deposits/withdrawals
- On-chain position tracking
- Wallet-gated features (dashboard, trading)

**Access Control:**
- Currently no protected routes
- All pages publicly accessible
- Future: Wallet connection required for /dashboard and /app/strategy/[id] actions

---

## Notable Technical Aspects

### 1. v0.app Integration
**Auto-Generated Codebase:**
- Project syncs with v0.app (Vercel's AI design tool)
- Code is auto-generated and pushed from v0.app
- High-quality, production-ready component output
- Integrated Vercel deployment pipeline

**Implications for Development:**
- Some code may be regenerated/overwritten by v0.app syncs
- Manual edits should be made carefully
- Consider v0.app as the source of truth for design

### 2. Content-Rich Documentation
**Unusual for DeFi Prototypes:**
- Academic-quality backtesting reports (`/info/lending-markets`)
- Comprehensive business plan (`/info/private-markets`)
- Detailed technical roadmaps (`/info/polymarket-options`)
- Multilingual content (Spanish in HF2 page)

**Purpose:**
- Demonstrates team's analytical capabilities
- Provides investor/partner with detailed strategy understanding
- Educational resource for users

### 3. Multi-Strategy Architecture
**Three Distinct Investment Approaches:**

1. **Lending Markets (HF1):** Conservative, arbitrage-focused
2. **Polymarket Options (HF2):** Derivatives, medium risk
3. **Private Markets (HF3):** Tokenized equity, high risk

**Technical Implications:**
- Each strategy has unique data requirements
- Separate backtesting methodologies
- Different smart contract needs
- Varied regulatory considerations

### 4. Brutalist Design Philosophy
**Distinctive Visual Approach:**
- Stark borders and high contrast
- Zero rounded corners (`--radius: 0rem`)
- Monospace typography for technical aesthetic
- Grid-based, geometric layouts
- Minimal use of color (black/white + green accent)

**Why This Matters:**
- Strong brand identity
- Appeals to technical/crypto-native audience
- Differentiates from typical glossy DeFi UIs
- Emphasizes transparency and no-nonsense approach

### 5. Mobile-First Implementation
**Strong Mobile Experience:**
- Bottom navigation (sticky footer nav) for mobile
- Responsive table → card transformations
- Touch-optimized interactions (carousels, collapsible sections)
- Horizontal scroll patterns for wide content

**Code Examples:**
```tsx
// Bottom navigation (mobile only)
app/components/bottom-navigation.tsx

// Responsive transformations
<div className="md:hidden">
  {/* Mobile cards */}
</div>
<div className="hidden md:block">
  {/* Desktop table */}
</div>
```

---

## Current Limitations & Technical Debt

### Prototype Limitations
1. **No Backend:** All data is static/hardcoded in components
2. **No Web3 Integration:** Wallet connection is UI-only
3. **No Authentication:** All routes publicly accessible
4. **Placeholder Data:** Financial data is demo/example only
5. **Non-Functional Actions:** Buy/Sell/CSV download buttons don't work

### Build Configuration
**Relaxed Validation (intentional for prototyping):**
```javascript
// next.config.mjs
eslint: { ignoreDuringBuilds: true }
typescript: { ignoreBuildErrors: true }
```

**Implications:**
- TypeScript errors may exist in codebase
- ESLint warnings are suppressed
- Production build would need stricter validation

### Missing Infrastructure
1. **Testing:** No Jest, Vitest, Cypress, or Playwright setup
2. **Error Handling:** Minimal error boundaries or fallbacks
3. **API Layer:** No API client (Axios, SWR, React Query)
4. **State Management:** No global state for complex interactions
5. **Environment Variables:** No .env configuration

### Performance Considerations
```javascript
// next.config.mjs
images: { unoptimized: true }
```
- Image optimization disabled (larger bundle sizes)
- No caching strategy implemented
- No CDN configuration beyond Vercel defaults

### Security Considerations
- No input validation on forms (Zod schemas defined but not enforced)
- No rate limiting or abuse prevention
- No Content Security Policy headers
- No API authentication/authorization

---

## Development Workflow

### Getting Started
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
# Opens on http://localhost:3000

# Build for production
pnpm build

# Start production server
pnpm start
```

### Adding Components
**Using shadcn/ui CLI:**
```bash
npx shadcn@latest add [component-name]
# Adds component to components/ui/
```

**Available components:** button, card, dialog, dropdown-menu, input, label, select, table, tabs, etc. (40+ Radix UI components)

### Modifying Styles
**Global Styles:**
- Edit `app/globals.css` for theme variables
- Tailwind v4 uses inline `@theme` configuration

**Component Styles:**
- Use Tailwind utility classes
- Use `cn()` helper for conditional classes
- Avoid custom CSS files (prefer Tailwind utilities)

### Adding Pages
**App Router Convention:**
```
app/
└── new-page/
    └── page.tsx         # Becomes /new-page

app/
└── dynamic/
    └── [id]/
        └── page.tsx     # Becomes /dynamic/:id
```

### Data Fetching (Future)
**Recommended Approach for Production:**
```tsx
// Server Component (default)
async function Page() {
  const data = await fetch('...', { cache: 'no-store' })
  return <Component data={data} />
}

// Client Component (for interactivity)
"use client"
function ClientComponent() {
  const { data } = useSWR('/api/...', fetcher)
  return <Component data={data} />
}
```

---

## Dependencies Reference

### Production Dependencies (Partial List)

**UI Framework:**
- `next@16.0.0` - React framework
- `react@19.2.0`, `react-dom@19.2.0` - React library

**UI Components:**
- `@radix-ui/*` - 40+ accessible component primitives
- `lucide-react` - Icon library
- `recharts` - Charting
- `embla-carousel-react` - Carousels

**Forms & Validation:**
- `react-hook-form@7.60.0` - Form state
- `zod@3.25.76` - Schema validation
- `@hookform/resolvers` - RHF + Zod integration

**Styling:**
- `tailwindcss@4.1.9` - Utility-first CSS
- `class-variance-authority` - Variant utilities
- `clsx`, `tailwind-merge` - Class merging

**Theming:**
- `next-themes` - Dark/light mode

**Utilities:**
- `date-fns` - Date manipulation
- `sonner` - Toast notifications
- `vaul` - Drawers
- `cmdk` - Command menu

**Analytics:**
- `@vercel/analytics` - Usage tracking

### Development Dependencies
- `typescript@5.x` - Type checking
- `@types/*` - Type definitions
- `postcss` - CSS processing
- `eslint` - Linting (currently disabled)

### Notable Absences (Future Needs)
- No state management: Redux, Zustand, Jotai
- No API client: Axios, SWR, React Query, tRPC
- No Web3: ethers.js, wagmi, web3.js, viem
- No authentication: NextAuth.js, Supabase Auth
- No testing: Jest, Vitest, Cypress, Playwright
- No database ORM: Prisma, Drizzle

---

## Roadmap & Future Development

### Phase 1: Current State ✅
**Status:** Completed

- Static prototype with demo data
- Visual design and UX flow established
- Information architecture defined
- Mobile-responsive interface
- Comprehensive documentation pages

### Phase 2: Backend Integration
**Status:** Planned

**Goals:**
- Build Next.js API routes or separate backend service
- Integrate PostgreSQL database (mentioned: Supabase)
- Implement real-time DeFi data feeds (Aave, Deribit APIs)
- Create strategy data management system
- Add user authentication (wallet-based)

**Technical Requirements:**
- Database schema for users, strategies, positions, transactions
- API endpoints for strategy data, portfolio info, transaction history
- WebSocket connections for real-time price updates
- Caching layer (Redis) for performance

### Phase 3: Web3 Integration
**Status:** Future

**Goals:**
- Implement wallet connection (MetaMask, WalletConnect, Coinbase Wallet)
- Smart contract development for each strategy
- On-chain transaction handling (deposits, withdrawals, trades)
- Position tracking on blockchain
- Gas estimation and optimization

**Technical Requirements:**
- ethers.js or viem for Web3 interactions
- wagmi for React hooks
- Smart contracts (Solidity)
- Multi-chain support (Ethereum, Polygon, Arbitrum)
- Transaction monitoring and error handling

### Phase 4: Advanced Features
**Status:** Future

**Goals:**
- Live arbitrage execution (Lending Markets strategy)
- Automated portfolio rebalancing
- Real-time compliance monitoring (AI-driven for Private Markets)
- Secondary market for tokenized equity
- Advanced analytics dashboard
- Multi-signature wallet support for security

**Technical Requirements:**
- Job scheduling (cron jobs, Bull queues)
- Machine learning models for compliance
- Order matching engine for secondary market
- Advanced charting (TradingView integration)
- Multi-sig wallet contracts

### Phase 5: Production Hardening
**Status:** Future

**Goals:**
- Comprehensive testing (unit, integration, E2E)
- Security audits (smart contracts, web application)
- Performance optimization (CDN, caching, code splitting)
- Error monitoring (Sentry)
- Rate limiting and DDoS protection
- Legal compliance (KYC/AML for Private Markets)

**Technical Requirements:**
- Testing frameworks (Jest, Vitest, Playwright)
- Security tools (OpenZeppelin, Slither for smart contracts)
- Monitoring (Datadog, New Relic, or similar)
- CDN configuration (Cloudflare)
- Legal/compliance infrastructure

---

## Common Development Tasks

### Task: Add a New Strategy
**Steps:**
1. Add strategy data to `/app/app/page.tsx` strategies array
2. Create strategy detail page in `/app/app/strategy/[id]/page.tsx` (or reuse existing dynamic route)
3. Add backtesting documentation in `/app/info/new-strategy/page.tsx`
4. Update FAQ in `/app/info/page.tsx`
5. Update navigation if needed

**Files to Modify:**
- `app/app/page.tsx` (strategy card)
- `app/app/strategy/[id]/page.tsx` (strategy logic)
- `app/info/page.tsx` (add link)
- Create `app/info/new-strategy/page.tsx`

### Task: Modify Theme Colors
**Steps:**
1. Edit `app/globals.css`
2. Update CSS variables in `@theme` block or custom CSS
3. Test in both light and dark modes

**Example:**
```css
/* app/globals.css */
@theme {
  --color-accent: oklch(0.70 0.20 270);  /* Change to purple */
}
```

### Task: Add a New UI Component
**Steps:**
1. Use shadcn CLI: `npx shadcn@latest add [component-name]`
2. Component added to `components/ui/`
3. Import and use in pages/components
4. Customize styling if needed (edit component file)

### Task: Create a New Page
**Steps:**
1. Create folder in `app/` directory
2. Add `page.tsx` file
3. Export default component
4. Update navigation component if needed

**Example:**
```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <main className="container mx-auto p-6">
      <h1>About</h1>
    </main>
  )
}
```

### Task: Add Chart to Existing Page
**Steps:**
1. Import Recharts components
2. Create data array
3. Add ResponsiveContainer with chart
4. Style with Tailwind classes

**Example:**
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { date: '2024-01-01', value: 100 },
  // ...
]

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" />
  </LineChart>
</ResponsiveContainer>
```

### Task: Implement Wallet Connection (Future)
**Recommended Approach:**
1. Install Web3 libraries: `pnpm add wagmi viem @tanstack/react-query`
2. Create WagmiConfig provider
3. Add ConnectButton component
4. Use `useAccount`, `useConnect`, `useDisconnect` hooks
5. Update navigation to show connected wallet
6. Protect routes/actions based on connection state

### Task: Fetch Data from API (Future)
**Recommended Approach:**
1. Create API route in `app/api/` directory
2. Use `fetch` in Server Component or SWR in Client Component
3. Handle loading and error states
4. Cache responses appropriately

**Example API Route:**
```tsx
// app/api/strategies/route.ts
export async function GET() {
  const strategies = await db.strategies.findMany()
  return Response.json(strategies)
}
```

**Example Data Fetching:**
```tsx
// Server Component
async function Page() {
  const res = await fetch('http://localhost:3000/api/strategies', {
    cache: 'no-store'
  })
  const strategies = await res.json()
  return <StrategyList strategies={strategies} />
}
```

---

## Troubleshooting

### Common Issues

**Issue: Styles Not Applying**
- Check Tailwind v4 syntax (different from v3)
- Verify `globals.css` is imported in `app/layout.tsx`
- Clear `.next` cache: `rm -rf .next && pnpm dev`

**Issue: Component Not Found**
- Check path alias: `@/` should resolve to root
- Verify import statement matches export (default vs named)
- Ensure file extension is correct (`.tsx` vs `.ts`)

**Issue: Theme Not Switching**
- Check ThemeProvider wraps application in `app/layout.tsx`
- Verify localStorage is available (not in SSR context)
- Check `.dark` class is being applied to `<html>` element

**Issue: TypeScript Errors**
- Build errors are currently ignored (`ignoreBuildErrors: true`)
- For development, check `tsconfig.json` paths
- Ensure types are installed: `pnpm add -D @types/node @types/react`

**Issue: Hydration Errors**
- Check for server/client mismatches (e.g., `Date.now()` on server)
- Ensure client components have `"use client"` directive
- Verify no `window` or `document` usage in Server Components

**Issue: Icons Not Displaying**
- Check Lucide React import: `import { IconName } from "lucide-react"`
- Verify icon name is correct (PascalCase)
- Check icon size classes: `h-4 w-4` or similar

### Development Tips

1. **Hot Reload Issues:** Restart dev server if changes don't reflect
2. **Cache Issues:** Delete `.next` folder and restart
3. **Port Conflicts:** Change port with `pnpm dev -p 3001`
4. **Path Alias Issues:** Restart TypeScript server in IDE
5. **Styling Issues:** Use browser DevTools to inspect applied classes

---

## Key Files Reference

### Critical Files (Modify with Care)
- `app/layout.tsx` - Root layout, providers, metadata
- `app/globals.css` - Theme variables, global styles
- `next.config.mjs` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `components.json` - shadcn/ui configuration

### Navigation Components
- `components/navigation.tsx` - Desktop header (logo, links, theme toggle)
- `components/bottom-navigation.tsx` - Mobile bottom nav (Home, App, Dashboard, Info)

### Chart Components
- `components/portfolio-chart.tsx` - Dashboard portfolio performance chart
- `components/equity-curve-chart.tsx` - Strategy equity curve visualization

### Utility Files
- `lib/utils.ts` - Contains `cn()` helper for className merging
- Uses `clsx` and `tailwind-merge` for intelligent class combination

### Page Entry Points
- `app/page.tsx` - Landing page (marketing site)
- `app/app/page.tsx` - Strategy listing
- `app/app/strategy/[id]/page.tsx` - Strategy details (dynamic route)
- `app/dashboard/page.tsx` - User portfolio dashboard
- `app/info/page.tsx` - Info hub with FAQ
- `app/info/lending-markets/page.tsx` - HF1 backtesting results
- `app/info/polymarket-options/page.tsx` - HF2 strategy documentation
- `app/info/private-markets/page.tsx` - HF3 business plan

---

## Design Principles

### When Working on This Codebase

1. **Maintain Brutalist Aesthetic**
   - Always use `border-2 border-foreground` for borders
   - Avoid rounded corners (`rounded-none` or omit `rounded-*`)
   - Prefer high contrast over subtle gradients
   - Use monospace fonts (Space Mono) for headings
   - Keep layouts grid-based and geometric

2. **Mobile-First Development**
   - Start with mobile layout (default styles)
   - Add responsive utilities (`sm:`, `md:`, `lg:`) progressively
   - Test on mobile viewport first
   - Ensure touch targets are at least 44x44px

3. **Accessibility First**
   - Use semantic HTML elements
   - Add ARIA labels where needed
   - Ensure keyboard navigation works
   - Test with screen readers if possible
   - Maintain sufficient color contrast

4. **Component Reusability**
   - Extract repeated UI patterns into components
   - Use shadcn/ui components as base
   - Keep components small and focused
   - Use TypeScript interfaces for props

5. **Performance Considerations**
   - Prefer Server Components over Client Components
   - Only use `"use client"` when necessary (interactivity, hooks)
   - Lazy load heavy components if needed
   - Optimize images when image optimization is re-enabled

6. **Code Quality**
   - Use TypeScript strictly (no `any` types unless necessary)
   - Follow existing naming conventions
   - Keep files focused (single responsibility)
   - Add comments for complex logic
   - Use `cn()` helper for className merging

---

## Resources & Documentation

### Internal Documentation
- This file: `Claude.md` - Comprehensive codebase guide
- `README.md` - Project overview (if exists)
- `/app/info/*` - Strategy documentation pages
- Component files - Inline comments

### External Documentation
- **Next.js 16:** https://nextjs.org/docs
- **React 19:** https://react.dev
- **Tailwind CSS v4:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Radix UI:** https://www.radix-ui.com
- **Recharts:** https://recharts.org
- **React Hook Form:** https://react-hook-form.com
- **Zod:** https://zod.dev

### Useful Commands
```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint (currently disabled)

# shadcn/ui
npx shadcn@latest add [component]  # Add component
npx shadcn@latest add --all        # Add all components

# Package Management
pnpm add [package]               # Add dependency
pnpm add -D [package]            # Add dev dependency
pnpm remove [package]            # Remove dependency
pnpm update                      # Update all dependencies
```

---

## Summary

**OA Capital v0-oak** is a well-architected DeFi investment platform prototype built with cutting-edge technologies (Next.js 16, React 19, Tailwind v4). The codebase demonstrates strong software engineering practices, thoughtful UX design, and comprehensive documentation.

### Key Strengths
- **Clean Architecture:** Well-organized file structure with clear separation of concerns
- **Modern Stack:** Latest versions of Next.js, React, and Tailwind CSS
- **Responsive Design:** Mobile-first approach with excellent mobile/desktop experiences
- **Accessibility:** Semantic HTML and Radix UI for accessible components
- **Design System:** Consistent brutalist aesthetic with reusable patterns
- **Comprehensive Documentation:** Detailed strategy backtests and business plans

### Current Limitations
- **Prototype Stage:** No backend, no Web3 integration, static data only
- **Relaxed Validation:** Build errors and linting disabled for rapid prototyping
- **Missing Infrastructure:** No testing, error handling, or security measures

### Next Steps for Production
1. **Backend Development:** Build API layer, database integration, real-time data feeds
2. **Web3 Integration:** Wallet connection, smart contracts, on-chain transactions
3. **Testing & Security:** Unit tests, E2E tests, security audits
4. **Performance Optimization:** Enable image optimization, caching, CDN
5. **Production Hardening:** Error monitoring, rate limiting, compliance infrastructure

### For AI Assistants (Claude)
When working on this codebase:
- **Respect the brutalist design** - maintain sharp corners, heavy borders, high contrast
- **Use existing components** - leverage shadcn/ui and custom components
- **Follow TypeScript strictly** - maintain type safety
- **Keep mobile-first** - always consider responsive design
- **Document thoroughly** - add comments for complex logic
- **Test both themes** - verify light and dark mode
- **Reference this file** - consult Claude.md for architectural decisions

---

**Last Updated:** 2025-11-04
**Version:** 1.0.0
**Maintained By:** Development Team
