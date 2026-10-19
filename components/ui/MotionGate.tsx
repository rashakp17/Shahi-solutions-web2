"use client";

import { useEffect } from "react";

// Small margin so loops are already running when a section scrolls into view.
const MARGIN = "10% 0px 10% 0px";

/**
 * Pauses ambient animations in off-screen sections by setting
 * `data-offscreen="true"` on every `[data-motion-scope]` element; globals.css
 * pauses animations under that attribute.
 *
 * One observer for the whole page, so the server-component sections don't
 * each need a client wrapper. Sections that manage their own visibility
 * (hero, services, statement pane, particle canvases) aren't marked.
 */
export function MotionGate() {
  useEffect(() => {
    const scopes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-motion-scope]"),
    );
    if (!scopes.length) return;

    // Remove rather than set "false": absence already means running.
    const view = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const scope = entry.target as HTMLElement;
          if (entry.isIntersecting) delete scope.dataset.offscreen;
          else scope.dataset.offscreen = "true";
        }
      },
      { rootMargin: MARGIN },
    );

    for (const scope of scopes) view.observe(scope);
    return () => view.disconnect();
  }, []);

  return null;
}
