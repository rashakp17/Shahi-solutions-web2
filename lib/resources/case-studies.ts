/**
 * Case studies shown under resource articles.
 *
 * Duplicates a few fields from ProjectsSection instead of importing it, to
 * avoid pulling that client component and its artwork into resource routes.
 * Keep titles, categories and URLs in sync when adding a project.
 */

export type CaseStudy = {
  id: string;
  title: string;
  /** Label above the title. Same as the homepage card. */
  category: string;
  /** One sentence on what was built. */
  summary: string;
  /** Why this project is relevant to the article citing it. */
  relevance: string;
  /** Live site URL, if any. */
  href?: string;
  /** Screenshot. */
  shot?: { src: string; alt: string };
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "emarath-erp",
    title: "Emarath ERP",
    category: "Enterprise Resource Planning",
    summary:
      "Inventory, procurement, finance, HR and reporting unified into a single system, with role-based access and real-time dashboards throughout.",
    relevance:
      "The clearest example of custom software replacing a stack of disconnected tools with one system of record.",
    shot: {
      src: "/projects/emarath-erp.jpeg",
      alt: "The Emarath ERP sales dashboard: a row of lead and follow-up counters above a team activity board, with revenue and conversion totals beside a leaderboard of the sales team.",
    },
  },
  {
    id: "fleet-management",
    title: "Fleet Management",
    category: "Logistics & Vehicle Tracking",
    summary:
      "Live GPS, driver and trip logs, fuel and expense monitoring and automated service alerts for a fleet operating in real time.",
    relevance:
      "Built because no off-the-shelf product tracked this operator's vehicles, drivers and maintenance on one screen.",
    shot: {
      src: "/projects/fleet-management.jpeg",
      alt: "The Fleet Management console: a live tracking map of vehicle positions along the Kerala coast, with a searchable per-vehicle list of registrations, speeds and online status down the left.",
    },
  },
  {
    id: "fetch-kids",
    title: "Fetch Kids",
    category: "Personalised Kids' E-Commerce",
    summary:
      "A storefront where the customisation happens on the product page itself, with collections, wishlist, cart and pan-India delivery built around it.",
    relevance:
      "Product customisation that no hosted store template supports without a plugin stack that eventually becomes the constraint.",
    href: "https://www.fetchkids.in/",
    shot: {
      src: "/projects/fetch-kids.webp",
      alt: "The Fetch Kids storefront: a personalised lunchbox, bottle and name-label set above a row of delivery and quality promises.",
    },
  },
  {
    id: "mood-by-teal",
    title: "MOODbyTEAL",
    category: "Interior Design Studio",
    summary:
      "A dark, scroll-led studio site for an interiors and turnkey fit-out practice working across India and the UAE.",
    relevance:
      "Shows what a bespoke front end can do when the brand experience is the product. A template could not get here.",
    href: "https://moodbyteal.com/",
    shot: {
      src: "/projects/mood-by-teal.webp",
      alt: "The MOODbyTEAL home page: the studio's wordmark across a glass wall, with a dark fitted-out office visible through it.",
    },
  },
  {
    id: "vrs-real-invest",
    title: "VRS Real Invest",
    category: "Real Estate",
    summary:
      "Property investment opportunities, company services and consultation booking, built around turning an interested visitor into an enquiry.",
    relevance:
      "The case where a focused custom build beats a platform: one job, done without the weight of a general-purpose CMS.",
    href: "https://vrsrealinvest.com.au/",
    shot: {
      src: "/projects/vrs-real-invest.png",
      alt: "The VRS Real Invest home page: a featured luxury portfolio of properties beside an investment performance dashboard.",
    },
  },
];

const BY_ID = new Map(CASE_STUDIES.map((study) => [study.id, study]));

/** Looks up case studies by id, skipping unknown ids instead of throwing. */
export function caseStudiesByIds(ids: string[]): CaseStudy[] {
  return ids.map((id) => BY_ID.get(id)).filter((s): s is CaseStudy => !!s);
}
