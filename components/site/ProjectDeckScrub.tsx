"use client";

import { useEffect } from "react";

/**
 * The depth cues on the card deck, and nothing else.
 *
 * The stacking itself is `position: sticky` and works with JavaScript switched
 * off. What this adds is --pj-cover per card — 0 while a card owns the screen,
 * 1 once the next has fully covered it — which the stylesheet turns into a
 * scale, a small lift and a dim. That is the only thing on this page scrubbed
 * off the scrollbar apart from the statement pane, and for the same reason:
 * the effect *is* the connection to the scroll, so it has to give it back on
 * the way up.
 *
 * ── Why this is a sibling and not a wrapper ──
 * It used to live in ProjectsSection, which meant the whole section carried
 * `"use client"` — five projects' worth of copy, features, stacks and drawn
 * previews, plus the card markup and two SVG components, compiled into the
 * initial JavaScript bundle *and* rendered into the HTML, to run one scroll
 * handler. The section is a server component now and this is mounted beside
 * it, finding the deck by the attribute the markup already carries.
 *
 * Taking the deck as `children` would have undone the saving in the other
 * direction: everything passed through a client boundary is serialised into
 * the flight payload, so the same markup would have come back as data. A
 * query for one element costs nothing and keeps the whole subtree on the
 * server side of the line.
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

    // The stack is CSS. This only adds the depth cues on top of it, so with
    // motion turned down the cards still deal themselves — they just do it
    // without shrinking or dimming as they go.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /**
     * Measured once and on resize, not per frame. `top` is each card's sticky
     * offset, which is what the pair of them settles at; height is how far the
     * next card has to travel to cover this one.
     */
    let tops: number[] = [];
    let heights: number[] = [];

    const measure = () => {
      measured = true;
      tops = slots.map((slot) => parseFloat(getComputedStyle(slot).top) || 0);
      heights = slots.map((slot) => slot.offsetHeight || 1);
    };

    let frame = 0;
    // False until the observer says otherwise, which it does on its first
    // callback. Reading before then would run on empty measurements.
    let onScreen = false;
    let measured = false;
    const published = new Array(slots.length).fill(-1);

    const read = () => {
      frame = 0;

      // Every rect first, then every write. Interleaving them makes the
      // browser flush layout between each pair, which is the difference
      // between one measurement and five.
      const positions = slots.map((slot) => slot.getBoundingClientRect().top);

      for (let i = 0; i < slots.length - 1; i++) {
        const step = tops[i + 1] - tops[i];
        const height = heights[i];

        // Distance between this card's top edge and the next one's. It closes
        // from a card-height-plus-gap down to `step` as the next card arrives
        // and pins, and the last `height` of that closing is the ramp.
        const gap = positions[i + 1] - positions[i];
        const raw = (height - (gap - step)) / height;
        const cover = raw < 0 ? 0 : raw > 1 ? 1 : raw;

        // Three decimal places is finer than a pixel at these sizes, and
        // skipping unchanged values keeps a slow drag from restyling the
        // whole deck on every frame it does not move.
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

    // Nothing is read while the deck is nowhere near the viewport. The handler
    // is passive and cheap, but it is still five rects a frame for a section
    // that is three screens away.
    const view = new IntersectionObserver(
      (entries) => {
        onScreen = entries[entries.length - 1].isIntersecting;
        if (!onScreen) return;
        // Measured on first approach, not at mount. The section is
        // `content-visibility: auto` (see globals.css), so at mount its
        // cards have not been laid out, and asking for their sizes would
        // force the whole deck through layout three screens early — the
        // exact cost that skipping it is there to avoid.
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
