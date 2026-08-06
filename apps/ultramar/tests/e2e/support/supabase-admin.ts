import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import {
  LCX_DATA_ROOM_BUCKET,
  LCX_DATA_ROOM_ID,
  LCX_E2E_DOCUMENT_TITLE,
  LCX_E2E_RELEASE_SOURCE_ID,
  LCX_E2E_USERS,
} from "./constants";
import { getE2eRuntime } from "./environment";

type AdminClient = SupabaseClient;

export function createE2eAdminClient() {
  const runtime = getE2eRuntime();
  const client = createClient(runtime.supabaseUrl, runtime.supabaseAdminKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  return { client, runtime };
}

export async function provisionE2eUsers(client: AdminClient, password: string) {
  const issuerId = await findLcxIssuerId(client);
  const existingUsers = await listUsersByEmail(client);

  const issuer = await upsertAuthUser(
    client,
    existingUsers.get(LCX_E2E_USERS.issuer.email),
    LCX_E2E_USERS.issuer.email,
    LCX_E2E_USERS.issuer.fullName,
    password,
  );
  const investor = await upsertAuthUser(
    client,
    existingUsers.get(LCX_E2E_USERS.investor.email),
    LCX_E2E_USERS.investor.email,
    LCX_E2E_USERS.investor.fullName,
    password,
  );
  const financeOps = await upsertAuthUser(
    client,
    existingUsers.get(LCX_E2E_USERS.financeOps.email),
    LCX_E2E_USERS.financeOps.email,
    LCX_E2E_USERS.financeOps.fullName,
    password,
  );
  const redaction = await upsertAuthUser(
    client,
    existingUsers.get(LCX_E2E_USERS.redaction.email),
    LCX_E2E_USERS.redaction.email,
    LCX_E2E_USERS.redaction.fullName,
    password,
  );
  const counsel = await upsertAuthUser(
    client,
    existingUsers.get(LCX_E2E_USERS.counsel.email),
    LCX_E2E_USERS.counsel.email,
    LCX_E2E_USERS.counsel.fullName,
    password,
  );
  const dataRoomAdmin = await upsertAuthUser(
    client,
    existingUsers.get(LCX_E2E_USERS.dataRoomAdmin.email),
    LCX_E2E_USERS.dataRoomAdmin.email,
    LCX_E2E_USERS.dataRoomAdmin.fullName,
    password,
  );

  const { error } = await client.from("profiles").upsert([
    {
      id: issuer.id,
      email: LCX_E2E_USERS.issuer.email,
      full_name: LCX_E2E_USERS.issuer.fullName,
      issuer_id: issuerId,
      role: LCX_E2E_USERS.issuer.role,
      archived_at: null,
    },
    {
      id: investor.id,
      email: LCX_E2E_USERS.investor.email,
      full_name: LCX_E2E_USERS.investor.fullName,
      issuer_id: null,
      role: LCX_E2E_USERS.investor.role,
      archived_at: null,
    },
    {
      id: financeOps.id,
      email: LCX_E2E_USERS.financeOps.email,
      full_name: LCX_E2E_USERS.financeOps.fullName,
      issuer_id: issuerId,
      role: LCX_E2E_USERS.financeOps.role,
      archived_at: null,
    },
    {
      id: redaction.id,
      email: LCX_E2E_USERS.redaction.email,
      full_name: LCX_E2E_USERS.redaction.fullName,
      issuer_id: issuerId,
      role: LCX_E2E_USERS.redaction.role,
      archived_at: null,
    },
    {
      id: counsel.id,
      email: LCX_E2E_USERS.counsel.email,
      full_name: LCX_E2E_USERS.counsel.fullName,
      issuer_id: issuerId,
      role: LCX_E2E_USERS.counsel.role,
      archived_at: null,
    },
    {
      id: dataRoomAdmin.id,
      email: LCX_E2E_USERS.dataRoomAdmin.email,
      full_name: LCX_E2E_USERS.dataRoomAdmin.fullName,
      issuer_id: null,
      role: LCX_E2E_USERS.dataRoomAdmin.role,
      archived_at: null,
    },
  ]);
  assertNoError("assign LCX E2E profiles", error);

  return {
    issuerId: issuer.id,
    investorId: investor.id,
    financeOpsId: financeOps.id,
    redactionId: redaction.id,
    counselId: counsel.id,
    dataRoomAdminId: dataRoomAdmin.id,
    userIds: [issuer.id, investor.id, financeOps.id, redaction.id, counsel.id, dataRoomAdmin.id],
  };
}

export async function findE2eUserIds(client: AdminClient) {
  const users = await listUsersByEmail(client);
  return Object.values(LCX_E2E_USERS)
    .map((user) => users.get(user.email)?.id)
    .filter((id): id is string => Boolean(id));
}

export async function deleteE2eUsers(client: AdminClient, userIds: string[]) {
  for (const userId of userIds) {
    const { error } = await client.auth.admin.deleteUser(userId);
    assertNoError(`delete LCX E2E auth user ${userId}`, error);
  }
}

export async function cleanupE2eState(client: AdminClient, userIds: string[]) {
  // The release gate is global for LCX, so teardown touches it only when the
  // active manifest is the deterministic E2E record. This keeps an explicit
  // remote test run from closing a non-E2E diligence release.
  const { data: releaseManifests, error: releaseManifestsError } = await client
    .from("data_room_release_manifests")
    .select("id")
    .eq("release_context_data_room_id", LCX_DATA_ROOM_ID)
    .eq("pwa_source_id", LCX_E2E_RELEASE_SOURCE_ID);
  assertNoError("find LCX E2E release manifests", releaseManifestsError);

  const releaseManifestIds = (releaseManifests ?? []).map((manifest) => manifest.id);
  if (releaseManifestIds.length > 0) {
    const { data: releaseGate, error: releaseGateError } = await client
      .from("data_room_release_gate")
      .select("active_manifest_id")
      .eq("data_room_id", LCX_DATA_ROOM_ID)
      .maybeSingle();
    assertNoError("read LCX release gate during E2E cleanup", releaseGateError);

    if (releaseGate?.active_manifest_id && releaseManifestIds.includes(releaseGate.active_manifest_id)) {
      const { error: closeGateError } = await client
        .from("data_room_release_gate")
        .update({
          state: "internal_preparation",
          active_manifest_id: null,
          opened_at: null,
          opened_by: null,
          closed_at: new Date().toISOString(),
          closed_by: null,
          updated_at: new Date().toISOString(),
        })
        .eq("data_room_id", LCX_DATA_ROOM_ID);
      assertNoError("close LCX E2E release gate", closeGateError);
    }

    await deleteRows(
      "delete LCX E2E release attestations",
      client.from("data_room_release_manifest_attestations").delete().in("manifest_id", releaseManifestIds),
    );
    await deleteRows(
      "delete LCX E2E release manifests",
      client.from("data_room_release_manifests").delete().in("id", releaseManifestIds),
    );
  }

  const { data: documents, error: documentsError } = await client
    .from("data_room_documents")
    .select("id")
    .eq("data_room_id", LCX_DATA_ROOM_ID)
    .eq("title", LCX_E2E_DOCUMENT_TITLE);
  assertNoError("find LCX E2E documents", documentsError);

  const documentIds = (documents ?? []).map((document) => document.id);
  const { data: versions, error: versionsError } = documentIds.length > 0
    ? await client
        .from("data_room_document_versions")
        .select("id,clearance_id")
        .in("document_id", documentIds)
    : { data: [], error: null };
  assertNoError("find LCX E2E document versions", versionsError);

  const versionIds = (versions ?? []).map((version) => version.id);
  const versionClearanceIds = new Set(
    (versions ?? []).map((version) => version.clearance_id).filter((id): id is string => Boolean(id)),
  );
  const userIdSet = new Set(userIds);
  const { data: clearanceRows, error: clearancesError } = await client
    .from("data_room_document_clearances")
    .select("id,consumed_version_id,created_by,finance_ops_reviewer_id,redaction_reviewer_id,counsel_reviewer_id,data_room_admin_reviewer_id")
    .eq("data_room_id", LCX_DATA_ROOM_ID);
  assertNoError("find LCX E2E clearances", clearancesError);

  const clearanceIds = (clearanceRows ?? [])
    .filter((clearance) =>
      versionClearanceIds.has(clearance.id)
      || versionIds.includes(clearance.consumed_version_id ?? "")
      || [
        clearance.created_by,
        clearance.finance_ops_reviewer_id,
        clearance.redaction_reviewer_id,
        clearance.counsel_reviewer_id,
        clearance.data_room_admin_reviewer_id,
      ].some((id) => userIdSet.has(id)),
    )
    .map((clearance) => clearance.id);

  const storagePaths = await collectE2eStoragePaths(client, documentIds);
  await removeStoragePaths(client, storagePaths);

  if (userIds.length > 0) {
    await deleteRows(
      "delete LCX E2E actor activity",
      client.from("data_room_activity_events").delete().in("actor_user_id", userIds),
    );
  }
  if (documentIds.length > 0) {
    await deleteRows(
      "delete LCX E2E document activity",
      client.from("data_room_activity_events").delete().in("document_id", documentIds),
    );
  }

  if (userIds.length > 0) {
    await deleteRows(
      "delete LCX E2E visits",
      client
        .from("data_room_visits")
        .delete()
        .eq("data_room_id", LCX_DATA_ROOM_ID)
        .in("user_id", userIds),
    );
    await deleteRows(
      "delete LCX E2E grants",
      client
        .from("data_room_access_grants")
        .delete()
        .eq("data_room_id", LCX_DATA_ROOM_ID)
        .in("user_id", userIds),
    );
    await deleteRows(
      "delete LCX E2E requests",
      client
        .from("data_room_access_requests")
        .delete()
        .eq("data_room_id", LCX_DATA_ROOM_ID)
        .in("user_id", userIds),
    );
  }

  if (clearanceIds.length > 0) {
    const { error: detachClearanceError } = await client
      .from("data_room_document_clearances")
      .update({ consumed_at: null, consumed_by: null, consumed_version_id: null })
      .in("id", clearanceIds);
    assertNoError("detach LCX E2E clearance consumers", detachClearanceError);
  }

  if (documentIds.length > 0) {

    const { error: resetError } = await client
      .from("data_room_documents")
      .update({
        archived_at: null,
        published_at: null,
        published_by: null,
        published_version_id: null,
        status: "draft",
      })
      .in("id", documentIds);
    assertNoError("detach LCX E2E published versions", resetError);

    await deleteRows(
      "delete LCX E2E document versions",
      client.from("data_room_document_versions").delete().in("document_id", documentIds),
    );
    await deleteRows(
      "delete LCX E2E documents",
      client.from("data_room_documents").delete().in("id", documentIds),
    );
  }

  if (clearanceIds.length > 0) {
    await deleteRows(
      "delete LCX E2E clearance attestations",
      client.from("data_room_document_clearance_attestations").delete().in("clearance_id", clearanceIds),
    );
    await deleteRows(
      "delete LCX E2E clearances",
      client.from("data_room_document_clearances").delete().in("id", clearanceIds),
    );
  }
}

async function findLcxIssuerId(client: AdminClient) {
  const { data: room, error: roomError } = await client
    .from("data_rooms")
    .select("round_id")
    .eq("id", LCX_DATA_ROOM_ID)
    .single();
  assertNoError("find the seeded LCX data room", roomError);

  const { data: round, error: roundError } = await client
    .from("rounds")
    .select("issuer_id")
    .eq("id", room!.round_id)
    .single();
  assertNoError("find the seeded LCX issuer", roundError);

  return round!.issuer_id;
}

async function listUsersByEmail(client: AdminClient) {
  const targetEmails = new Set(Object.values(LCX_E2E_USERS).map((user) => user.email));
  const usersByEmail = new Map<string, User>();
  const perPage = 1_000;

  for (let page = 1; usersByEmail.size < targetEmails.size; page += 1) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage });
    assertNoError("list LCX E2E auth users", error);

    for (const user of data.users) {
      const email = user.email?.toLowerCase();
      if (email && targetEmails.has(email)) usersByEmail.set(email, user);
    }
    if (data.users.length < perPage) break;
  }

  return usersByEmail;
}

async function upsertAuthUser(
  client: AdminClient,
  existing: User | undefined,
  email: string,
  fullName: string,
  password: string,
) {
  if (existing) {
    const { data, error } = await client.auth.admin.updateUserById(existing.id, {
      email_confirm: true,
      password,
      user_metadata: { ...existing.user_metadata, full_name: fullName },
    });
    assertNoError(`update ${email}`, error);
    if (!data.user) throw new Error(`update ${email}: Supabase returned no user`);
    return data.user;
  }

  const { data, error } = await client.auth.admin.createUser({
    email,
    email_confirm: true,
    password,
    user_metadata: { full_name: fullName },
  });
  assertNoError(`create ${email}`, error);
  if (!data.user) throw new Error(`create ${email}: Supabase returned no user`);
  return data.user;
}

async function collectE2eStoragePaths(client: AdminClient, documentIds: string[]) {
  const allPaths = await listStorageTree(client, LCX_DATA_ROOM_ID);
  const documentPrefixes = documentIds.map((id) => `${LCX_DATA_ROOM_ID}/${id}/`);

  return allPaths.filter((storagePath) => {
    const filename = storagePath.split("/").at(-1) ?? "";
    return (
      filename.includes("lcx-e2e-") ||
      documentPrefixes.some((prefix) => storagePath.startsWith(prefix))
    );
  });
}

async function listStorageTree(client: AdminClient, root: string) {
  const files: string[] = [];
  const folders = [root];

  while (folders.length > 0) {
    const folder = folders.pop()!;
    const entries = await listStorageFolder(client, folder);

    for (const entry of entries) {
      const entryPath = `${folder}/${entry.name}`;
      if (entry.id) files.push(entryPath);
      else folders.push(entryPath);
    }
  }

  return files;
}

async function listStorageFolder(client: AdminClient, folder: string) {
  const entries: Array<{ id: string | null; name: string }> = [];
  const limit = 100;

  for (let offset = 0; ; offset += limit) {
    const { data, error } = await client.storage.from(LCX_DATA_ROOM_BUCKET).list(folder, {
      limit,
      offset,
      sortBy: { column: "name", order: "asc" },
    });
    assertNoError(`list Storage folder ${folder}`, error);

    entries.push(...(data ?? []).map((entry) => ({ id: entry.id, name: entry.name })));
    if ((data?.length ?? 0) < limit) break;
  }

  return entries;
}

async function removeStoragePaths(client: AdminClient, paths: string[]) {
  for (let offset = 0; offset < paths.length; offset += 100) {
    const { error } = await client.storage
      .from(LCX_DATA_ROOM_BUCKET)
      .remove(paths.slice(offset, offset + 100));
    assertNoError("delete LCX E2E Storage objects", error);
  }
}

async function deleteRows(
  context: string,
  query: PromiseLike<{ error: { message: string } | null }>,
) {
  const { error } = await query;
  assertNoError(context, error);
}

function assertNoError(context: string, error: { message: string } | null) {
  if (error) throw new Error(`${context}: ${error.message}`);
}
