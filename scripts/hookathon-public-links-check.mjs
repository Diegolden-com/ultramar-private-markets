import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactDir = resolve(repoRoot, "artifacts/hookathon");
const reportPath = resolve(artifactDir, "public-links-latest.md");
const timeoutMs = 30_000;

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
    markers: [
      "Uniswap v4 Hookathon: Port of Call",
      "the hook is the market boundary",
      "https://ultramar.capital/hookathon/port-of-call",
      "https://ultramar.capital/hookathon/port-of-call/deck",
      "https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm",
      "https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/testnet-dry-run-latest.md",
      "corepack yarn hookathon:submission:operator",
    ],
  },
  {
    label: "Raw Tally submission copy",
    url: "https://raw.githubusercontent.com/Diegolden-com/ultramar-private-markets/codex/landing-wave-route-ui/docs/HOOKATHON_TALLY_SUBMISSION.md",
    markers: [
      "Ultramar Port of Call",
      "UHI8: Specialized Markets",
      "1.0312 USDC/LCX",
      "testWindowStepCurveQuotesExactPricingExample",
      "https://ultramar.capital/hookathon/port-of-call",
      "https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm",
      "https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/testnet-dry-run-latest.md",
    ],
  },
  {
    label: "Raw winning scorecard",
    url: "https://raw.githubusercontent.com/Diegolden-com/ultramar-private-markets/codex/landing-wave-route-ui/docs/HOOKATHON_WINNING_SCORECARD.md",
    markers: [
      "The hook is the market boundary",
      "Pre-money ledger -> FX snapshot locked -> Hook step curve",
      "testWindowStepCurveQuotesExactPricingExample",
      "testnet-dry-run-latest.md",
      "Local package failures are `0`",
    ],
  },
  {
    label: "Raw submit-now checklist",
    url: "https://raw.githubusercontent.com/Diegolden-com/ultramar-private-markets/codex/landing-wave-route-ui/docs/HOOKATHON_SUBMIT_NOW.md",
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
      "Specialized Markets",
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
      "Specialized Markets",
      "Pre-money and FX become signed window terms",
      "Snapshot, then fixed",
      "FX snapshot locked",
      "Hook step curve",
      "1.0312",
      "27 hook tests",
      "exact step-curve pricing",
      "Uniswap v4 can host private-market windows",
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
    markers: ["testWindowStepCurveQuotesExactPricingExample", "1.0312 effective"],
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

async function runCheck(check) {
  const method = check.method ?? "GET";
  try {
    const response = await fetchWithTimeout(check.url, { method });
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
    };
  }
}

function formatRows(results) {
  return results
    .map((result) => {
      const markers =
        result.markerResults.length === 0
          ? "n/a"
          : result.markerResults.map((marker) => `${marker.ok ? "ok" : "missing"}: \`${marker.marker}\``).join("<br>");
      const size = result.bytes > 0 ? `${result.bytes} bytes` : "unknown";
      return `| ${result.ok ? "Ready" : "Fail"} | ${result.label} | ${result.status} | ${result.contentType || "unknown"} | ${size} | ${markers} | ${result.url} |`;
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

| Status | Item | HTTP | Content-Type | Size | Markers | URL |
| --- | --- | ---: | --- | ---: | --- | --- |
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
