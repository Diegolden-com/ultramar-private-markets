"use client";

import { inspectRedactedDerivative } from "@/lib/data-room/upload-policy";

export type NewDocumentInput = {
  title: string;
  description: string;
  documentDate: string;
  folderId: string;
  sortOrder: number;
  clearanceId: string;
  file: File;
};

export async function uploadNewDocument(input: NewDocumentInput) {
  await inspectRedactedDerivative(input.file);

  const formData = new FormData();
  formData.set("kind", "new");
  formData.set("title", input.title);
  formData.set("description", input.description);
  formData.set("documentDate", input.documentDate);
  formData.set("folderId", input.folderId);
  formData.set("sortOrder", String(input.sortOrder));
  formData.set("clearanceId", input.clearanceId);
  formData.set("file", input.file);

  await submitUpload(formData);
}

export async function uploadDocumentVersion(documentId: string, clearanceId: string, file: File) {
  await inspectRedactedDerivative(file);

  const formData = new FormData();
  formData.set("kind", "version");
  formData.set("documentId", documentId);
  formData.set("clearanceId", clearanceId);
  formData.set("file", file);

  await submitUpload(formData);
}

async function submitUpload(formData: FormData) {
  const response = await fetch("/api/private-equities/assets/lcx/dataroom/documents/upload", {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });

  const payload = await response.json().catch(() => null) as { error?: unknown } | null;
  if (!response.ok) {
    throw new Error(
      typeof payload?.error === "string"
        ? payload.error
        : "The document could not be uploaded.",
    );
  }
}
