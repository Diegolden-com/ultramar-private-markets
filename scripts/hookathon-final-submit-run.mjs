import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactDir = resolve(repoRoot, "artifacts/hookathon");
const reportPath = resolve(artifactDir, "final-submit-run-latest.md");
const jsonPath = resolve(artifactDir, "final-submit-run-latest.json");
const strict = process.argv.includes("--strict") || process.env.HOOKATHON_FINAL_SUBMIT_STRICT === "true";

const requiredPersonalEnv = [
  "HOOKATHON_SUBMITTER_EMAIL",
  "HOOKATHON_WORKED_WITH_TEAM",
  "HOOKATHON_COURSE_RATING",
];
const rawTeam = process.env.HOOKATHON_WORKED_WITH_TEAM?.trim().toLowerCase() ?? "";
const teamIsYes = ["yes", "y", "true", "1"].includes(rawTeam);
const personalMissing = [
  ...requiredPersonalEnv.filter((name) => !process.env[name]?.trim()),
  ...(teamIsYes && !process.env.HOOKATHON_TEAM_DETAILS?.trim() ? ["HOOKATHON_TEAM_DETAILS"] : []),
];
const hasAnyPersonalEnv = [...requiredPersonalEnv, "HOOKATHON_TEAM_DETAILS"].some((name) => process.env[name]?.trim());
const canPersonalize = personalMissing.length === 0;

function runStep(label, command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    env: process.env,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const status = result.status ?? 1;
  const ok = status === 0;
  return {
    label,
    command: [command, ...args].join(" "),
    ok: options.allowFailure ? true : ok,
    failed: !ok,
    skipped: false,
    exitCode: status,
    stdout: (result.stdout ?? "").trim(),
    stderr: (result.stderr ?? "").trim(),
    note: options.note ?? "",
  };
}

function skippedStep(label, note) {
  return {
    label,
    command: "",
    ok: true,
    failed: false,
    skipped: true,
    exitCode: 0,
    stdout: "",
    stderr: "",
    note,
  };
}

function readJson(path) {
  if (!existsSync(path)) return undefined;
  return JSON.parse(readFileSync(path, "utf8"));
}

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

function stepRow(step) {
  const status = step.skipped ? "Skipped" : step.failed ? "Failed" : "Ready";
  const note = step.note ? step.note : step.stderr.split("\n")[0] || step.stdout.split("\n")[0] || "";
  return `| ${status} | ${step.label} | \`${step.command || "n/a"}\` | ${step.exitCode} | ${note.replace(/\|/g, "\\|")} |`;
}

function summarizeOutput(step) {
  const lines = [step.stdout, step.stderr].filter(Boolean).join("\n").split("\n").filter(Boolean);
  if (lines.length === 0) return "- No output.";
  return lines.slice(0, 12).map((line) => `- ${line}`).join("\n");
}

const steps = [];

steps.push(runStep("Public links", "corepack", ["yarn", "hookathon:links:check"]));
steps.push(runStep("Live Tally field map", "corepack", ["yarn", "hookathon:tally:field-map"]));

if (canPersonalize) {
  steps.push(runStep("Private Tally personalization", "corepack", ["yarn", "hookathon:tally:personalize"]));
} else {
  const note = hasAnyPersonalEnv
    ? `Missing personal env: ${personalMissing.join(", ")}`
    : "Personal env not provided; using the public packet and leaving placeholders visible.";
  steps.push(skippedStep("Private Tally personalization", note));
}

steps.push(
  runStep("Tally fill plan", "node", [
    "scripts/hookathon-tally-fill-plan.mjs",
    ...(canPersonalize ? ["--strict-personalized"] : []),
  ]),
);
steps.push(
  runStep("Tally browser session pack", "node", [
    "scripts/hookathon-tally-session-pack.mjs",
    ...(canPersonalize || strict ? ["--strict-personalized"] : []),
  ]),
);
steps.push(runStep("Local submission preflight", "corepack", ["yarn", "hookathon:submission:preflight"]));
steps.push(runStep("Submission readiness", "corepack", ["yarn", "hookathon:readiness"]));

const generatedAt = new Date().toISOString();
const fillPlan = readJson(resolve(artifactDir, "tally-fill-plan-latest.json"));
const session = readJson(resolve(artifactDir, "tally-browser-session-latest.json"));
const readiness = readText(resolve(artifactDir, "submission-readiness-latest.md"));
const localFailures = steps.filter((step) => step.failed && !step.skipped);
const personalReady = canPersonalize && steps.find((step) => step.label === "Private Tally personalization")?.failed === false;
const sessionSubmitReady = Boolean(session?.submitReady);
const readinessReadyForSubmitterInput = readiness.includes("Ready for final submitter inputs and Tally submission");
const readyForTallySubmit = localFailures.length === 0 && personalReady && sessionSubmitReady && readinessReadyForSubmitterInput;
const strictFailures = [
  ...(strict && personalMissing.length > 0 ? [`Missing personal env: ${personalMissing.join(", ")}`] : []),
  ...(strict && !sessionSubmitReady ? ["Tally browser session is not submit-ready"] : []),
  ...localFailures.map((step) => `${step.label} failed`),
];
const verdict = readyForTallySubmit
  ? "Ready to open Tally and submit."
  : localFailures.length === 0
    ? "Ready for personal inputs before the final Tally submit."
    : "Not ready. Fix failed local steps first.";

const report = `# Hookathon final submit operator run

Generated: ${generatedAt}

Strict mode: ${strict ? "yes" : "no"}

## Verdict

${verdict}

Ready for Tally submit: ${readyForTallySubmit ? "yes" : "no"}

Local failures: ${localFailures.length}

Personal inputs present: ${personalReady ? "yes" : "no"}

Missing personal env: ${personalMissing.length > 0 ? personalMissing.join(", ") : "none"}

Packet source: ${fillPlan?.packetSource ?? "unknown"}

Session submit-ready: ${sessionSubmitReady ? "yes" : "no"}

Session pack: \`artifacts/hookathon/tally-browser-session-latest.html\`

Tally form: https://tally.so/r/VLV1pa

## Steps

| Status | Step | Command | Exit | Note |
| --- | --- | --- | ---: | --- |
${steps.map(stepRow).join("\n")}

## Blocking Failures

${strictFailures.length > 0 ? strictFailures.map((failure) => `- ${failure}`).join("\n") : "- None"}

## Remaining Action

${
  readyForTallySubmit
    ? "Open the Tally form, copy fields from `artifacts/hookathon/tally-browser-session-latest.html`, submit, then record the receipt with `corepack yarn hookathon:submission:receipt`."
    : "Set `HOOKATHON_SUBMITTER_EMAIL`, `HOOKATHON_WORKED_WITH_TEAM`, and `HOOKATHON_COURSE_RATING`; if team is Yes, also set `HOOKATHON_TEAM_DETAILS`. Then rerun `corepack yarn hookathon:submission:operator --strict`."
}

## Step Output Summary

${steps.map((step) => `### ${step.label}\n\n${summarizeOutput(step)}`).join("\n\n")}
`;

mkdirSync(artifactDir, { recursive: true });
writeFileSync(reportPath, report);
writeFileSync(
  jsonPath,
  JSON.stringify(
    {
      generatedAt,
      strict,
      readyForTallySubmit,
      localFailures: localFailures.map((step) => step.label),
      personalReady,
      personalMissing,
      packetSource: fillPlan?.packetSource ?? "unknown",
      sessionSubmitReady,
      steps,
      strictFailures,
    },
    null,
    2,
  ),
);

console.log(`Hookathon final submit operator: ${readyForTallySubmit ? "ready to submit" : "needs personal input"}`);
console.log(reportPath);

if (localFailures.length > 0 || strictFailures.length > 0) {
  process.exitCode = 1;
}
