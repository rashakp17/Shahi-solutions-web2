import Link from "next/link";
import { Diagram } from "@/components/resources/Diagrams";
import { renderInline } from "@/lib/resources/inline";
import type { Block, Section } from "@/lib/resources/types";

/* ------------------------------------------------------------------
   The block renderer

   One switch, one component per block kind, and no styling decisions
   taken here — everything visual is a class in the .rs- namespace in
   globals.css, matching how every other section on this site is built.

   The whole body is server-rendered with no client JavaScript. That is
   worth stating because it is the reason these pages are fast: an
   article is text, a few rules and a diagram made of divs, so there is
   nothing to hydrate and the HTML that arrives is the finished page.
   The only client component in the resource layer is the table of
   contents, which needs a scroll position to do its job.
   ------------------------------------------------------------------ */

function Paragraph({ text }: { text: string }) {
  return <p className="rs-p">{renderInline(text)}</p>;
}

function List({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";

  return (
    <Tag className="rs-list" data-ordered={ordered ? "" : undefined}>
      {items.map((item, i) => (
        <li key={i} className="rs-list-item">
          {/* The counter is drawn by CSS from a real <ol>, not written into
              the content — so the numbering cannot disagree with the order,
              and a screen reader still announces "list, 4 items". */}
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

          {/* h3 rather than a styled paragraph. These are genuine
              subdivisions of the h2 above them, and a reader navigating by
              headings should be able to move between the examples — which
              is also how a search engine reads the structure of the page. */}
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
      {/* The scroll container is the div, not the page.

          A six-column comparison cannot narrow past its longest cell, so on a
          phone something has to scroll. Letting it be the table keeps the
          article column itself from scrolling sideways, which is the failure
          that makes a page feel broken on a phone rather than merely tight.

          tabIndex and the role make it reachable from the keyboard: a region
          that scrolls but cannot be focused is a region a keyboard user
          cannot read the right-hand side of. */}
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
                  /* The first cell of each row is the row's own heading —
                     which is what lets a screen reader announce "Fit,
                     Custom: built for your operation" instead of reading a
                     value with nothing attached to it. */
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

/**
 * The bridge from the article into the service it is about.
 *
 * Deliberately not a banner. It is a rule, a line of copy and a link — the
 * same weight as a pull-quote — because the brief this section was built to is
 * that the route into the service should read as the next sentence of the
 * argument rather than as an advertisement interrupting it. A reader who does
 * not want it should be able to pass over it without their eye being caught.
 */
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
          /* The contents links here, and the fixed navbar would otherwise
             land the heading underneath itself. The site already solves this
             for its own sections with a scroll-margin rule in globals.css;
             the same value is applied to .rs-section there. */
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
