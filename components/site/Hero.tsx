import { HeroBackground } from "@/components/hero/HeroBackground";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { Button } from "@/components/ui/Button";
import { START_HREF, DEMO_HREF } from "@/lib/contact";
import { cn } from "@/lib/cn";

/**
 * Entrance choreography (ms).
 *
 * One moment, taken slowly. Everything on the screen — the navbar above, the
 * headline, the eyebrow, the copy, the claims, the CTAs and the scroll cue —
 * starts together at 300ms and resolves together at roughly 1.9s. There is no
 * running order any more:
 *
 *   0.00  flat near-black
 *   0.30  everything on the screen begins at once — navbar, eyebrow, copy,
 *         claims, CTAs, scroll cue, and the atmosphere behind them all
 *         (see HeroBackground). The headline begins here too, on "Empowering"
 *   0.47  "Businesses"    0.63  "with"
 *   0.84  "Smart"         1.00  "Digital"        1.17  "Solutions"
 *   1.20  everything except the headline is settled
 *   1.61  the last headline word lands
 *   2.20  the atmosphere has finished surfacing
 *
 * Two rules that pull against each other, and both are wanted: one moment,
 * and a headline that arrives a word at a time. They are reconciled by
 * starting everything together and letting only the headline keep going —
 * every element is in flight from 0.30, and the type carries on writing
 * itself for a beat after the rest of the composition has settled.
 *
 * The consequence is worth knowing before changing anything here: the copy
 * and the claims are fully readable while the last two words are still
 * climbing. The original sequence deliberately avoided that by holding the
 * supporting content behind the headline; a single shared start cannot, and
 * the shared start is the thing being asked for.
 *
 * The 300ms is not padding. It lets the black frame register as black before
 * anything moves, so the scene is arrived at rather than simply present.
 *
 * After that the entrance is over, but nothing stops: the glows keep
 * wandering, three parallax planes keep sliding at different speeds, and the
 * particles keep drifting.
 */
const START = 300;

/**
 * There is no `--rise-*` override here any more.
 *
 * This went to 1600ms, then 2400, then 3600, chasing "slower" — and at 3600
 * the last word was landing at 5.15s, which is past the point where an
 * entrance stops reading as deliberate and starts reading as broken. Every
 * `.anim-rise` element in the hero is back on the shared default from
 * globals.css (900 / 620 / 560ms, 14px), which is the speed the rest of the
 * site runs at.
 *
 * What survived all of that is the *shape*, and it is the part worth keeping:
 * one shared start instead of a staggered running order.
 */
const TIMING = {
  headline: START,
  /**
   * One extra beat at the line break, on top of the running stagger — not a
   * pause. Roughly a quarter of the word gap: enough that the line registers,
   * little enough that it still reads as one sentence resolving rather than
   * as two animations.
   */
  headlineLineDelay: 40,
  /**
   * Wide gap, short word — and the two can only ever move together.
   *
   * What makes a headline read one word at a time is the *ratio* of the gap
   * to the length of a word's climb, not the gap on its own. 165/440 is 0.375.
   * Below about 0.2 the words overlap into a single soft wave; widening the
   * gap without lengthening the word turns the cadence into a list being read
   * out. Whatever these two become, keep them near this ratio.
   */
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

      {/* Widened from 4xl for the headline's sake — the new copy needs 13.07em
          on its longest line, which will not fit two lines at any respectable
          size in 896px. The copy carries its own narrower cap, so nothing else
          in the column changes width. */}
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center text-center">
        {/* Headline — blur-to-sharp reveal.

            No eyebrow above it. The announcement pill that used to sit here
            is gone, and the headline is the first thing in the column now, so
            its top margin has gone with it: `mt-9` was the gap under the pill,
            and kept without the pill it is just the headline sitting low in a
            block that is centred anyway. */}
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

        {/* Supporting copy */}
        <p
          className="anim-rise mt-8 max-w-lg text-balance text-[15px] leading-relaxed text-fg/42 sm:mt-9 sm:text-base"
          style={{ animationDelay: `${TIMING.subtext}ms` }}
        >
          Infrastructure for teams who refuse the default. Ship faster, scale
          quieter, and let the engineering disappear behind the product.
        </p>

        {/* Actions — one bar, not two loose buttons.

            Boxing them changes what they are. Loose in the middle of the
            column they were the end of the hero's list; inside a bar with a
            line of their own they read as a single offer, and the bar gives
            the pair an edge to sit against instead of floating on the
            atmosphere.

            No backdrop-blur on it, for the same reason the navbar has none at
            the top of the page: what is behind this never stops moving, so a
            blurred backdrop is a re-sample and a re-blur of that strip on
            every frame, forever. A 3% fill over it costs one paint. */}
        <div
          className="anim-rise mt-10 w-full max-w-3xl sm:mt-12"
          style={{ animationDelay: `${TIMING.actions}ms` }}
        >
          <div
            className={cn(
              "flex flex-col items-center gap-5 rounded-3xl border border-[color:var(--hair-2)] bg-[color:var(--veil-2)] p-4 text-center",
              "shadow-[0_24px_60px_-40px_color-mix(in_oklab,var(--shadow-ink)_calc(95%*var(--shadow-scale)),transparent)]",
              // A pill once it is a row. At the stacked width a fully rounded
              // container has to carry two lines of type and two full-width
              // buttons, and the corners end up further from the content than
              // the padding is.
              "sm:flex-row sm:justify-between sm:gap-8 sm:rounded-full sm:py-2.5 sm:pl-7 sm:pr-2.5 sm:text-left",
            )}
          >
            <div className="min-w-0">
              <p className="text-[13.5px] font-medium tracking-[-0.01em] text-fg">
                Have a project in mind?
              </p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-fg/40">
                Tell us what you’re building — we’ll take it from there.
              </p>
            </div>

            {/* Outlined first, solid last: the eye finishes the sentence on
                the left and lands on the primary action at the end of the
                row, rather than passing over it to read the alternative. */}
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
        className="anim-rise absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
        style={{ animationDelay: `${TIMING.cue}ms` }}
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
