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
};

export default nextConfig;
