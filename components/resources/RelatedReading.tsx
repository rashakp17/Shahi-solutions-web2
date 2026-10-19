import Link from "next/link";
import type { Article } from "@/lib/resources/types";

/** Numbered list of related articles, using each article's meta description. */
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
