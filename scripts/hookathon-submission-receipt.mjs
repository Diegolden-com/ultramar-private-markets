import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactDir = resolve(repoRoot, "artifacts/hookathon");
const markdownPath = resolve(artifactDir, "submission-receipt-latest.md");
const jsonPath = resolve(artifactDir, "submission-receipt-latest.json");
const checkOnly = process.argv.includes("--check-only");

const rawSubmittedAt = process.env.HOOKATHON_TALLY_SUBMITTED_AT?.trim() ?? "";
const rawConfirmation = process.env.HOOKATHON_TALLY_CONFIRMATION?.trim() ?? "";
const rawEvidence = process.env.HOOKATHON_TALLY_EVIDENCE?.trim() ?? "";
const rawEmail = process.env.HOOKATHON_SUBMITTER_EMAIL?.trim() ?? "";

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeSubmittedAt(value) {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : "";
}

function looksLikePlaceholder(value) {
  return /(\[.+\]|\{\{.+\}\}|<.+>|placeholder|replace|todo|dummy|sample|example)/i.test(value);
}

const submittedAt = normalizeSubmittedAt(rawSubmittedAt);
const failures = [
  ...(submittedAt ? [] : ["HOOKATHON_TALLY_SUBMITTED_AT must be a parseable absolute date/time"]),
  ...(rawConfirmation.length >= 8 ? [] : ["HOOKATHON_TALLY_CONFIRMATION must describe the Tally confirmation"]),
  ...(looksLikePlaceholder(rawConfirmation) ? ["HOOKATHON_TALLY_CONFIRMATION must not be placeholder or sample text"] : []),
  ...(rawEmail.length === 0 || validateEmail(rawEmail) ? [] : ["HOOKATHON_SUBMITTER_EMAIL must be a valid email address when provided"]),
];

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

const generatedAt = new Date().toISOString();
const receipt = {
  generatedAt,
  submittedAt,
  tallyForm: "https://tally.so/r/VLV1pa",
  confirmation: rawConfirmation,
  evidence: rawEvidence || "Not provided",
  submitterEmail: rawEmail || "Not provided",
  privacyNote: "Generated under artifacts/, which is ignored by git. Do not commit this receipt.",
};

const markdown = `# Hookathon Tally submission receipt

Generated: ${generatedAt}

Privacy note: this receipt may contain submitter-specific information and is generated under \`artifacts/\`, which is ignored by git.

## Submission

- Tally form: https://tally.so/r/VLV1pa
- Submitted at: ${submittedAt}
- Confirmation evidence: ${rawConfirmation}
- Supporting evidence: ${rawEvidence || "Not provided"}
- Submitter email: ${rawEmail || "Not provided"}

## Completion Gate

This receipt should exist only after the official Tally form has accepted the Hookathon submission. Once this file is generated with real confirmation evidence, rerun:

\`\`\`bash
corepack yarn hookathon:readiness
\`\`\`
`;

if (checkOnly) {
  console.log("Hookathon Tally submission receipt inputs validated.");
  console.log("No file written because --check-only was provided.");
  process.exit(0);
}

mkdirSync(artifactDir, { recursive: true });
writeFileSync(markdownPath, markdown);
writeFileSync(jsonPath, JSON.stringify(receipt, null, 2));

console.log("Hookathon Tally submission receipt generated.");
console.log(markdownPath);
