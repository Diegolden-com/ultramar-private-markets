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
const tallyFieldMap = safeRead("artifacts/hookathon/tally-field-map-latest.md");
const tallyFillPlan = safeRead("artifacts/hookathon/tally-fill-plan-latest.md");
const privatePacket = safeRead("artifacts/hookathon/tally-final-personalized-latest.md");
const placeholders = collectPlaceholders();
const unexpectedPlaceholders = placeholders.filter((placeholder) => !expectedExternalPlaceholders.includes(placeholder));
const missingExpectedPlaceholders = expectedExternalPlaceholders.filter((placeholder) => !placeholders.includes(placeholder));
const strictFailures = Array.from(strictPreflight.matchAll(/^- External placeholder still pending: (.+)$/gm)).map(
  (match) => match[1],
);

const cleanWorktree = !branchStatus
  .split("\n")
  .slice(1)
  .some((line) => line.trim().length > 0);
const preflightReady = preflight.includes("Ready for the next external step.") && lineValue(preflight, "Local package failures") === "0";
const publicLinksReady = publicLinks.includes("All public submission links resolve.") && lineValue(publicLinks, "Failures") === "0";
const tallyFieldMapReady =
  tallyFieldMap.includes("Current Tally fields match the final copy packet.") && lineValue(tallyFieldMap, "Failures") === "0";
const tallyFillPlanReady = tallyFillPlan.includes("Fill plan is ready.") && lineValue(tallyFillPlan, "Failures") === "0";
const finalPacketReady =
  tallyPacket.includes("## Copy Order") &&
  tallyPacket.includes("https://ultramar.capital/hookathon/port-of-call") &&
  tallyPacket.includes("https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm");
const privatePacketReady =
  privatePacket.includes("# Personalized Hookathon Tally packet") &&
  privatePacket.includes("Privacy note:") &&
  !/\[[^\]\n]+\]/.test(privatePacket);
const placeholdersExpectedOnly = unexpectedPlaceholders.length === 0 && missingExpectedPlaceholders.length === 0;
const strictBlockedOnlyByPersonalFields =
  strictFailures.length === expectedExternalPlaceholders.length &&
  expectedExternalPlaceholders.every((placeholder) => strictFailures.includes(placeholder));

const checklist = [
  reportStatus("Git worktree", cleanWorktree, `branch \`${branch}\`, HEAD \`${head}\``),
  reportStatus("Local submission preflight", preflightReady, "`artifacts/hookathon/submission-preflight-latest.md`"),
  reportStatus("Public links", publicLinksReady, "`artifacts/hookathon/public-links-latest.md`"),
  reportStatus("Live Tally field map", tallyFieldMapReady, "`artifacts/hookathon/tally-field-map-latest.md`"),
  reportStatus("Tally fill plan", tallyFillPlanReady, "`artifacts/hookathon/tally-fill-plan-latest.md`"),
  reportStatus("Final Tally copy packet", finalPacketReady, "`docs/HOOKATHON_TALLY_FINAL_PACKET.md`"),
  reportStatus(
    "Private personalized Tally packet",
    privatePacketReady,
    privatePacketReady
      ? "`artifacts/hookathon/tally-final-personalized-latest.md`"
      : "optional; generate with `corepack yarn hookathon:tally:personalize`",
  ),
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
  tallyFieldMapReady &&
  tallyFillPlanReady &&
  finalPacketReady &&
  placeholdersExpectedOnly &&
  strictBlockedOnlyByPersonalFields;
const readyForGoalCompletion = readyForSubmitterInput && placeholders.length === 0;

const report = `# Hookathon submission readiness

Generated: ${generatedAt}

Branch: \`${branch}\`

HEAD: \`${head}\`

## Verdict

${readyForGoalCompletion ? "Ready to mark the Hookathon goal complete after Tally confirmation evidence is recorded." : ""}
${readyForSubmitterInput && !readyForGoalCompletion ? "Ready for final submitter inputs and Tally submission. Do not mark the goal complete yet." : ""}
${!readyForSubmitterInput ? "Not ready for Tally submission. Fix pending items below." : ""}

## Readiness Matrix

| Status | Item | Evidence |
| --- | --- | --- |
${checklist.join("\n")}

## Remaining Inputs

${privatePacketReady ? "- None in the private personalized packet. Public tracked docs intentionally retain placeholders." : placeholders.length > 0 ? placeholders.map((placeholder) => `- ${placeholder}`).join("\n") : "- None"}

## Submitter Action

1. Generate \`artifacts/hookathon/tally-final-personalized-latest.md\` with \`corepack yarn hookathon:tally:personalize\`, or fill \`[submitter email]\`, \`[Yes/No]\`, and \`[1-5]\` in the tracked Tally docs.
2. If tracked docs are filled directly, run \`corepack yarn hookathon:submission:preflight:strict\`.
3. Open \`https://tally.so/r/VLV1pa\` and copy fields from the personalized packet or \`docs/HOOKATHON_TALLY_FINAL_PACKET.md\`.
4. After Tally confirms submission, record confirmation evidence in \`docs/HOOKATHON_COMPLETION_AUDIT.md\`.

## Current Git Status

\`\`\`text
${branchStatus}
\`\`\`
`;

mkdirSync(artifactDir, { recursive: true });
writeFileSync(reportPath, report);

console.log(`Hookathon readiness: ${readyForSubmitterInput ? "ready for submitter input" : "not ready"}`);
console.log(reportPath);

if (!readyForSubmitterInput) {
  process.exitCode = 1;
}
