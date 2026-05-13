import { AuthPanel } from "@/components/auth-panel";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Authentication Error",
  description: "Authentication error page for Ultramar.capital account access.",
  path: "/auth/error",
  noIndex: true,
});

export default function AuthErrorPage() {
  return (
    <AuthPanel
      title="Authentication issue"
      description="The authentication link could not be completed. Return home or try signing in again."
      mode="message"
    />
  );
}
