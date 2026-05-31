import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contractsDir = resolve(repoRoot, "apps/private-equities/contracts");
const outDir = resolve(repoRoot, "artifacts/hookathon");
const proofPath = resolve(outDir, "terminal-proof-latest.md");

const command = "forge";
const args = ["script", "script/CapitalWindowDemo.s.sol:CapitalWindowDemo", "-vv"];
const startedAt = new Date().toISOString();

const result = spawnSync(command, args, {
  cwd: contractsDir,
  encoding: "utf8",
  env: process.env,
});

const rawOutput = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
const cleanOutput = rawOutput.replace(/\u001b\[[0-9;]*m/g, "");

const markers = [
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

const markerRows = markers.map((marker) => ({
  marker,
  found: cleanOutput.includes(marker),
}));
const missingMarkers = markerRows.filter((row) => !row.found);

const interestingPrefixes = [
  "Ultramar Port of Call",
  "PoolManager",
  "CapitalWindowHook",
  "CapitalWindowRouter",
  "Demo investor",
  "APPROVED window",
  "exact input",
  "quoted LCX output",
  "effective price",
  "settled:",
  "treasury USDC balance",
  "investor LCX balance",
  "MISSING PASSPORT",
  "GENERIC ROUTER",
  "EXPIRED AUTHORIZATION",
  "MIN OUTPUT",
  "REPLAY",
  "STALE ORACLE",
  "blocked:",
  "Demo complete",
];

const cleanTerminalMarkers = cleanOutput
  .split(/\r?\n/)
  .map((line) => line.trimEnd())
  .filter((line) => interestingPrefixes.some((prefix) => line.trimStart().startsWith(prefix)))
  .join("\n");

const proof = `# Ultramar Port of Call terminal proof

Generated: ${startedAt}

Working directory:

\`\`\`text
${contractsDir}
\`\`\`

Command:

\`\`\`bash
${command} ${args.join(" ")}
\`\`\`

Exit code: ${result.status ?? "signal"}

## Required markers

${markerRows.map((row) => `- ${row.found ? "[x]" : "[ ]"} \`${row.marker}\``).join("\n")}

## Clean terminal markers

\`\`\`text
${cleanTerminalMarkers}
\`\`\`

## Raw output

\`\`\`text
${cleanOutput.trim()}
\`\`\`
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(proofPath, proof);

if (result.status !== 0) {
  console.error(`Hookathon terminal proof command failed with exit code ${result.status}.`);
  console.error(`Proof written to ${proofPath}`);
  process.exit(result.status ?? 1);
}

if (missingMarkers.length > 0) {
  console.error("Hookathon terminal proof is missing required markers:");
  for (const row of missingMarkers) {
    console.error(`- ${row.marker}`);
  }
  console.error(`Proof written to ${proofPath}`);
  process.exit(1);
}

console.log("Hookathon terminal proof generated.");
console.log(proofPath);
console.log("All required settlement and revert markers were found.");
