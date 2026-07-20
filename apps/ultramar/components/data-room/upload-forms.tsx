"use client";

import { uploadDocumentVersion, uploadNewDocument } from "@/lib/data-room/client";
import type { DataRoomFolderRow } from "@/lib/supabase/database.types";
import { FilePlus2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UploadState = { status: "idle" | "error" | "success"; message: string };

export function NewDocumentUploadForm({ folders }: { folders: DataRoomFolderRow[] }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [state, setState] = useState<UploadState>({ status: "idle", message: "" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file");

    if (!(file instanceof File)) {
      setState({ status: "error", message: "Choose a file to upload." });
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
        <Field label="File · max 25 MB" htmlFor="upload-file">
          <input
            id="upload-file"
            name="file"
            type="file"
            accept=".pdf,.csv,.docx,.xlsx,.jpg,.jpeg,.png"
            className="file-input file-input-primary w-full"
            required
          />
        </Field>
      </div>
      <UploadMessage state={state} />
      <button type="submit" className="btn btn-primary w-full sm:w-fit" disabled={uploading || folders.length === 0}>
        <FilePlus2 className="h-4 w-4" aria-hidden="true" />
        {uploading ? "Uploading document…" : "Upload draft"}
      </button>
    </form>
  );
}

export function NewVersionUploadForm({ documentId }: { documentId: string }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [state, setState] = useState<UploadState>({ status: "idle", message: "" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const file = new FormData(form).get("file");
    if (!(file instanceof File)) return;

    setUploading(true);
    setState({ status: "idle", message: "" });
    try {
      await uploadDocumentVersion(documentId, file);
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
        accept=".pdf,.csv,.docx,.xlsx,.jpg,.jpeg,.png"
        className="file-input file-input-primary w-full"
        aria-label="New document version"
        required
      />
      <UploadMessage state={state} />
      <button type="submit" className="btn btn-outline btn-primary btn-sm" disabled={uploading}>
        <Upload className="h-4 w-4" aria-hidden="true" />
        {uploading ? "Uploading…" : "Upload new version"}
      </button>
    </form>
  );
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
