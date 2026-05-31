import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactDir = resolve(repoRoot, "artifacts/hookathon");
const markdownPath = resolve(artifactDir, "final-handoff-latest.md");
const jsonPath = resolve(artifactDir, "final-handoff-latest.json");

const publicLinks = {
  tallyForm: "https://tally.so/r/VLV1pa",
  githubBranch: "https://github.com/Diegolden-com/ultramar-private-markets/tree/codex/landing-wave-route-ui",
  projectDemo: "https://ultramar.capital/hookathon/port-of-call",
  pitchDeck: "https://ultramar.capital/hookathon/port-of-call/deck",
  demoVideo:
    "https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm",
};

function run(command, args) {
  return execFileSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function safeRead(path) {
  const absolute = resolve(repoRoot, path);
  return existsSync(absolute) ? readFileSync(absolute, "utf8") : "";
}

function safeReadJson(path) {
  const content = safeRead(path);
  if (!content.trim()) return undefined;
  try {
    return JSON.parse(content);
  } catch {
    return undefined;
  }
}

function lineValue(content, label) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return content.match(new RegExp(`${escapedLabel}: ([^\\n]+)`))?.[1]?.trim() ?? "unknown";
}

function statusLine(ok) {
  return ok ? "ready" : "pending";
}

function gitSyncStatus(status) {
  const header = status.split("\n")[0] ?? "";
  if (/\[ahead \d+, behind \d+\]/.test(header)) return "diverged";
  if (/\[ahead \d+\]/.test(header)) return "ahead of origin; push before submitting";
  if (/\[behind \d+\]/.test(header)) return "behind origin; pull/rebase before submitting";
  return "synced with origin";
}

const generatedAt = new Date().toISOString();
const branchStatus = run("git", ["status", "--short", "--branch"]);
const branch = run("git", ["branch", "--show-current"]);
const head = run("git", ["rev-parse", "--short", "HEAD"]);
const finalSubmit = safeReadJson("artifacts/hookathon/final-submit-run-latest.json");
const readiness = safeRead("artifacts/hookathon/submission-readiness-latest.md");
const publicRenderQa = safeRead("artifacts/hookathon/public-render-qa-latest.md");
const publicLinksReport = safeRead("artifacts/hookathon/public-links-latest.md");
const session = safeReadJson("artifacts/hookathon/tally-browser-session-latest.json");
const cleanWorktree = !branchStatus
  .split("\n")
  .slice(1)
  .some((line) => line.trim().length > 0);
const syncStatus = gitSyncStatus(branchStatus);
const localFailures = Array.isArray(finalSubmit?.localFailures) ? finalSubmit.localFailures : [];
const personalMissing = Array.isArray(finalSubmit?.personalMissing)
  ? finalSubmit.personalMissing
  : ["HOOKATHON_SUBMITTER_EMAIL", "HOOKATHON_WORKED_WITH_TEAM", "HOOKATHON_COURSE_RATING"];
const readyForSubmitterInput = readiness.includes("Ready for final submitter inputs and Tally submission");
const readyForTallySubmit = Boolean(finalSubmit?.readyForTallySubmit);
const publicRenderReady =
  publicRenderQa.includes("Production demo and deck render correctly in browser viewports.") &&
  lineValue(publicRenderQa, "Failures") === "0";
const publicLinksReady = publicLinksReport.includes("All public submission links resolve.") && lineValue(publicLinksReport, "Failures") === "0";
const sessionPackReady = existsSync(resolve(artifactDir, "tally-browser-session-latest.html"));
const sessionSubmitReady = Boolean(session?.submitReady);

const handoff = {
  generatedAt,
  branch,
  head,
  cleanWorktree,
  syncStatus,
  readyForSubmitterInput,
  readyForTallySubmit,
  localFailures,
  personalMissing,
  publicLinksReady,
  publicRenderReady,
  sessionPackReady,
  sessionSubmitReady,
  publicLinks,
};

const markdown = `# Hookathon final submit handoff

Generated: ${generatedAt}

Privacy note: this handoff intentionally does not include submitter email, course rating, team details, Tally confirmation text, screenshots, or any other personal values. It is written under \`artifacts/\`, which is ignored by git.

## Current State

- Branch: \`${branch}\`
- HEAD: \`${head}\`
- Git worktree: ${cleanWorktree ? "clean" : "not clean"}
- Git upstream: ${syncStatus}
- Local operator failures: ${localFailures.length}
- Ready for submitter inputs: ${readyForSubmitterInput ? "yes" : "no"}
- Ready for Tally submit now: ${readyForTallySubmit ? "yes" : "no"}
- Public links: ${statusLine(publicLinksReady)}
- Public render QA: ${statusLine(publicRenderReady)}
- Browser session pack exists: ${sessionPackReady ? "yes" : "no"}
- Browser session submit-ready: ${sessionSubmitReady ? "yes" : "no"}

## Missing Private Inputs

${personalMissing.length > 0 ? personalMissing.map((name) => `- \`${name}\``).join("\n") : "- None"}

## Public Links To Paste

- Tally form: ${publicLinks.tallyForm}
- GitHub branch: ${publicLinks.githubBranch}
- Project demo: ${publicLinks.projectDemo}
- Pitch deck: ${publicLinks.pitchDeck}
- Demo video: ${publicLinks.demoVideo}

## Final Human Pass

1. Fill the ignored private env file:

   \`\`\`text
   artifacts/hookathon/final-submit.env
   \`\`\`

   Required values:

   \`\`\`text
   HOOKATHON_SUBMITTER_EMAIL=
   HOOKATHON_WORKED_WITH_TEAM=
   HOOKATHON_COURSE_RATING=
   \`\`\`

   If \`HOOKATHON_WORKED_WITH_TEAM=Yes\`, also fill \`HOOKATHON_TEAM_DETAILS\`.

2. Run the strict final operator:

   \`\`\`bash
   corepack yarn hookathon:submission:operator --strict
   \`\`\`

   Do not open Tally until \`artifacts/hookathon/final-submit-run-latest.md\` says:

   \`\`\`text
   Ready for Tally submit: yes
   Local failures: 0
   Session submit-ready: yes
   \`\`\`

3. Open the copy-button browser pack:

   \`\`\`text
   artifacts/hookathon/tally-browser-session-latest.html
   \`\`\`

4. Open the official form and submit:

   \`\`\`text
   ${publicLinks.tallyForm}
   \`\`\`

5. After Tally confirms, record the private receipt:

   \`\`\`bash
   HOOKATHON_TALLY_SUBMITTED_AT="REPLACE_WITH_ISO_TIMESTAMP_FROM_CONFIRMATION" \\
   HOOKATHON_TALLY_CONFIRMATION="REPLACE_WITH_TALLY_CONFIRMATION_TEXT_OR_ID" \\
   HOOKATHON_TALLY_EVIDENCE="REPLACE_WITH_SCREENSHOT_OR_EMAIL_REFERENCE" \\
   corepack yarn hookathon:submission:receipt
   \`\`\`

6. Rerun readiness:

   \`\`\`bash
   corepack yarn hookathon:readiness
   \`\`\`

The thread goal can be considered complete only after the readiness report shows real Tally receipt evidence.
`;

mkdirSync(artifactDir, { recursive: true });
writeFileSync(markdownPath, markdown);
writeFileSync(jsonPath, JSON.stringify(handoff, null, 2));

console.log("Hookathon final submit handoff generated.");
console.log(markdownPath);
