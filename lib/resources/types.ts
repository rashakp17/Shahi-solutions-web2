/**
 * Resource article types. Articles are stored as data, not JSX, so the table
 * of contents, FAQ JSON-LD, reading time and sitemap are all derived from the
 * same source.
 */

/**
 * A string with minimal inline markup, rendered by `renderInline`:
 *
 *   [label](/href)   link. Internal paths use next/link; http(s) URLs get
 *                    a plain anchor with rel attributes.
 *   **strong**       <strong>
 *   *stress*         <em>
 *   `code`           inline code
 *
 * Headings, lists and images are blocks, not inline markup.
 */
export type Inline = string;

/** Which drawn figure a `figure` block should render. See Diagrams.tsx. */
export type DiagramKey =
  | "build-process"
  | "cost-composition"
  | "build-vs-buy"
  | "systems-map"
  | "integration-spine";

export type Block =
  /** A paragraph. */
  | { kind: "p"; text: Inline }
  /** A bulleted or numbered list. */
  | { kind: "list"; items: Inline[]; ordered?: boolean }
  /** Numbered examples, each with an optional label, a title and text. */
  | {
      kind: "examples";
      items: Array<{ label?: string; title: string; text: Inline }>;
    }
  /** An aside with a label and a short paragraph. */
  | { kind: "note"; label: string; text: Inline }
  /** A diagram from Diagrams.tsx with a caption. */
  | { kind: "figure"; diagram: DiagramKey; caption: Inline }
  /** A table. Scrolls horizontally inside its own box. */
  | { kind: "table"; head: string[]; rows: Inline[][]; caption?: Inline }
  /** A call-to-action linking to the related service. Place it where it fits the article. */
  | { kind: "bridge"; prompt: Inline; label: string; href: string };

export type Section = {
  /**
   * Anchor id used by the table of contents. Set explicitly so heading edits
   * don't break existing links.
   */
  id: string;
  /** The H2. */
  heading: string;
  blocks: Block[];
};

export type Faq = { q: string; a: Inline };

export type Article = {
  /** URL segment: /resources/<slug>. */
  slug: string;
  /** The H1. */
  title: string;
  /** The `<title>` tag. Keep within ~60 characters. */
  metaTitle: string;
  /** Meta description, one sentence under ~160 characters. */
  description: string;
  /** Small label above the H1. */
  eyebrow: string;
  /** Two or three intro sentences under the H1. */
  lead: Inline;
  /** ISO date, used as `dateModified` and shown in the hero. */
  updated: string;
  /** Cluster id. See `CLUSTERS`. */
  cluster: string;
  sections: Section[];
  faqs: Faq[];
  /** Ids from `CASE_STUDIES` shown under the article. */
  caseStudies: string[];
  /**
   * Related article slugs, in order. Defaults to the other articles in the
   * same cluster.
   */
  related?: string[];
};
