import { AuthPanel } from "@/components/auth-panel";
import { safeReturnTo, withReturnTo } from "@/lib/auth/redirects";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Sign-in Error",
  description: "Sign-in issue for Ultramar.capital account access.",
  path: "/auth/error",
  noIndex: true,
});

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
  const value = (await searchParams).returnTo;
  const returnTo = safeReturnTo(Array.isArray(value) ? value[0] : value);

  return (
    <AuthPanel
      title="Sign-in issue"
      description="The account link could not be completed. Return to the sign-in page and request a new link."
      mode="message"
      primaryAction={{ href: withReturnTo("/auth/login", returnTo), label: "Back to sign in" }}
    />
  );
}
