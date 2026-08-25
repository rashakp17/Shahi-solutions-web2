/**
 * The work, in the reduced form a resource article needs.
 *
 * ── Why this is not imported from ProjectsSection ──
 * That component holds the same five projects, and duplicating them is a real
 * cost that was weighed rather than overlooked. Its `Project` type carries a
 * `ReactNode` of hand-drawn fallback art per project and a `TechKey[]` resolved
 * against a registry of drawn logos — several hundred lines of JSX which exist
 * to make a full-bleed deck card work, and which a link under an article has
 * no use for. Importing it would pull that whole tree into the resource routes
 * to read six strings off it, and `ProjectsSection` is a client component, so
 * it would cross the boundary as well.
 *
 * What is duplicated is six fields per project. What matters is that the two
 * cannot silently disagree about anything a reader would notice: the titles,
 * categories and live URLs are the same strings, and `relevance` — the one
 * field that is not a copy — exists only here, because "why this project is
 * under this article" is a question the homepage deck never asks.
 *
 * If a sixth project lands, it goes in both. If that stops being tolerable,
 * the move is to lift the six shared fields into one module and have
 * ProjectsSection attach its art to them by id — not to import the deck here.
 */

export type CaseStudy = {
  id: string;
  title: string;
  /** The label above the title, in caps. Same string the deck card uses. */
  category: string;
  /**
   * One sentence on what was built. Shorter than the deck's copy, because
   * this appears three-across under an article rather than as the subject of
   * a full-width card.
   */
  summary: string;
  /**
   * Why an article is pointing at it. Written per project rather than per
   * article — a project is relevant for the same reason wherever it is cited,
   * and writing it once means the reason cannot be contradicted by the next
   * article to cite it.
   */
  relevance: string;
  /** The live site, where there is one. */
  href?: string;
  /** A capture of the real thing, once the file exists. See `shot` below. */
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
      src: "/projects/emarath-erp.png",
      alt: "The Emarath ERP dashboard: revenue and expense totals across the top, a trend chart, and a task summary beside a list of recent entries.",
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
      src: "/projects/fleet-management.png",
      alt: "The Fleet Management console: a live map of vehicle positions across a coastline, with a per-vehicle status list down the left.",
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
      "What a bespoke front end buys when the brand experience is the product — nothing on a template gets here.",
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
    shot: {
      src: "/projects/vrs-real-invest.png",
      alt: "The VRS Real Invest home page: a featured luxury portfolio of properties beside an investment performance dashboard.",
    },
  },
];

const BY_ID = new Map(CASE_STUDIES.map((study) => [study.id, study]));

/**
 * Resolve a list of ids, skipping anything unknown.
 *
 * Silently rather than throwing: an article naming a project that has since
 * been renamed should lose one card under it, not take the whole route down
 * with a build error. The ids are ours and typos are caught the first time
 * the page is opened.
 */
export function caseStudiesByIds(ids: string[]): CaseStudy[] {
  return ids.map((id) => BY_ID.get(id)).filter((s): s is CaseStudy => !!s);
}
