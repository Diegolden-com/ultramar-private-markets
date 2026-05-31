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
  DatabaseZap,
  FileCheck2,
  Globe2,
  KeyRound,
  Network,
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
  "Pitch deck for Ultramar Port of Call, a Uniswap v4 Specialized Markets hookathon demo for passport-gated private-market capital windows.";
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
    "private-market capital windows",
    "custom accounting hook",
    "Ultramar Capital",
  ],
});

const problemRows = [
  ["Language", "Investors cannot inspect local operating proof with enough context."],
  ["Eligibility", "Issuer, jurisdiction, NDA, transfer policy, and caps sit outside settlement."],
  ["Execution", "A public AMM cannot know when a private window is valid or stale."],
] as const;

const abloLoop = [
  ["Travel", "Open a capital port and meet the issuer before the transaction surface."],
  ["Guide", "Translate diligence, store economics, use of funds, and risk notes."],
  ["Passport", "Attach KYC/KYB, jurisdiction, NDA, allocation, and transfer policy checks."],
  ["Window", "Execute exact-input USDC only through a v4 hook with custom accounting."],
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
    body: "beforeSwapReturnDelta consumes the payment side and returns window-priced issuer-token output.",
  },
  {
    icon: ShieldCheck,
    label: "Market boundary",
    body: "Public add/remove liquidity reverts; the pool is a specialized capital window, not a public AMM.",
  },
] as const;

const proofRows = [
  ["Approved settlement", "1,500 USDC -> 1,454.54 LCX"],
  ["Blocked paths", "missing passport / generic router / expired / min output / replay / stale oracle"],
  ["Foundry suite", "26 tests, including hook permission bits and router-bound passport digest"],
  ["Testnet dry-run", "Base Sepolia PoolManager, mined 0xa88 hook mask, window 1 smoke swap"],
] as const;

const judgeClaims = [
  ["Uniqueness", "Ablo for capital is easy to remember, but the mechanism is concrete v4 custom accounting."],
  ["Impact", "A reusable pattern for asset-class-specific markets where constraints become settlement rules."],
  ["Functionality", "Frontend, simulator, Solidity tests, local demo script, capture script, and testnet dry-run path."],
  ["Presentation", "One sentence carries the story: the hook is the market boundary."],
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
                Port of Call makes the hook a passport checkpoint for private-market capital.
              </h1>
              <p className="mt-6 max-w-3xl text-pretty text-lg leading-7 text-on-surface-variant md:text-xl">
                An Ablo-style product loop wrapped around a real Uniswap v4 hook: investors travel
                to a local business, receive a signed passport, and settle only inside a specialized
                capital window.
              </p>
            </div>

            <div className="mt-10 grid gap-1 bg-border-muted md:grid-cols-3">
              <DeckMetric label="Theme" value="Specialized Markets" />
              <DeckMetric label="Asset" value="Lavanderias CX" />
              <DeckMetric label="Proof" value="26 hook tests" />
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
                The memorable product is travel. The durable mechanism is settlement control.
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
        eyebrow="02 / Product loop"
        title="Ablo for capital: travel, guide, passport, window."
        body="The investor enters a capital port before any buy button appears. The app makes private-market context legible, then turns eligibility into signed execution context."
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
        eyebrow="03 / Specialized market"
        title="A generic AMM is the wrong primitive for this asset class."
        body="Private operating-business capital has discrete eligibility, ticket size, timing, issuer-proof freshness, and transfer constraints. The market needs those rules inside settlement."
        icon={Network}
      >
        <div className="grid min-w-0 gap-1 bg-border-muted lg:grid-cols-[0.85fr_1.15fr]">
          <div className="min-w-0 bg-surface-paper p-5 text-surface-ink md:p-6">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
              Submission angle
            </p>
            <h3 className="mt-4 font-serif text-3xl font-semibold leading-tight">
              Specialized Markets, with Yield-Protected AMM as secondary proof.
            </h3>
            <p className="mt-4 text-sm leading-6 text-surface-container">
              The official Tally form lists UHI8 Specialized Markets. Port of Call treats the hook
              as an asset-class-specific market boundary rather than a public liquidity pool.
            </p>
          </div>
          <div className="grid min-w-0 gap-1 bg-border-muted sm:grid-cols-2">
            <Signal label="Blocked" value="public LP behavior" />
            <Signal label="Accepted" value="router-bound exact input" />
            <Signal label="Checked" value="caps, nonce, deadline, oracle" />
            <Signal label="Returned" value="window-priced LCX delta" />
          </div>
        </div>
      </DeckSlide>

      <DeckSlide
        eyebrow="04 / v4 mechanism"
        title="The hook is not decoration. It is the market boundary."
        body="Every demo state maps to a v4 callback, router rule, or event proof that judges can inspect in code."
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
        eyebrow="05 / Proof paths"
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
        eyebrow="06 / Judge frame"
        title="The submission is built around the four scoring questions."
        body="The story stays crisp for non-technical judges, while the code gives technical reviewers enough surface to verify the mechanism."
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
            Uniswap v4 can host private-market windows without pretending they are public AMMs.
          </h2>
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
