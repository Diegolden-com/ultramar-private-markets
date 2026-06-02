import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contractsDir = resolve(repoRoot, "apps/private-equities/contracts");
const artifactDir = resolve(repoRoot, "artifacts/hookathon");
const reportPath = resolve(artifactDir, "testnet-dry-run-latest.md");
const jsonPath = resolve(artifactDir, "testnet-dry-run-latest.json");
const defaultDryRunKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const rpcUrl =
  process.env.HOOKATHON_TESTNET_RPC_URL ||
  process.env.BASE_SEPOLIA_RPC_URL ||
  "https://sepolia.base.org";
const command = "forge";
const args = [
  "script",
  "script/DeployCapitalWindowTestnet.s.sol:DeployCapitalWindowTestnet",
  "--rpc-url",
  rpcUrl,
  "-vv",
];
const startedAt = new Date().toISOString();

const result = spawnSync(command, args, {
  cwd: contractsDir,
  encoding: "utf8",
  env: {
    ...process.env,
    DEPLOYER_PRIVATE_KEY: process.env.DEPLOYER_PRIVATE_KEY || defaultDryRunKey,
    CAPITAL_WINDOW_RUN_SMOKE_SWAP: "true",
  },
});

const rawOutput = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
const cleanOutput = rawOutput.replace(/\u001b\[[0-9;]*m/g, "");

const markers = [
  "Ultramar Port of Call testnet deployment",
  "chain id 84532",
  "PoolManager 0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408",
  "CapitalWindowHook",
  "Window id 1",
  "Hook salt:",
  "Smoke swap exact input USDC 1500000000000000000000",
  "Smoke swap quoted LCX output 1454545454545454545454",
  "Smoke swap effective price 1031250000000000000",
  "Smoke swap delta amount0",
  "Smoke swap delta amount1",
  "Smoke swap: approved exact-input swap executed in this simulation/broadcast",
  "SIMULATION COMPLETE",
];

const forbiddenMarkers = [
  "ONCHAIN EXECUTION COMPLETE",
  "Transaction hash:",
];

const hookAddress = cleanOutput.match(/CapitalWindowHook\s+(0x[0-9a-fA-F]{40})/)?.[1] ?? "";
const derivedMarkers = [
  {
    marker: "CapitalWindowHook permission mask 0xa88",
    found: hookAddress.toLowerCase().endsWith("a88"),
  },
];

const markerRows = [
  ...markers.map((marker) => ({
    marker,
    found: cleanOutput.includes(marker),
  })),
  ...derivedMarkers,
];
const missingMarkers = markerRows.filter((row) => !row.found);
const forbiddenRows = forbiddenMarkers.map((marker) => ({
  marker,
  found: cleanOutput.includes(marker),
}));
const foundForbiddenMarkers = forbiddenRows.filter((row) => row.found);

const interestingPrefixes = [
  "Ultramar Port of Call",
  "chain id",
  "PoolManager",
  "Mock USDC",
  "LCX token",
  "SolvencyRegistry",
  "CapitalWindowRegistry",
  "CapitalWindowRouter",
  "CapitalWindowHook",
  "Window id",
  "Demo investor",
  "Hook salt",
  "Smoke swap",
  "Demo investor LCX balance",
  "Treasury USDC balance",
  "SIMULATION COMPLETE",
];

const cleanTerminalMarkers = cleanOutput
  .split(/\r?\n/)
  .map((line) => line.trimEnd())
  .filter((line) => interestingPrefixes.some((prefix) => line.trimStart().startsWith(prefix)))
  .join("\n");

const report = `# Hookathon Base Sepolia dry-run proof

Generated: ${startedAt}

Working directory:

\`\`\`text
${contractsDir}
\`\`\`

Command:

\`\`\`bash
CAPITAL_WINDOW_RUN_SMOKE_SWAP=true forge script script/DeployCapitalWindowTestnet.s.sol:DeployCapitalWindowTestnet --rpc-url ${rpcUrl} -vv
\`\`\`

Private key source: ${process.env.DEPLOYER_PRIVATE_KEY ? "provided environment key, redacted from this report" : "default public Foundry/Anvil test key"}

Broadcast: no

Exit code: ${result.status ?? "signal"}

## Required markers

${markerRows.map((row) => `- ${row.found ? "[x]" : "[ ]"} \`${row.marker}\``).join("\n")}

## Forbidden broadcast markers

${forbiddenRows.map((row) => `- ${row.found ? "[ ]" : "[x]"} \`${row.marker}\``).join("\n")}

## Clean terminal markers

\`\`\`text
${cleanTerminalMarkers}
\`\`\`

## Scope

This is dry-run evidence against Base Sepolia RPC using the official v4 PoolManager address for chain id \`84532\`. It proves the optional public-testnet deployment path can mine a hook address with the required \`0xa88\` permission mask, create window \`1\`, and execute one approved exact-input smoke swap in simulation. It is not explorer-verifiable broadcast evidence.

## Raw output

\`\`\`text
${cleanOutput.trim()}
\`\`\`
`;

mkdirSync(artifactDir, { recursive: true });
writeFileSync(reportPath, report);
writeFileSync(
  jsonPath,
  JSON.stringify(
    {
      generatedAt: startedAt,
      rpcUrl,
      exitCode: result.status ?? null,
      markers: markerRows,
      forbiddenMarkers: forbiddenRows,
      missingMarkers: missingMarkers.map((row) => row.marker),
      foundForbiddenMarkers: foundForbiddenMarkers.map((row) => row.marker),
      hookAddress,
      reportPath: reportPath.replace(`${repoRoot}/`, ""),
    },
    null,
    2,
  ),
);

if (result.status !== 0) {
  console.error(`Hookathon Base Sepolia dry-run failed with exit code ${result.status}.`);
  console.error(`Report written to ${reportPath}`);
  process.exit(result.status ?? 1);
}

if (missingMarkers.length > 0 || foundForbiddenMarkers.length > 0) {
  if (missingMarkers.length > 0) {
    console.error("Hookathon Base Sepolia dry-run is missing required markers:");
    for (const row of missingMarkers) console.error(`- ${row.marker}`);
  }
  if (foundForbiddenMarkers.length > 0) {
    console.error("Hookathon Base Sepolia dry-run unexpectedly found broadcast markers:");
    for (const row of foundForbiddenMarkers) console.error(`- ${row.marker}`);
  }
  console.error(`Report written to ${reportPath}`);
  process.exit(1);
}

console.log("Hookathon Base Sepolia dry-run proof generated.");
console.log(reportPath);
