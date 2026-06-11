import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactDir = resolve(repoRoot, "artifacts/hookathon");
const screenshotDir = resolve(artifactDir, "public-render-qa");
const reportPath = resolve(artifactDir, "public-render-qa-latest.md");
const jsonPath = resolve(artifactDir, "public-render-qa-latest.json");
const baseUrl = (process.env.HOOKATHON_PUBLIC_QA_BASE_URL ?? "https://ultramar.capital").replace(/\/$/, "");

const pages = [
  {
    name: "demo",
    url: `${baseUrl}/hookathon/port-of-call`,
    markers: [
      "Port of Call turns operating businesses into v4 investment ports.",
      "The hook is the market boundary.",
      "Market readiness",
      "Walmart lesson",
      "The market pays for administration that can absorb capital.",
      "Investment port stack",
      "Debt or equity can open a route.",
      "Pricing policy",
      "Fixed price window",
      "Step curve window",
      "Demo app",
      "Choose the capital route before the swap.",
      "Capital route intake",
      "Equity window",
      "Debt covenant preview",
      "Current asset coverage gate",
      "Issuer data -> verified claim -> passport -> v4 hook",
      "One hook, five judge-visible outcomes.",
      "Most active windows should be fixed",
      "effective 1.0312",
      "Specialized Markets",
      "custom accounting",
      "Base Sepolia proof",
      "Winning scorecard",
      "Source branch",
    ],
  },
  {
    name: "deck",
    url: `${baseUrl}/hookathon/port-of-call/deck`,
    markers: [
      "Port of Call turns operating businesses into v4 investment ports.",
      "UHI8 Specialized Markets",
      "A port can open equity, debt, secondary transfer, or conversion routes.",
      "Debt covenant preview",
      "Current asset coverage gate switches route output",
      "Pre-money and FX become signed window terms",
      "Snapshot, then fixed",
      "Fixed window",
      "Floating policy",
      "FX snapshot locked",
      "Hook step curve",
      "1.0312",
      "effective 1.0312",
      "27 hook tests",
      "exact step-curve pricing",
      "Uniswap v4 can host private-market investment ports without pretending they are public AMMs.",
      "Uniqueness",
      "Demo video",
      "Base Sepolia proof",
      "Winning scorecard",
      "Source branch",
    ],
  },
];

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 1000 },
];

async function waitForVisibleImages(page) {
  await page
    .waitForFunction(
      () =>
        Array.from(document.images)
          .filter((image) => {
            const rect = image.getBoundingClientRect();
            const style = window.getComputedStyle(image);
            return (
              rect.width > 16 &&
              rect.height > 16 &&
              rect.bottom >= 0 &&
              rect.top <= window.innerHeight &&
              style.visibility !== "hidden" &&
              style.display !== "none"
            );
          })
          .every((image) => image.complete && image.naturalWidth > 0),
      undefined,
      { timeout: 10_000 },
    )
    .catch(() => {});
}

async function clickAndWaitPressed(page, locator) {
  await locator.scrollIntoViewIfNeeded();
  await locator.click();
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if ((await locator.getAttribute("aria-pressed")) === "true") {
      return;
    }
    await page.waitForTimeout(100);
  }
}

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
  for (const target of pages) {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport });
      const label = `${target.name}/${viewport.name}`;
      const screenshotPath = resolve(screenshotDir, `${target.name}-${viewport.name}.png`);

      try {
        const response = await page.goto(target.url, { waitUntil: "domcontentloaded", timeout: 45_000 });
        await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
        await waitForVisibleImages(page);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        const screenshotBytes = statSync(screenshotPath).size;
        const metrics = await page.evaluate((markers) => {
          const bodyText = document.body?.innerText ?? "";
          const main = document.querySelector("main");
          const visibleImages = Array.from(document.images).filter((image) => {
            const rect = image.getBoundingClientRect();
            const style = window.getComputedStyle(image);
            return (
              rect.width > 16 &&
              rect.height > 16 &&
              rect.bottom >= 0 &&
              rect.top <= window.innerHeight &&
              style.visibility !== "hidden" &&
              style.display !== "none"
            );
          });
          const brokenVisibleImages = visibleImages.filter((image) => !image.complete || image.naturalWidth <= 0);
          const viewportOverflowing = Array.from(document.querySelectorAll("body *")).filter((element) => {
            const rect = element.getBoundingClientRect();
            const style = window.getComputedStyle(element);
            return (
              rect.width > 1 &&
              rect.height > 1 &&
              style.visibility !== "hidden" &&
              style.display !== "none" &&
              (rect.left < -1 || rect.right > window.innerWidth + 1)
            );
          });
          const internalOverflowing = Array.from(document.querySelectorAll("body *")).filter((element) => {
            const htmlElement = element;
            return htmlElement.scrollWidth > htmlElement.clientWidth + 8;
          });

          return {
            title: document.title,
            h1: document.querySelector("h1")?.textContent?.trim() ?? "",
            bodyTextLength: bodyText.length,
            markerResults: markers.map((marker) => ({
              marker,
              ok: bodyText.toLowerCase().includes(marker.toLowerCase()),
            })),
            mainHeight: main ? Math.round(main.getBoundingClientRect().height) : 0,
            visibleImageCount: visibleImages.length,
            brokenVisibleImageCount: brokenVisibleImages.length,
            bodyScrollWidth: document.documentElement.scrollWidth,
            bodyClientWidth: document.documentElement.clientWidth,
            viewportOverflowingCount: viewportOverflowing.length,
            viewportOverflowingPreview: viewportOverflowing.slice(0, 5).map((element) => ({
              tag: element.tagName,
              text: element.textContent?.trim().slice(0, 80) ?? "",
            })),
            internalOverflowingCount: internalOverflowing.length,
            internalOverflowingPreview: internalOverflowing.slice(0, 5).map((element) => ({
              tag: element.tagName,
              text: element.textContent?.trim().slice(0, 80) ?? "",
            })),
          };
        }, target.markers);

        const interactiveResults = [];

        if (target.name === "demo" && viewport.name === "desktop") {
          const demoSection = page.locator("section", { hasText: "Choose the capital route before the swap." }).first();
          await demoSection.scrollIntoViewIfNeeded();
          const debtButton = demoSection.getByRole("button", { name: /Debt covenant preview/i });
          const staleButton = demoSection.getByRole("button", { name: /Stale oracle/i });
          await clickAndWaitPressed(page, debtButton);
          await clickAndWaitPressed(page, staleButton);

          const debtText = (await demoSection.innerText()).toLowerCase();
          const debtPressed = await debtButton.getAttribute("aria-pressed");
          const stalePressed = await staleButton.getAttribute("aria-pressed");
          const debtScreenshotPath = resolve(screenshotDir, `${target.name}-${viewport.name}-debt-route.png`);
          await demoSection.screenshot({ path: debtScreenshotPath });
          const debtScreenshotBytes = statSync(debtScreenshotPath).size;

          interactiveResults.push(
            [
              "Debt route click state",
              debtPressed === "true" && stalePressed === "true",
              `debt=${debtPressed}, stale=${stalePressed}`,
            ],
            [
              "Debt route copy switches output",
              debtText.includes("a stale coverage proof closes the debt route.") &&
                debtText.includes("access blocked") &&
                debtText.includes("coverage ratio proof exceeds staleness limit") &&
                debtText.includes("debt preview: covenant gates map to the same hook boundary model"),
              "stale covenant preview markers",
            ],
            ["Debt route screenshot captured", debtScreenshotBytes > 50_000, `${relative(debtScreenshotPath)} ${debtScreenshotBytes} bytes`],
          );
        }

        const results = [
          ["HTTP 2xx", Boolean(response?.ok()), String(response?.status() ?? "no response")],
          ["Page title present", metrics.title.length > 0, metrics.title],
          ["H1 present", metrics.h1.length > 0, metrics.h1],
          [
            "Expected content markers",
            metrics.markerResults.every((marker) => marker.ok),
            metrics.markerResults.map((marker) => `${marker.ok ? "ok" : "missing"}: ${marker.marker}`).join("; "),
          ],
          [
            "Nonblank rendered body",
            metrics.bodyTextLength > 1000 && metrics.mainHeight > 500,
            `${metrics.bodyTextLength} chars, main ${metrics.mainHeight}px`,
          ],
          [
            "Visible media loaded",
            metrics.visibleImageCount > 0 && metrics.brokenVisibleImageCount === 0,
            `${metrics.visibleImageCount} visible, ${metrics.brokenVisibleImageCount} broken`,
          ],
          ["Screenshot captured", screenshotBytes > 50_000, `${screenshotBytes} bytes`],
          ["No page-level horizontal overflow", metrics.bodyScrollWidth <= metrics.bodyClientWidth + 1, `${metrics.bodyScrollWidth}/${metrics.bodyClientWidth}`],
          ...interactiveResults,
        ];

        checks.push({
          label,
          target,
          viewport,
          url: target.url,
          screenshotPath,
          screenshotBytes,
          metrics,
          results,
        });
      } catch (error) {
        checks.push({
          label,
          target,
          viewport,
          url: target.url,
          screenshotPath,
          screenshotBytes: 0,
          metrics: {},
          results: [["Page loaded", false, error instanceof Error ? error.message : String(error)]],
        });
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}

const failures = checks.flatMap((check) =>
  check.results
    .filter(([, ok]) => !ok)
    .map(([label, , evidence]) => `${check.label}: ${label} (${evidence})`),
);
const generatedAt = new Date().toISOString();

const report = `# Hookathon public render QA

Generated: ${generatedAt}

Base URL: ${baseUrl}

## Verdict

${failures.length === 0 ? "Production demo and deck render correctly in browser viewports." : "Production render QA needs attention."}

Failures: ${failures.length}

## Checks

| Status | Item | Evidence |
| --- | --- | --- |
${checks
  .flatMap((check) => check.results.map(([label, ok, evidence]) => row(ok, `${check.label}: ${label}`, evidence)))
  .join("\n")}

## Screenshots

${checks.map((check) => `- ${check.label}: \`${relative(check.screenshotPath)}\``).join("\n")}

## Failures

${failures.length > 0 ? failures.map((failure) => `- ${failure}`).join("\n") : "- None"}
`;

writeFileSync(reportPath, report);
writeFileSync(
  jsonPath,
  JSON.stringify(
    {
      generatedAt,
      baseUrl,
      failures,
      checks: checks.map((check) => ({
        label: check.label,
        url: check.url,
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

console.log(`Hookathon public render QA: ${failures.length === 0 ? "ready" : "failed"}`);
console.log(reportPath);

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
}
