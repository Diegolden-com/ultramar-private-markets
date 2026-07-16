import { JsonLd } from "@/components/json-ld";
import { findPressArticle, pressArticles } from "@/lib/press";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  createSeoMetadata,
  webPageJsonLd,
} from "@/lib/seo";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return pressArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = findPressArticle(slug);
  if (!article) return {};

  return createSeoMetadata({
    title: article.title,
    description: article.description,
    path: `/press/${article.slug}`,
    image: {
      url: article.image,
      width: 1200,
      height: 630,
      alt: article.title,
    },
    keywords: article.keywords,
  });
}

export default async function PressArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = findPressArticle(slug);
  if (!article) notFound();

  const path = `/press/${article.slug}`;
  const image = {
    url: article.image,
    width: 1200,
    height: 630,
    alt: article.title,
  };
  const primaryAppLink = article.linkTargets[0];
  const accessAppLink = article.linkTargets.find((target) => target.href === "/auth/sign-up");

  return (
    <>
      <JsonLd
        id={`${article.slug}-json-ld`}
        data={[
          webPageJsonLd({ path, name: article.title, description: article.description }),
          articleJsonLd({
            path,
            headline: article.title,
            description: article.description,
            image,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt,
            keywords: article.keywords,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Press", path: "/press" },
            { name: article.title, path },
          ]),
        ]}
      />

      <section className="border border-border-muted bg-surface">
        <div className="px-4 py-4">
          <Link
            href="/press"
            className="btn btn-ghost btn-sm font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant hover:text-status-signal"
          >
            <ArrowLeft className="h-4 w-4" />
            Press desk
          </Link>
        </div>
      </section>

      <article>
        <header className="border border-border-muted bg-surface p-6 md:p-8">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
            {article.eyebrow}
          </p>
          <h1 className="mt-5 max-w-5xl font-serif text-4xl font-bold leading-[1.1] md:text-5xl">
            {article.title}
          </h1>
          {primaryAppLink ? (
            <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
              <Link href={primaryAppLink.href} className="btn btn-primary btn-sm">
                {primaryAppLink.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {accessAppLink ? (
                <Link href={accessAppLink.href} className="btn btn-outline btn-sm">
                  {accessAppLink.label}
                </Link>
              ) : null}
            </div>
          ) : null}
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.08em] text-on-surface-variant">
            Updated {article.updatedAt}
          </p>
        </header>

        <section className="border border-border-muted bg-surface">
          <div className="relative aspect-[16/8] overflow-hidden">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              sizes="(min-width: 1024px) 900px, 100vw"
              className="image-blackwork object-cover"
            />
            <div className="absolute inset-0 bg-surface-ink/25" />
          </div>
        </section>

        <section className="grid gap-1 bg-border-muted lg:grid-cols-[1fr_1fr]">
          <section className="card card-border bg-surface p-6">
            <p className="badge badge-outline badge-success font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
              Key point
            </p>
            <div className="mt-4 flex gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-status-signal" />
              <p className="text-sm leading-6 text-on-surface-variant">{article.takeaways[0]}</p>
            </div>
          </section>

          <div className="space-y-1">
            <section className="card card-border bg-surface p-6">
              <p className="badge badge-outline badge-success font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
                Related Ultramar areas
              </p>
              <div className="mt-5 grid gap-4">
                {article.linkTargets.map((target) => (
                  <Link
                    key={target.href}
                    href={target.href}
                    className="card card-border group flex flex-col gap-2 bg-surface-ink p-4 transition hover:border-status-signal sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                        {target.label}
                      </h3>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-status-signal transition group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </section>

            <p className="border border-border-muted bg-surface p-5 font-mono text-[11px] uppercase leading-6 tracking-[0.08em] text-on-surface-variant">
              Informational only. Not investment, legal, tax, accounting, or financial advice.
            </p>
          </div>
        </section>
      </article>
    </>
  );
}
