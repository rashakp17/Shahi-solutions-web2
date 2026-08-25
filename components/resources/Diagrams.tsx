import type { CSSProperties } from "react";
import type { DiagramKey } from "@/lib/resources/types";

/* ------------------------------------------------------------------
   The article figures

   ── Why these are HTML and not SVG ──
   Every one of these is a diagram whose content is labelled quantities or
   labelled boxes, and for that shape HTML wins on four counts that all
   matter here:

     It reflows. An SVG has one aspect ratio and one internal layout; a
     five-phase bar drawn wide enough to label on a desktop is illegible
     at 360px, and the usual fix is to ship two drawings and hide one.
     These are flex and grid, so the same markup becomes a column on a
     phone and a row on a laptop.

     The text is text. Real DOM text is selectable, searchable, indexable
     and read correctly by a screen reader in document order — none of
     which is reliably true of <text> inside an <svg>. On a page whose
     entire purpose is that its content is genuinely readable, drawing
     the words would be exactly the wrong trade.

     It costs no layout shift. An SVG with text in it re-lays that text
     out when the webfont arrives. A diagram made of divs shifts no more
     than the paragraph above it.

     It themes for free. Everything below is drawn from the same custom
     properties as the rest of the site, so all five follow the toggle
     without a second palette.

   None of them are decorative. Each one carries information the prose
   states but does not show — a proportion, a coverage, a topology — and
   each is captioned by the block that renders it.
   ------------------------------------------------------------------ */

/**
 * The five phases, and the share of a typical engagement each takes.
 *
 * The numbers are the midpoints of the ranges the process article gives, and
 * they sum to 100 deliberately: a proportion diagram whose parts do not add up
 * is a diagram somebody will check.
 */
const PHASES = [
  { name: "Discovery & scoping", share: 15, note: "2–4 weeks" },
  { name: "Architecture & design", share: 15, note: "Data model first" },
  { name: "Build", share: 45, note: "Increments of 1–2 weeks" },
  { name: "Testing & acceptance", share: 15, note: "Four distinct kinds" },
  { name: "Launch & handover", share: 10, note: "Migration is the risk" },
];

function BuildProcess() {
  return (
    <ol className="rs-bars">
      {PHASES.map((phase, i) => (
        <li key={phase.name} className="rs-bar-row">
          <span className="rs-bar-index" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>

          <span className="rs-bar-label">
            {phase.name}
            <span className="rs-bar-note">{phase.note}</span>
          </span>

          {/* The track is aria-hidden and the share is announced from the
              value beside it instead. A screen reader has no use for a
              rectangle, and reading "15%" once is the whole of the
              information the bar carries. */}
          <span className="rs-bar-track" aria-hidden="true">
            <span
              className="rs-bar-fill"
              style={{ "--w": `${phase.share}%` } as CSSProperties}
            />
          </span>

          <span className="rs-bar-value">{phase.share}%</span>
        </li>
      ))}
    </ol>
  );
}

/**
 * Where the money goes in a mid-sized build.
 *
 * A single stacked bar rather than a second list of bars, because the point
 * this figure makes is about the *whole* — that feature code is a minority of
 * a total — and a stack is the only form that shows a total.
 */
const COST_PARTS = [
  { name: "Discovery & scope", share: 15 },
  { name: "Design & architecture", share: 12 },
  { name: "Feature code", share: 40 },
  { name: "Testing & QA", share: 15 },
  { name: "Data migration", share: 10 },
  { name: "Launch & handover", share: 8 },
];

function CostComposition() {
  return (
    <div className="rs-stack-figure">
      <div className="rs-stack" aria-hidden="true">
        {COST_PARTS.map((part, i) => (
          <span
            key={part.name}
            className="rs-stack-seg"
            data-tone={i === 2 ? "key" : undefined}
            style={{ "--w": `${part.share}%` } as CSSProperties}
          />
        ))}
      </div>

      {/* The legend is the accessible copy of the bar above it — same order,
          same numbers, as a real list. */}
      <ul className="rs-legend">
        {COST_PARTS.map((part, i) => (
          <li key={part.name} className="rs-legend-item">
            <span
              className="rs-legend-dot"
              data-tone={i === 2 ? "key" : undefined}
              aria-hidden="true"
            />
            <span className="rs-legend-name">{part.name}</span>
            <span className="rs-legend-value">{part.share}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Coverage: what a product reaches and what a build reaches.
 *
 * Six processes drawn from the same operation, marked per option. The
 * asymmetry is the argument, and it is deliberately not one-sided — the
 * product column is full marks on the first three, which is the honest
 * picture and the reason most businesses run both.
 */
const COVERAGE: Array<{
  process: string;
  bought: "full" | "partial" | "none";
  built: "full" | "partial" | "none";
}> = [
  { process: "Accounting & payroll", bought: "full", built: "none" },
  { process: "Email & documents", bought: "full", built: "none" },
  { process: "Standard reporting", bought: "full", built: "full" },
  { process: "Your pricing rules", bought: "partial", built: "full" },
  { process: "Your job routing", bought: "partial", built: "full" },
  { process: "Your exception handling", bought: "none", built: "full" },
];

const MARK_LABEL = {
  full: "Covered well",
  partial: "Covered awkwardly",
  none: "Not covered",
} as const;

function Mark({ state }: { state: "full" | "partial" | "none" }) {
  return (
    <span className="rs-mark" data-state={state}>
      <span className="rs-sr">{MARK_LABEL[state]}</span>
    </span>
  );
}

function BuildVsBuy() {
  return (
    <div className="rs-coverage">
      <div className="rs-coverage-head" aria-hidden="true">
        <span />
        <span className="rs-coverage-col">Off-the-shelf</span>
        <span className="rs-coverage-col">Custom</span>
      </div>

      <ul className="rs-coverage-body">
        {COVERAGE.map((row) => (
          <li key={row.process} className="rs-coverage-row">
            <span className="rs-coverage-name">{row.process}</span>

            <span className="rs-coverage-cell">
              {/* The column header is aria-hidden, so each cell names its own
                  option. A row read aloud is then self-contained — which is
                  what a two-column comparison has to be when it is being
                  heard rather than seen. */}
              <span className="rs-sr">Off-the-shelf: </span>
              <Mark state={row.bought} />
            </span>

            <span className="rs-coverage-cell">
              <span className="rs-sr">Custom: </span>
              <Mark state={row.built} />
            </span>
          </li>
        ))}
      </ul>

      <p className="rs-coverage-key">
        <span className="rs-mark" data-state="full" aria-hidden="true" /> Covered
        well
        <span className="rs-mark" data-state="partial" aria-hidden="true" />{" "}
        Covered awkwardly
        <span className="rs-mark" data-state="none" aria-hidden="true" /> Not
        covered
      </p>
    </div>
  );
}

/**
 * The system-of-record topology: many ways in, one store.
 *
 * Drawn as three bands with a spine between them, because the thing worth
 * seeing is that the middle band has exactly one box in it.
 */
const RECORD_INPUTS = ["Warehouse floor", "Sales desk", "Finance", "Field team"];
const RECORD_OUTPUTS = ["Live dashboards", "Month-end reporting", "Exports & API"];

function SystemsMap() {
  return (
    <div className="rs-map">
      <p className="rs-map-band-label">Who writes to it</p>
      <ul className="rs-map-row">
        {RECORD_INPUTS.map((node) => (
          <li key={node} className="rs-node">
            {node}
          </li>
        ))}
      </ul>

      <span className="rs-spine" aria-hidden="true" />

      <div className="rs-node rs-node--core">
        One authoritative record
        <span className="rs-node-sub">Stock · Orders · Customers · Jobs</span>
      </div>

      <span className="rs-spine" aria-hidden="true" />

      <p className="rs-map-band-label">What reads from it</p>
      <ul className="rs-map-row">
        {RECORD_OUTPUTS.map((node) => (
          <li key={node} className="rs-node">
            {node}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The arrangement most established businesses land on.
 *
 * Three columns, with the middle one narrower and marked as the seam. The
 * design says what the prose says: the integration layer is small, it is in
 * the middle of everything, and it is the part with an owner.
 */
const SPINE = [
  {
    label: "Bought",
    tone: "muted" as const,
    items: ["Accounting", "Payroll & HR", "Email & docs", "Helpdesk"],
  },
  {
    label: "Integration layer",
    tone: "seam" as const,
    items: ["Canonical mapping", "Scheduled sync", "Exception queue"],
  },
  {
    label: "Built",
    tone: "key" as const,
    items: ["Your operations core", "Your pricing rules", "Customer product"],
  },
];

function IntegrationSpine() {
  return (
    <div className="rs-spine-figure">
      {SPINE.map((column) => (
        <section key={column.label} className="rs-column" data-tone={column.tone}>
          <h3 className="rs-column-head">{column.label}</h3>
          <ul className="rs-column-list">
            {column.items.map((item) => (
              <li key={item} className="rs-column-item">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

const DIAGRAMS: Record<DiagramKey, () => React.JSX.Element> = {
  "build-process": BuildProcess,
  "cost-composition": CostComposition,
  "build-vs-buy": BuildVsBuy,
  "systems-map": SystemsMap,
  "integration-spine": IntegrationSpine,
};

export function Diagram({ name }: { name: DiagramKey }) {
  const Drawing = DIAGRAMS[name];
  return <Drawing />;
}
