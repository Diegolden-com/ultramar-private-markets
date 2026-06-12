import { spawn } from "node:child_process";
import { mkdirSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(repoRoot, "artifacts/hookathon");
const frameDir = resolve(outDir, "frames");
const videoDir = resolve(outDir, "video");
const manifestPath = resolve(outDir, "capture-manifest-latest.md");
const port = Number(process.env.HOOKATHON_CAPTURE_PORT ?? 3000);
const baseUrl = process.env.HOOKATHON_CAPTURE_URL ?? `http://localhost:${port}`;
const demoUrl = `${baseUrl}/hookathon/port-of-call`;
const deckUrl = `${baseUrl}/hookathon/port-of-call/deck`;

rmSync(frameDir, { recursive: true, force: true });
rmSync(videoDir, { recursive: true, force: true });
mkdirSync(frameDir, { recursive: true });
mkdirSync(videoDir, { recursive: true });

let serverProcess;

async function canReachDemo() {
  try {
    const response = await fetch(demoUrl, { signal: AbortSignal.timeout(2_000) });
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForDemo() {
  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    if (await canReachDemo()) return;
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
  }
  throw new Error(`Timed out waiting for ${demoUrl}`);
}

async function ensureServer() {
  if (await canReachDemo()) return false;

  serverProcess = spawn(
    "corepack",
    ["yarn", "workspace", "@ultramar/ultramar", "dev", "--webpack", "--port", String(port)],
    {
      cwd: repoRoot,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  serverProcess.stdout.on("data", (chunk) => process.stdout.write(chunk));
  serverProcess.stderr.on("data", (chunk) => process.stderr.write(chunk));

  await waitForDemo();
  return true;
}

async function captureFrame(page, name, note) {
  const path = resolve(frameDir, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  return { name, path, note };
}

async function captureSectionFrame(page, text, name, note) {
  const path = resolve(frameDir, `${name}.png`);
  await page.locator("section", { hasText: text }).first().screenshot({ path });
  return { name, path, note };
}

async function applyCaptureChrome(page) {
  await page.addStyleTag({
    content: `
      header,
      .dock,
      .fab,
      nextjs-portal,
      [data-nextjs-devtools],
      [data-nextjs-toast],
      [data-nextjs-dialog-overlay],
      [data-nextjs-devtools-button] {
        display: none !important;
      }
    `,
  });
  await page.waitForTimeout(100);
}

async function scrollToText(page, text, options = {}) {
  const { exact = false, block = "center" } = options;
  await page
    .getByText(text, { exact })
    .first()
    .evaluate((element, scrollBlock) => element.scrollIntoView({ block: scrollBlock, inline: "nearest" }), block);
  await page.waitForTimeout(450);
}

async function scrollToVisibleText(page, text) {
  await page.evaluate((targetText) => {
    const candidates = Array.from(document.querySelectorAll("main p, main h2, main h3, main span, main text"));
    const target = candidates.find((element) => {
      const rect = element.getBoundingClientRect();
      return (
        element.textContent?.includes(targetText) &&
        rect.width > 0 &&
        rect.height > 0 &&
        window.getComputedStyle(element).visibility !== "hidden"
      );
    });
    target?.scrollIntoView({ block: "center", inline: "nearest" });
  }, text);
  await page.waitForTimeout(450);
}

async function scrollToPricingGraph(page) {
  await page.evaluate(() => {
    const graph = document.querySelector('main svg[role="img"][aria-label*="Visual pricing graph"]');
    graph?.scrollIntoView({ block: "center", inline: "nearest" });
  });
  await page.waitForTimeout(450);
}

async function clickScenarioButton(page, name) {
  await page.getByRole("button", { name }).click({ noWaitAfter: true });
  await page.waitForTimeout(600);
}

function latestVideoFile() {
  const files = readdirSync(videoDir)
    .filter((file) => file.endsWith(".webm"))
    .map((file) => resolve(videoDir, file));
  return files.sort((a, b) => statSync(a).mtimeMs - statSync(b).mtimeMs).at(-1);
}

const startedServer = await ensureServer();
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
  recordVideo: {
    dir: videoDir,
    size: { width: 1280, height: 720 },
  },
});

const page = await context.newPage();
const frames = [];

await page.goto(demoUrl, { waitUntil: "networkidle" });
await applyCaptureChrome(page);
await page.waitForTimeout(900);
frames.push(await captureFrame(page, "01-hero-port-of-call", "Hero with sandbox/non-offer badges."));

await scrollToText(page, "Market readiness");
frames.push(await captureFrame(page, "02-market-readiness", "Walmart lesson, LCX question, and investment port stack."));

await scrollToText(page, "Admin work becomes underwriting evidence.", { exact: true });
frames.push(
  await captureFrame(
    page,
    "03-operating-readiness-map",
    "Operating work mapped to issuer proof, equity, debt, and hook access.",
  ),
);

await scrollToText(page, "Choose the capital route before the swap.", { exact: true });
await clickScenarioButton(page, /Equity window/i);
await clickScenarioButton(page, /Submit eligible order/i);
await scrollToText(page, "Why this click matters", { exact: true });
frames.push(await captureFrame(page, "04-equity-route-approved", "Equity route meaning and approved LCX settlement."));

await clickScenarioButton(page, /Debt covenant preview/i);
await clickScenarioButton(page, /Use stale books/i);
await scrollToText(page, "Why this click matters", { exact: true });
frames.push(await captureFrame(page, "05-debt-covenant-stale", "Debt route meaning with stale coverage proof blocked."));

await clickScenarioButton(page, /Equity window/i);
await clickScenarioButton(page, /Send via generic router/i);
await scrollToText(page, "Why this click matters", { exact: true });
frames.push(await captureFrame(page, "06-generic-router-revert", "Generic router bypass rejection."));

await scrollToText(page, "Curve decision rule", { exact: true });
frames.push(await captureFrame(page, "07-pricing-policy", "Fixed baseline, step curve, and curve decision rule."));

await scrollToText(page, "Submission claim");
frames.push(await captureFrame(page, "08-specialized-markets-claim", "Primary Specialized Markets claim."));

await page.goto(deckUrl, { waitUntil: "networkidle" });
await applyCaptureChrome(page);
await page.waitForTimeout(600);
frames.push(
  await captureSectionFrame(
    page,
    "A port can open equity, debt, secondary transfer, or conversion routes.",
    "09-deck-capital-routes",
    "Deck capital routes frame for equity, debt, secondary, and conversion paths.",
  ),
);

await scrollToVisibleText(page, "FX snapshot locked");
await scrollToPricingGraph(page);
frames.push(await captureFrame(page, "10-pricing-proof", "Deck pricing bridge with exact step-curve proof."));

await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
await page.waitForTimeout(450);
frames.push(await captureFrame(page, "11-pitch-deck-close", "Pitch deck closing claim for Tally deck link."));

await page.close();
await context.close();
await browser.close();

let videoPath = latestVideoFile();
if (videoPath) {
  const stableVideoPath = resolve(videoDir, "demo-flow-latest.webm");
  if (videoPath !== stableVideoPath) {
    renameSync(videoPath, stableVideoPath);
    videoPath = stableVideoPath;
  }
}

const generatedAt = new Date().toISOString();
const manifest = `# Hookathon capture manifest

Generated: ${generatedAt}

Demo URL:

\`\`\`text
${demoUrl}
\`\`\`

Deck URL:

\`\`\`text
${deckUrl}
\`\`\`

Started local dev server: ${startedServer ? "yes" : "no, reused existing server"}

## Video

${videoPath ? `- ${videoPath}` : "- No video file was produced."}

## Frames

${frames.map((frame) => `- ${frame.name}: ${frame.path}\n  ${frame.note}`).join("\n")}

## Suggested video sequence

1. Hero and non-offer framing.
2. Market readiness: Walmart lesson, LCX question, investment port stack.
3. Operating readiness: admin work, margin route, coverage, and reporting freshness.
4. Equity route meaning and approved LCX settlement.
5. Debt route meaning and stale coverage rejection.
6. Generic-router route-binding rejection.
7. Pricing policy: fixed baseline, step curve, and curve decision rule.
8. Specialized Markets claim.
9. Deck capital routes.
10. Pricing proof.
11. Pitch deck close.
12. Terminal proof from \`corepack yarn hookathon:video:proof\`.
`;

writeFileSync(manifestPath, manifest);

console.log("Hookathon capture assets generated.");
console.log(manifestPath);
if (videoPath) console.log(videoPath);
for (const frame of frames) console.log(frame.path);

if (serverProcess) {
  serverProcess.kill("SIGTERM");
}
