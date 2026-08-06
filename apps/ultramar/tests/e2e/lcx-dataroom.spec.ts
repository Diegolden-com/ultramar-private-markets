import { expect, test, type Browser, type Page, type Response } from "@playwright/test";
import axe from "axe-core";
import { createHash } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";

import {
  LCX_E2E_DEFAULT_PASSWORD,
  LCX_E2E_DOCUMENT_TITLE,
  LCX_E2E_RELEASE_SOURCE_ID,
  LCX_E2E_USERS,
} from "./support/constants";

const DATA_ROOM = "/private-equities/assets/lcx/dataroom";
const PASSWORD = process.env.LCX_E2E_PASSWORD?.trim() || LCX_E2E_DEFAULT_PASSWORD;
const ARTIFACT_DIR = process.env.ARTIFACT_DIR ?? path.join(process.cwd(), "test-results", "lcx-dataroom");
const DOCUMENT_TITLE = LCX_E2E_DOCUMENT_TITLE;
const DOCUMENT_DATE = "2026-07-16";
const REQUEST_NOTE = "Reviewing the ownership record and operating diligence for a potential secondary transfer.";
const V1_FIXTURE = pdfFixture("lcx-e2e-v1.pdf", "Version one");
// This derivative is deliberately larger than Vercel's non-streaming response
// limit. The later download assertion proves the application proxy streams the
// controlled object rather than redirecting to a signed Storage URL or
// buffering the Blob into a limited serverless response.
const V2_FIXTURE = pdfFixture("lcx-e2e-v2.pdf", "Version two", 5 * 1024 * 1024);
const UNEXPECTED_ACTION_FILE_FIXTURE = pdfFixture("unexpected-action-field.pdf", "Unexpected action file");
const V1_SHA256 = sha256Fixture(V1_FIXTURE);
const V2_SHA256 = sha256Fixture(V2_FIXTURE);
const PWA_APPROVAL_ATTESTATION_ID = "40404040-0001-4040-8040-000000000001";
const PWA_MANIFEST_SHA256 = "a".repeat(64);
const PWA_SNAPSHOT_SHA256 = "b".repeat(64);
const LOGIN_NAVIGATION_TIMEOUT_MS = 45_000;
const PRIVATE_PAYLOAD_MARKERS = [
  "Issuer formation and authority",
  "Historical financials",
  "Offering documents",
  "Transfer documents",
];

test.describe.serial("LCX secondary transfer data room", () => {
  test.beforeAll(async () => {
    await mkdir(ARTIFACT_DIR, { recursive: true });
  });

  test("keeps the public LCX surface closed and private payloads absent by default", async ({ baseURL, page }) => {
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
    await expect(page.getByTestId("lcx-secondary-sale-review")).toBeVisible();
    await expect(page.getByText(/NOT A LIVE OFFER/)).toBeVisible();
    await expect(page.getByText("Equity pathway", { exact: true })).toBeVisible();
    await expect(page.getByText(/Existing holders only/)).toBeVisible();
    await expect(page.locator("body")).not.toContainText("Funding status");
    await expect(page.locator("body")).not.toContainText("Committed");
    await expect(page.locator("body")).not.toContainText("Use of Funds");
    await expect(page.locator("body")).not.toContainText("Issuer proceeds");
    await expect(page.locator("body")).not.toContainText("Target raise");
    await expect(page.locator("body")).not.toContainText("18.4%");
    await expect(page.locator("body")).not.toContainText("12.5%");
    await expect(page.locator("body")).not.toContainText("$560,000");
    await expect(page.locator("body")).not.toContainText("$4,500,000");
    await expect(page.locator("body")).not.toContainText("Historical financials");
    await expect(page.locator("body")).not.toContainText("Offering documents");
    await expect(page.locator("body")).not.toContainText("Transfer documents");
    await expect(page.getByText("Diligence not open", { exact: true })).toBeVisible();

    await page.goto(DATA_ROOM);
    await expect(page).toHaveURL(new RegExp(`${DATA_ROOM}$`));
    await expect(page.getByRole("heading", { name: "Diligence is not open" })).toBeVisible();
    await expect(page.locator("body")).not.toContainText("Historical financials");
    await expect(page.locator("body")).not.toContainText("Offering documents");
    await expect(page.getByRole("button", { name: "Request data room access" })).toHaveCount(0);
    await assertAxe(page, "public closed state");

    expect(await inspectPrivatePayloads(), "public HTML, RSC, and JavaScript payloads must not expose private inventory").toEqual([]);
    assertDiagnostics(diagnostics);
  });

  test("opens LCX only after the PWA manifest receives four UI attestations", async ({ baseURL, browser, page }) => {
    if (!baseURL) throw new Error("Playwright baseURL is required for release-gate verification.");

    await login(page, LCX_E2E_USERS.issuer.email);
    await page.getByRole("link", { name: "Administration" }).click();
    await expect(page.getByRole("heading", { name: "LCX diligence gate" })).toBeVisible();
    await expect(page.getByText("LCX diligence is not open.", { exact: true })).toBeVisible();

    await fillReleaseManifestForm(page);
    await page.getByRole("button", { name: "Create release manifest" }).click();
    await expect(releaseManifestRecord(page)).toHaveCount(1);

    await recordAllReleaseManifestAttestations(browser, baseURL);

    const adminContext = await browser.newContext({ baseURL });
    const adminPage = await adminContext.newPage();
    try {
      await login(adminPage, LCX_E2E_USERS.dataRoomAdmin.email);
      await adminPage.getByRole("link", { name: "Administration" }).click();
      const manifest = releaseManifestRecord(adminPage);
      await expect(manifest).toHaveCount(1);
      await manifest.locator("summary").click();
      await expect(manifest.getByText("ready", { exact: true })).toBeVisible();

      await manifest.getByRole("button", { name: "Open LCX diligence" }).click();
      await expect(adminPage.getByText("LCX diligence is open.", { exact: true })).toBeVisible();
      await expect(adminPage.getByText("Diligence open", { exact: true })).toBeVisible();
    } finally {
      await adminContext.close();
    }
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
    if (!baseURL) throw new Error("Playwright baseURL is required for upload hardening.");

    const diagnostics = watchDiagnostics(page);
    await ensureInvestorAccessRequest(browser, baseURL);
    await login(page, LCX_E2E_USERS.issuer.email);
    await page.getByRole("link", { name: "Administration" }).click();

    await fillNewDocumentMetadata(page);

    // Before a complete clearance exists, the upload control is fail-closed.
    // The file input still advertises the reviewed-derivative types for the
    // native picker, but a caller cannot submit any candidate at this stage.
    await page.locator("#upload-file").setInputFiles({
      name: "raw-financial-model.xlsx",
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      buffer: Buffer.from("PK\\x03\\x04mock workbook"),
    });
    await expect(page.locator("#upload-file")).toHaveAttribute("accept", ".pdf,.jpg,.jpeg,.png");
    await expect(page.locator("#upload-clearance")).toBeDisabled();
    await expect(page.getByRole("button", { name: "Upload draft" })).toBeDisabled();

    // A caller can ignore the accept attribute, so the API independently
    // rejects a ZIP/XLSX signature masquerading as an otherwise safe PDF.
    const folderId = await page.locator("#upload-folder").inputValue();
    diagnostics.expectConsoleError(
      /^Failed to load resource: the server responded with a status of 400 \(Bad Request\)$/,
    );
    const rejectedUpload = await postDirectUpload(page, {
      documentDate: DOCUMENT_DATE,
      folderId,
      title: DOCUMENT_TITLE,
      file: {
        name: "redacted-derivative.pdf",
        mimeType: "application/pdf",
        buffer: Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x6d, 0x6f, 0x63, 0x6b]),
      },
    });
    expect(rejectedUpload.status).toBe(400);
    expect(rejectedUpload.body).toMatchObject({
      error: "Only reviewed, redacted PDF, JPEG, or PNG derivatives are allowed. Raw workbooks and tabular files are blocked.",
    });

    // The full-file scanner must also reject a file that starts as a PDF but
    // conceals an OOXML ZIP signature later in the payload.
    diagnostics.expectConsoleError(
      /^Failed to load resource: the server responded with a status of 400 \(Bad Request\)$/,
    );
    const rejectedPolyglot = await postDirectUpload(page, {
      documentDate: DOCUMENT_DATE,
      folderId,
      title: `${DOCUMENT_TITLE} polyglot`,
      file: pdfZipPolyglotFixture("lcx-e2e-polyglot.pdf"),
    });
    expect(rejectedPolyglot.status).toBe(400);
    expect(rejectedPolyglot.body).toMatchObject({
      error: "Only reviewed, redacted PDF, JPEG, or PNG derivatives are allowed. Raw workbooks and tabular files are blocked.",
    });

    // The browser form is intentionally disabled without a clearance, but the
    // route must reject a direct caller as well.
    diagnostics.expectConsoleError(
      /^Failed to load resource: the server responded with a status of 400 \(Bad Request\)$/,
    );
    const missingClearance = await postDirectUpload(page, {
      documentDate: DOCUMENT_DATE,
      folderId,
      title: `${DOCUMENT_TITLE} missing clearance`,
      file: V1_FIXTURE,
    });
    expect(missingClearance.status).toBe(400);
    expect(missingClearance.body).toMatchObject({
      error: "Select a complete derivative clearance before uploading.",
    });

    // The clearance Server Action accepts fingerprint metadata only. A forged
    // multipart File under an arbitrary key must be rejected, not merely a
    // field named candidateFile.
    await expectClearanceActionRejectsUnexpectedFile(page);

    // Create a clearance from the exact browser fixture. The candidate is not
    // uploaded here; four separately provisioned human identities must attest
    // to their off-platform review before the uploader can select it.
    const clearanceActionCandidateLeaks = watchServerActionCandidateBytes(page, "Version one");
    await createClearance(page, V1_FIXTURE);
    expect(clearanceActionCandidateLeaks()).toEqual([]);
    const v1ClearanceId = await clearanceIdFor(page, V1_SHA256);
    await expect(page.locator("#upload-clearance")).toBeDisabled();

    diagnostics.expectConsoleError(
      /^Failed to load resource: the server responded with a status of 400 \(Bad Request\)$/,
    );
    const mismatchedClearance = await postDirectUpload(page, {
      documentDate: DOCUMENT_DATE,
      folderId,
      title: `${DOCUMENT_TITLE} mismatched clearance`,
      clearanceId: v1ClearanceId,
      file: V2_FIXTURE,
    });
    expect(mismatchedClearance.status).toBe(400);
    expect(mismatchedClearance.body).toMatchObject({
      error: "The selected clearance is not complete, current, or bound to this exact derivative.",
    });

    await recordAllClearanceAttestations(browser, baseURL, V1_SHA256);
    await page.reload();
    await expect(page.locator(`#upload-clearance option[value="${v1ClearanceId}"]`)).toHaveCount(1);
    await fillNewDocumentMetadata(page);

    // A reviewer is a data-room manager but cannot become the uploader for a
    // clearance they approved. This verifies the server boundary, not only the
    // select menu's convenience filtering.
    await expectReviewerUploadRejected(browser, baseURL, {
      documentDate: DOCUMENT_DATE,
      folderId,
      title: `${DOCUMENT_TITLE} self-review bypass`,
      clearanceId: v1ClearanceId,
      file: V1_FIXTURE,
    });

    // Once a clearance is available, the client independently blocks a raw
    // workbook before it can reach the upload route. The approved clearance
    // remains unused after this rejected attempt.
    await page.locator("#upload-clearance").selectOption(v1ClearanceId);
    await page.locator("#upload-file").setInputFiles({
      name: "raw-financial-model.xlsx",
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      buffer: Buffer.from("PK\\x03\\x04mock workbook"),
    });
    await page.getByRole("button", { name: "Upload draft" }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: "Raw workbooks and tabular files are blocked" }),
    ).toContainText("Raw workbooks and tabular files are blocked");

    await page.locator("#upload-file").setInputFiles(V1_FIXTURE);
    await page.getByRole("button", { name: "Upload draft" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Document uploaded as a draft." })).toBeVisible();

    // Clearances are single-use at the atomic version insert. An API caller
    // cannot reuse the exact same reviewer approval for a second document.
    diagnostics.expectConsoleError(
      /^Failed to load resource: the server responded with a status of 400 \(Bad Request\)$/,
    );
    const reusedClearance = await postDirectUpload(page, {
      documentDate: DOCUMENT_DATE,
      folderId,
      title: `${DOCUMENT_TITLE} reused clearance`,
      clearanceId: v1ClearanceId,
      file: V1_FIXTURE,
    });
    expect(reusedClearance.status).toBe(400);
    expect(reusedClearance.body).toMatchObject({
      error: "The selected clearance is not complete, current, or bound to this exact derivative.",
    });

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
    await requestRow.getByRole("button", { name: "Approve" }).click();
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

      // Version two needs a fresh clearance with the new fixture fingerprint.
      await createClearance(page, V2_FIXTURE);
      const v2ClearanceId = await clearanceIdFor(page, V2_SHA256);
      await recordAllClearanceAttestations(browser, baseURL, V2_SHA256);
      await page.reload();
      documentControl = page.locator("details").filter({ hasText: DOCUMENT_TITLE });
      await documentControl.locator("summary").click();

      const versionInput = documentControl.getByLabel("New document version");
      await documentControl.getByLabel("Complete derivative clearance").selectOption(v2ClearanceId);
      await versionInput.setInputFiles(V2_FIXTURE);
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
      await expectDownloadedVersion(investorPage, "Version two", V2_FIXTURE.buffer.byteLength);
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
    expect(preview.status()).toBe(200);
    expect(preview.headers()["content-type"]).toContain("application/pdf");
    expect(preview.headers()["content-disposition"]).toContain("inline");
    expect(preview.headers()["cache-control"]).toContain("no-store");
    expect(preview.headers().location).toBeUndefined();
    expect((await preview.body()).toString("utf8")).toContain("Version two");

    const download = await page.request.get(`${DATA_ROOM}/documents/${await selectedDocumentId(page)}/download`);
    expect(download.ok()).toBeTruthy();
    expect(download.headers()["content-type"]).toContain("application/pdf");
    expect(download.headers()["content-disposition"]).toContain("attachment");
    expect(download.headers().location).toBeUndefined();
    assertDiagnostics(diagnostics);
  });

  test("reauthorizes every document request after LCX diligence closes", async ({ baseURL, browser, page }) => {
    if (!baseURL) throw new Error("Playwright baseURL is required for proxy reauthorization.");

    await login(page, LCX_E2E_USERS.investor.email);
    const documentId = await selectedDocumentId(page);
    const beforeClose = await page.request.get(`${DATA_ROOM}/documents/${documentId}/download`, { maxRedirects: 0 });
    expect(beforeClose.status()).toBe(200);
    expect(beforeClose.headers().location).toBeUndefined();

    const adminContext = await browser.newContext({ baseURL });
    const adminPage = await adminContext.newPage();
    try {
      await login(adminPage, LCX_E2E_USERS.dataRoomAdmin.email);
      await adminPage.getByRole("link", { name: "Administration" }).click();
      await adminPage.getByRole("button", { name: "Close LCX diligence" }).click();
      await expect(adminPage.getByText("LCX diligence is not open.", { exact: true })).toBeVisible();

      const afterCloseDownload = await page.request.get(`${DATA_ROOM}/documents/${documentId}/download`, { maxRedirects: 0 });
      expect(afterCloseDownload.status()).toBe(404);
      expect(afterCloseDownload.headers().location).toBeUndefined();
      expect(afterCloseDownload.headers()["cache-control"]).toContain("no-store");
      const afterCloseOpen = await page.request.get(`${DATA_ROOM}/documents/${documentId}/open`, { maxRedirects: 0 });
      expect(afterCloseOpen.status()).toBe(404);
      expect(afterCloseOpen.headers().location).toBeUndefined();

      await page.reload();
      await expect(page.getByRole("heading", { name: "Diligence is not open" }).first()).toBeVisible();
      await expect(page.getByRole("link", { name: DOCUMENT_TITLE })).toHaveCount(0);

      const manifest = releaseManifestRecord(adminPage);
      await expect(manifest).toHaveCount(1);
      await manifest.locator("summary").click();
      await manifest.getByRole("button", { name: "Open LCX diligence" }).click();
      await expect(adminPage.getByText("LCX diligence is open.", { exact: true })).toBeVisible();
    } finally {
      await adminContext.close();
    }
  });

  test("renders the approved investor workspace intentionally on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const diagnostics = watchDiagnostics(page);
    await login(page, LCX_E2E_USERS.investor.email);

    await expect(page.getByRole("heading", { name: "LCX secondary transfer data room" })).toBeVisible();
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
  const destination = new RegExp(`${DATA_ROOM.replaceAll("/", "\\/")}(?:\\?.*)?$`);
  const loginHref = `/auth/login?returnTo=${encodeURIComponent(DATA_ROOM)}`;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    // The public LCX route intentionally stays on its closed state until an
    // administrator opens diligence, so authentication must begin from the
    // explicit login path rather than depend on a protected-route redirect.
    await page.goto(loginHref);
    try {
      await expect(page).toHaveURL(/\/auth\/login/, { timeout: 15_000 });
    } catch (error) {
      // `goto` can finish on the protected route's redirect shell before the
      // browser has followed it. Only accept the destination after that
      // redirect has had a bounded chance to materialize.
      if (destination.test(page.url())) return;
      throw error;
    }

    await page.getByLabel("Email address").fill(email);
    await page.getByLabel("Password").fill(PASSWORD);

    // Docker Desktop's VM can transiently starve its internal DNS resolver in
    // local E2E runs. Bound one sign-in attempt, then reload before retrying so
    // React's failed Server Action state cannot suppress the next form submit.
    const outcome = Promise.race([
      page
        .waitForURL(destination, { timeout: LOGIN_NAVIGATION_TIMEOUT_MS })
        .then(() => "redirected" as const)
        .catch(() => "no-redirect" as const),
      page
        .locator("form")
        .getByRole("alert")
        .waitFor({ state: "visible", timeout: LOGIN_NAVIGATION_TIMEOUT_MS })
        .then(() => "rejected" as const)
        .catch(() => "no-feedback" as const),
    ]);

    await page.getByRole("button", { name: "Sign in" }).click();
    const result = await outcome;
    if (result === "redirected") return;

    if (attempt === 2) {
      const feedback = await page.locator("form").getByRole("alert").textContent().catch(() => null);
      throw new Error(
        `Login did not redirect after three bounded attempts${feedback ? `: ${feedback}` : "."}`,
      );
    }
  }
}

async function fillReleaseManifestForm(page: Page) {
  const now = new Date();
  const freshnessDueAt = new Date(now.valueOf() + 24 * 60 * 60 * 1000);

  await page.locator("#release-approval-id").fill(PWA_APPROVAL_ATTESTATION_ID);
  await page.locator("#release-source-id").fill(LCX_E2E_RELEASE_SOURCE_ID);
  await page.locator("#release-manifest-hash").fill(PWA_MANIFEST_SHA256);
  await page.locator("#release-snapshot-hash").fill(PWA_SNAPSHOT_SHA256);
  await page.locator("#release-model-as-of").fill(now.toISOString().slice(0, 10));
  await page.locator("#release-freshness").fill(freshnessDueAt.toISOString().slice(0, 16));
  await page.locator("#release-finance-ops").selectOption({ label: reviewerOptionLabel(LCX_E2E_USERS.financeOps) });
  await page.locator("#release-redaction").selectOption({ label: reviewerOptionLabel(LCX_E2E_USERS.redaction) });
  await page.locator("#release-counsel").selectOption({ label: reviewerOptionLabel(LCX_E2E_USERS.counsel) });
  await page.locator("#release-admin").selectOption({ label: reviewerOptionLabel(LCX_E2E_USERS.dataRoomAdmin) });
}

async function recordAllReleaseManifestAttestations(browser: Browser, baseURL: string) {
  for (const reviewer of [
    LCX_E2E_USERS.financeOps,
    LCX_E2E_USERS.redaction,
    LCX_E2E_USERS.counsel,
    LCX_E2E_USERS.dataRoomAdmin,
  ]) {
    const context = await browser.newContext({ baseURL });
    const reviewerPage = await context.newPage();
    try {
      await login(reviewerPage, reviewer.email);
      await reviewerPage.getByRole("link", { name: "Administration" }).click();
      await expect(reviewerPage.getByRole("heading", { name: "LCX diligence gate" })).toBeVisible();
      const manifest = releaseManifestRecord(reviewerPage);
      await expect(manifest).toHaveCount(1);
      await manifest.locator("summary").click();

      await manifest.getByRole("button", { name: "Record release attestation" }).click();

      const reloadedManifest = releaseManifestRecord(reviewerPage);
      await expect(reloadedManifest).toHaveCount(1);
      await reloadedManifest.locator("summary").click();
      const reviewerListItem = reloadedManifest
        .getByRole("list", { name: "Release reviewer checklist" })
        .getByRole("listitem")
        .filter({ hasText: reviewer.email });
      await expect(reviewerListItem).toHaveCount(1);
      await expect(reviewerListItem.getByText(/^attested /)).toBeVisible();
    } finally {
      await context.close();
    }
  }
}

async function createClearance(page: Page, fixture: UploadFixture) {
  await fillClearanceForm(page, fixture);
  await page.getByRole("button", { name: "Create clearance" }).click();

  await expect(clearanceRecordForHash(page, sha256Fixture(fixture))).toHaveCount(1);
}

async function fillClearanceForm(page: Page, fixture: UploadFixture) {
  await page.locator("#clearance-file").setInputFiles(fixture);
  await page.locator("#clearance-finance-ops").selectOption({
    label: reviewerOptionLabel(LCX_E2E_USERS.financeOps),
  });
  await page.locator("#clearance-redaction").selectOption({
    label: reviewerOptionLabel(LCX_E2E_USERS.redaction),
  });
  await page.locator("#clearance-counsel").selectOption({
    label: reviewerOptionLabel(LCX_E2E_USERS.counsel),
  });
  await page.locator("#clearance-admin").selectOption({
    label: reviewerOptionLabel(LCX_E2E_USERS.dataRoomAdmin),
  });
}

async function fillNewDocumentMetadata(page: Page) {
  await page.getByLabel("Document title").fill(DOCUMENT_TITLE);
  await page.locator("#upload-folder").selectOption({ index: 1 });
  await page.locator("#upload-description").fill("E2E document for private Storage and application-proxy verification.");
  await page.locator("#upload-date").fill(DOCUMENT_DATE);
}

async function ensureInvestorAccessRequest(browser: Browser, baseURL: string) {
  const context = await browser.newContext({ baseURL });
  const investorPage = await context.newPage();
  try {
    await login(investorPage, LCX_E2E_USERS.investor.email);
    const noRequest = investorPage.getByRole("heading", { name: "Access has not been requested" });
    const pendingRequest = investorPage.getByRole("heading", { name: "Request pending" });
    await expect(noRequest.or(pendingRequest)).toBeVisible();
    if (await noRequest.isVisible()) {
      await investorPage.getByLabel("Optional note").fill(REQUEST_NOTE);
      await investorPage.getByRole("button", { name: "Request data room access" }).click();
      await expect(investorPage).toHaveURL(/notice=access-requested&request=[0-9a-f-]+/);
    }
    await expect(pendingRequest).toBeVisible();
  } finally {
    await context.close();
  }
}

async function expectClearanceActionRejectsUnexpectedFile(page: Page) {
  await page.locator("#clearance-file").evaluate((candidateInput) => {
    const form = candidateInput.closest("form");
    if (!form) throw new Error("The clearance form is unavailable.");

    const unexpectedInput = document.createElement("input");
    unexpectedInput.id = "clearance-unexpected-file";
    unexpectedInput.name = "untrustedMultipartFile";
    unexpectedInput.type = "file";
    form.append(unexpectedInput);
  });

  try {
    await page.locator("#clearance-unexpected-file").setInputFiles(UNEXPECTED_ACTION_FILE_FIXTURE);
    await fillClearanceForm(page, V1_FIXTURE);
    await page.getByRole("button", { name: "Create clearance" }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: "Clearance records accept only the expected fingerprint metadata" }),
    ).toContainText("file bytes are not accepted");
  } finally {
    await page.locator("#clearance-unexpected-file").evaluate((input) => input.remove());
  }
}

async function clearanceIdFor(page: Page, checksumSha256: string) {
  const record = clearanceRecordForHash(page, checksumSha256);
  await expect(record).toHaveCount(1);
  const clearanceId = await record.locator('input[name="clearanceId"]').first().inputValue();
  expect(clearanceId, "a clearance record must expose its controlled action id").toMatch(
    /^[0-9a-f-]{36}$/i,
  );
  return clearanceId;
}

async function recordAllClearanceAttestations(browser: Browser, baseURL: string, checksumSha256: string) {
  for (const reviewer of [
    LCX_E2E_USERS.financeOps,
    LCX_E2E_USERS.redaction,
    LCX_E2E_USERS.counsel,
    LCX_E2E_USERS.dataRoomAdmin,
  ]) {
    const context = await browser.newContext({ baseURL });
    const reviewerPage = await context.newPage();
    try {
      await login(reviewerPage, reviewer.email);
      await reviewerPage.getByRole("link", { name: "Administration" }).click();
      // Assert that the server-rendered manager console, rather than merely
      // the navigation shell, is ready before querying its audit register.
      // This makes a missing clearance distinguishable from a view-transition
      // race in the fourth isolated reviewer context.
      await expect(reviewerPage).toHaveURL(/\/private-equities\/assets\/lcx\/dataroom\?view=admin$/);
      await expect(reviewerPage.getByRole("heading", { name: "Derivative review gate" })).toBeVisible();
      await expect(reviewerPage.getByRole("heading", { name: "Derivative clearances" })).toBeVisible();
      const record = clearanceRecordForHash(reviewerPage, checksumSha256);
      await expect(record).toHaveCount(1);
      await record.locator("summary").click();
      // A successful attestation intentionally triggers one full reload. Set
      // the navigation listener before the click, then rebuild all locators
      // from the server-rendered page rather than retaining the old DOM.
      const reload = reviewerPage.waitForNavigation({ waitUntil: "load" });
      await Promise.all([
        reload,
        record.getByRole("button", { name: "Record off-platform attestation" }).click(),
      ]);
      await expect(reviewerPage.getByRole("heading", { name: "Derivative review gate" })).toBeVisible();

      const reloadedRecord = clearanceRecordForHash(reviewerPage, checksumSha256);
      await expect(reloadedRecord).toHaveCount(1);
      await reloadedRecord.locator("summary").click();
      const reviewerListItem = reloadedRecord
        .getByRole("list", { name: "Clearance reviewer checklist" })
        .getByRole("listitem")
        .filter({ hasText: reviewer.email });
      await expect(reviewerListItem).toHaveCount(1);
      await expect(reviewerListItem.getByText(reviewer.email, { exact: true })).toBeVisible();
      await expect(reviewerListItem.getByText(/^attested /)).toBeVisible();
    } finally {
      await context.close();
    }
  }
}

async function expectReviewerUploadRejected(
  browser: Browser,
  baseURL: string,
  input: DirectUploadInput,
) {
  const context = await browser.newContext({ baseURL });
  const reviewerPage = await context.newPage();
  try {
    await login(reviewerPage, LCX_E2E_USERS.financeOps.email);
    const result = await postDirectUpload(reviewerPage, input);
    expect(result.status).toBe(400);
    expect(result.body).toMatchObject({
      error: "The selected clearance is not complete, current, or bound to this exact derivative.",
    });
  } finally {
    await context.close();
  }
}

function clearanceRecordForHash(page: Page, checksumSha256: string) {
  return page.locator("details").filter({ hasText: `SHA-256 ${checksumSha256.slice(0, 12)}` });
}

function releaseManifestRecord(page: Page) {
  return page.locator("details").filter({ hasText: LCX_E2E_RELEASE_SOURCE_ID });
}

function reviewerOptionLabel(user: (typeof LCX_E2E_USERS)[keyof typeof LCX_E2E_USERS]) {
  return `${user.fullName} · ${user.email}`;
}

type UploadFixture = {
  name: string;
  mimeType: string;
  buffer: Buffer;
};

type DirectUploadInput = {
  title: string;
  folderId: string;
  documentDate: string;
  file: UploadFixture;
  clearanceId?: string;
};

async function postDirectUpload(page: Page, input: DirectUploadInput) {
  return page.evaluate(async (request) => {
    const encoded = atob(request.file.base64);
    const bytes = Uint8Array.from(encoded, (character) => character.charCodeAt(0));
    const formData = new FormData();
    formData.set("kind", "new");
    formData.set("title", request.title);
    formData.set("description", "Direct-upload boundary test.");
    formData.set("documentDate", request.documentDate);
    formData.set("folderId", request.folderId);
    formData.set("sortOrder", "0");
    if (request.clearanceId) formData.set("clearanceId", request.clearanceId);
    formData.set("file", new File([bytes], request.file.name, { type: request.file.mimeType }));

    const response = await fetch("/api/private-equities/assets/lcx/dataroom/documents/upload", {
      method: "POST",
      body: formData,
    });

    return { status: response.status, body: await response.json() };
  }, {
    ...input,
    file: {
      name: input.file.name,
      mimeType: input.file.mimeType,
      base64: input.file.buffer.toString("base64"),
    },
  });
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

type DiagnosticWatcher = {
  errors: string[];
  expectConsoleError: (matcher: RegExp) => void;
  pendingExpectedConsoleErrors: () => RegExp[];
};

function watchDiagnostics(page: Page): DiagnosticWatcher {
  const errors: string[] = [];
  const expectedConsoleErrors: RegExp[] = [];
  page.on("console", (message) => {
    const expectedIndex = expectedConsoleErrors.findIndex((matcher) => matcher.test(message.text()));
    if (expectedIndex >= 0) {
      expectedConsoleErrors.splice(expectedIndex, 1);
      return;
    }
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("requestfailed", (request) => {
    const reason = request.failure()?.errorText ?? "unknown failure";
    if (reason !== "net::ERR_ABORTED") errors.push(`request: ${request.method()} ${request.url()} — ${reason}`);
  });
  return {
    errors,
    expectConsoleError: (matcher) => expectedConsoleErrors.push(matcher),
    pendingExpectedConsoleErrors: () => expectedConsoleErrors,
  };
}

function watchServerActionCandidateBytes(page: Page, marker: string) {
  const leaks: string[] = [];
  page.on("request", (request) => {
    if (!request.headers()["next-action"]) return;
    const payload = request.postDataBuffer();
    if (payload?.toString("utf8").includes(marker)) {
      leaks.push(request.url());
    }
  });
  return () => leaks;
}

function assertDiagnostics(diagnostics: DiagnosticWatcher) {
  expect(diagnostics.pendingExpectedConsoleErrors(), "each expected browser diagnostic should occur").toEqual([]);
  expect(diagnostics.errors, "new routes should have no console errors or failed requests").toEqual([]);
}

const PAYLOAD_AUDIT_TIMEOUT_MS = 10_000;

function watchPrivatePayloads(page: Page, baseURL: string) {
  const origin = new URL(baseURL).origin;
  const responses: Array<{ response: Response; url: string; speculative: boolean }> = [];
  const leaks = new Set<string>();

  page.on("response", (response) => {
    const url = response.url();
    if (new URL(url).origin !== origin) return;
    if (!["document", "fetch", "script", "xhr"].includes(response.request().resourceType())) return;
    responses.push({ response, url, speculative: isSpeculativeNextPrefetch(response) });
  });

  return async () => {
    await Promise.all(responses.map(async ({ response, url, speculative }) => {
      const completion = await settleWithin(response.finished(), PAYLOAD_AUDIT_TIMEOUT_MS);
      if (completion.kind === "timeout") {
        if (speculative) return;
        leaks.add(`UNFINISHED PUBLIC PAYLOAD: ${url} did not finish within ${PAYLOAD_AUDIT_TIMEOUT_MS}ms`);
        return;
      }
      if (completion.kind === "error") {
        if (speculative && isAbortedOrDiscardedPrefetch(completion.error)) return;
        leaks.add(`UNFINISHED PUBLIC PAYLOAD: ${url} failed before it could be audited (${errorMessage(completion.error)})`);
        return;
      }
      if (completion.value) {
        // Next cancels speculative prefetches during navigation. The response
        // body is not complete or usable in the browser, so it cannot expose
        // a completed payload. All completed responses remain audited below.
        if (speculative && isAbortedOrDiscardedPrefetch(completion.value)) return;
        leaks.add(`UNFINISHED PUBLIC PAYLOAD: ${url} failed before it could be audited (${completion.value.message})`);
        return;
      }

      const body = await settleWithin(response.text(), PAYLOAD_AUDIT_TIMEOUT_MS);
      if (body.kind === "timeout") {
        if (speculative) return;
        leaks.add(`UNREADABLE PUBLIC PAYLOAD: ${url} completed but its body was not readable within ${PAYLOAD_AUDIT_TIMEOUT_MS}ms`);
        return;
      }
      if (body.kind === "error") {
        // Chromium can discard a completed static chunk's DevTools body as a
        // later navigation replaces the document. No browser-readable body
        // exists in that case, so it cannot be audited or expose inventory.
        if (isAbortedOrDiscardedBrowserPayload(body.error)) return;
        leaks.add(`UNREADABLE PUBLIC PAYLOAD: ${url} completed but its body could not be read (${errorMessage(body.error)})`);
        return;
      }

      for (const marker of PRIVATE_PAYLOAD_MARKERS) {
        if (body.value.includes(marker)) leaks.add(`${url} contains ${marker}`);
      }
    }));

    return [...leaks].sort();
  };
}

function isSpeculativeNextPrefetch(response: Response) {
  const headers = response.request().headers();

  // These RSC requests can be partial speculative route prefetches. We audit
  // them when Chromium retains a completed body, while treating only their
  // aborted/discarded streams as non-delivered browser payloads.
  return headers["next-router-prefetch"] === "1" || Boolean(headers["next-router-segment-prefetch"]);
}

function isAbortedOrDiscardedPrefetch(error: unknown) {
  return isAbortedOrDiscardedBrowserPayload(error);
}

function isAbortedOrDiscardedBrowserPayload(error: unknown) {
  const message = errorMessage(error);
  return message.includes("ERR_ABORTED") || message.includes("No resource with given identifier found");
}

async function settleWithin<T>(promise: Promise<T>, timeoutMs: number) {
  return new Promise<
    | { kind: "value"; value: T }
    | { kind: "timeout" }
    | { kind: "error"; error: unknown }
  >((resolve) => {
    const timeout = setTimeout(() => resolve({ kind: "timeout" }), timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timeout);
        resolve({ kind: "value", value });
      },
      (error: unknown) => {
        clearTimeout(timeout);
        resolve({ kind: "error", error });
      },
    );
  });
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
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

async function expectDownloadedVersion(page: Page, marker: string, minimumBytes = 0) {
  const response = await page.request.get(
    `${DATA_ROOM}/documents/${await selectedDocumentId(page)}/download`,
  );
  expect(response.ok()).toBeTruthy();
  expect(response.headers().location).toBeUndefined();
  expect(response.headers()["cache-control"]).toContain("no-store");
  const body = await response.body();
  expect(body.toString("utf8")).toContain(marker);
  if (minimumBytes > 0) {
    expect(body.byteLength, "the controlled response must stream the >4.5 MiB derivative through the application").toBeGreaterThanOrEqual(minimumBytes);
  }
}

function pdfFixture(name: string, content: string, paddingBytes = 0): UploadFixture {
  const prefix = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj\n";
  const suffix = `% ${content}\n%%EOF\n`;
  return {
    name,
    mimeType: "application/pdf",
    buffer: Buffer.concat([Buffer.from(prefix), Buffer.alloc(paddingBytes, 0x20), Buffer.from(suffix)]),
  };
}

function pdfZipPolyglotFixture(name: string): UploadFixture {
  return {
    name,
    mimeType: "application/pdf",
    buffer: Buffer.concat([
      Buffer.from("%PDF-1.4\n% benign-looking PDF header\n"),
      Buffer.from([0x50, 0x4b, 0x03, 0x04]),
      Buffer.from("[Content_Types].xmlxl/workbook.xml"),
      Buffer.from("\n%%EOF\n"),
    ]),
  };
}

function sha256Fixture(fixture: UploadFixture) {
  return createHash("sha256").update(fixture.buffer).digest("hex");
}

declare global {
  interface Window {
    axe: typeof axe;
  }
}
