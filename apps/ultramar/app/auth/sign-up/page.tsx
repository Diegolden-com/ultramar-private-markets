import { AuthPanel } from "@/components/auth-panel";
import { safeReturnTo } from "@/lib/auth/redirects";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Create Account",
  description: "Request access to Ultramar.capital products.",
  path: "/auth/sign-up",
  noIndex: true,
});

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
  const value = (await searchParams).returnTo;
  const returnTo = safeReturnTo(Array.isArray(value) ? value[0] : value);

  return (
    <AuthPanel
      title="Create account"
      description="Request access to Private Equities or the Arbitrage Hedge Fund."
      mode="signup"
      returnTo={returnTo}
    />
  );
}
