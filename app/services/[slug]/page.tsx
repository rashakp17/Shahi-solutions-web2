import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseStudyRail } from "@/components/resources/CaseStudyRail";
import { ClosingCta } from "@/components/resources/ClosingCta";
import { FaqList } from "@/components/resources/FaqList";
import { caseStudiesByIds } from "@/lib/resources/case-studies";
import { SERVICE_PAGES, servicePageBySlug } from "@/lib/service-pages";
import { absolute, organizationNode, socialMetadata } from "@/lib/site";

/**
 * Shared route for the shorter service pages. Content lives in
 * lib/service-pages.ts. Custom software has its own static route, which
 * Next.js matches before this one.
 */

export function generateStaticParams() {
  return SERVICE_PAGES.map((page) => ({ slug: page.slug }));
}

/** Unknown slugs 404 without rendering on demand. */
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = servicePageBySlug(slug);

  if (!page) return {};

  const path = `/services/${page.slug}`;

  return {
    title: page.metaTitle,
    description: page.description,
    alternates: { canonical: path },
    ...socialMetadata({
      title: `${page.metaTitle} | Shahi Solutions`,
      description: page.description,
      path,
    }),
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const page = servicePageBySlug(slug);

  if (!page) notFound();

  const studies = page.caseStudies ? caseStudiesByIds(page.caseStudies) : [];
  const path = `/services/${page.slug}`;

  /* Service and BreadcrumbList JSON-LD, as on the custom software page. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      {
        "@type": "Service",
        "@id": `${absolute(path)}#service`,
        name: page.name,
        serviceType: page.serviceType,
        description: page.description,
        url: absolute(path),
        provider: { "@id": `${absolute("/")}#organization` },
        areaServed: "Worldwide",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Services",
            item: absolute("/#platform"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: page.name,
            item: absolute(path),
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="rs-shell">
        <header className="rs-hero rs-hero--index">
          <nav aria-label="Breadcrumb" className="rs-crumbs">
            <ol>
              <li>
                <Link href="/#platform">Services</Link>
              </li>
            </ol>
          </nav>

          <h1 className="rs-h1 rs-h1--index">
            {page.name}
            <span className="rs-h1-quiet">{page.tagline}</span>
          </h1>

          <p className="rs-lead">{page.lead}</p>

          <div className="rs-cta-actions rs-hero-actions">
            <Link href="/#contact" className="rs-cta-primary">
              Start a conversation
              <span aria-hidden="true" className="rs-cta-arrow">
                →
              </span>
            </Link>
            <Link href="/#projects" className="rs-cta-secondary">
              See our work
            </Link>
          </div>
        </header>

        <div className="rs-prose rs-prose--service">
          <section id="what-we-offer" className="rs-section">
            <h2 className="rs-h2">What we offer</h2>
            <p className="rs-p">{page.offeringsIntro}</p>

            <ol className="rs-examples">
              {page.offerings.map((item) => (
                <li key={item.title} className="rs-example">
                  <h3 className="rs-example-title">{item.title}</h3>
                  <p className="rs-example-text">{item.body}</p>
                  <p className="rs-example-detail">{item.detail}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="how-we-work" className="rs-section">
            <h2 className="rs-h2">How we work</h2>

            <ol className="rs-phases">
              {page.phases.map((phase, i) => (
                <li key={phase.name} className="rs-phase">
                  <span className="rs-phase-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="rs-phase-name">{phase.name}</h3>
                    <p className="rs-phase-body">{phase.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="faq" className="rs-section">
            <h2 className="rs-h2">Frequently asked questions</h2>
            <FaqList faqs={page.faqs} />
          </section>
        </div>

        {studies.length > 0 && (
          <CaseStudyRail
            studies={studies}
            heading={page.caseStudyHeading ?? "Related work"}
            intro={page.caseStudyIntro ?? ""}
          />
        )}

        <ClosingCta />
      </div>
    </>
  );
}
