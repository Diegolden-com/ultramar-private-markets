import { logoutAction } from "@/app/auth/actions";
import { DataRoomVisitRecorder } from "@/components/data-room/visit-recorder";
import { LCX_DATA_ROOM } from "@/lib/data-room/constants";
import type { AuthorizedDataRoomState, DataRoomDocument } from "@/lib/data-room/types";
import {
  ArrowDownToLine,
  ArrowLeft,
  ExternalLink,
  File,
  FileText,
  Folder,
  Search,
} from "lucide-react";
import Link from "next/link";

export type DataRoomQuery = {
  q?: string;
  folder?: string;
  type?: string;
  sort?: string;
  document?: string;
  view?: string;
};

export function DataRoomHeader({
  state,
  activeView,
}: {
  state: AuthorizedDataRoomState;
  activeView: "documents" | "admin";
}) {
  return (
    <>
      {/*
       * Visit telemetry is intentionally investor-only. Issuer/admin pages
       * perform clearance, upload, publication, and access-control writes;
       * they must not start a non-essential background Server Action that can
       * contend with those controlled operations during a page lifecycle.
       */}
      {!state.viewer.canManage ? <DataRoomVisitRecorder /> : null}
      <header className="lcx-dossier-header card card-border overflow-hidden bg-surface">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0 p-5 sm:p-6 lg:p-7">
            <nav aria-label="Data room navigation">
              <Link
                href="/private-equities/assets/lcx"
                className="inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Lavanderias CX
              </Link>
            </nav>
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-accent">
                  {state.room.issuer.name} / {state.room.round.ticker.toUpperCase()} / Potential secondary transfer
                </p>
                <h1 className="mt-2 text-balance font-serif text-3xl font-semibold leading-none sm:text-4xl">
                  {LCX_DATA_ROOM.name}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-on-surface-variant">
                  Controlled diligence for a possible transfer of existing equity. No SPV is used, and this workspace does not handle allocations, subscriptions, payments, or transfer instructions.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-success badge-outline font-mono text-[10px] uppercase tracking-[0.08em]">Access active</span>
                <span className="badge badge-warning badge-outline font-mono text-[10px] uppercase tracking-[0.08em]">{LCX_DATA_ROOM.status}</span>
              </div>
            </div>
          </div>

          <div className="lcx-dossier-identity flex min-w-[240px] flex-col justify-between border-t border-border-muted bg-surface-container-lowest p-5 lg:border-l lg:border-t-0">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-on-surface-variant">Signed in as</p>
              <p className="mt-2 truncate text-sm font-medium text-on-surface">{state.viewer.fullName || state.viewer.email}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-primary">{state.viewer.role}</p>
            </div>
            <form action={logoutAction} className="mt-5">
              <button type="submit" className="btn btn-ghost btn-sm w-full">Sign out</button>
            </form>
          </div>
        </div>
      </header>

      {state.viewer.canManage ? (
        <nav className="lcx-dossier-tabs tabs tabs-border border border-border-muted bg-surface px-3" aria-label="Data room views">
          <a href={LCX_DATA_ROOM.path} className={`tab font-mono text-[10px] uppercase tracking-[0.1em] ${activeView === "documents" ? "tab-active" : ""}`}>
            Document index
          </a>
          <a href={`${LCX_DATA_ROOM.path}?view=admin`} className={`tab font-mono text-[10px] uppercase tracking-[0.1em] ${activeView === "admin" ? "tab-active" : ""}`}>
            Administration
          </a>
        </nav>
      ) : null}
    </>
  );
}

export function DataRoomWorkspace({ state, query }: { state: AuthorizedDataRoomState; query: DataRoomQuery }) {
  const folders = state.folders.filter((folder) => !folder.archived_at);
  const filteredDocuments = filterDocuments(state.documents, query);
  const selectedDocument = filteredDocuments.find((document) => document.id === query.document) ?? filteredDocuments[0] ?? null;
  const folderMap = new Map(folders.map((folder) => [folder.id, folder]));

  return (
    <section className="lcx-dossier-workspace grid min-w-0 gap-px overflow-hidden border border-border-muted bg-border-muted lg:grid-cols-[15rem_minmax(0,1fr)_20rem]">
      <aside className="lcx-dossier-folder-index hidden min-w-0 bg-surface-container-lowest lg:block" aria-label="Data room folders">
        <div className="border-b border-border-muted p-4">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-on-surface-variant">Folder index</p>
        </div>
        <nav className="menu w-full p-0">
          <FolderLink label="All documents" count={state.documents.filter((document) => !document.archivedAt).length} active={!query.folder} query={query} />
          {folders.map((folder) => (
            <FolderLink
              key={folder.id}
              label={folder.name}
              count={state.documents.filter((document) => document.folderId === folder.id && !document.archivedAt).length}
              active={query.folder === folder.id}
              query={query}
              folderId={folder.id}
            />
          ))}
        </nav>
      </aside>

      <div className="lcx-dossier-document-index min-w-0 bg-surface">
        <div className="border-b border-border-muted p-4 sm:p-5">
          <form action={LCX_DATA_ROOM.path} className="grid gap-3 md:grid-cols-[minmax(12rem,1fr)_auto_auto_auto]">
            {query.folder ? <input type="hidden" name="folder" value={query.folder} /> : null}
            <label className="input input-primary flex w-full items-center gap-2" htmlFor="document-search">
              <Search className="h-4 w-4 text-on-surface-variant" aria-hidden="true" />
              <input id="document-search" name="q" defaultValue={query.q} className="grow" placeholder="Search title or description" />
            </label>
            <select name="type" defaultValue={query.type ?? "all"} className="select select-primary" aria-label="File type">
              <option value="all">All file types</option>
              <option value="pdf">PDF</option>
              <option value="image">Images</option>
            </select>
            <select name="sort" defaultValue={query.sort ?? "updated"} className="select select-primary" aria-label="Sort documents">
              <option value="updated">Recently updated</option>
              <option value="title">Title A–Z</option>
              <option value="date">Document date</option>
              <option value="order">Manual order</option>
            </select>
            <button type="submit" className="btn btn-primary">Apply</button>
          </form>

          <form action={LCX_DATA_ROOM.path} className="mt-3 flex gap-2 lg:hidden">
            {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
            {query.type ? <input type="hidden" name="type" value={query.type} /> : null}
            {query.sort ? <input type="hidden" name="sort" value={query.sort} /> : null}
            <select name="folder" defaultValue={query.folder ?? ""} className="select select-primary min-w-0 flex-1" aria-label="Choose folder">
              <option value="">All documents</option>
              {folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
            </select>
            <button type="submit" className="btn btn-outline btn-primary">Open</button>
          </form>
        </div>

        {filteredDocuments.length > 0 ? (
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Documents table. Scroll horizontally when needed.">
            <table className="table min-w-[760px]">
              <thead className="bg-surface-dim">
                <tr>
                  <th>Document</th>
                  <th>Folder</th>
                  <th>Version</th>
                  <th>Updated</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className={selectedDocument?.id === document.id ? "bg-primary/5" : undefined}>
                    <th scope="row" className="max-w-xs whitespace-normal">
                      <Link href={dataRoomHref(query, { document: document.id })} className="group flex items-start gap-3 text-left">
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        <span>
                          <span className="block text-sm font-medium text-on-surface group-hover:text-primary">{document.title}</span>
                          <span className="mt-1 block font-mono text-[10px] font-normal uppercase tracking-[0.06em] text-on-surface-variant">
                            {fileTypeLabel(document.currentVersion?.mimeType)}
                          </span>
                        </span>
                      </Link>
                    </th>
                    <td className="max-w-48 whitespace-normal text-xs text-on-surface-variant">{folderMap.get(document.folderId)?.name ?? "Archived folder"}</td>
                    <td className="font-mono text-xs">{document.currentVersion ? `v${document.currentVersion.versionNumber}` : "—"}</td>
                    <td className="font-mono text-xs text-on-surface-variant">{formatTimestampDate(document.updatedAt)}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {document.isNew ? <span className="badge badge-success badge-xs">New</span> : null}
                        <DocumentStatusBadge status={document.status} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid min-h-80 place-items-center p-8 text-center">
            <div>
              <File className="mx-auto h-8 w-8 text-on-surface-variant" aria-hidden="true" />
              <h2 className="mt-4 font-serif text-2xl">No documents match</h2>
              <p className="mt-2 text-sm text-on-surface-variant">Clear a filter or choose another folder.</p>
              <Link href={LCX_DATA_ROOM.path} className="btn btn-outline btn-primary btn-sm mt-5">Clear filters</Link>
            </div>
          </div>
        )}
      </div>

      <DocumentDetail document={selectedDocument} folderName={selectedDocument ? folderMap.get(selectedDocument.folderId)?.name : undefined} />
    </section>
  );
}

function DocumentDetail({ document, folderName }: { document: DataRoomDocument | null; folderName?: string }) {
  if (!document) {
    return (
      <aside className="lcx-dossier-detail min-w-0 bg-surface-container-lowest p-5" aria-label="Document details">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-on-surface-variant">Document detail</p>
        <p className="mt-4 text-sm leading-6 text-on-surface-variant">Choose a document to inspect its metadata and available actions.</p>
      </aside>
    );
  }

  const version = document.currentVersion;
  const openHref = `${LCX_DATA_ROOM.path}/documents/${document.id}/open`;
  const downloadHref = `${LCX_DATA_ROOM.path}/documents/${document.id}/download`;

  return (
    <aside className="lcx-dossier-detail min-w-0 bg-surface-container-lowest p-5" aria-label={`Details for ${document.title}`}>
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-on-surface-variant">Document detail</p>
      <h2 className="mt-3 text-balance font-serif text-2xl font-semibold leading-tight">{document.title}</h2>
      <p className="mt-4 text-sm leading-6 text-on-surface-variant">{document.description || "No description supplied."}</p>

      <dl className="mt-6 divide-y divide-border-muted border-y border-border-muted text-xs">
        <Metadata label="Folder" value={folderName ?? "Archived folder"} />
        <Metadata label="Document date" value={document.documentDate ? formatDateOnly(document.documentDate) : "Not set"} />
        <Metadata label="Version" value={version ? `v${version.versionNumber}` : "No file"} />
        <Metadata label="File type" value={fileTypeLabel(version?.mimeType)} />
        <Metadata label="File size" value={version ? formatBytes(version.sizeBytes) : "—"} />
        <Metadata label="Updated" value={formatTimestampDate(document.updatedAt)} />
      </dl>

      {version ? (
        <div className="mt-6 grid gap-2">
          {version.mimeType === "application/pdf" ? (
            <a href={openHref} target="_blank" rel="noreferrer" className="btn btn-primary w-full">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Open PDF
            </a>
          ) : null}
          <a href={downloadHref} className="btn btn-outline btn-primary w-full">
            <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
            Download
          </a>
          <p className="mt-1 text-center font-mono text-[9px] uppercase tracking-[0.08em] text-on-surface-variant">Signed link · 60 seconds</p>
        </div>
      ) : null}

      {document.versions.length > 1 ? (
        <details className="collapse-arrow collapse mt-6 border border-border-muted bg-surface">
          <summary className="collapse-title min-h-0 py-3 font-mono text-[10px] uppercase tracking-[0.08em]">Version history</summary>
          <div className="collapse-content grid gap-2 text-xs">
            {document.versions.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-t border-border-muted pt-2">
                <span>v{item.versionNumber}</span>
                <span className="text-on-surface-variant">{formatTimestampDate(item.createdAt)}</span>
              </div>
            ))}
          </div>
        </details>
      ) : null}
    </aside>
  );
}

function FolderLink({ label, count, active, query, folderId }: { label: string; count: number; active: boolean; query: DataRoomQuery; folderId?: string }) {
  return (
    <Link href={dataRoomHref(query, { folder: folderId, document: undefined })} className={`flex min-h-12 items-center gap-3 border-b border-border-muted px-4 py-3 ${active ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"}`}>
      <Folder className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1 text-xs leading-4">{label}</span>
      <span className="font-mono text-[10px]">{count}</span>
    </Link>
  );
}

function Metadata({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 py-3">
      <dt className="font-mono text-[9px] uppercase tracking-[0.08em] text-on-surface-variant">{label}</dt>
      <dd className="break-words text-right text-on-surface">{value}</dd>
    </div>
  );
}

function DocumentStatusBadge({ status }: { status: DataRoomDocument["status"] }) {
  const className = status === "published" ? "badge-success" : status === "draft" ? "badge-warning" : "badge-error";
  return <span className={`badge badge-xs ${className}`}>{status}</span>;
}

function filterDocuments(documents: DataRoomDocument[], query: DataRoomQuery) {
  const search = query.q?.trim().toLowerCase() ?? "";
  const type = query.type ?? "all";
  const visible = documents.filter((document) => {
    if (document.archivedAt) return false;
    if (query.folder && document.folderId !== query.folder) return false;
    if (search && !`${document.title} ${document.description ?? ""}`.toLowerCase().includes(search)) return false;
    return type === "all" || mimeGroup(document.currentVersion?.mimeType) === type;
  });

  return visible.sort((left, right) => {
    if (query.sort === "title") return left.title.localeCompare(right.title);
    if (query.sort === "date") return (right.documentDate ?? "").localeCompare(left.documentDate ?? "");
    if (query.sort === "order") return left.sortOrder - right.sortOrder || left.title.localeCompare(right.title);
    return right.updatedAt.localeCompare(left.updatedAt);
  });
}

function mimeGroup(mimeType?: string) {
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType?.startsWith("image/")) return "image";
  return "unsupported";
}

function fileTypeLabel(mimeType?: string) {
  if (!mimeType) return "No file";
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType === "image/jpeg") return "JPEG";
  if (mimeType === "image/png") return "PNG";
  return "File";
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const dateOnlyFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeZone: "UTC",
});

const timestampDateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

function formatDateOnly(value: string) {
  return dateOnlyFormatter.format(new Date(`${value}T00:00:00.000Z`));
}

function formatTimestampDate(value: string) {
  return timestampDateFormatter.format(new Date(value));
}

function dataRoomHref(query: DataRoomQuery, updates: Partial<DataRoomQuery>) {
  const next = { ...query, ...updates, view: undefined };
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(next)) if (value) params.set(key, value);
  const search = params.toString();
  return search ? `${LCX_DATA_ROOM.path}?${search}` : LCX_DATA_ROOM.path;
}
