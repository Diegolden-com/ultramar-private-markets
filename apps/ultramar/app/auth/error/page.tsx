import { AuthPanel } from "@/components/auth-panel";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Sign-in Error",
  description: "Sign-in issue for Ultramar.capital account access.",
  path: "/auth/error",
  noIndex: true,
});

export default function AuthErrorPage() {
  return (
    <AuthPanel
      title="Sign-in issue"
      description="The account link could not be completed. Return to the sign-in page and request a new link."
      mode="message"
      primaryAction={{ href: "/auth/login", label: "Back to sign in" }}
    />
  );
}
