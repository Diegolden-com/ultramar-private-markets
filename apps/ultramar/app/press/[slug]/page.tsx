import { JsonLd } from "@/components/json-ld";
import { findPressArticle, pressArticles } from "@/lib/press";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  createSeoMetadata,
  webPageJsonLd,
} from "@/lib/seo";
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Quote } from "lucide-react";
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
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-on-surface-variant">
            {article.description}
          </p>
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
          <div className="mt-6 flex flex-wrap gap-2">
            {[article.cluster, article.audience, article.readingTime, `Updated ${article.updatedAt}`].map(
              (item) => (
                <span
                  key={item}
                  className="inline-flex max-w-full items-center border border-border-muted bg-surface-ink px-3 py-1.5 font-mono text-[11px] leading-5 text-on-surface-variant"
                >
                  {item}
                </span>
              ),
            )}
          </div>
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

        <section className="grid gap-1 bg-border-muted lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="space-y-1">
            <div className="card card-border bg-surface p-5">
              <p className="badge badge-outline badge-success font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
                Thesis
              </p>
              <div className="mt-4 flex gap-3">
                <Quote className="mt-1 h-4 w-4 shrink-0 text-status-signal" />
                <p className="text-sm leading-6 text-on-surface-variant">{article.thesis}</p>
              </div>
            </div>
            <div className="card card-border bg-surface p-5">
              <p className="badge badge-outline badge-success font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
                Key takeaways
              </p>
              <div className="mt-4 grid gap-4">
                {article.takeaways.map((takeaway) => (
                  <div key={takeaway} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-status-signal" />
                    <p className="text-sm leading-6 text-on-surface-variant">{takeaway}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-1">
            {article.sections.map((section) => (
              <section key={section.heading} className="card card-border bg-surface p-6 md:p-8">
                <h2 className="font-serif text-3xl font-semibold leading-tight text-on-surface">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-8 text-on-surface-variant">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            <section className="card card-border bg-surface p-6">
              <p className="badge badge-outline badge-success font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
                Open app surfaces
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
                      <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                        {target.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-status-signal transition group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </section>

            {article.technicalReferences ? (
              <section className="card card-border bg-surface p-6">
                <p className="badge badge-outline badge-success font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
                  Technical references
                </p>
                <div className="mt-5 grid gap-4">
                  {article.technicalReferences.map((target) => (
                    <a
                      key={target.href}
                      href={target.href}
                      target="_blank"
                      rel="noreferrer"
                      className="card card-border group flex flex-col gap-2 bg-surface-ink p-4 transition hover:border-status-signal sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                          {target.label}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                          {target.description}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-status-signal transition group-hover:translate-x-1" />
                    </a>
                  ))}
                </div>
              </section>
            ) : null}

            <p className="border border-border-muted bg-surface p-5 font-mono text-[11px] uppercase leading-6 tracking-[0.08em] text-on-surface-variant">
              This article is informational and describes market structure,
              product architecture, and compliance concepts. It is not
              investment, legal, tax, accounting, or financial advice.
            </p>
          </div>
        </section>
      </article>
    </>
  );
}
