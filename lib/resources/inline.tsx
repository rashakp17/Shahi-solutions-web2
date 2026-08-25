import Link from "next/link";
import type { ReactNode } from "react";
import type { Inline } from "./types";

/**
 * The three inline forms, in one pass.
 *
 * One alternation rather than three sequential replacements, because
 * sequential passes over a string cannot see each other's output: run the link
 * rule first and a `**bold**` inside a link label has already been swallowed
 * into a React element that the emphasis rule can no longer reach into. A
 * single tokenising scan visits every character exactly once and hands each
 * match to the branch that owns it.
 *
 * Capture groups, in order:
 *   1  link label      2  link href
 *   3  strong text
 *   4  emphasised text
 *   5  code text
 *
 * The label and the code span are lazy (`+?`) so that two links on one line do
 * not merge into a single match running from the first `[` to the last `)`.
 *
 * `**strong**` is listed before `*stress*` and that order is load-bearing:
 * alternation is tried left to right at each position, so with the single
 * asterisk first, `**fit**` would match the empty-ish `*` branch and leave a
 * stray asterisk on either side of the word.
 */
const TOKEN =
  /\[([^\]]+?)\]\(([^)\s]+)\)|\*\*([^*]+?)\*\*|\*([^*]+?)\*|`([^`]+?)`/g;

/**
 * Resolve the inline markup in a content string to React nodes.
 *
 * Returns a plain string when there is nothing to resolve, which is the common
 * case — most paragraphs carry no markup at all, and handing React a string
 * rather than a one-element array keeps the tree that much smaller.
 *
 * There is no `dangerouslySetInnerHTML` anywhere in this file, and that is the
 * point of parsing rather than templating: content strings become React
 * elements, so anything that is not one of the three forms above is text, and
 * text is escaped by React on the way out.
 */
export function renderInline(source: Inline): ReactNode {
  TOKEN.lastIndex = 0;

  const out: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = TOKEN.exec(source)) !== null) {
    if (match.index > cursor) out.push(source.slice(cursor, match.index));
    cursor = match.index + match[0].length;

    const [, label, href, strong, stress, code] = match;

    if (label !== undefined && href !== undefined) {
      out.push(<InlineLink key={key++} href={href} label={label} />);
    } else if (strong !== undefined) {
      out.push(
        <strong key={key++} className="rs-strong">
          {strong}
        </strong>,
      );
    } else if (stress !== undefined) {
      out.push(<em key={key++}>{stress}</em>);
    } else if (code !== undefined) {
      out.push(
        <code key={key++} className="rs-code">
          {code}
        </code>,
      );
    }
  }

  if (cursor === 0) return source;
  if (cursor < source.length) out.push(source.slice(cursor));

  return out;
}

/**
 * A link inside running prose.
 *
 * The split is the same one `Button` makes and for the same reasons: the
 * router has nothing to prefetch for an external host, and a link that opens a
 * new tab needs `noopener` so the opened page cannot reach back through
 * `window.opener`. Internal paths get next/link, so a reader moving from an
 * article to a service page or to the next article in the cluster gets a
 * client navigation rather than a full reload — which is most of what makes
 * the cluster feel like one document.
 */
function InlineLink({ href, label }: { href: string; label: string }) {
  if (/^https?:/i.test(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="rs-link"
      >
        {label}
      </a>
    );
  }

  if (/^(tel:|mailto:|#)/i.test(href)) {
    return (
      <a href={href} className="rs-link">
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className="rs-link">
      {label}
    </Link>
  );
}

/**
 * The same string with its markup removed rather than resolved.
 *
 * Structured data is plain text — a `FAQPage` answer containing
 * `[our process](/resources/...)` is a broken sentence in a search result, and
 * an `<a>` element cannot be serialised into JSON-LD anyway. So the FAQ block
 * renders through `renderInline` and the JSON-LD renders through this, from
 * the same source string. Two representations, one fact.
 */
export function stripInline(source: Inline): string {
  return source
    .replace(/\[([^\]]+?)\]\(([^)\s]+)\)/g, "$1")
    .replace(/\*\*([^*]+?)\*\*/g, "$1")
    .replace(/\*([^*]+?)\*/g, "$1")
    .replace(/`([^`]+?)`/g, "$1");
}
