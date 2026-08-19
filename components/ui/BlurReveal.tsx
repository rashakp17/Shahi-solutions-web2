import type { CSSProperties, ElementType } from "react";
import { cn } from "@/lib/cn";

export type RevealLine = {
  /** The line of copy. Split into words so each can be staggered. */
  text: string;
  /** Render this line in the blue accent, with a residual atmospheric glow. */
  accent?: boolean;
};

type BlurRevealProps = {
  lines: RevealLine[];
  /** Delay before the first word of the first line, in ms. */
  delay?: number;
  /** One extra beat added at each line break, on top of the running stagger. */
  lineDelay?: number;
  /** Gap between consecutive word onsets across the whole headline, in ms. */
  stagger?: number;
  /** Duration of a single word's focus pull, in ms. */
  duration?: number;
  /**
   * Multiplies every word's starting blur radius. The per-word variants are
   * tuned for the hero, where the type is enormous and a small em radius is
   * already a lot of pixels; a headline further down the page is half that
   * size and needs a wider radius to read as the same depth of haze.
   */
  blurScale?: number;
  /**
   * Count the delays from the moment this item was released by the scroll
   * (`--reveal-delay`) rather than from the moment the gate opened.
   *
   * Only matters when several gated items are released in the same batch and
   * handed increasing delays: without this the supporting lines of the second
   * item wait their turn while its headline starts immediately, and the block
   * arrives with its own parts out of order.
   */
  fromReveal?: boolean;
  /** Element to render as — defaults to an h1. */
  as?: ElementType;
  className?: string;
  lineClassName?: string;
};

/**
 * Per-word starting conditions.
 *
 * Cycled by word index rather than randomised: the values must be identical
 * on the server and the client. Every word starts fully below its mask edge,
 * but from its own depth and its own blur radius — one sits deeper in the
 * haze than its neighbour, one clears focus a fraction sooner. That asymmetry
 * is what makes the line read as *discovered* rather than as a block of text
 * running one shared animation.
 *
 * `y` is a percentage of the word's own height, and must stay far enough
 * past 100% that the glyph tops clear the clip edge, which sits slightly
 * below the descenders.
 */
const VARIANTS: Array<{ blur: number; y: number }> = [
  { blur: 0.15, y: 124 },
  { blur: 0.12, y: 118 },
  { blur: 0.16, y: 126 },
  { blur: 0.13, y: 120 },
  { blur: 0.155, y: 122 },
  { blur: 0.115, y: 117 },
];

/**
 * The three curves are the same length only by default. Focus finishes ahead
 * of the climb so the word is sharp for the last of its settle, and the light
 * comes up ahead of both so a word is never a hard edge appearing out of black.
 */
const DEFOG_RATIO = 0.78;
const FADE_RATIO = 0.66;

/**
 * Fraction of a word's travel that passes before the light crosses it — late
 * enough that the sweep lands on type that is nearly readable rather than on
 * a smear, early enough that it is still moving when the light hits.
 */
const SHINE_OFFSET = 0.52;
const SHINE_DURATION = 0.85;

/**
 * Cinematic masked headline reveal.
 *
 * Each word is clipped to its own mask and begins entirely underneath it —
 * blurred past legibility, at zero opacity — then climbs into place as the
 * blur falls off, with a soft band of light crossing the letterforms just
 * before it lands. Within a line the words emerge in sequence; between lines
 * there is a longer beat, so line one has essentially resolved before line
 * two starts. Nothing is left behind: the finished headline is plain, sharp
 * type with no residual sweep.
 *
 * Deliberately CSS-driven rather than JS-driven: the animation is present in
 * the server-rendered markup, so it starts on the first paint instead of
 * waiting for hydration, and it never fires twice on a Strict Mode remount.
 * Only opacity / filter / transform / clip-path are animated, all of which
 * the compositor can handle off the main thread.
 */
export function BlurReveal({
  lines,
  delay = 400,
  lineDelay = 40,
  stagger = 165,
  duration = 440,
  blurScale = 1,
  fromReveal = false,
  as: Tag = "h1",
  className,
  lineClassName,
}: BlurRevealProps) {
  // Runs across the whole headline so neighbouring words never share a
  // variant, even across a line break.
  let wordIndex = 0;

  const at = (ms: number) =>
    fromReveal ? `calc(var(--reveal-delay, 0ms) + ${ms}ms)` : `${ms}ms`;

  return (
    <Tag className={className}>
      {lines.map((line, li) => (
        <span key={li} className={cn("block", lineClassName)}>
          {line.text.split(" ").map((word, wi) => {
            const variant = VARIANTS[wordIndex % VARIANTS.length];
            // The stagger counts words across the whole headline, not from
            // the start of each line, so the cadence never resets. A line
            // break is worth one small extra beat on top — not a fresh
            // start, which would have both lines running at once.
            const startedAt = delay + wordIndex * stagger + li * lineDelay;
            wordIndex += 1;

            return (
              <span
                key={`${li}-${wi}`}
                className={cn(
                  "reveal-word mr-[0.26em] last:mr-0",
                  line.accent && "reveal-word-accent text-accent-400",
                )}
                style={
                  {
                    // Set on the mask and inherited by everything below it,
                    // so the clip, the three curves and the light all read
                    // the same clock.
                    "--rw-delay": at(startedAt),
                    "--rw-lift": `${duration}ms`,
                    "--rw-defog": `${Math.round(duration * DEFOG_RATIO)}ms`,
                    "--rw-fade": `${Math.round(duration * FADE_RATIO)}ms`,
                    "--rw-blur": `${(variant.blur * blurScale).toFixed(4)}em`,
                    "--rw-y": `${variant.y}%`,
                    "--rw-shine-delay": at(
                      startedAt + Math.round(duration * SHINE_OFFSET),
                    ),
                    "--rw-shine-duration": `${Math.round(
                      duration * SHINE_DURATION,
                    )}ms`,
                  } as CSSProperties
                }
              >
                {/* data-word feeds the shimmer, which is a masked duplicate
                    of the glyphs drawn over the real ones. */}
                <span className="reveal-word-inner" data-word={word}>
                  {word}
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
