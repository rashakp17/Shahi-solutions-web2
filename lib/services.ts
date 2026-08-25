/**
 * What the company does, in one place.
 *
 * These eight strings were living inside ServicesSection, next to the drawn
 * icon for each card, which was the right home while the grid was the only
 * thing that needed them. Three things need them now:
 *
 *   The grid itself, on the home page.
 *   The `hasOfferCatalog` in the organisation's structured data, which is how
 *   a search engine — and increasingly an answer engine being asked "what
 *   does Shahi Solutions do" — gets a list rather than a paragraph to guess
 *   from.
 *   The `href`, which decides whether a card is a link.
 *
 * Splitting the copy out and leaving the artwork behind is deliberate: the
 * icons are eight blocks of JSX that only the grid can use, and pulling them
 * into a data module would drag a React dependency into something the sitemap
 * and the JSON-LD read. The `id` union below is what keeps the two halves
 * honest — ServicesSection's icon map is typed against it, so adding a service
 * here without drawing its mark is a build error rather than a hole in the
 * grid.
 */

export type ServiceId =
  | "website-development"
  | "custom-software-development"
  | "mobile-app-development"
  | "ui-ux-design"
  | "erp-crm"
  | "digital-marketing"
  | "sales-solutions"
  | "business-automation";

export type Service = {
  id: ServiceId;
  /** The card's h3, and the name published in the offer catalogue. */
  title: string;
  body: string;
  /**
   * A page of its own, where one exists.
   *
   * Only custom software development has one today, and that is not an
   * oversight — see the note in app/services/layout.tsx. The presence of an
   * href is what turns a card into a link: with one, the card's title becomes
   * a real anchor pointing at the page, which is how the service page is
   * reachable from the home page at all. Without one the card stays exactly
   * as it was, because a link to nowhere is worse than no link.
   */
  href?: string;
};

export const SERVICES: Service[] = [
  {
    id: "website-development",
    title: "Website Development",
    body: "Ultra-fast, responsive websites built with Next.js, React, and modern SEO architectures to maximise organic reach.",
  },
  {
    id: "custom-software-development",
    title: "Custom Software Development",
    body: "Tailored backend ecosystems, APIs, and cloud infrastructure engineered for complex business workloads.",
    href: "/services/custom-software-development",
  },
  {
    id: "mobile-app-development",
    title: "Mobile App Development",
    body: "High-performance cross-platform iOS and Android applications utilising React Native and Flutter.",
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    body: "Visually stunning, accessible, and user-centric wireframes and layouts that boost engagement and brand trust.",
  },
  {
    id: "erp-crm",
    title: "ERP & CRM Solutions",
    body: "Streamlined operational platforms that unify finance, inventory, and customer records into one system of record.",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    body: "Data-driven growth strategies, performance campaigns, and content built to compound rather than spike.",
  },
  {
    id: "sales-solutions",
    title: "Sales Solutions",
    body: "Innovative digital funnels and pipeline tooling that turn early interest into predictable revenue.",
  },
  {
    id: "business-automation",
    title: "Business Automation",
    body: "Robust workflow scripting and integrations that take the repetitive work out of daily operations.",
  },
];
