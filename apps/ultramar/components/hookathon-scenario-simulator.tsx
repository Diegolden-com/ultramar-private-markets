"use client";

import {
  CheckCircle2,
  CircleDollarSign,
  DatabaseZap,
  FileCheck2,
  Landmark,
  RefreshCw,
  Route,
  ShieldCheck,
  Timer,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

const focusVisibleClass =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-signal";

type ScenarioTone = "settled" | "reverted";
type ScenarioId = "approved" | "missing-passport" | "replay" | "stale-oracle" | "generic-router";
type CapitalRouteId = "equity-window" | "debt-covenant";
type CheckStatus = "pass" | "fail" | "idle";

type Scenario = {
  id: ScenarioId;
  label: string;
  actionLabel: string;
  state: string;
  tone: ScenarioTone;
  icon: typeof CheckCircle2;
  headline: string;
  guard: string;
  result: string;
  test: string;
  payment: string;
  output: string;
  fill: string;
  meaningRows: Array<{
    label: string;
    value: string;
  }>;
  rows: Array<{
    label: string;
    value: string;
    status: CheckStatus;
  }>;
};

type CapitalRoute = {
  id: CapitalRouteId;
  label: string;
  state: string;
  summary: string;
  icon: typeof CheckCircle2;
  headline: string;
  proof: string;
  window: string;
  facts: Array<{
    label: string;
    value: string;
  }>;
  evidenceChain: Array<{
    label: string;
    value: string;
  }>;
};

type ScenarioPresentation = {
  headline: string;
  result: string;
  test: string;
  inputLabel: string;
  input: string;
  outputLabel: string;
  output: string;
  resultLabel: string;
  meaningRows: Scenario["meaningRows"];
  rows: Scenario["rows"];
};

type RouteConsolePresentation = {
  headline: string;
  rails: Array<{
    label: string;
    value: string;
    detail: string;
    status: CheckStatus;
  }>;
};

type SettlementMathPresentation = {
  headline: string;
  summary: string;
  tone: ScenarioTone;
  rows: Array<{
    label: string;
    value: string;
    detail: string;
    status: CheckStatus;
  }>;
};

const routeStatusRows = [
  ["Implemented", "Restricted LCX sandbox equity window settles demo USDC -> sandbox restricted LCX."],
  ["Previewed", "Debt covenant gate opens only with fresh coverage proof."],
  ["Future pattern", "Secondary and conversion windows reuse the same boundary."],
] as const;

const demoThesisRows = [
  [
    "Market signal",
    "The Walmart lesson becomes a product test: can LCX administration turn a competitive laundry into an investible operating system?",
  ],
  [
    "Route choice",
    "Omnichannel margin opens equity; current asset coverage opens a debt covenant preview.",
  ],
  [
    "Hook proof",
    "The v4 hook returns output only when passport, route, proof freshness, and signed window terms agree.",
  ],
] as const;

const demoWalkthroughRows = [
  {
    time: "00:00",
    action: "Frame the market",
    line: "Walmart shows markets fund operating systems. LCX asks whether administration can make a crowded laundry financeable.",
  },
  {
    time: "00:18",
    action: "Submit eligible order",
    line: "The equity route opens because omnichannel margin and fresh revenue support the signed sandbox window.",
  },
  {
    time: "00:36",
    action: "Switch to debt route",
    line: "Debt is a different market route: current asset coverage decides whether creditor access can open.",
  },
  {
    time: "00:54",
    action: "Use stale books",
    line: "Stale proof closes the route without repricing the signed terms or moving issuer inventory.",
  },
  {
    time: "01:12",
    action: "Send via generic router",
    line: "A passport is not a public swap ticket. The approved route is the market boundary.",
  },
] as const;

const capitalRoutes: CapitalRoute[] = [
  {
    id: "equity-window",
    label: "Equity window",
    state: "Primary",
    summary: "Omnichannel margin signal",
    icon: CircleDollarSign,
    headline: "Omnichannel upgrade opens a restricted LCX sandbox equity window.",
    proof: "Operating data",
    window: "1,500 demo USDC order",
    facts: [
      {
        label: "Business signal",
        value:
          "Pickup and delivery density, store-level reporting, and admin discipline move the operator from commodity laundry to managed local infrastructure.",
      },
      {
        label: "Verified claim",
        value:
          "Disclosure-minimized claim: revenue freshness under 24h, use-of-funds pack ready, margin expansion target signed.",
      },
      {
        label: "Instrument",
        value: "Primary restricted LCX sandbox equity allocation through the issuer vehicle.",
      },
      {
        label: "Settlement path",
        value: "Investor passport plus signed window terms settle as demo USDC -> sandbox restricted LCX custom accounting.",
      },
    ],
    evidenceChain: [
      {
        label: "Operating work",
        value: "Route density, ticket mix, utilization, and daily close.",
      },
      {
        label: "Verified claim",
        value: "Margin expansion target plus fresh revenue proof.",
      },
      {
        label: "Capital route",
        value: "Primary equity window for expansion inventory.",
      },
      {
        label: "Hook boundary",
        value: "Eligibility, cap, freshness, and exact-input settlement.",
      },
    ],
  },
  {
    id: "debt-covenant",
    label: "Debt covenant preview",
    state: "Debt",
    summary: "Current asset coverage gate",
    icon: Landmark,
    headline: "Working-capital debt opens only while coverage remains green.",
    proof: "Coverage ratio",
    window: "Covenant gate",
    facts: [
      {
        label: "Business signal",
        value: "Admin takeover reconciles cash, receivables, short-term debt, and route collections daily.",
      },
      {
        label: "Verified claim",
        value:
          "Disclosure-minimized claim: current asset coverage >= 1.50x and liquidity proof fresh enough for the covenant.",
      },
      {
        label: "Instrument",
        value: "Short-term debt note with investor eligibility, disclosures, and covenant monitoring.",
      },
      {
        label: "Settlement path",
        value: "The same port can gate secondary transfers or step-to-equity triggers before settlement.",
      },
    ],
    evidenceChain: [
      {
        label: "Operating work",
        value: "Cash, receivables, route collections, and short-term liabilities reconciled.",
      },
      {
        label: "Verified claim",
        value: "Current asset coverage stays at or above the covenant threshold.",
      },
      {
        label: "Capital route",
        value: "Working-capital debt preview with creditor controls.",
      },
      {
        label: "Hook boundary",
        value: "Coverage freshness opens or closes route access.",
      },
    ],
  },
];

const scenarios: Scenario[] = [
  {
    id: "approved",
    label: "Approved",
    actionLabel: "Submit eligible order",
    state: "Settled",
    tone: "settled",
    icon: CheckCircle2,
    headline: "Equity window settles at the signed demo term.",
    guard: "beforeSwap",
    result: "WindowConsumed + CapitalWindowHookSwap",
    test: "testPrimaryConversionWindowExecutesCustomAccountingSwap",
    payment: "1,500 demo USDC",
    output: "1,454.54 sandbox restricted LCX",
    fill: "27% -> 29%",
    meaningRows: [
      {
        label: "Market read",
        value: "Omnichannel operations are credible enough to open primary equity.",
      },
      {
        label: "Investor action",
        value: "Subscribe at signed window terms instead of chasing a floating public quote.",
      },
      {
        label: "Hook boundary",
        value: "Settle once, emit the fill, and reduce remaining capacity deterministically.",
      },
    ],
    rows: [
      { label: "Passport", value: "0x4444 signed for window 1", status: "pass" },
      { label: "Oracle", value: "18 min proof inside max staleness", status: "pass" },
      { label: "Nonce", value: "fresh authorization", status: "pass" },
      { label: "Accounting", value: "exact input, minOut satisfied", status: "pass" },
    ],
  },
  {
    id: "missing-passport",
    label: "Missing passport",
    actionLabel: "Submit without passport",
    state: "Reverted",
    tone: "reverted",
    icon: XCircle,
    headline: "The hook rejects an empty travel document.",
    guard: "MissingPassport",
    result: "No registry consume, no swap event",
    test: "testMissingPassportHookDataReverts",
    payment: "1,500 demo USDC",
    output: "0 restricted LCX",
    fill: "unchanged",
    meaningRows: [
      {
        label: "Market read",
        value: "Interest is not eligibility; private-market access starts before settlement.",
      },
      {
        label: "Investor action",
        value: "Complete identity, jurisdiction, NDA, and allocation before submitting an order.",
      },
      {
        label: "Hook boundary",
        value: "Reject before registry consumption, inventory movement, or token output.",
      },
    ],
    rows: [
      { label: "Passport", value: "hookData absent", status: "fail" },
      { label: "Oracle", value: "not reached", status: "idle" },
      { label: "Nonce", value: "not consumed", status: "idle" },
      { label: "Accounting", value: "delta never returned", status: "idle" },
    ],
  },
  {
    id: "replay",
    label: "Replay",
    actionLabel: "Reuse signed stamp",
    state: "Reverted",
    tone: "reverted",
    icon: RefreshCw,
    headline: "The second attempt cannot reuse the stamp.",
    guard: "authorizationUsed",
    result: "Consumed nonce blocks settlement",
    test: "testAuthorizationReplayReverts",
    payment: "1,500 demo USDC",
    output: "0 restricted LCX",
    fill: "unchanged",
    meaningRows: [
      {
        label: "Market read",
        value: "A signed passport is a one-time capital instruction, not a reusable credential.",
      },
      {
        label: "Investor action",
        value: "Request a new authorization for any new order or allocation change.",
      },
      {
        label: "Hook boundary",
        value: "Consumed nonce prevents duplicate fills against the same private allocation.",
      },
    ],
    rows: [
      { label: "Passport", value: "signature matches wallet", status: "pass" },
      { label: "Oracle", value: "fresh proof", status: "pass" },
      { label: "Nonce", value: "already marked used", status: "fail" },
      { label: "Accounting", value: "delta never returned", status: "idle" },
    ],
  },
  {
    id: "stale-oracle",
    label: "Stale oracle",
    actionLabel: "Use stale books",
    state: "Reverted",
    tone: "reverted",
    icon: Timer,
    headline: "A stale issuer proof cannot open the equity window.",
    guard: "StaleOracle",
    result: "Registry consumption is blocked",
    test: "testStaleOracleReverts",
    payment: "1,500 demo USDC",
    output: "0 restricted LCX",
    fill: "unchanged",
    meaningRows: [
      {
        label: "Market read",
        value: "Old issuer data cannot support current access to equity inventory.",
      },
      {
        label: "Investor action",
        value: "Wait for fresh reporting before the port accepts a subscription.",
      },
      {
        label: "Hook boundary",
        value: "Freshness gates access without silently repricing approved terms.",
      },
    ],
    rows: [
      { label: "Passport", value: "0x4444 signed for window 1", status: "pass" },
      { label: "Oracle", value: "proof exceeds staleness limit", status: "fail" },
      { label: "Nonce", value: "not consumed", status: "idle" },
      { label: "Accounting", value: "delta never returned", status: "idle" },
    ],
  },
  {
    id: "generic-router",
    label: "Generic router",
    actionLabel: "Send via generic router",
    state: "Reverted",
    tone: "reverted",
    icon: Route,
    headline: "A valid stamp cannot ride the wrong route.",
    guard: "InvalidAuthorization",
    result: "Router-bound signature rejects bypass",
    test: "testGenericRouterWithCapitalPassportReverts",
    payment: "1,000 demo USDC",
    output: "0 restricted LCX",
    fill: "unchanged",
    meaningRows: [
      {
        label: "Market read",
        value: "Private-market access is route-specific; a passport is not a generic swap ticket.",
      },
      {
        label: "Investor action",
        value: "Use the capital route that counsel, issuer, and allocation approved.",
      },
      {
        label: "Hook boundary",
        value: "Sender binding blocks public-router bypass before any custom delta returns.",
      },
    ],
    rows: [
      { label: "Passport", value: "signed for CapitalWindowRouter", status: "pass" },
      { label: "Route", value: "sender is generic PoolSwapTest", status: "fail" },
      { label: "Nonce", value: "not consumed", status: "idle" },
      { label: "Accounting", value: "delta never returned", status: "idle" },
    ],
  },
];

function debtPresentation(scenario: Scenario): ScenarioPresentation {
  const rowsByScenario: Record<ScenarioId, Scenario["rows"]> = {
    approved: [
      { label: "Passport", value: "creditor passport signed for debt route", status: "pass" },
      { label: "Coverage", value: "current asset coverage 1.62x inside covenant", status: "pass" },
      { label: "Nonce", value: "fresh covenant authorization", status: "pass" },
      { label: "Route", value: "debt route can open; no token settlement in preview", status: "pass" },
    ],
    "missing-passport": [
      { label: "Passport", value: "creditor passport absent", status: "fail" },
      { label: "Coverage", value: "not reached", status: "idle" },
      { label: "Nonce", value: "not consumed", status: "idle" },
      { label: "Route", value: "debt access never opens", status: "idle" },
    ],
    replay: [
      { label: "Passport", value: "signature matches creditor wallet", status: "pass" },
      { label: "Coverage", value: "fresh covenant proof", status: "pass" },
      { label: "Nonce", value: "already marked used", status: "fail" },
      { label: "Route", value: "debt access never opens", status: "idle" },
    ],
    "stale-oracle": [
      { label: "Passport", value: "creditor passport signed for debt route", status: "pass" },
      { label: "Coverage", value: "coverage ratio proof exceeds staleness limit", status: "fail" },
      { label: "Nonce", value: "not consumed", status: "idle" },
      { label: "Route", value: "covenant gate stays closed", status: "idle" },
    ],
    "generic-router": [
      { label: "Passport", value: "signed for CapitalWindowRouter", status: "pass" },
      { label: "Route", value: "sender is generic PoolSwapTest", status: "fail" },
      { label: "Nonce", value: "not consumed", status: "idle" },
      { label: "Covenant", value: "debt access never opens", status: "idle" },
    ],
  };

  const headlines: Record<ScenarioId, string> = {
    approved: "Coverage covenant keeps the debt route open.",
    "missing-passport": "The debt route rejects a missing creditor passport.",
    replay: "A covenant stamp cannot be reused.",
    "stale-oracle": "A stale coverage proof closes the debt route.",
    "generic-router": "The wrong route cannot bypass creditor controls.",
  };

  const outputs: Record<ScenarioId, string> = {
    approved: "Debt route open",
    "missing-passport": "Access blocked",
    replay: "Access blocked",
    "stale-oracle": "Access blocked",
    "generic-router": "Access blocked",
  };

  const results: Record<ScenarioId, string> = {
    approved: "CovenantVerified + CapitalRouteOpened",
    "missing-passport": "No covenant route opened",
    replay: "Consumed covenant nonce blocks access",
    "stale-oracle": "Coverage proof rejected",
    "generic-router": "Router-bound creditor gate rejects bypass",
  };

  const meaningRowsByScenario: Record<ScenarioId, Scenario["meaningRows"]> = {
    approved: [
      {
        label: "Market read",
        value: "Working-capital debt is investible while current assets cover short-term obligations.",
      },
      {
        label: "Investor action",
        value: "Enter the creditor route while coverage, identity, and disclosures remain fresh.",
      },
      {
        label: "Hook boundary",
        value: "Open the debt route only while the covenant proof is green.",
      },
    ],
    "missing-passport": [
      {
        label: "Market read",
        value: "A creditor market still needs investor accreditation and route-specific documents.",
      },
      {
        label: "Investor action",
        value: "Attach the creditor passport before requesting covenant access.",
      },
      {
        label: "Hook boundary",
        value: "Close the route before any note access or settlement preview appears.",
      },
    ],
    replay: [
      {
        label: "Market read",
        value: "Debt capacity should not be consumed twice by the same covenant stamp.",
      },
      {
        label: "Investor action",
        value: "Request a fresh covenant authorization for a new creditor instruction.",
      },
      {
        label: "Hook boundary",
        value: "Nonce state protects the issuer from duplicate creditor access.",
      },
    ],
    "stale-oracle": [
      {
        label: "Market read",
        value: "A green ratio from stale books is not credit risk proof.",
      },
      {
        label: "Investor action",
        value: "Wait for a fresh current-asset coverage attestation before entering the note route.",
      },
      {
        label: "Hook boundary",
        value: "Coverage freshness closes debt access without touching equity pricing.",
      },
    ],
    "generic-router": [
      {
        label: "Market read",
        value: "Creditor controls belong to the debt route, not a generic swap path.",
      },
      {
        label: "Investor action",
        value: "Use the approved router that carries covenant context into the hook.",
      },
      {
        label: "Hook boundary",
        value: "Route binding keeps creditor rights from leaking into public settlement.",
      },
    ],
  };

  return {
    headline: headlines[scenario.id],
    result: results[scenario.id],
    test: "Debt preview: covenant gates map to the same hook boundary model",
    inputLabel: "Debt request",
    input: "Working-capital note",
    outputLabel: "Route output",
    output: outputs[scenario.id],
    resultLabel: "Preview result",
    meaningRows: meaningRowsByScenario[scenario.id],
    rows: rowsByScenario[scenario.id],
  };
}

function scenarioPresentation(routeId: CapitalRouteId, scenario: Scenario): ScenarioPresentation {
  if (routeId === "debt-covenant") {
    return debtPresentation(scenario);
  }

  return {
    headline: scenario.headline,
    result: scenario.result,
    test: scenario.test,
    inputLabel: "Exact input",
    input: scenario.payment,
    outputLabel: "Custom delta output",
    output: scenario.output,
    resultLabel: "Emitted result",
    meaningRows: scenario.meaningRows,
    rows: scenario.rows,
  };
}

function equityRouteConsole(scenario: Scenario): RouteConsolePresentation {
  const byScenario: Record<ScenarioId, RouteConsolePresentation> = {
    approved: {
      headline: "Equity route is live under signed window terms.",
      rails: [
        {
          label: "Claim status",
          value: "Revenue + margin proof fresh",
          detail: "Operating evidence can support the LCX primary window.",
          status: "pass",
        },
        {
          label: "Instrument",
          value: "Primary restricted LCX sandbox equity",
          detail: "Allocation remains inside the issuer vehicle.",
          status: "pass",
        },
        {
          label: "Access",
          value: "Investor passport active",
          detail: "Wallet, route, and nonce match the signed authorization.",
          status: "pass",
        },
        {
          label: "Settlement",
          value: "demo USDC -> sandbox restricted LCX custom delta",
          detail: "The hook consumes exact input and returns window output.",
          status: "pass",
        },
      ],
    },
    "missing-passport": {
      headline: "Equity route stops before market state changes.",
      rails: [
        {
          label: "Claim status",
          value: "Claim not reached",
          detail: "Issuer proof is not evaluated without a passport.",
          status: "idle",
        },
        {
          label: "Instrument",
          value: "Primary restricted LCX sandbox equity",
          detail: "Inventory remains untouched.",
          status: "idle",
        },
        {
          label: "Access",
          value: "Passport missing",
          detail: "Identity, route, and allocation context are absent.",
          status: "fail",
        },
        {
          label: "Settlement",
          value: "No delta returned",
          detail: "The hook rejects before custom accounting.",
          status: "idle",
        },
      ],
    },
    replay: {
      headline: "Equity route rejects the second use of the same stamp.",
      rails: [
        {
          label: "Claim status",
          value: "Revenue + margin proof fresh",
          detail: "The issuer claim is valid, but not sufficient alone.",
          status: "pass",
        },
        {
          label: "Instrument",
          value: "Primary restricted LCX sandbox equity locked",
          detail: "Capacity cannot be consumed twice.",
          status: "idle",
        },
        {
          label: "Access",
          value: "Authorization already used",
          detail: "Nonce state blocks duplicate private fills.",
          status: "fail",
        },
        {
          label: "Settlement",
          value: "No duplicate fill",
          detail: "The hook returns no custom delta.",
          status: "idle",
        },
      ],
    },
    "stale-oracle": {
      headline: "Equity route pauses when issuer evidence goes stale.",
      rails: [
        {
          label: "Claim status",
          value: "Issuer proof stale",
          detail: "Old operating data cannot support current access.",
          status: "fail",
        },
        {
          label: "Instrument",
          value: "Primary restricted LCX sandbox equity paused",
          detail: "Signed price stays fixed; availability closes.",
          status: "idle",
        },
        {
          label: "Access",
          value: "Passport pending freshness",
          detail: "The investor stamp waits for a current proof.",
          status: "idle",
        },
        {
          label: "Settlement",
          value: "No delta returned",
          detail: "Freshness gates access without repricing.",
          status: "idle",
        },
      ],
    },
    "generic-router": {
      headline: "Equity route rejects public-router bypass.",
      rails: [
        {
          label: "Claim status",
          value: "Revenue + margin proof fresh",
          detail: "The issuer claim does not authorize every path.",
          status: "pass",
        },
        {
          label: "Instrument",
          value: "Primary restricted LCX sandbox equity route",
          detail: "The instrument is bound to the capital router.",
          status: "idle",
        },
        {
          label: "Access",
          value: "Route binding failed",
          detail: "A valid stamp cannot ride a generic swap path.",
          status: "fail",
        },
        {
          label: "Settlement",
          value: "Public router blocked",
          detail: "No inventory moves outside the approved route.",
          status: "idle",
        },
      ],
    },
  };

  return byScenario[scenario.id];
}

function debtRouteConsole(scenario: Scenario): RouteConsolePresentation {
  const byScenario: Record<ScenarioId, RouteConsolePresentation> = {
    approved: {
      headline: "Debt route is open while the covenant is green.",
      rails: [
        {
          label: "Claim status",
          value: "Coverage 1.62x green",
          detail: "Current assets clear the covenant threshold.",
          status: "pass",
        },
        {
          label: "Instrument",
          value: "Working-capital note",
          detail: "Debt access opens without equity settlement.",
          status: "pass",
        },
        {
          label: "Access",
          value: "Creditor passport active",
          detail: "Route-specific document and nonce match.",
          status: "pass",
        },
        {
          label: "Settlement",
          value: "Debt route open",
          detail: "The hook boundary can gate note access or transfer.",
          status: "pass",
        },
      ],
    },
    "missing-passport": {
      headline: "Debt route stops before covenant access opens.",
      rails: [
        {
          label: "Claim status",
          value: "Coverage not reached",
          detail: "The covenant proof waits behind creditor eligibility.",
          status: "idle",
        },
        {
          label: "Instrument",
          value: "Working-capital note",
          detail: "No creditor rights are exposed.",
          status: "idle",
        },
        {
          label: "Access",
          value: "Creditor passport missing",
          detail: "The note route needs accredited route context.",
          status: "fail",
        },
        {
          label: "Settlement",
          value: "Debt route closed",
          detail: "No note access or transfer preview appears.",
          status: "idle",
        },
      ],
    },
    replay: {
      headline: "Debt route rejects a reused covenant stamp.",
      rails: [
        {
          label: "Claim status",
          value: "Coverage proof fresh",
          detail: "The ratio is green, but the instruction is spent.",
          status: "pass",
        },
        {
          label: "Instrument",
          value: "Working-capital note held",
          detail: "Debt capacity cannot be consumed twice.",
          status: "idle",
        },
        {
          label: "Access",
          value: "Covenant stamp reused",
          detail: "Nonce state blocks duplicate creditor access.",
          status: "fail",
        },
        {
          label: "Settlement",
          value: "Debt route closed",
          detail: "The hook returns no route opening.",
          status: "idle",
        },
      ],
    },
    "stale-oracle": {
      headline: "Debt route closes when coverage proof is stale.",
      rails: [
        {
          label: "Claim status",
          value: "Coverage proof stale",
          detail: "A green ratio from old books is not credit proof.",
          status: "fail",
        },
        {
          label: "Instrument",
          value: "Working-capital note paused",
          detail: "The debt route waits for current coverage.",
          status: "idle",
        },
        {
          label: "Access",
          value: "Creditor passport pending freshness",
          detail: "Eligibility alone does not open covenant access.",
          status: "idle",
        },
        {
          label: "Settlement",
          value: "Route closed",
          detail: "No note access while coverage is stale.",
          status: "fail",
        },
      ],
    },
    "generic-router": {
      headline: "Debt route rejects public-router bypass.",
      rails: [
        {
          label: "Claim status",
          value: "Coverage proof fresh",
          detail: "The covenant claim does not authorize every path.",
          status: "pass",
        },
        {
          label: "Instrument",
          value: "Working-capital note route",
          detail: "Creditor controls stay attached to the debt route.",
          status: "idle",
        },
        {
          label: "Access",
          value: "Route binding failed",
          detail: "A generic swap path cannot carry creditor rights.",
          status: "fail",
        },
        {
          label: "Settlement",
          value: "Debt route closed",
          detail: "No route opening outside approved context.",
          status: "idle",
        },
      ],
    },
  };

  return byScenario[scenario.id];
}

function routeConsolePresentation(routeId: CapitalRouteId, scenario: Scenario): RouteConsolePresentation {
  return routeId === "debt-covenant" ? debtRouteConsole(scenario) : equityRouteConsole(scenario);
}

function settlementMathPresentation(routeId: CapitalRouteId, scenario: Scenario): SettlementMathPresentation {
  if (routeId === "debt-covenant") {
    if (scenario.id === "approved") {
      return {
        headline: "Debt route opens; no token curve runs.",
        summary:
          "For debt, the hook is proving covenant access. The math is coverage freshness, not sandbox LCX output.",
        tone: "settled",
        rows: [
          {
            label: "Coverage",
            value: "1.62x current asset coverage",
            detail: "Above the 1.50x covenant threshold.",
            status: "pass",
          },
          {
            label: "Route output",
            value: "Working-capital debt route open",
            detail: "Creditor access can proceed while proof is fresh.",
            status: "pass",
          },
          {
            label: "Curve",
            value: "No sandbox LCX settlement",
            detail: "The custom curve belongs to the equity window, not this debt preview.",
            status: "idle",
          },
        ],
      };
    }

    return {
      headline: "Debt route math is not reached.",
      summary:
        "The hook closes the creditor route before note access because one route precondition failed.",
      tone: "reverted",
      rows: [
        {
          label: "Gate",
          value: scenario.guard,
          detail: "The selected scenario fails before debt access opens.",
          status: "fail",
        },
        {
          label: "Coverage",
          value: "No covenant route output",
          detail: "No note access, no transfer preview, and no token settlement.",
          status: "idle",
        },
        {
          label: "Curve",
          value: "Not applicable",
          detail: "Debt preview uses covenant gating instead of tranche pricing.",
          status: "idle",
        },
      ],
    };
  }

  if (scenario.id === "approved") {
    return {
      headline: "Signed settlement schedule executed inside the approved equity window.",
      summary:
        "The route passed passport, proof, nonce, and router checks, so the hook can split exact input across disclosed signed tranches.",
      tone: "settled",
      rows: [
        {
          label: "Base tranche",
          value: "1,000 demo USDC / 1.00",
          detail: "Returns 1,000.00 restricted LCX at the signed base term.",
          status: "pass",
        },
        {
          label: "Premium tranche",
          value: "500 demo USDC / 1.10",
          detail: "Returns 454.54 restricted LCX because the order crosses the tranche boundary.",
          status: "pass",
        },
        {
          label: "Custom delta",
          value: "1,454.54 sandbox restricted LCX",
          detail: "Effective term: 1.0312 demo USDC/restricted LCX. No public AMM price discovery.",
          status: "pass",
        },
      ],
    };
  }

  return {
    headline: "Curve not executed.",
    summary:
      "The hook rejects before custom accounting, so the signed tranche math cannot move inventory or consume capacity.",
    tone: "reverted",
    rows: [
      {
        label: "Gate",
        value: scenario.guard,
        detail: "The scenario fails before the equity window can settle.",
        status: "fail",
      },
      {
        label: "Input",
        value: scenario.payment,
        detail: "The attempted order never reaches window accounting.",
        status: "idle",
      },
      {
        label: "Output",
        value: "0 restricted LCX",
        detail: "No return delta, no fill, and no capacity consumption.",
        status: "idle",
      },
    ],
  };
}

export function HookathonScenarioSimulator() {
  const [selectedRouteId, setSelectedRouteId] = useState(capitalRoutes[0].id);
  const [selectedId, setSelectedId] = useState(scenarios[0].id);
  const capitalRoute = useMemo(
    () => capitalRoutes.find((item) => item.id === selectedRouteId) ?? capitalRoutes[0],
    [selectedRouteId],
  );
  const scenario = useMemo(
    () => scenarios.find((item) => item.id === selectedId) ?? scenarios[0],
    [selectedId],
  );
  const presentation = useMemo(
    () => scenarioPresentation(capitalRoute.id, scenario),
    [capitalRoute.id, scenario],
  );
  const consoleState = useMemo(
    () => routeConsolePresentation(capitalRoute.id, scenario),
    [capitalRoute.id, scenario],
  );
  const settlementMath = useMemo(
    () => settlementMathPresentation(capitalRoute.id, scenario),
    [capitalRoute.id, scenario],
  );
  const RouteIcon = capitalRoute.icon;
  const ScenarioIcon = scenario.icon;

  return (
    <section
      id="demo-app"
      className="scroll-mt-28 grid min-w-0 gap-1 border-b border-border-muted bg-border-muted md:scroll-mt-20 xl:grid-cols-[0.78fr_1.22fr]"
    >
      <div className="min-w-0 bg-surface p-5 md:p-8">
        <DatabaseZap className="h-5 w-5 text-status-signal" aria-hidden="true" />
        <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
          Demo app
        </p>
        <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight text-on-surface md:text-5xl">
          Choose the capital route before the swap.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-on-surface-variant">
          First ask what changed inside the business, what claim can be verified, and whether the
          issuer should open equity or debt. One hook, five route-visible outcomes.
        </p>

        <div className="mt-6 grid gap-1 bg-border-muted">
          <div className="bg-surface-ink p-4">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
              Demo thesis
            </p>
          </div>
          {demoThesisRows.map(([label, value]) => (
            <div key={label} className="grid min-w-0 gap-2 bg-surface-ink p-4 sm:grid-cols-[132px_1fr]">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface">
                {label}
              </p>
              <p className="text-sm leading-5 text-on-surface-variant">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-1 bg-border-muted">
          <div className="bg-surface-paper p-4 text-surface-ink">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-container">
              90-second walkthrough
            </p>
            <p className="mt-3 text-sm font-medium leading-5 text-surface-ink">
              Use this sequence to make every click prove one product claim.
            </p>
          </div>
          {demoWalkthroughRows.map((item) => (
            <div
              key={item.time}
              className="grid min-w-0 gap-3 bg-surface-ink p-4 sm:grid-cols-[64px_132px_1fr]"
            >
              <p className="font-mono text-[11px] font-semibold tabular-nums text-status-signal">
                {item.time}
              </p>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface">
                {item.action}
              </p>
              <p className="text-sm leading-5 text-on-surface-variant">{item.line}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 border border-status-signal/40 bg-status-signal/10 p-4">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
            Route status
          </p>
          <div className="mt-3 grid gap-3">
            {routeStatusRows.map(([label, value]) => (
              <div key={label} className="grid min-w-0 gap-2 sm:grid-cols-[112px_1fr]">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface">
                  {label}
                </p>
                <p className="text-sm leading-5 text-on-surface-variant">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-2">
          {capitalRoutes.map((item) => {
            const Icon = item.icon;
            const active = item.id === capitalRoute.id;

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedRouteId(item.id)}
                className={`min-w-0 border p-4 text-left transition ${
                  active
                    ? "border-status-signal bg-status-signal/10 text-on-surface"
                    : "border-border-muted bg-surface-ink text-on-surface-variant hover:border-status-signal/60 hover:text-on-surface"
                } ${focusVisibleClass}`}
              >
                <span className="flex min-w-0 items-center justify-between gap-3">
                  <Icon className="h-4 w-4 shrink-0 text-status-signal" aria-hidden="true" />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em]">
                    {item.state}
                  </span>
                </span>
                <span className="mt-4 block break-words font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
                  {item.label}
                </span>
                <span className="mt-2 block text-sm leading-5">{item.summary}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-1 bg-border-muted sm:grid-cols-2">
          <SimulatorStat label="Proof" value={capitalRoute.proof} />
          <SimulatorStat label="Route term" value={capitalRoute.window} />
          <SimulatorStat label="Guard" value={scenario.guard} />
          <SimulatorStat label="State" value={scenario.state} tone={scenario.tone} />
        </div>
      </div>

      <div className="min-w-0 bg-surface-paper p-5 text-surface-ink md:p-8">
        <div className="grid min-w-0 gap-1 bg-surface-container/20 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="min-w-0 bg-surface-ink p-5 text-on-surface">
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                  Capital route intake
                </p>
                <h3 className="mt-3 break-words font-serif text-3xl font-semibold leading-tight">
                  {capitalRoute.headline}
                </h3>
              </div>
              <RouteIcon className="h-5 w-5 shrink-0 text-status-signal" aria-hidden="true" />
            </div>
            <div className="mt-6 border-t border-border-muted pt-4">
              <p className="break-words font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface [overflow-wrap:anywhere]">
                Issuer data -&gt; verified claim -&gt; passport -&gt; v4 hook
              </p>
            </div>
          </div>

          <div className="grid min-w-0 gap-1 bg-surface-container/20">
            {capitalRoute.facts.map((fact) => (
              <PaperSignal key={fact.label} label={fact.label} value={fact.value} />
            ))}
          </div>
        </div>

        <div className="mt-6 bg-surface-ink p-4 text-on-surface">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
              Evidence chain
            </p>
            <p className="break-words text-right font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
              Operation -&gt; claim -&gt; route -&gt; hook
            </p>
          </div>
          <div className="mt-4 grid min-w-0 gap-1 bg-border-muted md:grid-cols-4">
            {capitalRoute.evidenceChain.map((item, index) => (
              <EvidenceStep key={item.label} step={index + 1} label={item.label} value={item.value} />
            ))}
          </div>
        </div>

        <div className="mt-6 grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {scenarios.map((item) => {
            const Icon = item.icon;
            const active = item.id === scenario.id;

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedId(item.id)}
                className={`min-h-20 min-w-0 border p-3 text-left transition sm:min-h-24 ${
                  active
                    ? "border-surface-ink bg-surface-ink text-on-surface"
                    : "border-surface-container/30 bg-surface-container/10 text-surface-container hover:border-surface-ink/60 hover:bg-surface-container/20"
                } ${focusVisibleClass}`}
              >
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      item.tone === "settled" ? "text-status-signal" : "text-destructive"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em]">
                    {item.state}
                  </span>
                </div>
                <span className="mt-4 block break-words font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
                  {item.actionLabel}
                </span>
                <span className="sr-only">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 bg-surface-ink p-4 text-on-surface">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
              Capital route console
            </p>
            <p className="max-w-xl text-sm font-medium leading-5 text-on-surface-variant sm:text-right">
              {consoleState.headline}
            </p>
          </div>
          <div className="mt-4 grid min-w-0 gap-1 bg-border-muted md:grid-cols-4">
            {consoleState.rails.map((rail) => (
              <ConsoleRailCell key={rail.label} rail={rail} />
            ))}
          </div>
        </div>

        <div className="mt-6 grid min-w-0 gap-1 bg-surface-container/20 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="min-w-0 bg-surface-paper p-4 text-surface-ink">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-container">
              Settlement math
            </p>
            <h3 className="mt-3 break-words font-serif text-3xl font-semibold leading-tight">
              {settlementMath.headline}
            </h3>
            <p className="mt-4 text-sm leading-6 text-surface-container">{settlementMath.summary}</p>
          </div>
          <div className="grid min-w-0 gap-1 bg-surface-container/20">
            {settlementMath.rows.map((row) => (
              <SettlementMathRow key={row.label} row={row} />
            ))}
          </div>
        </div>

        <div className="mt-6 grid min-w-0 gap-1 bg-surface-container/20 lg:grid-cols-3">
          <div className="min-w-0 bg-surface-ink p-4 text-on-surface lg:col-span-3">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
              Why this click matters
            </p>
          </div>
          {presentation.meaningRows.map((row) => (
            <MeaningCell key={row.label} label={row.label} value={row.value} />
          ))}
        </div>

        <div className="mt-6 grid min-w-0 gap-1 bg-surface-container/20 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="min-w-0 bg-surface-paper p-5">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center border ${
                  scenario.tone === "settled"
                    ? "border-status-signal/50 bg-status-signal/10"
                    : "border-destructive/50 bg-destructive/10"
                }`}
              >
                <ScenarioIcon
                  className={`h-5 w-5 ${
                    scenario.tone === "settled" ? "text-status-signal" : "text-destructive"
                  }`}
                  aria-hidden="true"
                />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-container">
                  {scenario.state}
                </p>
                <h3 className="mt-1 break-words font-serif text-3xl font-semibold leading-tight text-surface-ink">
                  {presentation.headline}
                </h3>
              </div>
            </div>

            <div className="mt-8 grid gap-1 bg-surface-container/20">
              <PaperSignal label={presentation.inputLabel} value={presentation.input} />
              <PaperSignal label={presentation.outputLabel} value={presentation.output} />
              <PaperSignal label={presentation.resultLabel} value={presentation.result} />
            </div>

            <div className="mt-6 border-t border-surface-container/25 pt-4">
              <div className="flex min-w-0 items-start gap-3">
                <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p className="min-w-0 break-words font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-container [overflow-wrap:anywhere]">
                  {presentation.test}
                </p>
              </div>
            </div>
          </div>

          <div className="min-w-0 bg-surface-ink p-5 text-on-surface">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                Hook checkpoints
              </p>
              <ShieldCheck className="h-4 w-4 text-status-signal" aria-hidden="true" />
            </div>
            <div className="mt-5 grid gap-1 bg-border-muted">
              {presentation.rows.map((row) => (
                <div
                  key={row.label}
                  className="grid min-w-0 gap-3 bg-surface-ink p-4 sm:grid-cols-[128px_28px_1fr]"
                >
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                    {row.label}
                  </p>
                  <StatusGlyph status={row.status} />
                  <p className="text-sm leading-5 text-on-surface-variant">{row.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SimulatorStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: ScenarioTone;
}) {
  return (
    <div className="min-w-0 bg-surface-ink p-4">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p
        className={`mt-2 break-words font-mono text-sm font-semibold uppercase tracking-[0.08em] ${
          tone === "reverted" ? "text-destructive" : "text-on-surface"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function PaperSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid min-w-0 gap-2 border-t border-surface-container/20 p-4 first:border-t-0 sm:grid-cols-[144px_1fr]">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-container">
        {label}
      </p>
      <p className="break-words text-sm font-medium leading-5 text-surface-ink">{value}</p>
    </div>
  );
}

function MeaningCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-surface-paper p-4">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-container">
        {label}
      </p>
      <p className="mt-3 text-sm font-medium leading-5 text-surface-ink">{value}</p>
    </div>
  );
}

function EvidenceStep({ step, label, value }: { step: number; label: string; value: string }) {
  return (
    <div className="min-w-0 bg-surface-ink p-4">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center border border-status-signal/50 font-mono text-[10px] font-semibold text-status-signal">
          {String(step).padStart(2, "0")}
        </span>
        <p className="text-right font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
          {label}
        </p>
      </div>
      <p className="mt-4 text-sm font-medium leading-5 text-on-surface">{value}</p>
    </div>
  );
}

function ConsoleRailCell({ rail }: { rail: RouteConsolePresentation["rails"][number] }) {
  const valueClass =
    rail.status === "pass"
      ? "text-status-signal"
      : rail.status === "fail"
        ? "text-destructive"
        : "text-on-surface";

  return (
    <div className="min-w-0 bg-surface-ink p-4">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
          {rail.label}
        </p>
        <StatusGlyph status={rail.status} />
      </div>
      <p className={`mt-4 break-words font-mono text-sm font-semibold uppercase tracking-[0.08em] ${valueClass}`}>
        {rail.value}
      </p>
      <p className="mt-3 text-sm leading-5 text-on-surface-variant">{rail.detail}</p>
    </div>
  );
}

function SettlementMathRow({ row }: { row: SettlementMathPresentation["rows"][number] }) {
  const valueClass =
    row.status === "pass"
      ? "text-status-signal"
      : row.status === "fail"
        ? "text-destructive"
        : "text-on-surface";

  return (
    <div className="grid min-w-0 gap-3 bg-surface-paper p-4 text-surface-ink sm:grid-cols-[132px_28px_1fr]">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-container">
        {row.label}
      </p>
      <StatusGlyph status={row.status} />
      <div className="min-w-0">
        <p className={`break-words font-mono text-sm font-semibold uppercase tracking-[0.08em] ${valueClass}`}>
          {row.value}
        </p>
        <p className="mt-2 text-sm leading-5 text-surface-container">{row.detail}</p>
      </div>
    </div>
  );
}

function StatusGlyph({ status }: { status: CheckStatus }) {
  if (status === "pass") {
    return <CheckCircle2 className="h-4 w-4 text-status-signal" aria-label="Pass" />;
  }

  if (status === "fail") {
    return <XCircle className="h-4 w-4 text-destructive" aria-label="Fail" />;
  }

  return <span className="mt-1 h-2 w-2 bg-surface-container/50" aria-label="Not reached" />;
}
