import { withReturnTo } from "@/lib/auth/redirects";
import { ensureLcxSessionAudit } from "@/lib/auth/session-audit";
import {
  DATA_ROOM_CLEARANCE_REVIEW_ROLES,
  LCX_DATA_ROOM,
} from "@/lib/data-room/constants";
import type {
  AuthorizedDataRoomState,
  DataRoomActivity,
  DataRoomAccessRequest,
  DataRoomClearance,
  DataRoomClearanceReviewer,
  DataRoomCtaState,
  DataRoomDocument,
  DataRoomPageState,
  DataRoomVersion,
  DataRoomViewer,
  RestrictedDataRoomState,
} from "@/lib/data-room/types";
import type {
  DataRoomAccessRequestRow,
  DataRoomActivityEventRow,
  DataRoomDocumentClearanceAttestationRow,
  DataRoomDocumentClearanceRow,
  DataRoomDocumentRow,
  DataRoomDocumentVersionRow,
  DataRoomFolderRow,
  DataRoomRow,
  IssuerRow,
  ProfileRow,
  RoundRow,
} from "@/lib/supabase/database.types";
import { createClient, type SupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getLcxDataRoomCta(): Promise<DataRoomCtaState> {
  const supabase = await createClient();
  const loginHref = withReturnTo("/auth/login", LCX_DATA_ROOM.path);

  if (!supabase) return { label: "Request access", href: loginHref, status: "signed_out" };

  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) return { label: "Request access", href: loginHref, status: "signed_out" };

  const [
    { data: profileData },
    { data: grantData },
    { data: requestData },
    { data: roomData },
  ] = await Promise.all([
    supabase.from("profiles").select("role").eq("id", userId).maybeSingle(),
    supabase
      .from("data_room_access_grants")
      .select("id")
      .eq("data_room_id", LCX_DATA_ROOM.id)
      .eq("user_id", userId)
      .is("revoked_at", null)
      .maybeSingle(),
    supabase
      .from("data_room_access_requests")
      .select("status")
      .eq("data_room_id", LCX_DATA_ROOM.id)
      .eq("user_id", userId)
      .maybeSingle(),
    supabase.from("data_rooms").select("id").eq("id", LCX_DATA_ROOM.id).maybeSingle(),
  ]);

  const role = (profileData as Pick<ProfileRow, "role"> | null)?.role;
  const managerHasRoom = Boolean(roomData && (role === "admin" || role === "issuer"));

  if (roomData && (grantData || managerHasRoom)) {
    return { label: "Open data room", href: LCX_DATA_ROOM.path, status: "approved" };
  }

  const status = (requestData as Pick<DataRoomAccessRequestRow, "status"> | null)?.status;
  if (status === "pending") return { label: "Access pending", href: LCX_DATA_ROOM.path, status };
  if (status === "revoked") return { label: "Access revoked", href: LCX_DATA_ROOM.path, status };

  return { label: "Request access", href: LCX_DATA_ROOM.path, status: "not_requested" };
}

export async function getLcxDataRoomState(): Promise<DataRoomPageState> {
  const supabase = await createClient();
  if (!supabase) return { kind: "unconfigured" };

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError) {
    return { kind: "error", message: "Your session could not be verified. Sign in again." };
  }
  if (!userId) redirect(withReturnTo("/auth/login", LCX_DATA_ROOM.path));

  const auditResult = await ensureLcxSessionAudit(supabase, LCX_DATA_ROOM.path);
  if (!auditResult.ok) {
    return { kind: "error", message: auditResult.error };
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (profileError || !profileData) {
    return { kind: "error", message: "Your account profile is not ready. Sign out and try again." };
  }

  const profile = profileData as ProfileRow;
  if (profile.archived_at) {
    return { kind: "error", message: "This account is archived and no longer has data-room access." };
  }

  const baseViewer = {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    role: profile.role,
    issuerId: profile.issuer_id,
  };

  const [requestResult, grantResult, roomResult, canManageResult] = await Promise.all([
    supabase
      .from("data_room_access_requests")
      .select("*")
      .eq("data_room_id", LCX_DATA_ROOM.id)
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("data_room_access_grants")
      .select("id")
      .eq("data_room_id", LCX_DATA_ROOM.id)
      .eq("user_id", userId)
      .is("revoked_at", null)
      .maybeSingle(),
    supabase.from("data_rooms").select("*").eq("id", LCX_DATA_ROOM.id).maybeSingle(),
    supabase.rpc("can_manage_data_room", { target_data_room_id: LCX_DATA_ROOM.id }),
  ]);

  if (
    requestResult.error ||
    grantResult.error ||
    roomResult.error ||
    canManageResult.error
  ) {
    return { kind: "error", message: "Your data-room access could not be verified." };
  }

  const requestData = requestResult.data;
  const grantData = grantResult.data;
  const room = roomResult.data as DataRoomRow | null;
  const canManage = Boolean(room && canManageResult.data === true);
  const hasAccess = Boolean(room && (grantData || canManage));

  if (!hasAccess || !room) {
    const request = requestData as DataRoomAccessRequestRow | null;
    const restricted: RestrictedDataRoomState = {
      kind: "restricted",
      viewer: baseViewer,
      requestStatus: request?.status ?? "not_requested",
      requestedAt: request?.requested_at ?? null,
      resolvedAt: request?.resolved_at ?? null,
    };
    return restricted;
  }

  const viewer: DataRoomViewer = { ...baseViewer, canManage };

  const [roundResult, foldersResult, documentsResult, visitResult] = await Promise.all([
    supabase.from("rounds").select("*").eq("id", room.round_id).single(),
    supabase
      .from("data_room_folders")
      .select("*")
      .eq("data_room_id", room.id)
      .order("sort_order")
      .order("name"),
    supabase
      .from("data_room_documents")
      .select("*")
      .eq("data_room_id", room.id)
      .order("sort_order")
      .order("updated_at", { ascending: false }),
    supabase
      .from("data_room_visits")
      .select("last_visited_at")
      .eq("data_room_id", room.id)
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  if (roundResult.error || !roundResult.data) {
    return { kind: "error", message: "The round record could not be loaded." };
  }

  if (foldersResult.error) {
    return { kind: "error", message: "The data-room folders could not be loaded." };
  }

  if (documentsResult.error) {
    return { kind: "error", message: "The data-room documents could not be loaded." };
  }

  if (visitResult.error) {
    return { kind: "error", message: "Your data-room visit history could not be loaded." };
  }

  const round = roundResult.data as RoundRow;
  const { data: issuerData, error: issuerError } = await supabase
    .from("issuers")
    .select("*")
    .eq("id", round.issuer_id)
    .single();

  if (issuerError || !issuerData) {
    return { kind: "error", message: "The issuer record could not be loaded." };
  }

  let rawDocuments = (documentsResult.data ?? []) as DataRoomDocumentRow[];
  const documentIds = rawDocuments.map((document) => document.id);
  let rawVersions: DataRoomDocumentVersionRow[] = [];

  if (documentIds.length > 0) {
    const { data, error } = await supabase
      .from("data_room_document_versions")
      .select("*")
      .in("document_id", documentIds)
      .order("version_number", { ascending: false });

    if (error) {
      return { kind: "error", message: "The document versions could not be loaded." };
    }

    rawVersions = (data ?? []) as DataRoomDocumentVersionRow[];
  }

  // RLS already hides unpublished and archived files from an investor. Keep a
  // second server-side predicate here before serializing the workspace so a
  // version whose clearance was voided, expired, or became incomplete cannot
  // be rendered merely because an upstream RLS policy regressed.
  if (!canManage && rawDocuments.length > 0) {
    const visibleResult = await filterInvestorVisibleVersions(supabase, rawDocuments, rawVersions);
    if (visibleResult.error !== null) {
      return { kind: "error", message: visibleResult.error };
    }
    rawDocuments = visibleResult.data.documents;
    rawVersions = visibleResult.data.versions;
  }

  const lastVisitedAt = (visitResult.data as { last_visited_at: string } | null)?.last_visited_at ?? null;
  const documents = mapDocuments(rawDocuments, rawVersions, lastVisitedAt, canManage);

  const [accessRequestsResult, activityResult, clearanceResult] = canManage
    ? await Promise.all([
        loadAccessRequests(supabase),
        loadActivity(supabase),
        loadDocumentClearances(supabase),
      ])
    : [success([]), success([]), success({ clearances: [], reviewerCandidates: [] })];

  if (accessRequestsResult.error !== null) {
    return { kind: "error", message: accessRequestsResult.error };
  }

  if (activityResult.error !== null) {
    return { kind: "error", message: activityResult.error };
  }

  if (clearanceResult.error !== null) {
    return { kind: "error", message: clearanceResult.error };
  }

  const authorized: AuthorizedDataRoomState = {
    kind: "authorized",
    viewer,
    room: {
      id: room.id,
      slug: room.slug,
      name: room.name,
      description: room.description,
      updatedAt: room.updated_at,
      issuer: pickIssuer(issuerData as IssuerRow),
      round: {
        id: round.id,
        title: round.title,
        slug: round.slug,
        status: round.status,
        ticker: round.ticker,
      },
    },
    folders: (foldersResult.data ?? []) as DataRoomFolderRow[],
    documents,
    clearances: clearanceResult.data.clearances,
    clearanceReviewerCandidates: clearanceResult.data.reviewerCandidates,
    accessRequests: accessRequestsResult.data,
    activity: activityResult.data,
    lastVisitedAt,
  };

  return authorized;
}

type ClearanceCandidateRow = {
  id: string;
  email: string;
  full_name: string | null;
};

async function loadDocumentClearances(
  supabase: SupabaseDataClient,
): Promise<LoadResult<{ clearances: DataRoomClearance[]; reviewerCandidates: DataRoomClearanceReviewer[] }>> {
  const { data: clearanceData, error: clearanceError } = await supabase
    .from("data_room_document_clearances")
    .select("*")
    .eq("data_room_id", LCX_DATA_ROOM.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (clearanceError) return failure("Derivative clearances could not be loaded.");

  const clearances = (clearanceData ?? []) as DataRoomDocumentClearanceRow[];
  const clearanceIds = clearances.map((clearance) => clearance.id);
  const [attestationResult, candidateResult] = await Promise.all([
    clearanceIds.length
      ? supabase
          .from("data_room_document_clearance_attestations")
          .select("*")
          .in("clearance_id", clearanceIds)
          .order("attested_at")
      : Promise.resolve({ data: [], error: null }),
    supabase.rpc("list_data_room_clearance_reviewer_candidates", {
      target_data_room_id: LCX_DATA_ROOM.id,
    }),
  ]);

  if (attestationResult.error) return failure("Derivative-clearance attestations could not be loaded.");
  if (candidateResult.error) return failure("Clearance reviewer candidates could not be loaded.");

  const reviewerCandidates = ((candidateResult.data ?? []) as ClearanceCandidateRow[]).map((candidate) => ({
    id: candidate.id,
    email: candidate.email,
    fullName: candidate.full_name,
  }));
  const reviewerById = new Map(reviewerCandidates.map((candidate) => [candidate.id, candidate]));
  const attestations = (attestationResult.data ?? []) as DataRoomDocumentClearanceAttestationRow[];
  const now = Date.now();

  return success({
    reviewerCandidates,
    clearances: clearances.map((clearance) => mapClearance(clearance, attestations, reviewerById, now)),
  });
}

function mapClearance(
  clearance: DataRoomDocumentClearanceRow,
  attestations: DataRoomDocumentClearanceAttestationRow[],
  reviewerById: Map<string, DataRoomClearanceReviewer>,
  now: number,
): DataRoomClearance {
  const reviewerIdByRole = {
    finance_ops: clearance.finance_ops_reviewer_id,
    redaction: clearance.redaction_reviewer_id,
    counsel: clearance.counsel_reviewer_id,
    data_room_admin: clearance.data_room_admin_reviewer_id,
  } as const;
  const reviewers = Object.fromEntries(
    DATA_ROOM_CLEARANCE_REVIEW_ROLES.map((role) => [
      role,
      reviewerById.get(reviewerIdByRole[role]) ?? {
        id: reviewerIdByRole[role],
        email: "Assigned reviewer unavailable",
        fullName: null,
      },
    ]),
  ) as DataRoomClearance["reviewers"];
  const clearanceAttestations = attestations
    .filter((attestation) => attestation.clearance_id === clearance.id)
    .map((attestation) => ({
      reviewRole: attestation.review_role,
      reviewerId: attestation.reviewer_id,
      attestedAt: attestation.attested_at,
    }));
  const allAssignedReviewersRemainEligible = DATA_ROOM_CLEARANCE_REVIEW_ROLES.every((role) =>
    reviewerById.has(reviewerIdByRole[role]),
  );
  const isComplete = DATA_ROOM_CLEARANCE_REVIEW_ROLES.every((role) =>
    clearanceAttestations.some(
      (attestation) => attestation.reviewRole === role && attestation.reviewerId === reviewerIdByRole[role],
    ),
  ) && clearanceAttestations.length === DATA_ROOM_CLEARANCE_REVIEW_ROLES.length;

  const status: DataRoomClearance["status"] = clearance.voided_at
    ? "voided"
    : clearance.consumed_at
      ? "consumed"
      : new Date(clearance.expires_at).valueOf() <= now
        ? "expired"
        : isComplete && allAssignedReviewersRemainEligible
          ? "ready"
          : "awaiting_attestations";

  return {
    id: clearance.id,
    checksumSha256: clearance.checksum_sha256,
    mimeType: clearance.mime_type,
    sizeBytes: clearance.size_bytes,
    classificationLabel: clearance.classification_label,
    expiresAt: clearance.expires_at,
    createdAt: clearance.created_at,
    voidedAt: clearance.voided_at,
    voidReason: clearance.void_reason,
    consumedAt: clearance.consumed_at,
    consumedVersionId: clearance.consumed_version_id,
    reviewers,
    attestations: clearanceAttestations,
    status,
  };
}

type SupabaseDataClient = NonNullable<Awaited<ReturnType<typeof createClient>>>;
type LoadResult<T> = { data: T; error: null } | { data: null; error: string };

async function loadAccessRequests(
  supabase: SupabaseDataClient,
): Promise<LoadResult<DataRoomAccessRequest[]>> {
  const { data, error } = await supabase
    .from("data_room_access_requests")
    .select("*")
    .eq("data_room_id", LCX_DATA_ROOM.id)
    .order("requested_at", { ascending: false });

  if (error) return failure("Access requests could not be loaded.");

  const requests = (data ?? []) as DataRoomAccessRequestRow[];
  const userIds = [...new Set(requests.map((request) => request.user_id))];
  const profileMap = new Map<string, Pick<ProfileRow, "email" | "full_name">>();

  if (userIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id,email,full_name")
      .in("id", userIds);

    if (profilesError) return failure("Access-request profiles could not be loaded.");

    for (const profile of (profiles ?? []) as Pick<ProfileRow, "id" | "email" | "full_name">[]) {
      profileMap.set(profile.id, profile);
    }
  }

  return success(requests.map((request) => ({
    id: request.id,
    userId: request.user_id,
    status: request.status,
    requestNote: request.request_note,
    resolutionNote: request.resolution_note,
    requestedAt: request.requested_at,
    resolvedAt: request.resolved_at,
    user: profileMap.has(request.user_id)
      ? {
          fullName: profileMap.get(request.user_id)?.full_name ?? null,
          email: profileMap.get(request.user_id)?.email ?? "",
        }
      : null,
  })));
}

async function loadActivity(
  supabase: SupabaseDataClient,
): Promise<LoadResult<DataRoomActivity[]>> {
  const { data, error } = await supabase
    .from("data_room_activity_events")
    .select("*")
    .eq("data_room_id", LCX_DATA_ROOM.id)
    .order("occurred_at", { ascending: false })
    .limit(40);

  if (error) return failure("The data-room activity log could not be loaded.");

  const events = (data ?? []) as DataRoomActivityEventRow[];
  const actorIds = [...new Set(events.map((event) => event.actor_user_id))];
  const profileMap = new Map<string, Pick<ProfileRow, "email" | "full_name">>();

  if (actorIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id,email,full_name")
      .in("id", actorIds);

    if (profilesError) return failure("Activity-log profiles could not be loaded.");

    for (const profile of (profiles ?? []) as Pick<ProfileRow, "id" | "email" | "full_name">[]) {
      profileMap.set(profile.id, profile);
    }
  }

  return success(events.map((event) => {
    const actor = profileMap.get(event.actor_user_id);
    return {
      id: event.id,
      eventType: event.event_type,
      actorUserId: event.actor_user_id,
      actorLabel: actor?.full_name || actor?.email || "Account",
      documentId: event.document_id,
      occurredAt: event.occurred_at,
    };
  }));
}

function mapDocuments(
  documents: DataRoomDocumentRow[],
  versions: DataRoomDocumentVersionRow[],
  lastVisitedAt: string | null,
  canManage: boolean,
): DataRoomDocument[] {
  return documents.map((document) => {
    const documentVersions = versions
      .filter((version) => version.document_id === document.id)
      .map(mapVersion);
    const publishedVersion = documentVersions.find(
      (version) => version.id === document.published_version_id,
    ) ?? null;
    const currentVersion = canManage
      ? documentVersions.find((version) => version.isCurrent) ?? null
      : publishedVersion;
    const visibleUpdatedAt = canManage
      ? latestTimestamp(document.updated_at, currentVersion?.createdAt)
      : document.updated_at;

    return {
      id: document.id,
      folderId: document.folder_id,
      publishedVersionId: document.published_version_id,
      slug: document.slug,
      title: document.title,
      description: document.description,
      documentDate: document.document_date,
      status: document.status,
      sortOrder: document.sort_order,
      publishedAt: document.published_at,
      archivedAt: document.archived_at,
      updatedAt: visibleUpdatedAt,
      currentVersion,
      versions: documentVersions,
      hasUnpublishedChanges: Boolean(
        canManage && currentVersion && currentVersion.id !== document.published_version_id,
      ),
      isNew: !lastVisitedAt || new Date(visibleUpdatedAt) > new Date(lastVisitedAt),
    };
  });
}

function latestTimestamp(primary: string, secondary: string | null | undefined) {
  if (!secondary) return primary;
  return new Date(secondary) > new Date(primary) ? secondary : primary;
}

async function filterInvestorVisibleVersions(
  supabase: SupabaseServerClient,
  documents: DataRoomDocumentRow[],
  versions: DataRoomDocumentVersionRow[],
) {
  const publishedCandidates = documents.flatMap((document) => (
    document.published_version_id
      ? [{ documentId: document.id, versionId: document.published_version_id }]
      : []
  ));
  const checks = await Promise.all(publishedCandidates.map(async (candidate) => {
    const { data, error } = await supabase.rpc("can_view_data_room_document_version", {
      target_document_id: candidate.documentId,
      target_version_id: candidate.versionId,
    });
    return { ...candidate, data, error };
  }));

  if (checks.some((check) => check.error || check.data !== true)) {
    return failure("The document clearance could not be verified.");
  }

  const visibleVersionIds = new Set(checks.map((check) => check.versionId));
  const visibleDocuments = documents.filter(
    (document) => document.published_version_id !== null && visibleVersionIds.has(document.published_version_id),
  );

  return success({
    documents: visibleDocuments,
    versions: versions.filter((version) => visibleVersionIds.has(version.id)),
  });
}

function success<T>(data: T): LoadResult<T> {
  return { data, error: null };
}

function failure(error: string): LoadResult<never> {
  return { data: null, error };
}

function mapVersion(version: DataRoomDocumentVersionRow): DataRoomVersion {
  return {
    id: version.id,
    versionNumber: version.version_number,
    originalFilename: version.original_filename,
    mimeType: version.mime_type,
    sizeBytes: version.size_bytes,
    clearanceId: version.clearance_id,
    publishedAt: version.published_at,
    createdAt: version.created_at,
    isCurrent: version.is_current,
  };
}

function pickIssuer(issuer: IssuerRow) {
  return { id: issuer.id, name: issuer.name, slug: issuer.slug };
}
