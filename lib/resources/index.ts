import type { Article, Block, Section } from "./types";
import { stripInline } from "./inline";

import { article as whatIs } from "./articles/what-is-custom-software-development";
import { article as examples } from "./articles/custom-software-development-examples";
import { article as process } from "./articles/custom-software-development-process";
import { article as cost } from "./articles/custom-software-development-cost";
import { article as vsOffTheShelf } from "./articles/custom-software-vs-off-the-shelf";

/**
 * Resource registry. The sitemap, index page, article pages and table of
 * contents are all derived from here.
 *
 * A cluster is a pillar article plus related articles that link to each other
 * and to one service page. To add a cluster: write the articles, add them to
 * `ARTICLES`, and add a `CLUSTERS` entry. No other code changes needed.
 */

/** All articles, in display order within each cluster. Pillar first. */
export const ARTICLES: Article[] = [
  whatIs,
  examples,
  process,
  cost,
  vsOffTheShelf,
];

export type Cluster = {
  id: string;
  /** Shown above an article and on the index. */
  title: string;
  /** One line under the cluster name on the index page. */
  blurb: string;
  /** Slug of the pillar article. */
  pillar: string;
  /** The service this cluster links to. */
  service: { label: string; href: string };
};

export const CLUSTERS: Cluster[] = [
  {
    id: "custom-software-development",
    title: "Custom Software Development",
    blurb:
      "What it is, what gets built, how a project runs, what it costs, and how to decide between building and buying.",
    pillar: "what-is-custom-software-development",
    service: {
      label: "Custom Software Development",
      href: "/services/custom-software-development",
    },
  },
];

const BY_SLUG = new Map(ARTICLES.map((a) => [a.slug, a]));
const CLUSTER_BY_ID = new Map(CLUSTERS.map((c) => [c.id, c]));

export function articleBySlug(slug: string): Article | undefined {
  return BY_SLUG.get(slug);
}

export function clusterOf(article: Article): Cluster | undefined {
  return CLUSTER_BY_ID.get(article.cluster);
}

/** Every article in a cluster, in registry order. */
export function articlesInCluster(clusterId: string): Article[] {
  return ARTICLES.filter((a) => a.cluster === clusterId);
}

/**
 * Related articles. Uses `article.related` if set, otherwise the rest of the
 * cluster. Excludes the article itself.
 */
export function relatedTo(article: Article): Article[] {
  const source = article.related
    ? article.related.map((slug) => BY_SLUG.get(slug))
    : articlesInCluster(article.cluster);

  return source.filter(
    (a): a is Article => !!a && a.slug !== article.slug,
  );
}

/* ------------------------------------------------------------------
   Derived reading aids
   ------------------------------------------------------------------ */

export type TocEntry = { id: string; heading: string };

/** Table of contents from the sections, plus the FAQ when there is one. */
export function tableOfContents(article: Article): TocEntry[] {
  const entries: TocEntry[] = article.sections.map((s) => ({
    id: s.id,
    heading: s.heading,
  }));

  if (article.faqs.length) {
    entries.push({ id: "faq", heading: "Frequently asked questions" });
  }

  return entries;
}

/** All text in a block, for word counting. */
function textOf(block: Block): string[] {
  switch (block.kind) {
    case "p":
      return [block.text];
    case "list":
      return block.items;
    case "examples":
      return block.items.flatMap((i) => [i.label ?? "", i.title, i.text]);
    case "note":
      return [block.label, block.text];
    case "figure":
      return [block.caption];
    case "table":
      return [...block.head, ...block.rows.flat(), block.caption ?? ""];
    case "bridge":
      return [block.prompt, block.label];
  }
}

function wordsIn(strings: string[]): number {
  let total = 0;
  for (const s of strings) {
    const trimmed = stripInline(s).trim();
    if (trimmed) total += trimmed.split(/\s+/).length;
  }
  return total;
}

function sectionWords(section: Section): number {
  return (
    wordsIn([section.heading]) +
    section.blocks.reduce((sum, b) => sum + wordsIn(textOf(b)), 0)
  );
}

/** Reading time in minutes at 220 wpm, minimum 1. */
export function readingMinutes(article: Article): number {
  const words =
    wordsIn([article.title, article.lead]) +
    article.sections.reduce((sum, s) => sum + sectionWords(s), 0) +
    article.faqs.reduce((sum, f) => sum + wordsIn([f.q, f.a]), 0);

  return Math.max(1, Math.round(words / 220));
}

/**
 * Formats the `updated` date. Locale and time zone are fixed so server and
 * client output match (avoids hydration mismatches and off-by-one days).
 */
export function formatUpdated(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
