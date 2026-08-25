import Link from "next/link";
import { readingMinutes } from "@/lib/resources";
import type { Article } from "@/lib/resources/types";

/**
 * The rest of the cluster.
 *
 * A numbered index rather than a grid of cards, for the same reason the
 * examples are a numbered list: three cards under an article reads as a
 * recommendation engine, and a numbered index reads as the remaining chapters
 * of something — which is what a topic cluster actually is.
 *
 * The description is the article's own meta description, not a second summary
 * written for this list. One sentence per article, in one place: what a search
 * result says about a page and what this site says about it cannot then
 * disagree.
 */
export function RelatedReading({
  articles,
  clusterTitle,
}: {
  articles: Article[];
  clusterTitle: string;
}) {
  if (!articles.length) return null;

  return (
    <section className="rs-related" aria-labelledby="rs-related-head">
      <p className="rs-eyebrow">Continue reading</p>
      <h2 id="rs-related-head" className="rs-h2">
        More on {clusterTitle}
      </h2>

      <ol className="rs-related-list">
        {articles.map((article, i) => (
          <li key={article.slug} className="rs-related-item">
            <Link href={`/resources/${article.slug}`} className="rs-related-link">
              <span className="rs-related-index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="rs-related-body">
                <span className="rs-related-title">{article.title}</span>
                <span className="rs-related-desc">{article.description}</span>
                <span className="rs-related-meta">
                  {readingMinutes(article)} min read
                </span>
              </span>

              <span className="rs-related-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
