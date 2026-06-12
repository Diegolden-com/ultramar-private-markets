import { JsonLd } from "@/components/json-ld";
import { HookathonScenarioSimulator } from "@/components/hookathon-scenario-simulator";
import { deals, formatCurrency } from "@/lib/deals";
import {
  ArrowRight,
  BadgeCheck,
  CircleDollarSign,
  DatabaseZap,
  ExternalLink,
  FileCheck2,
  FileText,
  GitBranch,
  Languages,
  LockKeyhole,
  PlayCircle,
  Route,
  ShieldCheck,
  Terminal,
  Timer,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";

const path = "/hookathon/port-of-call";
const description =
  "Ultramar Port of Call is a Uniswap v4 Hookathon demo for investment ports, capital-route intake, debt covenant previews, and custom-accounting equity settlement.";
const featuredDeal = deals.find((deal) => deal.ticker === "lcx") ?? deals[0];
const featuredRaise = featuredDeal.capitalRaise;
const targetRaise = featuredRaise?.targetRaise ?? featuredDeal.valuation;
const focusVisibleClass =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-signal";

export const metadata = createSeoMetadata({
  title: "Port of Call Hookathon Demo",
  description,
  path,
  image: seoImages.privateEquities,
  noIndex: true,
  keywords: [
    "Uniswap v4 hooks",
    "Uniswap v4 custom accounting",
    "Hookathon",
    "investment ports",
    "capital route intake",
    "debt covenants",
    "capital windows",
    "permissioned liquidity",
    "RWA liquidity",
  ],
});

const passportChecks = [
  ["KYC/KYB", "Verified investor identity and entity profile"],
  ["Jurisdiction", "Investor route allowed for the sandbox window"],
  ["NDA", "Diligence room access accepted"],
  ["Allocation", "Window-specific authorization prepared"],
  ["Transfer policy", "Restricted-token recipient approved"],
] as const;

const hookControls = [
  {
    icon: Route,
    label: "Route",
    value: "CapitalWindowRouter only",
    body: "Generic public paths do not become the compliance boundary.",
  },
  {
    icon: BadgeCheck,
    label: "Passport",
    value: "Signed hookData",
    body: "Window id, investor, min output, deadline, nonce, and authorizer signature travel into `beforeSwap`.",
  },
  {
    icon: DatabaseZap,
    label: "Oracle",
    value: "Fresh proof required",
    body: "Issuer status gates availability without silently repricing the asset.",
  },
  {
    icon: CircleDollarSign,
    label: "Accounting",
    value: "Return delta curve",
    body: "Custom accounting consumes exact input and returns window-priced sandbox restricted issuer-token output.",
  },
] as const;

const hookDecisionRows = [
  {
    icon: Route,
    label: "Router-bound passport",
    decision: "Authorization is signed for CapitalWindowRouter, not any public v4 path.",
    reason: "The route is part of the market boundary; a valid investor stamp should not become a generic swap credential.",
    proof: "Generic router reverts before a custom delta is returned.",
  },
  {
    icon: ShieldCheck,
    label: "beforeSwap gate",
    decision: "Eligibility, cap, nonce, deadline, token direction, timing, and proof freshness are checked before settlement.",
    reason: "Private-market failures should reject before inventory, cash, or accounting state changes.",
    proof: "Missing passport, replay, stale oracle, expired authorization, and min-output paths all fail.",
  },
  {
    icon: DatabaseZap,
    label: "Return delta accounting",
    decision: "beforeSwapReturnDelta returns window-priced sandbox restricted LCX output for the equity route.",
    reason: "The hook enforces reviewed terms; it does not pretend a private round is continuous AMM price discovery.",
    proof: "testWindowStepCurveQuotesExactPricingExample proves the 1.0312 effective quote.",
  },
] as const;



const readinessPillars = [
  {
    icon: DatabaseZap,
    label: "Operating upgrade",
    title: "Administration becomes alpha.",
  },
  {
    icon: FileCheck2,
    label: "Verified proof",
    title: "Private data becomes disclosure-minimized claims.",
  },
  {
    icon: CircleDollarSign,
    label: "Capital route",
    title: "Debt or equity can open a route.",
  },
] as const;

const investmentPortRails = [
  ["Data layer", "Operating KPIs, financial ratios, reporting freshness"],
  ["Proof privacy", "Disclosure-minimized claims: freshness, coverage, covenant status"],
  ["Instrument layer", "Equity, debt, secondary transfer, or convertible terms"],
  ["Access layer", "Investor eligibility, accreditation, limits, and disclosures"],
  ["Settlement layer", "Uniswap v4 hook with custom accounting and route controls"],
] as const;

type OperatingReadinessSignal = {
  work: string;
  signal: string;
  threshold: string;
  route: string;
  status: string;
  score: number;
};

const operatingReadinessRows: OperatingReadinessSignal[] = [
  {
    work: "Admin control",
    signal: "Daily close ready",
    threshold: "Cash, utilization, route collections, and ticket mix reconciled.",
    route: "Issuer proof",
    status: "Fresh",
    score: 92,
  },
  {
    work: "Omnichannel margin",
    signal: "+6.8 pp target",
    threshold: "Pickup and delivery density can defend better unit economics.",
    route: "Equity window",
    status: "Open",
    score: 78,
  },
  {
    work: "Current asset coverage",
    signal: "1.62x",
    threshold: "Current assets cover short-term debt above the 1.50x covenant.",
    route: "Debt preview",
    status: "Green",
    score: 81,
  },
  {
    work: "Reporting freshness",
    signal: "18 min",
    threshold: "Operating proof is inside the active-window freshness limit.",
    route: "Hook access",
    status: "Allowed",
    score: 94,
  },
];

const demoTrace = [
  ["01", "Investor opens Mexico City port", "Translated diligence and operator context load before any transaction surface."],
  ["02", "Passport stamp is attached", "`hookData` carries the investor, window, minimum output, deadline, nonce, and signature."],
  ["03", "Router settles exact input", "Demo USDC is pre-settled into the v4 `PoolManager` through the narrow gated router."],
  ["04", "Hook consumes the window", "`beforeSwap` verifies eligibility, caps, window timing, oracle freshness, and token direction."],
  ["05", "Custom delta returns restricted LCX", "The hook bypasses public AMM price discovery and outputs the window-priced restricted token."],
] as const;

const rejectionRows = [
  ["Ineligible wallet", "InvestorNotEligible", "No passport stamp for this window"],
  ["Expired deadline", "AuthorizationExpired", "Signature cannot be replayed after the permitted time"],
  ["Stale issuer proof", "StaleOracle", "Accounting proof is too old for the window"],
  ["Exact-output attempt", "ExactInputOnly", "Window settlement accepts deterministic exact input only"],
] as const;

const proofCommands = [
  {
    label: "Local gate",
    command: "corepack yarn hookathon:check",
    result: "App lint, typecheck, production build, 27 contract tests, and one approved settlement plus six blocked paths.",
  },
  {
    label: "Base Sepolia dry-run",
    command: "corepack yarn hookathon:testnet:e2e",
    result: "Official v4 PoolManager, mined hook address, sandbox restricted LCX / demo USDC pool init, window creation, and one approved smoke swap.",
  },
] as const;

const proofMarkers = [
  ["Local settlement", "1500.00 demo USDC -> 1454.54 sandbox restricted LCX"],
  ["Blocked paths", "missing passport / generic router / expired / min output / replay / stale oracle"],
  ["Mined hook", "0xf4e79FfC08cf1c4325DDCD1d1f38e10E37900a88"],
  ["Smoke delta", "-1500e18 demo USDC / +1454.54e18 restricted LCX"],
] as const;

const judgePacketLinks = [
  {
    icon: PlayCircle,
    label: "Demo video",
    href: "https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm",
    body: "Captioned review cut with approved path, rejected paths, and pricing proof.",
  },
  {
    icon: Terminal,
    label: "Base Sepolia proof",
    href: "https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/testnet-dry-run-latest.md",
    body: "Non-broadcast dry-run with official PoolManager, 0xa88 hook mask, and smoke swap quote.",
  },
  {
    icon: FileText,
    label: "Winning scorecard",
    href: "https://github.com/Diegolden-com/ultramar-private-markets/blob/codex/landing-wave-route-ui/docs/HOOKATHON_WINNING_SCORECARD.md",
    body: "One-page rubric map for uniqueness, functionality, v4 relevance, pricing, and safety.",
  },
  {
    icon: GitBranch,
    label: "Source branch",
    href: "https://github.com/Diegolden-com/ultramar-private-markets/tree/codex/landing-wave-route-ui",
    body: "Hook, router, registry, tests, proof scripts, public deck source, and Tally packet.",
  },
] as const;

const pricingSignals = [
  ["Default stance", "Fixed price active window"],
  ["Demo stress test", "Step curve optionality"],
  ["Curve job", "Split exact input across disclosed tranches"],
  ["Hard invariant", "Filled orders are never repriced"],
] as const;

const stepCurveRows = [
  ["Price rule", "1,000 demo USDC at 1.00, then next tranche at 1.10"],
  ["Best use", "Oversubscribed windows or explicit tranche incentives"],
  ["Hook job", "Split one exact-input order across disclosed price shelves"],
  ["Demo quote", "1,500 demo USDC -> 1,454.54 sandbox restricted LCX, effective 1.0312"],
] as const;

const timelineNodes = [
  { icon: BadgeCheck, label: "Market signal", step: "01" },
  { icon: DatabaseZap, label: "Admin proof", step: "02" },
  { icon: Route, label: "Capital route", step: "03" },
  { icon: Terminal, label: "v4 hook", step: "04" },
  { icon: Timer, label: "Audit trail", step: "05" },
] as const;

export default function PortOfCallHookathonPage() {
  return (
    <main id="main-content" className="overflow-x-hidden bg-surface-ink text-on-surface">
      <JsonLd
        id="port-of-call-hookathon-json-ld"
        data={[
          webPageJsonLd({
            path,
            name: "Ultramar Port of Call Hookathon Demo",
            description,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Hookathon", path: "/hookathon" },
            { name: "Port of Call", path },
          ]),
        ]}
      />

      {/* HERO */}
      <section className="relative min-w-0 min-h-[calc(100vh-96px)] overflow-hidden border-b border-border-muted bg-surface">
        <div className="terminal-grid-2d absolute inset-0 opacity-50" />
        <div className="hatch-pattern-blue absolute inset-x-0 top-0 h-24 opacity-20" />
        <div className="relative z-10 grid min-w-0 min-h-[calc(100vh-96px)] gap-1 bg-border-muted lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex min-w-0 flex-col justify-between bg-surface p-5 md:p-8 xl:p-10">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-outline badge-success font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
                  Uniswap v4 Hookathon
                </span>
                <span className="badge badge-outline border-border-muted bg-surface-ink font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                  Sandbox / non-offer
                </span>
              </div>
              <h1 className="mt-5 max-w-5xl break-words font-serif text-4xl font-bold leading-[1.02] text-on-surface [overflow-wrap:anywhere] md:text-6xl xl:text-7xl">
                Port of Call turns operating businesses into v4 investment ports.
              </h1>
              <p className="mt-4 max-w-3xl font-mono text-lg font-semibold tracking-wide text-on-surface-variant md:text-xl">
                The hook is the market boundary.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 rounded border border-status-signal/40 bg-status-signal/10 px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Passport gated
                </span>
                <span className="inline-flex items-center gap-1.5 rounded border border-status-signal/40 bg-status-signal/10 px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                  <Route className="h-3.5 w-3.5" aria-hidden="true" />
                  Router-bound
                </span>
                <span className="inline-flex items-center gap-1.5 rounded border border-status-signal/40 bg-status-signal/10 px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                  <CircleDollarSign className="h-3.5 w-3.5" aria-hidden="true" />
                  Custom delta
                </span>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#demo-app"
                  className={`btn btn-outline btn-success justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em] sm:min-w-52 ${focusVisibleClass}`}
                >
                  Open demo app
                  <PlayCircle className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/hookathon/port-of-call/deck"
                  className={`btn btn-ghost justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant hover:text-primary sm:min-w-52 ${focusVisibleClass}`}
                >
                  Open pitch deck
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="mt-10 hidden gap-1 bg-border-muted md:grid md:grid-cols-3">
              <HeroStat label="Demo asset" value={featuredDeal.name} body={featuredDeal.location} />
              <HeroStat label="Port target" value={formatCurrency(targetRaise)} body="Sandbox route context" />
              <HeroStat label="Hook stance" value="Route-gated" body="Investment-port rules" />
            </div>
          </div>

          <div className="grid min-w-0 bg-surface-ink lg:grid-rows-[1fr_auto]">
            <div className="relative min-h-[360px] overflow-hidden">
              <Image
                src="/solarpunk-laundromat.png"
                alt="Lavanderias CX representative operating asset"
                fill
                priority
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="image-blackwork object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-ink via-surface-ink/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                  Mexico City port
                </p>
                <h2 className="mt-2 font-serif text-4xl font-semibold leading-tight text-on-surface">
                  {featuredDeal.name}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-on-surface-variant">
                  {featuredRaise?.summary ??
                    "Representative local operating business used for a controlled v4 investment-port demo."}
                </p>
              </div>
            </div>

            <div className="grid gap-1 border-t border-border-muted bg-border-muted md:grid-cols-3">
              <SignalCell label="Input" value="demo USDC" />
              <SignalCell label="Route output" value="restricted LCX or gate" />
              <SignalCell label="Pool behavior" value="Custom delta" />
            </div>
          </div>
        </div>
      </section>

      {/* TRAVEL FEED — removed for video pacing. See commit history for the original 3-port-card section */}

      {/* MARKET READINESS */}
      <section className="grid min-w-0 gap-1 border-b border-border-muted bg-border-muted xl:grid-cols-[0.86fr_1.14fr]">
        <div className="min-w-0 bg-surface-paper p-5 text-surface-ink md:p-8">
          <DatabaseZap className="h-5 w-5" aria-hidden="true" />
          <p className="mt-8 font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
            Market readiness
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight md:text-5xl">
            The market pays for administration that can absorb capital.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-surface-container">
            The Walmart lesson is not a multiple. It is a market signal: valuation follows operating
            systems, not just industry labels. Ultramar applies that lesson to private companies that
            are too real to be memes and too small to be public.
          </p>
        </div>

        <div className="grid min-w-0 gap-1 bg-border-muted lg:grid-cols-3">
          {readinessPillars.map((item) => (
            <article key={item.label} className="min-w-0 bg-surface p-5 md:p-6">
              <item.icon className="h-5 w-5 text-status-signal" aria-hidden="true" />
              <p className="mt-6 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                {item.label}
              </p>
              <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-on-surface">
                {item.title}
              </h3>
            </article>
          ))}
          <div className="min-w-0 bg-surface-paper p-5 text-surface-ink md:col-span-3 md:p-6">
            <div className="grid min-w-0 gap-4 lg:grid-cols-[0.62fr_1.38fr]">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-container">
                  Operating work -&gt; market route
                </p>
                <h3 className="mt-3 max-w-xl font-serif text-3xl font-semibold leading-tight md:text-4xl">
                  Admin work becomes underwriting evidence.
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-6 text-surface-container">
                  The port is not asking the market to believe a story. It converts better operations
                  into route-specific claims a hook can check before equity or debt access opens.
                </p>
              </div>
              <div className="grid min-w-0 gap-1 bg-surface-container/20">
                {operatingReadinessRows.map((item) => (
                  <OperatingReadinessRow key={item.work} item={item} />
                ))}
              </div>
            </div>
          </div>
          <div className="min-w-0 bg-surface-ink p-5 text-on-surface md:col-span-3 md:p-6">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
              Investment port stack
            </p>
            <div className="mt-5 flex flex-col gap-px overflow-hidden rounded border border-border-muted bg-border-muted">
              {investmentPortRails.map(([label, value]) => (
                <div key={label} className="flex flex-col gap-2 bg-surface-ink px-4 py-3 sm:flex-row sm:items-center sm:gap-6">
                  <p className="min-w-40 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                    {label}
                  </p>
                  <p className="text-sm leading-5 text-on-surface-variant">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT STORYLINE — timeline graphic */}
      <section className="grid min-w-0 gap-1 border-b border-border-muted bg-border-muted xl:grid-cols-[0.74fr_1.26fr]">
        <div className="min-w-0 bg-surface-ink p-5 text-on-surface md:p-8">
          <Route className="h-5 w-5 text-status-signal" aria-hidden="true" />
          <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
            Product storyline
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight text-on-surface md:text-5xl">
            The thesis in one route.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-on-surface-variant">
            Ultramar is not pitching laundries as a meme asset. It is asking whether better
            administration can create underwritable claims, then giving those claims a debt or equity
            route enforced by a v4 hook.
          </p>
          <div className="mt-8 border border-status-signal/40 bg-status-signal/10 p-5">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
              Route formation
            </p>
            <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-on-surface">
              Operating control turns proof into market access.
            </h3>
            <p className="mt-4 text-sm leading-6 text-on-surface-variant">
              In LCX, the administration takeover is not a slogan: daily close, utilization, route
              density, ticket mix, and current asset coverage become proof. The passport selects the
              route; the v4 hook opens or blocks market access.
            </p>
            <p className="mt-4 break-words font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal [overflow-wrap:anywhere]">
              Administration takeover -&gt; issuer/SPV wrapper -&gt; instrument -&gt; route -&gt; v4 hook
            </p>
          </div>
        </div>
        <div className="min-w-0 bg-surface p-5 md:p-8">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
            Capital story
          </p>
          <div className="mt-6">
            <div className="relative">
              <svg
                viewBox="0 0 900 120"
                className="hidden w-full sm:block"
                role="img"
                aria-label="Five-step capital story timeline"
              >
                <line x1="30" y1="40" x2="870" y2="40" stroke="currentColor" className="text-border-muted" strokeWidth="2" strokeDasharray="6 4" />
                {timelineNodes.map((node, i) => {
                  const x = 60 + i * 195;
                  return (
                    <g key={node.step}>
                      <circle cx={x} cy="40" r="14" fill="none" stroke="currentColor" strokeWidth="2" className="text-status-signal" />
                      <circle cx={x} cy="40" r="12" fill="currentColor" className="text-surface" />
                      <text x={x} y="44" textAnchor="middle" fill="currentColor" className="text-status-signal" fontSize="10" fontFamily="monospace" fontWeight="700">
                        {node.step}
                      </text>
                      <text x={x} y="72" textAnchor="middle" fill="currentColor" className="text-on-surface" fontSize="11" fontFamily="monospace" fontWeight="600" letterSpacing="0.08em">
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div className="grid grid-cols-5 gap-2 sm:hidden">
                {timelineNodes.map((node) => (
                  <div key={node.step} className="flex flex-col items-center gap-1 text-center">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-status-signal bg-surface text-[10px] font-bold text-status-signal">
                      {node.step}
                    </span>
                    <node.icon className="mt-1 h-4 w-4 text-status-signal" aria-hidden="true" />
                    <span className="font-mono text-[9px] font-medium uppercase tracking-[0.06em] text-on-surface-variant">
                      {node.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-6 text-sm leading-6 text-on-surface-variant">
            Five beats from market signal to settlement memory. The hook is the inflection point
            where eligibility, route, and terms converge into one programmatic boundary.
          </p>
        </div>
      </section>

      {/* INPUTS TO THE ROUTE */}
      <section className="grid min-w-0 gap-1 border-b border-border-muted bg-border-muted xl:grid-cols-[1.05fr_0.95fr]">
        <div className="grid min-w-0 gap-1 bg-border-muted md:grid-cols-2">
          <div className="min-w-0 bg-surface-paper p-5 text-surface-ink md:p-8">
            <Languages className="h-5 w-5" aria-hidden="true" />
            <p className="mt-8 font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
              Inputs to the route
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight md:text-4xl">
              Guide, passport, and quote arrive before the click.
            </h2>
            <p className="mt-4 text-sm leading-6 text-surface-container">
              Store economics, use of funds, data-room status, and risk notes become a translated
              issuer room. The simulator starts here: understanding first, then route eligibility,
              then settlement.
            </p>
          </div>

          <div className="min-w-0 bg-surface p-5 md:p-8">
            <ShieldCheck className="h-5 w-5 text-status-signal" aria-hidden="true" />
            <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
              Passport stamp
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface md:text-4xl">
              Eligibility becomes signed execution context.
            </h2>
            <div className="mt-8 grid gap-1 bg-border-muted">
              {passportChecks.map(([label, body]) => (
                <div key={label} className="grid grid-cols-[28px_1fr] gap-3 bg-surface-ink p-3">
                  <BadgeCheck className="mt-0.5 h-4 w-4 text-status-signal" aria-hidden="true" />
                  <div>
                    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                      {label}
                    </p>
                    <p className="mt-1 text-sm leading-5 text-on-surface-variant">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0 bg-surface p-5 md:p-8">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
            Demo route fixture
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
            These are the signed sandbox terms the simulator will execute. The quote is a fixture
            for the route proof, not a live offer or public price feed.
          </p>
          <div className="mt-4 grid gap-1 bg-border-muted">
            <QuoteRow label="Output token" value="LCX sandbox restricted issuer token" />
            <QuoteRow label="Exact input" value="1,500 demo USDC" />
            <QuoteRow label="Quote basis" value="Signed sandbox window terms" />
            <QuoteRow label="Step math" value="1,000 demo USDC at 1.00 + 500 at 1.10" />
            <QuoteRow label="Expected output" value="1,454.54 sandbox restricted LCX" />
            <QuoteRow label="Effective price" value="1.0312 demo USDC/restricted LCX" />
            <QuoteRow label="Oracle proof age" value="18 minutes" />
            <QuoteRow label="Boundary" value="Not a public listing or live offer" />
          </div>

          <div className="mt-8 border border-status-signal/40 bg-status-signal/10 p-5">
            <div className="flex items-center gap-3">
              <LockKeyhole className="h-5 w-5 text-status-signal" aria-hidden="true" />
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                Equity path
              </p>
            </div>
            <p className="mt-4 text-sm leading-6 text-on-surface-variant">
              LCX is a sandbox restricted issuer token, not a public trading asset.{" "}
              <span className="break-words">`CapitalWindowRouter.swapExactInput`</span> calls the
              v4 `PoolManager`; the hook consumes the signed demo window and returns a custom
              accounting delta. Oracle proof gates access, not repricing.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/private-equities/assets/lcx"
              className={`btn btn-outline btn-success justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em] sm:min-w-56 ${focusVisibleClass}`}
            >
              Open LCX sandbox profile
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/press/capital-windows-uniswap-v4-custom-accounting"
              className={`btn btn-ghost justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant hover:text-primary sm:min-w-56 ${focusVisibleClass}`}
            >
              Technical article
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/hookathon/port-of-call/deck"
              className={`btn btn-ghost justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant hover:text-primary sm:min-w-56 ${focusVisibleClass}`}
            >
              Pitch deck
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <HookathonScenarioSimulator />

      {/* PRICING POLICY */}
      <section className="grid min-w-0 gap-1 border-b border-border-muted bg-border-muted xl:grid-cols-[0.78fr_1.22fr]">
        <div className="min-w-0 bg-surface-ink p-5 text-on-surface md:p-8">
          <CircleDollarSign className="h-5 w-5 text-status-signal" aria-hidden="true" />
          <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
            Pricing policy
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight text-on-surface md:text-5xl">
            The step curve proves the hook can enforce tranched settlement math.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-on-surface-variant">
            The credible base case is a fixed signed price for an active window. The demo step curve
            exists to prove the hook can split exact input across disclosed tranche terms — not to
            pretend private rounds are continuous AMM price discovery.
          </p>
          <div className="mt-8 grid gap-1 bg-border-muted">
            {pricingSignals.map(([label, value]) => (
              <PricingSignal key={label} label={label} value={value} />
            ))}
          </div>
        </div>

        <div className="min-w-0 bg-border-muted">
          <PricingCurvePanel
            eyebrow="Advanced policy"
            title="Step curve window"
            body="Use this when the signed term sheet says capacity gets more expensive after a threshold. The hook splits an order across boundaries, so the first tranche clears at the base price and later demand pays the premium."
            rows={stepCurveRows}
          />
        </div>
      </section>

      {/* HOOK CONTROLS */}
      <section className="grid min-w-0 gap-1 border-b border-border-muted bg-border-muted lg:grid-cols-4">
        {hookControls.map((item) => (
          <article key={item.label} className="min-w-0 bg-surface p-5 md:p-6">
            <item.icon className="h-5 w-5 text-status-signal" aria-hidden="true" />
            <p className="mt-6 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
              {item.label}
            </p>
            <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight text-on-surface">
              {item.value}
            </h3>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">{item.body}</p>
          </article>
        ))}
      </section>

      {/* HOOK DESIGN DECISIONS */}
      <section className="grid min-w-0 gap-1 border-b border-border-muted bg-border-muted xl:grid-cols-[0.72fr_1.28fr]">
        <div className="min-w-0 bg-surface-paper p-5 text-surface-ink md:p-8">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          <p className="mt-8 font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
            Hook design decisions
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight md:text-5xl">
            The hook is opinionated because private markets are not neutral routing.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-surface-container">
            Each rule exists to keep the port legible: who may enter, which route is open, whether
            proof is fresh, and what settlement math is allowed.
          </p>
        </div>

        <div className="grid min-w-0 gap-1 bg-border-muted md:grid-cols-2 xl:grid-cols-3">
          {hookDecisionRows.map((item) => (
            <article key={item.label} className="min-w-0 bg-surface p-5 md:p-6">
              <item.icon className="h-5 w-5 text-status-signal" aria-hidden="true" />
              <p className="mt-6 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                {item.label}
              </p>
              <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-on-surface">
                {item.decision}
              </h3>
              <p className="mt-4 text-sm leading-6 text-on-surface-variant">{item.reason}</p>
              <div className="mt-5 border-t border-border-muted pt-4">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                  Proof
                </p>
                <p className="mt-2 text-sm leading-5 text-on-surface-variant">{item.proof}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PROTOCOL PROOF */}
      <section className="grid min-w-0 gap-1 border-b border-border-muted bg-border-muted xl:grid-cols-[0.82fr_1.18fr]">
        <div className="min-w-0 bg-surface-ink p-5 text-on-surface md:p-8">
          <Terminal className="h-5 w-5 text-status-signal" aria-hidden="true" />
          <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
            Protocol proof
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight text-on-surface md:text-5xl">
            Two commands prove the product is on real v4 rails.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-on-surface-variant">
            The local gate proves the hook behavior deterministically. The Base Sepolia dry-run uses
            the official v4 `PoolManager` address, mines the hook permission bits, initializes the
            sandbox restricted LCX / demo USDC pool, and executes an approved smoke swap without broadcasting.
          </p>
        </div>

        <div className="grid min-w-0 gap-1 bg-border-muted lg:grid-cols-2">
          {proofCommands.map((item) => (
            <article key={item.label} className="min-w-0 bg-surface p-5 md:p-6">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                {item.label}
              </p>
              <div className="mt-4 border border-border-muted bg-surface-ink p-4">
                <code className="block break-words font-mono text-sm font-semibold leading-6 text-on-surface [overflow-wrap:anywhere]">
                  {item.command}
                </code>
              </div>
              <p className="mt-4 text-sm leading-6 text-on-surface-variant">{item.result}</p>
            </article>
          ))}
          <div className="min-w-0 bg-surface-paper p-5 text-surface-ink md:col-span-2 md:p-6">
            <div className="grid min-w-0 gap-1 bg-surface-container/20 md:grid-cols-4">
              {proofMarkers.map(([label, value]) => (
                <div key={label} className="min-w-0 bg-surface-paper p-4">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
                    {label}
                  </p>
                  <p className="mt-3 break-words font-mono text-sm font-semibold leading-5 text-surface-container [overflow-wrap:anywhere]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-1 grid min-w-0 gap-1 bg-surface-container/20 md:grid-cols-4">
              {judgePacketLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`group min-w-0 bg-surface-paper p-4 text-surface-ink transition hover:bg-surface-ink hover:text-on-surface ${focusVisibleClass}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <ExternalLink className="h-4 w-4 shrink-0 opacity-60 transition group-hover:opacity-100" aria-hidden="true" />
                  </div>
                  <p className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-sm leading-5 text-surface-container transition group-hover:text-on-surface-variant">
                    {item.body}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXECUTION TRACE */}
      <section className="grid min-w-0 gap-1 border-b border-border-muted bg-border-muted xl:grid-cols-[0.9fr_1.1fr]">
        <div className="min-w-0 bg-surface p-5 md:p-8">
          <Timer className="h-5 w-5 text-status-signal" aria-hidden="true" />
          <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
            Execution trace
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface md:text-5xl">
            The hook is the market boundary.
          </h2>
          <p className="mt-4 text-sm leading-6 text-on-surface-variant">
            Run the route twice: one approved path, then one rejected path. The v4 hook is carrying
            real mechanism design, not brand theater.
          </p>
        </div>

        <div className="grid min-w-0 gap-1 bg-border-muted">
          {demoTrace.map(([step, title, body]) => (
            <div key={step} className="grid min-w-0 gap-4 bg-surface p-4 md:grid-cols-[72px_1fr] md:p-5">
              <span className="font-mono text-3xl font-semibold tabular-nums text-status-signal">
                {step}
              </span>
              <div>
                <h3 className="font-serif text-2xl font-semibold leading-tight text-on-surface">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REVERT PROOF + MARKET BOUNDARY */}
      <section className="grid min-w-0 gap-1 bg-border-muted lg:grid-cols-[1fr_1fr]">
        <div className="min-w-0 bg-surface p-5 md:p-8">
          <XCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
          <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-destructive">
            Revert proof
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface md:text-4xl">
            A capital route should fail loudly when context is missing.
          </h2>
          <div className="mt-8 grid gap-1 bg-border-muted">
            {rejectionRows.map(([caseName, errorName, body]) => (
              <div key={caseName} className="grid min-w-0 gap-3 bg-surface-ink p-4 md:grid-cols-[160px_180px_1fr]">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                  {caseName}
                </p>
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-destructive">
                  {errorName}
                </p>
                <p className="text-sm leading-5 text-on-surface-variant">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 bg-surface-paper p-5 text-surface-ink md:p-8">
          <FileCheck2 className="h-5 w-5" aria-hidden="true" />
          <p className="mt-8 font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
            Market boundary
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight md:text-4xl">
            Uniswap v4 can host specialized private-market investment ports.
          </h2>
          <p className="mt-4 text-sm leading-6 text-surface-container">
            The memorable hook is the passport checkpoint. The practical hook turns private-market
            constraints into settlement rules: eligibility, caps, oracle freshness, and custom accounting.
          </p>
          <div className="mt-8 grid gap-1 bg-surface-container/20">
            <PaperRow label="Primary angle" value="Specialized Markets" />
            <PaperRow label="Fair-flow proof" value="Router-bound signed exact input" />
            <PaperRow label="Demo chain target" value="Base Sepolia or Sepolia" />
            <PaperRow label="Production boundary" value="Counsel-gated, audited, and non-public" />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/hookathon/port-of-call/deck"
              className={`btn btn-outline justify-between border-surface-ink font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-surface-ink hover:bg-surface-ink hover:text-on-surface sm:min-w-52 ${focusVisibleClass}`}
            >
              Open pitch deck
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/private-equities/legal"
              className={`btn btn-ghost justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-surface-container hover:text-surface-ink sm:min-w-52 ${focusVisibleClass}`}
            >
              Review legal gate
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Inline components ──────────────────────────────────────────────

function HeroStat({ label, value, body }: { label: string; value: string; body: string }) {
  return (
    <div className="bg-surface-ink p-4">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p className="mt-3 break-words font-serif text-2xl font-semibold leading-tight text-on-surface">
        {value}
      </p>
      <p className="mt-2 text-sm leading-5 text-on-surface-variant">{body}</p>
    </div>
  );
}

function SignalCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface p-4">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p className="mt-2 font-mono text-lg font-semibold text-on-surface">{value}</p>
    </div>
  );
}

function QuoteRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 bg-surface-ink p-4">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p className="text-right font-mono text-sm font-semibold tabular-nums text-on-surface">{value}</p>
    </div>
  );
}

function PricingSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid min-w-0 gap-3 bg-surface p-4 sm:grid-cols-[144px_1fr]">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p className="break-words font-mono text-sm font-semibold text-on-surface">{value}</p>
    </div>
  );
}

function PricingCurvePanel({
  eyebrow,
  title,
  body,
  rows,
}: {
  eyebrow: string;
  title: string;
  body: string;
  rows: readonly (readonly [string, string])[];
}) {
  return (
    <article className="min-w-0 bg-surface-paper p-5 text-surface-ink md:p-6">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-container">
        {eyebrow}
      </p>
      <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight md:text-4xl">{title}</h3>
      <p className="mt-4 text-sm leading-6 text-surface-container">{body}</p>
      <div className="mt-6 border border-surface-container/20 bg-surface-paper">
        <PriceCurveChart />
      </div>
      <div className="mt-5 grid gap-1 bg-surface-container/20">
        {rows.map(([label, value]) => (
          <PaperRow key={label} label={label} value={value} />
        ))}
      </div>
    </article>
  );
}

function PriceCurveChart() {
  return (
    <svg
      viewBox="0 0 376 220"
      role="img"
      aria-labelledby="price-chart-title-step price-chart-desc-step"
      className="block aspect-[376/220] w-full"
    >
      <title id="price-chart-title-step">Step curve price chart</title>
      <desc id="price-chart-desc-step">
        Price stays at 1.00 demo USDC per restricted LCX for the first 1,000 demo USDC, then steps to 1.10 as committed demo USDC crosses the disclosed tranche boundary.
      </desc>
      <rect width="376" height="220" fill="currentColor" className="text-surface-paper" />
      <g stroke="currentColor" className="text-surface-container/20" strokeWidth="1">
        <line x1="44" y1="60" x2="332" y2="60" />
        <line x1="44" y1="91" x2="332" y2="91" />
        <line x1="44" y1="122" x2="332" y2="122" />
        <line x1="44" y1="153" x2="332" y2="153" />
      </g>
      <g stroke="currentColor" className="text-surface-container" strokeWidth="1.5">
        <line x1="44" y1="36" x2="44" y2="164" />
        <line x1="44" y1="164" x2="340" y2="164" />
      </g>
      <g fill="currentColor" className="text-surface-container" fontSize="10" fontFamily="monospace">
        <text x="8" y="95">1.10</text>
        <text x="8" y="126">1.00</text>
        <text x="44" y="188">0</text>
        <text x="124" y="188">1k</text>
        <text x="220" y="188">2k</text>
        <text x="314" y="188">3k</text>
      </g>
      <text
        x="188"
        y="208"
        textAnchor="middle"
        fill="currentColor"
        className="text-surface-container"
        fontSize="10"
        fontFamily="monospace"
      >
        demo USDC committed in window
      </text>
      <text
        x="18"
        y="28"
        fill="currentColor"
        className="text-surface-container"
        fontSize="10"
        fontFamily="monospace"
      >
        demo USDC / restricted LCX
      </text>
      <line
        x1="188"
        y1="38"
        x2="188"
        y2="164"
        stroke="currentColor"
        strokeDasharray="4 5"
        className="text-status-signal"
        strokeWidth="1.5"
      />
      <path
        d="M44 122 H140 V91 H332"
        fill="none"
        stroke="currentColor"
        className="text-status-signal"
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <circle cx="188" cy="91" r="5" fill="currentColor" className="text-status-signal" />
      <g fill="currentColor" fontFamily="monospace" fontSize="10">
        <text x="206" y="82" className="text-surface-ink">
          1,500 demo USDC order
        </text>
        <text x="206" y="98" className="text-surface-container">
          effective 1.0312
        </text>
      </g>
    </svg>
  );
}

function OperatingReadinessRow({ item }: { item: OperatingReadinessSignal }) {
  return (
    <div className="grid min-w-0 gap-3 bg-surface-paper p-4 md:grid-cols-[0.9fr_1.1fr_0.74fr]">
      <div className="min-w-0">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
          {item.work}
        </p>
        <p className="mt-2 break-words font-mono text-sm font-semibold text-surface-ink">
          {item.signal}
        </p>
      </div>
      <div className="min-w-0">
        <p className="text-sm leading-5 text-surface-container">{item.threshold}</p>
        <div className="mt-3 h-2 bg-surface-container/20" aria-hidden="true">
          <div className="h-full bg-status-signal" style={{ width: `${item.score}%` }} />
        </div>
      </div>
      <div className="grid min-w-0 gap-2 sm:grid-cols-2 md:grid-cols-1">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-surface-container">
            Route
          </p>
          <p className="mt-1 break-words font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
            {item.route}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-surface-container">
            State
          </p>
          <p className="mt-1 break-words font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-status-signal">
            {item.status}
          </p>
        </div>
      </div>
    </div>
  );
}

function PaperRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 border-t border-surface-container/20 py-3 first:border-t-0 md:grid-cols-[160px_1fr]">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">{label}</p>
      <p className="text-sm leading-5 text-surface-container">{value}</p>
    </div>
  );
}
