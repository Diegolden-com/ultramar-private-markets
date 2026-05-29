import { AuthPanel } from "@/components/auth-panel";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Sign In",
  description: "Sign in to an Ultramar.capital investor account.",
  path: "/auth/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <AuthPanel
      title="Sign in"
      description="Access your Ultramar.capital account across Private Equities and the Arbitrage Hedge Fund."
      mode="login"
    />
  );
}
