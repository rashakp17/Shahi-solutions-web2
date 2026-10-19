"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Publishes scroll progress (0 to 1) as CSS variables for a scroll-scrubbed
 * effect. Unlike the rest of the page's entrances, this one is tied directly
 * to scroll position.
 *
 * - rAF-throttled, and only writes when the value changes.
 * - `--scrub` is fine-grained for transform/opacity; `--scrub-step` is coarse
 *   (1%) for blur, since every filter change re-rasterises the element.
 * - Also sets `data-cover-state` (same as SceneCover) so globals.css can
 *   gate the inner content.
 */
export function ScrollScrub({
  children,
  className,
  /** Scrub length in viewport heights, starting when the wrapper's top hits the bottom of the screen. */
  span = 1.25,
  /** Scrub value at which the small content inside is released. */
  releaseAt = 0.62,
}: {
  children: ReactNode;
  className?: string;
  span?: number;
  releaseAt?: number;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Set the vars on the smallest subtree that uses them: a custom property
    // change restyles everything below the element it's set on.
    const target =
      wrap.querySelector<HTMLElement>("[data-scrub-target]") ?? wrap;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      target.style.setProperty("--scrub", "1");
      target.style.setProperty("--scrub-step", "1");
      wrap.dataset.coverState = "in";
      return;
    }

    let frame = 0;
    let onScreen = true;

    let lastFine = -1;
    let lastStep = -1;
    let released = false;

    const read = () => {
      const vh = window.innerHeight || 1;
      const top = wrap.getBoundingClientRect().top;

      // 0 when the wrapper's top is at the bottom of the screen, 1 after
      // `span` viewport heights of scrolling.
      const raw = (vh - top) / (vh * span);
      return raw < 0 ? 0 : raw > 1 ? 1 : raw;
    };

    const publish = (progress: number) => {
      const fine = Math.round(progress * 1000) / 1000;
      if (fine !== lastFine) {
        lastFine = fine;
        target.style.setProperty("--scrub", String(fine));
      }

      const step = Math.round(progress * 100) / 100;
      if (step !== lastStep) {
        lastStep = step;
        target.style.setProperty("--scrub-step", String(step));
      }

      // Hysteresis so it doesn't flicker when resting near the threshold.
      if (!released && progress >= releaseAt) {
        released = true;
        wrap.dataset.coverState = "in";
      } else if (released && progress <= releaseAt - 0.14) {
        released = false;
        wrap.dataset.coverState = "out";
      }
    };

    const measure = () => {
      frame = 0;
      publish(read());
    };

    const onScroll = () => {
      if (frame || !onScreen) return;
      frame = requestAnimationFrame(measure);
    };

    // Tracks visibility separately from `data-cover-state` (which is sticky).
    // Sets `data-offscreen` for CSS and stops the scroll handler from calling
    // getBoundingClientRect while off screen. Measures once more on exit so
    // the pane settles at 0 or 1 (read() clamps).
    const view = new IntersectionObserver(
      (entries) => {
        onScreen = entries[entries.length - 1].isIntersecting;
        if (onScreen) delete wrap.dataset.offscreen;
        else wrap.dataset.offscreen = "true";
        measure();
      },
      { rootMargin: "10%" },
    );
    view.observe(wrap);

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      view.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [span, releaseAt]);

  return (
    <div ref={wrapRef} data-cover-state="out" className={className}>
      {children}
    </div>
  );
}
