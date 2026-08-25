"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/resources";

/**
 * The contents, with the current section marked.
 *
 * ── Why this is the only client component in the resource layer ──
 * Everything else on an article page is text and rules, and ships as finished
 * HTML with nothing to hydrate. This one needs to know where the reader is,
 * which is a fact that only exists in a browser. It is small, it renders its
 * full list on the server, and if the JavaScript never arrives the contents
 * still work — they are anchor links to ids that exist. All that is lost is
 * the highlight.
 *
 * ── On the observer, and why the band is a sliver ──
 * The obvious implementation observes each section and marks whichever is
 * intersecting. That misbehaves on exactly this kind of page: sections here
 * run from half a screen to three screens tall, so at any moment two or three
 * are intersecting at once and the "current" one flickers between them as the
 * reader scrolls.
 *
 * Instead the root margin collapses the viewport to a horizontal band a little
 * below the top of the screen — `-12% 0px -76% 0px` leaves roughly the region
 * between 12% and 24% down. A section is current when *that* line is inside
 * it, which is true of exactly one section at a time except during the few
 * pixels of a boundary. It is the same idea as a reading position: not "what
 * is visible" but "what am I looking at".
 *
 * The last entry gets special treatment for a reason that is easy to miss: the
 * final section is often short enough that the page bottoms out before the
 * band ever reaches it, so it can never become current and the contents look
 * broken to anyone who scrolls to the end. The scroll-bottom check below
 * covers that case.
 */
export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => !!el);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (record.isIntersecting) setActive(record.target.id);
        }
      },
      { rootMargin: "-12% 0px -76% 0px", threshold: 0 },
    );

    for (const section of sections) observer.observe(section);

    /* The bottom of the document, where the band cannot reach.

       Passive, and compared against the last value rather than handed to
       React on every scroll event — this fires at animation frequency and the
       component renders the whole list. */
    let wasAtEnd = false;
    const onScroll = () => {
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 120;

      if (atEnd === wasAtEnd) return;
      wasAtEnd = atEnd;
      if (atEnd) setActive(entries[entries.length - 1].id);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [entries]);

  return (
    <nav className="rs-toc" aria-labelledby="rs-toc-head">
      <h2 id="rs-toc-head" className="rs-toc-head">
        Contents
      </h2>

      <ol className="rs-toc-list">
        {entries.map((entry, i) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className="rs-toc-link"
              data-active={entry.id === active ? "" : undefined}
              /* The only thing the highlight has to communicate to a reader
                 who cannot see it. Announced on the one link that has it
                 rather than on all of them, which is why it is undefined
                 rather than "false" on the rest. */
              aria-current={entry.id === active ? "location" : undefined}
            >
              <span className="rs-toc-index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="rs-toc-text">{entry.heading}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
