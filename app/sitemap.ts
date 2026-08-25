import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/resources";
import { SITE_URL } from "@/lib/site";

/**
 * The sitemap, generated from the routes that exist rather than maintained.
 *
 * The article entries come from the same registry the pages are rendered from,
 * so an article cannot exist without being listed and cannot be listed without
 * existing. A hand-written sitemap.xml is right on the day it is committed and
 * quietly wrong from the next article onward — and a sitemap pointing at a 404
 * is worse than no sitemap, because it is a signal a crawler acts on.
 *
 * ── On the numbers ──
 * `priority` is relative *within this site* and nothing more; it does not
 * compete with anybody else's. Google has said for years that it largely
 * ignores both this and `changeFrequency`. They are set anyway because other
 * crawlers do read them and the cost is nothing — but they are not worth
 * tuning, and nobody should read the 0.7 below as a lever.
 *
 * `lastModified` is the one field that genuinely matters, and it is the one
 * field here with a real source: each article's own `updated` date, which is
 * also what the page displays and what its structured data publishes. Three
 * places, one fact.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = ARTICLES.map((article) => ({
    url: `${SITE_URL}/resources/${article.slug}`,
    lastModified: new Date(article.updated),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  /**
   * The newest article date, standing in for the index's own.
   *
   * `new Date()` would be a lie that changes on every build: the index has not
   * been modified, a page it links to has. Deriving it means the date only
   * moves when something on the page actually did.
   */
  const latest = ARTICLES.reduce(
    (newest, article) =>
      article.updated > newest ? article.updated : newest,
    ARTICLES[0]?.updated ?? "2026-08-24",
  );

  return [
    {
      url: SITE_URL,
      lastModified: new Date(latest),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/services/custom-software-development`,
      lastModified: new Date(latest),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/resources`,
      lastModified: new Date(latest),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...articles,
  ];
}
