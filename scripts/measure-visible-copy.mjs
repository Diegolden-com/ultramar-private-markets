import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";

const baseUrl = process.env.COPY_BASE_URL ?? "http://localhost:3000";
const outputPath = process.argv[2];
const viewport = { width: 1440, height: 900 };
const auxiliaryRoutes = [
  "/api",
  "/system-status",
  "/auth/login",
  "/auth/sign-up",
  "/auth/sign-up-success",
  "/auth/forgot-password",
  "/auth/update-password",
  "/auth/error",
  "/private-equities/portfolio",
];
const excludedFromReductionTarget = new Set([
  "/legal",
  "/compliance",
  "/private-equities/legal",
]);

function countWords(text) {
  return text.match(/[\p{L}\p{N}]+(?:[’'\-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

async function sitemapRoutes() {
  const response = await fetch(`${baseUrl}/sitemap.xml`);
  if (!response.ok) throw new Error(`Unable to load sitemap: ${response.status}`);
  const xml = await response.text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => new URL(url).pathname);
}

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? chromium.executablePath(),
});
const page = await browser.newPage({ viewport });
const routes = [...new Set([...(await sitemapRoutes()), ...auxiliaryRoutes])];
const results = [];

for (const route of routes) {
  const response = await page.goto(`${baseUrl}${route}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  if (!response?.ok()) throw new Error(`${route} returned ${response?.status() ?? "no response"}`);
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => undefined);
  await page.waitForTimeout(250);

  const text = await page.evaluate(() => {
    const root = document.querySelector("main") ?? document.body;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const fragments = [];
    let node;

    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || parent.closest("header, footer, nav, script, style, [aria-hidden='true']")) continue;
      const style = window.getComputedStyle(parent);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) continue;
      if (parent.getClientRects().length === 0) continue;
      const value = node.textContent?.replace(/\s+/g, " ").trim();
      if (value) fragments.push(value);
    }

    return fragments.join(" ");
  });

  results.push({
    route,
    words: countWords(text),
    includedInReductionTarget: !excludedFromReductionTarget.has(route),
  });
}

await browser.close();

const totalWords = results.reduce((total, result) => total + result.words, 0);
const targetWords = results.reduce(
  (total, result) => total + (result.includedInReductionTarget ? result.words : 0),
  0,
);
const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  viewport,
  method:
    "Visible rendered text nodes inside <main>; excludes header, footer, nav, scripts, styles, aria-hidden content, display:none, visibility:hidden, zero-opacity, and non-rendered nodes.",
  excludedFromReductionTarget: [...excludedFromReductionTarget],
  totalWords,
  targetWords,
  routes: results,
};

const json = `${JSON.stringify(report, null, 2)}\n`;
if (outputPath) await writeFile(outputPath, json);
process.stdout.write(json);
