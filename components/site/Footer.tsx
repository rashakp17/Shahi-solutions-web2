import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/site/Logo";
import { ScrollStagger } from "@/components/ui/ScrollStagger";
import { cn } from "@/lib/cn";
import { LEGAL_NAME, SOCIAL_PROFILES, type SocialLabel } from "@/lib/site";

/* Footer: link columns, contact details and the copyright line. */

/** Resolved at build time (the page is prerendered); updates on each deploy. */
const YEAR = new Date().getFullYear();

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Every service in this column has its own page under /services. */
const SERVICES: Array<{ label: string; href: string }> = [
  { label: "Website Development", href: "/services/website-development" },
  {
    label: "Custom Software",
    href: "/services/custom-software-development",
  },
  { label: "Mobile App Dev", href: "/services/mobile-app-development" },
  { label: "UI/UX Layouts", href: "/services/ui-ux-design" },
  { label: "ERP & CRM Systems", href: "/services/erp-crm" },
  { label: "Business Automation", href: "/services/business-automation" },
];

/** `Why Choose Us` has no section of its own yet; repoint it when it does. */
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
 * Icons for social accounts. URLs live in `SOCIAL_PROFILES` (lib/site.ts),
 * which also feeds `sameAs` in the structured data. The Record covers every
 * SocialLabel so adding a profile never renders an empty icon.
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
 * TODO: these pages don't exist yet. Add `/privacy` and `/terms` routes,
 * point these at them, and add both to app/sitemap.ts.
 */
const LEGAL = [
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms of Service", href: "#terms" },
];

/** Column heading in the site's micro-label style. */
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

/** Contact line: icon followed by the detail. */
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
      {/* Background gradient with a soft glow on the top border. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_110%_at_50%_0%,var(--ground-4)_0%,var(--ground)_48%,var(--ground)_100%)]" />
        <div className="ft-seam absolute left-1/2 top-0 h-[20rem] w-[54rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="bg-grain absolute inset-0 opacity-[0.02]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-9 pt-14 sm:pt-16">
        {/* 4 columns at lg, 2 at sm, 1 below. Brand and contact columns are
            wider: prose and addresses wrap badly. */}
        <ScrollStagger
          as="div"
          stagger={90}
          inRatio={0.1}
          className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_.85fr_.85fr_1.25fr]"
        >
          <div>
            <div className="ft-in">
              <Logo />

              <p className="mt-5 max-w-[21rem] text-[13.5px] leading-relaxed text-fg/45">
                Custom software, business platforms and digital products for
                companies that are ready to grow.
              </p>

              {/* Skip the <ul> entirely when empty, so it leaves no gap. */}
              {SOCIAL_PROFILES.length > 0 && (
                <ul className="mt-7 flex items-center gap-2.5">
                  {SOCIAL_PROFILES.map((social) => (
                    <li key={social.label}>
                      {/* Plain <a>: external link, nothing to prefetch. */}
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
            {/* No id="contact" here: the contact section owns that anchor. */}
            <section
              className="ft-in"
              aria-labelledby="ft-contact"
            >
              <ColumnHead id="ft-contact">Contact Us</ColumnHead>

              {/* not-italic overrides the browser default for <address>. */}
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

        {/* Reversed on mobile so the copyright sits below the legal links. */}
        <div
          className={cn(
            "mt-11 flex flex-col-reverse items-center gap-5 border-t border-[color:var(--hair-1)] pt-6",
            "sm:flex-row sm:justify-between sm:gap-4",
          )}
        >
          <p className="text-[12.5px] text-fg/30">
            {/* Legal name here only (matches `legalName` in the structured
                data). Everywhere else uses the brand name. */}
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
