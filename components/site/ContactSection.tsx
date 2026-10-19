"use client";

import { useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { Button } from "@/components/ui/Button";
import { ScrollStagger } from "@/components/ui/ScrollStagger";

/*
 * Contact: details on the left, form on the right.
 *
 * There is no backend, so submit opens the visitor's mail client with a
 * prefilled mailto: link. To use a real endpoint, change only onSubmit; the
 * fields already have `name` attributes.
 */

const EMAIL = "request.sdec@gmail.com";
/** Unformatted for tel:; the visible label keeps spacing. */
const PHONE_HREF = "tel:+918590371761";

/** Intro timings (ms), matching other section headings. */
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

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** One contact detail row: icon, label, value. */
function Detail({
  art,
  label,
  children,
}: {
  art: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <li className="ct-detail">
      <span aria-hidden="true" className="ct-glyph">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]">
          {art}
        </svg>
      </span>
      <span className="min-w-0">
        <span className="ct-detail-label">{label}</span>
        <span className="ct-detail-value">{children}</span>
      </span>
    </li>
  );
}

/** Form field with a real <label>. */
function Field({
  name,
  label,
  placeholder,
  type = "text",
  textarea = false,
  required = true,
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  return (
    <p className="ct-field">
      {/* Label plus placeholder: the placeholder disappears on input, so it
          can't be the only name for the field. */}
      <label htmlFor={`ct-${name}`} className="ct-label">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={`ct-${name}`}
          name={name}
          rows={5}
          required={required}
          placeholder={placeholder}
          className="ct-input ct-textarea"
        />
      ) : (
        <input
          id={`ct-${name}`}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="ct-input"
        />
      )}
    </p>
  );
}

function PlaneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d="M21 3 10.5 13.5M21 3l-6.6 18-3.9-7.5L3 9.6 21 3Z"
        {...iconProps}
      />
    </svg>
  );
}

export function ContactSection() {
  /** True once the mailto: link has been opened. */
  const [handedOff, setHandedOff] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const read = (key: string) => String(data.get(key) ?? "").trim();
    const name = read("name");
    const subject = read("subject");
    const message = read("message");

    // Name goes in the body; the subject stays the enquiry topic.
    const body = message + (name ? `\n\n— ${name}` : "");

    window.location.href =
      `mailto:${EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    setHandedOff(true);
  }

  return (
    <section
      id="contact"
      className="ct-scope relative isolate overflow-hidden bg-ink-950 py-20 sm:py-24"
    >
      {/* Background gradient and grain. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_70%_28%,var(--ground-4)_0%,var(--ground)_52%,var(--ground-deep)_100%)]" />
        <div className="bg-grain absolute inset-0 opacity-[0.02]" />
      </div>

      <div className="ct-grid relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        {/* Left: contact details */}
        <ScrollStagger as="div" inRatio={0.2} className="ct-aside">
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
              Contact
            </p>

            {/* h2: the hero headline is the page's only h1. */}
            <BlurReveal
              as="h2"
              lines={[{ text: "Connect" }, { text: "with us", accent: true }]}
              delay={INTRO.heading}
              lineDelay={40}
              stagger={INTRO.headingStagger}
              duration={INTRO.headingDuration}
              blurScale={1.45}
              fromReveal
              className="ct-heading mt-6 text-[clamp(2rem,4.6vw,3.25rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-fg"
            />

            <p
              className="anim-rise mt-5 max-w-[26rem] text-[14.5px] leading-relaxed text-fg/45"
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
              Planning a software project, or just have an idea? Get in touch
              and we’ll talk through what you need, suggest how to build it and
              give you a timeline.
            </p>

            {/* <address> for the site owner's contact info; not-italic overrides the browser default. */}
            <address
              className="anim-rise mt-10 not-italic"
              style={
                {
                  animationDelay: from(INTRO.copy + 90),
                  "--rise-lift": `${INTRO.copyLift}ms`,
                  "--rise-y": "26px",
                  "--rise-blur": "0.4em",
                } as CSSProperties
              }
            >
              <ul className="space-y-5">
                <Detail
                  label="Email us"
                  art={
                    <>
                      <rect
                        x="2.75"
                        y="4.75"
                        width="18.5"
                        height="14.5"
                        rx="2.5"
                        {...iconProps}
                      />
                      <path
                        d="m3.5 7.5 7.6 5.2a1.6 1.6 0 0 0 1.8 0l7.6-5.2"
                        {...iconProps}
                      />
                    </>
                  }
                >
                  <a href={`mailto:${EMAIL}`} className="ct-link break-all">
                    {EMAIL}
                  </a>
                </Detail>

                <Detail
                  label="Phone & WhatsApp"
                  art={
                    <path
                      d="M6.6 3.5h2.9l1.5 3.7-1.85 1.15a12.2 12.2 0 0 0 5.5 5.5L15.8 12l3.7 1.5v2.9a1.85 1.85 0 0 1-2 1.85A16.6 16.6 0 0 1 4.75 5.5a1.85 1.85 0 0 1 1.85-2Z"
                      {...iconProps}
                    />
                  }
                >
                  <a href={PHONE_HREF} className="ct-link">
                    +91 85903 71761
                  </a>
                  <span className="text-fg/30"> (Call / Chat)</span>
                </Detail>

                <Detail
                  label="Visit office"
                  art={
                    <>
                      <path
                        d="M12 21s6.75-5.4 6.75-10.5a6.75 6.75 0 1 0-13.5 0C5.25 15.6 12 21 12 21Z"
                        {...iconProps}
                      />
                      <circle cx="12" cy="10.3" r="2.4" {...iconProps} />
                    </>
                  }
                >
                  2105, F1, T2, Hilite Business Park, Palazhi, Calicut,
                  Kerala&nbsp;-&nbsp;673016
                </Detail>
              </ul>
            </address>
          </div>
        </ScrollStagger>

        {/* Right: form */}
        <ScrollStagger as="div" inRatio={0.15} className="ct-formwrap">
          {/* anim-rise-flat (no blur): blurring the whole form repaints it every frame. */}
          <div
            className="anim-rise anim-rise-flat"
            style={{ "--rise-y": "34px" } as CSSProperties}
          >
            <form className="ct-form" onSubmit={onSubmit} noValidate={false}>
              <Field name="name" label="Full Name" placeholder="John Doe" />
              <Field
                name="subject"
                label="Subject"
                placeholder="Custom Software Inquiry"
              />
              <Field
                name="message"
                label="Message"
                placeholder="Tell us about your project requirements..."
                textarea
              />

              <Button type="submit" className="ct-submit mt-6 w-full">
                Send Inquiry
                <PlaneIcon />
              </Button>

              {/* Tell users submit opens their mail app, so it doesn't look broken. */}
              <p className="ct-note" role={handedOff ? "status" : undefined}>
                {handedOff
                  ? `Your email app should be open with the message ready to send to ${EMAIL}. If nothing happened, write to us there directly.`
                  : "Sending opens your email app with the message filled in. Nothing is sent from this page."}
              </p>
            </form>
          </div>
        </ScrollStagger>
      </div>
    </section>
  );
}
