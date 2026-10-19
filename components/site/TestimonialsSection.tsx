import type { CSSProperties } from "react";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { ScrollStagger } from "@/components/ui/ScrollStagger";
import { cn } from "@/lib/cn";

/* Testimonials: two cards flanking the heading at xl, pure CSS (no carousel).
   Below xl they drop into a two-column grid under the heading, one column
   below md. */

type Testimonial = {
  name: string;
  role: string;
  /** Out of five. */
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
 * Card side and rotation. Horizontal distance is set on .tm-stage in
 * globals.css, not here.
 *
 * `ry` sign is opposite to the side (not a typo): positive rotateY pushes the
 * right edge back, so the right card needs a negative angle to face the
 * centre. 24deg hurts legibility, which is acceptable only because hover
 * resets the rotation and the quotes are short.
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
 * Initials avatar. Don't use stock photos for real clients; swap in real
 * images if supplied. Uses first and last word ("Sudhesh K. Valappil" -> SV).
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

/** Five stars; those above the rating render as outlines. */
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

      {/* Pinned to the bottom so attributions align despite quote lengths. */}
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
      className="tm-scope relative isolate overflow-hidden bg-ink-950 pt-16 pb-10 sm:pt-20 sm:pb-12 xl:pb-0"
    >
      {/* Background gradient and centre glow. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_42%,var(--ground-4)_0%,var(--ground)_48%,var(--ground-deep)_100%)]" />
        <div className="tm-core absolute left-1/2 top-1/2 h-[26rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="bg-grain absolute inset-0 opacity-[0.02]" />
      </div>

      {/* ============ the pair, xl and up ============
          The flanking layout doesn't fit below ~1200px. */}
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

                  {/* Mirrored reflection; inside .tm-float so it floats with
                      the card. Absolute (top: 100%) so it adds no height and
                      doesn't shift the centred slot. */}
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
          Overlaid on the pair at xl, in normal flow below. */}
      <div
        className={cn(
          "relative z-20 flex justify-center px-5",
          "xl:pointer-events-none xl:absolute xl:inset-0 xl:items-center",
        )}
      >
        <ScrollStagger
          as="div"
          inRatio={0.2}
          // Keep lg:max-w-[23rem] in sync with --tm-head in globals.css (half
          // of it), which positions the cards.
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
              What our clients said once their projects went live.
            </p>

            {/* Hairline that fades out at both ends. */}
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
          Two columns, one below md. No reflections here. */}
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
