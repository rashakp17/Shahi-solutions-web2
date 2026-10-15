"use client";

import { useEffect } from "react";

/** The sections globals.css marks `content-visibility: auto`, in page order. */
const SECTIONS = [
  "#ventures",
  "#stack",
  "#projects",
  "#testimonials",
  "#about",
  "#contact",
  "footer.ft-scope",
];

/**
 * Lays out the skipped sections ahead of time, one per idle moment.
 *
 * `content-visibility: auto` takes the sections below the fold out of the
 * first render, which is what keeps arriving on the home page from freezing.
 * But it moves the work rather than removing it: the first time a section
 * comes near the viewport it is styled and laid out in one go, and for the
 * project deck that is ~300 elements in a single frame, mid-scroll —
 * measured at 194ms on a 4x-throttled phone.
 *
 * So once the page is idle, each section is rendered once, quietly, in a
 * moment where nobody is scrolling. The browser keeps that layout when the
 * section goes back to being skipped, so when the visitor does reach it the
 * cost has already been paid. As a side effect `contain-intrinsic-size:
 * auto` now remembers each section's real height, so anchor jumps are exact
 * instead of estimated.
 *
 * One section per idle callback, so the work is spread out rather than
 * becoming the single long task it was replacing. Stops if the page unmounts.
 */
export function RenderAhead() {
  useEffect(() => {
    const idle: (cb: () => void) => number =
      typeof window.requestIdleCallback === "function"
        ? (cb) => window.requestIdleCallback(cb, { timeout: 2000 })
        : (cb) => window.setTimeout(cb, 200);
    const cancelIdle: (id: number) => void =
      typeof window.cancelIdleCallback === "function"
        ? (id) => window.cancelIdleCallback(id)
        : (id) => window.clearTimeout(id);

    let index = 0;
    let handle = 0;

    const next = () => {
      const selector = SECTIONS[index++];
      if (!selector) return;
      const el = document.querySelector<HTMLElement>(selector);
      if (el) {
        el.style.contentVisibility = "visible";
        // The read is the point: it makes the browser style and lay out the
        // section now, synchronously, inside this idle slot.
        void el.offsetHeight;
        el.style.contentVisibility = "";
      }
      handle = idle(next);
    };

    // Not straight away: the hero is still settling for the first second or
    // two, and that is the moment to leave alone.
    const start = window.setTimeout(() => {
      handle = idle(next);
    }, 1500);

    return () => {
      window.clearTimeout(start);
      cancelIdle(handle);
    };
  }, []);

  return null;
}
