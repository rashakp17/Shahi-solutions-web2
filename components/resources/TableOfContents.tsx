"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/resources";

/**
 * Table of contents that highlights the current section. Links work without
 * JS; only the highlight needs the client.
 *
 * The root margin narrows the viewport to a band ~12–24% from the top so only
 * one section is active at a time. The last section may never reach that band,
 * so it's activated when the page is scrolled to the bottom.
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

    /* Activate the last entry at the bottom of the page. Only updates state
       when the at-end value changes. */
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
              /* Set only on the active link. */
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
