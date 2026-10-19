import Link from "next/link";
import type { ReactNode } from "react";
import type { Inline } from "./types";

/**
 * Matches all inline forms in a single pass.
 *
 * Capture groups:
 *   1  link label      2  link href
 *   3  strong text
 *   4  emphasised text
 *   5  code text
 *
 * Lazy quantifiers keep two links on one line from merging. `**` must come
 * before `*` in the alternation or bold text leaves stray asterisks.
 */
const TOKEN =
  /\[([^\]]+?)\]\(([^)\s]+)\)|\*\*([^*]+?)\*\*|\*([^*]+?)\*|`([^`]+?)`/g;

/**
 * Converts inline markup to React nodes. Returns the plain string when there
 * is no markup. Everything else is rendered as escaped text.
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
 * Inline link: external URLs open in a new tab with noopener, tel/mailto/hash
 * use a plain anchor, internal paths use next/link.
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

/** Strips inline markup to plain text, e.g. for JSON-LD and word counts. */
export function stripInline(source: Inline): string {
  return source
    .replace(/\[([^\]]+?)\]\(([^)\s]+)\)/g, "$1")
    .replace(/\*\*([^*]+?)\*\*/g, "$1")
    .replace(/\*([^*]+?)\*/g, "$1")
    .replace(/`([^`]+?)`/g, "$1");
}
