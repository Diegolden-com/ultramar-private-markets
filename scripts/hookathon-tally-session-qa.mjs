import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactDir = resolve(repoRoot, "artifacts/hookathon");
const sessionHtmlPath = resolve(artifactDir, "tally-browser-session-latest.html");
const sessionJsonPath = resolve(artifactDir, "tally-browser-session-latest.json");
const reportPath = resolve(artifactDir, "tally-browser-session-qa-latest.md");
const screenshotDir = resolve(artifactDir, "tally-session-qa");

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 1000 },
];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function row(status, item, evidence) {
  return `| ${status ? "Ready" : "Fail"} | ${item} | ${evidence} |`;
}

if (!existsSync(sessionHtmlPath) || !existsSync(sessionJsonPath)) {
  console.error("Missing Tally browser session pack. Run corepack yarn hookathon:tally:session first.");
  process.exit(1);
}

mkdirSync(screenshotDir, { recursive: true });

const session = readJson(sessionJsonPath);
const expectedRows = session.rows?.length ?? 0;
const rowsWithValues = (session.rows ?? []).filter((item) => {
  if (typeof item.value === "string") return item.value.trim().length > 0;
  if (item.value && typeof item.value === "object") return Object.keys(item.value).length > 0;
  return false;
}).length;

const browser = await chromium.launch();
const checks = [];
const screenshots = [];

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    await page.goto(pathToFileURL(sessionHtmlPath).href);
    await page.waitForLoadState("domcontentloaded");

    const screenshotPath = resolve(screenshotDir, `${viewport.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    screenshots.push({ ...viewport, path: screenshotPath });

    const metrics = await page.evaluate(() => {
      const fields = Array.from(document.querySelectorAll(".field"));
      const textareas = Array.from(document.querySelectorAll("textarea"));
      const buttons = Array.from(document.querySelectorAll("button[data-copy]"));
      const statusText = document.querySelector(".status")?.textContent?.trim() ?? "";
      const heading = document.querySelector("h1")?.textContent?.trim() ?? "";
      const firstValue = document.querySelector("textarea")?.value ?? "";
      const overflowing = Array.from(document.querySelectorAll("body *")).filter((element) => {
        const htmlElement = element;
        return htmlElement.scrollWidth > htmlElement.clientWidth + 1;
      });

      return {
        heading,
        fieldCount: fields.length,
        textareaCount: textareas.length,
        buttonCount: buttons.length,
        statusText,
        firstValue,
        bodyScrollWidth: document.documentElement.scrollWidth,
        bodyClientWidth: document.documentElement.clientWidth,
        overflowingCount: overflowing.length,
        overflowingPreview: overflowing.slice(0, 5).map((element) => ({
          tag: element.tagName,
          text: element.textContent?.trim().slice(0, 80) ?? "",
        })),
      };
    });

    checks.push({
      viewport,
      metrics,
      results: [
        ["Heading visible", metrics.heading === "Hookathon Tally Browser Session Pack", metrics.heading],
        ["All fill-plan fields rendered", metrics.fieldCount === expectedRows, `${metrics.fieldCount}/${expectedRows}`],
        ["Copy buttons match value controls", metrics.buttonCount === metrics.textareaCount, `${metrics.buttonCount}/${metrics.textareaCount}`],
        ["Value controls present", metrics.textareaCount === rowsWithValues, `${metrics.textareaCount}/${rowsWithValues}`],
        ["First value is project title", metrics.firstValue === "Ultramar Port of Call", metrics.firstValue],
        ["Submit-ready status shown", ["yes", "no"].includes(metrics.statusText), metrics.statusText],
        ["No page-level horizontal overflow", metrics.bodyScrollWidth <= metrics.bodyClientWidth + 1, `${metrics.bodyScrollWidth}/${metrics.bodyClientWidth}`],
        ["No element horizontal overflow", metrics.overflowingCount === 0, `${metrics.overflowingCount}`],
      ],
    });

    await page.close();
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

const report = `# Hookathon Tally browser session QA

Generated: ${generatedAt}

Source: \`artifacts/hookathon/tally-browser-session-latest.html\`

Session submit-ready: ${session.submitReady ? "yes" : "no"}

Remaining placeholders: ${session.remainingPlaceholders?.length ? session.remainingPlaceholders.join(", ") : "none"}

## Verdict

${failures.length === 0 ? "Browser session pack renders correctly." : "Browser session pack needs attention."}

Failures: ${failures.length}

## Checks

| Status | Item | Evidence |
| --- | --- | --- |
${checks
  .flatMap((check) => check.results.map(([label, ok, evidence]) => row(ok, `${check.viewport.name}: ${label}`, evidence)))
  .join("\n")}

## Screenshots

${screenshots.map((screenshot) => `- ${screenshot.name}: \`${screenshot.path.replace(`${repoRoot}/`, "")}\``).join("\n")}

## Failures

${failures.length > 0 ? failures.map((failure) => `- ${failure}`).join("\n") : "- None"}
`;

writeFileSync(reportPath, report);

console.log(`Hookathon Tally browser session QA: ${failures.length === 0 ? "ready" : "failed"}`);
console.log(reportPath);

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
}
