/**
 * Generates the brand assets the site was missing: the favicon, the Apple
 * touch icon, and the Open Graph card.
 *
 *   node scripts/generate-brand-assets.mjs
 *
 * Run it, commit what it writes, and forget about it until the logo or the
 * positioning line changes.
 *
 * ── Why a script that commits PNGs, rather than generating them at build ──
 * Next.js can build both of these at request or build time from an
 * `app/icon.tsx` / `app/opengraph-image.tsx` using `ImageResponse`. That is the
 * more fashionable answer and it is the wrong one here, for one reason: text.
 * `ImageResponse` renders through satori, which needs a font file handed to it
 * — it cannot reach the Inter that `next/font` fetches, and it will not read
 * WOFF2, which is the only format that arrives in the build. The choice would
 * be to commit a TTF of Inter purely to render one line on a social card, or to
 * let the card fall back to a default face that is not the brand's.
 *
 * Generating them once here sidesteps all of it. The output is deterministic,
 * it costs the build nothing, and the assets are ordinary static files that
 * Next serves and tags automatically by filename convention:
 *
 *   app/icon.png             → <link rel="icon">
 *   app/apple-icon.png       → <link rel="apple-touch-icon">
 *   app/opengraph-image.png  → og:image and twitter:image, on every route
 *
 * ── Everything here comes from artwork that already exists ──
 * Nothing is invented. The icon is the two-tone "A" cropped out of the real
 * wordmark — the brand's own mark, and the one glyph in the lockup distinctive
 * enough to read at 16 pixels, which "S" or a full wordmark squeezed into a
 * square are not. The card uses the dark-ground variant of the same wordmark
 * on the site's own ground colour, lit by the same low blue wash the sections
 * use, so a link preview looks like the page it opens.
 */

import sharp from "sharp";
import { mkdir } from "node:fs/promises";

/** Tokens, copied from the `[data-theme="dark"]` block in app/globals.css. */
const GROUND = "#04050a";
const GROUND_4 = "#12141f";
const ACCENT_600 = "#2f63d6";

/**
 * The "A" inside public/brand/shahi-logo.png, measured rather than eyeballed.
 *
 * Found by scanning the alpha channel for columns of ink: the top band of the
 * lockup breaks into five runs — S, H, A, H, I — and the third is this. Recorded
 * as numbers so the crop is reproducible, but if the logo file is ever replaced
 * these must be re-measured; the scan that produced them is in this file's
 * history and takes about fifteen lines.
 */
const A_MARK = { left: 1057, top: 29, width: 413, height: 452 };

const LOGO_LIGHT = "public/brand/shahi-logo.png";
const LOGO_DARK = "public/brand/shahi-logo-dark.png";

/**
 * One line of positioning, under the wordmark on the card.
 *
 * The three services a search for this company is most likely to be about,
 * separated by middots. Not a keyword list — a social card is read by people,
 * and `og:image` is not indexed as text by anything. It is here because a card
 * carrying only a logo tells somebody scrolling past nothing at all.
 */
const CARD_LINE = "CUSTOM SOFTWARE · WEB & MOBILE APPS · ERP PLATFORMS";

/**
 * The mark on a white tile.
 *
 * White rather than transparent, and rather than the brand navy. A favicon is
 * composited onto browser chrome this file cannot see: the mark is dark navy,
 * so on a dark tab strip a transparent ground would leave it nearly invisible,
 * and a navy ground would leave the tile invisible instead. A white tile has
 * contrast against both, which is why almost every dark-mark brand ships one.
 *
 * The mark is inset to 68% of the tile. Its own bounding box is tight to the
 * ink, and artwork run to the edge of a favicon reads as clipped.
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
 * The Open Graph card, 1200x630 — the size every platform crops from.
 *
 * Built as an SVG ground with the wordmark composited over it, rather than as
 * one SVG with the logo inlined: embedding an 86KB PNG as a base64 data URI
 * inside an SVG string works, and makes the source of this file unreadable for
 * no gain.
 *
 * The composition is the site's, at a glance: near-black ground lifting to
 * --ground-4 in the middle, one wide blue wash low and off-centre, a vignette
 * at the edges. Anyone who clicks through should recognise where they landed.
 */
async function ogCard(out) {
  const W = 1200;
  const H = 630;

  const markW = 620;
  const markH = Math.round((markW * 773) / 2201);

  /* The wordmark and the line beneath it, centred as one group rather than
     each centred on its own — otherwise the pair sits low, because the line
     has descenders and the mark does not. */
  const gap = 58;
  const lineHeight = 24;
  /* Nudged down from true centre. Optical centring, not arithmetic: the
     wordmark's own artwork carries more clear space below the baseline of
     "Solutions" than above the cap height of "SHAHI", so a mathematically
     centred group reads as sitting high. */
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

/* 512 for the favicon: one file, downscaled by the browser to whatever the tab
   strip, the bookmark bar and the history entry each want. Shipping a 32px
   original instead would be sharper in a tab and unusable everywhere else. */
await icon(512, "app/icon.png");
/* 180 is the size iOS asks for, and it is not resized on the device. */
await icon(180, "app/apple-icon.png");
await ogCard("app/opengraph-image.png");
