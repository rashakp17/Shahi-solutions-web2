import type { CSSProperties } from "react";
import type { DiagramKey } from "@/lib/resources/types";

/* Article diagrams, built with HTML/CSS rather than SVG so they reflow on
   mobile, keep real accessible text and follow the theme variables. */

/**
 * Share of a typical project per phase. Midpoints of the ranges in the
 * process article; must sum to 100.
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

          {/* Decorative; the value is read from the label beside it. */}
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

/** Cost breakdown of a mid-sized build, shown as one stacked bar. */
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

      {/* Legend doubles as the accessible version of the bar. */}
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

/** Process coverage for off-the-shelf vs custom software. */
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
              {/* Header is aria-hidden, so each cell labels itself for screen readers. */}
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

/** System of record: many inputs and outputs around one central store. */
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

/** Bought tools, built core, and the integration layer between them. */
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
