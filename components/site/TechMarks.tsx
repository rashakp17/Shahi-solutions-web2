import type { ReactNode } from "react";

/* ------------------------------------------------------------------
   Stack marks — the small logos that sit inside the project chips.

   These are drawn, not fetched: no <img>, no icon font, no network.
   Each one is the simplest figure that still reads as the thing —
   React's atom, Node's hexagon, Mongo's leaf — and the two or three
   marks that have no drawable silhouette fall back to a monogram
   rather than to a bad tracing of a logotype.

   The brand colour lives in one place per entry, and the mark inherits
   it through `currentColor`. The rest of this site deliberately does
   not use vendor colours (see the note on Mark in TechStrip) — the
   project cards do, because a stack line is a statement about what was
   used and the marks are what make it scannable. To fold them back
   into the house ramp, replace every `color` below with
   `var(--color-accent-300)` and nothing else changes.
   ------------------------------------------------------------------ */

export type TechKey =
  | "react"
  | "next"
  | "node"
  | "mongodb"
  | "tailwind"
  | "stripe"
  | "typescript"
  | "postgres"
  | "vercel"
  /* Not frameworks, and deliberately still here. A stack line is a
     statement about what a build is made of, and on these two projects
     the live tracking and the analytics layer are as load-bearing as the
     runtime under them. Neither has a logotype worth tracing at 16px, so
     both take the monogram path the registry already provides. */
  | "gps"
  | "analytics";

type Tech = {
  name: string;
  color: string;
  /** The drawn mark, on a 24×24 canvas. */
  glyph?: ReactNode;
  /** Used when there is no honest way to draw the mark small. */
  mono?: string;
};

const TECH: Record<TechKey, Tech> = {
  react: {
    name: "React.js",
    color: "#61DAFB",
    glyph: (
      <>
        <circle cx="12" cy="12" r="2.05" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1.15" fill="none">
          <ellipse cx="12" cy="12" rx="10" ry="4.1" />
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4.1"
            transform="rotate(60 12 12)"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4.1"
            transform="rotate(120 12 12)"
          />
        </g>
      </>
    ),
  },
  next: {
    name: "Next.js",
    color: "var(--fg)",
    glyph: (
      <g
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9.6" strokeWidth="1.3" />
        <path d="M8.7 16.2V7.8l7.1 8.9M15.4 7.8v6" strokeWidth="1.5" />
      </g>
    ),
  },
  node: {
    name: "Node.js",
    color: "#83CD29",
    glyph: (
      <path
        d="M12 2.3 20.7 7v10L12 21.7 3.3 17V7L12 2.3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  mongodb: {
    name: "MongoDB",
    color: "#4DB33D",
    glyph: (
      <>
        <path
          d="M12 2c3 3.7 5 6.8 5 10.2 0 3.4-2.1 5.9-5 7.3-2.9-1.4-5-3.9-5-7.3C7 8.8 9 5.7 12 2Z"
          fill="currentColor"
          fillOpacity="0.9"
        />
        <path
          d="M12 19.3V22"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </>
    ),
  },
  tailwind: {
    name: "Tailwind CSS",
    color: "#38BDF8",
    glyph: (
      <path
        d="M12 5.4c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.91.23 1.56.89 2.29 1.62C13.67 11.22 15.03 12.6 18 12.6c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.91-.23-1.56-.89-2.29-1.62C16.33 6.78 14.97 5.4 12 5.4Zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.91.23 1.56.89 2.29 1.62C7.67 18.42 9.03 19.8 12 19.8c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.91-.23-1.56-.89-2.29-1.62C10.33 13.98 8.97 12.6 6 12.6Z"
        fill="currentColor"
      />
    ),
  },
  vercel: {
    name: "Vercel",
    color: "var(--fg)",
    glyph: <path d="M12 3.4 22.4 20.6H1.6L12 3.4Z" fill="currentColor" />,
  },
  stripe: { name: "Stripe", color: "#8C85FF", mono: "S" },
  gps: { name: "Real-Time GPS", color: "#4DB6AC", mono: "GPS" },
  analytics: { name: "Analytics", color: "#7E9CF5", mono: "AN" },
  typescript: { name: "TypeScript", color: "#4C8FD8", mono: "TS" },
  postgres: { name: "PostgreSQL", color: "#6B8CE8", mono: "PG" },
};

/**
 * One chip: mark in a tile, name beside it.
 *
 * The tile is what keeps a row of mixed marks even — a drawn glyph and a
 * two-letter monogram sit on the same footprint, so the chips line up on their
 * text rather than on whatever width the logo happened to have.
 */
export function TechChip({ tech }: { tech: TechKey }) {
  const { name, color, glyph, mono } = TECH[tech];

  return (
    <li className="pj-chip">
      <span className="pj-chip-mark" style={{ color }} aria-hidden="true">
        {glyph ? (
          <svg viewBox="0 0 24 24" fill="none" className="h-[0.72rem] w-[0.72rem]">
            {glyph}
          </svg>
        ) : (
          <span className="pj-chip-mono">{mono}</span>
        )}
      </span>
      {name}
    </li>
  );
}
