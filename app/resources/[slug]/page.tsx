import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/resources/ArticleBody";
import { CaseStudyRail } from "@/components/resources/CaseStudyRail";
import { ClosingCta } from "@/components/resources/ClosingCta";
import { FaqList } from "@/components/resources/FaqList";
import { RelatedReading } from "@/components/resources/RelatedReading";
import { TableOfContents } from "@/components/resources/TableOfContents";

import {
  ARTICLES,
  articleBySlug,
  clusterOf,
  relatedTo,
  tableOfContents,
} from "@/lib/resources";
import { caseStudiesByIds } from "@/lib/resources/case-studies";
import { renderInline, stripInline } from "@/lib/resources/inline";
import { absolute, organizationNode, socialMetadata } from "@/lib/site";

/**
 * Shared route for all resource articles. To add one, create a file in
 * `lib/resources/articles` and register it. All articles are prerendered.
 */

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

/** Unknown slugs 404 without rendering on demand. */
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug(slug);

  if (!article) return {};

  const path = `/resources/${article.slug}`;

  return {
    title: article.metaTitle,
    description: article.description,
    /* Relative; resolved against `metadataBase`. */
    alternates: { canonical: path },
    ...(() => {
      const social = socialMetadata({
        title: article.metaTitle,
        description: article.description,
        path,
        type: "article",
      });

      /* Article-only OG field, added here instead of in socialMetadata. */
      return {
        ...social,
        openGraph: { ...social.openGraph, modifiedTime: article.updated },
      };
    })(),
  };
}

export default async function ResourceArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articleBySlug(slug);

  if (!article) notFound();

  const cluster = clusterOf(article);
  const toc = tableOfContents(article);
  const related = relatedTo(article);
  const studies = caseStudiesByIds(article.caseStudies);
  const path = `/resources/${article.slug}`;

  /**
   * Article, FAQPage and BreadcrumbList JSON-LD. FAQ answers come from the
   * same data the page renders, with markup stripped, so they always match
   * what's visible.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      /* Full org node on every page; crawlers often don't resolve an `@id`
         defined on another page. */
      organizationNode(),
      {
        "@type": "Article",
        "@id": `${absolute(path)}#article`,
        headline: article.title,
        description: article.description,
        inLanguage: "en-IN",
        dateModified: article.updated,
        mainEntityOfPage: absolute(path),
        author: { "@id": `${absolute("/")}#organization` },
        publisher: { "@id": `${absolute("/")}#organization` },
        about: cluster?.title,
      },
      {
        "@type": "FAQPage",
        "@id": `${absolute(path)}#faq`,
        mainEntity: article.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: stripInline(faq.a) },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Resources", item: absolute("/resources") },
          ...(cluster
            ? [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: cluster.title,
                  item: absolute(`/resources#${cluster.id}`),
                },
              ]
            : []),
          {
            "@type": "ListItem",
            position: cluster ? 3 : 2,
            name: article.title,
            item: absolute(path),
          },
        ],
      },
    ],
  };

  return (
    <>
      {/* Escaping `<` prevents a `</script>` in content from breaking out. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <article className="rs-shell">
        <header className="rs-hero">
          <nav aria-label="Breadcrumb" className="rs-crumbs">
            <ol>
              <li>
                <Link href="/resources">Resources</Link>
              </li>
              {cluster && (
                <li>
                  <Link href={`/resources#${cluster.id}`}>{cluster.title}</Link>
                </li>
              )}
            </ol>
          </nav>

          <h1 className="rs-h1">{article.title}</h1>

          <p className="rs-lead">{renderInline(article.lead)}</p>
        </header>

        <div className="rs-body-grid">
          {/* Sidebar on wide screens, inline on narrow ones (CSS only). */}
          <div className="rs-rail">
            <TableOfContents entries={toc} />
          </div>

          <div className="rs-prose">
            <ArticleBody sections={article.sections} />

            <section id="faq" className="rs-section" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="rs-h2">
                Frequently asked questions
              </h2>
              <FaqList faqs={article.faqs} />
            </section>
          </div>
        </div>

        <CaseStudyRail
          studies={studies}
          heading="What this looks like in practice"
          intro="Projects from our own portfolio that sit in the categories above — what was built, and why it was built rather than bought."
        />

        <RelatedReading
          articles={related}
          clusterTitle={cluster?.title ?? "this topic"}
        />

        <ClosingCta
          serviceHref={cluster?.service.href ?? "/services/custom-software-development"}
          serviceLabel={`See how we build ${(cluster?.service.label ?? "custom software").toLowerCase()}`}
        />
      </article>
    </>
  );
}
