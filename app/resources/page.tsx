import type { Metadata } from "next";
import Link from "next/link";

import { ClosingCta } from "@/components/resources/ClosingCta";
import {
  ARTICLES,
  CLUSTERS,
  articlesInCluster,
} from "@/lib/resources";
import { SITE_NAME, absolute, socialMetadata } from "@/lib/site";
import { PageTransition } from "@/components/site/PageTransition";

export const metadata: Metadata = {
  title: "Resources — Guides to Building Custom Software",
  description:
    "Practical guides on custom software development: what gets built, what a project actually costs, how the process runs, and how to decide between building and buying.",
  alternates: { canonical: "/resources" },
  ...socialMetadata({
    title: "Resources — Guides to Building Custom Software",
    description:
      "Practical guides on custom software development from the Shahi Solutions engineering team.",
    path: "/resources",
  }),
};

/**
 * The index of the resource layer.
 *
 * Organised by cluster rather than by date, and that is the substantive
 * decision on this page. A reverse-chronological list is a blog: it says the
 * newest thing is the most important thing, which is true of news and false of
 * reference material. Grouping by topic says what this section actually is —
 * a small number of subjects, covered properly — and it puts the pillar
 * article at the top of its own group where a reader arriving cold should
 * start.
 *
 * There is no pagination, no tag cloud, no author sidebar and no search box.
 * Five articles do not need any of them, and adding the furniture of a large
 * publication to a small one is exactly the thing that makes a company's
 * content section read as an SEO annex.
 */
export default function ResourcesIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absolute("/resources")}#collection`,
    name: "Resources",
    description:
      "Practical guides on custom software development from Shahi Solutions.",
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absolute("/") },
    hasPart: ARTICLES.map((article) => ({
      "@type": "Article",
      headline: article.title,
      description: article.description,
      url: absolute(`/resources/${article.slug}`),
      dateModified: article.updated,
    })),
  };

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="rs-shell">
        <header className="rs-hero rs-hero--index">
          <p className="rs-eyebrow">Resources</p>

          <h1 className="rs-h1 rs-h1--index">
            What we have learned building software,
            <span className="rs-h1-quiet"> written down properly.</span>
          </h1>

          <p className="rs-lead">
            Long-form guides on commissioning and building custom software —
            what gets built, what it costs, how a project actually runs, and
            when the honest answer is to buy something instead. Written by the
            team that does the work, and revised as it changes.
          </p>
        </header>

        {CLUSTERS.map((cluster) => {
          const articles = articlesInCluster(cluster.id);
          const pillar = articles.find((a) => a.slug === cluster.pillar);
          const rest = articles.filter((a) => a.slug !== cluster.pillar);

          return (
            <section
              key={cluster.id}
              id={cluster.id}
              className="rs-cluster"
              aria-labelledby={`${cluster.id}-head`}
            >
              <div className="rs-cluster-head">
                <h2 id={`${cluster.id}-head`} className="rs-h2 rs-cluster-title">
                  {cluster.title}
                </h2>
                <p className="rs-cluster-blurb">{cluster.blurb}</p>
                <Link href={cluster.service.href} className="rs-cluster-service">
                  {cluster.service.label} at Shahi Solutions
                  <span aria-hidden="true"> →</span>
                </Link>
              </div>

              {/* The pillar, given the room a starting point deserves. Every
                  other article in the cluster is a chapter of it, so listing
                  it as one of six equal rows would bury the page a reader
                  arriving cold should open first. */}
              {pillar && (
                <Link
                  href={`/resources/${pillar.slug}`}
                  className="rs-pillar"
                >
                  <p className="rs-pillar-label">Start here</p>
                  <h3 className="rs-pillar-title">{pillar.title}</h3>
                  <p className="rs-pillar-desc">{pillar.description}</p>
                </Link>
              )}

              <ol className="rs-index-list">
                {rest.map((article, i) => (
                  <li key={article.slug} className="rs-index-item">
                    <Link
                      href={`/resources/${article.slug}`}
                      className="rs-index-link"
                    >
                      <span className="rs-index-num" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <span className="rs-index-body">
                        <span className="rs-index-title">{article.title}</span>
                        <span className="rs-index-desc">
                          {article.description}
                        </span>
                      </span>

                      <span className="rs-index-arrow" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}

        <ClosingCta />
      </div>
    </PageTransition>
  );
}
