"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { TechChip, type TechKey } from "@/components/site/TechMarks";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------
   Projects — a deck of cards dealt by the scroll

   Each card is `position: sticky` at its own top offset, a fraction
   lower than the one before it. Scrolling pins them one after another,
   so a card holds the screen while the next rises over it and the ones
   already dealt stay behind it as a stack of edges.

   The stacking is pure CSS and works with JavaScript switched off —
   sticky does all of it. What JS adds is the depth: how far the next
   card has come over this one, published as --pj-cover, which the
   stylesheet turns into a scale, a small lift and a dim. That is the
   only thing scrubbed off the scrollbar here, and it is scrubbed for
   the same reason the statement pane is: the effect *is* the
   connection to the scroll, and it has to give it back on the way up.
   ------------------------------------------------------------------ */

type Project = {
  title: string;
  /** Sits above the title, in caps. Keep it to three words — it is a label. */
  category: string;
  description: string;
  /**
   * What the build does, four at a time. Two columns of two: an odd count
   * leaves a hole in the grid, and more than four turns the card into a
   * feature list with a screenshot attached.
   */
  features: string[];
  /** Drawn marks, resolved from the registry in TechMarks. */
  stack: TechKey[];
  /**
   * The live site, where there is one to point at. Its presence is what turns
   * the whole card into a link — see the stretched anchor in the card below —
   * so a project without a URL stays a card that talks about the work rather
   * than one that quietly goes nowhere when clicked.
   */
  href?: string;
  /**
   * A capture of the real thing, once there is one. It wins over `art`, and if
   * the file is missing the card falls back to the drawing rather than to a
   * broken frame — so a path can be written here before the file lands.
   *
   * `clip` is a screen recording and `src` its poster. Both together is the
   * good case: the still is what the card shows until the clip is decoded and
   * visible, and it is the whole of what a reduced-motion visitor gets.
   */
  shot?: { src: string; alt: string; clip?: string };
  art: ReactNode;
};

/** A rounded bar. The previews are drawn from these and nothing else. */
function Bar({ className }: { className?: string }) {
  return <div className={cn("rounded-full bg-fg/10", className)} />;
}

function Panel({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[color:var(--hair-1)] bg-[color:var(--veil-1)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * The previews are drawn, not photographed.
 *
 * There are no screenshots in this project and no images to point at, and the
 * alternative — a stock mockup or a generated screen — would be a picture of
 * work that was never done, sitting under a heading that says this is the
 * work. These are abstract: the *shape* of each kind of build, at a size where
 * it reads as a product surface and never as a claim about a specific one.
 * Swap each one for a real screenshot as it becomes available; the frame,
 * aspect and hover are already right.
 */
const PROJECTS: Project[] = [
  {
    title: "Fetch Kids",
    category: "Personalised Kids’ E-Commerce",
    description:
      "A storefront for personalised kids’ products — name labels, bag tags and stationery sets. The customisation happens on the product page itself, with collections, wishlist and cart built around it, and delivery across India.",
    features: [
      "Product Customisation",
      "Collections & Wishlist",
      "Cart & Checkout",
      "Pan-India Delivery",
    ],
    // The features are observable from the live site. The stack is not — it is
    // the one taken from the layout brief, so correct it here if the real build
    // differs; nothing else has to change when it does.
    stack: ["react", "node", "mongodb", "tailwind", "stripe"],
    href: "https://www.fetchkids.in/",
    shot: {
      src: "/projects/fetch-kids.png",
      clip: "/projects/fetch-kids.mp4",
      alt: "The Fetch Kids storefront: a personalised lunchbox, bottle and name-label set above a row of delivery and quality promises.",
    },
    art: (
      <div className="grid h-full grid-cols-3 gap-2.5">
        <Panel className="col-span-3 flex flex-col justify-center p-4">
          <Bar className="h-2 w-28 bg-fg/16" />
          <Bar className="mt-2 h-2 w-16 bg-[color:var(--veil-4)]" />
          <div className="mt-3.5 h-6 w-24 rounded-full bg-accent-500/25" />
        </Panel>
        {[0, 1, 2].map((i) => (
          <Panel key={i} className="p-2.5">
            <div className="h-10 rounded-lg bg-[color:var(--veil-3)] sm:h-12" />
            <Bar className="mt-2.5 h-1.5 w-full" />
            <Bar className="mt-1.5 h-1.5 w-2/3 bg-[color:var(--veil-3)]" />
          </Panel>
        ))}
      </div>
    ),
  },
  {
    title: "MOODbyTEAL",
    category: "Interior Design Studio",
    description:
      "The studio site for Teal Culture, an interiors and turnkey fit-out practice working across India and the UAE. Dark, cinematic and scroll-led: the hero is a room the visitor walks into, and the services, philosophy and work all unfold from it in one continuous descent.",
    features: [
      "Cinematic Video Hero",
      "Scroll-Driven Motion",
      "Work & Studio Pages",
      "WhatsApp Enquiries",
    ],
    // Same caveat as Fetch Kids: the features are observable on the live site,
    // the stack is inferred from what a motion-led build of this kind takes.
    // Correct it here if the real build differs.
    stack: ["next", "react", "tailwind", "vercel"],
    href: "https://moodbyteal.com/",
    shot: {
      src: "/projects/mood-by-teal.png",
      clip: "/projects/mood-by-teal.mp4",
      alt: "The MOODbyTEAL home page: the studio's wordmark across a glass wall, with a dark fitted-out office visible through it.",
    },
    art: (
      <div className="flex h-full flex-col gap-2.5">
        <Panel className="flex items-center gap-2 px-4 py-3">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-400/70" />
          <Bar className="h-1.5 w-12 bg-fg/14" />
          <div className="ml-auto flex gap-2">
            <Bar className="h-1.5 w-8 bg-[color:var(--veil-3)]" />
            <Bar className="h-1.5 w-8 bg-[color:var(--veil-3)]" />
            <Bar className="h-1.5 w-8 bg-[color:var(--veil-3)]" />
          </div>
        </Panel>
        <Panel className="flex flex-1 flex-col justify-center p-5">
          <Bar className="h-2.5 w-3/5 bg-fg/18" />
          <Bar className="mt-2.5 h-2.5 w-2/5 bg-fg/12" />
        </Panel>
        <div className="grid grid-cols-3 gap-2.5">
          {[0, 1, 2].map((i) => (
            <Panel key={i} className="p-2.5">
              <Bar className="h-1.5 w-full bg-[color:var(--veil-4)]" />
              <Bar className="mt-1.5 h-1.5 w-1/2 bg-[color:var(--veil-3)]" />
            </Panel>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Emarath ERP",
    category: "Enterprise Resource Planning System",
    description:
      "A comprehensive ERP platform that unifies core business operations — inventory, procurement, finance, HR and reporting — into a single system. Role-based access control, real-time dashboards and automated workflows throughout.",
    features: [
      "Inventory & Procurement",
      "Finance & HR Modules",
      "Role-Based Access",
      "Real-Time Dashboards",
    ],
    stack: ["react", "node", "postgres"],
    // Paths written before the files exist, on purpose: Shot swaps back to the
    // drawing below on the first onError, so the card is correct today and
    // correct again the moment the capture is dropped in (see the note on
    // `shot` in the Project type). Nothing here changes when it lands.
    shot: {
      src: "/projects/emarath-erp.png",
      clip: "/projects/emarath-erp.mp4",
      alt: "The Emarath ERP dashboard: revenue and expense totals across the top, a trend chart, and a task summary beside a list of recent entries.",
    },
    art: (
      <div className="flex h-full gap-2.5">
        <Panel className="hidden w-24 shrink-0 flex-col gap-2 p-3 sm:flex">
          {[0.16, 0.07, 0.07, 0.07, 0.07].map((o, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full bg-fg"
              style={{ opacity: o, width: i === 0 ? "100%" : "70%" }}
            />
          ))}
        </Panel>
        <Panel className="flex min-w-0 flex-1 flex-col gap-2 p-3">
          <div className="flex gap-2">
            <Bar className="h-1.5 flex-1 bg-fg/14" />
            <Bar className="h-1.5 w-10 bg-fg/14" />
            <Bar className="h-1.5 w-8 bg-fg/14" />
          </div>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-2 border-t border-[color:var(--hair-1)] pt-2"
            >
              <Bar className="h-1.5 flex-1 bg-[color:var(--veil-3)]" />
              <Bar className="h-1.5 w-10 bg-[color:var(--veil-3)]" />
              <span
                className={cn(
                  "h-1.5 w-8 rounded-full",
                  i % 3 === 0 ? "bg-accent-500/35" : "bg-[color:var(--veil-3)]",
                )}
              />
            </div>
          ))}
        </Panel>
      </div>
    ),
  },
  {
    title: "Fleet Management",
    category: "Logistics & Vehicle Tracking",
    description:
      "A fleet solution for tracking vehicles, drivers, trips and maintenance schedules in real time. Live GPS, fuel and expense monitoring, automated service alerts, and the analytics to cut operating cost rather than just report it.",
    features: [
      "Live GPS Tracking",
      "Driver & Trip Logs",
      "Maintenance Alerts",
      "Fuel & Expense Reports",
    ],
    stack: ["react", "node", "gps", "analytics"],
    shot: {
      src: "/projects/fleet-management.png",
      clip: "/projects/fleet-management.mp4",
      alt: "The Fleet Management console: a live map of vehicle positions across a coastline, with a per-vehicle status list down the left.",
    },
    art: (
      <div className="flex h-full flex-col gap-2.5">
        <div className="grid grid-cols-3 gap-2.5">
          {[0, 1, 2].map((i) => (
            <Panel key={i} className="p-3">
              <Bar className="h-1.5 w-10 bg-[color:var(--veil-3)]" />
              <Bar className="mt-2 h-2.5 w-14 bg-fg/18" />
            </Panel>
          ))}
        </div>
        <Panel className="flex flex-1 items-end gap-1.5 p-3 sm:gap-2">
          {[38, 62, 45, 78, 54, 88, 70, 96].map((h, i) => (
            <div
              key={i}
              className={cn(
                "min-w-0 flex-1 rounded-t-[3px]",
                i === 7 ? "bg-accent-500/50" : "bg-[color:var(--veil-4)]",
              )}
              style={{ height: `${h}%` }}
            />
          ))}
        </Panel>
      </div>
    ),
  },
  {
    title: "VRS Real Invest",
    category: "Real Estate Website",
    description:
      "A professional real estate site built around property investment opportunities, company services and consultation booking — a clean, unhurried experience whose whole job is turning an interested visitor into an enquiry.",
    features: [
      "Property Showcase",
      "Investment Enquiries",
      "Consultation Booking",
      "SEO & Responsive Build",
    ],
    stack: ["react", "tailwind", "vercel"],
    shot: {
      src: "/projects/vrs-real-invest.png",
      clip: "/projects/vrs-real-invest.mp4",
      alt: "The VRS Real Invest home page: a featured luxury portfolio of properties beside an investment performance dashboard.",
    },
    art: (
      <div className="flex h-full flex-col gap-2.5">
        <Panel className="flex flex-1 flex-col items-center justify-center p-5">
          <Bar className="h-2.5 w-2/3 bg-fg/18" />
          <Bar className="mt-2.5 h-2 w-2/5 bg-[color:var(--veil-4)]" />
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-20 rounded-full bg-fg/85" />
            <div className="h-6 w-20 rounded-full border border-fg/12" />
          </div>
        </Panel>
        <div className="grid grid-cols-4 gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <Panel key={i} className="flex items-end justify-center p-2.5">
              <div
                className={cn(
                  "w-full rounded-t-[3px]",
                  i === 3 ? "bg-accent-500/45" : "bg-[color:var(--veil-3)]",
                )}
                style={{ height: `${28 + i * 18}%` }}
              />
            </Panel>
          ))}
        </div>
      </div>
    ),
  },
];

/**
 * The right-hand panel: the capture where there is one, the drawing where
 * there is not.
 *
 * The onError swap is the point of the component. A file referenced before it
 * exists would otherwise leave a card with an empty frame in the loudest
 * position on it; this way the drawing is still the floor, and the only thing
 * a missing file costs is the photograph.
 *
 * The clip plays only while its card is on screen. A muted loop is cheap to
 * hold but not cheap to decode, and a deck of five of them all running behind
 * each other is five decodes for one visible card — so the observer starts it
 * on arrival and pauses it on the way out. `preload="none"` keeps the same
 * promise for the network: nothing is fetched for a card the visitor may never
 * reach, and the poster is what stands in until it is.
 */
function Preview({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const shot = failed ? undefined : project.shot;
  const clip = shot?.clip;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reduced motion keeps the poster and nothing else. The clip is a site
    // scrolling itself — there is no way to show it calmly, and the still
    // frame already says what the card needs it to say.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const view = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Autoplay can still be refused (a data-saver setting, a policy this
          // page cannot see). Nothing to recover — the poster is underneath.
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    view.observe(video);
    return () => view.disconnect();
  }, [clip]);

  return (
    <div className={cn("pj-art", shot && "pj-art--shot")}>
      <div className="pj-art-in">
        {shot ? (
          clip ? (
            <video
              ref={videoRef}
              className="pj-shot"
              poster={shot.src}
              muted
              loop
              playsInline
              preload="none"
              /* Decoration inside a card that is itself one big link: controls
                 here would be a second thing to click in the same box. The
                 alt text the still carries is on the card's own link. */
              aria-hidden="true"
              tabIndex={-1}
              onError={() => setFailed(true)}
            >
              <source src={clip} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              /* Roughly what the panel occupies at each break — the column is
                 1.2fr of a 72rem grid on desktop and the full width below it. */
              sizes="(min-width: 1024px) 46vw, 92vw"
              className="pj-shot"
              onError={() => setFailed(true)}
            />
          )
        ) : (
          project.art
        )}
      </div>
    </div>
  );
}

/** The tick beside every feature. Same figure as the eyebrow dot elsewhere. */
function Check() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="h-3.5 w-3.5 flex-none"
    >
      <circle
        cx="8"
        cy="8"
        r="6.9"
        strokeWidth="1.1"
        className="stroke-accent-500/45"
      />
      <path
        d="M5.1 8.2 7 10.1l3.9-4.2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-accent-300"
      />
    </svg>
  );
}

/** `out` turns the arrow up and to the right — the one that means "leaves here". */
function Arrow({ out = false }: { out?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      data-out={out ? "" : undefined}
      className="pj-arrow h-3.5 w-3.5"
    >
      <path
        d={out ? "M5 11 11 5M5.5 5H11v5.5" : "M3.5 8h9M8.5 4l4 4-4 4"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProjectsSection() {
  const deckRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    const slots = Array.from(
      deck.querySelectorAll<HTMLElement>("[data-pj-slot]"),
    );
    if (slots.length < 2) return;

    const cards = slots.map((slot) =>
      slot.querySelector<HTMLElement>("[data-pj-card]"),
    );

    // The stack is CSS. This only adds the depth cues on top of it, so with
    // motion turned down the cards still deal themselves — they just do it
    // without shrinking or dimming as they go.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /**
     * Measured once and on resize, not per frame. `top` is each card's sticky
     * offset, which is what the pair of them settles at; height is how far the
     * next card has to travel to cover this one.
     */
    let tops: number[] = [];
    let heights: number[] = [];

    const measure = () => {
      tops = slots.map((slot) => parseFloat(getComputedStyle(slot).top) || 0);
      heights = slots.map((slot) => slot.offsetHeight || 1);
    };

    let frame = 0;
    let onScreen = true;
    const published = new Array(slots.length).fill(-1);

    const read = () => {
      frame = 0;

      // Every rect first, then every write. Interleaving them makes the
      // browser flush layout between each pair, which is the difference
      // between one measurement and five.
      const positions = slots.map(
        (slot) => slot.getBoundingClientRect().top,
      );

      for (let i = 0; i < slots.length - 1; i++) {
        const step = tops[i + 1] - tops[i];
        const height = heights[i];

        // Distance between this card's top edge and the next one's. It closes
        // from a card-height-plus-gap down to `step` as the next card arrives
        // and pins, and the last `height` of that closing is the ramp.
        const gap = positions[i + 1] - positions[i];
        const raw = (height - (gap - step)) / height;
        const cover = raw < 0 ? 0 : raw > 1 ? 1 : raw;

        // Three decimal places is finer than a pixel at these sizes, and
        // skipping unchanged values keeps a slow drag from restyling the
        // whole deck on every frame it does not move.
        const value = Math.round(cover * 1000) / 1000;
        if (value === published[i]) continue;
        published[i] = value;
        cards[i]?.style.setProperty("--pj-cover", String(value));
      }
    };

    const onScroll = () => {
      if (frame || !onScreen) return;
      frame = requestAnimationFrame(read);
    };

    const onResize = () => {
      measure();
      published.fill(-1);
      onScroll();
    };

    // Nothing is read while the deck is nowhere near the viewport. The handler
    // is passive and cheap, but it is still five rects a frame for a section
    // that is three screens away.
    const view = new IntersectionObserver(
      (entries) => {
        onScreen = entries[entries.length - 1].isIntersecting;
        if (onScreen) onScroll();
      },
      { rootMargin: "25%" },
    );
    view.observe(deck);

    measure();
    read();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      view.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="projects" className="pj-scope relative isolate">
      {/* A raised ground, a step lighter than the sections either side of it.
          The brief asked for dark cards on a light page and this site does not
          have a light page — so the relationship is kept and the values are
          not: the deck sits on the lightest surface on the site and the cards
          are the darkest thing on it. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,var(--ground-4)_0%,var(--ground-4)_46%,var(--ground)_100%)]" />
        <div className="bg-grain absolute inset-0 opacity-[0.02]" />
      </div>

      {/* Back to a section rhythm. The tall pt here was clearing the fixed
          navbar while the work had a page of its own; mid-page that job belongs
          to scroll-margin-top (see globals.css) and this is just the space
          above a heading. */}
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        {/* ---- heading ---- */}
        <div className="max-w-2xl">
          <p className="anim-rise inline-flex items-center rounded-full border border-[color:var(--hair-2)] bg-[color:var(--veil-2)] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-fg/45">
            Our work
          </p>

          {/* h2. It was an h1 while the work had a page of its own; on the
              single page the hero's headline is the only h1 there is. */}
          <BlurReveal
            as="h2"
            lines={[{ text: "Things we have" }, { text: "built", accent: true }]}
            stagger={120}
            duration={640}
            blurScale={1.4}
            className="pj-heading mt-6 text-[clamp(2.2rem,5.4vw,3.75rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-fg"
          />

          <p className="anim-rise mt-5 max-w-md text-[14.5px] leading-relaxed text-fg/45">
            Five kinds of build, and the shape each one takes. Scroll to deal
            through them.
          </p>
        </div>

        {/* ---- the deck ---- */}
        <div ref={deckRef} className="pj-deck mt-14 sm:mt-16">
          {PROJECTS.map((project, i) => (
            <div
              key={project.title}
              data-pj-slot
              className="pj-slot"
              style={{ "--i": i } as CSSProperties}
            >
              <article data-pj-card className="pj-card group">
                <div className="pj-grid">
                  {/* ---- copy ---- */}
                  <div className="flex min-w-0 flex-col">
                    {/* The index and its rule. In the column rather than in a
                        corner of the card: read as the first line of the copy
                        it numbers, it says which of five this is; floated in
                        the margin it was decoration. */}
                    <span aria-hidden="true" className="pj-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <p className="pj-cat">{project.category}</p>

                    <h3 className="pj-title">{project.title}</h3>

                    <p className="pj-desc">{project.description}</p>

                    <ul className="pj-features">
                      {project.features.map((feature) => (
                        <li key={feature} className="pj-feature">
                          <Check />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* ---- stack ----
                        Below a rule and under its own label, because it
                        answers a different question from everything above it:
                        the copy is what the thing does, this is what it is
                        made of. */}
                    <div className="pj-stack">
                      <p className="pj-stack-label">Technologies used</p>
                      <ul className="pj-chips">
                        {project.stack.map((tech) => (
                          <TechChip key={tech} tech={tech} />
                        ))}
                      </ul>
                    </div>

                    {/* Pushed to the bottom of the column so the action sits on
                        the same line on every card, whatever the copy above it
                        does.

                        One link per card, and it is stretched over the whole
                        card by a pseudo-element (see .pj-cta::after). That is
                        what makes clicking anywhere on the card work without
                        nesting a second anchor inside the first — which is
                        invalid, and which browsers resolve by guessing. */}
                    {project.href ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        className="pj-cta mt-7 lg:mt-auto lg:pt-7"
                      >
                        <span className="pj-cta-label">
                          View Project
                          <span className="sr-only"> (opens in a new tab)</span>
                        </span>
                        <span aria-hidden="true" className="pj-cta-rule" />
                        <Arrow out />
                      </a>
                    ) : (
                      <a
                        href="#contact"
                        className="pj-cta mt-7 lg:mt-auto lg:pt-7"
                      >
                        <span className="pj-cta-label">View Project</span>
                        <span aria-hidden="true" className="pj-cta-rule" />
                        <Arrow />
                      </a>
                    )}
                  </div>

                  {/* ---- preview ---- */}
                  <Preview project={project} />
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
