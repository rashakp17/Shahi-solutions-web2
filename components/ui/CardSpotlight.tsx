"use client";

import { useEffect } from "react";

/**
 * A soft light that follows the cursor across a hovered card.
 *
 * One listener for the whole document rather than one per card. It does
 * nothing until the pointer is over an element marked `data-spotlight`, and
 * then all it writes is one `transform` on that card's `[data-spotlight-glow]`
 * — a gradient painted once, moved by the compositor, at most once a frame.
 * The fade in and out is a CSS opacity transition on :hover.
 *
 * The card's rect is read once on entering it and again only after a scroll,
 * so a pointermove costs no layout read in the common case.
 *
 * Mouse only. A touch has no hover, and a glow left behind wherever a finger
 * last landed would read as a stuck highlight.
 */
export function CardSpotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let card: HTMLElement | null = null;
    let glow: HTMLElement | null = null;
    let rect: DOMRect | null = null;
    let x = 0;
    let y = 0;
    let frame = 0;

    const paint = () => {
      frame = 0;
      if (!card || !glow) return;
      rect ??= card.getBoundingClientRect();
      glow.style.transform = `translate3d(${x - rect.left}px, ${y - rect.top}px, 0)`;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const target =
        e.target instanceof Element
          ? e.target.closest<HTMLElement>("[data-spotlight]")
          : null;
      if (target !== card) {
        card = target;
        glow = card?.querySelector<HTMLElement>("[data-spotlight-glow]") ?? null;
        rect = null;
      }
      if (!glow) return;
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onScroll = () => {
      rect = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
