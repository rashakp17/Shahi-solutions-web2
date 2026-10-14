import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

type Depth = "far" | "mid" | "near";

type Glyph = {
  char: string;
  /** Position as percentages. Values outside 0–100 clip at the hero edge. */
  x: number;
  y: number;
  /** rem */
  size: number;
  opacity: number;
  /** Seconds for one drift cycle. */
  duration: number;
  /** Negative, so the glyph is already mid-cycle on the first frame. */
  delay: number;
  /** Drift components, px. */
  dx: number;
  dy: number;
  /** Total rotation across one cycle, deg. Kept tiny. */
  rot: number;
  scaleFrom: number;
  scaleTo: number;
  depth: Depth;
  /** Hidden below md, to keep the mobile field sparse and cheap. */
  desktopOnly?: boolean;
};

/**
 * The vocabulary is the platform's own: braces and shell prompts, status
 * codes, latency percentiles, versions, regions, throughput. Nothing is
 * decorative-mathematical — every mark is something that would actually
 * appear in a terminal, a dashboard or a request log.
 *
 * All of it is deliberately plain ASCII. These render in JetBrains Mono with
 * no font substitution, so nothing falls back to a system face with different
 * metrics and breaks the monospaced rhythm of the field.
 *
 * The composition rule: the centre band (x 26–74 crossed with y 26–68) is
 * left empty, because that is where the headline and CTAs sit. Everything is
 * pushed to the sides, the corners, and the top and bottom edges. A number of
 * glyphs are positioned past the viewport boundary on purpose — they clip,
 * which is what makes the field read as a window onto something larger rather
 * than a decorated rectangle.
 *
 * All values are hand-authored and deterministic: the server and client must
 * render identical markup, and the placement is meant to look intentional
 * rather than scattered.
 */
const GLYPHS: Glyph[] = [
  // ---------- FAR: faintest, slowest, carries the blur of distance ----------
  { char: "{ }", x: -2, y: 18, size: 2.4, opacity: 0.030, duration: 58, delay: -12, dx: 14, dy: -44, rot: 4, scaleFrom: 1, scaleTo: 1.1, depth: "far" },
  { char: "99.99%", x: 6, y: 88, size: 1.0, opacity: 0.026, duration: 54, delay: -31, dx: -11, dy: -52, rot: -3, scaleFrom: 1.06, scaleTo: 0.95, depth: "far" },
  { char: "</>", x: 91, y: 14, size: 1.9, opacity: 0.028, duration: 61, delay: -7, dx: -13, dy: -38, rot: 6, scaleFrom: 0.96, scaleTo: 1.12, depth: "far" },
  { char: "10.0.0.1", x: 79, y: 93, size: 0.85, opacity: 0.024, duration: 56, delay: -22, dx: 16, dy: -47, rot: 2, scaleFrom: 1, scaleTo: 1.08, depth: "far" },
  { char: "$_", x: 17, y: 6, size: 1.9, opacity: 0.027, duration: 49, delay: -38, dx: -9, dy: -55, rot: -5, scaleFrom: 1.08, scaleTo: 0.94, depth: "far", desktopOnly: true },
  { char: "[ ]", x: 97, y: 62, size: 2.4, opacity: 0.030, duration: 63, delay: -16, dx: -15, dy: -41, rot: 3, scaleFrom: 0.94, scaleTo: 1.14, depth: "far" },
  { char: "HTTP/2", x: 33, y: -3, size: 0.95, opacity: 0.023, duration: 52, delay: -44, dx: 12, dy: -49, rot: -2, scaleFrom: 1.02, scaleTo: 0.96, depth: "far", desktopOnly: true },
  { char: "=>", x: 63, y: 96, size: 1.7, opacity: 0.025, duration: 59, delay: -9, dx: -10, dy: -46, rot: 5, scaleFrom: 1, scaleTo: 1.11, depth: "far", desktopOnly: true },
  { char: "p99 42ms", x: -4, y: 52, size: 0.9, opacity: 0.026, duration: 47, delay: -27, dx: 17, dy: -50, rot: -4, scaleFrom: 1.05, scaleTo: 0.97, depth: "far", desktopOnly: true },
  { char: "::", x: 88, y: 40, size: 1.8, opacity: 0.024, duration: 55, delay: -35, dx: -12, dy: -43, rot: 4, scaleFrom: 0.97, scaleTo: 1.09, depth: "far", desktopOnly: true },
  { char: "us-east-1", x: 22, y: 97, size: 0.85, opacity: 0.025, duration: 51, delay: -19, dx: 13, dy: -53, rot: -3, scaleFrom: 1.04, scaleTo: 0.95, depth: "far", desktopOnly: true },
  { char: "#!", x: 72, y: 4, size: 1.6, opacity: 0.027, duration: 57, delay: -41, dx: -14, dy: -45, rot: 6, scaleFrom: 1, scaleTo: 1.13, depth: "far", desktopOnly: true },

  // ---------- MID: the readable-if-you-look layer ----------
  { char: "200 OK", x: 8, y: 27, size: 0.72, opacity: 0.046, duration: 38, delay: -6, dx: 14, dy: -52, rot: 3, scaleFrom: 1, scaleTo: 1.12, depth: "mid" },
  { char: "{ }", x: 12, y: 45, size: 0.95, opacity: 0.042, duration: 33, delay: -19, dx: 13, dy: -48, rot: -4, scaleFrom: 1.06, scaleTo: 0.96, depth: "mid" },
  { char: "99.982%", x: 87, y: 31, size: 0.7, opacity: 0.046, duration: 36, delay: -21, dx: -12, dy: -50, rot: -3, scaleFrom: 0.96, scaleTo: 1.1, depth: "mid" },
  { char: "sha:9f3c1a", x: 3, y: 74, size: 0.6, opacity: 0.036, duration: 40, delay: -3, dx: 18, dy: -46, rot: 2, scaleFrom: 0.94, scaleTo: 1.08, depth: "mid" },
  { char: ">_", x: 93, y: 55, size: 0.9, opacity: 0.040, duration: 34, delay: -15, dx: 9, dy: -54, rot: -4, scaleFrom: 1, scaleTo: 1.12, depth: "mid" },
  { char: "->", x: 46, y: 9, size: 1.2, opacity: 0.036, duration: 42, delay: -5, dx: 10, dy: -44, rot: -6, scaleFrom: 0.98, scaleTo: 1.11, depth: "mid", desktopOnly: true },
  { char: "256 MB", x: 35, y: 86, size: 0.72, opacity: 0.041, duration: 37, delay: -13, dx: 15, dy: -51, rot: -2, scaleFrom: 0.95, scaleTo: 1.09, depth: "mid", desktopOnly: true },
  { char: "p50 = 8ms", x: 76, y: 84, size: 0.62, opacity: 0.038, duration: 39, delay: -28, dx: -16, dy: -47, rot: 3, scaleFrom: 1.03, scaleTo: 0.96, depth: "mid", desktopOnly: true },
  { char: "v2.4.1", x: 61, y: 91, size: 0.75, opacity: 0.043, duration: 41, delay: -29, dx: -14, dy: -49, rot: 4, scaleFrom: 1.04, scaleTo: 0.93, depth: "mid" },
  { char: "k8s", x: 19, y: 13, size: 1.0, opacity: 0.040, duration: 35, delay: -33, dx: 11, dy: -53, rot: -5, scaleFrom: 1, scaleTo: 1.1, depth: "mid", desktopOnly: true },
  { char: "//", x: 84, y: 71, size: 1.35, opacity: 0.039, duration: 44, delay: -11, dx: -10, dy: -45, rot: 5, scaleFrom: 1.07, scaleTo: 0.95, depth: "mid", desktopOnly: true },
  { char: "req/s", x: 6, y: 61, size: 0.78, opacity: 0.038, duration: 32, delay: -24, dx: 16, dy: -50, rot: -3, scaleFrom: 0.97, scaleTo: 1.07, depth: "mid", desktopOnly: true },
  { char: "TLS 1.3", x: 70, y: 12, size: 0.78, opacity: 0.041, duration: 43, delay: -26, dx: -8, dy: -48, rot: 5, scaleFrom: 1.06, scaleTo: 0.96, depth: "mid", desktopOnly: true },
  { char: "GET /v2", x: 90, y: 22, size: 0.7, opacity: 0.036, duration: 31, delay: -37, dx: -13, dy: -52, rot: 2, scaleFrom: 1, scaleTo: 1.09, depth: "mid", desktopOnly: true },
  { char: "12.4k rps", x: 27, y: 79, size: 0.65, opacity: 0.037, duration: 40, delay: -8, dx: 12, dy: -46, rot: -4, scaleFrom: 1.05, scaleTo: 0.97, depth: "mid", desktopOnly: true },

  // ---------- NEAR: fewest, brightest, moves most ----------
  { char: "{ }", x: 15, y: 63, size: 1.5, opacity: 0.062, duration: 27, delay: -18, dx: -10, dy: -56, rot: -5, scaleFrom: 1.1, scaleTo: 0.92, depth: "near" },
  { char: "</>", x: 82, y: 67, size: 1.4, opacity: 0.058, duration: 29, delay: -8, dx: 12, dy: -52, rot: 6, scaleFrom: 1.08, scaleTo: 0.94, depth: "near" },
  { char: "=>", x: 24, y: 17, size: 1.15, opacity: 0.052, duration: 24, delay: -11, dx: -16, dy: -58, rot: 7, scaleFrom: 1.05, scaleTo: 0.95, depth: "near", desktopOnly: true },
  { char: "200", x: 79, y: 45, size: 1.05, opacity: 0.055, duration: 26, delay: -23, dx: 14, dy: -54, rot: -6, scaleFrom: 0.96, scaleTo: 1.1, depth: "near", desktopOnly: true },
  { char: "99.99%", x: 9, y: 36, size: 0.8, opacity: 0.050, duration: 22, delay: -30, dx: -12, dy: -60, rot: 4, scaleFrom: 1.04, scaleTo: 0.94, depth: "near", desktopOnly: true },
  { char: "$_", x: 68, y: 88, size: 1.2, opacity: 0.054, duration: 28, delay: -14, dx: 15, dy: -50, rot: -5, scaleFrom: 1, scaleTo: 1.12, depth: "near", desktopOnly: true },
];

/**
 * Marks framed inside a thin outline — the one thing the two arrays below
 * could not express between them, since a glyph and a shape were always
 * separate objects. A boxed mark carries more weight than a loose one, so
 * these run brighter and there are only four, kept well clear of the centre.
 *
 * `tilt` is a static rotation. It cannot live on the outer element: the drift
 * keyframe owns `transform` there and would overwrite it every frame.
 */
const BOXED: Array<{
  char: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
  rot: number;
  tilt: number;
  depth: Depth;
}> = [
  { char: "200", x: 7, y: 30, size: 0.78, opacity: 0.075, duration: 43, delay: -13, dx: 13, dy: -46, rot: 3, tilt: -7, depth: "mid" },
  { char: "k8s", x: 89, y: 47, size: 0.72, opacity: 0.068, duration: 39, delay: -27, dx: -12, dy: -50, rot: -4, tilt: 5, depth: "mid" },
  { char: "99.9", x: 15, y: 72, size: 0.7, opacity: 0.060, duration: 47, delay: -35, dx: 11, dy: -44, rot: 4, tilt: 9, depth: "far" },
  { char: "v2", x: 86, y: 17, size: 0.8, opacity: 0.082, duration: 31, delay: -20, dx: -14, dy: -54, rot: -5, tilt: -11, depth: "near" },
];

/** Thin outlined shapes drifting on the same planes. */
const SHAPES: Array<{
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
  rot: number;
  depth: Depth;
  form: "ring" | "square" | "arc";
}> = [
  { x: 18, y: 33, size: 96, duration: 52, delay: -9, dx: -18, dy: -40, rot: 14, depth: "far", form: "ring" },
  { x: 74, y: 20, size: 150, duration: 60, delay: -33, dx: 14, dy: -36, rot: -10, depth: "far", form: "ring" },
  { x: -6, y: 66, size: 190, duration: 66, delay: -21, dx: 16, dy: -34, rot: 8, depth: "far", form: "ring" },
  { x: 80, y: 22, size: 54, duration: 34, delay: -24, dx: 12, dy: -48, rot: -18, depth: "mid", form: "square" },
  { x: 66, y: 77, size: 120, duration: 46, delay: -14, dx: 16, dy: -42, rot: 10, depth: "mid", form: "ring" },
  { x: 11, y: 84, size: 68, duration: 38, delay: -29, dx: -14, dy: -50, rot: 16, depth: "mid", form: "square" },
  { x: 92, y: 82, size: 44, duration: 25, delay: -17, dx: -11, dy: -56, rot: -20, depth: "near", form: "square" },
];

const PLANES: Array<{ depth: Depth; motion: string; blur: string }> = [
  // Blur lives on each mark, not on the plane.
  //
  // On the plane it looked like the cheaper option — one filtered layer
  // instead of a dozen — but a filter has to be recomputed whenever anything
  // inside it changes, and every mark on the plane is drifting continuously.
  // That meant re-blurring a full-screen surface on the main thread every
  // frame, twice over (the hero and the second scene each carry a field).
  //
  // And not as `filter: blur()` on the mark either, which is what it was.
  // A drifting mark is its own composited layer, and a filter on a
  // composited layer is not rasterised once — it is a render surface plus a
  // blur pass, redone on the GPU every frame. Fifty of those, for marks at
  // 2–6% opacity, was most of what kept scrolling through the hero and the
  // services grid under 60fps in a trace.
  //
  // `glyph-soft` softens the text with a text-shadow instead, which is part
  // of the layer's content: painted once, then only moved. Same
  // depth-of-field cue. The mid plane's 0.5px is dropped outright — it
  // could not be seen at these opacities, only paid for.
  { depth: "far", motion: "anim-plane-far", blur: "glyph-soft" },
  { depth: "mid", motion: "anim-plane-mid", blur: "" },
  { depth: "near", motion: "anim-plane-near", blur: "" },
];

function driftVars(g: {
  opacity: number;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
  rot: number;
  scaleFrom?: number;
  scaleTo?: number;
}): CSSProperties {
  return {
    "--drift-opacity": g.opacity,
    "--drift-duration": `${g.duration}s`,
    "--drift-delay": `${g.delay}s`,
    "--drift-x": `${g.dx}px`,
    "--drift-y": `${g.dy}px`,
    "--glyph-rot": `${g.rot}deg`,
    "--glyph-scale-a": g.scaleFrom ?? 1,
    "--glyph-scale-b": g.scaleTo ?? 1.1,
  } as CSSProperties;
}

/**
 * Infrastructure marks floating at three depths.
 *
 * Each plane is carried by its own parallax wrapper (far 54s, mid 36s, near
 * 25s) and blurred according to distance, so the field has genuine depth
 * instead of sliding as one sheet. Within a plane every glyph drifts, rotates
 * and scales on its own period, and fades in and out across its cycle.
 *
 * Opacities run 0.023–0.062. That is deliberately below the threshold where
 * you would read them as content — they register as texture first, and only
 * resolve into symbols if you go looking.
 */
export function BackgroundGlyphs({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("absolute inset-0 overflow-hidden", className)}>
      {PLANES.map((plane) => (
        <div key={plane.depth} className={cn("absolute inset-0", plane.motion)}>
          {GLYPHS.filter((g) => g.depth === plane.depth).map((g, i) => (
            <span
              key={`g-${i}`}
              className={cn(
                // nowrap: a mark placed hard against an edge has almost no
                // width to lay out in, and "[ ]" or "200 OK" would otherwise
                // break across two lines instead of clipping cleanly.
                "anim-drift absolute whitespace-nowrap font-mono tabular-nums tracking-[0.16em] text-accent-200",
                plane.blur,
                g.desktopOnly && "hidden md:block",
              )}
              style={{
                left: `${g.x}%`,
                top: `${g.y}%`,
                fontSize: `${g.size}rem`,
                ...driftVars(g),
              }}
            >
              {g.char}
            </span>
          ))}

          {BOXED.filter((g) => g.depth === plane.depth).map((g, i) => (
            <span
              key={`b-${i}`}
              className={cn("anim-drift absolute hidden md:block", plane.blur)}
              style={{ left: `${g.x}%`, top: `${g.y}%`, ...driftVars(g) }}
            >
              <span
                className="block rounded-[7px] border border-accent-300/45 px-2.5 py-1.5"
                style={{ transform: `rotate(${g.tilt}deg)` }}
              >
                <span
                  className="block whitespace-nowrap font-mono tabular-nums tracking-[0.14em] text-accent-100"
                  style={{ fontSize: `${g.size}rem` }}
                >
                  {g.char}
                </span>
              </span>
            </span>
          ))}

          {SHAPES.filter((s) => s.depth === plane.depth).map((s, i) => (
            // The drift keyframe owns `transform`, so a shape needing a static
            // tilt gets it from an inner element the animation cannot overwrite.
            <span
              key={`s-${i}`}
              className={cn("anim-drift absolute hidden md:block", plane.blur)}
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                ...driftVars({ ...s, opacity: 0.028 }),
              }}
            >
              <span
                className={cn(
                  "block h-full w-full border border-accent-300/40",
                  s.form === "ring" && "rounded-full",
                  s.form === "square" && "rotate-45 rounded-[6px]",
                  s.form === "arc" &&
                    "rounded-full border-b-transparent border-l-transparent",
                )}
              />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
