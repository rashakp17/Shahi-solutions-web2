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
 * Pre-renders the `content-visibility: auto` sections during idle time, one
 * per idle callback, so the first scroll into each one doesn't trigger a big
 * style/layout pass mid-scroll. This also lets `contain-intrinsic-size: auto`
 * record real heights, so anchor jumps land correctly.
 *
 * Falls back to setTimeout where requestIdleCallback is missing (Safari).
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
        // Forces layout now, inside the idle slot.
        void el.offsetHeight;
        el.style.contentVisibility = "";
      }
      handle = idle(next);
    };

    // Wait for the hero intro to settle first.
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
