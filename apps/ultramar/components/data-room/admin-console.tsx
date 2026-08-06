import {
  archiveDocumentAction,
  createFolderAction,
  publishDocumentAction,
  resolveAccessAction,
  updateDocumentAction,
  updateFolderAction,
} from "@/app/private-equities/assets/lcx/dataroom/actions";
import { DataRoomActionForm } from "@/components/data-room/action-form";
import { ClearanceConsole } from "@/components/data-room/clearance-console";
import { ReleaseGateConsole } from "@/components/data-room/release-gate-console";
import { NewDocumentUploadForm, NewVersionUploadForm } from "@/components/data-room/upload-forms";
import type { AuthorizedDataRoomState } from "@/lib/data-room/types";
import { Activity, FileCog, FolderCog, ShieldCheck, UploadCloud } from "lucide-react";

export function DataRoomAdminConsole({ state }: { state: AuthorizedDataRoomState }) {
  return (
    <div className="grid gap-4">
      <AdminSection icon={ShieldCheck} eyebrow="Release control" title="LCX diligence gate">
        <ReleaseGateConsole
          viewerId={state.viewer.id}
          viewerRole={state.viewer.role}
          releaseState={state.releaseState}
          manifests={state.releaseManifests}
          reviewerCandidates={state.clearanceReviewerCandidates}
        />
      </AdminSection>

      <AdminSection icon={ShieldCheck} eyebrow="Human clearance" title="Derivative review gate">
        <ClearanceConsole
          viewerId={state.viewer.id}
          clearances={state.clearances}
          reviewerCandidates={state.clearanceReviewerCandidates}
        />
      </AdminSection>

      <AdminSection icon={UploadCloud} eyebrow="Content intake" title="Upload document">
        <NewDocumentUploadForm
          folders={state.folders}
          clearances={state.clearances}
          viewerId={state.viewer.id}
        />
      </AdminSection>

      <AdminSection icon={FolderCog} eyebrow="Structure" title="Folders">
        <DataRoomActionForm
          action={createFolderAction}
          submitLabel="Create folder"
          buttonClassName="btn btn-primary w-full sm:w-fit"
          className="grid gap-4 border border-border-muted bg-surface-dim p-4"
        >
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_7rem]">
            <AdminField label="Folder name" htmlFor="new-folder-name"><input id="new-folder-name" name="name" className="input input-primary w-full" required /></AdminField>
            <AdminField label="Order" htmlFor="new-folder-order"><input id="new-folder-order" name="sortOrder" type="number" min="0" defaultValue="0" className="input input-primary w-full" /></AdminField>
          </div>
          <AdminField label="Description" htmlFor="new-folder-description"><textarea id="new-folder-description" name="description" className="textarea textarea-primary w-full" /></AdminField>
        </DataRoomActionForm>

        <div className="mt-4 grid gap-3">
          {state.folders.map((folder) => (
            <details key={folder.id} className="collapse-arrow collapse border border-border-muted bg-surface-container-lowest" open={false}>
              <summary className="collapse-title min-h-0 py-4">
                <span className="flex flex-wrap items-center gap-2 pr-5">
                  <span className="font-medium">{folder.name}</span>
                  <span className={`badge badge-xs ${folder.archived_at ? "badge-error" : folder.readiness_status === "ready" ? "badge-success" : "badge-warning"}`}>
                    {folder.archived_at ? "archived" : folder.readiness_status}
                  </span>
                  <span className="font-mono text-[10px] text-on-surface-variant">#{folder.sort_order}</span>
                </span>
              </summary>
              <div className="collapse-content grid gap-3">
                {!folder.archived_at ? (
                  <>
                    <DataRoomActionForm action={updateFolderAction} submitLabel="Save folder" buttonClassName="btn btn-outline btn-primary btn-sm w-full sm:w-fit">
                      <input type="hidden" name="folderId" value={folder.id} />
                      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem_7rem]">
                        <AdminField label="Name" htmlFor={`folder-name-${folder.id}`}><input id={`folder-name-${folder.id}`} name="name" defaultValue={folder.name} className="input input-primary w-full" required /></AdminField>
                        <AdminField label="Readiness" htmlFor={`folder-readiness-${folder.id}`}>
                          <select id={`folder-readiness-${folder.id}`} name="readinessStatus" defaultValue={folder.readiness_status} className="select select-primary w-full">
                            <option value="ready">Ready</option><option value="in_review">In review</option><option value="missing">Missing</option><option value="gated">Gated</option>
                          </select>
                        </AdminField>
                        <AdminField label="Order" htmlFor={`folder-order-${folder.id}`}><input id={`folder-order-${folder.id}`} name="sortOrder" type="number" min="0" defaultValue={folder.sort_order} className="input input-primary w-full" /></AdminField>
                      </div>
                      <AdminField label="Description" htmlFor={`folder-description-${folder.id}`}><textarea id={`folder-description-${folder.id}`} name="description" defaultValue={folder.description ?? ""} className="textarea textarea-primary w-full" /></AdminField>
                    </DataRoomActionForm>
                    <DataRoomActionForm action={updateFolderAction} submitLabel="Archive folder" buttonClassName="btn btn-outline btn-error btn-sm w-full sm:w-fit">
                      <input type="hidden" name="folderId" value={folder.id} /><input type="hidden" name="name" value={folder.name} /><input type="hidden" name="readinessStatus" value={folder.readiness_status} /><input type="hidden" name="sortOrder" value={folder.sort_order} /><input type="hidden" name="intent" value="archive" />
                    </DataRoomActionForm>
                  </>
                ) : <p className="text-sm text-on-surface-variant">Archived folders remain in history and cannot be selected for new uploads.</p>}
              </div>
            </details>
          ))}
        </div>
      </AdminSection>

      <AdminSection icon={FileCog} eyebrow="Document control" title="Documents and versions">
        {state.documents.length ? (
          <div className="grid gap-3">
            {state.documents.map((document) => (
              <details key={document.id} className="collapse-arrow collapse border border-border-muted bg-surface-container-lowest">
                <summary className="collapse-title min-h-0 py-4">
                  <span className="flex flex-wrap items-center gap-2 pr-5">
                    <span className="font-medium">{document.title}</span>
                    <span className={`badge badge-xs ${document.status === "published" ? "badge-success" : document.status === "draft" ? "badge-warning" : "badge-error"}`}>{document.status}</span>
                    {document.hasUnpublishedChanges ? <span className="badge badge-warning badge-xs">unpublished version</span> : null}
                    <span className="font-mono text-[10px] text-on-surface-variant">{document.currentVersion ? `v${document.currentVersion.versionNumber}` : "no file"}</span>
                  </span>
                </summary>
                <div className="collapse-content grid gap-5">
                  {document.status !== "archived" ? (
                    <>
                      <DataRoomActionForm action={updateDocumentAction} submitLabel="Save metadata" buttonClassName="btn btn-outline btn-primary btn-sm w-full sm:w-fit">
                        <input type="hidden" name="documentId" value={document.id} />
                        <div className="grid gap-3 sm:grid-cols-2">
                          <AdminField label="Title" htmlFor={`document-title-${document.id}`}><input id={`document-title-${document.id}`} name="title" defaultValue={document.title} className="input input-primary w-full" required /></AdminField>
                          <AdminField label="Folder" htmlFor={`document-folder-${document.id}`}>
                            <select id={`document-folder-${document.id}`} name="folderId" defaultValue={document.folderId} className="select select-primary w-full">
                              {state.folders
                                .filter((folder) => !folder.archived_at || folder.id === document.folderId)
                                .map((folder) => (
                                  <option key={folder.id} value={folder.id}>
                                    {folder.name}{folder.archived_at ? " (archived · current)" : ""}
                                  </option>
                                ))}
                            </select>
                          </AdminField>
                        </div>
                        <AdminField label="Description" htmlFor={`document-description-${document.id}`}><textarea id={`document-description-${document.id}`} name="description" defaultValue={document.description ?? ""} className="textarea textarea-primary w-full" /></AdminField>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <AdminField label="Document date" htmlFor={`document-date-${document.id}`}><input id={`document-date-${document.id}`} name="documentDate" type="date" defaultValue={document.documentDate ?? ""} className="input input-primary w-full" /></AdminField>
                          <AdminField label="Order" htmlFor={`document-order-${document.id}`}><input id={`document-order-${document.id}`} name="sortOrder" type="number" min="0" defaultValue={document.sortOrder} className="input input-primary w-full" /></AdminField>
                        </div>
                      </DataRoomActionForm>
                      <div className="grid gap-3 border-t border-border-muted pt-4 sm:grid-cols-2">
                        <NewVersionUploadForm
                          documentId={document.id}
                          clearances={state.clearances}
                          viewerId={state.viewer.id}
                        />
                        <div className="grid content-start gap-3">
                          {document.currentVersion ? (
                            <DataRoomActionForm
                              action={publishDocumentAction}
                              submitLabel={document.status === "published" && !document.hasUnpublishedChanges ? "Republish current version" : "Publish current version"}
                              buttonClassName="btn btn-primary btn-sm w-full"
                            >
                              <input type="hidden" name="documentId" value={document.id} />
                            </DataRoomActionForm>
                          ) : null}
                          <DataRoomActionForm action={archiveDocumentAction} submitLabel="Archive document" buttonClassName="btn btn-outline btn-error btn-sm w-full">
                            <input type="hidden" name="documentId" value={document.id} />
                          </DataRoomActionForm>
                        </div>
                      </div>
                      <VersionHistory document={document} />
                    </>
                  ) : <VersionHistory document={document} />}
                </div>
              </details>
            ))}
          </div>
        ) : <EmptyAdminState body="Upload the first draft to begin the controlled document register." />}
      </AdminSection>

      <AdminSection icon={ShieldCheck} eyebrow="Authorization" title="Access requests">
        {state.accessRequests.length ? (
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Access requests table">
            <table className="table min-w-[720px]">
              <thead><tr><th>Account</th><th>Requested</th><th>Status</th><th>Resolution</th></tr></thead>
              <tbody>
                {state.accessRequests.map((request) => (
                  <tr key={request.id}>
                    <th scope="row">
                      <span className="block text-sm">{request.user?.fullName || "Investor"}</span>
                      <span className="text-xs font-normal text-on-surface-variant">{request.user?.email}</span>
                      {request.requestNote ? (
                        <div className="mt-2 max-w-md border-l-2 border-primary/40 bg-surface-dim px-3 py-2 text-left font-normal">
                          <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-on-surface-variant">Request note</span>
                          <span className="mt-1 block whitespace-pre-wrap break-words text-xs leading-5 text-on-surface-variant">{request.requestNote}</span>
                        </div>
                      ) : null}
                    </th>
                    <td className="font-mono text-xs">{formatTimestamp(request.requestedAt)}</td>
                    <td><span className={`badge badge-sm ${request.status === "approved" ? "badge-success" : request.status === "pending" ? "badge-warning" : "badge-error"}`}>{request.status}</span></td>
                    <td className="min-w-72">
                      <div className="grid gap-2 sm:grid-cols-2">
                        {request.status !== "approved" ? (
                          <DataRoomActionForm action={resolveAccessAction} submitLabel="Approve" buttonClassName="btn btn-primary btn-xs w-full" refreshMode="reload">
                            <input type="hidden" name="requestId" value={request.id} /><input type="hidden" name="resolution" value="approved" />
                          </DataRoomActionForm>
                        ) : null}
                        {request.status !== "revoked" ? (
                          <DataRoomActionForm action={resolveAccessAction} submitLabel="Revoke" buttonClassName="btn btn-outline btn-error btn-xs w-full" refreshMode="reload">
                            <input type="hidden" name="requestId" value={request.id} /><input type="hidden" name="resolution" value="revoked" />
                          </DataRoomActionForm>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyAdminState body="No investor has requested access yet." />}
      </AdminSection>

      <AdminSection icon={Activity} eyebrow="Audit trail" title="Recent activity">
        {state.activity.length ? (
          <ol className="divide-y divide-border-muted border-y border-border-muted">
            {state.activity.map((event) => (
              <li key={event.id} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-primary">{event.eventType.replaceAll("_", " ")}</span>
                <span className="text-sm">{event.actorLabel}</span>
                <time className="font-mono text-[10px] text-on-surface-variant">{formatTimestamp(event.occurredAt)}</time>
              </li>
            ))}
          </ol>
        ) : <EmptyAdminState body="Activity appears here after access, document, and folder actions." />}
      </AdminSection>
    </div>
  );
}

function AdminSection({ icon: Icon, eyebrow, title, children }: { icon: typeof UploadCloud; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="lcx-dossier-admin-section card card-border min-w-0 bg-surface p-5 sm:p-6 lg:p-7">
      <div className="mb-6 flex items-start gap-4 border-b border-border-muted pb-5">
        <span className="grid h-10 w-10 shrink-0 place-items-center border border-primary/40 bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span>
        <div><p className="font-mono text-[10px] uppercase tracking-[0.1em] text-on-surface-variant">{eyebrow}</p><h2 className="mt-1 font-serif text-2xl font-semibold">{title}</h2></div>
      </div>
      {children}
    </section>
  );
}

function AdminField({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return <label className="grid min-w-0 gap-2" htmlFor={htmlFor}><span className="font-mono text-[10px] uppercase tracking-[0.08em] text-on-surface-variant">{label}</span>{children}</label>;
}

function VersionHistory({ document }: { document: AuthorizedDataRoomState["documents"][number] }) {
  return (
    <div className="border-t border-border-muted pt-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-on-surface-variant">Version history</p>
      <div className="mt-2 grid gap-2">
        {document.versions.map((version) => (
          <div key={version.id} className="grid gap-1 border border-border-muted bg-surface-dim p-3 text-xs sm:grid-cols-[5rem_minmax(0,1fr)_auto]">
            <span className="font-mono text-primary">v{version.versionNumber}{version.isCurrent ? " · current" : ""}</span><span className="truncate">{version.originalFilename}{version.clearanceId ? " · cleared" : " · legacy / not publishable"}</span><span className="text-on-surface-variant">{formatTimestamp(version.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyAdminState({ body }: { body: string }) {
  return <div className="border border-dashed border-border-muted bg-surface-dim p-6 text-sm text-on-surface-variant">{body}</div>;
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
