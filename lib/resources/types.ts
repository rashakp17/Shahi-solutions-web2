/**
 * The shape of a resource article.
 *
 * Content is data, not JSX, and that is the decision this file exists to
 * record. Every article could have been a `.tsx` page with the prose written
 * inline — it would render the same and need no renderer at all — and it would
 * have cost the things that make a content layer worth having:
 *
 *   The table of contents would be hand-maintained. Here it is derived from
 *   the sections, so a heading and its anchor cannot drift apart and a new
 *   section cannot be forgotten in the contents.
 *
 *   The FAQ markup and the FAQPage JSON-LD would be written twice, and the
 *   second copy would go stale first. Here both read the same array, so the
 *   structured data can never claim an answer the page does not show — which
 *   is precisely the thing Google penalises.
 *
 *   Reading time, word count, related-article resolution and the sitemap would
 *   each need their own source. Here they are all computed from the same
 *   objects.
 *
 * The cost is a renderer and this type file. That is a fixed cost paid once,
 * against a per-article cost that never stops being paid.
 */

/**
 * A string carrying a very small inline markup, resolved by `renderInline`.
 *
 * Supported, and deliberately nothing else:
 *
 *   [label](/href)   a link. Internal paths go through next/link; anything
 *                    starting http(s) becomes a real anchor with rel guards.
 *   **strong**       emphasis, rendered as <strong>.
 *   *stress*         a lighter emphasis on one word, rendered as <em>.
 *   `code`           an inline code span.
 *
 * No headings, no lists, no images — those are blocks, and a block is a thing
 * the design has an opinion about. Keeping the inline vocabulary this small is
 * what stops the content files from slowly becoming a second, worse Markdown.
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
  /** A paragraph. The workhorse. */
  | { kind: "p"; text: Inline }
  /** A bulleted or numbered list of short points. */
  | { kind: "list"; items: Inline[]; ordered?: boolean }
  /**
   * A worked example or a named case: a title, an optional one-word label
   * above it, and a paragraph. Rendered as a numbered editorial entry rather
   * than a card, so a run of six reads as a list of examples and not as a
   * grid of tiles.
   */
  | {
      kind: "examples";
      items: Array<{ label?: string; title: string; text: Inline }>;
    }
  /**
   * An aside. One label, one short paragraph, set off by a rule — for the
   * caveat that would derail a paragraph if it were left inside it.
   */
  | { kind: "note"; label: string; text: Inline }
  /** A drawn diagram with a real caption. Never decorative; see Diagrams.tsx. */
  | { kind: "figure"; diagram: DiagramKey; caption: Inline }
  /** A comparison table. Scrolls inside its own box rather than the page. */
  | { kind: "table"; head: string[]; rows: Inline[][]; caption?: Inline }
  /**
   * The bridge from the article into the service it is about.
   *
   * A block rather than fixed page furniture, because where it lands is the
   * whole point: it belongs at the moment in the argument where a reader has
   * just understood what they would be buying, which is a different paragraph
   * in every article.
   */
  | { kind: "bridge"; prompt: Inline; label: string; href: string };

export type Section = {
  /**
   * The anchor, and the table of contents entry's target. Written out rather
   * than slugified from the heading so that editing a heading for tone does
   * not silently break every inbound link to that section.
   */
  id: string;
  /** The H2. Carries the keyword where there is honestly one to carry. */
  heading: string;
  blocks: Block[];
};

export type Faq = { q: string; a: Inline };

export type Article = {
  /** The last segment of the URL: /resources/<slug>. */
  slug: string;
  /** The H1. What the page is, in the words somebody would search for. */
  title: string;
  /**
   * The `<title>`. Usually the H1 plus the brand, sometimes a longer form —
   * a title tag has ~60 characters of room and an H1 has a whole column, so
   * forcing them to be the same string makes one of the two worse.
   */
  metaTitle: string;
  /** The meta description. One sentence, written for a person, under ~160 chars. */
  description: string;
  /** The small label above the H1 — the cluster this article belongs to. */
  eyebrow: string;
  /** The standfirst: two or three sentences under the H1, before the contents. */
  lead: Inline;
  /** ISO date, published as `dateModified` and shown in the hero. */
  updated: string;
  /** The cluster id this article is part of. See `CLUSTERS`. */
  cluster: string;
  sections: Section[];
  faqs: Faq[];
  /** Ids from `CASE_STUDIES` — the work shown under the article. */
  caseStudies: string[];
  /**
   * Sibling articles to send the reader to next, in order.
   *
   * Optional: left out, an article links to every other article in its
   * cluster, which is the behaviour a topic cluster wants by default. Set it
   * only to change the order or to reach outside the cluster.
   */
  related?: string[];
};
