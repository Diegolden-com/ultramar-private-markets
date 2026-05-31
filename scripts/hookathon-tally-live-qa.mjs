import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactDir = resolve(repoRoot, "artifacts/hookathon");
const screenshotDir = resolve(artifactDir, "tally-live-qa");
const reportPath = resolve(artifactDir, "tally-live-qa-latest.md");
const jsonPath = resolve(artifactDir, "tally-live-qa-latest.json");
const tallyUrl = "https://tally.so/r/VLV1pa";

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 1000 },
];

const markers = [
  "2026 UHI8",
  "Specialized Markets",
  "Project Title",
  "Email",
  "GitHub Repo",
  "Demo video link",
  "Problem / Background",
  "Impact:",
  "Challenges:",
  "Did you work with a team?",
  "Uniswap v4 Course",
];

function row(status, item, evidence) {
  return `| ${status ? "Ready" : "Fail"} | ${item} | ${evidence} |`;
}

function relative(path) {
  return path.replace(`${repoRoot}/`, "");
}

mkdirSync(screenshotDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const checks = [];

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    const screenshotPath = resolve(screenshotDir, `${viewport.name}.png`);

    try {
      const response = await page.goto(tallyUrl, { waitUntil: "domcontentloaded", timeout: 45_000 });
      await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
      await page.screenshot({ path: screenshotPath, fullPage: true });
      const screenshotBytes = statSync(screenshotPath).size;

      const metrics = await page.evaluate((expectedMarkers) => {
        const bodyText = document.body?.innerText ?? "";
        const lowerBody = bodyText.toLowerCase();
        return {
          title: document.title,
          bodyTextLength: bodyText.length,
          markerResults: expectedMarkers.map((marker) => ({
            marker,
            ok: lowerBody.includes(marker.toLowerCase()),
          })),
          formClosed:
            lowerBody.includes("form is closed") ||
            lowerBody.includes("not accepting responses") ||
            lowerBody.includes("no longer accepting"),
          visibleInputCount: Array.from(document.querySelectorAll("input, textarea, [contenteditable='true']")).filter(
            (element) => {
              const rect = element.getBoundingClientRect();
              const style = window.getComputedStyle(element);
              return rect.width > 4 && rect.height > 4 && style.visibility !== "hidden" && style.display !== "none";
            },
          ).length,
          bodyScrollWidth: document.documentElement.scrollWidth,
          bodyClientWidth: document.documentElement.clientWidth,
        };
      }, markers);

      const results = [
        ["HTTP 2xx", Boolean(response?.ok()), String(response?.status() ?? "no response")],
        ["Page title present", metrics.title.length > 0, metrics.title],
        [
          "Expected visible copy markers",
          metrics.markerResults.every((marker) => marker.ok),
          metrics.markerResults.map((marker) => `${marker.ok ? "ok" : "missing"}: ${marker.marker}`).join("; "),
        ],
        ["Form accepts responses", !metrics.formClosed, metrics.formClosed ? "closed marker found" : "no closed marker"],
        ["Interactive controls visible", metrics.visibleInputCount >= 8, `${metrics.visibleInputCount}`],
        ["Screenshot captured", screenshotBytes > 50_000, `${screenshotBytes} bytes`],
        ["No page-level horizontal overflow", metrics.bodyScrollWidth <= metrics.bodyClientWidth + 1, `${metrics.bodyScrollWidth}/${metrics.bodyClientWidth}`],
      ];

      checks.push({
        viewport,
        screenshotPath,
        screenshotBytes,
        metrics,
        results,
      });
    } catch (error) {
      checks.push({
        viewport,
        screenshotPath,
        screenshotBytes: 0,
        metrics: {},
        results: [["Page loaded", false, error instanceof Error ? error.message : String(error)]],
      });
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}

const failures = checks.flatMap((check) =>
  check.results
    .filter(([, ok]) => !ok)
    .map(([label, , evidence]) => `${check.viewport.name}: ${label} (${evidence})`),
);
const generatedAt = new Date().toISOString();

const report = `# Hookathon Tally live render QA

Generated: ${generatedAt}

Source: ${tallyUrl}

## Verdict

${failures.length === 0 ? "The public Tally form renders and appears open for submission." : "The public Tally form needs attention before submission."}

Failures: ${failures.length}

## Checks

| Status | Item | Evidence |
| --- | --- | --- |
${checks
  .flatMap((check) => check.results.map(([label, ok, evidence]) => row(ok, `${check.viewport.name}: ${label}`, evidence)))
  .join("\n")}

## Screenshots

${checks.map((check) => `- ${check.viewport.name}: \`${relative(check.screenshotPath)}\``).join("\n")}

## Failures

${failures.length > 0 ? failures.map((failure) => `- ${failure}`).join("\n") : "- None"}
`;

writeFileSync(reportPath, report);
writeFileSync(
  jsonPath,
  JSON.stringify(
    {
      generatedAt,
      tallyUrl,
      failures,
      checks: checks.map((check) => ({
        viewport: check.viewport,
        screenshotPath: relative(check.screenshotPath),
        screenshotBytes: check.screenshotBytes,
        metrics: check.metrics,
        results: check.results,
      })),
    },
    null,
    2,
  ),
);

console.log(`Hookathon Tally live QA: ${failures.length === 0 ? "ready" : "failed"}`);
console.log(reportPath);

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
}
