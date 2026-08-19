import type { CSSProperties } from "react";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { ScrollStagger } from "@/components/ui/ScrollStagger";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------
   The stack, as a moving band rather than a grid.

   A nine-card grid states the same nine facts and takes three rows of
   the page to do it. On a track the row is one line deep, never ends,
   and reads as tooling in use rather than as a checklist — which is
   the honest claim: none of this is a feature of the product, it is
   what the product is built out of.
   ------------------------------------------------------------------ */

const STACK: Array<{ name: string; role: string }> = [
  { name: "React", role: "Frontend UI Library" },
  { name: "Next.js", role: "React Application Framework" },
  { name: "Node.js", role: "Server Runtime Environment" },
  { name: "MongoDB", role: "NoSQL Database Ecosystem" },
  { name: "AWS", role: "Cloud Infrastructure & Hosting" },
  { name: "Docker", role: "Application Containerization" },
  { name: "Figma", role: "UI/UX Collaborative Prototyping" },
  { name: "Flutter", role: "Cross-Platform Mobile SDK" },
  { name: "Git", role: "Distributed Version Control" },
];

/**
 * Intro choreography (ms), from the moment the block reaches the viewport —
 * the same shape as the ventures panel above it, so the two read as one page
 * rather than two authors.
 */
const INTRO = {
  eyebrow: 0,
  eyebrowLift: 300,
  heading: 90,
  headingStagger: 70,
  headingDuration: 420,
  copy: 330,
  copyLift: 400,
} as const;

const from = (offset: number) => `calc(var(--reveal-delay, 0ms) + ${offset}ms)`;

/**
 * One mark, in three weights of the house blue, cycled by index.
 *
 * Not brand logos and not brand colours. The reference for this section is
 * another site's design language, and dropping nine vendor marks into a page
 * built entirely from one accent ramp would make the strip the loudest thing
 * on it — and would be nine trademarks to keep licensed and up to date. The
 * mark is the same shape throughout; only its weight in the ramp changes, so
 * the row has rhythm without any card claiming more attention than its
 * neighbour.
 */
const MARK_TONES = ["text-accent-300", "text-accent-400", "text-accent-500"];

function Mark({ tone }: { tone: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
        "border border-[color:var(--hair-1)] bg-[color:var(--veil-1)]",
        tone,
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        {/* A four-point star: the same figure the reference uses, drawn as one
            path so it stays crisp at any size. */}
        <path
          d="M12 2.5c.55 4.6 2.4 6.45 7 7-4.6.55-6.45 2.4-7 7-.55-4.6-2.4-6.45-7-7 4.6-.55 6.45-2.4 7-7Z"
          fill="currentColor"
          fillOpacity="0.85"
        />
      </svg>
    </span>
  );
}

export function TechStrip() {
  return (
    <section
      id="stack"
      className="relative isolate border-t border-[color:var(--hair-1)] bg-ink-950 py-16 sm:py-20"
    >
      {/* One quiet source of light, as in the ventures section above. No
          particle field: two of them on one page is one more than anybody
          looks at, and this band is meant to be the calm after that section. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="atmo-glow absolute left-1/2 top-1/2 h-[26rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(47,99,214,0.07)_0%,transparent_70%)] blur-[70px]" />
      </div>

      <ScrollStagger as="div" className="relative z-10 block" inRatio={0.22}>
        <div className="mx-auto max-w-2xl px-5 text-center sm:px-8">
          <p
            className="anim-rise inline-flex items-center rounded-full border border-[color:var(--hair-2)] bg-[color:var(--veil-1)] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-fg/40"
            style={
              {
                animationDelay: from(INTRO.eyebrow),
                "--rise-lift": `${INTRO.eyebrowLift}ms`,
                "--rise-defog": `${Math.round(INTRO.eyebrowLift * 0.72)}ms`,
                "--rise-fade": `${Math.round(INTRO.eyebrowLift * 0.66)}ms`,
                "--rise-y": "20px",
                "--rise-blur": "0.55em",
              } as CSSProperties
            }
          >
            Technologies We Use
          </p>

          <BlurReveal
            as="h2"
            lines={[{ text: "Our Modern Tech Stack" }]}
            delay={INTRO.heading}
            stagger={INTRO.headingStagger}
            duration={INTRO.headingDuration}
            blurScale={1.45}
            fromReveal
            className="mt-7 text-[clamp(1.9rem,4.2vw,3rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-fg"
          />

          <p
            className="anim-rise mt-6 text-[15px] leading-relaxed text-fg/42"
            style={
              {
                animationDelay: from(INTRO.copy),
                "--rise-lift": `${INTRO.copyLift}ms`,
                "--rise-defog": `${Math.round(INTRO.copyLift * 0.72)}ms`,
                "--rise-fade": `${Math.round(INTRO.copyLift * 0.66)}ms`,
                "--rise-y": "30px",
                "--rise-blur": "0.62em",
              } as CSSProperties
            }
          >
            We engineer high-performance systems with cutting-edge,
            industry-standard technologies to ensure modularity, efficiency, and
            long-term scalability.
          </p>
        </div>
      </ScrollStagger>

      {/* ---------------- the track ----------------

          Full-bleed, not inside the max-w-6xl column: a loop that starts and
          ends inside a centred container reads as a carousel with the arrows
          missing. Running it edge to edge is what makes it a band.

          The mask is what sells the loop. Without it the cards appear and
          vanish at hard edges and the eye catches the seam every 40 seconds;
          faded out, there is no moment where the repeat is visible. */}
      <div
        className="relative z-10 mt-11 overflow-hidden sm:mt-14"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        }}
      >
        {/* 52s rather than the trust strip's 38s. That track is six short
            words; this one is nine cards and close to three times as long, and
            on a shared duration it would tear past at three times the speed —
            what the eye reads as speed is the content going by, not the
            fraction of the track travelled. */}
        <ul
          className="anim-marquee flex w-max items-stretch"
          style={{ "--marquee-duration": "52s" } as CSSProperties}
        >
          {/* Duplicated exactly once: the keyframe translates -50%, so the
              second pass is what occupies the screen while the first is
              rewinding, and the join never appears.

              The spacing is a trailing margin on every card, not a flex `gap`
              on the two tracks. With a gap, the outer list is
              pass + gap + pass, so -50% lands half a gap short of the second
              pass's first card and the band snaps back by that half gap once
              per cycle — small, but it is the one moment the loop is visible,
              which is the whole thing the mask exists to hide. Carried on the
              cards, a pass is exactly nine card-plus-gap units and half the
              track is exactly one pass. */}
          {[0, 1].map((pass) => (
            <li key={pass} aria-hidden={pass === 1 ? "true" : undefined}>
              <ul className="flex items-stretch">
                {STACK.map((tech, i) => (
                  <li
                    key={`${pass}-${tech.name}`}
                    className={cn(
                      "group flex w-[17.5rem] shrink-0 items-center gap-4 rounded-2xl px-5 py-4",
                      "mr-4 sm:mr-5",
                      "border border-[color:var(--hair-2)] bg-[color:var(--veil-1)]",
                      "transition-colors duration-500 ease-cinematic",
                      "hover:border-accent-500/30 hover:bg-[color:var(--veil-2)]",
                    )}
                  >
                    <Mark tone={MARK_TONES[i % MARK_TONES.length]} />

                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-semibold tracking-[-0.01em] text-fg">
                        {tech.name}
                      </span>
                      <span className="mt-0.5 block truncate text-[12.5px] text-fg/40">
                        {tech.role}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
