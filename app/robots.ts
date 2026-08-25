import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt.
 *
 * Everything is allowed, because everything here is meant to be found. There
 * is no admin area, no staging path and no gated content on this site, so a
 * `Disallow` list would be a list of nothing — and the one thing that must not
 * happen is a stray rule blocking `/resources`, which is the section the whole
 * exercise exists to get indexed.
 *
 * The `Sitemap` line is the part that earns its keep. It is how a crawler that
 * arrives at the origin without a referring link finds the article set at all,
 * and it costs one line.
 *
 * ── If a staging environment ever needs blocking ──
 * Do it here, keyed off the origin, rather than by uploading a different file:
 *
 *   const isProduction = SITE_URL === "https://www.shahisolutions.com";
 *   rules: isProduction ? { userAgent: "*", allow: "/" }
 *                       : { userAgent: "*", disallow: "/" },
 *
 * Written out rather than implemented, because guessing the production origin
 * here and getting it wrong would de-index the live site — and that is a
 * failure nobody notices for six weeks.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    /* No `host`.
     *
     * It was set to SITE_URL and emitted `Host: https://www.shahisolutions.com`,
     * which is malformed twice over: the directive is a Yandex extension that
     * no other crawler reads, and it expects a bare hostname with no scheme.
     * A directive that only one crawler understands, given in a form that
     * crawler rejects, is worth strictly less than nothing — the canonical
     * tags already say which host is authoritative, to everybody. */
  };
}
