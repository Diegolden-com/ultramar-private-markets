import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactDir = resolve(repoRoot, "artifacts/hookathon");
const reportPath = resolve(artifactDir, "submission-readiness-latest.md");

const expectedExternalPlaceholders = ["[submitter email]", "[Yes/No]", "[1-5]"];
const placeholderSources = ["docs/HOOKATHON_TALLY_SUBMISSION.md", "docs/HOOKATHON_TALLY_FINAL_PACKET.md"];

function read(path) {
  return readFileSync(resolve(repoRoot, path), "utf8");
}

function run(command, args) {
  return execFileSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function safeRead(path) {
  try {
    return read(path);
  } catch {
    return "";
  }
}

function lineValue(content, label) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return content.match(new RegExp(`${escapedLabel}: ([^\\n]+)`))?.[1]?.trim() ?? "unknown";
}

function collectPlaceholders() {
  const content = placeholderSources.map(safeRead).join("\n");
  return Array.from(new Set(content.match(/\[[^\]\n]+\]/g) ?? [])).sort();
}

function reportStatus(name, ok, evidence) {
  return `| ${ok ? "Ready" : "Pending"} | ${name} | ${evidence} |`;
}

const generatedAt = new Date().toISOString();
const branchStatus = run("git", ["status", "--short", "--branch"]);
const head = run("git", ["rev-parse", "--short", "HEAD"]);
const branch = run("git", ["branch", "--show-current"]);
const tallyPacket = safeRead("docs/HOOKATHON_TALLY_FINAL_PACKET.md");
const preflight = safeRead("artifacts/hookathon/submission-preflight-latest.md");
const strictPreflight = safeRead("artifacts/hookathon/submission-preflight-strict-latest.md");
const publicLinks = safeRead("artifacts/hookathon/public-links-latest.md");
const publicRenderQa = safeRead("artifacts/hookathon/public-render-qa-latest.md");
const privacy = safeRead("artifacts/hookathon/privacy-check-latest.md");
const tallyFieldMap = safeRead("artifacts/hookathon/tally-field-map-latest.md");
const tallyFillPlan = safeRead("artifacts/hookathon/tally-fill-plan-latest.md");
const tallyBrowserSession = safeRead("artifacts/hookathon/tally-browser-session-latest.md");
const privatePacket = safeRead("artifacts/hookathon/tally-final-personalized-latest.md");
const submissionReceipt = safeRead("artifacts/hookathon/submission-receipt-latest.md");
const submissionReceiptJson = safeRead("artifacts/hookathon/submission-receipt-latest.json");
const placeholders = collectPlaceholders();
const unexpectedPlaceholders = placeholders.filter((placeholder) => !expectedExternalPlaceholders.includes(placeholder));
const missingExpectedPlaceholders = expectedExternalPlaceholders.filter((placeholder) => !placeholders.includes(placeholder));
const strictFailures = Array.from(strictPreflight.matchAll(/^- External placeholder still pending: (.+)$/gm)).map(
  (match) => match[1],
);

function normalizeSubmittedAt(value) {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : "";
}

function looksLikePlaceholder(value) {
  return /(\[.+\]|\{\{.+\}\}|<.+>|placeholder|replace|todo|dummy|sample|example)/i.test(value);
}

function inspectSubmissionReceipt() {
  const present = submissionReceipt.trim().length > 0 || submissionReceiptJson.trim().length > 0;
  if (!present) {
    return {
      present: false,
      ok: false,
      evidence: "external pending; record with `corepack yarn hookathon:submission:receipt` after Tally confirms",
    };
  }

  try {
    if (submissionReceiptJson.trim().length > 0) {
      const parsed = JSON.parse(submissionReceiptJson);
      const submittedAt = normalizeSubmittedAt(parsed.submittedAt ?? "");
      const confirmation = typeof parsed.confirmation === "string" ? parsed.confirmation.trim() : "";
      const ok = Boolean(submittedAt) && confirmation.length >= 8 && !looksLikePlaceholder(confirmation);
      return {
        present: true,
        ok,
        evidence: ok
          ? `submitted at \`${submittedAt}\`; \`artifacts/hookathon/submission-receipt-latest.md\``
          : "receipt JSON exists but is missing a valid submitted time or confirmation",
      };
    }
  } catch {
    return {
      present: true,
      ok: false,
      evidence: "receipt JSON exists but could not be parsed",
    };
  }

  const submittedAt = normalizeSubmittedAt(submissionReceipt.match(/^- Submitted at:\s*(.+)$/m)?.[1] ?? "");
  const confirmation = submissionReceipt.match(/^- Confirmation evidence:\s*(.+)$/m)?.[1]?.trim() ?? "";
  const ok = Boolean(submittedAt) && confirmation.length >= 8 && !looksLikePlaceholder(confirmation);
  return {
    present: true,
    ok,
    evidence: ok
      ? `submitted at \`${submittedAt}\`; \`artifacts/hookathon/submission-receipt-latest.md\``
      : "receipt markdown exists but is missing a valid submitted time or confirmation",
  };
}

const cleanWorktree = !branchStatus
  .split("\n")
  .slice(1)
  .some((line) => line.trim().length > 0);
const preflightReady = preflight.includes("Ready for the next external step.") && lineValue(preflight, "Local package failures") === "0";
const publicLinksReady = publicLinks.includes("All public submission links resolve.") && lineValue(publicLinks, "Failures") === "0";
const publicRenderQaReady =
  publicRenderQa.includes("Production demo and deck render correctly in browser viewports.") &&
  lineValue(publicRenderQa, "Failures") === "0";
const privacyReady = privacy.includes("No private Hookathon submitter data is tracked.") && lineValue(privacy, "Failures") === "0";
const tallyFieldMapReady =
  tallyFieldMap.includes("Current Tally fields match the final copy packet.") && lineValue(tallyFieldMap, "Failures") === "0";
const tallyFillPlanReady = tallyFillPlan.includes("Fill plan is ready.") && lineValue(tallyFillPlan, "Failures") === "0";
const tallyBrowserSessionReady =
  tallyBrowserSession.includes("# Hookathon Tally browser session pack") &&
  lineValue(tallyBrowserSession, "Failures") === "0";
const finalPacketReady =
  tallyPacket.includes("## Copy Order") &&
  tallyPacket.includes("https://ultramar.capital/hookathon/port-of-call") &&
  tallyPacket.includes("https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm");
const privatePacketReady =
  privatePacket.includes("# Personalized Hookathon Tally packet") &&
  privatePacket.includes("Privacy note:") &&
  !/\[[^\]\n]+\]/.test(privatePacket);
const submissionReceiptStatus = inspectSubmissionReceipt();
const submissionReceiptReady = submissionReceiptStatus.ok;
const submissionReceiptSane = !submissionReceiptStatus.present || submissionReceiptReady;
const placeholdersExpectedOnly = unexpectedPlaceholders.length === 0 && missingExpectedPlaceholders.length === 0;
const strictBlockedOnlyByPersonalFields =
  strictFailures.length === expectedExternalPlaceholders.length &&
  expectedExternalPlaceholders.every((placeholder) => strictFailures.includes(placeholder));

const checklist = [
  reportStatus("Git worktree", cleanWorktree, `branch \`${branch}\`, HEAD \`${head}\``),
  reportStatus("Local submission preflight", preflightReady, "`artifacts/hookathon/submission-preflight-latest.md`"),
  reportStatus("Public links", publicLinksReady, "`artifacts/hookathon/public-links-latest.md`"),
  reportStatus("Public render QA", publicRenderQaReady, "`artifacts/hookathon/public-render-qa-latest.md`"),
  reportStatus("Privacy hygiene", privacyReady, "`artifacts/hookathon/privacy-check-latest.md`"),
  reportStatus("Live Tally field map", tallyFieldMapReady, "`artifacts/hookathon/tally-field-map-latest.md`"),
  reportStatus("Tally fill plan", tallyFillPlanReady, "`artifacts/hookathon/tally-fill-plan-latest.md`"),
  reportStatus("Tally browser session pack", tallyBrowserSessionReady, "`artifacts/hookathon/tally-browser-session-latest.html`"),
  reportStatus("Final Tally copy packet", finalPacketReady, "`docs/HOOKATHON_TALLY_FINAL_PACKET.md`"),
  reportStatus(
    "Private personalized Tally packet",
    privatePacketReady,
    privatePacketReady
      ? "`artifacts/hookathon/tally-final-personalized-latest.md`"
      : "optional; generate with `corepack yarn hookathon:tally:personalize`",
  ),
  reportStatus("Tally submission receipt", submissionReceiptReady, submissionReceiptStatus.evidence),
  reportStatus(
    "Known placeholders only",
    placeholdersExpectedOnly,
    placeholders.length > 0 ? placeholders.map((placeholder) => `\`${placeholder}\``).join(", ") : "none",
  ),
  reportStatus(
    "Strict preflight blocker",
    strictBlockedOnlyByPersonalFields,
    strictFailures.length > 0 ? strictFailures.map((placeholder) => `\`${placeholder}\``).join(", ") : "none",
  ),
];

const readyForSubmitterInput =
  cleanWorktree &&
  preflightReady &&
  publicLinksReady &&
  publicRenderQaReady &&
  privacyReady &&
  tallyFieldMapReady &&
  tallyFillPlanReady &&
  tallyBrowserSessionReady &&
  finalPacketReady &&
  submissionReceiptSane &&
  placeholdersExpectedOnly &&
  strictBlockedOnlyByPersonalFields;
const readyForGoalCompletion = readyForSubmitterInput && submissionReceiptReady;

const report = `# Hookathon submission readiness

Generated: ${generatedAt}

Branch: \`${branch}\`

HEAD: \`${head}\`

## Verdict

${readyForGoalCompletion ? "Tally confirmation evidence is recorded. Ready for completion review." : ""}
${readyForSubmitterInput && !readyForGoalCompletion ? "Ready for final submitter inputs and Tally submission. Do not mark the goal complete yet." : ""}
${!readyForSubmitterInput ? "Not ready for Tally submission. Fix pending items below." : ""}

## Readiness Matrix

| Status | Item | Evidence |
| --- | --- | --- |
${checklist.join("\n")}

## Remaining Inputs

${[
  ...(privatePacketReady
    ? ["- None in the private personalized packet. Public tracked docs intentionally retain placeholders."]
    : placeholders.length > 0
      ? placeholders.map((placeholder) => `- ${placeholder}`)
      : ["- None"]),
  ...(submissionReceiptReady ? [] : ["- Tally confirmation receipt after the official form accepts the submission"]),
].join("\n")}

## Submitter Action

1. Generate \`artifacts/hookathon/tally-final-personalized-latest.md\` with \`corepack yarn hookathon:tally:personalize\`, or fill \`[submitter email]\`, \`[Yes/No]\`, and \`[1-5]\` in the tracked Tally docs.
2. Generate \`artifacts/hookathon/tally-browser-session-latest.html\` with \`corepack yarn hookathon:tally:session\`.
3. If tracked docs are filled directly, run \`corepack yarn hookathon:submission:preflight:strict\`.
4. Open \`https://tally.so/r/VLV1pa\` and copy fields from the personalized packet or browser session pack.
5. After Tally confirms submission, record the private receipt with \`corepack yarn hookathon:submission:receipt\`.
6. Rerun \`corepack yarn hookathon:readiness\` and use the receipt artifact as completion evidence.

## Current Git Status

\`\`\`text
${branchStatus}
\`\`\`
`;

mkdirSync(artifactDir, { recursive: true });
writeFileSync(reportPath, report);

console.log(
  `Hookathon readiness: ${
    readyForGoalCompletion ? "submitted evidence present" : readyForSubmitterInput ? "ready for submitter input" : "not ready"
  }`,
);
console.log(reportPath);

if (!readyForSubmitterInput) {
  process.exitCode = 1;
}
