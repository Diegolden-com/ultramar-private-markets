import { AuthPanel } from "@/components/auth-panel";
import { safeReturnTo } from "@/lib/auth/redirects";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Sign In",
  description: "Sign in to an Ultramar.capital investor account.",
  path: "/auth/login",
  noIndex: true,
});

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
  const value = (await searchParams).returnTo;
  const returnTo = safeReturnTo(Array.isArray(value) ? value[0] : value);

  return (
    <AuthPanel
      title="Sign in"
      description="Access your Ultramar.capital account across Private Equities and the Arbitrage Hedge Fund."
      mode="login"
      returnTo={returnTo}
    />
  );
}
