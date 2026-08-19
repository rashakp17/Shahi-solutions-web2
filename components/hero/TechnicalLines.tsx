import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * Barely-visible technical linework: hairline rules, coordinate ticks,
 * measurement brackets and wide arcs.
 *
 * Drawn as two SVG passes on different parallax planes. The viewBox is
 * sliced rather than stretched, so nothing skews on wide or narrow screens,
 * and every path is kept out of the central band where the headline sits.
 *
 * Stroke opacities run 0.03–0.09 against a near-black ground — under the
 * vignette these are essentially invisible until you look for them, which is
 * the intent. They give the empty areas of the screen something to hold.
 */

const stroke = "currentColor";

function lineVars(x: number, y: number, duration: number, delay: number): CSSProperties {
  return {
    "--line-x": `${x}px`,
    "--line-y": `${y}px`,
    "--line-duration": `${duration}s`,
    "--line-delay": `${delay}s`,
  } as CSSProperties;
}

/** Small coordinate cross, the kind that marks a datum on a technical plot. */
function Tick({ x, y, s = 5, o = 0.5 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <g opacity={o}>
      <line x1={x - s} y1={y} x2={x + s} y2={y} />
      <line x1={x} y1={y - s} x2={x} y2={y + s} />
    </g>
  );
}

/** Corner bracket — a framing mark, like a crop or measurement guide. */
function Bracket({
  x,
  y,
  w,
  h,
  o = 0.5,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  o?: number;
}) {
  return <polyline points={`${x},${y + h} ${x},${y} ${x + w},${y}`} opacity={o} />;
}

export function TechnicalLines({ variant }: { variant: "far" | "mid" }) {
  const common = {
    className: "absolute inset-0 h-full w-full text-accent-200",
    viewBox: "0 0 1440 900",
    preserveAspectRatio: "xMidYMid slice" as const,
    fill: "none" as const,
    stroke,
    strokeWidth: 1,
    vectorEffect: "non-scaling-stroke" as const,
    "aria-hidden": true,
  };

  if (variant === "far") {
    return (
      <svg {...common} opacity={0.1}>
        {/* Wide arcs centred well off-canvas, so only a shallow sweep shows */}
        <g opacity={0.55}>
          <circle cx={-260} cy={450} r={720} />
          <circle cx={1720} cy={300} r={640} />
          <circle cx={720} cy={1480} r={880} />
        </g>

        {/* Hairline rules — edges only, nothing crosses the headline */}
        <g opacity={0.4}>
          <line x1={0} y1={132} x2={392} y2={132} />
          <line x1={1048} y1={132} x2={1440} y2={132} />
          <line x1={0} y1={772} x2={330} y2={772} />
          <line x1={1110} y1={772} x2={1440} y2={772} />
          <line x1={196} y1={0} x2={196} y2={210} />
          <line x1={1244} y1={690} x2={1244} y2={900} />
        </g>

        {/* Long shallow diagonals reaching in from the corners */}
        <g opacity={0.3}>
          <line x1={-40} y1={640} x2={360} y2={900} />
          <line x1={1480} y1={210} x2={1090} y2={-30} />
        </g>
      </svg>
    );
  }

  return (
    <svg {...common} opacity={0.16}>
      {/* Measurement brackets in the corners */}
      <g strokeLinecap="square">
        <Bracket x={72} y={96} w={54} h={54} o={0.5} />
        <Bracket x={1368} y={804} w={-54} h={-54} o={0.5} />
        <Bracket x={72} y={804} w={40} h={-40} o={0.32} />
      </g>

      {/* Coordinate ticks, scattered around the edges */}
      <g opacity={0.6}>
        <Tick x={148} y={318} />
        <Tick x={92} y={556} s={4} o={0.4} />
        <Tick x={1310} y={252} />
        <Tick x={1216} y={614} s={4} o={0.45} />
        <Tick x={286} y={742} s={4} o={0.35} />
        <Tick x={1092} y={148} s={6} o={0.3} />
        <Tick x={640} y={64} s={4} o={0.28} />
        <Tick x={824} y={848} s={4} o={0.3} />
      </g>

      {/* Short scale marks — a ruler edge running down each side */}
      <g opacity={0.34}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={`l-${i}`} x1={40} y1={300 + i * 44} x2={i % 2 ? 52 : 60} y2={300 + i * 44} />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={`r-${i}`} x1={1400} y1={392 + i * 44} x2={i % 2 ? 1388 : 1380} y2={392 + i * 44} />
        ))}
      </g>

      {/* A couple of geometric paths */}
      <g opacity={0.26}>
        <polyline points="112,206 214,206 268,142" />
        <polyline points="1328,668 1226,668 1170,732" />
        <circle cx={214} cy={206} r={3} />
        <circle cx={1226} cy={668} r={3} />
      </g>
    </svg>
  );
}

/** Wraps a linework pass in its own extremely slow independent shift. */
export function TechnicalLinesLayer({
  variant,
  className,
}: {
  variant: "far" | "mid";
  className?: string;
}) {
  const motion =
    variant === "far"
      ? lineVars(14, -9, 64, -18)
      : lineVars(-22, 13, 47, -31);

  return (
    <div className={cn("anim-line-shift absolute inset-0", className)} style={motion}>
      <TechnicalLines variant={variant} />
    </div>
  );
}
