import { AuthPanel } from "@/components/auth-panel";
import { safeReturnTo, withReturnTo } from "@/lib/auth/redirects";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Account Requested",
  description: "Ultramar.capital account request confirmation.",
  path: "/auth/sign-up-success",
  noIndex: true,
});

export default async function SignUpSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
  const value = (await searchParams).returnTo;
  const returnTo = safeReturnTo(Array.isArray(value) ? value[0] : value);

  return (
    <AuthPanel
      title="Account requested"
      description="Check your email for the next step. Ultramar.capital access is shared across both products."
      mode="message"
      primaryAction={{ href: withReturnTo("/auth/login", returnTo), label: "Continue to sign in" }}
    />
  );
}
