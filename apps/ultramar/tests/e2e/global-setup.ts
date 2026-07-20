import {
  cleanupE2eState,
  createE2eAdminClient,
  provisionE2eUsers,
} from "./support/supabase-admin";

export default async function globalSetup() {
  const { client, runtime } = createE2eAdminClient();
  const users = await provisionE2eUsers(client, runtime.password);

  await cleanupE2eState(client, [users.issuerId, users.investorId]);
}
