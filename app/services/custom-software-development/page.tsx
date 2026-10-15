import type { Metadata } from "next";
import Link from "next/link";

import { CaseStudyRail } from "@/components/resources/CaseStudyRail";
import { ClosingCta } from "@/components/resources/ClosingCta";
import { FaqList } from "@/components/resources/FaqList";
import { articlesInCluster } from "@/lib/resources";
import { caseStudiesByIds } from "@/lib/resources/case-studies";
import { SITE_NAME, absolute, organizationNode, socialMetadata } from "@/lib/site";
import type { Faq } from "@/lib/resources/types";
import { PageTransition } from "@/components/site/PageTransition";

export const metadata: Metadata = {
  title: "Custom Software Development Services",
  description:
    "Custom software development for businesses that have outgrown their tools — ERP and CRM platforms, operations systems, integrations and customer-facing products, built to be owned.",
  alternates: { canonical: "/services/custom-software-development" },
  ...socialMetadata({
    title: "Custom Software Development Services | Shahi Solutions",
    description:
      "ERP and CRM platforms, operations systems, integrations and customer-facing products — designed around how your business already works.",
    path: "/services/custom-software-development",
  }),
};

/**
 * What we build, in the five shapes the resource cluster uses.
 *
 * The categories are the same ones, in the same order, with the same names.
 * That is not a shortcut — it is what makes the article and this page read as
 * one argument rather than as marketing and content written by different
 * people. A reader who arrives here from
 * /resources/custom-software-development-examples should recognise the ground.
 */
const CAPABILITIES = [
  {
    title: "Systems of record",
    body: "ERP and CRM platforms, inventory and case management. One authoritative version of a stock level, a customer or a job, with every screen reading from it.",
    detail: "Where reconciliation meetings stop being necessary.",
  },
  {
    title: "Operations tools",
    body: "Dispatch consoles, scheduling boards, approval queues and offline-capable field apps, designed around the person doing the work rather than the data model beneath it.",
    detail: "Judged in seconds saved per task, not in features.",
  },
  {
    title: "Integration & automation",
    body: "Layers that make existing systems agree — a canonical mapping, a scheduled sync and an exception queue — plus document generation and reporting driven from live records.",
    detail: "Usually the smallest project with the clearest return.",
  },
  {
    title: "Customer-facing products",
    body: "Storefronts with real product customisation, booking platforms and customer portals, built to the standard the market sets rather than the one staff will tolerate.",
    detail: "Where the software is the thing being sold.",
  },
  {
    title: "Data & reporting",
    body: "Migration from whatever the operation runs on today, and the reporting layer that makes the new system answer questions the old one could not.",
    detail: "Rehearsed against production data before launch day.",
  },
];

/**
 * How we work — the process, compressed to what a buyer needs on this page.
 *
 * The full version is the process article, and this deliberately does not try
 * to be it. Five lines and a link is the right amount of process on a service
 * page; the reader who wants the failure modes of each phase is one click from
 * two thousand words about them.
 */
const PHASES = [
  {
    name: "Discovery",
    body: "We sit with the people doing the work, not only the people commissioning the system, and leave with a written scope, a prioritised backlog and a fixed price.",
  },
  {
    name: "Design",
    body: "The data model first, because it is the decision that is cheapest now and most expensive later. Interface designs at real fidelity alongside it, responsive from the outset.",
  },
  {
    name: "Build",
    body: "One- to two-week increments, each ending with working software on a staging URL you can open. Not a percentage-complete report.",
  },
  {
    name: "Testing",
    body: "Automated tests on anything touching money or permissions, acceptance against the scope, and the people from discovery using it unassisted.",
  },
  {
    name: "Launch & handover",
    body: "A rehearsed migration, monitoring live before launch, and every account — repository, hosting, domains — in your name from day one.",
  },
];

const FAQS: Faq[] = [
  {
    q: "What kinds of custom software do you build?",
    a: "Systems of record such as ERP and CRM platforms, internal operations and field tools, integration and automation layers between systems you already own, and customer-facing products such as storefronts and portals.",
  },
  {
    q: "How do projects start?",
    a: "With a discovery engagement — typically two to four weeks — that produces a written scope, a prioritised backlog and a fixed price. You can commission discovery on its own and take the specification anywhere, including to another supplier.",
  },
  {
    q: "How much does a project cost?",
    a: "A focused automation or integration runs from around $4,000 to $18,000, an internal operations tool from $12,000 to $40,000, and a full platform from $40,000 upward. The number is driven more by the count of distinct user roles than by the count of screens.",
  },
  {
    q: "Who owns the code and the infrastructure?",
    a: "You do, from day one. The repository, the hosting accounts, the domains and the data all sit in your organisation's name, and it is written into the agreement before the build starts.",
  },
  {
    q: "Will you tell me if I should buy something instead?",
    a: "Yes. If a subscription product does what you need, that is the recommendation you will get. It is a short conversation and it saves everyone a year.",
  },
  {
    q: "What happens after launch?",
    a: "A support window, then an ongoing maintenance arrangement covering security and dependency updates, monitoring and fixes — typically 15 to 20 percent of the build cost per year. Enhancement work is quoted separately and is your call each year.",
  },
];

export default function CustomSoftwareDevelopmentPage() {
  const studies = caseStudiesByIds([
    "emarath-erp",
    "fleet-management",
    "fetch-kids",
  ]);

  const guides = articlesInCluster("custom-software-development");
  const path = "/services/custom-software-development";

  /**
   * `Service` plus the breadcrumb.
   *
   * The FAQ on this page is deliberately *not* published as `FAQPage`. Google
   * narrowed that rich result to authoritative government and health sources
   * in 2023, so on a commercial service page it earns nothing — and marking up
   * a sales FAQ as though it were reference material is the kind of technically
   * valid, practically dishonest signal this section is built to avoid. The
   * questions are on the page because buyers ask them; that is reason enough.
   * The articles keep their `FAQPage` because they are genuinely informational.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      /* The full organisation, referenced by `@id` from the Service below —
         same reasoning as on the articles: one description of the company,
         emitted wherever it is needed, rather than a thinner inline copy per
         page that quietly disagrees with the canonical one. */
      organizationNode(),
      {
        "@type": "Service",
        "@id": `${absolute(path)}#service`,
        name: "Custom Software Development",
        serviceType: "Custom software development",
        description:
          "Custom software development for businesses that have outgrown their tools — ERP and CRM platforms, operations systems, integrations and customer-facing products.",
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
            name: "Custom Software Development",
            item: absolute(path),
          },
        ],
      },
    ],
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
          <nav aria-label="Breadcrumb" className="rs-crumbs">
            <ol>
              <li>
                <Link href="/#platform">Services</Link>
              </li>
            </ol>
          </nav>

          <h1 className="rs-h1 rs-h1--index">
            Custom Software Development
            <span className="rs-h1-quiet"> built around your operation.</span>
          </h1>

          <p className="rs-lead">
            We build software for businesses that have outgrown their tools —
            platforms, operations systems and integrations designed around how
            the work already happens, rather than products the work has to be
            bent to fit. Everything we build, you own.
          </p>

          <div className="rs-cta-actions rs-hero-actions">
            <Link href="/#contact" className="rs-cta-primary">
              Start a conversation
              <span aria-hidden="true" className="rs-cta-arrow">
                →
              </span>
            </Link>
            <Link
              href="/resources/custom-software-development-cost"
              className="rs-cta-secondary"
            >
              See what it costs
            </Link>
          </div>
        </header>

        <div className="rs-prose rs-prose--service">
          <section id="what-we-build" className="rs-section">
            <h2 className="rs-h2">What we build</h2>
            <p className="rs-p">
              Five shapes cover almost everything a business commissions.
              Knowing which one you are looking at is most of the estimating
              work, because each has a very different centre of gravity — and
              it is the first thing discovery establishes.
            </p>

            <ol className="rs-examples">
              {CAPABILITIES.map((item) => (
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
            <p className="rs-p">
              Five phases, and the build is under half of it. The phases either
              side are where projects are won or lost: discovery decides whether
              the right thing gets built, and handover decides whether it
              survives us.
            </p>

            <ol className="rs-phases">
              {PHASES.map((phase, i) => (
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

            <aside className="rs-bridge">
              <p className="rs-bridge-prompt">
                Each phase, with what it produces and the specific way it fails
                when it is rushed.
              </p>
              <Link
                href="/resources/custom-software-development-process"
                className="rs-bridge-link"
              >
                Read the full process
                <span aria-hidden="true" className="rs-bridge-arrow">
                  →
                </span>
              </Link>
            </aside>
          </section>

          <section id="what-you-own" className="rs-section">
            <h2 className="rs-h2">What you own</h2>
            <p className="rs-p">
              This is written into the agreement before the first line of code,
              and it is the part of an engagement that decides whether the
              project produced an asset or a liability.
            </p>
            <ul className="rs-list">
              <li className="rs-list-item">
                <span className="rs-list-text">
                  <strong className="rs-strong">The source code</strong>, in a
                  repository your organisation owns, with its full history.
                </span>
              </li>
              <li className="rs-list-item">
                <span className="rs-list-text">
                  <strong className="rs-strong">The infrastructure</strong>, in
                  accounts held in your name — not in ours with a bill forwarded
                  on.
                </span>
              </li>
              <li className="rs-list-item">
                <span className="rs-list-text">
                  <strong className="rs-strong">The data</strong>, in a
                  documented schema, in a database you can back up and export
                  without asking.
                </span>
              </li>
              <li className="rs-list-item">
                <span className="rs-list-text">
                  <strong className="rs-strong">
                    The ability to hand it to someone else.
                  </strong>{" "}
                  A developer who has never met us should be able to run the
                  project locally from the README and ship a change in a day.
                </span>
              </li>
            </ul>
          </section>

          <section id="faq" className="rs-section">
            <h2 className="rs-h2">Frequently asked questions</h2>
            <FaqList faqs={FAQS} />
          </section>
        </div>

        <CaseStudyRail
          studies={studies}
          heading="Custom software we have built"
          intro="Three builds from the portfolio, each commissioned because nothing on the market did the job — with what was made and why."
        />

        {/* The funnel, running the other way.

            A visitor who arrived here from an article has already read one of
            these; a visitor who arrived from the home page has read none, and
            these are the pages that answer the questions a service page cannot
            without becoming an essay. Linking back into the cluster is what
            makes the section a loop rather than a one-way ramp. */}
        <section className="rs-related" aria-labelledby="svc-guides-head">
          <p className="rs-eyebrow">Before you commission anything</p>
          <h2 id="svc-guides-head" className="rs-h2">
            Guides to custom software development
          </h2>

          <ol className="rs-related-list">
            {guides.map((article, i) => (
              <li key={article.slug} className="rs-related-item">
                <Link
                  href={`/resources/${article.slug}`}
                  className="rs-related-link"
                >
                  <span className="rs-related-index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="rs-related-body">
                    <span className="rs-related-title">{article.title}</span>
                    <span className="rs-related-desc">
                      {article.description}
                    </span>
                  </span>
                  <span className="rs-related-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <ClosingCta
          serviceHref="/resources/what-is-custom-software-development"
          serviceLabel="Start with the guide instead"
        />
      </div>
    </PageTransition>
  );
}
