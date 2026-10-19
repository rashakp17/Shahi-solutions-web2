import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt. Everything is allowed; nothing on the site needs blocking.
 *
 * To block a staging environment, key it off the origin:
 *
 *   const isProduction = SITE_URL === "https://www.shahisolutions.com";
 *   rules: isProduction ? { userAgent: "*", allow: "/" }
 *                       : { userAgent: "*", disallow: "/" },
 *
 * Not enabled: a wrong production origin here would de-index the live site.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    /* No `host`: it's Yandex-only and expects a bare hostname. Canonicals
       already cover this. */
  };
}
