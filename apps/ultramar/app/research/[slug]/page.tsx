import { JsonLd } from "@/components/json-ld";
import { findResearchArticle, researchArticles } from "@/lib/research";
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
  return researchArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = findResearchArticle(slug);
  if (!article) return {};

  return createSeoMetadata({
    title: article.title,
    description: article.description,
    path: `/research/${article.slug}`,
    image: {
      url: article.image,
      width: 1200,
      height: 630,
      alt: article.title,
    },
    keywords: article.keywords,
  });
}

export default async function ResearchArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = findResearchArticle(slug);
  if (!article) notFound();

  const path = `/research/${article.slug}`;
  const image = {
    url: article.image,
    width: 1200,
    height: 630,
    alt: article.title,
  };

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
            { name: "Research", path: "/research" },
            { name: article.title, path },
          ]),
        ]}
      />

      <section className="border border-border-muted bg-surface">
        <div className="px-4 py-4">
          <Link
            href="/research"
            className="btn btn-ghost btn-sm font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant hover:text-status-signal"
          >
            <ArrowLeft className="h-4 w-4" />
            Research library
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
          <div className="mt-8 flex flex-wrap gap-2">
            {[article.cluster, article.audience, article.readingTime, `Updated ${article.updatedAt}`].map(
              (item) => (
                <span
                  key={item}
                  className="badge badge-outline bg-surface-ink px-3 py-1.5 font-mono text-[11px] text-on-surface-variant"
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
                Angle
              </p>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">{article.angle}</p>
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
                Product paths cited by this memo
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

            <p className="border border-border-muted bg-surface p-5 font-mono text-[11px] uppercase leading-6 tracking-[0.08em] text-on-surface-variant">
              This memo is informational and describes product architecture,
              market structure, and operating controls. It is not investment,
              legal, tax, or financial advice.
            </p>
          </div>
        </section>
      </article>
    </>
  );
}
