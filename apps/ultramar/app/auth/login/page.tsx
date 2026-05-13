import { AuthPanel } from "@/components/auth-panel";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Sign In",
  description: "Sign in to Ultramar.capital investor workflows.",
  path: "/auth/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <AuthPanel
      title="Sign in"
      description="Access Ultramar.capital investor workflows across both product lines."
      mode="login"
    />
  );
}
