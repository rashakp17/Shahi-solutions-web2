import { cn } from "@/lib/cn";

const COMPANIES = [
  "NORTHWIND",
  "AXIOM LABS",
  "VERTEX",
  "KOSMOS",
  "HELIOGEN",
  "MERIDIAN",
];

/**
 * A single quiet band under the hero. Deliberately not a card grid — the page
 * should still read as mostly negative space when you scroll past the fold.
 *
 * It paints its own ground, like every other section on the page. A strip this
 * plain does not obviously need one — there is nothing here but a line of type
 * — but "nothing behind it" means the body shows through, and a band that
 * inherits rather than declares is one token change away from being a hole in
 * the middle of the page. It was, until the footer landed under it and made
 * the hole visible.
 */
export function TrustStrip() {
  return (
    <section className="relative border-t border-[color:var(--hair-1)] bg-ink-950 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-fg/22">
          Trusted by engineering teams at
        </p>

        <div
          className="relative mt-8 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
          }}
        >
          <div className="anim-marquee flex w-max items-center">
            {/* Duplicated once — the keyframe translates exactly -50%.
                Spacing rides on each name as a trailing margin rather than as
                a flex `gap` on the two rows: a gap makes the track
                pass + gap + pass, so -50% stops half a gap short of the
                second pass and the row jerks back by that much once per
                cycle. At this strip's spacing that half gap is 28–40px, which
                is not subtle. As a margin, half the track is exactly one
                pass. */}
            {[0, 1].map((pass) => (
              <div key={pass} className="flex items-center">
                {COMPANIES.map((name) => (
                  <span
                    key={`${pass}-${name}`}
                    aria-hidden={pass === 1 ? "true" : undefined}
                    className={cn(
                      "whitespace-nowrap text-[13px] font-medium tracking-[0.22em] text-fg/25",
                      "mr-14 sm:mr-20",
                      "transition-colors duration-500 hover:text-fg/50",
                    )}
                  >
                    {name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
