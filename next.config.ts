import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    /* AVIF is smaller; browsers without it fall back to WebP. */
    formats: ["image/avif", "image/webp"],

    /* One year (default 60s). Images only change on deploy. */
    minimumCacheTTL: 31536000,
  },

  /* /public files are served with max-age=0 by default, unlike hashed
   * /_next/static assets. Not `immutable` because these filenames are reused
   * when the file is replaced; stale-while-revalidate picks up changes in the
   * background. Rename a file if it must update immediately. */
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
