import type { Article, Block, Section } from "./types";
import { stripInline } from "./inline";

import { article as whatIs } from "./articles/what-is-custom-software-development";
import { article as examples } from "./articles/custom-software-development-examples";
import { article as process } from "./articles/custom-software-development-process";
import { article as cost } from "./articles/custom-software-development-cost";
import { article as vsOffTheShelf } from "./articles/custom-software-vs-off-the-shelf";

/**
 * The resource layer's registry.
 *
 * Everything the routes need is derived here rather than written down twice:
 * the sitemap reads `ARTICLES`, the index page reads `CLUSTERS`, each article
 * page reads its own record plus `relatedTo` for the outbound links, and the
 * table of contents is computed from the sections it is a contents *of*.
 *
 * ── On topic clusters ──
 * A cluster is a pillar article plus the chapters that expand it, all linking
 * to each other and to the same service page. The structure is what makes the
 * section legible to a search engine — a page's authority comes partly from
 * what links to it, and a cluster is a small, dense, honest link graph rather
 * than a pile of unrelated posts.
 *
 * Adding a second cluster is a data change and nothing else: write the
 * articles, add them to `ARTICLES`, add a `CLUSTERS` entry naming the pillar.
 * Both routes, the sitemap and the index page pick it up with no code change.
 */

/**
 * Every article, in the order the index page lists them within a cluster.
 *
 * The pillar goes first. After that the order is the sequence a reader
 * benefits from rather than the order they were written: what it is, what it
 * looks like, how it is done, what it costs, and then the decision.
 */
export const ARTICLES: Article[] = [
  whatIs,
  examples,
  process,
  cost,
  vsOffTheShelf,
];

export type Cluster = {
  id: string;
  /** The cluster's name, as shown above an article and on the index. */
  title: string;
  /** One line on the index page, under the cluster name. */
  blurb: string;
  /** The slug of the article that anchors the cluster. */
  pillar: string;
  /** The service this cluster funnels into. */
  service: { label: string; href: string };
};

export const CLUSTERS: Cluster[] = [
  {
    id: "custom-software-development",
    title: "Custom Software Development",
    blurb:
      "What it is, what gets built, how a project actually runs, what it costs, and how to decide between building and buying.",
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
 * What to read next, from an article.
 *
 * Defaults to the rest of the cluster in registry order, which is the
 * behaviour a topic cluster wants: every article links to every sibling, so
 * the reader can enter anywhere and the link graph stays dense. An article can
 * override the order — or reach outside its own cluster — with `related`.
 *
 * Self-links are filtered out in both paths. An article listing itself under
 * "continue reading" is the kind of thing that survives a long time in a
 * hand-maintained list, which is most of the argument for deriving it.
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

/**
 * The table of contents, from the sections it describes.
 *
 * The FAQ is appended because it is a real destination — a reader who came
 * from a question-shaped search often wants it first — but it is not a
 * `Section`, so it is added here rather than being faked into the content.
 */
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

/** Every piece of prose in a block, markup removed, for counting. */
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

/**
 * Reading time in whole minutes, computed rather than written down.
 *
 * 220 words a minute — the middle of the range for adults reading non-fiction
 * on a screen, and deliberately not the 200 that most blogs use, which
 * flatters the article by rounding every estimate up.
 *
 * Computed for one reason above the others: a hand-written figure is right on
 * the day it is typed and wrong after the first edit, and it is the sort of
 * wrong nobody notices. A minimum of one minute, because "0 min read" is worse
 * than a small inaccuracy.
 */
export function readingMinutes(article: Article): number {
  const words =
    wordsIn([article.title, article.lead]) +
    article.sections.reduce((sum, s) => sum + sectionWords(s), 0) +
    article.faqs.reduce((sum, f) => sum + wordsIn([f.q, f.a]), 0);

  return Math.max(1, Math.round(words / 220));
}

/**
 * The `updated` date, as a person reads it.
 *
 * `en-GB` and an explicit UTC time zone, both on purpose. The locale is fixed
 * so that the string rendered on the server matches the one React produces
 * during hydration — left to the runtime default those differ between the
 * build machine and the visitor's browser, which is a hydration mismatch on
 * every article page. The time zone is fixed for the same reason: a bare
 * `2026-08-24` is parsed as UTC midnight, and formatting that anywhere west of
 * Greenwich renders the previous day.
 */
export function formatUpdated(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
