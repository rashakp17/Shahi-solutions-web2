import { BackgroundGlyphs } from "@/components/hero/BackgroundGlyphs";
import { TechnicalLinesLayer } from "@/components/hero/TechnicalLines";

/**
 * Background for sections after the hero: the hero's layers at roughly a
 * third of the strength, so it feels related but distinct.
 *
 * No fade-in; the section is revealed by sliding over the hero.
 */
export function SectionAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Base, darkest at the top so the incoming edge reads as black. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_78%,var(--ground-4)_0%,var(--ground)_48%,var(--ground-deep)_100%)]" />

      {/* Glows, placed low (the hero's are high). No blur() here: the radial
          gradients are already soft, and a large blur on these moving
          elements is very expensive. If banding shows up, a small radius
          (~12px) is fine; avoid large ones. */}
      <div className="anim-glow-a absolute left-1/2 top-[72%] h-[38rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(47,99,214,0.10)_0%,rgba(30,70,163,0.05)_42%,transparent_70%)] sm:h-[46rem] sm:w-[70rem]" />
      <div className="anim-glow-c absolute -left-[12%] top-[34%] h-[26rem] w-[30rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-accent-500)_7%,transparent)_0%,transparent_68%)] sm:h-[34rem] sm:w-[38rem]" />
      <div className="anim-glow-d absolute -right-[14%] top-[58%] h-[24rem] w-[28rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-accent-400)_5.5%,transparent)_0%,transparent_70%)] sm:h-[32rem] sm:w-[36rem]" />

      {/* Far plane: grid and linework. */}
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
        <TechnicalLinesLayer variant="far" className="opacity-55" />
      </div>

      <div className="anim-plane-mid absolute inset-0">
        <TechnicalLinesLayer variant="mid" className="opacity-40" />
      </div>

      {/* Hidden on phones: barely visible there, and resuming all its drift
          animations at once caused a noticeable hitch. */}
      <BackgroundGlyphs className="opacity-[0.38] max-sm:hidden" />

      {/* No ParticleField here: this component is used by several sections,
          and multiple particle canvases were too expensive. Only the hero
          has one. */}

      {/* Vignette, heavier at the top than the hero's. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_84%_70%_at_50%_62%,transparent_28%,var(--vignette-ring)_74%,var(--vignette-edge)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950 to-transparent" />
      <div className="bg-grain absolute inset-0 opacity-[0.016]" />
    </div>
  );
}
