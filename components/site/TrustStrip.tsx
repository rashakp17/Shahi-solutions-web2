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
 * Marquee of client names under the hero. Sets its own background like the
 * other sections so the body doesn't show through.
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
            {/* Rendered twice; the keyframe translates -50%. Use margin on each
                name, not flex gap, or the loop jumps by half a gap each cycle. */}
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
