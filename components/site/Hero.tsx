import type { CSSProperties } from "react";
import { HeroBackground } from "@/components/hero/HeroBackground";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { Button } from "@/components/ui/Button";
import { START_HREF, DEMO_HREF } from "@/lib/contact";
import { cn } from "@/lib/cn";

/**
 * Entrance timing (ms). Everything in the hero, and the navbar, starts at
 * START; only the headline keeps going word by word after the rest settles.
 * The 300ms lets the black frame show before anything moves.
 * Navbar.tsx hardcodes the same 300ms, so keep them in sync.
 */
const START = 300;

// The hero uses the shared .anim-rise defaults from globals.css; no --rise-* override.
const TIMING = {
  headline: START,
  // Small extra pause at the line break, about a quarter of the word gap.
  headlineLineDelay: 40,
  // Keep stagger/duration near this ratio (~0.375). Much lower and the words
  // blur into one wave; much higher and it reads like a list.
  headlineStagger: 165,
  headlineDuration: 440,
  subtext: START,
  actions: START,
  cue: START,
} as const;

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-32 sm:px-6 sm:pt-36">
      <HeroBackground />

      {/* max-w-6xl so the headline fits on two lines; the copy below has its
          own narrower max width. */}
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center text-center">
        {/* Headline: blur-to-sharp reveal, one word at a time. */}
        <BlurReveal
          lines={[
            { text: "Empowering Businesses with" },
            { text: "Smart Digital Solutions", accent: true },
          ]}
          delay={TIMING.headline}
          lineDelay={TIMING.headlineLineDelay}
          stagger={TIMING.headlineStagger}
          duration={TIMING.headlineDuration}
          className="text-[clamp(1.95rem,5.8vw,4.5rem)] font-semibold leading-[1] tracking-[-0.04em] text-fg"
        />

        {/* Supporting copy. Names the company and its services so visitors
            and crawlers can tell what kind of business this is (SEO). */}
        <p
          className="anim-rise hero-rise mt-8 max-w-lg text-balance text-[15px] leading-relaxed text-fg/42 sm:mt-9 sm:text-base"
          style={{ "--hero-delay": `${TIMING.subtext}ms` } as CSSProperties}
        >
          Shahi Solutions builds custom software, web and mobile apps, and ERP
          platforms for growing businesses, from the first idea through to
          launch and support.
        </p>

        {/* CTA bar. No backdrop-blur: the background animates constantly, so a
            blur would re-render every frame. A flat fill is much cheaper. */}
        <div
          className="anim-rise hero-rise mt-10 w-full max-w-3xl sm:mt-12"
          style={{ "--hero-delay": `${TIMING.actions}ms` } as CSSProperties}
        >
          <div
            className={cn(
              "flex flex-col items-center gap-5 rounded-3xl border border-[color:var(--hair-2)] bg-[color:var(--veil-2)] p-4 text-center",
              "shadow-[0_24px_60px_-40px_color-mix(in_oklab,var(--shadow-ink)_calc(95%*var(--shadow-scale)),transparent)]",
              // Pill shape only in the row layout; stacked it stays rounded-3xl.
              "sm:flex-row sm:justify-between sm:gap-8 sm:rounded-full sm:py-2.5 sm:pl-7 sm:pr-2.5 sm:text-left",
            )}
          >
            <div className="min-w-0">
              <p className="text-[13.5px] font-medium tracking-[-0.01em] text-fg">
                Have a project in mind?
              </p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-fg/40">
                Tell us what you’re building and we’ll take it from there.
              </p>
            </div>

            {/* Secondary first, primary last so the row ends on the main action. */}
            <div className="flex w-full shrink-0 flex-col gap-2.5 sm:w-auto sm:flex-row sm:gap-2">
              <Button
                href={DEMO_HREF}
                variant="secondary"
                size="md"
                className="w-full sm:w-auto"
              >
                Book a demo
              </Button>
              <Button href={START_HREF} size="md" className="w-full sm:w-auto">
                Start building
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="anim-rise hero-rise absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
        style={{ "--hero-delay": `${TIMING.cue}ms` } as CSSProperties}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-fg/22">
          Scroll
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-[color:var(--veil-4)]">
          <span className="anim-scroll-cue absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-transparent via-accent-400 to-transparent" />
        </span>
      </div>
    </section>
  );
}
