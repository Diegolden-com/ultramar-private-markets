import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactDir = resolve(repoRoot, "artifacts/hookathon");
const fieldMapPath = resolve(artifactDir, "tally-field-map-latest.json");
const publicPacketPath = resolve(repoRoot, "docs/HOOKATHON_TALLY_FINAL_PACKET.md");
const privatePacketPath = resolve(artifactDir, "tally-final-personalized-latest.md");
const reportPath = resolve(artifactDir, "tally-fill-plan-latest.md");
const jsonPath = resolve(artifactDir, "tally-fill-plan-latest.json");
const strictPersonalized = process.argv.includes("--strict-personalized");

const skipHeadings = new Set(["Did you integrate any of our partners?"]);
const conditionalHeadings = new Set(["Team details, if team Yes", "Future plans support, if shown"]);
const expectedPublicPlaceholders = new Set(["[submitter email]", "[Yes/No]", "[1-5]", "{{TEAM_DETAILS_IF_YES}}"]);

function read(path) {
  return readFileSync(path, "utf8");
}

function extractSection(packet, heading) {
  const lines = packet.split("\n");
  const start = lines.findIndex((line) => line.trim() === `### ${heading}`);
  if (start === -1) return "";

  const section = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.startsWith("### ") || line.startsWith("## ")) break;
    section.push(line);
  }

  return section.join("\n").trim();
}

function firstFence(section) {
  return section.match(/```(?:text|bash)?\n([\s\S]*?)\n```/)?.[1]?.trim() ?? "";
}

function valueForHeading(packet, heading) {
  return firstFence(extractSection(packet, heading));
}

function parseTags(value) {
  const selectLine = value.match(/^Select:\s*(.+)$/m)?.[1] ?? "";
  const otherLine = value.match(/^Other text:\s*(.+)$/m)?.[1] ?? "";
  return {
    selectedOptions: selectLine
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    otherText: otherLine.trim(),
  };
}

function actionForField(field, packet) {
  const heading = field.packetHeading;
  const question = field.question ?? {};
  const rawValue = valueForHeading(packet, heading);
  const value = rawValue.trim();
  const type = question.type ?? "UNKNOWN";
  const options = question.options ?? [];
  const hidden = Boolean(question.hidden);
  const required = Boolean(question.required);

  if (skipHeadings.has(heading)) {
    return {
      action: "skip_optional",
      value: "",
      note: "No sponsor-partner integration. Leave the optional sponsor-partner multiselect blank.",
    };
  }

  if (heading === "Project tags") {
    return {
      action: "select_multiselect_options",
      value: parseTags(value),
      note: "Use Other for the additional Specialized Markets descriptors.",
    };
  }

  if (heading === "Team details, if team Yes" && value === "This field stays hidden because team status is No.") {
    return {
      action: "skip_conditional",
      value,
      note: "Tally hides this required field when team status is No.",
    };
  }

  if (type === "MULTIPLE_CHOICE") {
    return {
      action: "select_choice",
      value,
      note: options.includes(value) ? "Exact option text is present in Tally." : "Select the closest matching visible option.",
    };
  }

  if (type === "RATING") {
    return {
      action: "set_rating",
      value,
      note: "Set the star rating to this number.",
    };
  }

  if (type === "MULTI_SELECT") {
    return {
      action: "select_multiselect_options",
      value: {
        selectedOptions: value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        otherText: "",
      },
      note: "Select every listed option.",
    };
  }

  return {
    action: hidden || conditionalHeadings.has(heading) ? "fill_if_visible" : "fill",
    value,
    note: required ? "Required field." : "Optional field.",
  };
}

function stringifyValue(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(", ");
  if (value && typeof value === "object") {
    const selected = value.selectedOptions?.length ? `select ${value.selectedOptions.join(", ")}` : "";
    const other = value.otherText ? `other: ${value.otherText}` : "";
    return [selected, other].filter(Boolean).join("; ");
  }
  return "";
}

function placeholdersIn(value) {
  const values = [];

  function collect(node) {
    if (typeof node === "string") {
      values.push(node);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(collect);
      return;
    }
    if (node && typeof node === "object") {
      Object.values(node).forEach(collect);
    }
  }

  collect(value);
  return Array.from(
    new Set(values.flatMap((text) => [...(text.match(/\[[^\]\n]+\]/g) ?? []), ...(text.match(/\{\{[^}\n]+\}\}/g) ?? [])])),
  );
}

if (!existsSync(fieldMapPath)) {
  console.error("Missing artifacts/hookathon/tally-field-map-latest.json. Run corepack yarn hookathon:tally:field-map first.");
  process.exit(1);
}

const packetPath = existsSync(privatePacketPath) ? privatePacketPath : publicPacketPath;
const packetSource = packetPath === privatePacketPath ? "private personalized packet" : "public final packet";
const packet = read(packetPath);
const fieldMap = JSON.parse(read(fieldMapPath));
const generatedAt = new Date().toISOString();
const rows = fieldMap.fields.map((field) => {
  const action = actionForField(field, packet);
  const placeholders = placeholdersIn(action.value);
  const unexpectedPlaceholders = placeholders.filter((placeholder) => !expectedPublicPlaceholders.has(placeholder));
  return {
    packetHeading: field.packetHeading,
    tallyQuestion: field.question?.title ?? "not found",
    type: field.question?.type ?? "UNKNOWN",
    required: Boolean(field.question?.required),
    hidden: Boolean(field.question?.hidden),
    ...action,
    placeholders,
    ok:
      field.ok &&
      unexpectedPlaceholders.length === 0 &&
      (stringifyValue(action.value).trim().length > 0 || action.action === "skip_optional"),
  };
});

const visibleRequiredMissing = rows.filter(
  (row) => row.required && !row.hidden && row.action !== "skip_optional" && stringifyValue(row.value).trim().length === 0,
);
const unexpectedPlaceholderRows = rows.filter((row) =>
  row.placeholders.some((placeholder) => !expectedPublicPlaceholders.has(placeholder)),
);
const remainingExpectedPlaceholders = Array.from(new Set(rows.flatMap((row) => row.placeholders))).filter((placeholder) =>
  expectedPublicPlaceholders.has(placeholder),
);
const failures = [
  ...rows.filter((row) => !row.ok).map((row) => `Fill-plan row is not ready: ${row.packetHeading}`),
  ...visibleRequiredMissing.map((row) => `Visible required value is missing: ${row.packetHeading}`),
  ...unexpectedPlaceholderRows.map((row) => `Unexpected placeholder in ${row.packetHeading}: ${row.placeholders.join(", ")}`),
  ...(strictPersonalized && remainingExpectedPlaceholders.length > 0
    ? [`Expected placeholders remain in strict personalized mode: ${remainingExpectedPlaceholders.join(", ")}`]
    : []),
];

function reportRow(row) {
  return `| ${row.ok ? "Ready" : "Needs input"} | ${row.packetHeading} | ${row.tallyQuestion} | ${row.action} | ${stringifyValue(row.value).replace(/\n/g, "<br>")} |`;
}

const report = `# Hookathon Tally fill plan

Generated: ${generatedAt}

Field map source: \`artifacts/hookathon/tally-field-map-latest.json\`

Packet source: ${packetSource}

Strict personalized mode: ${strictPersonalized ? "yes" : "no"}

## Verdict

${failures.length === 0 ? "Fill plan is ready." : "Fill plan needs attention."}

Failures: ${failures.length}

Expected placeholders still present: ${remainingExpectedPlaceholders.length > 0 ? remainingExpectedPlaceholders.join(", ") : "none"}

## Fill Plan

| Status | Packet heading | Tally question | Action | Value |
| --- | --- | --- | --- | --- |
${rows.map(reportRow).join("\n")}

## Failures

${failures.length > 0 ? failures.map((failure) => `- ${failure}`).join("\n") : "- None"}
`;

mkdirSync(artifactDir, { recursive: true });
writeFileSync(reportPath, report);
writeFileSync(jsonPath, JSON.stringify({ generatedAt, packetSource, strictPersonalized, rows, failures }, null, 2));

console.log(`Hookathon Tally fill plan: ${failures.length === 0 ? "ready" : "failed"}`);
console.log(reportPath);

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
}
