import type { CSSProperties } from "react";
import { ParticleField } from "@/components/hero/ParticleField";
import { TechnicalLinesLayer } from "@/components/hero/TechnicalLines";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { ScrollStagger } from "@/components/ui/ScrollStagger";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------
   The ventures themselves — names, categories, descriptions and where
   each one lives. Facts about the three companies, nothing else.

   No logo files and no brand hexes: those belong to the other site's
   design. Everything visual here is built from this project's tokens.
   ------------------------------------------------------------------ */

const VENTURES: Array<{
  name: string;
  category: string;
  description: string;
  url: string;
}> = [
  {
    name: "Draway Media",
    category: "Digital Marketing",
    description:
      "Helping businesses grow through branding, social media, SEO, and performance marketing.",
    url: "https://drawaymedia.com/",
  },
  {
    name: "Drawcode",
    category: "Software Development",
    description:
      "Building custom websites, web applications, mobile apps, ERP, and e-commerce solutions.",
    url: "https://www.drawcode.in/",
  },
  {
    name: "SDEC Academy",
    category: "Software Training",
    description:
      "Providing industry-focused software training, hands-on projects, and career-oriented learning.",
    url: "https://www.sdecacademy.in/",
  },
];

/**
 * Intro choreography (ms), from the moment the panel reaches the viewport
 * rather than from page load — it is most of a page down, and on a page-load
 * clock it would have finished long before anyone arrived.
 *
 * One continuous move rather than three entrances in a queue: each element
 * starts while the one before it is still resolving, so the overlap is where
 * the flow comes from, not the delays.
 *
 *   eyebrow      0     → 450    the smallest thing, and the first
 *   heading      200   → 1090   starts under the eyebrow's tail
 *   copy         850   → 1530   starts ~240ms before the heading lands
 *
 * The whole panel is therefore settled a little over 1.5s after it is
 * released — long enough to be watched, short enough that nobody is waiting
 * on any one line of it.
 */
const INTRO = {
  eyebrow: 0,
  eyebrowLift: 450,
  heading: 200,
  /** Word onsets: the next word is moving well before the last has landed. */
  headingStagger: 130,
  headingDuration: 720,
  copy: 850,
  copyLift: 680,
} as const;

/**
 * Offsets inside a venture, from that venture's own arrival. The block itself
 * carries the travel, the focus pull and the light; these are the parts
 * assembling behind it.
 *
 * Held tight on purpose. A venture reads as one object arriving, so the last
 * part of it has to land inside the block's own travel — the link finishing
 * at ~890ms, a shade after the block itself stops at 860ms.
 */
const PART = {
  index: 0,
  category: 90,
  name: 170,
  nameStagger: 120,
  nameDuration: 600,
  body: 260,
  link: 350,
  /** Length of a single part's slide, shared by all of them. */
  lift: 540,
} as const;

/**
 * Gap between ventures when several are released together — the scroll spaces
 * them out on its own most of the time, but a fast scroll or a tall viewport
 * hands the whole column over at once, and then this is the cadence.
 *
 * Deliberately shorter than a venture takes to resolve (~890ms), so 02 is
 * already moving while 01 is still settling and the column reads as one
 * continuous arrival rather than three separate ones.
 */
const VENTURE_STAGGER = 350;

const from = (offset: number) => `calc(var(--reveal-delay, 0ms) + ${offset}ms)`;

export function VenturesSection() {
  return (
    // No overflow-hidden on the section. An ancestor with a clipped overflow
    // becomes the scrollport for anything sticky inside it, and since this
    // section does not scroll internally, the left panel would simply never
    // stick. The atmosphere is clipped by its own wrapper instead.
    <section id="ventures" className="relative isolate bg-ink-950">
      {/* Kept deliberately quiet — this is the one section whose subject is
          content rather than spectacle. The particle field is the only moving
          part, and it stops itself whenever the section is off screen, so it
          costs nothing on top of the fields already on the page: only ever
          one of them runs. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_20%,var(--ground-4)_0%,var(--ground)_45%,var(--ground-deep)_100%)]" />
        <div className="atmo-glow absolute left-1/2 top-[18%] h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(47,99,214,0.11)_0%,rgba(30,70,163,0.04)_44%,transparent_70%)] blur-[70px]" />
        <div className="atmo-glow absolute -right-[10%] top-[62%] h-[26rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(109,155,255,0.05)_0%,transparent_70%)] blur-[80px]" />
        <TechnicalLinesLayer variant="far" className="opacity-40 blur-[1.6px]" />
        <ParticleField
          className="absolute inset-0 h-full w-full opacity-45"
          intensity={0.4}
        />
        <div className="bg-grain absolute inset-0 opacity-[0.02]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        {/* items-start, not center: a sticky child of a stretched grid item
            has no room to travel, because the item is already as tall as the
            row. */}
        <div className="grid gap-14 md:grid-cols-12 md:items-start md:gap-10 lg:gap-16">
          {/* ================= left — the pinned panel ================= */}
          <ScrollStagger
            as="div"
            className="block md:sticky md:col-span-5 md:top-32"
            inRatio={0.22}
          >
            <div>
              {/* The lift lengths are set per element rather than left on the
                  shared default, because the three are not the same size and
                  should not travel for the same length of time: the eyebrow is
                  a chip and is done in 450ms, the copy is a paragraph and takes
                  680ms. The blur is in em throughout, so a radius that reads as
                  ~5px on the chip is ~9px on the copy without either of them
                  turning to mush. */}
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
                Our Ecosystem
              </p>

              <BlurReveal
                as="h2"
                lines={[{ text: "Our" }, { text: "Ventures" }]}
                delay={INTRO.heading}
                lineDelay={40}
                stagger={INTRO.headingStagger}
                duration={INTRO.headingDuration}
                // Half the size of the hero headline, so the same em radius is
                // half the haze. Scaled back up to ~0.22em, which lands at
                // 8–12px across the clamp — visible as a focus pull, never
                // enough to stop the word being a word.
                blurScale={1.45}
                fromReveal
                className="mt-7 text-[clamp(2.1rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-fg"
              />

              <p
                className="anim-rise mt-6 max-w-sm text-[15px] leading-relaxed text-fg/42"
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
                Explore our specialized ventures delivering innovative solutions
                across technology, digital marketing, and education.
              </p>
            </div>
          </ScrollStagger>

          {/* ================= right — the ventures ================= */}
          <ScrollStagger
            className="block md:col-span-7"
            stagger={VENTURE_STAGGER}
            // A venture is tall, so at the shared 20% band the top one commits
            // while it is still most of a fold deep. A third of it has to be up
            // before it is released.
            inRatio={0.3}
          >
            {VENTURES.map((venture, i) => {
              const last = i === VENTURES.length - 1;

              return (
                <li
                  key={venture.name}
                  className={cn("relative pl-8 sm:pl-14", !last && "pb-20 sm:pb-28")}
                  style={
                    {
                      // Alternating, and small: 01 settles in from the left, 02
                      // from the right, 03 from the left again. Read one after
                      // another that alternation is what turns three blocks
                      // into a sequence — and at 2.8rem it is a block finding
                      // its place, not a card flying across the column.
                      "--enter-x": i % 2 === 0 ? "-2.8rem" : "2.8rem",
                    } as CSSProperties
                  }
                >
                  {/* The spine. Runs the full height of the block including the
                      gap below it, so the thread is continuous from one venture
                      to the next, and is drawn downward as each arrives. The
                      last one fades out rather than stopping dead. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "venture-link absolute bottom-0 left-0 top-2 w-px",
                      last
                        ? "bg-gradient-to-b from-fg/[0.10] to-transparent"
                        : "bg-gradient-to-b from-fg/[0.10] via-fg/[0.07] to-fg/[0.10]",
                    )}
                  />

                  {/* The node on the spine. */}
                  <span
                    aria-hidden="true"
                    className="venture-accent absolute left-0 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent-400/70"
                  />

                  <div className="venture-clip">
                    <div className="venture-move">
                      <span
                        aria-hidden="true"
                        className="anim-rise-inner venture-num block select-none font-mono text-[clamp(2.25rem,4.5vw,3.25rem)] font-semibold leading-none tracking-[-0.06em] text-fg/[0.10]"
                        style={
                          {
                            animationDelay: from(PART.index),
                            "--rise-inner": `${PART.lift}ms`,
                            "--inner-y": "18px",
                          } as CSSProperties
                        }
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <p
                        className="anim-rise-inner venture-accent mt-6 font-mono text-[11px] uppercase tracking-[0.24em] text-accent-300/75"
                        style={
                          {
                            animationDelay: from(PART.category),
                            "--rise-inner": `${PART.lift}ms`,
                          } as CSSProperties
                        }
                      >
                        {venture.category}
                      </p>

                      <BlurReveal
                        as="h3"
                        lines={[{ text: venture.name }]}
                        delay={PART.name}
                        stagger={PART.nameStagger}
                        duration={PART.nameDuration}
                        blurScale={1.45}
                        // Counted from this venture's own release, not from the
                        // list's. Without it the name of the second venture
                        // starts on the first venture's clock and arrives
                        // ahead of the block it belongs to.
                        fromReveal
                        className="mt-3.5 text-[clamp(1.65rem,3.6vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-fg"
                      />

                      <p
                        className="anim-rise-inner mt-4 max-w-md text-[15px] leading-relaxed text-fg/45"
                        style={
                          {
                            animationDelay: from(PART.body),
                            "--rise-inner": `${PART.lift}ms`,
                          } as CSSProperties
                        }
                      >
                        {venture.description}
                      </p>

                      <a
                        href={venture.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${venture.name}`}
                        className="anim-rise-inner group mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-fg/55 transition-colors duration-500 ease-cinematic hover:text-fg"
                        style={
                          {
                            animationDelay: from(PART.link),
                            "--rise-inner": `${PART.lift}ms`,
                          } as CSSProperties
                        }
                      >
                        Visit
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden="true"
                          className="h-3.5 w-3.5 transition-transform duration-500 ease-cinematic group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        >
                          <path
                            d="M4.8 11.2 11.2 4.8M5.6 4.8h5.6v5.6"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ScrollStagger>
        </div>
      </div>
    </section>
  );
}
