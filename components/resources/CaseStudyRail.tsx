import Link from "next/link";
import type { CaseStudy } from "@/lib/resources/case-studies";

/**
 * Case study cards under an article. Text-only, so the component stays
 * server-rendered and consistent across projects. Cards link to `/#projects`
 * until case studies get their own routes; update this when they do.
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
                {/* Stretched link makes the whole card clickable. */}
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
                /* Raised above the stretched link via z-index in globals.css. */
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
