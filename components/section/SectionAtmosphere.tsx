import { BackgroundGlyphs } from "@/components/hero/BackgroundGlyphs";
import { TechnicalLinesLayer } from "@/components/hero/TechnicalLines";

/**
 * The second scene's atmosphere — the same world, seen deeper in.
 *
 * Every layer the hero has, at roughly a third of its strength: the light is
 * further off, the glyph field is nearly gone, the grid is a suggestion. That
 * is deliberate. If this matched the hero it would read as the same screen
 * again and the cover would lose its point; if it were flat black it would
 * read as a different website. Sitting a stop or two down from the hero makes
 * it feel like somewhere further inside the same building.
 *
 * Nothing here fades in on its own — the whole section is revealed by the
 * black edge rising over the hero, so these layers simply exist and are
 * uncovered. Their continuous motion (wander, drift, parallax) never stops.
 */
export function SectionAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Deep ground. Darker than the hero's, and darkest at the top edge so
          the rising line reads as solid black at the moment it crosses. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_78%,var(--ground-4)_0%,var(--ground)_48%,var(--ground-deep)_100%)]" />

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
      {/* Two distant sources, low and wide. The hero's are above the fold of
          the type; here they sit under it, so the section lifts from below. */}
      <div className="anim-glow-a absolute left-1/2 top-[72%] h-[38rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(47,99,214,0.10)_0%,rgba(30,70,163,0.05)_42%,transparent_70%)] sm:h-[46rem] sm:w-[70rem]" />
      <div className="anim-glow-c absolute -left-[12%] top-[34%] h-[26rem] w-[30rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-accent-500)_7%,transparent)_0%,transparent_68%)] sm:h-[34rem] sm:w-[38rem]" />
      <div className="anim-glow-d absolute -right-[14%] top-[58%] h-[24rem] w-[28rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-accent-400)_5.5%,transparent)_0%,transparent_70%)] sm:h-[32rem] sm:w-[36rem]" />

      {/* Far plane — grid and deep linework. */}
      <div className="anim-plane-far absolute inset-0">
        <div
          className="absolute -inset-[3%] [background-image:linear-gradient(color-mix(in_oklab,var(--color-accent-300)_7%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--color-accent-300)_7%,transparent)_1px,transparent_1px)] [background-size:104px_104px]"
          style={{
            maskImage:
              "radial-gradient(ellipse 74% 60% at 50% 55%, rgba(0,0,0,0.11) 0%, transparent 76%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 74% 60% at 50% 55%, rgba(0,0,0,0.11) 0%, transparent 76%)",
          }}
        />
        {/* Unblurred, as in the hero — see the note on its far plane. */}
        <TechnicalLinesLayer variant="far" className="opacity-55" />
      </div>

      <div className="anim-plane-mid absolute inset-0">
        <TechnicalLinesLayer variant="mid" className="opacity-40" />
      </div>

      {/* The mark field, well under the hero's — texture, not content. */}
      <BackgroundGlyphs className="opacity-[0.38]" />

      {/* No ParticleField here any more, and it is the one thing this
          atmosphere lost.

          Every scene that is not the hero shares this component, so a
          single <ParticleField> here meant a near-full-viewport WebGL
          canvas under the services grid, the statement pane and the
          ventures list — four on the page counting the hero's. Measured
          idle, with nothing scrolling, the services section sat at
          ~183ms a frame against ~17ms for any section with a static
          background; taking the canvases away was the only change that
          closed that gap.

          The hero keeps its field. It is the showpiece, it is one
          canvas rather than three, and it is the only place the points
          were ever meant to be looked at — here they were half-count at
          half opacity, described in this file's own history as texture
          rather than content. The glow, the planes, the glyph field and
          the grain all stay, so what is lost is the faintest layer of
          the four. */}

      {/* Vignette. Heavier at the top than the hero's, so the first thing the
          rising edge shows is genuinely black rather than a lit surface. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_84%_70%_at_50%_62%,transparent_28%,var(--vignette-ring)_74%,var(--vignette-edge)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950 to-transparent" />
      <div className="bg-grain absolute inset-0 opacity-[0.016]" />
    </div>
  );
}
