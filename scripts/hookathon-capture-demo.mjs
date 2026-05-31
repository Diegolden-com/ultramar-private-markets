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
    ["yarn", "workspace", "@ultramar/ultramar", "dev", "--port", String(port)],
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

async function scrollToText(page, text, options = {}) {
  const { exact = false } = options;
  await page
    .getByText(text, { exact })
    .first()
    .evaluate((element) => element.scrollIntoView({ block: "center", inline: "nearest" }));
  await page.waitForTimeout(450);
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
await page.waitForTimeout(900);
frames.push(await captureFrame(page, "01-hero-port-of-call", "Hero with sandbox/non-offer badges."));

await scrollToText(page, "Travel feed");
frames.push(await captureFrame(page, "02-travel-feed", "Ablo-style travel feed and Lavanderias CX context."));

await scrollToText(page, "Capital window quote", { exact: true });
frames.push(await captureFrame(page, "03-passport-and-quote", "Passport checks and expected LCX output."));

await scrollToText(page, "Scenario simulator");
await page.getByRole("button", { name: /Approved/i }).click();
await page.waitForTimeout(600);
frames.push(await captureFrame(page, "04-approved-scenario", "Approved exact-input custom-accounting path."));

await page.getByRole("button", { name: /Generic router/i }).click();
await page.waitForTimeout(600);
frames.push(await captureFrame(page, "05-generic-router-revert", "Generic router bypass rejection."));

await page.getByRole("button", { name: /Replay/i }).click();
await page.waitForTimeout(600);
frames.push(await captureFrame(page, "06-replay-revert", "Nonce replay rejection."));

await scrollToText(page, "Submission claim");
frames.push(await captureFrame(page, "07-specialized-markets-claim", "Primary Specialized Markets claim."));

await page.goto(deckUrl, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
await page.waitForTimeout(450);
frames.push(await captureFrame(page, "08-pitch-deck-close", "Pitch deck closing claim for Tally deck link."));

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
2. Travel feed: Ablo-style local-business discovery.
3. Passport and quote.
4. Approved scenario.
5. Generic-router or replay rejection.
6. Specialized Markets claim.
7. Pitch deck close.
8. Terminal proof from \`corepack yarn hookathon:video:proof\`.
`;

writeFileSync(manifestPath, manifest);

console.log("Hookathon capture assets generated.");
console.log(manifestPath);
if (videoPath) console.log(videoPath);
for (const frame of frames) console.log(frame.path);

if (serverProcess) {
  serverProcess.kill("SIGTERM");
}
