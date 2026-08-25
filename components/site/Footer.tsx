import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/site/Logo";
import { ScrollStagger } from "@/components/ui/ScrollStagger";
import { cn } from "@/lib/cn";
import { LEGAL_NAME, SOCIAL_PROFILES, type SocialLabel } from "@/lib/site";

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
 * Most land on the services section, because that is where they are: there are
 * no per-service pages to deep-link to. Listing them individually is still
 * worth it — the column is what tells a visitor (and a crawler) what the
 * company actually does, which a single "Services" link does not.
 *
 * `/#platform` and not `#platform`. This was a bare fragment while the site
 * was one page and it had to change the moment /resources and /services
 * existed: a bare fragment means "somewhere on the page you are already on",
 * so from an article every link in this column silently did nothing. The
 * leading slash costs a client navigation on the home page and is correct
 * everywhere.
 *
 * Custom Software is the exception and points at its own page, because it now
 * has one — the destination the resource cluster funnels into.
 */
const SERVICES: Array<{ label: string; href: string }> = [
  { label: "Website Development", href: "/#platform" },
  {
    label: "Custom Software",
    href: "/services/custom-software-development",
  },
  { label: "Mobile App Dev", href: "/#platform" },
  { label: "UI/UX Layouts", href: "/#platform" },
  { label: "ERP & CRM Systems", href: "/#platform" },
  { label: "Business Automation", href: "/#platform" },
];

/**
 * The company column, mapped onto the sections and routes that exist.
 *
 * `Why Choose Us` is the one with no home of its own. It points at the nearest
 * honest match rather than at a dead `#`, which would look like a working link
 * and do nothing. Repoint it the moment it lands.
 *
 * `Build Process` used to be in that category too and now has a real
 * destination — the process article — which is the first case of the resource
 * layer answering a question the main site had no page for.
 */
const COMPANY = [
  { label: "About Us", href: "/#about" },
  { label: "Why Choose Us", href: "/#platform" },
  { label: "Our Projects", href: "/#projects" },
  {
    label: "Build Process",
    href: "/resources/custom-software-development-process",
  },
  { label: "Tech Stack", href: "/#stack" },
  { label: "Testimonials", href: "/#testimonials" },
];

/**
 * The resource layer, as a column of its own.
 *
 * This is the footer's share of the internal linking the section depends on:
 * every page on the site now carries a link to the cluster, which is what
 * gives the articles a route in from anywhere rather than only from search.
 * Five entries rather than a single "Resources" link, for the same reason the
 * services are listed individually — the labels are the subjects.
 */
const RESOURCES = [
  {
    label: "Custom Software Explained",
    href: "/resources/what-is-custom-software-development",
  },
  {
    label: "Real-World Examples",
    href: "/resources/custom-software-development-examples",
  },
  {
    label: "The Build Process",
    href: "/resources/custom-software-development-process",
  },
  {
    label: "What It Costs",
    href: "/resources/custom-software-development-cost",
  },
  {
    label: "Custom vs Off-the-Shelf",
    href: "/resources/custom-software-vs-off-the-shelf",
  },
  { label: "All Resources", href: "/resources" },
];

/**
 * The artwork for a social account, and only the artwork.
 *
 * ── What changed and why ──
 * This was an array of four accounts whose `href` was `"#"` — placeholders,
 * left honest rather than guessed at. Four links to `#` cost something real
 * on both sides: a visitor who taps one is thrown to the top of the page, and
 * a crawler spends four of its internal links on a self-reference. Neither is
 * worth paying for an icon row.
 *
 * So the URLs moved to `SOCIAL_PROFILES` in lib/site.ts, which is now the one
 * place an account is declared, and the row below renders from that list. The
 * same list feeds `sameAs` in the organisation's structured data, so the
 * profiles a visitor can click and the profiles the company claims as its own
 * identity are the same set by construction — they cannot drift.
 *
 * That list is empty today, so the row renders nothing and `sameAs` is omitted
 * rather than published empty. Add the real URLs there and both come back on
 * with no change here.
 *
 * `Record<SocialLabel, ReactNode>` is total on purpose: every label the type
 * permits has a mark drawn for it, so a URL added in lib/site.ts can never
 * produce an empty circle in the footer. The two accounts that are not drawn
 * yet — Instagram and YouTube — are drawn here anyway, because a software
 * studio in 2026 is more likely to have those than a GitHub org.
 */
const SOCIAL_ART: Record<SocialLabel, ReactNode> = {
  LinkedIn: (
    <path
      fill="currentColor"
      d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3.2 9.2h3.6V21H3.2V9.2Zm6.1 0h3.45v1.62h.05a3.79 3.79 0 0 1 3.4-1.87c3.64 0 4.3 2.4 4.3 5.5V21h-3.6v-5.36c0-1.28-.02-2.92-1.78-2.92-1.78 0-2.05 1.39-2.05 2.83V21H9.3V9.2Z"
    />
  ),
  Instagram: (
    <>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </>
  ),
  X: (
    <path
      fill="currentColor"
      d="M17.2 3h3.1l-6.77 7.73L21 21h-5.5l-4.3-5.63L6.28 21H3.17l7.24-8.27L3 3h5.64l4 5.29L17.2 3Zm-1.09 16.13h1.72L7.94 4.77H6.1l10.01 14.36Z"
    />
  ),
  Facebook: (
    <path
      fill="currentColor"
      d="M13.6 21v-8.02h2.7l.4-3.13h-3.1V7.85c0-.9.25-1.52 1.55-1.52h1.65V3.53c-.29-.04-1.27-.13-2.41-.13-2.38 0-4.01 1.46-4.01 4.13v2.32H7.67v3.13h2.71V21h3.22Z"
    />
  ),
  YouTube: (
    <path
      fill="currentColor"
      d="M21.6 7.9a2.5 2.5 0 0 0-1.76-1.77C18.25 5.7 12 5.7 12 5.7s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.9C2 9.5 2 12 2 12s0 2.5.4 4.1a2.5 2.5 0 0 0 1.76 1.77c1.59.43 7.84.43 7.84.43s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 14.5 22 12 22 12s0-2.5-.4-4.1ZM10 15.1V8.9l5.2 3.1-5.2 3.1Z"
    />
  ),
  GitHub: (
    <path
      fill="currentColor"
      d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.04 1.53 1.04.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
    />
  ),
};

/**
 * The two links that are still dead, and knowingly so.
 *
 * `#privacy` and `#terms` point at fragments that exist nowhere, so both do
 * nothing when clicked, on every page. That is the same fault the four social
 * placeholders had, and it was not fixed the same way — deliberately.
 *
 * Removing them would take a real gap off the page without closing it. A
 * privacy policy is something visitors look for and something several
 * jurisdictions expect of a business collecting enquiries through a form, so
 * the honest fix is to write the two pages, not to delete the links to them.
 * Writing them needs facts about what the company does with an enquiry that
 * only the company has.
 *
 * When they land: add `/privacy` and `/terms` routes and point these at them.
 * They should also go into app/sitemap.ts at a low priority.
 */
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
        {/* Five columns at lg, three at md, two at sm, one below.
            The brand column keeps the extra width because it carries running
            prose; the contact column keeps its own because an email address
            and a street address do not wrap gracefully.

            The fifth column is the resource layer, and adding it is what
            forced the intermediate md step — five link columns at 768px are
            each about 130px wide, which is narrower than several of the
            labels. */}
        <ScrollStagger
          as="div"
          stagger={90}
          inRatio={0.1}
          className="grid gap-x-10 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.35fr_.85fr_.85fr_1.05fr_1.25fr]"
        >
          <div>
            <div className="ft-in">
              <Logo />

              <p className="mt-5 max-w-[21rem] text-[13.5px] leading-relaxed text-fg/45">
                Accelerating business innovation with custom software,
                enterprise platforms, and scalable digital solutions.
              </p>

              {/* The row exists only if there is an account to put in it.
                  With `SOCIAL_PROFILES` empty this renders nothing at all —
                  not an empty <ul>, which would still take its 2.25rem of
                  height and leave a gap under the paragraph that reads as a
                  layout fault rather than as an absence. */}
              {SOCIAL_PROFILES.length > 0 && (
                <ul className="mt-7 flex items-center gap-2.5">
                  {SOCIAL_PROFILES.map((social) => (
                    <li key={social.label}>
                      {/* A plain anchor, not next/link: every one of these
                          leaves the site, so there is no route to prefetch,
                          and `noopener` stops the opened page reaching back
                          through `window.opener`. Same split Button makes. */}
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${social.label} — Shahi Solutions`}
                        className="ft-social"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="h-[15px] w-[15px]"
                        >
                          {SOCIAL_ART[social.label]}
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
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
            <div className="ft-in">
              <LinkColumn
                id="ft-resources"
                title="Resources"
                links={RESOURCES}
              />
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
            {/* The registered company, not the brand, and this is the one
                place on the site where that is the right choice.

                A copyright line is a legal notice — it is asserting who holds
                the rights — so it wants the registered entity. It is also the
                conventional place a crawler finds a legal name to corroborate
                the `legalName` published in the structured data, which is what
                turns two strings into one confirmed entity rather than a claim
                nothing on the page supports.

                Everywhere else — the title tag, the H1, the navbar, the hero —
                stays "Shahi Solutions". A legal suffix in a heading spends
                characters a search result does not have and reads as
                paperwork. */}
            © {YEAR} {LEGAL_NAME}. All rights reserved.
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
