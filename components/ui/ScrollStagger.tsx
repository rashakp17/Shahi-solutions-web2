"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Ratio of an item that must be inside the viewport before it is released.
 *
 * Paired with a zero-ratio exit, this is a hysteresis band rather than a
 * single line: an item has to be meaningfully on screen to arrive, and
 * completely gone to reset. One shared boundary would let an item resting
 * right on it — or a trackpad's momentum wobbling by a pixel — flip in and
 * out repeatedly.
 */
const IN_RATIO = 0.2;

/**
 * Releases each child's entrance when that child scrolls into view, instead
 * of running the whole list off one clock.
 *
 * A staggered list gated on a single moment only works if the visitor is
 * looking when that moment happens. Eight cards on a shared timer have all
 * finished within ~1.5s of the section committing, so anyone scrolling at a
 * reading pace arrives to a grid that is already static — the entrance played
 * to an empty room.
 *
 * Here the scroll position is the trigger and the clock is still CSS. Nothing
 * is scrubbed: crossing the threshold hands the item its own delay and lets
 * its animation run at its own speed, so the motion never stutters with the
 * scroll wheel or reverses on a nudge upward.
 *
 * Items that cross together — a whole row of a grid shares a top edge, so
 * they always do — are handed increasing delays in DOM order. That is what
 * turns "a row appeared" into "these arrived one after another". In a single
 * column each item crosses on its own and the scroll itself does the spacing.
 *
 * ── On outrunning the entrance ──
 * Every item plays its full choreography at its designed pace, whatever the
 * scroll is doing. There is deliberately no fast-scroll path here — no
 * collapsing of the stagger, no skipping ahead — because an entrance that
 * changes speed depending on how the visitor arrived is two different
 * designs, and the faster one is always the worse one.
 *
 * The problem that would otherwise create — flying past a section before it
 * has assembled and seeing a blank band — is solved a layer up, by the page
 * settling onto a section instead of stopping wherever the flick ran out.
 * See the scroll-snap block in globals.css. That keeps the question "how does
 * the content arrive" separate from "where does the visitor come to rest",
 * which is the only way either one stays tuneable.
 *
 * Reversible on purpose, matching the rest of the page: scroll away and back,
 * and the entrance plays again.
 */
export function ScrollStagger({
  children,
  className,
  /** Gap between items that arrive in the same batch, ms. */
  stagger = 100,
  /**
   * Element to render as. A list of things wants `ul`, which is the default;
   * a single block whose only job is to wait for its own section — a heading
   * group, say — wants `div`, and gets the same gate with nothing to stagger.
   */
  as: Tag = "ul",
  /**
   * How much of an item must be on screen before it is released. Defaults to
   * the shared band; raise it for items that are tall enough to be halfway
   * down the fold at the default ratio and would otherwise start their
   * entrance before the visitor is really looking at them.
   */
  inRatio = IN_RATIO,
  /**
   * Margin on the observer's viewport.
   *
   * Grown slightly, where this used to be shrunk. The entrance is several
   * hundred ms of curve, so releasing an item at the moment it becomes
   * visible leaves it blank for the first part of the time it is on screen —
   * the visitor watches it assemble instead of arriving to it assembled. A
   * tenth of a viewport of run-up means it is already moving as they reach
   * it, and the same margin at the top stops a section resetting the instant
   * its last pixel clears the fold.
   *
   * Worth clearing for anything already the size of the viewport: a
   * full-height layer combined with a padded root means the ratio the caller
   * asked for lands noticeably earlier than the same fraction of the section,
   * and for those the plain viewport is the honest measure.
   */
  rootMargin = "10% 0px 10% 0px",
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

    // Held from JS rather than from the server-rendered markup: with the
    // attribute baked in, a visitor without JS would be left looking at an
    // empty grid forever.
    for (const item of items) item.dataset.reveal = "out";

    const observer = new IntersectionObserver(
      (entries) => {
        const arriving: HTMLElement[] = [];

        for (const entry of entries) {
          const item = entry.target as HTMLElement;

          if (entry.isIntersecting && entry.intersectionRatio >= inRatio) {
            if (item.dataset.reveal !== "in") arriving.push(item);
          } else if (!entry.isIntersecting && item.dataset.reveal !== "out") {
            item.dataset.reveal = "out";
            item.style.removeProperty("--reveal-delay");
          }
        }

        // DOM order, not callback order — the observer makes no promises
        // about how a batch is sequenced, and left to itself a row would
        // arrive shuffled.
        arriving.sort((a, b) => items.indexOf(a) - items.indexOf(b));

        arriving.forEach((item, i) => {
          item.style.setProperty("--reveal-delay", `${i * stagger}ms`);
          item.dataset.reveal = "in";
        });
      },
      {
        rootMargin,
        threshold: [0, inRatio],
      },
    );

    for (const item of items) observer.observe(item);

    return () => observer.disconnect();
  }, [stagger, inRatio, rootMargin]);

  return (
    <Tag ref={listRef} className={className}>
      {children}
    </Tag>
  );
}
