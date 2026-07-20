import { AuthPanel } from "@/components/auth-panel";
import { safeReturnTo } from "@/lib/auth/redirects";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Update Password",
  description: "Update an Ultramar.capital account password.",
  path: "/auth/update-password",
  noIndex: true,
});

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
  const value = (await searchParams).returnTo;
  const returnTo = safeReturnTo(Array.isArray(value) ? value[0] : value);

  return (
    <AuthPanel
      title="Update password"
      description="Set a new password for your Ultramar.capital account."
      mode="update"
      returnTo={returnTo}
    />
  );
}
