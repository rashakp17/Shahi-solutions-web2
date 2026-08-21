"use client";

import { useEffect } from "react";

/**
 * How much run-up a section gets before it is treated as on screen.
 *
 * These are ambient loops with no beginning — they resume wherever they were
 * paused, so there is nothing to catch mid-arrival and no reason for a wide
 * margin. A tenth of a viewport is enough that a section is already moving by
 * the time its first pixel crosses, which is what keeps the resume invisible.
 */
const MARGIN = "10% 0px 10% 0px";

/**
 * Stops the ambient motion in sections nobody is looking at.
 *
 * There is already a rule in globals.css that pauses every continuous
 * animation inside `[data-offscreen="true"]` — glows, parallax planes, the
 * drifting glyph field, the linework shift, the marquees and the two float
 * loops. What was missing is anything to *publish* that attribute below the
 * fold. Two components wrote it (SceneCover, for the section riding over the
 * hero, and ScrollScrub, for the statement pane) and everything after them
 * wrote nothing at all, so from first paint the page was running:
 *
 *   the ventures linework shift          forever
 *   the tech strip marquee               forever, on a track ~5000px wide
 *   two testimonial float loops          forever
 *   three leadership float loops         forever
 *
 * — all of them while the visitor was still looking at the hero, four screens
 * up. None of it is visible and all of it holds a composited layer and ticks
 * every frame, which is the kind of cost that does not show up as a stutter
 * anywhere in particular and takes a few frames per second off everywhere.
 *
 * One observer for the whole page rather than one per section. The sections
 * are server components and this needs the browser, so the alternative was a
 * client wrapper around each of six — six components, six observers, six
 * subtrees pushed across the boundary — to set one attribute. This is mounted
 * once, finds everything that opted in by marking itself `data-motion-scope`,
 * and writes the same attribute the existing CSS already reads.
 *
 * Sections that gate themselves are deliberately not marked: the hero answers
 * to `data-scene-state`, the services grid and the statement pane publish
 * `data-offscreen` from their own scroll rigs, and the two particle canvases
 * each run their own observer because a canvas has a render loop to stop
 * rather than an animation to pause.
 */
export function MotionGate() {
  useEffect(() => {
    const scopes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-motion-scope]"),
    );
    if (!scopes.length) return;

    // Nothing is written on the way in — the attribute's absence already
    // means "running", and setting it to "false" would touch style on every
    // section the visitor scrolls through for no change in what is painted.
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
