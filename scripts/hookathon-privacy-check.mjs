import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactDir = resolve(repoRoot, "artifacts/hookathon");
const reportPath = resolve(artifactDir, "privacy-check-latest.md");
const jsonPath = resolve(artifactDir, "privacy-check-latest.json");

const privatePaths = [
  "artifacts/hookathon/final-submit.env",
  "artifacts/hookathon/final-submit-run-latest.md",
  "artifacts/hookathon/final-submit-run-latest.json",
  "artifacts/hookathon/tally-final-personalized-latest.md",
  "artifacts/hookathon/tally-browser-session-latest.html",
  "artifacts/hookathon/tally-browser-session-latest.md",
  "artifacts/hookathon/tally-browser-session-latest.json",
  "artifacts/hookathon/tally-browser-session-qa-latest.md",
  "artifacts/hookathon/submission-receipt-latest.md",
  "artifacts/hookathon/submission-receipt-latest.json",
];

const allowedTrackedEmailExamples = new Set(["you@example.com"]);
const personalPlaceholderKeys = [
  "HOOKATHON_SUBMITTER_EMAIL",
  "HOOKATHON_WORKED_WITH_TEAM",
  "HOOKATHON_COURSE_RATING",
  "HOOKATHON_TEAM_DETAILS",
  "HOOKATHON_TALLY_SUBMITTED_AT",
  "HOOKATHON_TALLY_CONFIRMATION",
  "HOOKATHON_TALLY_EVIDENCE",
];

function runGit(args, options = {}) {
  try {
    return execFileSync("git", args, {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      ...options,
    }).trim();
  } catch (error) {
    if (options.allowFailure) {
      return (error.stdout?.toString() ?? "").trim();
    }
    throw error;
  }
}

function trackedFiles() {
  return runGit(["ls-files"]).split("\n").filter(Boolean);
}

function isIgnored(path) {
  try {
    execFileSync("git", ["check-ignore", "--quiet", path], { cwd: repoRoot });
    return true;
  } catch {
    return false;
  }
}

function read(path) {
  return readFileSync(resolve(repoRoot, path), "utf8");
}

function findTrackedEmails(files) {
  const matches = [];
  for (const file of files) {
    if (!isHookathonFile(file)) continue;
    if (!/\.(md|mdx|txt|tsx?|jsx?|json|sol)$/.test(file)) continue;
    let content = "";
    try {
      content = read(file);
    } catch {
      continue;
    }
    for (const match of content.matchAll(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi)) {
      const email = match[0];
      if (allowedTrackedEmailExamples.has(email.toLowerCase())) continue;
      matches.push({ file, email });
    }
  }
  return matches;
}

function findCommittedPrivatePaths(files) {
  return files.filter(
    (file) =>
      file.startsWith("artifacts/hookathon/") ||
      file === "artifacts" ||
      /(?:final-submit\.env|tally-final-personalized|submission-receipt-latest)/.test(file),
  );
}

function findPlaceholderMisuse(files) {
  const findings = [];
  for (const file of files) {
    if (!isHookathonFile(file)) continue;
    if (!/\.(md|mdx|txt|tsx?|jsx?|json|sol)$/.test(file)) continue;
    let content = "";
    try {
      content = read(file);
    } catch {
      continue;
    }

    for (const key of personalPlaceholderKeys) {
      const assignmentMatches = [...content.matchAll(new RegExp(`${key}=([^\\n]*)`, "g"))];
      for (const match of assignmentMatches) {
        const rawValue = match[1].trim().replace(/\\$/, "").trim();
        const value = rawValue
          .split(/\s+/)[0]
          .replace(/^["'`]+/g, "")
          .replace(/[\\+"'`,.]+$/g, "");
        if (
          !value ||
          value.startsWith("REPLACE_WITH") ||
          value.includes("you@example.com") ||
          ["No", "Yes", "1", "2", "3", "4", "5"].includes(value)
        ) {
          continue;
        }
        findings.push({ file, key, valueDescription: `${value.length} chars` });
      }
    }
  }
  return findings;
}

function isHookathonFile(file) {
  return (
    file === "HOOKATHON_README.md" ||
    file.startsWith("docs/HOOKATHON_") ||
    file.startsWith("scripts/hookathon-") ||
    file === "package.json"
  );
}

function row(status, item, evidence) {
  return `| ${status ? "Ready" : "Fail"} | ${item} | ${evidence} |`;
}

const files = trackedFiles();
const gitignore = existsSync(resolve(repoRoot, ".gitignore")) ? read(".gitignore") : "";
const artifactsIgnored = gitignore.split(/\r?\n/).some((line) => line.trim() === "artifacts/");
const privatePathChecks = privatePaths.map((path) => ({ path, ignored: isIgnored(path) }));
const committedPrivatePaths = findCommittedPrivatePaths(files);
const trackedEmails = findTrackedEmails(files);
const placeholderMisuse = findPlaceholderMisuse(files);
const generatedAt = new Date().toISOString();
const failures = [
  ...(artifactsIgnored ? [] : ["`.gitignore` does not ignore `artifacts/`"]),
  ...privatePathChecks.filter((check) => !check.ignored).map((check) => `Private path is not ignored: ${check.path}`),
  ...committedPrivatePaths.map((file) => `Private/generated artifact is tracked: ${file}`),
  ...trackedEmails.map((match) => `Tracked non-example email in ${match.file}: ${match.email}`),
  ...placeholderMisuse.map((finding) => `Tracked concrete ${finding.key} assignment in ${finding.file}`),
];

const report = `# Hookathon privacy hygiene check

Generated: ${generatedAt}

## Verdict

${failures.length === 0 ? "No private Hookathon submitter data is tracked." : "Privacy hygiene needs attention."}

Failures: ${failures.length}

## Checks

| Status | Item | Evidence |
| --- | --- | --- |
${[
  row(artifactsIgnored, "Artifacts ignored", artifactsIgnored ? "`.gitignore` contains `artifacts/`" : "missing"),
  row(committedPrivatePaths.length === 0, "No generated private artifacts tracked", committedPrivatePaths.length === 0 ? "none" : committedPrivatePaths.join(", ")),
  row(trackedEmails.length === 0, "No tracked personal email values", trackedEmails.length === 0 ? "none; `you@example.com` examples are allowed" : `${trackedEmails.length} finding(s)`),
  row(placeholderMisuse.length === 0, "No concrete submitter env assignments in tracked files", placeholderMisuse.length === 0 ? "none" : `${placeholderMisuse.length} finding(s)`),
  ...privatePathChecks.map((check) => row(check.ignored, `Ignored path: ${check.path}`, check.ignored ? "ignored by git" : "not ignored")),
].join("\n")}

## Failures

${failures.length > 0 ? failures.map((failure) => `- ${failure}`).join("\n") : "- None"}
`;

mkdirSync(artifactDir, { recursive: true });
writeFileSync(reportPath, report);
writeFileSync(
  jsonPath,
  JSON.stringify(
    {
      generatedAt,
      failures,
      artifactsIgnored,
      privatePathChecks,
      committedPrivatePaths,
      trackedEmailFindingCount: trackedEmails.length,
      placeholderMisuseFindingCount: placeholderMisuse.length,
    },
    null,
    2,
  ),
);

console.log(`Hookathon privacy check: ${failures.length === 0 ? "ready" : "failed"}`);
console.log(reportPath);

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
}
