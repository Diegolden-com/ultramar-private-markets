export type ProfileRole = "investor" | "issuer" | "admin";
export type RoundStatus = "preparing" | "open" | "closed" | "archived";
export type DocumentStatus = "draft" | "published" | "archived";
export type AccessRequestStatus = "pending" | "approved" | "revoked";
export type DataRoomActivityType =
  | "login"
  | "open"
  | "download"
  | "upload"
  | "publish"
  | "folder_change"
  | "metadata_change"
  | "access_approved"
  | "access_revoked";
export type DataRoomClearanceReviewRole =
  | "finance_ops"
  | "redaction"
  | "counsel"
  | "data_room_admin";
export type DataRoomReleaseState = "internal_preparation" | "diligence_open";

export type ProfileRow = {
  id: string;
  issuer_id: string | null;
  role: ProfileRole;
  email: string;
  full_name: string | null;
  last_seen_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type IssuerRow = {
  id: string;
  slug: string;
  name: string;
  legal_name: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type RoundRow = {
  id: string;
  issuer_id: string;
  slug: string;
  title: string;
  ticker: string;
  status: RoundStatus;
  opens_at: string | null;
  closes_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DataRoomRow = {
  id: string;
  round_id: string;
  slug: string;
  name: string;
  description: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DataRoomFolderRow = {
  id: string;
  data_room_id: string;
  parent_id: string | null;
  slug: string;
  name: string;
  description: string | null;
  readiness_status: "ready" | "in_review" | "missing" | "gated";
  sort_order: number;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DataRoomDocumentRow = {
  id: string;
  data_room_id: string;
  folder_id: string;
  published_version_id: string | null;
  slug: string;
  title: string;
  description: string | null;
  document_date: string | null;
  status: DocumentStatus;
  sort_order: number;
  created_by: string;
  published_by: string | null;
  published_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DataRoomDocumentVersionRow = {
  id: string;
  document_id: string;
  version_number: number;
  storage_path: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  checksum_sha256: string | null;
  clearance_id: string | null;
  is_current: boolean;
  uploaded_by: string;
  published_at: string | null;
  archived_at: string | null;
  created_at: string;
};

export type DataRoomDocumentClearanceRow = {
  id: string;
  data_room_id: string;
  checksum_sha256: string;
  mime_type: string;
  size_bytes: number;
  classification_label: string;
  finance_ops_reviewer_id: string;
  redaction_reviewer_id: string;
  counsel_reviewer_id: string;
  data_room_admin_reviewer_id: string;
  created_by: string;
  expires_at: string;
  voided_at: string | null;
  voided_by: string | null;
  void_reason: string | null;
  consumed_at: string | null;
  consumed_by: string | null;
  consumed_version_id: string | null;
  created_at: string;
};

export type DataRoomDocumentClearanceAttestationRow = {
  id: string;
  clearance_id: string;
  review_role: DataRoomClearanceReviewRole;
  reviewer_id: string;
  attestation_statement: string;
  attested_at: string;
  created_at: string;
};

export type DataRoomReleaseManifestRow = {
  id: string;
  manifest_revision: number;
  manifest_schema_version: number;
  release_context_data_room_id: string;
  scenario: "consolidated-secondary";
  finance_schema_version: number;
  pwa_approval_attestation_id: string;
  pwa_source_id: string;
  pwa_manifest_sha256: string;
  pwa_snapshot_sha256: string;
  model_as_of: string;
  freshness_due_at: string;
  approval_attestation: string;
  finance_ops_reviewer_id: string;
  redaction_reviewer_id: string;
  counsel_reviewer_id: string;
  data_room_admin_reviewer_id: string;
  created_by: string;
  created_at: string;
};

export type DataRoomReleaseManifestAttestationRow = {
  id: string;
  manifest_id: string;
  review_role: DataRoomClearanceReviewRole;
  reviewer_id: string;
  attestation_statement: string;
  attested_at: string;
  created_at: string;
};

export type DataRoomAccessRequestRow = {
  id: string;
  data_room_id: string;
  user_id: string;
  status: AccessRequestStatus;
  request_note: string | null;
  resolution_note: string | null;
  requested_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
  updated_at: string;
};

export type DataRoomAccessGrantRow = {
  id: string;
  data_room_id: string;
  user_id: string;
  granted_by: string;
  granted_at: string;
  revoked_by: string | null;
  revoked_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DataRoomActivityEventRow = {
  id: string;
  data_room_id: string | null;
  actor_user_id: string;
  document_id: string | null;
  document_version_id: string | null;
  event_type: DataRoomActivityType;
  metadata: Record<string, unknown>;
  occurred_at: string;
  created_at: string;
};
