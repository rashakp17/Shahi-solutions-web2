import type { CSSProperties } from "react";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { ScrollStagger } from "@/components/ui/ScrollStagger";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------
   Testimonials — two clients, one either side of the heading

   There are two of these and they are both real, which settles the
   composition: a pair flanking the heading rather than a row with a
   gap in it. Two cards can be given the room six could not, so they
   are larger, they carry the full quote without truncation, and they
   sit far enough from the centre column to read as a frame around it.

   The pair is CSS. There is no carousel state, no interval and no
   drag handler, because nothing moves between positions — it is a
   still arrangement with a slow float on each card, and a hover that
   lifts a card in place without shifting its centre by a pixel.

   Below xl the two cards drop into a plain two-column grid under the
   heading, and below md into one column. Two items do not need a
   carousel at any width.
   ------------------------------------------------------------------ */

type Testimonial = {
  name: string;
  role: string;
  /** Out of five. Both are fives; the field exists so a four cannot be a lie. */
  rating: number;
  quote: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sahil Haneefa",
    role: "Founder, TEAL CULTURE",
    rating: 5,
    quote:
      "It’s rare to find someone who genuinely cares about a project as if it were their own. You didn’t just build a website for TEAL, you brought our vision to life with creativity, precision, and heart. The final result exceeded everything we had imagined. Thank you for your hard work, patience, and commitment. I’m proud to recommend your work to anyone looking for exceptional design.",
  },
  {
    name: "Sudhesh K. Valappil",
    role: "Founder, VRS Realinvest",
    rating: 5,
    quote:
      "The team delivered a modern, professional website that truly reflects our brand. Their attention to detail, responsiveness, and commitment throughout the project exceeded our expectations. Highly recommended.",
  },
];

/**
 * A place on the composition.
 *
 * How far out each card sits is *not* here. That distance lives on .tm-stage in
 * globals.css, because it is solved against the window and against the width of
 * the heading column, and only the stylesheet knows either. This file says
 * which side a card is on and how it is turned; the stylesheet turns that into
 * a position.
 *
 * `ry` turns each card to face the heading, and its sign is the opposite of the
 * side it is on, which is worth stating because it looks like a typo. CSS
 * rotateY sends the element's right edge away from the viewer at positive
 * angles, so the card standing on the right of the centre needs a negative one
 * to swing its outer edge forward and address the middle. Both cards end up
 * with their far edges nearest the viewer and their inner edges laid back — two
 * leaves of a triptych folding in around the heading, rather than two flat
 * panes turned the same way.
 *
 * 24deg, which is well past the 12 this section used to hold itself to and is a
 * deliberate call rather than a drift. What it buys is the fold: at this angle
 * the pair reads as two panels standing around the heading rather than as two
 * flat cards with a slight lean. What it costs is a visible keystone across
 * each card — the far edge sits about 9% larger than the near one — and type
 * that is measurably slower to read while it is turned.
 *
 * That cost is survivable only because of two things, and both have to keep
 * being true. Hover unwinds the turn to zero, so a card being read is square
 * on. And the quotes are short enough to take in whole; a card this turned is
 * not a place to put a paragraph.
 *
 * The geometry itself is indifferent. Turning further brings the outer edge
 * nearer the viewer, and perspective magnifies it by almost exactly as much as
 * the rotation foreshortens it — the resting card measures ~574px from the
 * centre line at 14deg, 24deg and 30deg alike. Legibility is the only thing
 * setting this number.
 */
const SLOTS: Array<{
  person: number;
  ry: string;
  side: "left" | "right";
  float: { lift: string; duration: string; delay: string };
}> = [
  {
    person: 0,
    ry: "24deg",
    side: "left",
    float: { lift: "7px", duration: "11s", delay: "-2s" },
  },
  {
    person: 1,
    ry: "-24deg",
    side: "right",
    float: { lift: "8px", duration: "12.5s", delay: "-6s" },
  },
];

/** Intro choreography (ms), matching the other section headings on the page. */
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
 * Initials, not a photograph.
 *
 * There are no client photographs in this project, and a stock face attached to
 * a named person at a named company is a fabricated endorsement — worse than no
 * face at all. Swap in real images if the clients supply them; the shape and
 * size are already right.
 *
 * First and last word rather than the first two, so "Sudhesh K. Valappil" reads
 * SV and not SK.
 */
function Avatar({ name }: { name: string }) {
  const words = name.split(" ").filter(Boolean);
  const initials = [words[0], words[words.length - 1]]
    .map((word) => word?.[0] ?? "")
    .join("");

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-full",
        "border border-fg/10 bg-[radial-gradient(circle_at_30%_25%,var(--color-accent-500),var(--color-accent-900))]",
        "font-mono text-[10px] font-medium tracking-[0.04em] text-fg/75",
      )}
    >
      {initials}
    </span>
  );
}

function QuoteMark() {
  return (
    <svg
      viewBox="0 0 32 24"
      aria-hidden="true"
      className="tm-quote h-5 w-6 shrink-0"
    >
      <path
        d="M13.1 0v9.4c0 6.9-3.6 12-10.6 14.6L0 20.6c4-1.7 6.2-4.3 6.6-7.7H3.3V0h9.8Zm18.9 0v9.4c0 6.9-3.6 12-10.6 14.6l-2.5-3.4c4-1.7 6.2-4.3 6.6-7.7h-3.3V0H32Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Five stars, the ones above the rating left as empty outlines. */
function Stars({ rating }: { rating: number }) {
  return (
    <span
      role="img"
      aria-label={`Rated ${rating} out of 5`}
      className="tm-stars shrink-0"
    >
      {[1, 2, 3, 4, 5].map((step) => (
        <svg
          key={step}
          viewBox="0 0 24 24"
          aria-hidden="true"
          data-on={step <= rating ? "" : undefined}
        >
          <path d="M12 1.8l3.09 6.26 6.91 1-5 4.87 1.18 6.88L12 17.56l-6.18 3.25L7 13.93l-5-4.87 6.91-1L12 1.8Z" />
        </svg>
      ))}
    </span>
  );
}

function Card({ person }: { person: Testimonial }) {
  return (
    <figure className="tm-card">
      <div className="flex items-center justify-between gap-3">
        <QuoteMark />
        <Stars rating={person.rating} />
      </div>

      <blockquote className="mt-3.5 text-[12.5px] leading-[1.62] text-fg/76">
        {person.quote}
      </blockquote>

      {/* Pushed to the bottom of the card rather than sitting under the quote.
          The two quotes are very different lengths, and in a symmetrical
          composition two attributions at two different heights is the first
          thing the eye finds. */}
      <div className="tm-foot">
        <hr className="tm-rule" />

        <figcaption className="mt-3.5 flex items-center gap-2.5">
          <Avatar name={person.name} />
          <span className="min-w-0">
            <span className="block truncate text-[12.5px] font-semibold tracking-[-0.01em] text-fg">
              {person.name}
            </span>
            <span className="tm-role mt-0.5 block truncate text-[10.5px]">
              {person.role}
            </span>
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      data-motion-scope
      className="tm-scope relative isolate overflow-hidden bg-ink-950 py-16 sm:py-20"
    >
      {/* Ground and glow. One radial behind the centre, one wide wash under
          the pair — no particle field and no linework, because this section
          already has two bordered objects in it and anything more behind them
          turns the middle of the page into noise. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_42%,var(--ground-4)_0%,var(--ground)_48%,var(--ground-deep)_100%)]" />
        <div className="tm-core absolute left-1/2 top-1/2 h-[26rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="bg-grain absolute inset-0 opacity-[0.02]" />
      </div>

      {/* ============ the pair, xl and up ============

          xl and not md: a card this size cannot sit beside a 23rem heading
          column and still fit on a 1024px window — the arithmetic runs out
          somewhere around 1200px, and shrinking the type until it does is a
          worse answer than putting the cards under the heading instead. */}
      <ScrollStagger
        as="ul"
        stagger={140}
        inRatio={0.18}
        className="tm-stage relative z-10 mx-auto hidden h-[30rem] max-w-[100rem] xl:block"
      >
        {SLOTS.map((slot) => {
          const person = TESTIMONIALS[slot.person];

          return (
            <li
              key={person.name}
              className="tm-slot"
              data-side={slot.side}
              style={{ "--tm-ry": slot.ry } as CSSProperties}
            >
              <div
                className="tm-float"
                style={
                  {
                    "--tm-lift": slot.float.lift,
                    "--tm-float-dur": slot.float.duration,
                    "--tm-float-delay": slot.float.delay,
                  } as CSSProperties
                }
              >
                <div className="tm-in relative">
                  <Card person={person} />

                  {/* The floor. A real mirrored copy rather than a painted
                      smudge, so it carries the actual silhouette of the card
                      above it — and because it lives inside .tm-float, it
                      drifts with the card for free.

                      Absolutely positioned at top: 100%, so it adds no height:
                      the slot is centred on the stage and a reflection in flow
                      would push both cards upward by half its own length. */}
                  <div className="tm-reflect" aria-hidden="true">
                    <Card person={person} />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ScrollStagger>

      {/* ============ the centre ============

          Painted over the pair from xl up, where it is the middle of the
          composition; in flow below it, where it is simply the heading above
          two cards. */}
      <div
        className={cn(
          "relative z-20 flex justify-center px-5",
          "xl:pointer-events-none xl:absolute xl:inset-0 xl:items-center",
        )}
      >
        <ScrollStagger
          as="div"
          inRatio={0.2}
          // 19rem / 23rem, and the second number is load-bearing: --tm-head in
          // globals.css is half of it, and the cards are floored at that plus
          // half a card. Change one without the other and the pair starts
          // crowding the heading.
          className="pointer-events-auto block w-full max-w-[19rem] text-center lg:max-w-[23rem]"
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
              Testimonials
            </p>

            <BlurReveal
              as="h2"
              lines={[{ text: "What our" }, { text: "clients say", accent: true }]}
              delay={INTRO.heading}
              lineDelay={40}
              stagger={INTRO.headingStagger}
              duration={INTRO.headingDuration}
              blurScale={1.45}
              fromReveal
              className="tm-heading mt-6 text-[clamp(2rem,4.6vw,3.25rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-fg"
            />

            <p
              className="anim-rise mx-auto mt-5 max-w-[19rem] text-[14px] leading-relaxed text-fg/45"
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
              Real stories from real people who trust us to build, scale and
              grow their ideas.
            </p>

            {/* The rule under the centre — a hairline that is brightest in the
                middle and gone at both ends, with its own bloom beneath it. */}
            <span
              aria-hidden="true"
              className="anim-rise tm-line mt-8 block"
              style={
                {
                  animationDelay: from(INTRO.copy + 90),
                  "--rise-lift": "420ms",
                  "--rise-y": "10px",
                  "--rise-blur": "0em",
                } as CSSProperties
              }
            />
          </div>
        </ScrollStagger>
      </div>

      {/* ============ below xl ============

          Side by side under the heading, and one column under md. No
          reflections down here — they are a flourish for the composition and
          only cost paint once the cards are square on. */}
      <ScrollStagger
        as="ul"
        stagger={140}
        inRatio={0.15}
        className="relative z-10 mx-auto mt-12 grid max-w-[23rem] gap-4 px-5 md:max-w-[46rem] md:grid-cols-2 xl:hidden"
      >
        {TESTIMONIALS.map((person) => (
          <li key={person.name} className="flex">
            <div className="tm-in flex w-full">
              <Card person={person} />
            </div>
          </li>
        ))}
      </ScrollStagger>
    </section>
  );
}
