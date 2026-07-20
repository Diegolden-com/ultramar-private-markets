import { AuthForm, type AuthFormMode } from "@/components/auth-form";
import { BrandText } from "@/components/brand-name";
import { DEFAULT_AUTH_RETURN_TO } from "@/lib/auth/redirects";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type AuthMode = AuthFormMode | "message";
type AuthAction = { href: string; label: string };

export function AuthPanel({
  title,
  description,
  mode,
  primaryAction,
  returnTo = DEFAULT_AUTH_RETURN_TO,
}: {
  title: string;
  description: string;
  mode: AuthMode;
  primaryAction?: AuthAction;
  returnTo?: string;
}) {
  const messageAction = primaryAction ?? { href: "/", label: "Return home" };

  return (
    <main className="terminal-grid mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[1440px] flex-col bg-surface-ink px-4 py-6 text-on-surface sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
      <section className="card card-border grid flex-1 grid-cols-1 overflow-hidden bg-border-muted lg:grid-cols-[0.85fr_1.15fr] lg:gap-px">
        <div className="flex min-w-0 flex-col justify-between border-b border-border-muted bg-surface-container-lowest p-6 sm:p-8 lg:border-b-0 lg:p-10 xl:p-12">
          <div>
            <h1 className="max-w-[12ch] break-words text-balance font-serif text-4xl font-bold leading-[1.02] sm:text-5xl lg:text-[3.5rem]">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-on-surface-variant md:text-base md:leading-7">
              <BrandText>{description}</BrandText>
            </p>
          </div>

        </div>

        <aside className="grid min-w-0 bg-surface text-on-surface">
          <div className="relative min-h-[200px] overflow-hidden border-b border-border-muted sm:min-h-[260px]">
            <Image
              src="/abstract-financial-growth-chart-geometric-shapes.jpg"
              alt="Institutional market geometry"
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="image-blackwork object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-surface-ink/55" />
          </div>

          <div className="flex min-h-[380px] flex-col justify-center p-5 sm:p-8 lg:p-10 xl:p-12">
            {mode === "message" ? (
              <Link
                href={messageAction.href}
                className="btn btn-outline btn-primary group h-12 font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
              >
                {messageAction.label}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            ) : (
              <AuthForm mode={mode} returnTo={returnTo} />
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
