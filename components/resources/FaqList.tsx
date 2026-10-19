import { renderInline } from "@/lib/resources/inline";
import type { Faq } from "@/lib/resources/types";

/**
 * FAQ using native <details>/<summary>: no JS, built-in accessibility, and
 * find-in-page works. Open by default so answers marked up as FAQPage JSON-LD
 * are visible.
 */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <ul className="rs-faq-list">
      {faqs.map((faq) => (
        <li key={faq.q}>
          <details className="rs-faq" open>
            <summary className="rs-faq-q">
              <span className="rs-faq-q-text">{faq.q}</span>
              <span className="rs-faq-mark" aria-hidden="true" />
            </summary>
            <div className="rs-faq-a">
              <p>{renderInline(faq.a)}</p>
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
