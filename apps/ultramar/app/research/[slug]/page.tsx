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
    <main>
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

      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Research library
          </Link>
        </div>
      </section>

      <article>
        <header className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-accent">
            {article.eyebrow}
          </p>
          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight sm:text-6xl">
            {article.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            {article.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {[article.cluster, article.audience, article.readingTime, `Updated ${article.updatedAt}`].map(
              (item) => (
                <span
                  key={item}
                  className="rounded border border-border bg-card px-3 py-1.5 font-mono text-xs text-muted-foreground"
                >
                  {item}
                </span>
              ),
            )}
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative aspect-[16/8] overflow-hidden rounded border border-border">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-foreground/12" />
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="space-y-5">
            <div className="rounded border border-border bg-card p-5">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-accent">
                Angle
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{article.angle}</p>
            </div>
            <div className="rounded border border-border bg-card p-5">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-accent">
                Key takeaways
              </p>
              <div className="mt-4 grid gap-4">
                {article.takeaways.map((takeaway) => (
                  <div key={takeaway} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <p className="text-sm leading-6 text-muted-foreground">{takeaway}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-10">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-3xl font-bold leading-tight">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-8 text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            <section className="rounded border border-border bg-card p-6">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-accent">
                Product paths cited by this memo
              </p>
              <div className="mt-5 grid gap-4">
                {article.linkTargets.map((target) => (
                  <Link
                    key={target.href}
                    href={target.href}
                    className="group flex flex-col gap-2 rounded border border-border bg-background p-4 transition hover:border-accent sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="font-semibold">{target.label}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {target.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-accent transition group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </section>

            <p className="border-t border-border pt-6 text-xs leading-6 text-muted-foreground">
              This memo is informational and describes product architecture,
              market structure, and operating controls. It is not investment,
              legal, tax, or financial advice.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
