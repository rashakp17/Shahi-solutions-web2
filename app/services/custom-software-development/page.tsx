import type { Metadata } from "next";
import Link from "next/link";

import { CaseStudyRail } from "@/components/resources/CaseStudyRail";
import { ClosingCta } from "@/components/resources/ClosingCta";
import { FaqList } from "@/components/resources/FaqList";
import { articlesInCluster } from "@/lib/resources";
import { caseStudiesByIds } from "@/lib/resources/case-studies";
import { SITE_NAME, absolute, organizationNode, socialMetadata } from "@/lib/site";
import type { Faq } from "@/lib/resources/types";

export const metadata: Metadata = {
  title: "Custom Software Development Services",
  description:
    "Custom software development for businesses that have outgrown their tools: ERP and CRM platforms, operations systems, integrations and customer-facing products that you own.",
  alternates: { canonical: "/services/custom-software-development" },
  ...socialMetadata({
    title: "Custom Software Development Services | Shahi Solutions",
    description:
      "ERP and CRM platforms, operations systems, integrations and customer-facing products, designed around how your business already works.",
    path: "/services/custom-software-development",
  }),
};

/**
 * Same categories, order and names as the custom-software-development-examples
 * article. Keep them in sync.
 */
const CAPABILITIES = [
  {
    title: "Systems of record",
    body: "ERP and CRM platforms, inventory and case management. One authoritative version of a stock level, a customer or a job, with every screen reading from it.",
    detail: "No more meetings to work out whose numbers are right.",
  },
  {
    title: "Operations tools",
    body: "Dispatch consoles, scheduling boards, approval queues and offline-capable field apps, designed around the person doing the work rather than the data model beneath it.",
    detail: "Measured by the time they save on each task.",
  },
  {
    title: "Integration & automation",
    body: "Connections that keep your existing systems in step (shared data mapping, scheduled syncs and an exception queue), plus document generation and reporting from live records.",
    detail: "Usually the smallest project with the clearest return.",
  },
  {
    title: "Customer-facing products",
    body: "Storefronts with real product customisation, booking platforms and customer portals, built to the standard your customers expect.",
    detail: "Here the software is part of what you sell.",
  },
  {
    title: "Data & reporting",
    body: "Migration from whatever the operation runs on today, and the reporting layer that makes the new system answer questions the old one could not.",
    detail: "Tested against real data before launch day.",
  },
];

/** Short summary of the process; the full version is the process article. */
const PHASES = [
  {
    name: "Discovery",
    body: "We sit with the people doing the work, not only the people commissioning the system, and leave with a written scope, a prioritised backlog and a fixed price.",
  },
  {
    name: "Design",
    body: "We start with the data model, because it is cheap to change now and expensive to change later. Detailed, responsive interface designs are made alongside it.",
  },
  {
    name: "Build",
    body: "One- to two-week cycles, each ending with working software on a staging link you can open and try, instead of a progress report.",
  },
  {
    name: "Testing",
    body: "Automated tests on anything touching money or permissions, acceptance against the scope, and the people from discovery using it unassisted.",
  },
  {
    name: "Launch & handover",
    body: "A rehearsed data migration, monitoring in place before go-live, and every account (repository, hosting, domains) in your name from day one.",
  },
];

const FAQS: Faq[] = [
  {
    q: "What kinds of custom software do you build?",
    a: "Systems of record such as ERP and CRM platforms, internal operations and field tools, integration and automation layers between systems you already own, and customer-facing products such as storefronts and portals.",
  },
  {
    q: "How do projects start?",
    a: "With a discovery phase, usually two to four weeks, that produces a written scope, a prioritised backlog and a fixed price. You can commission discovery on its own and take the specification anywhere, including to another supplier.",
  },
  {
    q: "How much does a project cost?",
    a: "It depends on the type of project, from a focused automation at the small end to a full platform at the large end. The number is driven more by the count of distinct user roles than by the count of screens. Discovery gives you a fixed price before the build starts.",
  },
  {
    q: "Who owns the code and the infrastructure?",
    a: "You do, from day one. The repository, the hosting accounts, the domains and the data all sit in your organisation's name, and it is written into the agreement before the build starts.",
  },
  {
    q: "Will you tell me if I should buy something instead?",
    a: "Yes. If a subscription product does what you need, that is the recommendation you will get. It is a short conversation, and it can save you a year.",
  },
  {
    q: "What happens after launch?",
    a: "A support window, then an ongoing maintenance arrangement covering security and dependency updates, monitoring and fixes, typically 15 to 20 percent of the build cost per year. Enhancement work is quoted separately and is your call each year.",
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
   * Service and BreadcrumbList JSON-LD. No `FAQPage` here: Google limits that
   * rich result to government and health sites, so it doesn't apply to a
   * commercial page.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      /* Full org node, referenced by `@id` from the Service. */
      organizationNode(),
      {
        "@type": "Service",
        "@id": `${absolute(path)}#service`,
        name: "Custom Software Development",
        serviceType: "Custom software development",
        description:
          "Custom software development for businesses that have outgrown their tools: ERP and CRM platforms, operations systems, integrations and customer-facing products.",
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
            Custom Software Development
            <span className="rs-h1-quiet"> built around your operation.</span>
          </h1>

          <p className="rs-lead">
            We build software for businesses that have outgrown their tools:
            platforms, operations systems and integrations designed around how
            your team already works, instead of products your work has to bend
            to fit. You own everything we build.
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
              What drives the cost
            </Link>
          </div>
        </header>

        <div className="rs-prose rs-prose--service">
          <section id="what-we-build" className="rs-section">
            <h2 className="rs-h2">What we build</h2>
            <p className="rs-p">
              Almost every project we take on falls into one of five types.
              Working out which one you need is most of the estimating work, so
              it is the first thing we settle in discovery.
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
              There are five phases, and the build itself is less than half the
              work. Discovery makes sure the right thing gets built, and handover
              makes sure you can run it without us.
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
                What each phase produces, and what goes wrong when it is
                rushed.
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
              Ownership is written into the agreement before any code is
              written. It is what makes the finished system an asset you
              control.
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
                  accounts held in your name, not ours.
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
          intro="Three projects from our portfolio, each built because nothing on the market did the job."
        />

        {/* Links back to the cluster's articles. */}
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
    </>
  );
}
