import Link from "next/link";
import type { CaseStudy } from "@/lib/resources/case-studies";

/**
 * The work, under the article that cites it.
 *
 * ── Why there are no screenshots here ──
 * Three of the five projects have no capture on disk yet; the deck on the home
 * page handles that by mounting a client component that falls back to drawn
 * art on the image's first `onError`. That machinery cannot exist in a server
 * component, and it should not be imported here to serve three cards — so the
 * rail is typographic instead, and uniformly so.
 *
 * Uniformly is the operative word. Two of the five *do* have captures, and
 * showing pictures on those two and text on the rest produces a rail where
 * some projects look finished and others look unfinished, which says something
 * about the studio rather than about the work. A consistent typographic
 * treatment says the same thing about all five, and it is also the treatment
 * that survives a phone: three captures stacked under an article is most of a
 * screen of images between a reader and the next paragraph.
 *
 * ── Where these link ──
 * `/#projects`, the deck on the home page, because there are no per-project
 * routes to link to. That is a deliberate limitation rather than an oversight:
 * the deck is where the work is presented properly, with its captures and its
 * stack. The moment case studies get routes of their own, this is the one
 * place that changes — every article reaches them through this component.
 */
export function CaseStudyRail({
  studies,
  heading,
  intro,
}: {
  studies: CaseStudy[];
  heading: string;
  intro: string;
}) {
  if (!studies.length) return null;

  return (
    <section className="rs-work" aria-labelledby="rs-work-head">
      <p className="rs-eyebrow">Selected work</p>
      <h2 id="rs-work-head" className="rs-h2">
        {heading}
      </h2>
      <p className="rs-p rs-work-intro">{intro}</p>

      <ul className="rs-work-list">
        {studies.map((study) => (
          <li key={study.id} className="rs-work-item">
            <article className="rs-work-card">
              <p className="rs-work-cat">{study.category}</p>

              <h3 className="rs-work-title">
                {/* The whole card is the target, via a stretched anchor. The
                    link text is the project name rather than "read more", so
                    a list of links read out of context still names five
                    distinct destinations. */}
                <Link href="/#projects" className="rs-work-link">
                  {study.title}
                </Link>
              </h3>

              <p className="rs-work-summary">{study.summary}</p>

              <p className="rs-work-relevance">
                <span className="rs-work-relevance-label">Why it is here</span>
                {study.relevance}
              </p>

              {study.href && (
                /* Sits above the stretched anchor on its own z-index so that
                   it is clickable rather than being swallowed by the card's
                   own link — see the rule in globals.css. */
                <a
                  href={study.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rs-work-live"
                >
                  Visit the live site
                  <span aria-hidden="true"> ↗</span>
                </a>
              )}
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
