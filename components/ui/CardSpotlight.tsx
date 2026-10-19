"use client";

import { useEffect } from "react";

/**
 * Cursor-following glow on `[data-spotlight]` cards.
 *
 * One document-level listener; moves the card's `[data-spotlight-glow]` via
 * transform, at most once per frame. Fade in/out is CSS on :hover. The card
 * rect is cached and only re-read after a scroll.
 *
 * Mouse only: on touch the glow would get stuck where the finger landed.
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
