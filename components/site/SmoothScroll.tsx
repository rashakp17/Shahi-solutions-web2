"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { getLenis, setLenis, wakeSmoothScroll } from "@/lib/smoothScroll";

/*
 * Smooth wheel scrolling via Lenis (desktop only, skipped for reduced motion).
 *
 * The rAF loop runs only while there is input or Lenis is settling, not via
 * autoRaf: a permanent main-thread rAF loop re-ticks every CSS animation each
 * frame.
 *
 * Same-page #hash links are intercepted in the capture phase and scrolled via
 * Lenis. Only preventDefault is called, so other click handlers still run and
 * Next's Link skips its own jump.
 */

/**
 * After an anchor jump, wait for scrolling to settle and correct the position
 * if the target moved. Sections use content-visibility: auto, so their heights
 * are estimates until rendered. Cancels on user input, after 4s, or after 3
 * corrections.
 */
let alignRun = 0;
function alignToAnchor(target: HTMLElement) {
  const run = ++alignRun;
  const started = performance.now();
  let lastY = -1;
  let stableFrames = 0;
  let corrections = 0;

  const cancel = () => {
    alignRun++;
  };
  const inputs = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
  for (const type of inputs) {
    window.addEventListener(type, cancel, { passive: true, once: true });
  }
  const finish = () => {
    for (const type of inputs) window.removeEventListener(type, cancel);
  };

  const tick = () => {
    if (run !== alignRun || performance.now() - started > 4000) return finish();

    const y = window.scrollY;
    stableFrames = y === lastY ? stableFrames + 1 : 0;
    lastY = y;

    // Settled: unmoved for ~130ms, and past the first 200ms (before the scroll starts).
    if (stableFrames < 8 || performance.now() - started < 200) {
      requestAnimationFrame(tick);
      return;
    }

    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const off = target.getBoundingClientRect().top - margin;
    if (Math.abs(off) <= 2 || corrections >= 3) return finish();

    corrections++;
    stableFrames = 0;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(y + off, { duration: 0.5, force: true });
      wakeSmoothScroll();
    } else {
      window.scrollTo({ top: y + off, behavior: "smooth" });
    }
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

/** The element a same-page #hash link points at, or null. */
function hashTarget(event: MouseEvent): HTMLElement | null {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return null;
  }
  const link = (event.target as Element | null)?.closest?.("a[href]");
  if (!(link instanceof HTMLAnchorElement)) return null;
  if (link.target && link.target !== "_self") return null;
  const url = new URL(link.href, window.location.href);
  if (
    url.origin !== window.location.origin ||
    url.pathname !== window.location.pathname ||
    !url.hash
  ) {
    return null;
  }
  return document.getElementById(decodeURIComponent(url.hash.slice(1)));
}

/** Drives one Lenis instance until the returned teardown runs. */
function start(lenis: Lenis): () => void {
  let frame = 0;
  let still = 0;

  const tick = (time: number) => {
    lenis.raf(time);
    still = lenis.isScrolling ? 0 : still + 1;
    // Stop the loop after ~0.5s without movement.
    frame = still > 30 ? 0 : requestAnimationFrame(tick);
  };

  const wake = () => {
    still = 0;
    if (!frame) frame = requestAnimationFrame(tick);
  };

  setLenis(lenis, wake);

  const inputs = ["wheel", "pointerdown", "keydown", "touchstart"] as const;
  for (const type of inputs) {
    window.addEventListener(type, wake, { passive: true });
  }

  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented) return;
    const target = hashTarget(event);
    // No matching element (placeholder link): leave default behavior.
    if (!target) return;

    event.preventDefault();
    const hash = `#${target.id}`;
    if (hash !== window.location.hash) {
      window.history.pushState(null, "", hash);
    }
    // Mobile menu links fire while the menu has Lenis stopped. Start it now,
    // otherwise the menu's later start() resets Lenis and cancels this scroll.
    if (lenis.isStopped) lenis.start();
    wake();
    lenis.scrollTo(target, { force: true });
    alignToAnchor(target);
  };
  document.addEventListener("click", onClick, { capture: true });

  return () => {
    cancelAnimationFrame(frame);
    for (const type of inputs) window.removeEventListener(type, wake);
    document.removeEventListener("click", onClick, { capture: true });
    lenis.destroy();
    setLenis(null, null);
  };
}

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Touch-only devices keep native scrolling; Lenis doesn't smooth touch
    // anyway. Touchscreen laptops still have a fine pointer.
    if (!window.matchMedia("(any-pointer: fine)").matches) return;

    // Dynamic import after the checks so phones never download Lenis.
    let disposed = false;
    let teardown: (() => void) | undefined;
    import("lenis").then(({ default: Lenis }) => {
      if (!disposed) teardown = start(new Lenis({ autoRaf: false, lerp: 0.1 }));
    });

    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  // Without Lenis, the browser handles the jump; just add the alignment fix.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (getLenis()) return;
      const target = hashTarget(event);
      if (target) alignToAnchor(target);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // On route change, jump straight to the top or the hash target (no easing).
  // Skipped on first load so the browser can restore scroll after a refresh.
  const firstRoute = useRef(true);
  useEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    const hash = window.location.hash;
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    const lenis = getLenis();
    if (!lenis) {
      // Next has scrolled to the hash itself.
      if (target) alignToAnchor(target);
      return;
    }
    // Lenis still has the previous page's height (its ResizeObserver hasn't
    // fired yet) and would clamp the scroll to it.
    lenis.resize();
    // Pass a number, not the element: with an element Lenis uses its own
    // (stale) scroll offset from the previous page.
    const y = target
      ? target.getBoundingClientRect().top +
        window.scrollY -
        (parseFloat(getComputedStyle(target).scrollMarginTop) || 0)
      : 0;
    lenis.scrollTo(y, { immediate: true, force: true });
    wakeSmoothScroll();
    if (target) alignToAnchor(target);
  }, [pathname]);

  return null;
}
