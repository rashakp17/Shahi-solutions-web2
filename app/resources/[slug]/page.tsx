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
 * One route for every article, rather than a folder per article.
 *
 * The pages are identical in structure and differ only in content, so a
 * per-article route would be five copies of this file kept in sync by hand —
 * and the first time one of them grew a section the others did not, the FAQ
 * markup and the FAQ structured data would start disagreeing on one page and
 * not the others. Here the content is data and the page is one renderer, so a
 * new article is a file in `lib/resources/articles` and an entry in the
 * registry. Nothing under `app/` changes.
 *
 * Fully static: `generateStaticParams` enumerates the registry at build time,
 * so every article is prerendered HTML on a CDN. That is most of what makes
 * these pages fast, and it is the reason the only client component on the page
 * is the contents.
 */

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

/**
 * Nothing outside the registry is a valid article.
 *
 * Without this, an unknown slug would be rendered on demand and 404 from
 * `notFound()` — correct, but served dynamically. With it, the route is closed:
 * anything not prerendered is a 404 straight from the edge, and a crawler that
 * has found an old URL gets a clean answer instead of a rendered miss.
 */
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
    /* Relative, resolved against `metadataBase` in the root layout. Relative
       is what keeps it correct when the origin changes — a canonical hardcoded
       to a production hostname points staging at production, which is how a
       preview deployment ends up de-indexing the real page. */
    alternates: { canonical: path },
    ...(() => {
      const social = socialMetadata({
        title: article.metaTitle,
        description: article.description,
        path,
        type: "article",
      });

      /* `modifiedTime` is the one Open Graph field only an article has, so it
         is added here rather than being a parameter the other three callers
         would have to pass as undefined. */
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
   * Three graphs, one script.
   *
   * `Article` describes the page, `FAQPage` describes the questions at the
   * bottom of it, and `BreadcrumbList` gives a search result the trail
   * Resources → Cluster → Article rather than a bare URL.
   *
   * The FAQ entries are built from the same array the page renders, run
   * through `stripInline` so the answers are plain sentences rather than
   * markup. That is the rule this whole layer is built around: structured
   * data may only ever describe content the visitor can actually see, and the
   * way to guarantee that is to derive one from the other rather than to write
   * it twice.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      /* The organisation itself, in full, on every article — and referenced by
         `@id` from the Article below rather than described a second time.

         This used to be two inline `{"@type": "Organization", name, url}`
         objects, one for `author` and one for `publisher`, neither of which
         carried the legal name, the address or the logo dimensions that the
         home page's copy does. Three descriptions of one company that differ
         by field is how an entity graph ends up with three companies.

         Emitting the whole node and pointing at it is what Yoast and every
         other mature implementation does, and it is worth the ~600 bytes: a
         bare `@id` referring to a node defined on a *different* page is
         resolvable in principle and routinely not resolved in practice. */
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
      {/* A native <script>, not next/script — this is data, not code to
          schedule. The `<` escape is the sanitiser the Next.js JSON-LD guide
          asks for: it makes a `</script>` inside any content string
          impossible to form, which is the one way a string in this payload
          could break out of the tag. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <article className="rs-shell">
        <header className="rs-hero">
          {/* The visible trail, matching the BreadcrumbList above. Both exist
              because they serve different readers, and neither is a copy of
              the other's markup — this one is navigation a person can click. */}
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
          {/* A rail on a wide screen and an inline index below that — one
              element, positioned by CSS, rather than two copies of the same
              list with one of them hidden. */}
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
