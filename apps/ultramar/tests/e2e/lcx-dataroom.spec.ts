import { expect, test, type Page } from "@playwright/test";
import axe from "axe-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

import {
  LCX_E2E_DEFAULT_PASSWORD,
  LCX_E2E_DOCUMENT_TITLE,
  LCX_E2E_USERS,
} from "./support/constants";

const DATA_ROOM = "/private-equities/assets/lcx/dataroom";
const PASSWORD = process.env.LCX_E2E_PASSWORD?.trim() || LCX_E2E_DEFAULT_PASSWORD;
const ARTIFACT_DIR = process.env.ARTIFACT_DIR ?? path.join(process.cwd(), "test-results", "lcx-dataroom");
const DOCUMENT_TITLE = LCX_E2E_DOCUMENT_TITLE;
const DOCUMENT_DATE = "2026-07-16";
const REQUEST_NOTE = "Reviewing current operating metrics and use-of-proceeds support.";
const PRIVATE_PAYLOAD_MARKERS = [
  "Issuer formation and authority",
  "Historical financials",
  "Offering documents",
];

test.describe.serial("LCX Capital data room", () => {
  test.beforeAll(async () => {
    await mkdir(ARTIFACT_DIR, { recursive: true });
  });

  test("protects private payloads and preserves a safe login return", async ({ baseURL, page }) => {
    if (!baseURL) throw new Error("Playwright baseURL is required for payload auditing.");

    const diagnostics = watchDiagnostics(page);
    const inspectPrivatePayloads = watchPrivatePayloads(page, baseURL);

    await page.goto("/private-equities/assets");
    await page.waitForLoadState("networkidle");

    await page.goto("/private-equities/assets/NXS.LOG");
    await expect(page.getByText("Pending Authorization", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Request Unlock" })).toBeVisible();

    await page.goto("/private-equities/assets/lcx");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).not.toContainText("Historical financials");
    await expect(page.locator("body")).not.toContainText("Offering documents");

    await page.goto(DATA_ROOM);
    await expect(page).toHaveURL(new RegExp(`/auth/login\\?returnTo=${encodeURIComponent(DATA_ROOM)}`));
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await expect(page.locator("body")).not.toContainText("Historical financials");
    await expect(page.locator("body")).not.toContainText("Offering documents");
    await assertAxe(page, "login");

    expect(await inspectPrivatePayloads(), "public HTML, RSC, and JavaScript payloads must not expose private inventory").toEqual([]);
    assertDiagnostics(diagnostics);
  });

  test("keeps a signed-in investor restricted until approval", async ({ page }) => {
    const diagnostics = watchDiagnostics(page);
    await login(page, LCX_E2E_USERS.investor.email);

    await expect(page.getByRole("heading", { name: "Access has not been requested" })).toBeVisible();
    await expect(page.locator("body")).not.toContainText("Historical financials");
    await expect(page.locator("body")).not.toContainText("Offering documents");
    await page.getByLabel("Optional note").fill(REQUEST_NOTE);
    await page.getByRole("button", { name: "Request data room access" }).click();
    await expect(page).toHaveURL(/notice=access-requested&request=[0-9a-f-]+/);
    await expect(page.getByRole("heading", { name: "Request pending" })).toBeVisible();
    await assertAxe(page, "restricted investor");
    assertNoPageOverflow(await pageOverflow(page), "restricted investor");
    assertDiagnostics(diagnostics);
  });

  test("lets the LCX issuer upload, version, publish, and approve access", async ({ baseURL, browser, page }) => {
    const diagnostics = watchDiagnostics(page);
    await login(page, LCX_E2E_USERS.issuer.email);
    await page.getByRole("link", { name: "Administration" }).click();

    await page.getByLabel("Document title").fill(DOCUMENT_TITLE);
    await page.locator("#upload-folder").selectOption({ index: 1 });
    await page.locator("#upload-description").fill("E2E document for private Storage and signed URL verification.");
    await page.locator("#upload-date").fill(DOCUMENT_DATE);
    await page.locator("#upload-file").setInputFiles(pdfFixture("lcx-e2e-v1.pdf", "Version one"));
    await page.getByRole("button", { name: "Upload draft" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Document uploaded as a draft." })).toBeVisible();
    await page.reload();

    let documentControl = page.locator("details").filter({ hasText: DOCUMENT_TITLE });
    await documentControl.locator("summary").click();
    await documentControl.getByRole("button", { name: "Publish current version" }).click();
    await expect(documentControl.getByText("Document published.", { exact: true })).toBeVisible();
    await documentControl.locator("summary").click();
    await page.reload();
    documentControl = page.locator("details").filter({ hasText: DOCUMENT_TITLE });
    await expect(documentControl.locator("summary")).toContainText("published");

    let requestRow = page.getByRole("row").filter({ hasText: LCX_E2E_USERS.investor.email });
    await expect(requestRow.getByText(REQUEST_NOTE, { exact: true })).toBeVisible();
    const requestId = await requestRow.locator('input[name="requestId"]').first().inputValue();
    await requestRow.getByRole("button", { name: "Approve" }).click();
    await expect(page).toHaveURL(new RegExp(`notice=access-approved&request=${requestId}`));
    await expect(requestRow.getByText("approved", { exact: true })).toBeVisible();
    await page.reload();
    requestRow = page.getByRole("row").filter({ hasText: LCX_E2E_USERS.investor.email });
    await expect(requestRow.getByText("approved", { exact: true })).toBeVisible();
    documentControl = page.locator("details").filter({ hasText: DOCUMENT_TITLE });
    await documentControl.locator("summary").click();

    const investorContext = await browser.newContext({ baseURL });
    const investorPage = await investorContext.newPage();
    try {
      await login(investorPage, LCX_E2E_USERS.investor.email);
      await expect(investorPage.getByRole("link", { name: DOCUMENT_TITLE })).toBeVisible();
      await expect(investorPage.getByText("v1", { exact: true }).first()).toBeVisible();
      await expectDownloadedVersion(investorPage, "Version one");

      const versionInput = documentControl.getByLabel("New document version");
      await versionInput.setInputFiles(pdfFixture("lcx-e2e-v2.pdf", "Version two"));
      await documentControl.getByRole("button", { name: "Upload new version" }).click();
      await expect(documentControl.getByText("New version uploaded as an unpublished draft")).toBeVisible();
      await documentControl.locator("summary").click();
      await page.reload();
      documentControl = page.locator("details").filter({ hasText: DOCUMENT_TITLE });
      await documentControl.locator("summary").click();
      await expect(documentControl.getByText("v2 · current")).toBeVisible();
      await expect(documentControl.getByText("unpublished version", { exact: true })).toBeVisible();

      await investorPage.reload();
      await expect(investorPage.getByText("v1", { exact: true }).first()).toBeVisible();
      await expect(investorPage.getByText("v2", { exact: true })).toHaveCount(0);
      await expectDownloadedVersion(investorPage, "Version one");

      await documentControl.getByRole("button", { name: "Publish current version" }).click();
      await expect(documentControl.getByText("Document published.", { exact: true })).toBeVisible();
      await documentControl.locator("summary").click();
      await page.reload();
      documentControl = page.locator("details").filter({ hasText: DOCUMENT_TITLE });
      await documentControl.locator("summary").click();
      await expect(documentControl.getByText("unpublished version", { exact: true })).toHaveCount(0);

      await investorPage.reload();
      await expect(investorPage.getByText("v2", { exact: true }).first()).toBeVisible();
      await expectDownloadedVersion(investorPage, "Version two");
    } finally {
      await investorContext.close();
    }

    await page.getByRole("link", { name: "Document index" }).click();
    await expect(page.getByRole("link", { name: DOCUMENT_TITLE })).toBeVisible();
    await expect(page.getByText("v2").first()).toBeVisible();
    await expect(page.getByText("Jul 16, 2026", { exact: true })).toBeVisible();
    await assertAxe(page, "authorized desktop data room");
    assertNoPageOverflow(await pageOverflow(page), "authorized desktop data room");
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "lcx-dataroom-desktop.png"), fullPage: true });

    const preview = await page.request.get(`${DATA_ROOM}/documents/${await selectedDocumentId(page)}/open`, { maxRedirects: 0 });
    expect(preview.status()).toBe(307);
    expect(preview.headers().location).toContain("/storage/v1/object/sign/data-room-documents/");
    expect(preview.headers().location).toContain("token=");

    const download = await page.request.get(`${DATA_ROOM}/documents/${await selectedDocumentId(page)}/download`);
    expect(download.ok()).toBeTruthy();
    expect(download.headers()["content-type"]).toContain("application/pdf");
    assertDiagnostics(diagnostics);
  });

  test("renders the approved investor workspace intentionally on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const diagnostics = watchDiagnostics(page);
    await login(page, LCX_E2E_USERS.investor.email);

    await expect(page.getByRole("heading", { name: "LCX Capital" })).toBeVisible();
    await expect(page.getByRole("link", { name: DOCUMENT_TITLE })).toBeVisible();
    await expect(page.getByLabel("Choose folder")).toBeVisible();
    await expect(page.getByLabel("Data room folders")).toBeHidden();
    await assertAxe(page, "authorized mobile data room");
    assertNoPageOverflow(await pageOverflow(page), "authorized mobile data room");
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "lcx-dataroom-mobile.png"), fullPage: true });
    assertDiagnostics(diagnostics);
  });

});

async function login(page: Page, email: string) {
  await page.goto(`${DATA_ROOM}`);
  await expect(page).toHaveURL(/\/auth\/login/);
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(PASSWORD);
  const destination = new RegExp(`${DATA_ROOM.replaceAll("/", "\\/")}(?:\\?.*)?$`);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await page.getByRole("button", { name: "Sign in" }).click();
    try {
      await page.waitForURL(destination, { timeout: 25_000 });
      return;
    } catch (error) {
      if (attempt === 2) throw error;
      await expect(page.getByRole("button", { name: "Sign in" })).toBeEnabled({ timeout: 15_000 });
    }
  }
}

async function assertAxe(page: Page, label: string) {
  await page.addScriptTag({ content: axe.source });
  const results = await page.evaluate(async () => {
    return window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
    });
  });
  expect(
    results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.map((node) => node.target),
    })),
    `${label} should have no Axe WCAG A/AA violations`,
  ).toEqual([]);
}

function watchDiagnostics(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("requestfailed", (request) => {
    const reason = request.failure()?.errorText ?? "unknown failure";
    if (reason !== "net::ERR_ABORTED") errors.push(`request: ${request.method()} ${request.url()} — ${reason}`);
  });
  return errors;
}

function assertDiagnostics(errors: string[]) {
  expect(errors, "new routes should have no console errors or failed requests").toEqual([]);
}

function watchPrivatePayloads(page: Page, baseURL: string) {
  const origin = new URL(baseURL).origin;
  const checks: Promise<void>[] = [];
  const leaks = new Set<string>();

  page.on("response", (response) => {
    if (new URL(response.url()).origin !== origin) return;
    if (!["document", "fetch", "script", "xhr"].includes(response.request().resourceType())) return;

    checks.push(response.text().then((payload) => {
      for (const marker of PRIVATE_PAYLOAD_MARKERS) {
        if (payload.includes(marker)) leaks.add(`${response.url()} contains ${marker}`);
      }
    }).catch(() => undefined));
  });

  return async () => {
    await Promise.all(checks);
    return [...leaks];
  };
}

async function pageOverflow(page: Page) {
  return page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
  }));
}

function assertNoPageOverflow(measurement: { viewport: number; page: number }, label: string) {
  expect(measurement.page, `${label} should not overflow the viewport`).toBeLessThanOrEqual(measurement.viewport + 1);
}

async function selectedDocumentId(page: Page) {
  const href = await page.getByRole("link", { name: DOCUMENT_TITLE }).getAttribute("href");
  const id = href ? new URL(href, "http://local.test").searchParams.get("document") : null;
  expect(id).toBeTruthy();
  return id as string;
}

async function expectDownloadedVersion(page: Page, marker: string) {
  const response = await page.request.get(
    `${DATA_ROOM}/documents/${await selectedDocumentId(page)}/download`,
  );
  expect(response.ok()).toBeTruthy();
  expect((await response.body()).toString("utf8")).toContain(marker);
}

function pdfFixture(name: string, content: string) {
  const source = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj\n% ${content}\n%%EOF\n`;
  return { name, mimeType: "application/pdf", buffer: Buffer.from(source) };
}

declare global {
  interface Window {
    axe: typeof axe;
  }
}
