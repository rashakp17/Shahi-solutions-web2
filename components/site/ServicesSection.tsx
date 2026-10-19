import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { ScrollStagger } from "@/components/ui/ScrollStagger";
import { SectionAtmosphere } from "@/components/section/SectionAtmosphere";
import { SERVICES, type ServiceId } from "@/lib/services";

/**
 * Heading entrance timings (ms), relative to the section reveal (see
 * SceneCover), not page load. Cards are not on this clock: each one is
 * revealed by ScrollStagger as it enters the viewport.
 */
const TIMING = {
  heading: 0,
  headingStagger: 70,
  headingLineDelay: 30,
  headingDuration: 380,
  copy: 420,
  /** Delay between cards revealed together (e.g. one grid row). */
  cardStagger: 60,
} as const;

/**
 * Card animation durations, overriding the `.anim-rise` defaults. Tuned
 * together with the ScrollStagger rootMargin below: cards start before they
 * are on screen, so change both together.
 */
const CARD_PACE = {
  "--rise-lift": "480ms",
  "--rise-defog": "340ms",
  "--rise-fade": "300ms",
  "--rise-inner": "400ms",
} as const;

/**
 * Offsets (ms) for elements inside a card, relative to the card's reveal.
 * Scale these with CARD_PACE. `link` is currently unused.
 */
const INNER = { icon: 25, title: 70, body: 110, link: 155 } as const;

/** Adds an offset to the `--reveal-delay` that ScrollStagger sets on the card. */
const from = (offset: number) => `calc(var(--reveal-delay, 0ms) + ${offset}ms)`;

const icon = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * Icon per service. Copy lives in lib/services.ts (also used by structured
 * data). Typed as a full Record so a new service without an icon fails the build.
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
      // Keep padding small: min-h + justify-center already space the content,
      // and extra bottom padding stacks with the next section's empty top.
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

        {/* Same masked word reveal as the hero headline, smaller and faster. */}
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
          We design, build and look after the software a business runs on, from
          a first website to company-wide systems.
        </p>

        {/* 45% bottom rootMargin so cards start animating before they scroll
            into view, and a fast scroll doesn't catch them half-built.
            Keep the top at 10%: it controls when cards reset on scroll-up. */}
        <ScrollStagger
          className="mt-14 grid w-full grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4"
          stagger={TIMING.cardStagger}
          rootMargin="10% 0px 45% 0px"
          // Reveal as soon as a card enters the margin.
          inRatio={0.05}
        >
          {SERVICES.map((service) => {
            return (
              <li
                key={service.title}
                /* No blur on cards (too large to blur cheaply). See .anim-rise-flat. */
                className="anim-rise anim-rise-flat"
                style={
                  {
                    animationDelay: "var(--reveal-delay, 0ms)",
                    // Larger travel than the 14px default, which is barely
                    // visible on an object this size.
                    "--rise-y": "34px",
                    "--inner-y": "18px",
                    // Inherited by the inner elements.
                    ...CARD_PACE,
                  } as CSSProperties
                }
              >
                {/* No backdrop-blur: the animated background behind it would
                    force a re-sample every frame for no visible gain.
                    `relative` anchors the stretched title link. */}
                <div
                  data-spotlight
                  className="group relative isolate flex h-full flex-col rounded-2xl border border-[color:var(--hair-2)] bg-[color:var(--veil-1)] p-6 transition-[transform,background-color,border-color,box-shadow] duration-500 ease-cinematic hover:border-accent-500/25 hover:bg-[color:var(--veil-2)] hover:-translate-y-1.5 hover:shadow-[0_12px_36px_-12px_color-mix(in_oklab,var(--color-accent-500)_12%,transparent)]"
                >
                  {/* Cursor glow. See CardSpotlight and .spotlight-glow. */}
                  <span aria-hidden="true" className="spotlight-clip">
                    <span data-spotlight-glow className="spotlight-glow" />
                  </span>
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

                  {/* The title is the link (descriptive anchor text) when the
                      service has a page; `after:` stretches it over the card.
                      Services without a page render plain text. */}
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
                </div>
              </li>
            );
          })}
        </ScrollStagger>
      </div>
    </section>
  );
}
