import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactDir = resolve(repoRoot, "artifacts/hookathon");
const reportPath = resolve(artifactDir, "tally-field-map-latest.md");
const jsonPath = resolve(artifactDir, "tally-field-map-latest.json");
const tallyUrl = "https://tally.so/r/VLV1pa";
const timeoutMs = 30_000;

const expectedFields = [
  { packetHeading: "Project Title", titleIncludes: "Project Title" },
  { packetHeading: "Email", titleIncludes: "Email" },
  { packetHeading: "1-2 sentence description", titleIncludes: "1-2 sentence description" },
  { packetHeading: "Did you integrate any of our partners?", titleIncludes: "Did you integrate any of our partners?" },
  { packetHeading: "Partner integration details", titleIncludes: "How did you integrate our partners" },
  { packetHeading: "Current theme", titleIncludes: "Does your project address the current Uniswap Hookathon theme?" },
  { packetHeading: "Project tags", titleIncludes: "What are some of your project tags?" },
  { packetHeading: "GitHub Repo", titleIncludes: "GitHub Repo" },
  { packetHeading: "My Github repo is public, so it can be judged", titleIncludes: "My Github repo is public" },
  { packetHeading: "Slide Deck link", titleIncludes: "Slide Deck link" },
  { packetHeading: "Demo video link", titleIncludes: "Demo video link" },
  { packetHeading: "Project link", titleIncludes: "Project link" },
  { packetHeading: "Problem / Background", titleIncludes: "Problem / Background" },
  { packetHeading: "Impact", titleIncludes: "Impact:" },
  { packetHeading: "Challenges", titleIncludes: "Challenges:" },
  { packetHeading: "Did you work with a team?", titleIncludes: "Did you work with a team?" },
  { packetHeading: "Team details, if team Yes", titleIncludes: "Team: Who is on the team?", conditional: true },
  { packetHeading: "Continue after graduation", titleIncludes: "continue working on this or another Hook project after graduation" },
  { packetHeading: "Future plans support, if shown", titleIncludes: "future plans for your hook project", conditional: true },
  { packetHeading: "Course rating", titleIncludes: "rate your Uniswap v4 Course experience" },
  { packetHeading: "Course feedback", titleIncludes: "Tell us more about what parts of Uniswap v4 Course" },
];

function normalizeText(value) {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function schemaText(schema) {
  if (!Array.isArray(schema)) return "";

  function flatten(node) {
    if (typeof node === "string") return node;
    if (!Array.isArray(node)) return "";
    if (
      typeof node[0] === "string" &&
      Array.isArray(node[1]) &&
      node[1].every((item) => Array.isArray(item) && typeof item[0] === "string")
    ) {
      return node[0];
    }
    return node.map(flatten).join("");
  }

  return normalizeText(schema.map(flatten).join(""));
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Ultramar Hookathon tally-field-map/1.0",
        accept: "text/html,application/xhtml+xml,text/plain,*/*",
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

function extractNextData(html) {
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) throw new Error("Could not find Tally __NEXT_DATA__ payload");
  return JSON.parse(match[1]);
}

function extractQuestions(blocks) {
  const questions = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const titleBlock = blocks[index];
    if (titleBlock.type !== "TITLE") continue;

    const relatedBlocks = [];
    for (let cursor = index + 1; cursor < blocks.length && blocks[cursor].type !== "TITLE"; cursor += 1) {
      relatedBlocks.push(blocks[cursor]);
    }

    const inputBlocks = relatedBlocks.filter((block) =>
      ["INPUT_TEXT", "INPUT_EMAIL", "INPUT_LINK", "TEXTAREA", "RATING"].includes(block.type),
    );
    const optionBlocks = relatedBlocks.filter((block) => block.type.endsWith("_OPTION"));
    const textBlocks = relatedBlocks.filter((block) => block.type === "TEXT");
    const options = optionBlocks.map((block) => block.payload.text).filter(Boolean);
    const kind =
      inputBlocks.map((block) => block.type).join(", ") ||
      optionBlocks[0]?.groupType ||
      relatedBlocks[0]?.groupType ||
      "UNKNOWN";

    questions.push({
      title: schemaText(titleBlock.payload.safeHTMLSchema),
      type: kind,
      required: relatedBlocks.some((block) => block.payload?.isRequired),
      hidden: Boolean(titleBlock.payload?.isHidden),
      options,
      helpText: textBlocks.map((block) => schemaText(block.payload.safeHTMLSchema)).filter(Boolean),
    });
  }

  return questions;
}

function findQuestion(questions, titleIncludes) {
  const needle = titleIncludes.toLowerCase();
  return questions.find((question) => question.title.toLowerCase().includes(needle));
}

function reportRow(row) {
  const question = row.question;
  const options = question?.options?.length ? question.options.slice(0, 8).join(", ") : "n/a";
  return `| ${row.ok ? "Ready" : "Missing"} | ${row.packetHeading} | ${question?.title ?? "not found"} | ${question?.type ?? "n/a"} | ${question?.required ? "yes" : "no"} | ${question?.hidden ? "yes" : "no"} | ${options} |`;
}

const response = await fetchWithTimeout(tallyUrl);
const html = await response.text();
const nextData = extractNextData(html);
const blocks = nextData.props?.pageProps?.blocks ?? [];
const questions = extractQuestions(blocks);
const packet = readFileSync(resolve(repoRoot, "docs/HOOKATHON_TALLY_FINAL_PACKET.md"), "utf8");
const mapped = expectedFields.map((field) => {
  const question = findQuestion(questions, field.titleIncludes);
  return {
    ...field,
    ok: Boolean(question) && packet.includes(`### ${field.packetHeading}`),
    question,
  };
});
const mappedTitles = new Set(mapped.filter((field) => field.question).map((field) => field.question.title));
const unmappedVisibleRequired = questions.filter(
  (question) => question.required && !question.hidden && !mappedTitles.has(question.title),
);
const themeText = html.includes("2026 UHI8 Uniswap Hookathon Theme") && html.includes("Specialized Markets");
const failures = [
  ...mapped.filter((field) => !field.ok).map((field) => `Missing field mapping: ${field.packetHeading}`),
  ...unmappedVisibleRequired.map((question) => `Visible required Tally field is not mapped: ${question.title}`),
  ...(themeText ? [] : ["Tally theme marker not found: 2026 UHI8 Specialized Markets"]),
];
const generatedAt = new Date().toISOString();

const report = `# Hookathon Tally field map

Generated: ${generatedAt}

Source: ${tallyUrl}

HTTP status: ${response.status}

## Verdict

${failures.length === 0 ? "Current Tally fields match the final copy packet." : "Tally field mapping needs attention."}

Failures: ${failures.length}

Theme marker: ${themeText ? "2026 UHI8 Specialized Markets found" : "missing"}

## Field Map

| Status | Packet heading | Tally question | Type | Required | Hidden | Options preview |
| --- | --- | --- | --- | --- | --- | --- |
${mapped.map(reportRow).join("\n")}

## Unmapped Visible Required Fields

${unmappedVisibleRequired.length > 0 ? unmappedVisibleRequired.map((question) => `- ${question.title}`).join("\n") : "- None"}

## Failures

${failures.length > 0 ? failures.map((failure) => `- ${failure}`).join("\n") : "- None"}
`;

mkdirSync(artifactDir, { recursive: true });
writeFileSync(reportPath, report);
writeFileSync(jsonPath, JSON.stringify({ generatedAt, tallyUrl, fields: mapped, unmappedVisibleRequired }, null, 2));

console.log(`Hookathon Tally field map: ${failures.length === 0 ? "ready" : "failed"}`);
console.log(reportPath);

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
}
