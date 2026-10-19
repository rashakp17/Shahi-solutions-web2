import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/resources";
import { SERVICE_PAGES } from "@/lib/service-pages";
import { SITE_URL } from "@/lib/site";

/**
 * Sitemap. Articles come from the resource registry. Google mostly ignores
 * `priority` and `changeFrequency`; `lastModified` uses each article's
 * `updated` date.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = ARTICLES.map((article) => ({
    url: `${SITE_URL}/resources/${article.slug}`,
    lastModified: new Date(article.updated),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  /* Newest article date, used for the other pages instead of the build time. */
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
    ...SERVICE_PAGES.map((page) => ({
      url: `${SITE_URL}/services/${page.slug}`,
      lastModified: new Date(latest),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/resources`,
      lastModified: new Date(latest),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...articles,
  ];
}
