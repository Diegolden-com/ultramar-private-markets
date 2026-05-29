import { AuthPanel } from "@/components/auth-panel";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Create Account",
  description: "Request access to Ultramar.capital products.",
  path: "/auth/sign-up",
  noIndex: true,
});

export default function SignUpPage() {
  return (
    <AuthPanel
      title="Create account"
      description="Request access to Private Equities or the Arbitrage Hedge Fund."
      mode="signup"
    />
  );
}
