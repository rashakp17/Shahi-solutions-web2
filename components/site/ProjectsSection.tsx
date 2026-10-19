"use client";

import type { CSSProperties, ReactNode } from "react";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { ProjectDeckScrub } from "@/components/site/ProjectDeckScrub";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TechChip, type TechKey } from "@/components/site/TechMarks";
import { cn } from "@/lib/cn";

/* Kept as a client component on purpose. As a server component the rendered
 * tree is serialised into the flight payload, which measured ~8KB gzipped on
 * the document to save ~2.5KB of JS. Re-measure before moving the boundary. */

/* Projects: a deck of sticky cards, each pinned slightly lower than the last.
   Stacking is pure CSS. ProjectDeckScrub adds depth by publishing --pj-cover
   (how far the next card covers this one), which the CSS turns into scale,
   lift and dim. */

type Project = {
  title: string;
  /** Short label above the title, shown in caps. Keep it to ~3 words. */
  category: string;
  description: string;
  /** Exactly four: the grid is two columns of two. */
  features: string[];
  /** Keys into the TechMarks registry. */
  stack: TechKey[];
  /** Live site. When set, the whole card becomes a link. */
  href?: string;
  /**
   * Real capture; takes priority over `art`, and falls back to `art` if the
   * file fails to load. `clip` is a screen recording, `src` its poster.
   * A clip without a poster shows `art` until it mounts, and reduced-motion
   * users keep `art`.
   */
  shot?: { src?: string; alt: string; clip?: string };
  art: ReactNode;
};

/** Rounded placeholder bar used to draw the previews. */
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
 * `art` is an abstract drawing of each build, used until a real capture
 * (`shot`) is available. Avoid stock mockups here.
 */
const PROJECTS: Project[] = [
  {
    title: "Fetch Kids",
    category: "Personalised Kids’ E-Commerce",
    description:
      "A storefront for personalised kids’ products: name labels, bag tags and stationery sets. Customers personalise items right on the product page, with collections, wishlist and cart built around it, and delivery across India.",
    features: [
      "Product Customisation",
      "Collections & Wishlist",
      "Cart & Checkout",
      "Pan-India Delivery",
    ],
    // Stack comes from the brief, not the live site. Correct if it differs.
    stack: ["react", "node", "mongodb", "tailwind", "stripe"],
    href: "https://www.fetchkids.in/",
    shot: {
      src: "/projects/fetch-kids.webp",
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
      "The studio site for Teal Culture, an interiors and turnkey fit-out practice working across India and the UAE. The site is dark and cinematic: the opening video puts the visitor inside a room, and the services, philosophy and portfolio follow as they scroll.",
    features: [
      "Cinematic Video Hero",
      "Scroll-Driven Motion",
      "Work & Studio Pages",
      "WhatsApp Enquiries",
    ],
    // Stack is inferred, not confirmed. Correct if it differs.
    stack: ["next", "react", "tailwind", "vercel"],
    href: "https://moodbyteal.com/",
    shot: {
      src: "/projects/mood-by-teal.webp",
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
      "An ERP platform that brings inventory, procurement, finance, HR and reporting into a single system, with role-based access, live dashboards and automated workflows.",
    features: [
      "Inventory & Procurement",
      "Finance & HR Modules",
      "Role-Based Access",
      "Real-Time Dashboards",
    ],
    stack: ["react", "node", "postgres"],
    // Still only. Don't add a `clip` unless the recording exists, or a dead
    // <video> mounts over the still.
    shot: {
      src: "/projects/emarath-erp.jpeg",
      alt: "The Emarath ERP sales dashboard: a row of lead and follow-up counters above a team activity board, with revenue and conversion totals beside a leaderboard of the sales team.",
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
      "A fleet system for tracking vehicles, drivers, trips and maintenance in real time, with live GPS, fuel and expense monitoring, automatic service alerts, and analytics that help bring running costs down.",
    features: [
      "Live GPS Tracking",
      "Driver & Trip Logs",
      "Maintenance Alerts",
      "Fuel & Expense Reports",
    ],
    stack: ["react", "node", "gps", "analytics"],
    /* Still only, same as Emarath. */
    shot: {
      src: "/projects/fleet-management.jpeg",
      alt: "The Fleet Management console: a live tracking map of vehicle positions along the Kerala coast, with a searchable per-vehicle list of registrations, speeds and online status down the left.",
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
      "A real estate website presenting property investment opportunities, the company’s services and consultation booking, designed to make it easy for interested visitors to get in touch.",
    features: [
      "Property Showcase",
      "Investment Enquiries",
      "Consultation Booking",
      "SEO & Responsive Build",
    ],
    stack: ["react", "tailwind", "vercel"],
    href: "https://vrsrealinvest.com.au/",
    /* Clip only, no poster yet. */
    shot: {
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

/** Mount a clip one viewport before its card arrives, to give it time to load. */
const ARM_MARGIN = "100% 0px";

/**
 * Card preview: the capture if there is one, otherwise the drawing. onError
 * falls back to the drawing so a missing file never leaves an empty frame.
 *
 * The clip has two gates. `armed` delays mounting the <video> until the card
 * is near, because the poster is fetched on parse regardless of `preload`.
 * A second observer plays/pauses it so only visible clips decode.
 * Before arming (and always under reduced motion) the still is shown via
 * next/image so it gets optimised.
 */
function Preview({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  const [armed, setArmed] = useState(false);
  const holderRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const shot = failed ? undefined : project.shot;
  const clip = shot?.clip;

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder || !clip) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const view = new IntersectionObserver(
      (entries) => {
        if (!entries[entries.length - 1].isIntersecting) return;
        // One-shot: once armed, the clip stays mounted.
        view.disconnect();
        setArmed(true);
      },
      { rootMargin: ARM_MARGIN },
    );

    view.observe(holder);
    return () => view.disconnect();
  }, [clip]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const view = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Autoplay may be refused; the still stays visible, so ignore it.
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    view.observe(video);
    return () => view.disconnect();
  }, [armed]);

  // A shot can be a clip, a still, or both. Only apply .pj-art--shot (which
  // removes the frame's padding) when a capture is actually rendered.
  const showingShot = Boolean((clip && armed) || shot?.src);

  return (
    <div ref={holderRef} className={cn("pj-art", showingShot && "pj-art--shot")}>
      <div className="pj-art-in">
        {clip && armed ? (
          <video
            ref={videoRef}
            className="pj-shot"
            poster={shot?.src}
            muted
            loop
            playsInline
            preload="none"
            /* Decorative: the card is already a link, so no controls or focus. */
            aria-hidden="true"
            tabIndex={-1}
            onError={() => setFailed(true)}
          >
            <source src={clip} type="video/mp4" />
          </video>
        ) : shot?.src ? (
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            /* Panel is 1.2fr of a 72rem grid on desktop, full width below. */
            sizes="(min-width: 1024px) 46vw, 92vw"
            className="pj-shot"
            onError={() => setFailed(true)}
          />
        ) : (
          project.art
        )}
      </div>
    </div>
  );
}

/** Check mark shown beside each feature. */
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

/** `out` points the arrow up-right, for external links. */
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
  return (
    <section id="projects" className="pj-scope relative isolate">
      {/* Background a step lighter than neighbouring sections so the dark
          cards stand out. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,var(--ground-4)_0%,var(--ground-4)_46%,var(--ground)_100%)]" />
        <div className="bg-grain absolute inset-0 opacity-[0.02]" />
      </div>

      {/* Navbar offset for anchor links is handled by scroll-margin-top in
          globals.css. */}
<div className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        {/* ---- heading ---- */}
        <div className="max-w-2xl">
          <p className="anim-rise inline-flex items-center rounded-full border border-[color:var(--hair-2)] bg-[color:var(--veil-2)] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-fg/45">
            Our work
          </p>

          {/* h2: the hero headline is the page's only h1. */}
          <BlurReveal
            as="h2"
            lines={[{ text: "Things we have" }, { text: "built", accent: true }]}
            stagger={120}
            duration={640}
            blurScale={1.4}
            className="pj-heading mt-6 text-[clamp(2.2rem,5.4vw,3.75rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-fg"
          />

          <p className="anim-rise mt-5 max-w-md text-[14.5px] leading-relaxed text-fg/45">
            Five projects, each a different kind of build. Scroll to move
            through them.
          </p>
        </div>

        {/* ---- the deck ----
            ProjectDeckScrub finds the deck via `data-pj-deck`. */}
        <ProjectDeckScrub />
        <div data-pj-deck className="pj-deck mt-14 sm:mt-16">
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
                    {/* Card index, e.g. "01". */}
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

                    {/* ---- stack ---- */}
                    <div className="pj-stack">
                      <p className="pj-stack-label">Technologies used</p>
                      <ul className="pj-chips">
                        {project.stack.map((tech) => (
                          <TechChip key={tech} tech={tech} />
                        ))}
                      </ul>
                    </div>

                    {/* mt-auto keeps the CTA aligned at the bottom across cards.
                        .pj-cta::after stretches the link over the whole card,
                        avoiding nested anchors. No `href` means no CTA (the
                        internal builds have nothing public to link to). */}
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
                    ) : null}
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
