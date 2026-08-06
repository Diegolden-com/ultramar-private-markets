import type {
  AccessRequestStatus,
  DataRoomActivityType,
  DataRoomFolderRow,
  DataRoomClearanceReviewRole,
  DataRoomReleaseState,
  DocumentStatus,
  ProfileRole,
  RoundStatus,
} from "@/lib/supabase/database.types";

export type DataRoomRequestState = "not_requested" | AccessRequestStatus;

export type DataRoomViewer = {
  id: string;
  email: string;
  fullName: string | null;
  role: ProfileRole;
  issuerId: string | null;
  canManage: boolean;
};

export type DataRoomVersion = {
  id: string;
  versionNumber: number;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  clearanceId: string | null;
  publishedAt: string | null;
  createdAt: string;
  isCurrent: boolean;
};

export type DataRoomClearanceReviewer = {
  id: string;
  email: string;
  fullName: string | null;
};

export type DataRoomClearanceAttestation = {
  reviewRole: DataRoomClearanceReviewRole;
  reviewerId: string;
  attestedAt: string;
};

export type DataRoomClearance = {
  id: string;
  checksumSha256: string;
  mimeType: string;
  sizeBytes: number;
  classificationLabel: string;
  expiresAt: string;
  createdAt: string;
  voidedAt: string | null;
  voidReason: string | null;
  consumedAt: string | null;
  consumedVersionId: string | null;
  reviewers: Record<DataRoomClearanceReviewRole, DataRoomClearanceReviewer>;
  attestations: DataRoomClearanceAttestation[];
  status: "awaiting_attestations" | "ready" | "consumed" | "expired" | "voided";
};

export type DataRoomReleaseManifestAttestation = {
  reviewRole: DataRoomClearanceReviewRole;
  reviewerId: string;
  attestedAt: string;
};

export type DataRoomReleaseManifest = {
  id: string;
  revision: number;
  scenario: "consolidated-secondary";
  financeSchemaVersion: number;
  pwaApprovalAttestationId: string;
  pwaSourceId: string;
  pwaManifestSha256: string;
  pwaSnapshotSha256: string;
  modelAsOf: string;
  freshnessDueAt: string;
  createdAt: string;
  reviewers: Record<DataRoomClearanceReviewRole, DataRoomClearanceReviewer>;
  attestations: DataRoomReleaseManifestAttestation[];
  status: "awaiting_attestations" | "ready" | "expired";
};

export type DataRoomDocument = {
  id: string;
  folderId: string;
  publishedVersionId: string | null;
  slug: string;
  title: string;
  description: string | null;
  documentDate: string | null;
  status: DocumentStatus;
  sortOrder: number;
  publishedAt: string | null;
  archivedAt: string | null;
  updatedAt: string;
  currentVersion: DataRoomVersion | null;
  versions: DataRoomVersion[];
  hasUnpublishedChanges: boolean;
  isNew: boolean;
};

export type DataRoomAccessRequest = {
  id: string;
  userId: string;
  status: AccessRequestStatus;
  requestNote: string | null;
  resolutionNote: string | null;
  requestedAt: string;
  resolvedAt: string | null;
  user: { fullName: string | null; email: string } | null;
};

export type DataRoomActivity = {
  id: string;
  eventType: DataRoomActivityType;
  actorUserId: string;
  actorLabel: string;
  documentId: string | null;
  occurredAt: string;
};

export type AuthorizedDataRoomState = {
  kind: "authorized";
  viewer: DataRoomViewer;
  room: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    updatedAt: string;
    issuer: { id: string; name: string; slug: string };
    round: { id: string; title: string; slug: string; status: RoundStatus; ticker: string };
  };
  folders: DataRoomFolderRow[];
  documents: DataRoomDocument[];
  releaseState: DataRoomReleaseState;
  releaseManifests: DataRoomReleaseManifest[];
  clearances: DataRoomClearance[];
  clearanceReviewerCandidates: DataRoomClearanceReviewer[];
  accessRequests: DataRoomAccessRequest[];
  activity: DataRoomActivity[];
  lastVisitedAt: string | null;
};

export type RestrictedDataRoomState = {
  kind: "restricted";
  viewer: Omit<DataRoomViewer, "canManage">;
  requestStatus: DataRoomRequestState;
  requestedAt: string | null;
  resolvedAt: string | null;
  releaseState: DataRoomReleaseState;
};

export type DataRoomPageState =
  | { kind: "unconfigured" }
  | { kind: "diligence_closed" }
  | { kind: "error"; message: string }
  | RestrictedDataRoomState
  | AuthorizedDataRoomState;

export type DataRoomCtaState = {
  label: string;
  href: string;
  status: "signed_out" | "not_requested" | "pending" | "approved" | "revoked" | "diligence_closed";
};
