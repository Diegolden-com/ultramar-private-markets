import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactDir = resolve(repoRoot, "artifacts/hookathon");
const reportPath = resolve(artifactDir, "public-links-latest.md");
const timeoutMs = 30_000;
const maxAttempts = 3;
const runId = Date.now().toString(36);

const checks = [
  {
    label: "Tally capstone form",
    url: "https://tally.so/r/VLV1pa",
    markers: ["tally"],
  },
  {
    label: "Public GitHub branch",
    url: "https://github.com/Diegolden-com/ultramar-private-markets/tree/codex/landing-wave-route-ui",
    markers: ["ultramar-private-markets"],
  },
  {
    label: "Raw root README Hookathon index",
    url: "https://raw.githubusercontent.com/Diegolden-com/ultramar-private-markets/codex/landing-wave-route-ui/README.md",
    cacheBust: true,
    markers: [
      "Uniswap v4 Hookathon: Port of Call",
      "the hook is the market boundary",
      "capital readiness gate",
      "disclosure-minimized claims",
      "https://ultramar.capital/hookathon/port-of-call",
      "https://ultramar.capital/hookathon/port-of-call/deck",
      "https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm",
      "https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/testnet-dry-run-latest.md",
      "docs/HOOKATHON_SUBMIT_NOW.md",
      "docs/HOOKATHON_TALLY_FINAL_PACKET.md",
      "corepack yarn hookathon:submission:operator",
    ],
  },
  {
    label: "Raw Tally submission copy",
    url: "https://raw.githubusercontent.com/Diegolden-com/ultramar-private-markets/codex/landing-wave-route-ui/docs/HOOKATHON_TALLY_SUBMISSION.md",
    cacheBust: true,
    markers: [
      "Ultramar Port of Call",
      "UHI8: Specialized Markets",
      "1.0312 demo USDC/restricted LCX",
      "testWindowStepCurveQuotesExactPricingExample",
      "active window is fixed after the signed FX snapshot",
      "floating policy can refresh the next window",
      "https://ultramar.capital/hookathon/port-of-call",
      "https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm",
      "https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/testnet-dry-run-latest.md",
    ],
  },
  {
    label: "Raw winning scorecard",
    url: "https://raw.githubusercontent.com/Diegolden-com/ultramar-private-markets/codex/landing-wave-route-ui/docs/HOOKATHON_WINNING_SCORECARD.md",
    cacheBust: true,
    markers: [
      "The hook is the market boundary",
      "capital readiness gate",
      "Disclosure-minimized claims",
      "Sandbox pre-money ledger -> FX snapshot locked -> signed demo term",
      "1.00 demo USDC/restricted LCX signed window term",
      "testWindowStepCurveQuotesExactPricingExample",
      "testnet-dry-run-latest.md",
      "Local package failures are `0`",
    ],
  },
  {
    label: "Raw submit-now checklist",
    url: "https://raw.githubusercontent.com/Diegolden-com/ultramar-private-markets/codex/landing-wave-route-ui/docs/HOOKATHON_SUBMIT_NOW.md",
    cacheBust: true,
    markers: [
      "Hookathon submit-now checklist",
      "Ready for Tally submit: yes",
      "corepack yarn hookathon:submission:receipt",
      "Completion evidence is valid only when the readiness report shows a real Tally receipt.",
    ],
  },
  {
    label: "Production demo route",
    url: "https://ultramar.capital/hookathon/port-of-call",
    markers: [
      "Port of Call Hookathon Demo",
      "Private-market capital for local businesses breaks before settlement",
      "Abloh-inspired market object",
      "Specialized Markets",
      "Open demo app",
      "Market readiness",
      "Walmart lesson",
      "The market pays for administration that can absorb capital.",
      "Investment port stack",
      "Capital readiness gate",
      "Admin control",
      "Margin route",
      "Operating work",
      "Admin work becomes underwriting evidence.",
      "Current asset coverage",
      "Proof privacy",
      "Private data becomes disclosure-minimized claims.",
      "Debt or equity can open a route.",
      "Product storyline",
      "The thesis in one route.",
      "Walmart lesson -&gt; LCX administration -&gt; capital route -&gt; v4 hook -&gt; audit trail",
      "Markets fund operating systems.",
      "A competitive laundry can become financeable.",
      "Settlement becomes operating memory.",
      "Product grammar",
      "Port, claim, route, window, passport, hook.",
      "Issuer workspace: operator, vehicle, documents, and operating proof.",
      "Disclosure-minimized admin proof: revenue, margin route, or coverage.",
      "Capital path: equity, debt, secondary transfer, or conversion.",
      "Signed period and terms for settlement inside one route.",
      "Wallet-bound authorization: eligibility, allocation, deadline, nonce.",
      "v4 market boundary: check route, return delta, emit audit record.",
      "Pricing policy",
      "Fixed price window",
      "Step curve window",
      "Curve decision rule",
      "If the issuer cannot explain the tranche logic, the curve should not exist.",
      "Demo app",
      "Choose the capital route before the swap.",
      "Route status",
      "Restricted LCX sandbox equity window settles demo USDC -&gt; sandbox restricted LCX.",
      "Debt covenant gate opens only with fresh coverage proof.",
      "Settlement math",
      "Curve executed inside the approved equity window.",
      "1,000 demo USDC / 1.00",
      "1,454.54 sandbox restricted LCX",
      "Submit eligible order",
      "Use stale books",
      "Send via generic router",
      "Capital route intake",
      "Equity window",
      "Debt covenant preview",
      "Current asset coverage gate",
      "Evidence chain",
      "Operation -&gt; claim -&gt; route -&gt; hook",
      "Margin expansion target plus fresh revenue proof.",
      "Capital route console",
      "Revenue + margin proof fresh",
      "Primary restricted LCX sandbox equity",
      "Investor passport active",
      "1,454.54 sandbox restricted LCX",
      "Why this click matters",
      "Disclosure-minimized claim",
      "Omnichannel operations are credible enough to open primary equity.",
      "Hook design decisions",
      "Router-bound passport",
      "beforeSwap gate",
      "Fixed-first pricing",
      "Issuer data",
      "v4 hook",
      "One hook, five route-visible outcomes.",
      "Most active windows should be fixed",
      "Output token",
      "LCX sandbox restricted issuer token",
      "1,500 demo USDC",
      "Signed sandbox window terms",
      "Not a public listing or live offer",
      "oracle proof gates access, not repricing",
      "1.0312 demo USDC/restricted LCX",
      "custom accounting",
      "Base Sepolia proof",
      "Winning scorecard",
      "testnet-dry-run-latest.md",
    ],
  },
  {
    label: "Production deck route",
    url: "https://ultramar.capital/hookathon/port-of-call/deck",
    markers: [
      "Port of Call Hookathon Pitch Deck",
      "Abloh-inspired product object",
      "Specialized Markets",
      "Markets pay for operating systems.",
      "Administration thesis",
      "A traditional company becomes financeable when its admin layer becomes inspectable.",
      "Walmart lesson",
      "LCX administration",
      "Omnichannel margin",
      "Capital route",
      "Walmart lesson -&gt; LCX administration -&gt; omnichannel margin -&gt; debt/equity route",
      "A port can open equity, debt, secondary transfer, or conversion routes.",
      "Private books become disclosure-minimized claims.",
      "The route points to an instrument, not a public offer.",
      "Debt covenant preview",
      "Current asset coverage gate switches route output",
      "Market boundary",
      "Sandbox pre-money and FX become a signed demo term",
      "Snapshot, then fixed",
      "Fixed window",
      "Floating policy",
      "FX snapshot locked",
      "Hook step curve",
      "sandbox restricted LCX",
      "1,500 demo USDC",
      "Approved demo settlement",
      "1.00 demo USDC / restricted LCX",
      "1.0312",
      "effective 1.0312",
      "27 hook tests",
      "exact signed demo term settlement",
      "Uniswap v4 can host private-market investment ports",
      "Route proof",
      "Base Sepolia proof",
      "Winning scorecard",
      "testnet-dry-run-latest.md",
    ],
  },
  {
    label: "Demo video release asset",
    url: "https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm",
    method: "HEAD",
    minBytes: 1_000_000,
  },
  {
    label: "Demo captions release asset",
    url: "https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.vtt",
    minBytes: 500,
    markers: [
      "Admin work becomes underwriting evidence.",
      "Daily close, margin route, current asset coverage",
      "Equity opens when operations become investible.",
      "omnichannel operations are credible enough to open primary equity",
      "A green ratio from stale books is not credit risk proof.",
      "If the issuer cannot explain the tranche logic, the curve should not exist.",
      "A port can open equity, debt, secondary transfer, or conversion routes.",
      "Uniswap v4 can host private-market investment ports",
      "testWindowStepCurveQuotesExactPricingExample",
      "1.0312 effective",
    ],
  },
  {
    label: "Testnet dry-run proof release asset",
    url: "https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/testnet-dry-run-latest.md",
    minBytes: 5_000,
    markers: [
      "Broadcast: no",
      "PoolManager 0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408",
      "CapitalWindowHook permission mask 0xa88",
      "Smoke swap quoted LCX output 1454545454545454545454",
      "SIMULATION COMPLETE",
    ],
  },
  {
    label: "Demo release page",
    url: "https://github.com/Diegolden-com/ultramar-private-markets/releases/tag/hookathon-port-of-call-demo-2026-05-31",
    markers: ["hookathon-port-of-call-demo-2026-05-31", "Release"],
  },
  {
    label: "Uniswap v4 whitepaper",
    url: "https://app.uniswap.org/whitepaper-v4.pdf",
    contentTypeIncludes: "application/pdf",
    minBytes: 100_000,
  },
  {
    label: "Atrium public Uniswap course",
    url: "https://atrium.academy/uniswap/course",
    markers: ["Uniswap Hook Incubator", "v4", "Course"],
  },
  {
    label: "Uniswap v4 architecture docs",
    url: "https://developers.uniswap.org/docs/protocols/v4/concepts/architecture",
    markers: ["PoolManager", "Singleton", "flash accounting"],
  },
  {
    label: "Uniswap v4 custom accounting docs",
    url: "https://developers.uniswap.org/docs/protocols/v4/guides/custom-accounting",
    markers: ["Custom Accounting", "beforeSwapReturnDelta", "custom accounting"],
  },
];

function normalizeHeader(headers, name) {
  return headers.get(name) ?? "";
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "user-agent": "Ultramar Hookathon public-link-check/1.0",
        accept: "text/html,application/xhtml+xml,text/plain,*/*",
        "cache-control": "no-cache",
        pragma: "no-cache",
      },
      ...options,
    });
  } finally {
    clearTimeout(timer);
  }
}

function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

function shouldRetry(result) {
  if (result.ok) return false;
  if (result.status === "error") return true;
  if (
    result.cacheBust &&
    result.status === 200 &&
    result.markerResults.some((marker) => !marker.ok)
  ) {
    return true;
  }
  return result.status === 429 || (Number.isInteger(result.status) && result.status >= 500);
}

function effectiveUrl(check, attempt) {
  if (!check.cacheBust) return check.url;
  const url = new URL(check.url);
  url.searchParams.set("_ultramar_check", `${runId}-${attempt}`);
  return url.toString();
}

async function runCheckOnce(check, attempt) {
  const method = check.method ?? "GET";
  const url = effectiveUrl(check, attempt);
  try {
    const response = await fetchWithTimeout(url, { method });
    const contentType = normalizeHeader(response.headers, "content-type");
    const contentLength = Number(normalizeHeader(response.headers, "content-length"));
    const body = method === "HEAD" ? "" : await response.text();
    const bodyBytes = Buffer.byteLength(body);
    const bytes =
      method === "HEAD" && Number.isFinite(contentLength) && contentLength > 0
        ? contentLength
        : bodyBytes || contentLength;
    const markerResults = (check.markers ?? []).map((marker) => ({
      marker,
      ok: body.toLowerCase().includes(marker.toLowerCase()),
    }));
    const ok =
      response.status >= 200 &&
      response.status < 300 &&
      markerResults.every((result) => result.ok) &&
      (!check.contentTypeIncludes || contentType.toLowerCase().includes(check.contentTypeIncludes.toLowerCase())) &&
      (!check.minBytes || bytes >= check.minBytes);

    return {
      ...check,
      ok,
      status: response.status,
      finalUrl: response.url,
      contentType,
      contentTypeOk: !check.contentTypeIncludes || contentType.toLowerCase().includes(check.contentTypeIncludes.toLowerCase()),
      bytes,
      markerResults,
      attempt,
    };
  } catch (error) {
    return {
      ...check,
      ok: false,
      status: "error",
      finalUrl: check.url,
      contentType: "",
      contentTypeOk: !check.contentTypeIncludes,
      bytes: 0,
      markerResults: (check.markers ?? []).map((marker) => ({ marker, ok: false })),
      error: error instanceof Error ? error.message : String(error),
      attempt,
    };
  }
}

async function runCheck(check) {
  let result;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    result = await runCheckOnce(check, attempt);
    if (!shouldRetry(result) || attempt === maxAttempts) return result;
    await sleep(500 * attempt);
  }
  return result;
}

function formatRows(results) {
  return results
    .map((result) => {
      const markers =
        result.markerResults.length === 0
          ? "n/a"
          : result.markerResults.map((marker) => `${marker.ok ? "ok" : "missing"}: \`${marker.marker}\``).join("<br>");
      const size = result.bytes > 0 ? `${result.bytes} bytes` : "unknown";
      const attempts = result.attempt > 1 ? `${result.attempt} attempts` : "1 attempt";
      return `| ${result.ok ? "Ready" : "Fail"} | ${result.label} | ${result.status} | ${attempts} | ${result.contentType || "unknown"} | ${size} | ${markers} | ${result.url} |`;
    })
    .join("\n");
}

const results = await Promise.all(checks.map(runCheck));
const failures = results.filter((result) => !result.ok);
const generatedAt = new Date().toISOString();

const report = `# Hookathon public link check

Generated: ${generatedAt}

## Verdict

${failures.length === 0 ? "All public submission links resolve." : "One or more public submission links failed."}

Failures: ${failures.length}

## Links

| Status | Item | HTTP | Attempts | Content-Type | Size | Markers | URL |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
${formatRows(results)}

## Failed Checks

${failures.length > 0 ? failures.map((failure) => `- ${failure.label}: ${failure.error ?? `HTTP ${failure.status}`}`).join("\n") : "- None"}
`;

mkdirSync(artifactDir, { recursive: true });
writeFileSync(reportPath, report);

console.log(`Hookathon public link check: ${failures.length === 0 ? "ready" : "failed"}`);
console.log(reportPath);

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure.label}: ${failure.error ?? `HTTP ${failure.status}`}`).join("\n"));
  process.exitCode = 1;
}
