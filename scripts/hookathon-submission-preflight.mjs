import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactDir = resolve(repoRoot, "artifacts/hookathon");
const strictExternal = process.argv.includes("--strict-external") || process.env.HOOKATHON_STRICT_EXTERNAL === "true";
const reportPath = resolve(
  artifactDir,
  strictExternal ? "submission-preflight-strict-latest.md" : "submission-preflight-latest.md",
);

const requiredFiles = [
  ["Public README", "HOOKATHON_README.md"],
  ["Tally copy", "docs/HOOKATHON_TALLY_SUBMISSION.md"],
  ["Final Tally packet", "docs/HOOKATHON_TALLY_FINAL_PACKET.md"],
  ["Completion audit", "docs/HOOKATHON_COMPLETION_AUDIT.md"],
  ["Judge fast path", "docs/HOOKATHON_JUDGE_FAST_PATH.md"],
  ["Use-case thesis", "docs/HOOKATHON_USECASE_ULTRAMAR_PORT_OF_CALL.md"],
  ["Pitch deck source", "docs/HOOKATHON_SLIDE_DECK.md"],
  ["Video kit", "docs/HOOKATHON_VIDEO_RECORDING_KIT.md"],
  ["Frontend demo route", "apps/ultramar/app/hookathon/port-of-call/page.tsx"],
  ["Frontend deck route", "apps/ultramar/app/hookathon/port-of-call/deck/page.tsx"],
  ["Scenario simulator", "apps/ultramar/components/hookathon-scenario-simulator.tsx"],
  ["Capital window hook", "apps/private-equities/contracts/src/CapitalWindowHook.sol"],
  ["Capital window router", "apps/private-equities/contracts/src/CapitalWindowRouter.sol"],
  ["Capital window registry", "apps/private-equities/contracts/src/CapitalWindowRegistry.sol"],
  ["Hook tests", "apps/private-equities/contracts/test/CapitalWindowHook.t.sol"],
  ["Local demo script", "apps/private-equities/contracts/script/CapitalWindowDemo.s.sol"],
  ["Testnet deploy script", "apps/private-equities/contracts/script/DeployCapitalWindowTestnet.s.sol"],
  ["Testnet swap script", "apps/private-equities/contracts/script/ExecuteCapitalWindowTestnetSwap.s.sol"],
  ["Video proof script", "scripts/hookathon-video-proof.mjs"],
  ["Browser capture script", "scripts/hookathon-capture-demo.mjs"],
  ["Video render script", "scripts/hookathon-render-video.mjs"],
  ["Public link check script", "scripts/hookathon-public-links-check.mjs"],
  ["Privacy hygiene script", "scripts/hookathon-privacy-check.mjs"],
  ["Final submit operator script", "scripts/hookathon-final-submit-run.mjs"],
  ["Readiness report script", "scripts/hookathon-readiness-report.mjs"],
  ["Submission receipt script", "scripts/hookathon-submission-receipt.mjs"],
  ["Tally field map script", "scripts/hookathon-tally-field-map.mjs"],
  ["Tally fill plan script", "scripts/hookathon-tally-fill-plan.mjs"],
  ["Tally browser session script", "scripts/hookathon-tally-session-pack.mjs"],
  ["Tally browser session QA script", "scripts/hookathon-tally-session-qa.mjs"],
  ["Tally personalization script", "scripts/hookathon-personalize-tally.mjs"],
];

const requiredArtifacts = [
  ["Terminal proof", "artifacts/hookathon/terminal-proof-latest.md"],
  ["Capture manifest", "artifacts/hookathon/capture-manifest-latest.md"],
  ["Hero frame", "artifacts/hookathon/frames/01-hero-port-of-call.png"],
  ["Travel feed frame", "artifacts/hookathon/frames/02-travel-feed.png"],
  ["Passport quote frame", "artifacts/hookathon/frames/03-passport-and-quote.png"],
  ["Approved scenario frame", "artifacts/hookathon/frames/04-approved-scenario.png"],
  ["Generic router frame", "artifacts/hookathon/frames/05-generic-router-revert.png"],
  ["Replay frame", "artifacts/hookathon/frames/06-replay-revert.png"],
  ["Specialized Markets frame", "artifacts/hookathon/frames/07-specialized-markets-claim.png"],
  ["Pitch deck close frame", "artifacts/hookathon/frames/08-pitch-deck-close.png"],
  ["Interaction clip", "artifacts/hookathon/video/demo-flow-latest.webm"],
  ["Final captioned video", "artifacts/hookathon/video/final-demo-latest.webm"],
  ["Final captions", "artifacts/hookathon/video/final-demo-latest.vtt"],
  ["Final video manifest", "artifacts/hookathon/video/final-demo-manifest-latest.md"],
  ["Public link report", "artifacts/hookathon/public-links-latest.md"],
  ["Privacy hygiene report", "artifacts/hookathon/privacy-check-latest.md"],
  ["Tally field map report", "artifacts/hookathon/tally-field-map-latest.md"],
  ["Tally fill plan report", "artifacts/hookathon/tally-fill-plan-latest.md"],
  ["Tally browser session pack", "artifacts/hookathon/tally-browser-session-latest.md"],
  ["Tally browser session QA report", "artifacts/hookathon/tally-browser-session-qa-latest.md"],
];

const requiredProofMarkers = [
  "APPROVED window 1",
  "exact input USDC 1500.00",
  "quoted LCX output 1454.54",
  "effective price USDC/LCX 1.0312",
  "MISSING PASSPORT window 2",
  "GENERIC ROUTER window 3",
  "EXPIRED AUTHORIZATION window 4",
  "MIN OUTPUT window 5",
  "REPLAY window 6",
  "STALE ORACLE window 7",
  "Demo complete: one approved settlement, six blocked paths.",
];

const requiredNarrativeMarkers = [
  ["Tally theme", "docs/HOOKATHON_TALLY_SUBMISSION.md", "UHI8: Specialized Markets"],
  ["Specialized Markets answer", "docs/HOOKATHON_TALLY_SUBMISSION.md", "Yes, my project addresses the theme."],
  ["Judge fast path rubric", "docs/HOOKATHON_JUDGE_FAST_PATH.md", "Uniqueness"],
  ["Ablo loop", "docs/HOOKATHON_USECASE_ULTRAMAR_PORT_OF_CALL.md", "Ablo"],
  ["Custom accounting", "HOOKATHON_README.md", "beforeSwapReturnDelta"],
  ["Non-offer boundary", "HOOKATHON_README.md", "not a public securities offering"],
  ["Public GitHub repo", "docs/HOOKATHON_TALLY_SUBMISSION.md", "https://github.com/Diegolden-com/ultramar-private-markets"],
  [
    "Demo video URL",
    "docs/HOOKATHON_TALLY_SUBMISSION.md",
    "https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm",
  ],
  ["Deck URL", "docs/HOOKATHON_TALLY_SUBMISSION.md", "https://ultramar.capital/hookathon/port-of-call/deck"],
  ["Project URL", "docs/HOOKATHON_TALLY_SUBMISSION.md", "https://ultramar.capital/hookathon/port-of-call"],
  ["Public frontend verification", "docs/HOOKATHON_TALLY_SUBMISSION.md", "Verified live on May 31, 2026"],
  ["Final packet pre-submit gate", "docs/HOOKATHON_TALLY_FINAL_PACKET.md", "corepack yarn hookathon:links:check"],
  ["Final packet direct video URL", "docs/HOOKATHON_TALLY_FINAL_PACKET.md", "https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm"],
  ["Tally field map command", "docs/HOOKATHON_TALLY_FINAL_PACKET.md", "corepack yarn hookathon:tally:field-map"],
  ["Tally fill plan command", "docs/HOOKATHON_TALLY_FINAL_PACKET.md", "corepack yarn hookathon:tally:fill-plan"],
  ["Tally browser session command", "docs/HOOKATHON_TALLY_FINAL_PACKET.md", "corepack yarn hookathon:tally:session"],
  ["Final submit operator command", "docs/HOOKATHON_TALLY_FINAL_PACKET.md", "corepack yarn hookathon:submission:operator"],
  ["Readiness command", "docs/HOOKATHON_TALLY_FINAL_PACKET.md", "corepack yarn hookathon:readiness"],
  ["Submission receipt command", "docs/HOOKATHON_TALLY_FINAL_PACKET.md", "corepack yarn hookathon:submission:receipt"],
  ["Private personalization command", "docs/HOOKATHON_TALLY_FINAL_PACKET.md", "corepack yarn hookathon:tally:personalize"],
];

const externalPlaceholders = [
  "[submitter email]",
  "[Yes/No]",
  "[1-5]",
];

function read(path) {
  return readFileSync(resolve(repoRoot, path), "utf8");
}

function inspectFile(path) {
  const absolute = resolve(repoRoot, path);
  try {
    const stats = statSync(absolute);
    return {
      ok: stats.isFile() && stats.size > 0,
      size: stats.size,
      path,
    };
  } catch {
    return { ok: false, size: 0, path };
  }
}

function checkFiles(entries) {
  return entries.map(([label, path]) => ({
    label,
    ...inspectFile(path),
  }));
}

function checkMarkers(entries) {
  return entries.map(([label, path, marker]) => {
    let ok = false;
    try {
      ok = read(path).includes(marker);
    } catch {
      ok = false;
    }
    return { label, path, marker, ok };
  });
}

function checkProofMarkers() {
  let proof = "";
  try {
    proof = read("artifacts/hookathon/terminal-proof-latest.md");
  } catch {
    return requiredProofMarkers.map((marker) => ({ marker, ok: false }));
  }
  return requiredProofMarkers.map((marker) => ({ marker, ok: proof.includes(marker) }));
}

function checkVideoManifest() {
  try {
    const manifest = read("artifacts/hookathon/video/final-demo-manifest-latest.md");
    const plannedDuration = Number(manifest.match(/Planned duration: ([0-9.]+) seconds/)?.[1]);
    const sizeMb = Number(manifest.match(/Size: ([0-9.]+) MB/)?.[1]);
    return {
      ok: Number.isFinite(plannedDuration) && plannedDuration > 0 && plannedDuration <= 300 && Number.isFinite(sizeMb) && sizeMb > 0.1,
      plannedDuration,
      sizeMb,
    };
  } catch {
    return { ok: false, plannedDuration: undefined, sizeMb: undefined };
  }
}

function findTallyPlaceholders() {
  const placeholderSources = ["docs/HOOKATHON_TALLY_SUBMISSION.md", "docs/HOOKATHON_TALLY_FINAL_PACKET.md"];
  const content = placeholderSources
    .map((path) => {
      try {
        return read(path);
      } catch {
        return "";
      }
    })
    .join("\n");

  const discovered = Array.from(new Set(content.match(/\[[^\]\n]+\]/g) ?? []));
  return discovered.map((placeholder) => ({
    placeholder,
    present: true,
    expectedExternal: externalPlaceholders.includes(placeholder),
  }));
}

function formatFileRows(rows) {
  return rows
    .map((row) => `| ${row.ok ? "Ready" : "Missing"} | ${row.label} | \`${row.path}\` | ${row.size} bytes |`)
    .join("\n");
}

function formatMarkerRows(rows) {
  return rows
    .map((row) => `| ${row.ok ? "Ready" : "Missing"} | ${row.label} | \`${row.path}\` | \`${row.marker}\` |`)
    .join("\n");
}

const fileRows = checkFiles(requiredFiles);
const artifactRows = checkFiles(requiredArtifacts);
const markerRows = checkMarkers(requiredNarrativeMarkers);
const proofRows = checkProofMarkers();
const videoManifest = checkVideoManifest();
const placeholders = findTallyPlaceholders();

const localFailures = [
  ...fileRows.filter((row) => !row.ok).map((row) => `${row.label}: ${row.path}`),
  ...artifactRows.filter((row) => !row.ok).map((row) => `${row.label}: ${row.path}`),
  ...markerRows.filter((row) => !row.ok).map((row) => `${row.label}: ${row.path}`),
  ...proofRows.filter((row) => !row.ok).map((row) => `Proof marker: ${row.marker}`),
  ...(videoManifest.ok ? [] : ["Final video manifest is missing, malformed, oversized, or too small"]),
  ...placeholders.filter((row) => row.present && !row.expectedExternal).map((row) => `Unexpected placeholder: ${row.placeholder}`),
];
const externalPending = placeholders.filter((row) => row.present && row.expectedExternal).map((row) => row.placeholder);
const strictFailures = strictExternal ? externalPending.map((placeholder) => `External placeholder still pending: ${placeholder}`) : [];
const exitFailures = [...localFailures, ...strictFailures];
const generatedAt = new Date().toISOString();

const report = `# Hookathon submission preflight

Generated: ${generatedAt}

Mode: ${strictExternal ? "strict external" : "local package"}

## Verdict

${exitFailures.length === 0 ? "Ready for the next external step." : "Not ready. See failures below."}

Local package failures: ${localFailures.length}

External placeholders pending: ${externalPending.length}

## Local Files

| Status | Item | Path | Size |
| --- | --- | --- | ---: |
${formatFileRows(fileRows)}

## Generated Artifacts

| Status | Item | Path | Size |
| --- | --- | --- | ---: |
${formatFileRows(artifactRows)}

## Narrative Markers

| Status | Item | Path | Marker |
| --- | --- | --- | --- |
${formatMarkerRows(markerRows)}

## Terminal Proof Markers

| Status | Marker |
| --- | --- |
${proofRows.map((row) => `| ${row.ok ? "Ready" : "Missing"} | \`${row.marker}\` |`).join("\n")}

## Final Video

- Status: ${videoManifest.ok ? "Ready" : "Missing or invalid"}
- Planned duration: ${Number.isFinite(videoManifest.plannedDuration) ? `${videoManifest.plannedDuration.toFixed(1)} seconds` : "unknown"}
- Size: ${Number.isFinite(videoManifest.sizeMb) ? `${videoManifest.sizeMb.toFixed(2)} MB` : "unknown"}

## Tally External Placeholders

${externalPending.length > 0 ? externalPending.map((placeholder) => `- ${placeholder}`).join("\n") : "- None"}

## Failures

${exitFailures.length > 0 ? exitFailures.map((failure) => `- ${failure}`).join("\n") : "- None"}

## Next External Steps

1. Run \`corepack yarn hookathon:links:check\` right before Tally submission.
2. Fill submitter email, team status, and course rating.
3. Submit https://tally.so/r/VLV1pa.
4. Record the private receipt with \`corepack yarn hookathon:submission:receipt\` after Tally confirms.
`;

mkdirSync(artifactDir, { recursive: true });
writeFileSync(reportPath, report);

console.log(`Hookathon submission preflight: ${exitFailures.length === 0 ? "ready" : "not ready"}`);
console.log(reportPath);
if (externalPending.length > 0) {
  console.log(`External placeholders pending: ${externalPending.join(", ")}`);
}
if (exitFailures.length > 0) {
  console.error(exitFailures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
}
