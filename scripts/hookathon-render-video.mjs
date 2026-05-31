import { mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactDir = resolve(repoRoot, "artifacts/hookathon");
const frameDir = resolve(artifactDir, "frames");
const videoDir = resolve(artifactDir, "video");
const renderDir = resolve(artifactDir, "video-render");
const recordDir = resolve(renderDir, "recording");
const storyboardPath = resolve(renderDir, "final-demo-storyboard.html");
const captionsPath = resolve(videoDir, "final-demo-latest.vtt");
const manifestPath = resolve(videoDir, "final-demo-manifest-latest.md");
const finalVideoPath = resolve(videoDir, "final-demo-latest.webm");
const terminalProofPath = resolve(artifactDir, "terminal-proof-latest.md");

const segments = [
  {
    frame: "01-hero-port-of-call.png",
    duration: 9,
    eyebrow: "0:00 / Hookathon thesis",
    title: "Private-market capital breaks before settlement.",
    caption:
      "Language, diligence, eligibility, legal limits, allocation, and reporting are disconnected before a transaction can happen.",
  },
  {
    frame: "02-travel-feed.png",
    duration: 9,
    eyebrow: "0:09 / Ablo-style discovery",
    title: "The investor travels to a local capital port.",
    caption:
      "Port of Call starts with place, operator context, and translated diligence instead of a public buy button.",
  },
  {
    frame: "03-passport-and-quote.png",
    duration: 10,
    eyebrow: "0:18 / Passport and quote",
    title: "Eligibility becomes signed execution context.",
    caption:
      "The passport carries window id, investor, minimum output, deadline, nonce, and authorizer signature into hookData.",
  },
  {
    frame: "04-approved-scenario.png",
    duration: 10,
    eyebrow: "0:28 / Approved path",
    title: "Exact-input USDC settles through v4 custom accounting.",
    caption:
      "CapitalWindowRouter calls PoolManager; beforeSwap verifies the passport and beforeSwapReturnDelta returns 1,454.54 LCX.",
  },
  {
    frame: "05-generic-router-revert.png",
    duration: 9,
    eyebrow: "0:38 / Route protection",
    title: "A valid stamp cannot ride the wrong route.",
    caption:
      "The signature is bound to CapitalWindowRouter, so generic v4 router bypasses revert before any custom delta is returned.",
  },
  {
    frame: "06-replay-revert.png",
    duration: 8,
    eyebrow: "0:47 / Replay protection",
    title: "The same passport cannot settle twice.",
    caption:
      "Nonce consumption turns replay into an explicit failure and keeps window fill reconcilable.",
  },
  {
    frame: "07-specialized-markets-claim.png",
    duration: 10,
    eyebrow: "0:55 / Specialized Markets",
    title: "Private operating-business capital needs asset-specific market rules.",
    caption:
      "Eligibility, caps, transfer boundaries, oracle freshness, and router provenance become settlement checks.",
  },
  {
    frame: "08-pitch-deck-close.png",
    duration: 8,
    eyebrow: "1:05 / Deck close",
    title: "Uniswap v4 can host private-market windows without pretending they are public AMMs.",
    caption:
      "The memorable hook is the passport checkpoint. The practical hook is deterministic settlement control.",
  },
  {
    frame: null,
    duration: 15,
    eyebrow: "1:13 / Terminal proof",
    title: "One approved settlement, six blocked paths.",
    caption:
      "The local proof shows the hook boundary: approved settlement plus missing passport, generic router, expired, min output, replay, and stale oracle reverts.",
  },
];
const plannedDuration = segments.reduce((sum, segment) => sum + segment.duration, 0);

function assertFile(path, label) {
  try {
    const stats = statSync(path);
    if (!stats.isFile() || stats.size === 0) throw new Error("empty");
  } catch {
    throw new Error(`${label} is missing. Run corepack yarn hookathon:video:proof and corepack yarn hookathon:capture:demo first.\nMissing: ${path}`);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatTime(seconds) {
  const whole = Math.floor(seconds);
  const ms = Math.round((seconds - whole) * 1000);
  const h = Math.floor(whole / 3600);
  const m = Math.floor((whole % 3600) / 60);
  const s = whole % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

function latestVideoFile() {
  const files = readdirSync(recordDir)
    .filter((file) => file.endsWith(".webm"))
    .map((file) => resolve(recordDir, file));
  return files.sort((a, b) => statSync(a).mtimeMs - statSync(b).mtimeMs).at(-1);
}

function cleanTerminalMarkers() {
  const proof = readFileSync(terminalProofPath, "utf8");
  const match = proof.match(/## Clean terminal markers\s+```text\n([\s\S]*?)\n```/);
  if (!match) {
    throw new Error(`Clean terminal markers section was not found in ${terminalProofPath}`);
  }

  return match[1]
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => {
      const trimmed = line.trim();
      return (
        trimmed === "APPROVED window 1" ||
        trimmed.startsWith("exact input USDC") ||
        trimmed.startsWith("quoted LCX output") ||
        trimmed === "MISSING PASSPORT window 2" ||
        trimmed === "GENERIC ROUTER window 3" ||
        trimmed === "EXPIRED AUTHORIZATION window 4" ||
        trimmed === "MIN OUTPUT window 5" ||
        trimmed === "REPLAY window 6" ||
        trimmed === "STALE ORACLE window 7" ||
        trimmed.startsWith("Demo complete:")
      );
    })
    .join("\n");
}

function buildCaptions() {
  let cursor = 0;
  const blocks = ["WEBVTT", ""];
  for (const [index, segment] of segments.entries()) {
    const start = cursor;
    const end = cursor + segment.duration;
    blocks.push(String(index + 1));
    blocks.push(`${formatTime(start)} --> ${formatTime(end)}`);
    blocks.push(`${segment.title} ${segment.caption}`);
    blocks.push("");
    cursor = end;
  }
  return blocks.join("\n");
}

function buildStoryboardHtml(markers) {
  const payload = segments.map((segment) => ({
    ...segment,
    image: segment.frame ? pathToFileURL(resolve(frameDir, segment.frame)).href : null,
  }));

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Ultramar Port of Call Hookathon Video</title>
    <style>
      :root {
        color-scheme: dark;
        --ink: #090b0f;
        --panel: #10141b;
        --paper: #f3f1ea;
        --line: #2a3342;
        --muted: #aeb6c4;
        --accent: #13f2a3;
        --danger: #ff8b83;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body,
      #stage {
        width: 100%;
        height: 100%;
        margin: 0;
        overflow: hidden;
        background: var(--ink);
        color: var(--paper);
      }

      body {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      }

      #stage {
        position: relative;
        display: grid;
        grid-template-columns: minmax(0, 1fr);
      }

      .frame {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.74;
        filter: saturate(0.9) contrast(1.08);
      }

      .scrim {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(90deg, rgba(9, 11, 15, 0.96) 0%, rgba(9, 11, 15, 0.72) 42%, rgba(9, 11, 15, 0.32) 100%),
          linear-gradient(0deg, rgba(9, 11, 15, 0.9) 0%, rgba(9, 11, 15, 0.08) 45%, rgba(9, 11, 15, 0.72) 100%);
      }

      .grid {
        position: absolute;
        inset: 0;
        opacity: 0.2;
        background-image:
          linear-gradient(var(--line) 1px, transparent 1px),
          linear-gradient(90deg, var(--line) 1px, transparent 1px);
        background-size: 48px 48px;
      }

      .brand {
        position: absolute;
        top: 34px;
        left: 42px;
        z-index: 3;
        font: 700 22px Georgia, "Times New Roman", serif;
        letter-spacing: 0;
      }

      .brand em {
        font-style: italic;
        opacity: 0.86;
      }

      .badge {
        position: absolute;
        top: 38px;
        right: 42px;
        z-index: 3;
        border: 1px solid rgba(19, 242, 163, 0.65);
        padding: 10px 12px;
        color: var(--accent);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .content {
        position: absolute;
        z-index: 2;
        left: 42px;
        bottom: 44px;
        width: min(860px, calc(100% - 84px));
      }

      .eyebrow {
        color: var(--accent);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      h1 {
        margin: 20px 0 0;
        font: 700 60px/0.98 Georgia, "Times New Roman", serif;
        letter-spacing: 0;
        max-width: 920px;
      }

      .caption {
        margin-top: 24px;
        max-width: 760px;
        color: var(--muted);
        font-size: 22px;
        line-height: 1.45;
      }

      .progress {
        position: absolute;
        left: 42px;
        right: 42px;
        bottom: 24px;
        z-index: 4;
        height: 2px;
        background: rgba(243, 241, 234, 0.22);
      }

      .progress span {
        display: block;
        height: 100%;
        width: var(--progress, 0%);
        background: var(--accent);
      }

      .terminal {
        position: absolute;
        inset: 92px 42px 88px;
        z-index: 2;
        display: grid;
        grid-template-columns: 0.82fr 1.18fr;
        gap: 1px;
        background: var(--line);
      }

      .terminal > div {
        min-width: 0;
        background: var(--panel);
        padding: 34px;
      }

      .terminal h2 {
        margin: 0;
        font: 700 52px/1 Georgia, "Times New Roman", serif;
      }

      pre {
        margin: 0;
        white-space: pre-wrap;
        color: var(--paper);
        font: 700 20px/1.42 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      }

      .terminal .ok {
        color: var(--accent);
      }

      .terminal .blocked {
        color: var(--danger);
      }

      .hidden {
        display: none;
      }
    </style>
  </head>
  <body>
    <div id="stage">
      <img id="frame" class="frame" alt="" />
      <div class="grid"></div>
      <div class="scrim"></div>
      <div class="brand">Ultramar.<em>Capital</em></div>
      <div class="badge">Uniswap v4 Hookathon</div>
      <section id="content" class="content">
        <div id="eyebrow" class="eyebrow"></div>
        <h1 id="title"></h1>
        <p id="caption" class="caption"></p>
      </section>
      <section id="terminal" class="terminal hidden">
        <div>
          <p class="eyebrow">Local Foundry proof</p>
          <h2>The hook is the market boundary.</h2>
          <p class="caption">The demo script proves one approved settlement and six blocked paths.</p>
        </div>
        <div>
          <pre>${escapeHtml(markers)
            .replaceAll("APPROVED window 1", '<span class="ok">APPROVED window 1</span>')
            .replaceAll("MISSING PASSPORT window 2", '<span class="blocked">MISSING PASSPORT window 2</span>')
            .replaceAll("GENERIC ROUTER window 3", '<span class="blocked">GENERIC ROUTER window 3</span>')
            .replaceAll("EXPIRED AUTHORIZATION window 4", '<span class="blocked">EXPIRED AUTHORIZATION window 4</span>')
            .replaceAll("MIN OUTPUT window 5", '<span class="blocked">MIN OUTPUT window 5</span>')
            .replaceAll("REPLAY window 6", '<span class="blocked">REPLAY window 6</span>')
            .replaceAll("STALE ORACLE window 7", '<span class="blocked">STALE ORACLE window 7</span>')}</pre>
        </div>
      </section>
      <div class="progress"><span id="progress"></span></div>
    </div>

    <script>
      const segments = ${JSON.stringify(payload)};
      const frame = document.getElementById("frame");
      const content = document.getElementById("content");
      const terminal = document.getElementById("terminal");
      const eyebrow = document.getElementById("eyebrow");
      const title = document.getElementById("title");
      const caption = document.getElementById("caption");
      const progress = document.getElementById("progress");
      const totalMs = segments.reduce((sum, item) => sum + item.duration * 1000, 0);

      function renderSegment(index) {
        const segment = segments[index];
        if (segment.image) {
          frame.src = segment.image;
          frame.classList.remove("hidden");
          terminal.classList.add("hidden");
          content.classList.remove("hidden");
          eyebrow.textContent = segment.eyebrow;
          title.textContent = segment.title;
          caption.textContent = segment.caption;
        } else {
          frame.removeAttribute("src");
          frame.classList.add("hidden");
          content.classList.add("hidden");
          terminal.classList.remove("hidden");
        }
      }

      window.startStoryboard = () => new Promise((resolve) => {
        let index = 0;
        let elapsedBeforeSegment = 0;
        let segmentStartedAt = performance.now();
        renderSegment(index);

        function tick(now) {
          const elapsedInSegment = now - segmentStartedAt;
          const elapsedTotal = elapsedBeforeSegment + elapsedInSegment;
          progress.style.setProperty("--progress", Math.min(100, (elapsedTotal / totalMs) * 100) + "%");

          if (elapsedInSegment >= segments[index].duration * 1000) {
            elapsedBeforeSegment += segments[index].duration * 1000;
            index += 1;
            if (index >= segments.length) {
              progress.style.setProperty("--progress", "100%");
              window.storyboardDone = true;
              resolve();
              return;
            }
            segmentStartedAt = now;
            renderSegment(index);
          }

          requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      });
    </script>
  </body>
</html>`;
}

async function readVideoDuration(videoPath) {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    return await page.evaluate(
      (src) =>
        new Promise((resolveDuration, rejectDuration) => {
          const video = document.createElement("video");
          video.preload = "metadata";
          video.onloadedmetadata = () => resolveDuration(video.duration);
          video.onerror = () => rejectDuration(new Error("Unable to read video metadata"));
          video.src = src;
        }),
      pathToFileURL(videoPath).href,
    );
  } finally {
    await browser.close();
  }
}

mkdirSync(videoDir, { recursive: true });
rmSync(renderDir, { recursive: true, force: true });
mkdirSync(recordDir, { recursive: true });

for (const segment of segments) {
  if (segment.frame) {
    assertFile(resolve(frameDir, segment.frame), `Frame ${segment.frame}`);
  }
}
assertFile(terminalProofPath, "Terminal proof");

const markers = cleanTerminalMarkers();
writeFileSync(storyboardPath, buildStoryboardHtml(markers));
writeFileSync(captionsPath, buildCaptions());

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
  recordVideo: {
    dir: recordDir,
    size: { width: 1280, height: 720 },
  },
});
const page = await context.newPage();
await page.goto(pathToFileURL(storyboardPath).href, { waitUntil: "load" });
await page.evaluate(() => {
  window.startStoryboard();
});
await page.waitForFunction(() => window.storyboardDone === true, undefined, { timeout: 130_000 });
await page.close();
await context.close();
await browser.close();

const recordedVideo = latestVideoFile();
if (!recordedVideo) {
  throw new Error("Playwright did not produce a WebM recording.");
}
rmSync(finalVideoPath, { force: true });
renameSync(recordedVideo, finalVideoPath);

let metadataDuration;
let metadataNote = "loaded by Chromium video metadata check";
try {
  metadataDuration = await readVideoDuration(finalVideoPath);
} catch (error) {
  metadataNote = `metadata probe unavailable: ${String(error.message).split("\n")[0]}`;
}
const videoStats = statSync(finalVideoPath);
if (!Number.isFinite(plannedDuration) || plannedDuration <= 0 || plannedDuration > 120) {
  throw new Error(`Planned video duration is invalid for Tally upload: ${plannedDuration}s`);
}
if (videoStats.size < 100_000) {
  throw new Error(`Rendered video is unexpectedly small: ${videoStats.size} bytes`);
}

const generatedAt = new Date().toISOString();
const manifest = `# Hookathon final demo video manifest

Generated: ${generatedAt}

## Output

- Video: ${finalVideoPath}
- Captions: ${captionsPath}
- Storyboard HTML: ${storyboardPath}

## Format

- Container: WebM
- Resolution: 1280x720
- Planned duration: ${plannedDuration.toFixed(1)} seconds
- Metadata duration: ${Number.isFinite(metadataDuration) ? `${metadataDuration.toFixed(1)} seconds` : "not available"}
- Metadata note: ${metadataNote}
- Audio: none; captioned review cut
- Size: ${(videoStats.size / 1024 / 1024).toFixed(2)} MB

## Source assets

${segments
  .map((segment) =>
    segment.frame
      ? `- ${segment.frame}: ${resolve(frameDir, segment.frame)}`
      : `- Terminal proof markers: ${terminalProofPath}`,
  )
  .join("\n")}

## Upload note

This WebM is suitable as a captioned review cut or as the base layer for a narrated upload. If the final platform expects audio, record the voiceover from docs/HOOKATHON_VIDEO_RECORDING_KIT.md over this cut.
`;

writeFileSync(manifestPath, manifest);

console.log("Hookathon final demo video rendered.");
console.log(finalVideoPath);
console.log(captionsPath);
console.log(manifestPath);
console.log(`Planned duration: ${plannedDuration.toFixed(1)} seconds`);
console.log(`Metadata duration: ${Number.isFinite(metadataDuration) ? `${metadataDuration.toFixed(1)} seconds` : "not available"}`);
console.log(`Size: ${(videoStats.size / 1024 / 1024).toFixed(2)} MB`);
