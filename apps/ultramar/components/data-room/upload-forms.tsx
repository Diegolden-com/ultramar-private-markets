"use client";

import { uploadDocumentVersion, uploadNewDocument } from "@/lib/data-room/client";
import { DATA_ROOM_UPLOAD_ACCEPT } from "@/lib/data-room/upload-policy";
import type { DataRoomFolderRow } from "@/lib/supabase/database.types";
import type { DataRoomClearance } from "@/lib/data-room/types";
import { FilePlus2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UploadState = { status: "idle" | "error" | "success"; message: string };

export function NewDocumentUploadForm({
  folders,
  clearances,
  viewerId,
}: {
  folders: DataRoomFolderRow[];
  clearances: DataRoomClearance[];
  viewerId: string;
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [state, setState] = useState<UploadState>({ status: "idle", message: "" });
  const uploadableClearances = eligibleClearances(clearances, viewerId);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file");
    const clearanceId = String(formData.get("clearanceId") ?? "");

    if (!(file instanceof File)) {
      setState({ status: "error", message: "Choose a file to upload." });
      return;
    }
    if (!clearanceId) {
      setState({ status: "error", message: "Select a complete clearance bound to this exact derivative." });
      return;
    }

    setUploading(true);
    setState({ status: "idle", message: "" });

    try {
      await uploadNewDocument({
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
        documentDate: String(formData.get("documentDate") ?? ""),
        folderId: String(formData.get("folderId") ?? ""),
        sortOrder: Number(formData.get("sortOrder") ?? 0),
        clearanceId,
        file,
      });
      form.reset();
      setState({ status: "success", message: "Document uploaded as a draft." });
      router.refresh();
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "The document could not be uploaded.",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Document title" htmlFor="upload-title">
          <input id="upload-title" name="title" className="input input-primary w-full" required />
        </Field>
        <Field label="Folder" htmlFor="upload-folder">
          <select id="upload-folder" name="folderId" className="select select-primary w-full" required>
            <option value="">Choose folder</option>
            {folders.filter((folder) => !folder.archived_at).map((folder) => (
              <option key={folder.id} value={folder.id}>{folder.name}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Description" htmlFor="upload-description">
        <textarea id="upload-description" name="description" className="textarea textarea-primary min-h-24 w-full" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Document date" htmlFor="upload-date">
          <input id="upload-date" name="documentDate" type="date" className="input input-primary w-full" />
        </Field>
        <Field label="Manual order" htmlFor="upload-order">
          <input id="upload-order" name="sortOrder" type="number" min="0" defaultValue="0" className="input input-primary w-full" />
        </Field>
        <Field label="Redacted derivative · PDF/JPEG/PNG · max 25 MB" htmlFor="upload-file">
          <input
            id="upload-file"
            name="file"
            type="file"
            accept={DATA_ROOM_UPLOAD_ACCEPT}
            className="file-input file-input-primary w-full"
            required
          />
        </Field>
      </div>
      <Field label="Complete derivative clearance" htmlFor="upload-clearance">
        <select id="upload-clearance" name="clearanceId" className="select select-primary w-full" required disabled={uploadableClearances.length === 0}>
          <option value="">Select clearance bound to these exact bytes</option>
          {uploadableClearances.map((clearance) => <option key={clearance.id} value={clearance.id}>{clearanceLabel(clearance)}</option>)}
        </select>
      </Field>
      {uploadableClearances.length === 0 ? <p className="border-l-2 border-destructive/60 bg-surface-dim px-3 py-2 text-xs text-on-surface-variant">No complete clearance is available for this uploader. Create one, collect all four assigned attestations, and ensure the uploader is not one of its reviewers.</p> : null}
      <UploadMessage state={state} />
      <button type="submit" className="btn btn-primary w-full sm:w-fit" disabled={uploading || folders.length === 0 || uploadableClearances.length === 0}>
        <FilePlus2 className="h-4 w-4" aria-hidden="true" />
        {uploading ? "Uploading document…" : "Upload draft"}
      </button>
    </form>
  );
}

export function NewVersionUploadForm({
  documentId,
  clearances,
  viewerId,
}: {
  documentId: string;
  clearances: DataRoomClearance[];
  viewerId: string;
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [state, setState] = useState<UploadState>({ status: "idle", message: "" });
  const uploadableClearances = eligibleClearances(clearances, viewerId);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file");
    const clearanceId = String(formData.get("clearanceId") ?? "");
    if (!(file instanceof File)) return;
    if (!clearanceId) {
      setState({ status: "error", message: "Select a complete clearance bound to this exact derivative." });
      return;
    }

    setUploading(true);
    setState({ status: "idle", message: "" });
    try {
      await uploadDocumentVersion(documentId, clearanceId, file);
      form.reset();
      setState({
        status: "success",
        message: "New version uploaded as an unpublished draft; prior versions remain in history.",
      });
      router.refresh();
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "The version could not be uploaded.",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <input
        name="file"
        type="file"
        accept={DATA_ROOM_UPLOAD_ACCEPT}
        className="file-input file-input-primary w-full"
        aria-label="New document version"
        required
      />
      <label className="grid min-w-0 gap-2" htmlFor={`version-clearance-${documentId}`}>
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.09em] text-on-surface-variant">Complete derivative clearance</span>
        <select id={`version-clearance-${documentId}`} name="clearanceId" className="select select-primary w-full" required disabled={uploadableClearances.length === 0}>
          <option value="">Select clearance bound to these exact bytes</option>
          {uploadableClearances.map((clearance) => <option key={clearance.id} value={clearance.id}>{clearanceLabel(clearance)}</option>)}
        </select>
      </label>
      {uploadableClearances.length === 0 ? <p className="text-xs text-on-surface-variant">A new version requires an unused, fully attested clearance assigned to four other reviewers.</p> : null}
      <UploadMessage state={state} />
      <button type="submit" className="btn btn-outline btn-primary btn-sm" disabled={uploading || uploadableClearances.length === 0}>
        <Upload className="h-4 w-4" aria-hidden="true" />
        {uploading ? "Uploading…" : "Upload new version"}
      </button>
    </form>
  );
}

function eligibleClearances(clearances: DataRoomClearance[], viewerId: string) {
  return clearances.filter((clearance) =>
    clearance.status === "ready"
    && !Object.values(clearance.reviewers).some((reviewer) => reviewer.id === viewerId),
  );
}

function clearanceLabel(clearance: DataRoomClearance) {
  return `${clearance.mimeType} · ${formatBytes(clearance.sizeBytes)} · ${clearance.checksumSha256.slice(0, 12)}…`;
}

function formatBytes(value: number) {
  return `${new Intl.NumberFormat("en", { maximumFractionDigits: 1 }).format(value / 1024)} KiB`;
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <label className="grid min-w-0 gap-2" htmlFor={htmlFor}>
      <span className="font-mono text-[10px] font-medium uppercase tracking-[0.09em] text-on-surface-variant">{label}</span>
      {children}
    </label>
  );
}

function UploadMessage({ state }: { state: UploadState }) {
  if (state.status === "idle") return null;
  return (
    <div
      className={`alert rounded-none py-2 text-xs ${state.status === "error" ? "alert-error" : "alert-success"}`}
      role={state.status === "error" ? "alert" : "status"}
    >
      <span>{state.message}</span>
    </div>
  );
}
