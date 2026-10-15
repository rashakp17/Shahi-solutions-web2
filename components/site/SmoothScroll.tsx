"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { getLenis, setLenis, wakeSmoothScroll } from "@/lib/smoothScroll";

/**
 * Inertial page scrolling, via Lenis.
 *
 * A wheel tick no longer jumps the page 100px in one frame; it is eased over
 * the next several, so scrolling glides and a heavy frame somewhere along
 * the way is absorbed instead of felt. Touch keeps the device's own native
 * momentum (Lenis leaves touch alone by default), and the whole thing is
 * skipped for visitors who prefer reduced motion.
 *
 * ── Driven on demand, not by autoRaf ──
 * Lenis's own `autoRaf` runs a requestAnimationFrame loop for the life of the
 * page. A main-thread rAF loop forces a main-thread frame sixty times a
 * second, and every one of those re-ticks the style of every running CSS
 * animation — which is exactly the cost the particle field and the warp were
 * moved into workers to get rid of. So the loop here runs only while there is
 * input or Lenis is still settling, and stands down half a second after.
 *
 * ── In-page links ──
 * Same-page `#hash` links are caught here, once, for the whole site, and
 * glided to through Lenis — which honours each target's scroll-margin-top,
 * so they land where they always did. The listener runs in the capture phase
 * and only calls preventDefault: every component's own click handler still
 * runs (the mobile menu still closes), and Next's Link sees the prevented
 * default and stands aside instead of jumping there itself.
 */
/**
 * After a jump to an anchor, wait for the scroll to settle and, if the target
 * is not sitting where its scroll-margin says it should, glide the rest of
 * the way.
 *
 * Needed because the sections below the fold are `content-visibility: auto`
 * (globals.css). Until a section has rendered, its height is an estimate, so
 * the distance to #contact is worked out partly from estimates — and as the
 * scroll passes through those sections they render at their real size and
 * the target moves. The first glide gets close; this closes the gap.
 *
 * Gives up at once on any input from the visitor, so it never fights a
 * scroll they have started themselves, and gives up regardless after a few
 * seconds or three corrections.
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

    // Settled: unmoved for ~130ms, and not in the first moments, before the
    // scroll this is following has even begun.
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

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Touch-only devices keep the browser's own scrolling entirely. Lenis
    // leaves touch to native momentum anyway, so on a phone it would add
    // nothing but its per-frame driver — and native momentum scrolling is
    // already the smoothest thing a phone can do. A laptop with a
    // touchscreen still has a fine pointer, and still gets it.
    if (!window.matchMedia("(any-pointer: fine)").matches) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });

    let frame = 0;
    let still = 0;

    const tick = (time: number) => {
      lenis.raf(time);
      still = lenis.isScrolling ? 0 : still + 1;
      // ~0.5s of nothing moving, then stop asking for frames.
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
      // A hash with nothing behind it (a placeholder link) behaves as before.
      if (!target) return;

      event.preventDefault();
      const hash = `#${target.id}`;
      if (hash !== window.location.hash) {
        window.history.pushState(null, "", hash);
      }
      // A link inside the mobile menu is clicked while the menu has Lenis
      // paused, and the menu closes in the same click. Resume first: the
      // menu's own resume, a moment later, would otherwise reset Lenis and
      // cancel the scroll it had just started. (The menu's resume is then a
      // no-op, since Lenis is already running.)
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
  }, []);

  // Without Lenis (touch devices, reduced motion) the browser and Next do the
  // jump themselves; all that is added is the settle-and-align above.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (getLenis()) return;
      const target = hashTarget(event);
      if (target) alignToAnchor(target);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // A new route: arrive at its top, or at its hash target, at once — never
  // eased down through the previous page's scroll position. Not on the first
  // load, where the browser may be restoring a position after a refresh.
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
    // Re-measure first. Lenis clamps every scroll to the page height it last
    // measured, and it measures on a ResizeObserver that has not fired yet —
    // so it still believes this is the previous page. Arriving at /#contact
    // from /resources (2378px tall) was clamped to 1478px: the browser had
    // already put the form under the bar, and Lenis dragged the page back up
    // into the hero.
    lenis.resize();
    // A number, worked out from the real scroll position — not the element.
    // Given an element, Lenis adds its rect to its *own* idea of where the
    // page is, which across a route change is the previous page's offset.
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
