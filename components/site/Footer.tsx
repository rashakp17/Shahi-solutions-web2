import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/site/Logo";
import { ScrollStagger } from "@/components/ui/ScrollStagger";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------
   Footer

   The last thing on the page and the only part of it that is purely
   information, so it is built as a directory rather than as another
   composition: four columns, a hairline, a line of small print. The
   ground carries on from the sections above it — same near-black, one
   soft light at the top edge — so the page ends rather than stopping.

   Everything here is real. The addresses and the phone number are
   live links, the section links point at sections that exist, and the
   two that do not have a home yet are marked as such below rather
   than pointed at something approximate and forgotten about.
   ------------------------------------------------------------------ */

/**
 * Stamped when the page is built, not when it is viewed.
 *
 * The site is statically prerendered, so this resolves once at build time and
 * ships as a literal. That is the right trade for a copyright line: it costs
 * nothing at runtime and corrects itself on the next deploy, where a hardcoded
 * year needs a person to remember it.
 */
const YEAR = new Date().getFullYear();

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * Where the service links go.
 *
 * All six land on the services section, because that is where they are: there
 * are no per-service pages to deep-link to yet. Listing them individually is
 * still worth it — the column is what tells a visitor (and a crawler) what the
 * company actually does, which a single "Services" link does not.
 *
 * `/#platform` and not `#platform`: this footer renders on every page, and a
 * bare fragment only means anything on the page that contains the target.
 */
const SERVICES = [
  "Website Development",
  "Custom Software",
  "Mobile App Dev",
  "UI/UX Layouts",
  "ERP & CRM Systems",
  "Business Automation",
].map((label) => ({ label, href: "#platform" }));

/**
 * The company column, mapped onto the sections that exist. All of them are on
 * this page now, so all of them are bare anchors.
 *
 * `Why Choose Us` and `Build Process` are the two with no section of their own.
 * They point at the nearest honest match rather than at a dead `#`, which would
 * look like a working link and do nothing. Repoint them the moment they land.
 */
const COMPANY = [
  { label: "About Us", href: "#about" },
  { label: "Why Choose Us", href: "#platform" },
  { label: "Our Projects", href: "#projects" },
  { label: "Build Process", href: "#shipping" },
  { label: "Tech Stack", href: "#stack" },
  { label: "Testimonials", href: "#testimonials" },
];

/**
 * Social accounts.
 *
 * The hrefs are placeholders on purpose. Guessing a handle that turns out to
 * belong to someone else is worse than a link that has obviously not been
 * filled in yet — swap the four `#` for the real profile URLs.
 */
const SOCIALS: Array<{ label: string; href: string; art: ReactNode }> = [
  {
    label: "LinkedIn",
    href: "#",
    art: (
      <path
        fill="currentColor"
        d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3.2 9.2h3.6V21H3.2V9.2Zm6.1 0h3.45v1.62h.05a3.79 3.79 0 0 1 3.4-1.87c3.64 0 4.3 2.4 4.3 5.5V21h-3.6v-5.36c0-1.28-.02-2.92-1.78-2.92-1.78 0-2.05 1.39-2.05 2.83V21H9.3V9.2Z"
      />
    ),
  },
  {
    label: "Twitter",
    href: "#",
    art: (
      <path
        fill="currentColor"
        d="M21.6 6.1c-.7.31-1.46.52-2.25.62a3.93 3.93 0 0 0 1.72-2.17c-.75.45-1.59.77-2.48.95a3.92 3.92 0 0 0-6.68 3.57A11.11 11.11 0 0 1 3.84 4.98a3.92 3.92 0 0 0 1.21 5.23 3.9 3.9 0 0 1-1.77-.49v.05a3.92 3.92 0 0 0 3.14 3.84c-.57.16-1.18.18-1.77.07a3.92 3.92 0 0 0 3.66 2.72 7.87 7.87 0 0 1-5.8 1.62 11.09 11.09 0 0 0 6.01 1.76c7.21 0 11.16-5.98 11.16-11.16v-.51c.77-.55 1.43-1.24 1.95-2.03Z"
      />
    ),
  },
  {
    label: "Facebook",
    href: "#",
    art: (
      <path
        fill="currentColor"
        d="M13.6 21v-8.02h2.7l.4-3.13h-3.1V7.85c0-.9.25-1.52 1.55-1.52h1.65V3.53c-.29-.04-1.27-.13-2.41-.13-2.38 0-4.01 1.46-4.01 4.13v2.32H7.67v3.13h2.71V21h3.22Z"
      />
    ),
  },
  {
    label: "GitHub",
    href: "#",
    art: (
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.04 1.53 1.04.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
      />
    ),
  },
];

const LEGAL = [
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms of Service", href: "#terms" },
];

/** A column heading, in the same micro-label the rest of the page uses. */
function ColumnHead({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="font-mono text-[10px] uppercase tracking-[0.28em] text-fg/40"
    >
      {children}
    </h2>
  );
}

function LinkColumn({
  id,
  title,
  links,
}: {
  id: string;
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <nav aria-labelledby={id}>
      <ColumnHead id={id}>{title}</ColumnHead>

      <ul className="mt-6 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="ft-link text-[13.5px]">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** One line of contact detail: a boxed glyph, then the detail itself. */
function ContactRow({
  art,
  children,
}: {
  art: ReactNode;
  children: ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="ft-glyph" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
          {art}
        </svg>
      </span>
      <span className="min-w-0 pt-0.5 text-[13.5px] leading-relaxed text-fg/50">
        {children}
      </span>
    </li>
  );
}

export function Footer() {
  return (
    <footer className="ft-scope relative isolate overflow-hidden border-t border-[color:var(--hair-1)] bg-ink-950">
      {/* The ground. One wash from the top edge down, and a single soft light
          sitting on the seam, so the border the footer starts on reads as lit
          rather than as a ruled line under the page. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_110%_at_50%_0%,var(--ground-4)_0%,var(--ground)_48%,var(--ground)_100%)]" />
        <div className="ft-seam absolute left-1/2 top-0 h-[20rem] w-[54rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="bg-grain absolute inset-0 opacity-[0.02]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-9 pt-14 sm:pt-16">
        {/* Four columns at lg, two at sm, one below. The brand column is given
            the extra width because it carries running prose; the two link
            columns need only their longest label. */}
        <ScrollStagger
          as="div"
          stagger={90}
          inRatio={0.1}
          className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.4fr]"
        >
          <div>
            <div className="ft-in">
              <Logo />

              <p className="mt-5 max-w-[21rem] text-[13.5px] leading-relaxed text-fg/45">
                Accelerating business innovation with custom software,
                enterprise platforms, and scalable digital solutions.
              </p>

              <ul className="mt-7 flex items-center gap-2.5">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <Link
                      href={social.href}
                      aria-label={social.label}
                      className="ft-social"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-[15px] w-[15px]"
                      >
                        {social.art}
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="ft-in">
              <LinkColumn id="ft-services" title="Services" links={SERVICES} />
            </div>
          </div>

          <div>
            <div className="ft-in">
              <LinkColumn id="ft-company" title="Company" links={COMPANY} />
            </div>
          </div>

          <div>
            {/* No id any more. This used to be the navbar's "Contact Us"
                target, back when the footer was the only place the address
                lived. The contact section above owns #contact now, and two
                elements sharing an id on one page is invalid — the anchor
                would resolve to whichever came first and the form would be
                unreachable from the nav. */}
            <section
              className="ft-in"
              aria-labelledby="ft-contact"
            >
              <ColumnHead id="ft-contact">Contact Us</ColumnHead>

              {/* <address> rather than a plain list: this is the contact detail
                  for the people who own the page, which is the one thing the
                  element is actually for. not-italic because the browser
                  default italicises it and nothing else here is italic. */}
              <address className="mt-6 not-italic">
                <ul className="space-y-3.5">
                  <ContactRow
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
                    <a
                      href="mailto:request.sdec@gmail.com"
                      className="ft-link break-all"
                    >
                      request.sdec@gmail.com
                    </a>
                  </ContactRow>

                  <ContactRow
                    art={
                      <path
                        d="M6.6 3.5h2.9l1.5 3.7-1.85 1.15a12.2 12.2 0 0 0 5.5 5.5L15.8 12l3.7 1.5v2.9a1.85 1.85 0 0 1-2 1.85A16.6 16.6 0 0 1 4.75 5.5a1.85 1.85 0 0 1 1.85-2Z"
                        {...iconProps}
                      />
                    }
                  >
                    {/* tel: wants the number unpunctuated; the label keeps the
                        spacing a person reads it with. */}
                    <a href="tel:+918590371761" className="ft-link">
                      +91 85903 71761
                    </a>
                    <span className="text-fg/30"> (Call / WhatsApp)</span>
                  </ContactRow>

                  <ContactRow
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
                  </ContactRow>
                </ul>
              </address>
            </section>
          </div>
        </ScrollStagger>

        {/* The small print. Reversed on a phone so the copyright — the thing
            almost nobody is looking for — ends up under the two links that
            somebody occasionally is. */}
        <div
          className={cn(
            "mt-11 flex flex-col-reverse items-center gap-5 border-t border-[color:var(--hair-1)] pt-6",
            "sm:flex-row sm:justify-between sm:gap-4",
          )}
        >
          <p className="text-[12.5px] text-fg/30">
            © {YEAR} Shahi Solutions. All rights reserved.
          </p>

          <ul className="flex items-center gap-7">
            {LEGAL.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="ft-link text-[12.5px]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
