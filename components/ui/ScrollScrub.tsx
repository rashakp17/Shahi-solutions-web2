"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Turns the scroll position into a 0 → 1 number the CSS below can read.
 *
 * The rest of this page deliberately does not scrub anything off the
 * scrollbar — an entrance is released by the scroll and then runs on its own
 * clock, because scrubbed type stutters and reverses on a nudge upward. That
 * is the right call for a headline resolving into place.
 *
 * A typographic layer physically travelling across the viewport is the case
 * where it is not. The whole effect *is* the connection to the scroll: the
 * phrase has to feel like it is being pushed up from underneath by the act of
 * scrolling, and it has to give that back if you scroll away. So this one is
 * scrubbed, and the stutter that normally comes with that is handled rather
 * than avoided:
 *
 *   - The read is rAF-throttled, so a burst of scroll events collapses into
 *     one measurement per frame.
 *   - Nothing is written unless the value actually changed.
 *   - Two resolutions are published. Transform and opacity are cheap to
 *     restyle and get a fine-grained value, so a slow drag cannot make the
 *     travel look stepped. Blur is not cheap — a filter re-rasterises the
 *     whole element every time it changes, and these elements are enormous —
 *     so it gets a coarse one. A 1% change in blur radius is invisible, which
 *     makes the coarse signal free.
 *
 * It also publishes `data-cover-state`, the same gate SceneCover uses, so the
 * small content inside can be held and released by the existing rules in
 * globals.css rather than needing a second mechanism of its own.
 */
export function ScrollScrub({
  children,
  className,
  /**
   * Scroll distance the scrub spans, in viewport heights, measured from the
   * moment the wrapper's top edge reaches the bottom of the screen.
   */
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

    // The scrub goes on the narrowest subtree that reads it, not on the
    // wrapper. Changing a custom property invalidates style for everything
    // beneath the element it is set on, and the section's small content does
    // not read the scrub at all — it waits on `data-cover-state` instead. Left
    // on the wrapper, every scroll frame was recomputing style for the whole
    // section to move one piece of it.
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

      // 0 with the wrapper's top edge sitting on the bottom of the screen —
      // everything inside is still below the fold at that point — and 1 once
      // it has travelled `span` viewport heights up from there.
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

      // Two thresholds, as everywhere else on this page: the content commits
      // at `releaseAt` and only stands back down once the scroll has gone
      // meaningfully back past it, so a visitor resting on the boundary does
      // not sit and watch it flicker.
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

    // `data-cover-state` is sticky once released, by design — the content it
    // gates should not re-run every time the visitor nudges the scroll. That
    // makes it the wrong signal for anything that costs something to keep
    // running, so on-screen-ness is published separately.
    //
    // It gates this rig's own reads as well as the CSS, which is the bigger
    // half. Publishing the attribute was all this observer used to do, and the
    // handler under it went on measuring for the rest of the session — a
    // getBoundingClientRect, which is a forced layout, on every frame of every
    // scroll anywhere on the page, for a pane the visitor left three sections
    // ago.
    //
    // One last read on the way out, so the pane freezes at the end of its
    // travel rather than wherever it happened to be when the observer fired.
    // `read` clamps, so from outside the band that is exactly 0 or 1.
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
