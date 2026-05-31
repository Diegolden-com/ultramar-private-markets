import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactDir = resolve(repoRoot, "artifacts/hookathon");
const sourcePath = resolve(repoRoot, "docs/HOOKATHON_TALLY_FINAL_PACKET.md");
const outputPath = resolve(artifactDir, "tally-final-personalized-latest.md");
const checkOnly = process.argv.includes("--check-only");

const rawEmail = process.env.HOOKATHON_SUBMITTER_EMAIL?.trim() ?? "";
const rawTeam = process.env.HOOKATHON_WORKED_WITH_TEAM?.trim() ?? "";
const rawRating = process.env.HOOKATHON_COURSE_RATING?.trim() ?? "";

function normalizeTeam(value) {
  const normalized = value.toLowerCase();
  if (["yes", "y", "true", "1"].includes(normalized)) return "Yes";
  if (["no", "n", "false", "0"].includes(normalized)) return "No";
  return "";
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const team = normalizeTeam(rawTeam);
const rating = Number(rawRating);

const failures = [
  ...(validateEmail(rawEmail) ? [] : ["HOOKATHON_SUBMITTER_EMAIL must be a valid email address"]),
  ...(team ? [] : ["HOOKATHON_WORKED_WITH_TEAM must be Yes or No"]),
  ...(Number.isInteger(rating) && rating >= 1 && rating <= 5 ? [] : ["HOOKATHON_COURSE_RATING must be an integer from 1 to 5"]),
];

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

const source = readFileSync(sourcePath, "utf8");
const personalized = source
  .replaceAll("[submitter email]", rawEmail)
  .replaceAll("[Yes/No]", team)
  .replaceAll("[1-5]", String(rating));
const unresolved = Array.from(new Set(personalized.match(/\[[^\]\n]+\]/g) ?? []));

if (unresolved.length > 0) {
  console.error(`Unresolved placeholders remain: ${unresolved.join(", ")}`);
  process.exit(1);
}

const output = `# Personalized Hookathon Tally packet

Generated: ${new Date().toISOString()}

Source: \`docs/HOOKATHON_TALLY_FINAL_PACKET.md\`

Privacy note: this file contains submitter-specific information and is generated under \`artifacts/\`, which is ignored by git.

${personalized}
`;

if (checkOnly) {
  console.log("Personalized Hookathon Tally packet validated.");
  console.log("No file written because --check-only was provided.");
  process.exit(0);
}

mkdirSync(artifactDir, { recursive: true });
writeFileSync(outputPath, output);

console.log("Personalized Hookathon Tally packet generated.");
console.log(outputPath);
