"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { FounderSlider } from "@/components/site/FounderSlider";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { ScrollStagger } from "@/components/ui/ScrollStagger";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------
   Founder — three panels sharing a width, one of them open

   Three portraits in a row. The open one takes a little over half the
   row and the other two split what is left; at rest the open one is
   the founder, and pointing at either of the others hands it to them.
   Nothing is positioned, nothing overlaps and nothing travels — the
   only thing that changes is how the width is divided.

   ── Why the founder is not simply "the wide one" ──
   Any panel can be open, so width alone can no longer say who the
   section is about. The founder keeps the white plate and the key
   light wherever it sits and the other two never get either. Width
   says who is being looked at; the plate says whose page this is.

   ── Why there is no hit-zone machinery here ──
   This was a ring that rotated the pointed-at card to the front, and
   it needed two invisible fixed zones and a re-entry guard to survive
   its own interaction: promoting a card moved that card out from under
   the cursor, which drops the hover, which brings it back, at frame
   rate. It is the trap documented on .tm-slot — nothing about hover
   may move the surface hover is tested against.

   Expanding inverts that. Pointing at a panel makes the panel wider,
   so both its edges travel *away* from the cursor and the pointer that
   began the hover is still inside it. The interaction cannot chase
   itself, so the pointer touches the real panels and the zones, the
   guard and the ellipse are all gone.

   The one thing kept from the ring is where the reset lives: on the
   wrapper rather than on each panel, so crossing the gap between two
   panels does not collapse the row back to the founder and start an
   animation nobody asked for.

   Below md the row is abandoned rather than squeezed — the founder
   goes first at full width and the pair falls into a two-up
   underneath. Three panels inside 375px are three spines, and there is
   no hover on a touch screen to open them anyway.
   ------------------------------------------------------------------ */

type Person = {
  name: string;
  role: string;
  /**
   * A real photograph, once there is one. Drop the file in
   * `public/team/` and point at it here — the frame, aspect and
   * lighting are already right, and the monogram below stops being
   * drawn the moment a path resolves.
   *
   * Missing files fall back rather than break: a path can be written
   * here before the image lands (same contract as the project shots).
   */
  photo?: string;
  /**
   * Where the face is in the frame, as an `object-position`. Optional —
   * `.fd-photo` carries a sensible default.
   *
   * Worth setting per person because the crop is not fixed: an open
   * panel is nearly square and crops the photograph top and bottom,
   * while a closed one is a third of that width and crops it hard from
   * the sides. A face sitting off-centre survives the first and can be
   * clipped by the second, and the two portraits here both sit left of
   * their frame's middle. The horizontal figure only bites while the
   * panel is closed; the vertical one only while it is open.
   */
  focus?: string;
};

/* ---- THE PORTRAITS ------------------------------------------------

   All three are real now, and all three were prepared the same way:
   converted out of `media/`, held to one aspect (0.654) so the row
   crops consistently, and given a `focus` matched to where the face
   actually sits in the frame.

   Jaseem's needed one extra step. It arrived square, and a square in
   these panels barely crops at all where a 0.654 portrait crops hard —
   which would have drawn him noticeably smaller in frame than the
   other two. It is cropped to the shared aspect around him before
   conversion, not fitted by the browser.

   Any fourth person wants the same treatment, in this order: crop to
   0.654 about the face, convert, then set `focus`.
   ------------------------------------------------------------------ */

/**
 * The row, in the order it is laid out — left to right. The founder is
 * the middle entry, not the first, so this list reads as the row does
 * rather than as a ranking; `FOUNDER_AT` below is the single place
 * that says which one it is.
 *
 * Three is the count this shape wants. Two is not a row, it is a pair,
 * and at four a closed panel is narrower than the name it has to
 * carry.
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
 * Which entry above is the founder — the one that is open at rest and
 * keeps the white plate and the key light wherever the pointer goes.
 *
 * Middle, and deliberately: the open panel is a little over half the
 * row, so opening one at either end would shove the other two hard
 * against the opposite edge and unbalance the block. Opening from the
 * middle spreads in both directions.
 *
 * It is an index rather than a flag on the person because two things
 * need it — the row, to know what to open, and the column below md, to
 * pull the founder out to the front of a list that has no middle.
 */
const FOUNDER_AT = 1;

/** Drift, one per panel. No two periods share a factor, so the row never lines up. */
const FLOAT = [
  { lift: "3px", duration: "14s", delay: "-4s" },
  { lift: "4px", duration: "12s", delay: "-3s" },
  { lift: "3.5px", duration: "13.5s", delay: "-8s" },
];

/** Intro choreography (ms), matching the other section headings on the site. */
const INTRO = {
  eyebrow: 0,
  eyebrowLift: 450,
  heading: 200,
  headingStagger: 130,
  headingDuration: 720,
  copy: 850,
  copyLift: 680,
} as const;

const from = (offset: number) => `calc(var(--reveal-delay, 0ms) + ${offset}ms)`;

/**
 * The portrait, or the plate that stands in for one.
 *
 * The onError swap is the point of the component, and it is the same
 * contract the project previews run: a file referenced before it
 * exists leaves a monogram rather than a broken frame, so the section
 * is never worse than it was before someone tried to improve it.
 *
 * Initials are first-word + last-word rather than the first two, so
 * "Sudhesh K. Valappil" reads SV and not SK.
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
          /* One figure covers all three, because any panel can be the
             open one: 460px is a little over what the open panel
             measures at the widest breakpoint (2.2/4.2 of a 46em row),
             and a closed panel only ever asks for less. */
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

/**
 * One person, framed.
 *
 * `lead` is the founder's, and it belongs to the person rather than
 * to whichever panel happens to be open — see the note at the top. It
 * swaps the label from dark glass to the white plate, which is the
 * only light surface in the section and does more to say whose page
 * this is than the width does.
 */
function Card({ person, lead = false }: { person: Person; lead?: boolean }) {
  return (
    <figure className={cn("fd-card", lead && "fd-card--lead")}>
      <Portrait person={person} />

      {/* Sits over the foot of the portrait rather than under it: the
          card is one object with a label laid on it, and a plate in
          flow underneath would make it two stacked rectangles. */}
      <figcaption className="fd-label">
        <span className="fd-name">{person.name}</span>
        <span className="fd-role">{person.role}</span>
      </figcaption>
    </figure>
  );
}

export function FounderSection() {
  /**
   * Which panel is open. The founder is the rest state, and the row
   * returns to it when the pointer leaves.
   *
   * Nothing here is announced to assistive tech and no panel is
   * focusable, because the row reveals nothing: all three names and
   * roles are in the DOM and legible however the width is split. It is
   * an arrangement, not a disclosure, so it stays out of the tab order
   * rather than adding three stops that change only which panel is
   * widest.
   *
   * No jitter guard, unlike the ring this replaced. Opening a panel
   * moves its edges away from the cursor, so a pointer resting on a
   * boundary is pulled *into* the panel it just entered rather than
   * being handed back and forth across it. The interaction is stable
   * on its own geometry.
   */
  const [open, setOpen] = useState(FOUNDER_AT);

  return (
    <section
      id="about"
      className="fd-scope relative isolate overflow-hidden bg-ink-950 py-20 sm:py-24"
    >
      {/* Ground and key light. One wash for the section floor, one soft
          core behind the front seat — the cheapest way to say where to
          look, and the only lighting in here. */}
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
            {/* Not "Leadership" — the heading below says that now, and an
                eyebrow that repeats the line under it is a label with
                nothing to label. */}
            Our team
          </p>

          {/* h2. It was an h1 while this had a page of its own; on the
              single page the hero's headline is the only h1 there is.

              Set in caps, which the rest of the site's headings are not.
              Caps need their tracking opened rather than closed, so this
              one runs positive where the others sit at -0.04em — see
              .fd-heading. To fold it back into the house style, change
              the two lines to sentence case and drop that rule. */}
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
            The vision and drive behind Shahi Solutions.
          </p>
        </div>
      </ScrollStagger>

      {/* ============ the row, md and up ============ */}
      <div
        className="fd-rig relative z-10 mt-14 hidden px-5 md:block"
        /* The reset lives on the wrapper rather than on each panel, so
           crossing the gap between two panels does not collapse the row
           back to the founder and start an animation nobody asked for. */
        onPointerLeave={() => setOpen(FOUNDER_AT)}
      >
        {/* DOM order is arrival order — ScrollStagger hands out its
            delays in it — so the row is dealt left to right. */}
        <ScrollStagger as="ul" stagger={130} inRatio={0.15} className="fd-row">
          {PEOPLE.map((person, i) => {
            const lead = i === FOUNDER_AT;

            return (
              <li
                key={`${person.name}-${person.role}`}
                className="fd-panel"
                /* Presence, not a value — `data-open` is what the
                   stylesheet keys the wider flex-grow off, and an
                   attribute that is either there or absent cannot be
                   half-set the way a class string can. */
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
                  {/* The key light rides with the founder rather than
                      with whichever panel happens to be open. */}
                  {lead ? <span aria-hidden="true" className="fd-core" /> : null}

                  {/* The founder fades and scales up into place; the
                      other two slide in from the side of the row they
                      sit on, so it opens outward from the middle. */}
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

          A slider, one card at a time, advancing on its own.

          The three of them are a composition in the row above — the
          founder in the middle with the other two opening away from
          him — and at this width there is no composition to have. The
          stacked column that replaced it was honest but long: three
          full-width cards is most of a screen and a half of scrolling
          past faces, and the founder, who is the subject, stopped being
          the largest thing on screen the moment you scrolled past him.

          A slider gives each person the whole width and none of the
          scroll. Reading order rather than row order, so the founder
          leads: a row has a middle to build outward from, a sequence
          does not.

          ScrollStagger wraps the slider rather than its cards. Gating
          each card individually would ask an IntersectionObserver about
          slides that are scrolled out of the track sideways — they do
          not intersect the viewport, so they would be held at opacity 0
          and the slider would advance onto blank frames. */}
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
