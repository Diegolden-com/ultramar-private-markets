import { JsonLd } from "@/components/json-ld";
import { HookathonScenarioSimulator } from "@/components/hookathon-scenario-simulator";
import { deals, formatCurrency } from "@/lib/deals";
import {
  ArrowRight,
  BadgeCheck,
  CircleDollarSign,
  DatabaseZap,
  FileCheck2,
  Languages,
  LockKeyhole,
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
  "Ultramar Port of Call is a Uniswap v4 Hookathon demo for passport-gated capital windows, Ablo-style private-market discovery, and custom-accounting settlement.";
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
    body: "Custom accounting consumes exact input and returns window-priced company-token output.",
  },
] as const;

const feedPorts = [
  {
    city: "Mexico City",
    asset: "Lavanderias CX",
    status: "Window sandbox",
    metric: formatCurrency(targetRaise),
    body: "Operating-business expansion round with data-room readiness and store-level proof context.",
  },
  {
    city: "Sao Paulo",
    asset: "Nexus Logistics",
    status: "Issuer scouting",
    metric: "Route ops",
    body: "Last-mile operator used as a future port for localized diligence and capital-window intake.",
  },
  {
    city: "Austin",
    asset: "Vertex Realty Core",
    status: "Secondary study",
    metric: "Transfer view",
    body: "Real-estate asset profile kept separate from the LCX sandbox execution path.",
  },
] as const;

const demoTrace = [
  ["01", "Investor opens Mexico City port", "Translated diligence and operator context load before any transaction surface."],
  ["02", "Passport stamp is attached", "`hookData` carries the investor, window, minimum output, deadline, nonce, and signature."],
  ["03", "Router settles exact input", "USDC is pre-settled into the v4 `PoolManager` through the narrow gated router."],
  ["04", "Hook consumes the window", "`beforeSwap` verifies eligibility, caps, window timing, oracle freshness, and token direction."],
  ["05", "Custom delta returns LCX", "The hook bypasses public AMM price discovery and outputs the window-priced restricted token."],
] as const;

const rejectionRows = [
  ["Ineligible wallet", "InvestorNotEligible", "No passport stamp for this window"],
  ["Expired deadline", "AuthorizationExpired", "Signature cannot be replayed after the permitted time"],
  ["Stale issuer proof", "StaleOracle", "Accounting proof is too old for the window"],
  ["Exact-output attempt", "ExactInputOnly", "Window settlement accepts deterministic exact input only"],
] as const;

const eventFacts = [
  ["Registry", "WindowConsumed", "window id, investor, mode, payment, output, fill"],
  ["Hook", "CapitalWindowHookSwap", "pool id, router, payment, output, effective price"],
  ["Indexer", "Derived audit rows", "CRM stage, portfolio units, issuer cash receipt"],
] as const;

const auditTrailRows = [
  ["CRM", "Allocation closed", "WindowConsumed", "Investor 0x4444 filled 1,500 USDC in window 1"],
  ["Portfolio", "LCX position opened", "CapitalWindowHookSwap", "1,454.54 LCX delivered to the passport wallet"],
  ["Issuer reporting", "Treasury receipt", "WindowConsumed", "Primary conversion cash routes to issuer treasury"],
  ["Risk review", "Window capacity updated", "WindowConsumed", "Filled amount and per-investor capacity stay reconcilable"],
] as const;

const proofCommands = [
  {
    label: "Local gate",
    command: "corepack yarn hookathon:check",
    result: "App lint, typecheck, production build, 26 Foundry tests, and one approved settlement plus six blocked paths.",
  },
  {
    label: "Base Sepolia dry-run",
    command: "corepack yarn hookathon:testnet:e2e",
    result: "Official v4 PoolManager, mined hook address, LCX/USDC pool init, window creation, and one approved smoke swap.",
  },
] as const;

const proofMarkers = [
  ["Local settlement", "1500.00 USDC -> 1454.54 LCX"],
  ["Blocked paths", "missing passport / generic router / expired / min output / replay / stale oracle"],
  ["Mined hook", "0xf4e79FfC08cf1c4325DDCD1d1f38e10E37900a88"],
  ["Smoke delta", "-1500e18 USDC / +1454.54e18 LCX"],
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
                Port of Call turns local-business capital into a passport-gated v4 window.
              </h1>
              <p className="mt-6 max-w-3xl text-pretty text-lg leading-7 text-on-surface-variant md:text-xl">
                An Ablo-style discovery loop for private markets: travel to the issuer, read diligence
                in your language, receive an eligibility stamp, then execute through a Uniswap v4
                custom-accounting hook.
              </p>
            </div>

            <div className="mt-10 grid gap-1 bg-border-muted md:grid-cols-3">
              <HeroStat label="Demo asset" value={featuredDeal.name} body={featuredDeal.location} />
              <HeroStat label="Window target" value={formatCurrency(targetRaise)} body="Sandbox raise context" />
              <HeroStat label="Hook stance" value="Specialized" body="Private-market window rules" />
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
                    "Representative local operating business used for a controlled v4 capital-window demo."}
                </p>
              </div>
            </div>

            <div className="grid gap-1 border-t border-border-muted bg-border-muted md:grid-cols-3">
              <SignalCell label="Input" value="USDC" />
              <SignalCell label="Output" value="LCX" />
              <SignalCell label="Pool behavior" value="Custom delta" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid min-w-0 gap-1 border-b border-border-muted bg-border-muted xl:grid-cols-[0.9fr_1.1fr]">
        <div className="min-w-0 bg-surface p-5 md:p-8">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
            Travel feed
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight text-on-surface md:text-5xl">
            Discover capital ports before a transaction exists.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-on-surface-variant">
            The memorable product loop is not a public buy button. It is a guided trip from local
            business context to eligibility, allocation, and deterministic settlement.
          </p>
        </div>
        <div className="grid min-w-0 gap-1 bg-border-muted md:grid-cols-3">
          {feedPorts.map((port) => (
            <article key={port.asset} className="min-w-0 bg-surface p-5">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                {port.city}
              </p>
              <h3 className="mt-3 min-h-16 font-serif text-2xl font-semibold leading-tight text-on-surface">
                {port.asset}
              </h3>
              <div className="mt-5 border-y border-border-muted py-3">
                <p className="font-mono text-xl font-semibold tabular-nums text-on-surface">
                  {port.metric}
                </p>
                <p className="mt-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                  {port.status}
                </p>
              </div>
              <p className="mt-4 text-sm leading-6 text-on-surface-variant">{port.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid min-w-0 gap-1 border-b border-border-muted bg-border-muted xl:grid-cols-[1.05fr_0.95fr]">
        <div className="grid min-w-0 gap-1 bg-border-muted md:grid-cols-2">
          <div className="min-w-0 bg-surface-paper p-5 text-surface-ink md:p-8">
            <Languages className="h-5 w-5" aria-hidden="true" />
            <p className="mt-8 font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
              Local guide room
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight md:text-4xl">
              Diligence in the investor&apos;s language.
            </h2>
            <p className="mt-4 text-sm leading-6 text-surface-container">
              Store economics, use of funds, data-room status, and risk notes become a translated
              issuer room. The output is understanding, not public solicitation.
            </p>
            <div className="mt-8 grid gap-2">
              {(featuredRaise?.useOfFunds ?? []).slice(0, 4).map((item) => (
                <div key={item.label} className="grid grid-cols-[56px_1fr] gap-4 border-t border-surface-container/25 py-3">
                  <span className="font-mono text-sm font-semibold tabular-nums">{item.percent}%</span>
                  <div>
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm leading-5 text-surface-container">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
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
            Capital window quote
          </p>
          <div className="mt-4 grid gap-1 bg-border-muted">
            <QuoteRow label="Exact input" value="1,500 USDC" />
            <QuoteRow label="Expected output" value="1,454.54 LCX" />
            <QuoteRow label="Per-investor cap" value="5,000 USDC" />
            <QuoteRow label="Window fill" value="27%" />
            <QuoteRow label="Oracle proof age" value="18 minutes" />
          </div>

          <div className="mt-8 border border-status-signal/40 bg-status-signal/10 p-5">
            <div className="flex items-center gap-3">
              <LockKeyhole className="h-5 w-5 text-status-signal" aria-hidden="true" />
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                Ready path
              </p>
            </div>
            <p className="mt-4 text-sm leading-6 text-on-surface-variant">
              <span className="break-words">`CapitalWindowRouter.swapExactInput`</span> calls the v4 `PoolManager`, then the hook consumes
              the signed window and returns the custom accounting delta.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/private-equities/assets/lcx"
              className={`btn btn-outline btn-success justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em] sm:min-w-56 ${focusVisibleClass}`}
            >
              Open LCX asset
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

      <section className="grid min-w-0 gap-1 border-b border-border-muted bg-border-muted xl:grid-cols-[0.82fr_1.18fr]">
        <div className="min-w-0 bg-surface-ink p-5 text-on-surface md:p-8">
          <Terminal className="h-5 w-5 text-status-signal" aria-hidden="true" />
          <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
            Judge reproducibility
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight text-on-surface md:text-5xl">
            Two commands prove the product is on real v4 rails.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-on-surface-variant">
            The local gate proves the hook behavior deterministically. The Base Sepolia dry-run uses
            the official v4 `PoolManager` address, mines the hook permission bits, initializes the
            LCX/USDC pool, and executes an approved smoke swap without broadcasting.
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
          </div>
        </div>
      </section>

      <HookathonScenarioSimulator />

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
            This demo is strongest when shown twice: one approved path, then one rejected path. Judges
            can see that the v4 hook is carrying real mechanism design, not brand theater.
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

      <section className="grid min-w-0 gap-1 border-b border-border-muted bg-border-muted xl:grid-cols-[0.95fr_1.05fr]">
        <div className="min-w-0 bg-surface p-5 md:p-8">
          <FileCheck2 className="h-5 w-5 text-status-signal" aria-hidden="true" />
          <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
            Event reconciliation
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface md:text-5xl">
            Swap output becomes an audit trail, not a screenshot.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-on-surface-variant">
            The tests assert the event pair that a production indexer would map into CRM, portfolio,
            issuer reporting, and risk review surfaces.
          </p>
          <div className="mt-8 grid gap-1 bg-border-muted">
            {eventFacts.map(([source, eventName, payload]) => (
              <div key={eventName} className="grid min-w-0 gap-3 bg-surface-ink p-4 md:grid-cols-[112px_220px_1fr]">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                  {source}
                </p>
                <p className="break-words font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                  {eventName}
                </p>
                <p className="text-sm leading-5 text-on-surface-variant">{payload}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 bg-surface-paper p-5 text-surface-ink md:p-8">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
            Mock indexer output
          </p>
          <div className="mt-5 grid gap-1 bg-surface-container/20">
            {auditTrailRows.map(([surface, status, eventName, body]) => (
              <div key={`${surface}-${status}`} className="grid min-w-0 gap-3 border-t border-surface-container/20 py-4 first:border-t-0 md:grid-cols-[150px_180px_1fr]">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">{surface}</p>
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">{status}</p>
                  <p className="mt-1 break-words font-mono text-[10px] uppercase tracking-[0.08em] text-surface-container">
                    {eventName}
                  </p>
                </div>
                <p className="text-sm leading-5 text-surface-container">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid min-w-0 gap-1 bg-border-muted lg:grid-cols-[1fr_1fr]">
        <div className="min-w-0 bg-surface p-5 md:p-8">
          <XCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
          <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-destructive">
            Revert proof
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface md:text-4xl">
            A capital window should fail loudly when context is missing.
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
            Submission claim
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight md:text-4xl">
            Uniswap v4 can host specialized private-market windows without pretending they are public AMMs.
          </h2>
          <p className="mt-4 text-sm leading-6 text-surface-container">
            The memorable hook is the passport checkpoint. The practical hook turns private-market
            constraints into settlement rules: eligibility, caps, oracle freshness, and custom accounting.
          </p>
          <div className="mt-8 grid gap-1 bg-surface-container/20">
            <PaperRow label="Primary angle" value="Specialized Markets" />
            <PaperRow label="Secondary angle" value="Yield-Protected AMM" />
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

function PaperRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 border-t border-surface-container/20 py-3 first:border-t-0 md:grid-cols-[160px_1fr]">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">{label}</p>
      <p className="text-sm leading-5 text-surface-container">{value}</p>
    </div>
  );
}
