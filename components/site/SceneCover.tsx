"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  FAST_SCROLL,
  onScrollFast,
  scrollSpeed,
  trackScrollSpeed,
} from "@/lib/scrollSpeed";

/**
 * Pins `children` (the hero) with position: sticky while `next` scrolls up
 * over it. JS only handles:
 * - veil opacity (0 to 0.62). Set on the veil directly, not as an inherited
 *   custom property, which would restyle the whole subtree every frame.
 * - data-cover-state="in" to start the next section's entrance.
 * - data-scene-state="covered" so the pinned hero can pause its animations
 *   (it never leaves the viewport, so observers can't detect it).
 * All written to the DOM in rAF, not React state.
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
  const veilRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const pane = paneRef.current;
    const next = nextRef.current;
    const veil = veilRef.current;
    if (!wrap || !pane || !next || !veil) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      veil.style.opacity = "0";
      next.dataset.coverState = "in";
      return;
    }

    trackScrollSpeed();

    // On a fast scroll after the reveal, finish the intro immediately.
    const offFast = onScrollFast(() => {
      if (next.dataset.coverState === "in") next.dataset.coverFast = "";
    });

    let frame = 0;
    let last = -1;
    let onScreen = true;

    const measure = () => {
      frame = 0;
      const vh = window.innerHeight || 1;
      // Pane is one viewport tall, so wrapper scroll distance = cover progress.
      const progress = Math.min(Math.max(-wrap.getBoundingClientRect().top / vh, 0), 1);

      // Round to avoid writing style on every scroll event.
      const rounded = Math.round(progress * 100) / 100;
      if (rounded !== last) {
        last = rounded;
        veil.style.opacity = String(rounded * 0.62);
      }

      // Hysteresis: enter at revealAt, reset only below revealAt - 0.16, so
      // small scroll jitter doesn't toggle the state. On a fast scroll the
      // intro skips its animation (data-cover-fast in globals.css).
      const state = next.dataset.coverState;
      if (progress >= revealAt && state !== "in") {
        if (scrollSpeed() > FAST_SCROLL) next.dataset.coverFast = "";
        next.dataset.coverState = "in";
      } else if (progress <= Math.max(0, revealAt - 0.16) && state !== "out") {
        next.dataset.coverState = "out";
        delete next.dataset.coverFast;
      }

      // Same hysteresis for pausing the hero; it resumes slightly before it
      // becomes visible again.
      const scene = pane.dataset.sceneState;
      if (progress >= 0.995 && scene !== "covered") {
        pane.dataset.sceneState = "covered";
      } else if (progress <= 0.96 && scene !== "lit") {
        pane.dataset.sceneState = "lit";
      }
    };

    const onScroll = () => {
      if (frame || !onScreen) return;
      frame = requestAnimationFrame(measure);
    };

    // Skip measuring (getBoundingClientRect forces layout) once the wrapper
    // is off screen. Measure once on each crossing so end values are exact.
    const travel = new IntersectionObserver(
      (entries) => {
        onScreen = entries[entries.length - 1].isIntersecting;
        measure();
      },
      { rootMargin: "10%" },
    );
    travel.observe(wrap);

    // data-cover-state stays "in" after scrolling past, so expose visibility
    // separately to let the next section pause its animations off screen.
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
      offFast();
      offscreen.disconnect();
      travel.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [revealAt]);

  return (
    <div ref={wrapRef} className="relative">
      {/* Pinned scene, exactly one viewport tall (progress math depends on it). */}
      <div
        ref={paneRef}
        data-scene-state="lit"
        className="sticky top-0 h-[100svh] overflow-hidden bg-ink-950"
      >
        {children}

        {/* Dimming veil. Opacity only; blur or scale would repaint the full
            screen every scroll frame. */}
        <div
          ref={veilRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-ink-950 opacity-0"
        />
      </div>

      {/* Incoming scene, positioned so it paints over the sticky pane. */}
      <div ref={nextRef} data-cover-state="out" className="relative z-10">
        {next}
      </div>
    </div>
  );
}
