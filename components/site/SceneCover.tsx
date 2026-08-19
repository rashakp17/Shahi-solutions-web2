"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The scene change: one screen physically covered by the next.
 *
 * The hero is pinned with `position: sticky` while the section beneath it
 * scrolls up over the top of it. That is the whole mechanism — no scroll
 * hijacking, no snapping, no transform driven off a scroll handler. The page
 * scrolls exactly as fast as the visitor scrolls it, and what they see is a
 * solid black edge rising from the bottom of the viewport and swallowing the
 * hero from bottom to top.
 *
 * Two things do need JavaScript, and only two:
 *
 *   --cover   0 → 1 across the transition, used to dim the hero as it is
 *             covered so it reads as a scene receding rather than a static
 *             image being hidden.
 *   data-cover-state  flips to "in" once the cover is deep enough that the
 *             incoming content should start resolving. The entrance then runs
 *             on its own clock instead of being scrubbed by the scrollbar —
 *             scrubbed type stutters, and reverses if the visitor nudges
 *             upward, neither of which reads as premium.
 *
 *   data-scene-state  flips to "covered" once the hero is fully behind the
 *             incoming section. Because the hero is pinned it never leaves
 *             the viewport, so nothing else can tell that it has stopped
 *             being visible — and without this its glows, planes, glyph field
 *             and particle canvas keep burning frames underneath the section
 *             the visitor is actually reading. Both scenes carry a full
 *             atmosphere; only one of them should ever be running.
 *
 * All three are written straight to the DOM inside a rAF. Putting a value
 * that changes every frame through React state would re-render the whole
 * subtree on every scroll event.
 */
export function SceneCover({
  children,
  next,
  /** Fraction of the cover after which the incoming content starts. */
  revealAt = 0.42,
}: {
  children: ReactNode;
  next: ReactNode;
  revealAt?: number;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const paneRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const pane = paneRef.current;
    const next = nextRef.current;
    if (!wrap || !pane || !next) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wrap.style.setProperty("--cover", "0");
      next.dataset.coverState = "in";
      return;
    }

    let frame = 0;
    let last = -1;

    const measure = () => {
      frame = 0;
      const vh = window.innerHeight || 1;
      // The pinned pane is exactly one viewport tall, so how far the wrapper
      // has travelled past the top of the screen *is* how much of the hero
      // the incoming section has covered.
      const progress = Math.min(Math.max(-wrap.getBoundingClientRect().top / vh, 0), 1);

      // Two decimals is well under a pixel of dim at any viewport, and it
      // keeps this from touching style on every single scroll event.
      const rounded = Math.round(progress * 100) / 100;
      if (rounded !== last) {
        last = rounded;
        wrap.style.setProperty("--cover", String(rounded));
      }

      // Two thresholds, not one. With a single boundary a visitor resting
      // right on it — or a trackpad's momentum wobbling by a pixel — would
      // flip the whole section in and out repeatedly. Committing at 0.42 and
      // only releasing back at 0.26 means the reveal has to be genuinely
      // scrolled away from before it resets.
      const state = next.dataset.coverState;
      if (progress >= revealAt && state !== "in") {
        next.dataset.coverState = "in";
      } else if (progress <= revealAt - 0.16 && state !== "out") {
        next.dataset.coverState = "out";
      }

      // Same two-threshold treatment, at the far end of the travel: the hero
      // only stands down once it is genuinely gone, and comes back a little
      // before its first pixel is due, so nothing is caught mid-resume.
      const scene = pane.dataset.sceneState;
      if (progress >= 0.995 && scene !== "covered") {
        pane.dataset.sceneState = "covered";
      } else if (progress <= 0.96 && scene !== "lit") {
        pane.dataset.sceneState = "lit";
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    // `data-cover-state` is sticky once it commits, so that the entrance it
    // gates does not re-run every time the visitor nudges the scroll. That
    // makes it the wrong signal for anything with an ongoing cost: left to it
    // alone, this section's four glows, three parallax planes and fifty
    // drifting marks carried on animating for the rest of the session, under
    // whatever the visitor had scrolled on to. On-screen-ness is published
    // separately for that.
    const offscreen = new IntersectionObserver(
      (entries) => {
        if (entries[entries.length - 1].isIntersecting) delete next.dataset.offscreen;
        else next.dataset.offscreen = "true";
      },
      { rootMargin: "10%" },
    );
    offscreen.observe(next);

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      offscreen.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [revealAt]);

  return (
    <div ref={wrapRef} className="relative">
      {/* The pinned scene. Kept to exactly one viewport so the wrapper's own
          travel maps 1:1 onto the cover, and painted on ink so the dim has
          something to sit against at the edges. */}
      <div
        ref={paneRef}
        data-scene-state="lit"
        className="sticky top-0 h-[100svh] overflow-hidden bg-ink-950"
      >
        {children}

        {/* The hero receding. Opacity only — a blur or a scale here would cost
            a full-screen repaint on every frame of the scroll for an effect
            that is almost entirely hidden behind the black edge anyway. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-ink-950"
          style={{ opacity: "calc(var(--cover, 0) * 0.62)" }}
        />
      </div>

      {/* The incoming scene. Later in the DOM and explicitly positioned, so it
          paints over the sticky pane rather than under it. */}
      <div ref={nextRef} data-cover-state="out" className="relative z-10">
        {next}
      </div>
    </div>
  );
}
