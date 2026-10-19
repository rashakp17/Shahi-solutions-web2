"use client";

import { useEffect } from "react";

/**
 * Sets --pj-cover (0 to 1) on each project card as the next card covers it;
 * CSS turns it into scale/lift/dim. Stacking itself is position: sticky.
 *
 * Mounted beside ProjectsSection and finds the deck via [data-pj-deck], so
 * the section stays a server component (passing it as children would
 * serialize the markup into the RSC payload).
 */
export function ProjectDeckScrub() {
  useEffect(() => {
    const deck = document.querySelector<HTMLElement>("[data-pj-deck]");
    if (!deck) return;

    const slots = Array.from(
      deck.querySelectorAll<HTMLElement>("[data-pj-slot]"),
    );
    if (slots.length < 2) return;

    const cards = slots.map((slot) =>
      slot.querySelector<HTMLElement>("[data-pj-card]"),
    );

    // Reduced motion: keep the CSS stacking, skip the depth effect.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Sticky top offsets and heights, measured once and on resize.
    let tops: number[] = [];
    let heights: number[] = [];

    const measure = () => {
      measured = true;
      tops = slots.map((slot) => parseFloat(getComputedStyle(slot).top) || 0);
      heights = slots.map((slot) => slot.offsetHeight || 1);
    };

    let frame = 0;
    // Set by the observer; avoids reading before measurements exist.
    let onScreen = false;
    let measured = false;
    const published = new Array(slots.length).fill(-1);

    const read = () => {
      frame = 0;

      // Read all rects before writing to avoid layout thrashing.
      const positions = slots.map((slot) => slot.getBoundingClientRect().top);

      for (let i = 0; i < slots.length - 1; i++) {
        const step = tops[i + 1] - tops[i];
        const height = heights[i];

        // Gap between this card and the next shrinks to `step` as the next
        // card pins; the last `height` px of that is the 0-1 ramp.
        const gap = positions[i + 1] - positions[i];
        const raw = (height - (gap - step)) / height;
        const cover = raw < 0 ? 0 : raw > 1 ? 1 : raw;

        // Round and skip unchanged values to avoid needless style writes.
        const value = Math.round(cover * 1000) / 1000;
        if (value === published[i]) continue;
        published[i] = value;
        cards[i]?.style.setProperty("--pj-cover", String(value));
      }
    };

    const onScroll = () => {
      if (frame || !onScreen) return;
      frame = requestAnimationFrame(read);
    };

    const onResize = () => {
      measure();
      published.fill(-1);
      onScroll();
    };

    // Only read while the deck is near the viewport.
    const view = new IntersectionObserver(
      (entries) => {
        onScreen = entries[entries.length - 1].isIntersecting;
        if (!onScreen) return;
        // Measure on first approach, not at mount: the section uses
        // content-visibility: auto, so measuring early forces layout.
        if (!measured) measure();
        onScroll();
      },
      { rootMargin: "25%" },
    );
    view.observe(deck);


    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      view.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
