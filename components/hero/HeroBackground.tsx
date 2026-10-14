import type { CSSProperties } from "react";
import { BackgroundGlyphs } from "./BackgroundGlyphs";
import { ParticleField } from "./ParticleField";
import { TechnicalLinesLayer } from "./TechnicalLines";

/**
 * Ambient lift timing (ms).
 *
 *   0.00–0.30  flat near-black; every layer is already drifting underneath,
 *              just not yet visible
 *   0.30       the whole atmosphere begins to surface, with the content in
 *              front of it — see the choreography note in Hero.tsx
 *   2.20       fully surfaced
 *   2.20+      entrance over, motion continues indefinitely
 *
 * One value for every layer, where there used to be eight different pairs
 * staggered across 120–620ms. The hero's entrance is now a single moment
 * taken slowly, and a background that lit up in sequence behind content
 * arriving all at once was the one thing left contradicting it.
 *
 * The duration outlasts the content's, so the atmosphere is still settling
 * for a beat after the type has landed. That is not a sequence creeping back
 * in — everything still *starts* together — it just keeps the scene from
 * stopping dead all at once.
 *
 * These control the one-time entrance only. The continuous motion each layer
 * carries — wander, parallax, drift, shift — never stops.
 */
const AMBIENT: CSSProperties = {
  "--ambient-delay": "300ms",
  "--ambient-duration": "1900ms",
} as CSSProperties;

/**
 * A dark environment with technical objects floating in it, lit by blue
 * atmospheric sources — rather than a black page with a gradient on it.
 *
 * Back to front:
 *   1. near-black base
 *   2. four light sources: two central bodies behind the headline, two at
 *      the sides, all wandering on unrelated periods (38s/27s/44s/33s)
 *   3. far plane — deep arcs, hairline rules, the faintest marks, blurred
 *   4. mid plane — status codes, latencies, versions, ticks, geometric paths
 *   5. near plane — the few brightest marks, moving most
 *   6. particles, independent of every plane
 *   7. vignette + grain
 *
 * Seven independent periods are in play, none of them harmonics, so the
 * composite never visibly repeats. Every layer is pointer-events-none and
 * aria-hidden, and nothing exceeds ~0.09 opacity except the glows.
 */
export function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 1 — base. Painted immediately: it *is* the darkness. */}
      <div className="absolute inset-0 bg-[radial-gradient(140%_100%_at_50%_0%,var(--ground-4)_0%,var(--ground)_45%,var(--ground)_100%)]" />

      {/* 1b — the light theme's wash, and nothing on dark.

          The base above is a radial between two ground tokens, and on the
          light theme both of them are white — right for the page, and the
          reason the hero read as a blank sheet. This layer only exists to
          give that theme somewhere to put its colour; the rule is scoped to
          [data-theme="light"] in globals.css, so on dark this div paints
          nothing at all and costs one empty box. */}
      <div className="hero-wash absolute inset-0" />

      {/* 2 — atmospheric light. Two bodies behind the headline reshaping each
          other, plus two weaker sources raking in from the sides. */}
      <div className="anim-ambient absolute inset-0" style={AMBIENT}>
      {/* No blur() on these.

          Each one is already a radial-gradient falling to transparent — soft
          by construction — and it used to carry a 36–76px blur on top of
          that, over an element up to 70rem wide, animated continuously. A
          blur that large over that area is re-rasterised as it wanders, and
          it was measured at ~37% of this section's whole frame budget while
          nothing was even scrolling. Removing it is visually indistinguishable
          side by side; the gradient was doing the softening the entire time.

          If a gradient ever bands on some display, a small radius (~12px) buys
          most of the smoothing back for a fraction of the cost — blur is
          superlinear in its radius. Do not go back to 70. */}

        <div className="anim-glow-a absolute left-1/2 top-[38%] h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(47,99,214,0.20)_0%,rgba(30,70,163,0.10)_38%,transparent_68%)] sm:h-[62rem] sm:w-[62rem]" />
      </div>
      <div className="anim-ambient absolute inset-0" style={AMBIENT}>
        <div className="anim-glow-b absolute left-1/2 top-[36%] h-[24rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-accent-400)_14%,transparent)_0%,transparent_65%)] sm:h-[30rem] sm:w-[48rem]" />
      </div>
      <div className="anim-ambient absolute inset-0" style={AMBIENT}>
        <div className="anim-glow-c absolute -left-[14%] top-[58%] h-[32rem] w-[34rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(47,99,214,0.13)_0%,transparent_66%)] sm:h-[42rem] sm:w-[44rem]" />
      </div>
      <div className="anim-ambient absolute inset-0" style={AMBIENT}>
        <div className="anim-glow-d absolute -right-[16%] top-[24%] h-[28rem] w-[30rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-accent-500)_10%,transparent)_0%,transparent_68%)] sm:h-[38rem] sm:w-[40rem]" />
      </div>

      {/* 3 — far plane: rays, grid and deep linework.

          No blur on any of it, for the reason given on the glows above. The
          rays are a transparent-to-tint-to-transparent gradient across their
          width and run off the screen at both ends, so there is no edge for
          a 64px blur to soften — it was rasterising the largest filter on
          the page to change nothing. The linework lost its 1.4px for the
          same trade: at 5% opacity the softening was invisible, and a filter
          inside a moving plane was measurable on every scroll. */}
      <div className="anim-ambient absolute inset-0" style={AMBIENT}>
        <div className="anim-plane-far absolute inset-0">
          <div className="absolute -top-1/3 left-[12%] h-[130%] w-[26rem] -rotate-[18deg] bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--color-accent-400)_5.5%,transparent),transparent)]" />
          <div className="absolute -top-1/4 right-[8%] h-[120%] w-[18rem] rotate-[14deg] bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--color-accent-500)_4.5%,transparent),transparent)]" />

          <div
            className="absolute -inset-[3%] [background-image:linear-gradient(color-mix(in_oklab,var(--color-accent-300)_9%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--color-accent-300)_9%,transparent)_1px,transparent_1px)] [background-size:88px_88px]"
            style={{
              // Opacity is reserved for the ambient lift, so the grid's own
              // ceiling is carried by the mask's alpha instead.
              maskImage:
                "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(0,0,0,0.16) 0%, transparent 78%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(0,0,0,0.16) 0%, transparent 78%)",
            }}
          />

          <TechnicalLinesLayer variant="far" />
        </div>
      </div>

      {/* 4 — mid plane linework: ticks, brackets, scale marks */}
      <div className="anim-ambient absolute inset-0" style={AMBIENT}>
        <div className="anim-plane-mid absolute inset-0">
          <TechnicalLinesLayer variant="mid" />
        </div>
      </div>

      {/* 5 — the glyph field, across all three depth planes */}
      <div className="anim-ambient absolute inset-0" style={AMBIENT}>
        <BackgroundGlyphs />
      </div>

      {/* 6 — particles, on no plane at all */}
      <ParticleField
        className="anim-ambient absolute inset-0 h-full w-full"
        style={AMBIENT}
      />

      {/* 7 — vignette + grain. These darken rather than light, so they are
          present from the first frame and keep the opening genuinely black.
          The vignette is also what pushes the edge glyphs down to a whisper. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_78%_62%_at_50%_42%,transparent_35%,var(--vignette-ring)_78%,transparent_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-ink-950" />
      <div className="bg-grain absolute inset-0 opacity-[0.02]" />
    </div>
  );
}
