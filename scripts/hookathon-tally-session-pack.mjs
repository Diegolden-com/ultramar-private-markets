import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactDir = resolve(repoRoot, "artifacts/hookathon");
const fillPlanPath = resolve(artifactDir, "tally-fill-plan-latest.json");
const markdownPath = resolve(artifactDir, "tally-browser-session-latest.md");
const htmlPath = resolve(artifactDir, "tally-browser-session-latest.html");
const jsonPath = resolve(artifactDir, "tally-browser-session-latest.json");
const strictPersonalized = process.argv.includes("--strict-personalized");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function stringifyValue(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(", ");
  if (value && typeof value === "object") {
    const selected = value.selectedOptions?.length ? `Select: ${value.selectedOptions.join(", ")}` : "";
    const other = value.otherText ? `Other text: ${value.otherText}` : "";
    return [selected, other].filter(Boolean).join("\n");
  }
  return "";
}

function placeholdersIn(value) {
  return Array.from(
    new Set(
      stringifyValue(value).match(/(\[[^\]\n]+\]|\{\{[^}\n]+\}\})/g) ?? [],
    ),
  );
}

function actionLabel(action) {
  return action
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function markdownRow(row, index) {
  const value = stringifyValue(row.value);
  const placeholders = placeholdersIn(row.value);
  const placeholderLine = placeholders.length > 0 ? `\n- Placeholder: ${placeholders.join(", ")}` : "";
  const valueBlock = value.length > 0 ? `\n\n\`\`\`text\n${value}\n\`\`\`` : "";

  return `### ${index + 1}. ${row.packetHeading}

- Tally question: ${row.tallyQuestion}
- Action: ${actionLabel(row.action)}
- Required: ${row.required ? "yes" : "no"}
- Conditional/hidden: ${row.hidden ? "yes" : "no"}
- Note: ${row.note}${placeholderLine}${valueBlock}
`;
}

function htmlValueControl(row, index) {
  const value = stringifyValue(row.value);
  if (value.length === 0) {
    return `<p class="empty">No value to paste.</p>`;
  }

  return `<textarea id="value-${index}" readonly>${escapeHtml(value)}</textarea>
<button type="button" data-copy="value-${index}">Copy value</button>`;
}

function htmlTags(row) {
  const tags = [
    row.required ? "required" : "optional",
    row.hidden ? "conditional" : "visible",
    row.placeholders?.length ? "needs personal input" : "ready",
  ];
  return tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
}

function htmlRow(row, index) {
  return `<section class="field ${row.placeholders?.length ? "pending" : "ready"}">
  <div class="meta">
    <p class="step">${index + 1}</p>
    <div>
      <h2>${escapeHtml(row.packetHeading)}</h2>
      <p>${escapeHtml(row.tallyQuestion)}</p>
      <div class="tags">${htmlTags(row)}</div>
    </div>
  </div>
  <dl>
    <div><dt>Action</dt><dd>${escapeHtml(actionLabel(row.action))}</dd></div>
    <div><dt>Note</dt><dd>${escapeHtml(row.note)}</dd></div>
    ${
      row.placeholders?.length
        ? `<div><dt>Before submit</dt><dd>Replace ${escapeHtml(row.placeholders.join(", "))}</dd></div>`
        : ""
    }
  </dl>
  ${htmlValueControl(row, index)}
</section>`;
}

if (!existsSync(fillPlanPath)) {
  console.error("Missing artifacts/hookathon/tally-fill-plan-latest.json. Run corepack yarn hookathon:tally:fill-plan first.");
  process.exit(1);
}

const fillPlan = JSON.parse(readFileSync(fillPlanPath, "utf8"));
const rows = fillPlan.rows ?? [];
const generatedAt = new Date().toISOString();
const remainingPlaceholders = Array.from(new Set(rows.flatMap((row) => placeholdersIn(row.value))));
const failures = [
  ...(fillPlan.failures ?? []),
  ...(strictPersonalized && remainingPlaceholders.length > 0
    ? [`Personalized session still has placeholders: ${remainingPlaceholders.join(", ")}`]
    : []),
];
const submitReady = failures.length === 0 && remainingPlaceholders.length === 0;
const session = {
  generatedAt,
  tallyUrl: "https://tally.so/r/VLV1pa",
  packetSource: fillPlan.packetSource,
  strictPersonalized,
  submitReady,
  remainingPlaceholders,
  failures,
  rows,
};

const markdown = `# Hookathon Tally browser session pack

Generated: ${generatedAt}

Tally form: https://tally.so/r/VLV1pa

Packet source: ${fillPlan.packetSource}

Strict personalized mode: ${strictPersonalized ? "yes" : "no"}

Failures: ${failures.length}

Submit-ready: ${submitReady ? "yes" : "no"}

Remaining placeholders: ${remainingPlaceholders.length > 0 ? remainingPlaceholders.join(", ") : "none"}

## Browser Session

Open the Tally form in one tab and this file in another tab. Copy/paste each field in order. Do not press Submit while any placeholder remains.

${rows.map(markdownRow).join("\n")}

## Failures

${failures.length > 0 ? failures.map((failure) => `- ${failure}`).join("\n") : "- None"}
`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hookathon Tally Browser Session Pack</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #12100d;
      --muted: #645d52;
      --line: #ded8cf;
      --paper: #fffaf2;
      --ready: #0f6b43;
      --pending: #9a4f00;
      --accent: #084f75;
    }
    body {
      margin: 0;
      background: var(--paper);
      color: var(--ink);
      font: 15px/1.45 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    header,
    main {
      max-width: 1100px;
      margin: 0 auto;
      padding: 24px;
    }
    header {
      border-bottom: 1px solid var(--line);
    }
    h1 {
      margin: 0 0 8px;
      font-size: 28px;
      letter-spacing: 0;
    }
    h2 {
      margin: 0;
      font-size: 18px;
      letter-spacing: 0;
    }
    p {
      margin: 0;
    }
    a {
      color: var(--accent);
      font-weight: 650;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 10px;
      margin-top: 18px;
    }
    .summary div,
    .field {
      border: 1px solid var(--line);
      background: #fff;
      border-radius: 8px;
    }
    .summary div {
      padding: 12px;
    }
    .summary dt,
    dl dt {
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .summary dd,
    dl dd {
      margin: 3px 0 0;
    }
    .field {
      margin: 14px 0;
      padding: 16px;
    }
    .field.pending {
      border-color: #d8a04f;
    }
    .meta {
      display: grid;
      grid-template-columns: 40px 1fr;
      gap: 12px;
    }
    .step {
      display: grid;
      width: 32px;
      height: 32px;
      place-items: center;
      border-radius: 50%;
      background: var(--accent);
      color: #fff;
      font-weight: 700;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }
    .tags span {
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 3px 8px;
      color: var(--muted);
      font-size: 12px;
    }
    dl {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 10px;
      margin: 14px 0;
    }
    dl div {
      min-width: 0;
    }
    textarea {
      box-sizing: border-box;
      width: 100%;
      min-height: 92px;
      resize: vertical;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 10px;
      font: 13px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      color: var(--ink);
      background: #fffdfa;
    }
    button {
      margin-top: 8px;
      border: 1px solid var(--accent);
      border-radius: 6px;
      background: var(--accent);
      color: #fff;
      font: inherit;
      font-weight: 700;
      padding: 8px 12px;
      cursor: pointer;
    }
    .empty {
      color: var(--muted);
      font-style: italic;
    }
    .status {
      color: ${submitReady ? "var(--ready)" : "var(--pending)"};
      font-weight: 800;
    }
  </style>
</head>
<body>
  <header>
    <h1>Hookathon Tally Browser Session Pack</h1>
    <p>Open <a href="https://tally.so/r/VLV1pa">Tally</a> in one tab and this file in another. Copy/paste in order. Do not submit while placeholders remain.</p>
    <div class="summary">
      <div><dt>Generated</dt><dd>${escapeHtml(generatedAt)}</dd></div>
      <div><dt>Packet source</dt><dd>${escapeHtml(fillPlan.packetSource)}</dd></div>
      <div><dt>Submit-ready</dt><dd class="status">${submitReady ? "yes" : "no"}</dd></div>
      <div><dt>Remaining placeholders</dt><dd>${escapeHtml(remainingPlaceholders.length > 0 ? remainingPlaceholders.join(", ") : "none")}</dd></div>
    </div>
  </header>
  <main>
    ${rows.map(htmlRow).join("\n")}
  </main>
  <script>
    document.querySelectorAll("[data-copy]").forEach((button) => {
      button.addEventListener("click", async () => {
        const target = document.getElementById(button.dataset.copy);
        target.focus();
        target.select();
        try {
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(target.value);
          } else {
            document.execCommand("copy");
          }
        } catch {
          document.execCommand("copy");
        }
        const original = button.textContent;
        button.textContent = "Copied";
        window.setTimeout(() => {
          button.textContent = original;
        }, 1000);
      });
    });
  </script>
</body>
</html>
`;

mkdirSync(artifactDir, { recursive: true });
writeFileSync(markdownPath, markdown);
writeFileSync(htmlPath, html);
writeFileSync(jsonPath, JSON.stringify(session, null, 2));

console.log(`Hookathon Tally browser session pack: ${submitReady ? "submit-ready" : "needs personal input"}`);
console.log(markdownPath);
console.log(htmlPath);

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
}
