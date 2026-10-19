/**
 * Generates the favicon, Apple touch icon and Open Graph card from the logo.
 *
 *   node scripts/generate-brand-assets.mjs
 *
 * Commit the output; re-run when the logo or card line changes. Not done at
 * build time with ImageResponse because satori can't use the next/font Inter
 * (WOFF2 only), so we'd have to commit a TTF.
 *
 * Next picks these up by filename:
 *
 *   app/icon.png             → <link rel="icon">
 *   app/apple-icon.png       → <link rel="apple-touch-icon">
 *   app/opengraph-image.png  → og:image and twitter:image, on every route
 *
 * The icon is the "A" cropped from the wordmark; the card uses the dark logo
 * on the site's dark background.
 */

import sharp from "sharp";
import { mkdir } from "node:fs/promises";

/** Copied from the `[data-theme="dark"]` block in app/globals.css. */
const GROUND = "#04050a";
const GROUND_4 = "#12141f";
const ACCENT_600 = "#2f63d6";

/**
 * Crop box for the "A" in public/brand/shahi-logo.png, measured from the
 * alpha channel. Re-measure if the logo file changes.
 */
const A_MARK = { left: 1057, top: 29, width: 413, height: 452 };

const LOGO_LIGHT = "public/brand/shahi-logo.png";
const LOGO_DARK = "public/brand/shahi-logo-dark.png";

/** Tagline under the wordmark on the OG card. */
const CARD_LINE = "CUSTOM SOFTWARE · WEB & MOBILE APPS · ERP PLATFORMS";

/**
 * The mark on a white tile, so the dark navy mark stays visible on dark tab
 * bars. Inset to 68% so it doesn't look clipped.
 */
async function icon(size, out) {
  const inner = Math.round(size * 0.68);

  const mark = await sharp(LOGO_LIGHT)
    .extract(A_MARK)
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toFile(out);

  console.log(`wrote ${out} (${size}x${size})`);
}

/**
 * The 1200x630 Open Graph card: an SVG background with the wordmark
 * composited on top (rather than inlining the PNG as base64).
 */
async function ogCard(out) {
  const W = 1200;
  const H = 630;

  const markW = 620;
  const markH = Math.round((markW * 773) / 2201);

  /* Wordmark and tagline are centred as one group. */
  const gap = 58;
  const lineHeight = 24;
  /* +18 for optical centring; the logo has extra space below. */
  const groupTop = Math.round((H - (markH + gap + lineHeight)) / 2) + 18;
  const lineBaseline = groupTop + markH + gap + lineHeight;

  const ground = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="lift" cx="50%" cy="58%" r="78%">
      <stop offset="0%" stop-color="${GROUND_4}"/>
      <stop offset="52%" stop-color="${GROUND}"/>
      <stop offset="100%" stop-color="${GROUND}"/>
    </radialGradient>
    <!-- Weaker and pushed further off the bottom edge than the first pass.
         At 0.30 peak with its centre inside the frame, the falloff crossed
         the lower third as a visible horizontal band — a gradient reads as a
         band exactly when you can see both of its ends. Sinking the centre
         below the canvas means only the outer, flattest part of the falloff
         is ever in shot, which is what makes it read as light rather than as
         a shape. -->
    <radialGradient id="wash" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${ACCENT_600}" stop-opacity="0.22"/>
      <stop offset="58%" stop-color="${ACCENT_600}" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="${ACCENT_600}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="52%" r="66%">
      <stop offset="40%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.55"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#lift)"/>
  <ellipse cx="${W / 2}" cy="${H * 1.12}" rx="${W * 0.72}" ry="${H * 0.72}" fill="url(#wash)"/>
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>

  <text x="${W / 2}" y="${lineBaseline}" text-anchor="middle"
        font-family="Segoe UI, Inter, Helvetica Neue, Arial, sans-serif"
        font-size="21" letter-spacing="3.6"
        fill="#ffffff" fill-opacity="0.55">${CARD_LINE.replace(/&/g, "&amp;")}</text>

  <rect x="0" y="${H - 5}" width="${W}" height="5" fill="${ACCENT_600}" fill-opacity="0.85"/>
</svg>`);

  const wordmark = await sharp(LOGO_DARK).resize(markW, markH).toBuffer();

  await sharp(ground)
    .composite([{ input: wordmark, top: groupTop, left: Math.round((W - markW) / 2) }])
    .png()
    .toFile(out);

  console.log(`wrote ${out} (${W}x${H})`);
}

await mkdir("app", { recursive: true });

/* 512px so browsers can downscale it for every context. */
await icon(512, "app/icon.png");
/* 180px is the iOS touch icon size. */
await icon(180, "app/apple-icon.png");
await ogCard("app/opengraph-image.png");
