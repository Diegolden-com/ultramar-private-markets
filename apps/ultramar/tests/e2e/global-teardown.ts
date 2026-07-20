import {
  cleanupE2eState,
  createE2eAdminClient,
  deleteE2eUsers,
  findE2eUserIds,
} from "./support/supabase-admin";

export default async function globalTeardown() {
  const { client } = createE2eAdminClient();
  const userIds = await findE2eUserIds(client);
  await cleanupE2eState(client, userIds);
  await deleteE2eUsers(client, userIds);
}
