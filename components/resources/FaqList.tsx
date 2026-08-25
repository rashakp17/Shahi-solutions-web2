import { renderInline } from "@/lib/resources/inline";
import type { Faq } from "@/lib/resources/types";

/**
 * The FAQ, as native disclosure elements.
 *
 * `<details>`/`<summary>` rather than a React accordion, and the reasons are
 * all things a hand-built one would have to reimplement badly:
 *
 *   It works with no JavaScript, which matters on a page whose only other
 *   client component is the contents.
 *
 *   Keyboard and screen-reader behaviour is the browser's, so it is correct
 *   in every browser rather than correct in the ones that were tested.
 *
 *   Browser find-in-page opens a closed `<details>` to reveal a match. A
 *   div-based accordion hides its answers from Ctrl+F entirely — which on an
 *   FAQ is the single most likely way somebody looks for an answer.
 *
 * ── On answers being closed by default ──
 * They are open. That is deliberate and it is the more important decision on
 * this page: the same answers are published as `FAQPage` structured data, and
 * content that a search engine is told about must be content a visitor can
 * see. Collapsing them all would still be legitimate — a disclosure widget is
 * not hidden text, and Google says so — but open is unambiguous, and it means
 * the answers are part of the article rather than a quiz.
 *
 * `<details>` is still the right element with `open` set: the toggle is there
 * for a reader who wants to collapse what they have read on a phone.
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
