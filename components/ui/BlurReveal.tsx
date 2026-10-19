import type { CSSProperties, ElementType } from "react";
import { cn } from "@/lib/cn";

export type RevealLine = {
  /** Split into words so each can be staggered. */
  text: string;
  /** Render this line in the accent colour. */
  accent?: boolean;
};

type BlurRevealProps = {
  lines: RevealLine[];
  /** Delay before the first word of the first line, in ms. */
  delay?: number;
  /** Extra delay added at each line break, in ms. */
  lineDelay?: number;
  /** Gap between word starts across the whole headline, in ms. */
  stagger?: number;
  /** Duration of one word's animation, in ms. */
  duration?: number;
  /**
   * Multiplier for the starting blur. Variants are tuned for the large hero
   * type; smaller headlines need a bigger multiplier to look the same.
   */
  blurScale?: number;
  /**
   * Offset delays by `--reveal-delay` (set by the scroll gate). Needed when
   * several gated items are released together, otherwise their parts
   * animate out of order.
   */
  fromReveal?: boolean;
  /** Element to render as. Defaults to h1. */
  as?: ElementType;
  className?: string;
  lineClassName?: string;
};

/**
 * Per-word starting blur and offset, cycled by index (not random) so server
 * and client render the same values. Slight variation keeps words from
 * moving in lockstep.
 *
 * `y` is a % of the word's height and must stay well over 100% so glyph tops
 * clear the clip edge, which sits just below the descenders.
 */
const VARIANTS: Array<{ blur: number; y: number }> = [
  { blur: 0.15, y: 124 },
  { blur: 0.12, y: 118 },
  { blur: 0.16, y: 126 },
  { blur: 0.13, y: 120 },
  { blur: 0.155, y: 122 },
  { blur: 0.115, y: 117 },
];

// Blur and fade finish before the lift so the word is sharp and visible
// while it settles.
const DEFOG_RATIO = 0.78;
const FADE_RATIO = 0.66;

// Shine starts partway through the lift, once the word is mostly legible.
const SHINE_OFFSET = 0.52;
const SHINE_DURATION = 0.85;

/**
 * Masked headline reveal: each word rises out of its own clip mask while
 * unblurring and fading in, followed by a light sweep.
 *
 * Pure CSS so the animation is in the server markup: it starts on first
 * paint without waiting for hydration and doesn't replay on a Strict Mode
 * remount.
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
  // Counts across lines so the stagger and variants don't reset per line.
  let wordIndex = 0;

  const at = (ms: number) =>
    fromReveal ? `calc(var(--reveal-delay, 0ms) + ${ms}ms)` : `${ms}ms`;

  return (
    <Tag className={className}>
      {lines.map((line, li) => (
        <span key={li} className={cn("block", lineClassName)}>
          {line.text.split(" ").map((word, wi) => {
            const variant = VARIANTS[wordIndex % VARIANTS.length];
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
                    // Inherited by the inner span and shine.
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
                {/* data-word feeds the shine overlay (a masked copy of the text). */}
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
