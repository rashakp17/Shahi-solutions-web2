import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { ScrollStagger } from "@/components/ui/ScrollStagger";
import { SectionAtmosphere } from "@/components/section/SectionAtmosphere";
import { SERVICES, type ServiceId } from "@/lib/services";

/**
 * Entrance choreography (ms), measured from the moment the cover is deep
 * enough to commit — see SceneCover. The heading block is paused until then,
 * so these are delays from the reveal, not from page load.
 *
 *   0.00  eyebrow
 *   0.06  the heading starts climbing out from under its mask
 *   0.94  heading completely sharp
 *   0.86  supporting copy, overlapping the heading's tail
 *
 * The cards are deliberately *not* on this clock. The section stands a full
 * viewport tall and the grid sits in the lower half of it, so at a reading
 * pace the cards are still most of a screen away when the cover commits — on
 * a shared timer they finished arriving long before the visitor got to them
 * and the whole grid read as static. Each card now waits for its own arrival
 * in the viewport instead (see ScrollStagger), which is also what makes them
 * come in one at a time rather than as a block.
 */
const TIMING = {
  heading: 60,
  headingStagger: 110,
  headingLineDelay: 40,
  headingDuration: 440,
  copy: 860,
  /**
   * Gap between cards that cross into view together — a row of the grid
   * shares a top edge, so a row always arrives as one batch and this is what
   * spaces it out.
   *
   * 120, down from 180. A row of four at 180 took 540ms just to deal itself
   * out before the last card had begun, which is most of a second on top of
   * the card's own arrival. That was survivable while this section was one
   * of two things on the page; alongside every other section it reads as
   * this one lagging. The rest of the site counts its batches out at
   * 100–140.
   */
  cardStagger: 120,
} as const;

/**
 * How long a card takes to arrive.
 *
 * These are the defaults from `.anim-rise` and `.anim-rise-inner`, written
 * out rather than left implicit, because the whole point is that this section
 * is now on the same clock as every other one.
 *
 * It used to run at 1400/980/880/1080 — half again as long as the rest of the
 * site — on the argument that a card released by the scroll is the only thing
 * moving and is watched start to finish, so it can afford to take its time
 * where the hero cannot. That reasoning holds in isolation and stopped
 * holding when the separate pages became sections of one: scrolling out of a
 * section that arrives in 900ms into one that takes 1400 does not read as
 * considered, it reads as slow. Consistency across the page beats the
 * argument for any single section.
 */
const CARD_PACE = {
  "--rise-lift": "900ms",
  "--rise-defog": "620ms",
  "--rise-fade": "560ms",
  "--rise-inner": "720ms",
} as const;

/**
 * Offsets within a card, from that card's own arrival. The frame fades up
 * while its four lines slide into place behind it, so each point assembles
 * rather than appearing whole.
 *
 * Pulled in with the pace above, and by the same proportion: these are
 * offsets *inside* a card's arrival, so leaving them where they were while
 * the arrival shortened would have the last line starting a quarter of the
 * way into a curve that is already ending. The lines want to trail the
 * frame, not queue behind it.
 */
const INNER = { icon: 35, title: 100, body: 155, link: 215 } as const;

/**
 * A card's own animation-delay is written onto it by ScrollStagger as
 * `--reveal-delay` when it crosses into view. Everything inside the card
 * inherits that and adds its own offset, so one custom property drives the
 * whole assembly and the card does not need to know when it will arrive.
 */
const from = (offset: number) => `calc(var(--reveal-delay, 0ms) + ${offset}ms)`;

const icon = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * The drawn mark for each service.
 *
 * The copy moved to lib/services.ts, because the offer catalogue in the home
 * page's structured data needs the same eight titles and cannot import a React
 * tree to get them. The artwork stayed, because nothing but this grid can use
 * it.
 *
 * Keyed by `ServiceId` and typed as a total `Record`, which is the point of
 * splitting it this way: adding a service to lib/services.ts without drawing
 * its mark here fails the build, rather than shipping a card with an empty
 * box in it.
 */
const ART: Record<ServiceId, ReactNode> = {
  "website-development": (
    <>
      <circle cx="12" cy="12" r="9" {...icon} />
      <path d="M3 12h18" {...icon} />
      <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" {...icon} />
    </>
  ),
  "custom-software-development": (
    <>
      <path d="m9 8-4 4 4 4" {...icon} />
      <path d="m15 8 4 4-4 4" {...icon} />
    </>
  ),
  "mobile-app-development": (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.5" {...icon} />
      <path d="M11 18.5h2" {...icon} />
    </>
  ),
  "ui-ux-design": (
    <>
      <path
        d="M12 21a9 9 0 1 1 9-9c0 2-1.5 3-3 3h-1.5a2 2 0 0 0-1.4 3.4A2 2 0 0 1 12 21Z"
        {...icon}
      />
      <circle cx="8.5" cy="10.5" r="1" {...icon} />
      <circle cx="12" cy="7.5" r="1" {...icon} />
      <circle cx="15.5" cy="10.5" r="1" {...icon} />
    </>
  ),
  "erp-crm": (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" {...icon} />
      <path d="M5 6v6c0 1.66 3.13 3 7 3s7-1.34 7-3V6" {...icon} />
      <path d="M5 12v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" {...icon} />
    </>
  ),
  "digital-marketing": (
    <>
      <path d="M4 10v4a1 1 0 0 0 1 1h2l7 4V5L7 9H5a1 1 0 0 0-1 1Z" {...icon} />
      <path d="M18 9a4 4 0 0 1 0 6" {...icon} />
    </>
  ),
  "sales-solutions": (
    <>
      <path d="m4 16 5-5 3 3 7-7" {...icon} />
      <path d="M15 7h4v4" {...icon} />
    </>
  ),
  "business-automation": (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2" {...icon} />
      <path
        d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3"
        {...icon}
      />
    </>
  ),
};

export function ServicesSection() {
  return (
    <section
      id="platform"
      // py-12/16, down from py-20/24, itself down from py-28/32: min-h-[100svh]
      // and justify-center already hold the content off the edges, so the extra
      // padding was only adding dead space under the last row of cards — and
      // that space runs straight into the statement pane's own empty upper half
      // below it, so the two were compounding into a screen of nothing between
      // the cards and the giant line.
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-12 sm:px-6 sm:py-16"
    >
      <SectionAtmosphere />

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center">
        <p
          className="anim-rise font-mono text-[10px] uppercase tracking-[0.32em] text-fg/28"
          style={{ animationDelay: "0ms" }}
        >
          Our services
        </p>

        {/* Same rig as the hero headline — each word masked, climbing out from
            underneath with its blur clearing on the way up. Smaller type and a
            tighter stagger, so it reads as a reply to the hero rather than a
            second announcement. */}
        <BlurReveal
          as="h2"
          lines={[
            { text: "End-to-End" },
            { text: "Digital Services", accent: true },
          ]}
          delay={TIMING.heading}
          lineDelay={TIMING.headingLineDelay}
          stagger={TIMING.headingStagger}
          duration={TIMING.headingDuration}
          className="mt-7 text-center text-[clamp(1.85rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-fg sm:mt-8"
        />

        <p
          className="anim-rise mt-7 max-w-xl text-balance text-center text-[15px] leading-relaxed text-fg/42 sm:text-base"
          style={{ animationDelay: `${TIMING.copy}ms` }}
        >
          We provide full-spectrum digital transformation solutions, helping
          companies scale from concept to global enterprise.
        </p>

        <ScrollStagger
          className="mt-14 grid w-full grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4"
          stagger={TIMING.cardStagger}
        >
          {SERVICES.map((service) => {
            return (
              <li
                key={service.title}
                className="anim-rise"
                style={
                  {
                    animationDelay: "var(--reveal-delay, 0ms)",
                    // A card is a much larger object than a line of copy, and
                    // the 14px default barely registers across one. Further
                    // now than it was: the travel has to stay in proportion
                    // to the longer curve, or the card spends the extra time
                    // crawling the last few pixels instead of arriving.
                    "--rise-y": "34px",
                    // Same reasoning one level down, for the lines inside.
                    "--inner-y": "18px",
                    // Inherited by those lines, which run on the same clock
                    // as the frame they sit in.
                    ...CARD_PACE,
                  } as CSSProperties
                }
              >
                {/* Hairline on near-black rather than a filled card: a solid
                    surface here would punch a bright rectangle through the
                    atmosphere the section is built on.

                    No backdrop-blur. A backdrop filter has to re-sample
                    everything behind it whenever that changes — and what is
                    behind these is a drifting particle field, a glyph field
                    and three wandering glows, so it changed every frame, in
                    eight separate regions. What it bought was a 4px blur of a
                    near-black background read through a 1.5% white fill,
                    which is to say nothing you can see. */}
                {/* `relative`, added for the stretched anchor below. Nothing
                    else about this card changed — same hairline, same fill,
                    same hover lift. */}
                <div className="group relative flex h-full flex-col rounded-2xl border border-[color:var(--hair-2)] bg-[color:var(--veil-1)] p-6 transition-[transform,background-color,border-color,box-shadow] duration-500 ease-cinematic hover:border-accent-500/25 hover:bg-[color:var(--veil-2)] hover:-translate-y-1.5 hover:shadow-[0_12px_36px_-12px_color-mix(in_oklab,var(--color-accent-500)_12%,transparent)]">
                  <span
                    className="anim-rise-inner flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--hair-2)] bg-[color:var(--veil-1)] text-accent-300 transition-colors duration-500 group-hover:border-accent-500/30 group-hover:text-accent-200"
                    style={
                      {
                        animationDelay: from(INNER.icon),
                        "--inner-y": "22px",
                      } as CSSProperties
                    }
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                      {ART[service.id]}
                    </svg>
                  </span>

                  {/* The title is the link, where the service has a page.

                      This card said "Learn more →" and was not a link — the
                      whole grid was eight divs — so the one service page that
                      exists was unreachable from the home page. That is the
                      single worst internal-linking fault a site can have: the
                      page a visitor is most likely to want next, and the page
                      most worth ranking, with nothing pointing at it from the
                      page that has all the authority.

                      The anchor goes on the h3 rather than on "Learn more"
                      because anchor text is a ranking signal and a description
                      of the destination: eight links all reading "Learn more"
                      describe nothing, where "Custom Software Development"
                      says exactly what is at the other end. The `after:`
                      utilities then stretch that anchor over the whole card,
                      so the entire tile is clickable and the visual is
                      unchanged — the pointer, the hover lift and the arrow all
                      behave exactly as they did.

                      Services without a page render the plain heading they
                      always did. A link to nowhere would be worse than none,
                      and inventing seven more routes to make the grid uniform
                      is not a decision this change gets to make. */}
                  <h3
                    className="anim-rise-inner mt-5 text-[15px] font-medium leading-snug text-fg"
                    style={{ animationDelay: from(INNER.title) }}
                  >
                    {service.href ? (
                      <Link
                        href={service.href}
                        className="after:absolute after:inset-0 after:rounded-2xl after:content-['']"
                      >
                        {service.title}
                      </Link>
                    ) : (
                      service.title
                    )}
                  </h3>

                  <p
                    className="anim-rise-inner mt-2.5 text-[13.5px] leading-relaxed text-fg/40"
                    style={{ animationDelay: from(INNER.body) }}
                  >
                    {service.body}
                  </p>

                  <span
                    className="anim-rise-inner mt-5 inline-flex items-center gap-1.5 text-[12.5px] text-fg/50 transition-colors duration-500 group-hover:text-accent-300"
                    style={{ animationDelay: from(INNER.link) }}
                  >
                    Learn more
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-500 ease-cinematic group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </span>
                </div>
              </li>
            );
          })}
        </ScrollStagger>
      </div>
    </section>
  );
}
