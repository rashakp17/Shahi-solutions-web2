import Link from "next/link";
import { START_HREF } from "@/lib/contact";

/**
 * Low-key closing call-to-action for resource pages. Primary action opens a
 * WhatsApp chat; secondary links to the service page.
 */
export function ClosingCta({
  serviceHref = "/services/custom-software-development",
  serviceLabel = "See how we build custom software",
}: {
  serviceHref?: string;
  serviceLabel?: string;
}) {
  return (
    <aside className="rs-cta" aria-labelledby="rs-cta-head">
      <h2 id="rs-cta-head" className="rs-cta-head">
        Have a system in mind?
        <span className="rs-cta-head-line">Let&rsquo;s build it.</span>
      </h2>

      <p className="rs-cta-body">
        Most projects start with a short conversation about the work, not a
        sales proposal. If an off-the-shelf product would suit you better, we
        will say so.
      </p>

      <div className="rs-cta-actions">
        {/* External WhatsApp link (see lib/contact.ts), so a plain anchor. */}
        <a
          href={START_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="rs-cta-primary"
        >
          Start a conversation
          <span aria-hidden="true" className="rs-cta-arrow">
            →
          </span>
        </a>

        <Link href={serviceHref} className="rs-cta-secondary">
          {serviceLabel}
        </Link>
      </div>
    </aside>
  );
}
