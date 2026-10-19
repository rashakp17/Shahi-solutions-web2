import type { ReactNode } from "react";

/*
 * Small inline SVG tech marks for project chips. Marks without a simple
 * shape use a monogram. Each mark inherits its `color` via currentColor;
 * use var(--color-accent-300) instead to match the site accent.
 */

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
  // Not frameworks, but listed for some projects; rendered as monograms.
  | "gps"
  | "analytics";

type Tech = {
  name: string;
  color: string;
  /** SVG content on a 24x24 viewBox. */
  glyph?: ReactNode;
  /** Monogram fallback when there is no glyph. */
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

/** Tech chip: mark in a fixed-size tile, followed by the name. */
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
