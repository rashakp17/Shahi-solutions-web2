import Link from "next/link";
import { START_HREF } from "@/lib/contact";

/**
 * The last thing on an article, and the quietest.
 *
 * ── What this is not ──
 * It is not a banner. There is no filled panel, no contrasting ground, no
 * second colour, no urgency, and nothing about it is louder than the article
 * it follows. The brief this section was built to asked for a call to action
 * that reads as the natural end of the piece rather than as an advertisement
 * bolted to it, and the way you get that is by giving it the same typographic
 * weight as the writing — a rule, two short lines, and two links.
 *
 * ── Why two, and in this order ──
 * A reader who has finished a two-thousand-word article on custom software is
 * in one of two states, and a single button serves only one of them. Somebody
 * ready to talk gets the conversation. Somebody who wants to know what
 * commissioning this actually involves gets the service page — which is the
 * more common state, and sending them to a chat window instead is how a good
 * article turns into a bounce.
 *
 * The primary is the conversation because it is what the business wants; the
 * secondary is genuinely secondary in weight but is listed second rather than
 * hidden, which is the whole difference between an offer and a funnel.
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
        Most projects start with a short conversation about what the work
        actually is — not a proposal. If it turns out you should buy something
        off the shelf instead, we will tell you that.
      </p>

      <div className="rs-cta-actions">
        {/* An external handoff to WhatsApp, so a real anchor rather than
            next/link — there is no route to prefetch, and the rel guards
            matter. Same reasoning as Button; see lib/contact.ts for where
            the destination is defined. */}
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
