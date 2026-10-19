"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import {
  FAST_SCROLL,
  onScrollFast,
  scrollSpeed,
  trackScrollSpeed,
} from "@/lib/scrollSpeed";

// Visible ratio needed to reveal. Items only reset once fully off screen,
// which gives hysteresis and avoids flicker at the boundary.
const IN_RATIO = 0.2;

// Also reveal once an item fills this much of the viewport, for items too
// tall to ever reach `inRatio`.
const COVER_RATIO = 0.34;

/** Thresholds every 5% up to inRatio. */
function thresholds(inRatio: number) {
  const out: number[] = [];
  for (let t = 0; t < inRatio; t += 0.05) out.push(Math.round(t * 100) / 100);
  out.push(inRatio);
  return out;
}

/**
 * Reveals each child (sets `data-reveal="in"`) when it scrolls into view.
 * The animation itself is CSS; scroll only triggers it, nothing is scrubbed.
 *
 * Items revealed in the same batch (e.g. a grid row) get increasing
 * `--reveal-delay` in DOM order. During fast scrolling, items are revealed
 * immediately with `data-reveal-fast`. Items reset when they leave the
 * viewport, so the entrance replays.
 */
export function ScrollStagger({
  children,
  className,
  /** Gap between items that arrive in the same batch, ms. */
  stagger = 100,
  /** Element to render as. Use `div` for a single block with nothing to stagger. */
  as: Tag = "ul",
  /** Visible ratio needed to reveal. Raise it for tall items. */
  inRatio = IN_RATIO,
  /**
   * Observer root margin. Extends below the fold so the entrance is mostly
   * done by the time the item is visible. Set to "0px" for viewport-sized
   * items, where the padded root would trigger too early.
   */
  rootMargin = "10% 0px 35% 0px",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: ElementType;
  inRatio?: number;
  rootMargin?: string;
}) {
  const listRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const items = Array.from(list.children) as HTMLElement[];
    if (!items.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const item of items) item.dataset.reveal = "in";
      return;
    }

    // Hide from JS, not in server markup, so content stays visible without JS.
    for (const item of items) item.dataset.reveal = "out";
    trackScrollSpeed();

    const observer = new IntersectionObserver(
      (entries) => {
        const arriving: HTMLElement[] = [];

        for (const entry of entries) {
          const item = entry.target as HTMLElement;

          // Items much taller than the viewport can never reach `inRatio` and
          // would stay hidden, so also accept items covering enough of the
          // screen.
          const rootHeight = entry.rootBounds?.height ?? window.innerHeight;
          const fillsScreen =
            rootHeight > 0 &&
            entry.intersectionRect.height / rootHeight >= COVER_RATIO;

          if (
            entry.isIntersecting &&
            (entry.intersectionRatio >= inRatio || fillsScreen)
          ) {
            if (item.dataset.reveal !== "in") arriving.push(item);
          } else if (!entry.isIntersecting && item.dataset.reveal !== "out") {
            item.dataset.reveal = "out";
            item.style.removeProperty("--reveal-delay");
            delete item.dataset.revealFast;
          }
        }

        // Entry order within a batch isn't guaranteed; sort by DOM order.
        arriving.sort((a, b) => items.indexOf(a) - items.indexOf(b));

        // Fast scroll: skip the stagger and use the short animation. Keep the
        // flag until reset; removing it early would restart the animation.
        const fast = scrollSpeed() > FAST_SCROLL;

        arriving.forEach((item, i) => {
          item.style.setProperty("--reveal-delay", `${fast ? 0 : i * stagger}ms`);
          if (fast) item.dataset.revealFast = "";
          item.dataset.reveal = "in";
        });
      },
      {
        rootMargin,
        // Intermediate thresholds so tall items still get callbacks for the
        // screen-coverage check.
        threshold: thresholds(inRatio),
      },
    );

    for (const item of items) observer.observe(item);

    // Look-ahead for fast scrolling: reveals items up to ~a screen away so
    // they're ready on arrival. Does nothing at normal speed.
    const lookahead = new IntersectionObserver(
      (entries) => {
        if (scrollSpeed() <= FAST_SCROLL) return;
        for (const entry of entries) {
          const item = entry.target as HTMLElement;
          if (!entry.isIntersecting || item.dataset.reveal === "in") continue;
          item.style.setProperty("--reveal-delay", "0ms");
          item.dataset.revealFast = "";
          item.dataset.reveal = "in";
        }
      },
      // Both directions, for fast scrolling upward too.
      { rootMargin: "120% 0px 120% 0px" },
    );

    for (const item of items) lookahead.observe(item);

    // When fast scrolling starts, finish any entrance still playing.
    const offFast = onScrollFast(() => {
      for (const item of items) {
        if (item.dataset.reveal === "in") item.dataset.revealFast = "";
      }
    });

    return () => {
      observer.disconnect();
      lookahead.disconnect();
      offFast();
    };
  }, [stagger, inRatio, rootMargin]);

  return (
    <Tag ref={listRef} className={className}>
      {children}
    </Tag>
  );
}
