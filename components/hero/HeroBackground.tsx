import type { CSSProperties } from "react";
import { BackgroundGlyphs } from "./BackgroundGlyphs";
import { ParticleField } from "./ParticleField";
import { TechnicalLinesLayer } from "./TechnicalLines";

/**
 * One-time fade-in for all background layers (same timing for each, starting
 * with the hero content; see Hero.tsx). Runs slightly longer than the content
 * entrance. The continuous layer motion is separate and never stops.
 */
const AMBIENT: CSSProperties = {
  "--ambient-delay": "300ms",
  "--ambient-duration": "1900ms",
} as CSSProperties;

/**
 * Hero background layers, back to front:
 *   1. base gradient
 *   2. four glows wandering on unrelated periods
 *   3. far plane: rays, grid, linework
 *   4. mid plane linework
 *   5. glyph field (all three planes)
 *   6. particles
 *   7. vignette + grain
 */
export function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 1: base, visible immediately */}
      <div className="absolute inset-0 bg-[radial-gradient(140%_100%_at_50%_0%,var(--ground-4)_0%,var(--ground)_45%,var(--ground)_100%)]" />

      {/* 1b: colour wash for the light theme only (styled in globals.css). */}
      <div className="hero-wash absolute inset-0" />

      {/* 2: glows. Two behind the headline, two weaker ones at the sides. */}
      <div className="anim-ambient absolute inset-0" style={AMBIENT}>
      {/* No blur() here: the radial gradients are already soft, and a large
          blur on these moving elements is very expensive. If banding shows
          up, a small radius (~12px) is fine; avoid large ones. */}

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

      {/* 3: far plane: rays, grid and linework. No blur, same reason as above;
          the rays are already soft gradients. */}
      <div className="anim-ambient absolute inset-0" style={AMBIENT}>
        <div className="anim-plane-far absolute inset-0">
          <div className="absolute -top-1/3 left-[12%] h-[130%] w-[26rem] -rotate-[18deg] bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--color-accent-400)_5.5%,transparent),transparent)]" />
          <div className="absolute -top-1/4 right-[8%] h-[120%] w-[18rem] rotate-[14deg] bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--color-accent-500)_4.5%,transparent),transparent)]" />

          <div
            className="absolute -inset-[3%] [background-image:linear-gradient(color-mix(in_oklab,var(--color-accent-300)_9%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--color-accent-300)_9%,transparent)_1px,transparent_1px)] [background-size:88px_88px]"
            style={{
              // Opacity is used by the ambient fade, so the grid is dimmed
              // through the mask alpha instead.
              maskImage:
                "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(0,0,0,0.16) 0%, transparent 78%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(0,0,0,0.16) 0%, transparent 78%)",
            }}
          />

          <TechnicalLinesLayer variant="far" />
        </div>
      </div>

      {/* 4: mid plane linework */}
      <div className="anim-ambient absolute inset-0" style={AMBIENT}>
        <div className="anim-plane-mid absolute inset-0">
          <TechnicalLinesLayer variant="mid" />
        </div>
      </div>

      {/* 5: glyph field */}
      <div className="anim-ambient absolute inset-0" style={AMBIENT}>
        <BackgroundGlyphs />
      </div>

      {/* 6: particles */}
      <ParticleField
        className="anim-ambient absolute inset-0 h-full w-full"
        style={AMBIENT}
      />

      {/* 7: vignette + grain, visible from the first frame (they only darken). */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_78%_62%_at_50%_42%,transparent_35%,var(--vignette-ring)_78%,transparent_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-ink-950" />
      <div className="bg-grain absolute inset-0 opacity-[0.02]" />
    </div>
  );
}
