"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { FounderSlider } from "@/components/site/FounderSlider";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { ScrollStagger } from "@/components/ui/ScrollStagger";
import { cn } from "@/lib/cn";

/* Founder section: three portrait panels in a row. The hovered panel widens
   (founder by default); the others share the remaining width. The founder
   always keeps the white label plate and key light, whichever panel is open.

   Widening moves a panel's edges away from the cursor, so hover can't
   flicker and no hit-zone logic is needed. Below md, a slider is used. */

type Person = {
  name: string;
  role: string;
  /** Path under `public/team/`. Falls back to a monogram if it fails to load. */
  photo?: string;
  /**
   * `object-position` for the face. Open panels crop top/bottom, closed ones
   * crop the sides, so off-centre faces need this. Defaults via `.fd-photo`.
   */
  focus?: string;
};

/* Portraits are cropped to a 0.654 aspect around the face before export so
   all panels crop consistently. New photos: crop, convert, then set `focus`. */

/**
 * Left-to-right row order; `FOUNDER_AT` marks the founder. Designed for
 * three: with four, closed panels get too narrow for the names.
 */
const PEOPLE: Person[] = [
  {
    name: "Adarsha K",
    role: "Co-Founder & CEO",
    photo: "/team/adarsha-k.jpg",
    focus: "34% 20%",
  },
  {
    name: "Shahi Rahman MP",
    role: "Founder & MD",
    photo: "/team/shahi-rahman.jpg",
    focus: "40% 22%",
  },
  {
    name: "Jaseem CA",
    role: "Co-Founder & CCO",
    photo: "/team/jaseem-ca.jpg",
    focus: "50% 26%",
  },
];

/**
 * Index of the founder in PEOPLE: open by default and always styled as lead.
 * Middle position keeps the row balanced when it's open.
 */
const FOUNDER_AT = 1;

/** Float animation per panel; different periods keep them out of sync. */
const FLOAT = [
  { lift: "3px", duration: "14s", delay: "-4s" },
  { lift: "4px", duration: "12s", delay: "-3s" },
  { lift: "3.5px", duration: "13.5s", delay: "-8s" },
];

/** Intro timings (ms), shared with other section headings. */
const INTRO = {
  eyebrow: 0,
  eyebrowLift: 320,
  heading: 90,
  headingStagger: 75,
  headingDuration: 480,
  copy: 440,
  copyLift: 420,
} as const;

const from = (offset: number) => `calc(var(--reveal-delay, 0ms) + ${offset}ms)`;

/**
 * Photo, or a monogram if it's missing or fails to load.
 * Initials use the first and last word ("Sudhesh K. Valappil" -> SV).
 */
function Portrait({ person }: { person: Person }) {
  const [failed, setFailed] = useState(false);
  const photo = failed ? undefined : person.photo;

  const words = person.name.split(" ").filter(Boolean);
  const initials = [words[0], words[words.length - 1]]
    .map((word) => word?.[0] ?? "")
    .join("");

  return (
    <div className="fd-portrait">
      {photo ? (
        <Image
          src={photo}
          alt={`${person.name}, ${person.role}`}
          fill
          /* 460px covers the open panel at its widest (2.2/4.2 of a 46em
             row); closed panels are smaller. */
          sizes="(min-width: 768px) 460px, 90vw"
          className="fd-photo"
          style={person.focus ? { objectPosition: person.focus } : undefined}
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true" className="fd-mono">
          {initials}
        </span>
      )}
    </div>
  );
}

/** A person's card. `lead` (founder only) uses the white label plate. */
function Card({ person, lead = false }: { person: Person; lead?: boolean }) {
  return (
    <figure className={cn("fd-card", lead && "fd-card--lead")}>
      <Portrait person={person} />

      {/* Overlaid on the bottom of the portrait. */}
      <figcaption className="fd-label">
        <span className="fd-name">{person.name}</span>
        <span className="fd-role">{person.role}</span>
      </figcaption>
    </figure>
  );
}

export function FounderSection() {
  /**
   * Index of the open panel; resets to the founder on pointer leave.
   * Not focusable or announced: all content is visible regardless of which
   * panel is open, so this is purely visual.
   */
  const [open, setOpen] = useState(FOUNDER_AT);

  return (
    <section
      id="about"
      data-motion-scope
      className="fd-scope relative isolate overflow-hidden bg-ink-950 pt-12 pb-20 sm:pt-14 sm:pb-24"
    >
      {/* Background gradient and grain. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_38%,var(--ground-4)_0%,var(--ground)_50%,var(--ground-deep)_100%)]" />
        <div className="bg-grain absolute inset-0 opacity-[0.02]" />
      </div>

      {/* ---- heading ---- */}
      <ScrollStagger
        as="div"
        inRatio={0.2}
        className="relative z-10 mx-auto max-w-[34rem] px-5 text-center"
      >
        <div>
          <p
            className="anim-rise inline-flex items-center rounded-full border border-[color:var(--hair-2)] bg-[color:var(--veil-2)] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-fg/45 backdrop-blur-sm"
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
            Our team
          </p>

          {/* h2: the hero headline is the page's only h1. Uppercase with
              positive tracking via .fd-heading, unlike other headings. */}
          <BlurReveal
            as="h2"
            lines={[{ text: "Meet our" }, { text: "leadership", accent: true }]}
            delay={INTRO.heading}
            lineDelay={40}
            stagger={INTRO.headingStagger}
            duration={INTRO.headingDuration}
            blurScale={1.45}
            fromReveal
            className="fd-heading mt-6 text-[clamp(1.9rem,4.4vw,3.1rem)] font-semibold leading-[1.06] text-fg"
          />

          <p
            className="anim-rise mx-auto mt-5 max-w-[24rem] text-[14px] leading-relaxed text-fg/45"
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
            The people who run Shahi Solutions.
          </p>
        </div>
      </ScrollStagger>

      {/* ============ the row, md and up ============ */}
      <div
        className="fd-rig relative z-10 mt-14 hidden px-5 md:block"
        /* Reset on the wrapper, not each panel, so crossing the gap between
           panels doesn't snap back to the founder. */
        onPointerLeave={() => setOpen(FOUNDER_AT)}
      >
        {/* ScrollStagger delays follow DOM order (left to right). */}
        <ScrollStagger as="ul" stagger={130} inRatio={0.15} className="fd-row">
          {PEOPLE.map((person, i) => {
            const lead = i === FOUNDER_AT;

            return (
              <li
                key={`${person.name}-${person.role}`}
                className="fd-panel"
                /* CSS keys the wider flex-grow off `data-open`. */
                data-open={i === open ? "" : undefined}
                onPointerEnter={() => setOpen(i)}
              >
                <div
                  className="fd-float"
                  style={
                    {
                      "--fd-lift": FLOAT[i].lift,
                      "--fd-float-dur": FLOAT[i].duration,
                      "--fd-float-delay": FLOAT[i].delay,
                    } as CSSProperties
                  }
                >
                  {/* Key light follows the founder, not the open panel. */}
                  {lead ? <span aria-hidden="true" className="fd-core" /> : null}

                  {/* Founder scales in; the others slide in from their side. */}
                  <div
                    className="fd-in"
                    style={
                      lead
                        ? ({
                            "--fd-from-s": "0.94",
                            "--fd-from-y": "22px",
                          } as CSSProperties)
                        : ({
                            "--fd-from-x": i < FOUNDER_AT ? "-46px" : "46px",
                            "--fd-from-y": "10px",
                          } as CSSProperties)
                    }
                  >
                    <Card person={person} lead={lead} />
                  </div>
                </div>
              </li>
            );
          })}
        </ScrollStagger>
      </div>

      {/* ============ below md ============
          Auto-advancing slider, founder first.

          ScrollStagger wraps the whole slider, not each card: off-screen
          slides never intersect, so per-card gating would leave them at
          opacity 0. */}
      <ScrollStagger
        as="div"
        inRatio={0.12}
        className="relative z-10 mt-12 block md:hidden"
      >
        <div>
          <FounderSlider
            label="Leadership team"
            className="fd-column mx-auto max-w-[24rem] px-4"
          >
            {[
              PEOPLE[FOUNDER_AT],
              ...PEOPLE.filter((_, i) => i !== FOUNDER_AT),
            ].map((person, i) => (
              <div
                key={`${person.name}-${person.role}`}
                className="fd-in"
                style={
                  {
                    "--fd-from-s": "0.96",
                    "--fd-from-y": "16px",
                  } as CSSProperties
                }
              >
                <Card person={person} lead={i === 0} />
              </div>
            ))}
          </FounderSlider>
        </div>
      </ScrollStagger>
    </section>
  );
}
