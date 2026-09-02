import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    /* AVIF first, WebP behind it.
     *
     * The default is WebP alone. Every image on this page is either a
     * photograph (the three portraits, the two site captures) or flat
     * artwork with an alpha channel (the wordmark) — both of which AVIF
     * carries 20–30% smaller than WebP at the same visual quality, and the
     * browsers that cannot decode it simply take the WebP behind it from
     * the same `Accept` negotiation.
     *
     * The cost is encode time on the first request for each size, which is
     * paid once per size per deploy and then cached. Worth it here because
     * the set of images is small and fixed. */
    formats: ["image/avif", "image/webp"],

    /* A year, up from the 60s default. The filenames are stable and content
     * is only replaced by a deploy, so re-optimising on a cache miss every
     * minute is work with nothing to show for it. */
    minimumCacheTTL: 31536000,
  },

  /* Cache headers for the static files in /public.
   *
   * Worth knowing, because it is not what most people assume: the long
   * immutable caching Next is known for applies to /_next/static, whose
   * filenames carry a content hash. Everything in /public is served by
   * Vercel with `public, max-age=0, must-revalidate` — revalidated on every
   * single visit. For this site that is the project captures and the team
   * portraits, which is most of the page's weight, and it is the whole of
   * Lighthouse's "serve static assets with an efficient cache policy".
   *
   * Not `immutable`, and that is deliberate. These filenames are stable —
   * /projects/vrs-real-invest.mp4 stays that name when the recording behind
   * it is replaced — so an immutable year would leave every returning
   * visitor on the old file until their cache expired, with no way to push a
   * correction. `stale-while-revalidate` gives the same instant response
   * from cache and refreshes it in the background, so a replaced asset
   * reaches everyone on their second visit after a deploy rather than never.
   *
   * If a file ever does need to change *now*, rename it — that is what the
   * hash on /_next/static is doing, by hand. */
  async headers() {
    return [
      {
        source: "/:dir(projects|team|brand)/:file*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=31536000",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
