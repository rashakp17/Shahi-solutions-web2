import Link from "next/link";
import { Diagram } from "@/components/resources/Diagrams";
import { renderInline } from "@/lib/resources/inline";
import type { Block, Section } from "@/lib/resources/types";

/* Article block renderer. Server-only; styles are the .rs- classes in
   globals.css. */

function Paragraph({ text }: { text: string }) {
  return <p className="rs-p">{renderInline(text)}</p>;
}

function List({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";

  return (
    <Tag className="rs-list" data-ordered={ordered ? "" : undefined}>
      {items.map((item, i) => (
        <li key={i} className="rs-list-item">
          {/* Numbering comes from CSS counters. */}
          <span className="rs-list-text">{renderInline(item)}</span>
        </li>
      ))}
    </Tag>
  );
}

function Examples({
  items,
}: {
  items: Array<{ label?: string; title: string; text: string }>;
}) {
  return (
    <ol className="rs-examples">
      {items.map((item) => (
        <li key={item.title} className="rs-example">
          {item.label && <p className="rs-example-label">{item.label}</p>}

          {/* h3 so examples are navigable by heading. */}
          <h3 className="rs-example-title">{item.title}</h3>

          <p className="rs-example-text">{renderInline(item.text)}</p>
        </li>
      ))}
    </ol>
  );
}

function Note({ label, text }: { label: string; text: string }) {
  return (
    <aside className="rs-note">
      <p className="rs-note-label">{label}</p>
      <p className="rs-note-text">{renderInline(text)}</p>
    </aside>
  );
}

function Figure({
  diagram,
  caption,
}: {
  diagram: Parameters<typeof Diagram>[0]["name"];
  caption: string;
}) {
  return (
    <figure className="rs-figure">
      <div className="rs-figure-frame">
        <Diagram name={diagram} />
      </div>
      <figcaption className="rs-figure-caption">
        {renderInline(caption)}
      </figcaption>
    </figure>
  );
}

function Table({
  head,
  rows,
  caption,
}: {
  head: string[];
  rows: string[][];
  caption?: string;
}) {
  return (
    <figure className="rs-table-figure">
      {/* Wide tables scroll inside this div instead of the page. Focusable so
          keyboard users can scroll it. */}
      <div
        className="rs-table-scroll"
        role="region"
        aria-label="Comparison table, scrolls horizontally"
        tabIndex={0}
      >
        <table className="rs-table">
          <thead>
            <tr>
              {head.map((cell, i) => (
                <th key={i} scope="col">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) =>
                  /* First cell is the row header. */
                  ci === 0 ? (
                    <th key={ci} scope="row">
                      {renderInline(cell)}
                    </th>
                  ) : (
                    <td key={ci}>{renderInline(cell)}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {caption && (
        <figcaption className="rs-figure-caption">
          {renderInline(caption)}
        </figcaption>
      )}
    </figure>
  );
}

/** Inline link from the article to its service page, styled like a pull-quote. */
function Bridge({
  prompt,
  label,
  href,
}: {
  prompt: string;
  label: string;
  href: string;
}) {
  return (
    <aside className="rs-bridge">
      <p className="rs-bridge-prompt">{renderInline(prompt)}</p>
      <Link href={href} className="rs-bridge-link">
        {label}
        <span aria-hidden="true" className="rs-bridge-arrow">
          →
        </span>
      </Link>
    </aside>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "p":
      return <Paragraph text={block.text} />;
    case "list":
      return <List items={block.items} ordered={block.ordered} />;
    case "examples":
      return <Examples items={block.items} />;
    case "note":
      return <Note label={block.label} text={block.text} />;
    case "figure":
      return <Figure diagram={block.diagram} caption={block.caption} />;
    case "table":
      return (
        <Table head={block.head} rows={block.rows} caption={block.caption} />
      );
    case "bridge":
      return (
        <Bridge prompt={block.prompt} label={block.label} href={block.href} />
      );
  }
}

export function ArticleBody({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="rs-section"
          /* .rs-section has scroll-margin in globals.css to clear the navbar. */
          aria-labelledby={`${section.id}-heading`}
        >
          <h2 id={`${section.id}-heading`} className="rs-h2">
            {section.heading}
          </h2>

          {section.blocks.map((block, i) => (
            <BlockView key={i} block={block} />
          ))}
        </section>
      ))}
    </>
  );
}
