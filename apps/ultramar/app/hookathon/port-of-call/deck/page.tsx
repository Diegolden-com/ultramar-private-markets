import { JsonLd } from "@/components/json-ld";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  CircleDollarSign,
  DatabaseZap,
  ExternalLink,
  FileCheck2,
  FileText,
  GitBranch,
  Globe2,
  KeyRound,
  Landmark,
  Network,
  PlayCircle,
  Route,
  ShieldCheck,
  Terminal,
  Timer,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const path = "/hookathon/port-of-call/deck";
const description =
  "Pitch deck for Ultramar Port of Call, a Uniswap v4 Specialized Markets hookathon demo for investment ports, capital-route intake, debt covenant previews, and custom-accounting equity settlement.";
const focusVisibleClass =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-signal";

export const metadata = createSeoMetadata({
  title: "Port of Call Hookathon Pitch Deck",
  description,
  path,
  image: seoImages.privateEquities,
  noIndex: true,
  keywords: [
    "Uniswap v4 Hookathon pitch deck",
    "Specialized Markets",
    "investment ports",
    "capital routes",
    "debt covenants",
    "private-market investment ports",
    "custom accounting hook",
    "Ultramar Capital",
  ],
});

const problemRows = [
  ["Language", "Investors cannot inspect local operating proof with enough context."],
  ["Eligibility", "Issuer, jurisdiction, NDA, transfer policy, and caps sit outside settlement."],
  ["Execution", "A public AMM cannot know which private route is valid, fresh, or closed."],
] as const;

const marketSystemRows = [
  [
    "Walmart lesson",
    "Markets fund operating systems, not category labels.",
    "A valuation is the market saying that administration can absorb capital and compound operations.",
  ],
  [
    "LCX administration",
    "Daily close, utilization, route density, ticket mix.",
    "A crowded laundry category becomes underwritable when operating control produces claims investors can check.",
  ],
  [
    "Omnichannel margin",
    "+6.8 pp target",
    "Pickup and delivery density plus store-level reporting create the margin route, not a meme narrative.",
  ],
  [
    "Capital route",
    "Debt or equity",
    "Coverage proof can open a creditor route; margin and use-of-funds proof can open an equity window.",
  ],
] as const;

const abloLoop = [
  ["Travel", "Open a capital port and meet the issuer before the transaction surface."],
  ["Guide", "Translate diligence, store economics, use of funds, and risk notes."],
  ["Passport", "Attach KYC/KYB, jurisdiction, NDA, allocation, and transfer policy checks."],
  ["Route", "Choose equity, debt covenant preview, secondary transfer, or conversion path."],
] as const;

const capitalRouteRows = [
  {
    icon: DatabaseZap,
    label: "Operating signal",
    title: "Administration becomes market context.",
    body: "Omnichannel demand, store-level reporting, route density, cash discipline, and margin expansion make a traditional operator legible to capital.",
  },
  {
    icon: CircleDollarSign,
    label: "Equity window",
    title: "Primary capital can settle as issuer-token output.",
    body: "The current demo proves the restricted LCX sandbox equity route: a signed passport plus window terms convert demo USDC into sandbox restricted LCX output through custom accounting.",
  },
  {
    icon: Landmark,
    label: "Debt covenant preview",
    title: "Debt opens only while financial coverage is green.",
    body: "The demo now previews a working-capital debt route using current asset coverage, liquidity freshness, creditor eligibility, and covenant-gated access.",
  },
  {
    icon: FileCheck2,
    label: "Proof privacy",
    title: "Private books become disclosure-minimized claims.",
    body: "Revenue freshness, coverage ratios, covenant status, and data-room readiness can be attested without exposing raw issuer books to every market participant.",
  },
  {
    icon: FileText,
    label: "Legal wrapper",
    title: "The route points to an instrument, not a public offer.",
    body: "Equity, debt, secondary transfer, or conversion terms still need the issuer vehicle, documents, eligibility rules, and transfer controls before settlement.",
  },
  {
    icon: Route,
    label: "Secondary / conversion",
    title: "Later markets reuse the same port.",
    body: "The same data, passport, and hook boundary can gate secondary transfers or step-to-equity triggers before settlement.",
  },
] as const;

const demoWalkthroughRows = [
  [
    "00:00",
    "Frame the market",
    "Walmart shows markets fund operating systems. LCX asks whether administration can make a crowded laundry financeable.",
  ],
  [
    "00:18",
    "Submit eligible order",
    "Omnichannel margin and fresh revenue open the signed sandbox equity window.",
  ],
  [
    "00:36",
    "Switch to debt route",
    "Current asset coverage decides whether creditor access can open.",
  ],
  [
    "00:54",
    "Use stale books",
    "Stale proof closes the route without repricing signed terms or moving issuer inventory.",
  ],
  [
    "01:12",
    "Send via generic router",
    "A passport is not a public swap ticket. The approved route is the market boundary.",
  ],
] as const;

const v4Mechanics = [
  {
    icon: Route,
    label: "Router provenance",
    body: "The signed passport binds the order to CapitalWindowRouter, so a generic v4 path cannot reuse it.",
  },
  {
    icon: Timer,
    label: "Window state",
    body: "Timing, per-investor caps, allocation fill, exact-input direction, and deadline checks execute in beforeSwap.",
  },
  {
    icon: DatabaseZap,
    label: "Custom accounting",
    body: "beforeSwapReturnDelta consumes the payment side and returns window-priced issuer-token output for the equity route.",
  },
  {
    icon: ShieldCheck,
    label: "Market boundary",
    body: "Public add/remove liquidity reverts; the pool is a specialized investment-port boundary, not a public AMM.",
  },
] as const;

const valuationTerms = [
  ["Pre-money", "4.5M USD", "Issuer-approved valuation frame."],
  ["FD units", "4.5M restricted LCX", "Sandbox token model for the demo."],
  ["Signed demo term", "1.00 demo USDC / restricted LCX", "Terms signed before the window opens."],
  ["FX policy", "Snapshot, then fixed", "MXN economics convert into a USDC window price."],
] as const;

const fxPolicyRows = [
  ["Fixed window", "The active window never reprices filled orders after the FX snapshot is signed."],
  ["Floating policy", "A new FX snapshot can set the next window; old fills keep their fixed terms."],
] as const;

const curveRows = [
  ["Tranche 1", "0-1,000 demo USDC", "1.00 demo USDC/restricted LCX", "1,000.00 restricted LCX"],
  ["Tranche 2", "1,000-1,500 demo USDC", "1.10 demo USDC/restricted LCX", "454.54 restricted LCX"],
  ["Effective", "1,500 demo USDC input", "1.0312 demo USDC/restricted LCX", "1,454.54 restricted LCX"],
] as const;

const pricingBridge = [
  ["01", "Pre-money ledger", "4.5M USD / 4.5M restricted LCX", "1.00 demo USDC/restricted LCX"],
  ["02", "FX snapshot locked", "MXN economics signed into USDC terms", "fixed during the window"],
  ["03", "Hook step curve", "1,000 @ 1.00 + 500 @ 1.10", "1,454.54 restricted LCX output"],
] as const;

const proofRows = [
  ["Approved demo settlement", "1,500 demo USDC -> 1,454.54 sandbox restricted LCX"],
  ["Debt route preview", "Current asset coverage gate switches route output between open and blocked"],
  ["Blocked paths", "missing passport / generic router / expired / min output / replay / stale oracle"],
  ["Foundry suite", "27 tests, including hook permission bits, router-bound passport digest, and exact signed demo term settlement"],
  ["Testnet dry-run", "Base Sepolia PoolManager, mined 0xa88 hook mask, window 1 smoke swap"],
] as const;

const judgeClaims = [
  ["Uniqueness", "Abloh for capital is easy to remember, but the mechanism is concrete v4 custom accounting."],
  ["Impact", "A reusable pattern for equity, debt, secondary transfers, and conversion routes where constraints become market rules."],
  ["Functionality", "Frontend route intake, simulator, Solidity tests, local demo script, capture script, and testnet dry-run path."],
  ["Presentation", "One sentence carries the story: the hook is the market boundary."],
] as const;

const judgePacketLinks = [
  {
    icon: PlayCircle,
    label: "Demo video",
    href: "https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm",
    body: "Captioned review cut with product loop, pricing proof, and terminal proof.",
  },
  {
    icon: Terminal,
    label: "Base Sepolia proof",
    href: "https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/testnet-dry-run-latest.md",
    body: "Dry-run report for official PoolManager, mined 0xa88 hook, window 1, and smoke swap.",
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
    body: "Hook, router, registry, tests, proof scripts, deck source, and final Tally packet.",
  },
] as const;

export default function PortOfCallDeckPage() {
  return (
    <main id="main-content" className="overflow-x-hidden bg-surface-ink text-on-surface">
      <JsonLd
        id="port-of-call-hookathon-deck-json-ld"
        data={[
          webPageJsonLd({
            path,
            name: "Ultramar Port of Call Hookathon Pitch Deck",
            description,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Hookathon", path: "/hookathon" },
            { name: "Port of Call", path: "/hookathon/port-of-call" },
            { name: "Deck", path },
          ]),
        ]}
      />

      <section className="relative min-w-0 overflow-hidden border-b border-border-muted bg-surface">
        <div className="terminal-grid-2d absolute inset-0 opacity-45" />
        <div className="relative z-10 grid min-w-0 gap-1 bg-border-muted lg:min-h-[calc(100vh-96px)] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex min-w-0 flex-col justify-between bg-surface p-5 md:p-8 xl:p-10">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-outline badge-success font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
                  Pitch deck
                </span>
                <span className="badge badge-outline border-border-muted bg-surface-ink font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                  UHI8 Specialized Markets
                </span>
              </div>
              <p className="mt-10 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                Ultramar Capital
              </p>
              <h1 className="mt-3 max-w-5xl break-words font-serif text-4xl font-bold leading-[1.02] text-on-surface [overflow-wrap:anywhere] md:text-6xl xl:text-7xl">
                Port of Call turns operating businesses into v4 investment ports.
              </h1>
              <p className="mt-6 max-w-3xl text-pretty text-lg leading-7 text-on-surface-variant md:text-xl">
                An Abloh-inspired product object wrapped around a real Uniswap v4 hook: investors
                travel to a local business, receive a signed passport, choose an equity or debt route,
                and cross the market boundary only when the hook verifies the route.
              </p>
            </div>

            <div className="mt-10 grid gap-1 bg-border-muted md:grid-cols-3">
              <DeckMetric label="Theme" value="Specialized Markets" />
              <DeckMetric label="Asset" value="Lavanderias CX" />
              <DeckMetric label="Proof" value="27 hook tests" />
            </div>
          </div>

          <div className="relative min-h-[520px] overflow-hidden bg-surface-ink">
            <Image
              src="/solarpunk-laundromat.png"
              alt="Lavanderias CX operating-business visual"
              fill
              priority
              sizes="(min-width: 1024px) 54vw, 100vw"
              className="image-blackwork object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-ink via-surface-ink/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                Demo thesis
              </p>
              <p className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight text-on-surface md:text-5xl">
                The memorable product is travel. The durable mechanism is route control.
              </p>
            </div>
          </div>
        </div>
      </section>

      <DeckSlide
        eyebrow="01 / Problem"
        title="Private-market capital breaks before settlement."
        body="The friction is not only price discovery. It is trust formation across language, diligence, jurisdiction, allocation, transfer policy, and reporting."
        icon={Globe2}
      >
        <div className="grid min-w-0 gap-1 bg-border-muted md:grid-cols-3">
          {problemRows.map(([label, body]) => (
            <article key={label} className="min-w-0 bg-surface p-5 md:p-6">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                {label}
              </p>
              <p className="mt-4 text-sm leading-6 text-on-surface-variant">{body}</p>
            </article>
          ))}
        </div>
      </DeckSlide>

      <DeckSlide
        eyebrow="02 / Market readiness"
        title="Markets pay for operating systems."
        body="The Walmart lesson is not the multiple. It is the market signal: when administration turns operations into compounding infrastructure, capital becomes available. Port of Call applies that lesson to a competitive laundry operator before any swap surface appears."
        icon={DatabaseZap}
        paper
      >
        <div className="grid min-w-0 gap-1 bg-surface-container/20 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="min-w-0 bg-surface-paper p-5 md:p-6">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-container">
              Administration thesis
            </p>
            <h3 className="mt-4 max-w-2xl font-serif text-3xl font-semibold leading-tight text-surface-ink md:text-5xl">
              A traditional company becomes financeable when its admin layer becomes inspectable.
            </h3>
            <p className="mt-4 text-sm leading-6 text-surface-container">
              The investment port is the product answer: capture the operating claim, bind it to a
              legal route, and let the hook enforce whether debt or equity can open.
            </p>
            <div className="mt-6 border border-surface-container/25 bg-surface-container/10 p-5">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-container">
                Route formation
              </p>
              <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-surface-ink">
                Operating control turns proof into market access.
              </h3>
              <p className="mt-4 text-sm leading-6 text-surface-container">
                In LCX, the administration takeover is not a slogan: daily close, utilization, route
                density, ticket mix, and current asset coverage become proof. The issuer/SPV/legal
                wrapper turns that proof into equity, debt, secondary, or conversion instruments. The
                passport selects the route; the v4 hook opens or blocks market access.
              </p>
              <p className="mt-4 break-words font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-ink [overflow-wrap:anywhere]">
                Administration takeover -&gt; issuer/SPV wrapper -&gt; instrument -&gt; route -&gt; v4 hook
              </p>
            </div>
          </div>
          <div className="grid min-w-0 gap-1 bg-surface-container/20 md:grid-cols-2">
            {marketSystemRows.map(([label, value, body]) => (
              <MarketSystemCard key={label} label={label} value={value} body={body} />
            ))}
          </div>
        </div>
      </DeckSlide>

      <DeckSlide
        eyebrow="03 / Product loop"
        title="Abloh for capital: travel, guide, passport, route."
        body="The investor enters a capital port before any buy button appears. The app makes private-market context legible, then turns eligibility and operating proof into route-specific execution context."
        icon={KeyRound}
        paper
      >
        <div className="grid min-w-0 gap-1 bg-surface-container/20 md:grid-cols-4">
          {abloLoop.map(([label, body], index) => (
            <article key={label} className="min-w-0 bg-surface-paper p-5">
              <p className="font-mono text-3xl font-semibold tabular-nums text-surface-ink">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-8 font-serif text-2xl font-semibold leading-tight text-surface-ink">
                {label}
              </h3>
              <p className="mt-3 text-sm leading-6 text-surface-container">{body}</p>
            </article>
          ))}
        </div>
      </DeckSlide>

      <DeckSlide
        eyebrow="04 / Capital routes"
        title="A port can open equity, debt, secondary transfer, or conversion routes."
        body="The same issuer data layer and investor passport can support multiple financing rails. The hook remains the boundary where market access becomes enforceable execution."
        icon={Route}
      >
        <div className="grid min-w-0 gap-1 bg-border-muted md:grid-cols-2">
          {capitalRouteRows.map((item) => (
            <article key={item.label} className="min-w-0 bg-surface p-5 md:p-6">
              <item.icon className="h-5 w-5 text-status-signal" aria-hidden="true" />
              <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                {item.label}
              </p>
              <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-on-surface">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">{item.body}</p>
            </article>
          ))}
          <div className="min-w-0 bg-surface-paper p-5 text-surface-ink md:col-span-2 md:p-6">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-container">
              90-second walkthrough
            </p>
            <h3 className="mt-3 max-w-3xl font-serif text-3xl font-semibold leading-tight md:text-4xl">
              Every demo click proves one product claim.
            </h3>
            <div className="mt-6 grid gap-1 bg-surface-container/20">
              {demoWalkthroughRows.map(([time, action, line]) => (
                <div
                  key={time}
                  className="grid min-w-0 gap-3 border-t border-surface-container/20 py-4 first:border-t-0 md:grid-cols-[72px_180px_1fr]"
                >
                  <p className="font-mono text-[11px] font-semibold tabular-nums text-surface-ink">
                    {time}
                  </p>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-surface-container">
                    {action}
                  </p>
                  <p className="text-sm font-medium leading-5 text-surface-ink">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DeckSlide>

      <DeckSlide
        eyebrow="05 / Specialized market"
        title="A generic AMM is the wrong primitive for this asset class."
        body="Private operating-business investment ports have discrete eligibility, ticket size, timing, issuer-proof freshness, covenant coverage, and transfer constraints. The market needs those route rules inside settlement."
        icon={Network}
      >
        <div className="grid min-w-0 gap-1 bg-border-muted lg:grid-cols-[0.85fr_1.15fr]">
          <div className="min-w-0 bg-surface-paper p-5 text-surface-ink md:p-6">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
              Market boundary
            </p>
            <h3 className="mt-4 font-serif text-3xl font-semibold leading-tight">
              Specialized Markets, with Yield-Protected AMM as secondary proof.
            </h3>
            <p className="mt-4 text-sm leading-6 text-surface-container">
              Port of Call fits Specialized Markets because the hook is an asset-class-specific
              market boundary rather than a public liquidity pool.
            </p>
          </div>
          <div className="grid min-w-0 gap-1 bg-border-muted sm:grid-cols-2">
            <Signal label="Blocked" value="public LP behavior" />
            <Signal label="Accepted" value="router-bound exact input" />
            <Signal label="Checked" value="caps, nonce, deadline, oracle" />
            <Signal label="Returned" value="window-priced sandbox restricted LCX delta" />
          </div>
        </div>
      </DeckSlide>

      <DeckSlide
        eyebrow="06 / v4 mechanism"
        title="The hook is not decoration. It is the market boundary."
        body="Every demo state maps to a v4 callback, router rule, or event proof that a technical reviewer can inspect in code."
        icon={ShieldCheck}
        paper
      >
        <div className="grid min-w-0 gap-1 bg-surface-container/20 md:grid-cols-2 xl:grid-cols-4">
          {v4Mechanics.map((item) => (
            <article key={item.label} className="min-w-0 bg-surface-paper p-5">
              <item.icon className="h-5 w-5 text-surface-ink" aria-hidden="true" />
              <h3 className="mt-8 font-serif text-2xl font-semibold leading-tight text-surface-ink">
                {item.label}
              </h3>
              <p className="mt-3 text-sm leading-6 text-surface-container">{item.body}</p>
            </article>
          ))}
        </div>
      </DeckSlide>

      <DeckSlide
        eyebrow="07 / Signed demo term"
        title="Sandbox pre-money and FX become a signed demo term, then the hook executes restricted settlement."
        body="The hook is not a valuation oracle or public listing surface. Ultramar approves the sandbox valuation frame and FX policy before the demo window opens; v4 custom accounting only enforces those terms at restricted settlement."
        icon={Calculator}
      >
        <div className="grid min-w-0 gap-1 bg-border-muted lg:grid-cols-[0.95fr_1.05fr]">
          <div className="min-w-0 bg-surface-paper p-5 text-surface-ink md:p-6">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
              Demo window terms
            </p>
            <div className="mt-5 grid gap-1 bg-surface-container/20 sm:grid-cols-2">
              {valuationTerms.map(([label, value, body]) => (
                <ValuationTerm key={label} label={label} value={value} body={body} />
              ))}
            </div>
            <div className="mt-5 border-t border-surface-container/25 pt-5">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-container">
                Custom accounting formula
              </p>
              <p className="mt-3 break-words font-serif text-2xl font-semibold leading-tight [overflow-wrap:anywhere]">
                basePrice = preMoneyUsd / fullyDilutedUnits
              </p>
              <p className="mt-3 break-words font-serif text-2xl font-semibold leading-tight [overflow-wrap:anywhere]">
                companyTokenOut = sum(tranchePayment / tranchePrice)
              </p>
              <div className="mt-4 grid gap-1 bg-surface-container/20 sm:grid-cols-2">
                {fxPolicyRows.map(([label, body]) => (
                  <FxPolicyNote key={label} label={label} body={body} />
                ))}
              </div>
            </div>
          </div>

          <WindowCurveGraphic />
        </div>
      </DeckSlide>

      <DeckSlide
        eyebrow="08 / Proof paths"
        title="One approved settlement, six blocked paths."
        body="The product story is backed by tests, a local Foundry demo script, browser capture assets, and a Base Sepolia dry-run path using the official v4 PoolManager."
        icon={Terminal}
      >
        <div className="grid min-w-0 gap-1 bg-border-muted lg:grid-cols-[1.05fr_0.95fr]">
          <div className="min-w-0 bg-surface-ink p-5 md:p-6">
            <CodeLine value="corepack yarn hookathon:check" />
            <CodeLine value="corepack yarn hookathon:video:proof" />
            <CodeLine value="corepack yarn hookathon:capture:demo" />
            <CodeLine value="corepack yarn hookathon:testnet:e2e" />
          </div>
          <div className="grid min-w-0 gap-1 bg-border-muted">
            {proofRows.map(([label, value]) => (
              <ProofRow key={label} label={label} value={value} />
            ))}
          </div>
        </div>
      </DeckSlide>

      <DeckSlide
        eyebrow="09 / Route proof"
        title="The product can be verified from four claims."
        body="The story stays crisp at the product layer, while the code gives technical reviewers enough surface to verify the mechanism."
        icon={FileCheck2}
        paper
      >
        <div className="grid min-w-0 gap-1 bg-surface-container/20 md:grid-cols-2">
          {judgeClaims.map(([label, body]) => (
            <article key={label} className="min-w-0 bg-surface-paper p-5 md:p-6">
              <BadgeCheck className="h-5 w-5 text-surface-ink" aria-hidden="true" />
              <h3 className="mt-8 font-serif text-3xl font-semibold leading-tight text-surface-ink">
                {label}
              </h3>
              <p className="mt-3 text-sm leading-6 text-surface-container">{body}</p>
            </article>
          ))}
        </div>
      </DeckSlide>

      <section className="grid min-w-0 gap-1 bg-border-muted lg:grid-cols-[0.9fr_1.1fr]">
        <div className="min-w-0 bg-surface p-5 md:p-8">
          <XCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
          <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-destructive">
            Boundary
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface md:text-5xl">
            Sandbox demo only. Not a public securities offer.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-on-surface-variant">
            Production use would need counsel, jurisdiction review, transfer controls, custody
            decisions, audit, monitoring, and operational approvals. The Hookathon claim is the v4
            mechanism pattern.
          </p>
        </div>

        <div className="min-w-0 bg-surface-paper p-5 text-surface-ink md:p-8">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
            Closing line
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight md:text-5xl">
            Uniswap v4 can host private-market investment ports without pretending they are public AMMs.
          </h2>
          <div className="mt-8 grid gap-1 bg-surface-container/20 sm:grid-cols-2">
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
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/hookathon/port-of-call"
              className={`btn btn-outline justify-between border-surface-ink font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-surface-ink hover:bg-surface-ink hover:text-on-surface sm:min-w-52 ${focusVisibleClass}`}
            >
              Open demo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/private-equities/legal"
              className={`btn btn-ghost justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-surface-container hover:text-surface-ink sm:min-w-52 ${focusVisibleClass}`}
            >
              Legal gate
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function DeckSlide({
  eyebrow,
  title,
  body,
  icon: Icon,
  paper = false,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  icon: typeof ShieldCheck;
  paper?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="grid min-w-0 gap-1 border-b border-border-muted bg-border-muted xl:grid-cols-[0.82fr_1.18fr]">
      <div className={`${paper ? "bg-surface-paper text-surface-ink" : "bg-surface text-on-surface"} min-w-0 p-5 md:p-8`}>
        <Icon
          className={`h-5 w-5 ${paper ? "text-surface-ink" : "text-status-signal"}`}
          aria-hidden="true"
        />
        <p
          className={`mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.08em] ${
            paper ? "text-surface-container" : "text-status-signal"
          }`}
        >
          {eyebrow}
        </p>
        <h2 className="mt-3 max-w-2xl break-words font-serif text-3xl font-semibold leading-tight [overflow-wrap:anywhere] md:text-5xl">
          {title}
        </h2>
        <p
          className={`mt-4 max-w-2xl text-sm leading-6 ${
            paper ? "text-surface-container" : "text-on-surface-variant"
          }`}
        >
          {body}
        </p>
      </div>
      <div className={`${paper ? "bg-surface-paper text-surface-ink" : "bg-surface"} min-w-0 p-5 md:p-8`}>
        {children}
      </div>
    </section>
  );
}

function DeckMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-surface-ink p-4">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p className="mt-3 break-words font-serif text-2xl font-semibold leading-tight text-on-surface">
        {value}
      </p>
    </div>
  );
}

function MarketSystemCard({ label, value, body }: { label: string; value: string; body: string }) {
  return (
    <article className="min-w-0 bg-surface-paper p-4">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-surface-container">
        {label}
      </p>
      <h3 className="mt-4 break-words font-serif text-2xl font-semibold leading-tight text-surface-ink">
        {value}
      </h3>
      <p className="mt-3 text-sm leading-6 text-surface-container">{body}</p>
    </article>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-surface p-5">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
        {label}
      </p>
      <p className="mt-3 break-words font-serif text-2xl font-semibold leading-tight text-on-surface">
        {value}
      </p>
    </div>
  );
}

function ValuationTerm({ label, value, body }: { label: string; value: string; body: string }) {
  return (
    <div className="min-w-0 bg-surface-paper p-4">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-surface-container">
        {label}
      </p>
      <p className="mt-3 break-words font-serif text-2xl font-semibold leading-tight text-surface-ink">
        {value}
      </p>
      <p className="mt-2 text-xs leading-5 text-surface-container">{body}</p>
    </div>
  );
}

function FxPolicyNote({ label, body }: { label: string; body: string }) {
  return (
    <div className="min-w-0 bg-surface-paper p-3">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-surface-ink">
        {label}
      </p>
      <p className="mt-2 text-xs leading-5 text-surface-container">{body}</p>
    </div>
  );
}

function WindowCurveGraphic() {
  return (
    <div className="min-w-0 bg-surface-ink p-5 text-on-surface md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
            Step conversion curve
          </p>
          <h3 className="mt-3 max-w-xl font-serif text-3xl font-semibold leading-tight">
            Sandbox window example returns 1,454.54 restricted LCX for 1,500 demo USDC without public AMM price discovery.
          </h3>
        </div>
        <div className="border border-border-muted bg-surface px-4 py-3">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
            Effective
          </p>
          <p className="mt-2 font-mono text-lg font-semibold text-status-signal">1.0312</p>
        </div>
      </div>

      <div
        className="mt-6 grid min-w-0 gap-1 bg-border-muted"
        aria-label="Valuation-to-window bridge showing pre-money terms, fixed FX policy, and hook curve settlement."
      >
        {pricingBridge.map(([step, label, value, body]) => (
          <PricingBridgeStep key={label} step={step} label={label} value={value} body={body} />
        ))}
      </div>

      <div className="mt-6 min-w-0 overflow-hidden border border-border-muted bg-surface">
        <svg
          viewBox="0 0 560 360"
          role="img"
          aria-label="Visual pricing graph: pre-money and fixed FX define a 1.00 demo USDC per restricted LCX signed term; the active window keeps that FX snapshot fixed, and the hook prices 1,000 demo USDC at 1.00 plus the next 500 demo USDC at 1.10 for an effective 1.0312 price."
          className="h-auto w-full"
        >
          <rect width="560" height="360" fill="var(--surface)" />
          <path d="M64 286H512" stroke="var(--border-muted)" strokeWidth="2" />
          <path d="M64 54V286" stroke="var(--border-muted)" strokeWidth="2" />
          <path d="M64 214H512M64 134H512M64 74H512" stroke="var(--border-muted)" strokeWidth="1" opacity="0.55" />

          <path d="M64 214H246" stroke="var(--on-surface-variant)" strokeDasharray="8 8" strokeWidth="2" opacity="0.9" />
          <path d="M64 286V214H246V134H337V286Z" fill="var(--status-signal)" opacity="0.14" />
          <rect x="64" y="244" width="182" height="42" fill="var(--status-signal)" opacity="0.9" />
          <rect x="246" y="244" width="91" height="42" fill="#c88f32" opacity="0.92" />
          <path d="M64 214H246V134H428V74" fill="none" stroke="var(--status-signal)" strokeWidth="5" strokeLinecap="square" />

          <path d="M246 62V286" stroke="var(--on-surface-variant)" strokeDasharray="7 7" strokeWidth="2" opacity="0.85" />
          <path d="M337 62V286" stroke="#c88f32" strokeDasharray="7 7" strokeWidth="2" opacity="0.95" />
          <circle cx="337" cy="134" r="8" fill="#c88f32" stroke="var(--surface)" strokeWidth="4" />

          <text x="304" y="352" fill="var(--on-surface-variant)" fontSize="13" fontFamily="monospace" textAnchor="middle">
            x: demo USDC committed in signed window
          </text>
          <text x="18" y="54" fill="var(--on-surface-variant)" fontSize="13" fontFamily="monospace" transform="rotate(-90 18 54)">
            y: demo USDC / restricted LCX
          </text>

          <text x="64" y="326" fill="var(--on-surface-variant)" fontSize="15" fontFamily="monospace">0</text>
          <text x="216" y="326" fill="var(--on-surface-variant)" fontSize="15" fontFamily="monospace">1,000</text>
          <text x="312" y="326" fill="#c88f32" fontSize="15" fontFamily="monospace">1,500 input</text>
          <text x="431" y="326" fill="var(--on-surface-variant)" fontSize="15" fontFamily="monospace">2,000 demo USDC</text>

          <text x="18" y="219" fill="var(--on-surface-variant)" fontSize="15" fontFamily="monospace">1.00</text>
          <text x="18" y="139" fill="var(--on-surface-variant)" fontSize="15" fontFamily="monospace">1.10</text>
          <text x="18" y="79" fill="var(--on-surface-variant)" fontSize="15" fontFamily="monospace">1.20</text>

          <text x="84" y="238" fill="var(--surface-ink)" fontSize="17" fontWeight="700" fontFamily="monospace">
            1,000 restricted LCX
          </text>
          <text x="253" y="238" fill="var(--surface-ink)" fontSize="15" fontWeight="700" fontFamily="monospace">
            454.54 restricted LCX
          </text>
          <text x="360" y="124" fill="var(--on-surface)" fontSize="18" fontWeight="700" fontFamily="monospace">
            +10% tranche
          </text>
          <text x="82" y="204" fill="var(--on-surface)" fontSize="15" fontWeight="700" fontFamily="monospace">
            base from 4.5M / 4.5M
          </text>
          <text x="348" y="180" fill="#c88f32" fontSize="15" fontWeight="700" fontFamily="monospace">
            effective 1.0312
          </text>
          <text x="84" y="42" fill="var(--status-signal)" fontSize="15" fontWeight="700" fontFamily="monospace">
            pre-money + FX snapshot -&gt; fixed curve
          </text>
        </svg>
      </div>

      <div className="mt-5 grid min-w-0 gap-1 bg-border-muted">
        {curveRows.map(([label, input, price, output]) => (
          <CurveRow key={label} label={label} input={input} price={price} output={output} />
        ))}
      </div>
    </div>
  );
}

function PricingBridgeStep({
  step,
  label,
  value,
  body,
}: {
  step: string;
  label: string;
  value: string;
  body: string;
}) {
  return (
    <div className="min-w-0 bg-surface p-4">
      <p className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-status-signal">
        <span className="grid h-6 w-6 shrink-0 place-items-center border border-border-muted bg-surface-ink text-[10px] tabular-nums text-on-surface">
          {step}
        </span>
        <span className="min-w-0 break-words">{label}</span>
      </p>
      <p className="mt-4 break-words font-mono text-sm font-semibold leading-5 text-on-surface">
        {value}
      </p>
      <p className="mt-2 text-xs leading-5 text-on-surface-variant">{body}</p>
    </div>
  );
}

function CurveRow({
  label,
  input,
  price,
  output,
}: {
  label: string;
  input: string;
  price: string;
  output: string;
}) {
  return (
    <div className="grid min-w-0 gap-3 bg-surface-ink p-4 sm:grid-cols-[96px_1fr_1fr_1fr]">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-status-signal">
        {label}
      </p>
      <p className="break-words text-xs leading-5 text-on-surface-variant">{input}</p>
      <p className="break-words text-xs leading-5 text-on-surface-variant">{price}</p>
      <p className="break-words text-xs font-semibold leading-5 text-on-surface">{output}</p>
    </div>
  );
}

function CodeLine({ value }: { value: string }) {
  return (
    <code className="mb-2 block min-w-0 break-words border border-border-muted bg-surface p-4 font-mono text-sm font-semibold leading-6 text-on-surface [overflow-wrap:anywhere] last:mb-0">
      {value}
    </code>
  );
}

function ProofRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid min-w-0 gap-3 bg-surface p-4 md:grid-cols-[180px_1fr]">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
        {label}
      </p>
      <p className="break-words text-sm leading-5 text-on-surface-variant [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}
