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
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.target && link.target !== "_self") return;

      const url = new URL(link.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        !url.hash
      ) {
        return;
      }

      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      // A hash with nothing behind it (a placeholder link) behaves as before.
      if (!target) return;

      event.preventDefault();
      if (url.hash !== window.location.hash) {
        window.history.pushState(null, "", url.hash);
      }
      // A link inside the mobile menu is clicked while the menu has Lenis
      // paused, and the menu closes in the same click. Resume first: the
      // menu's own resume, a moment later, would otherwise reset Lenis and
      // cancel the scroll it had just started. (The menu's resume is then a
      // no-op, since Lenis is already running.)
      if (lenis.isStopped) lenis.start();
      wake();
      lenis.scrollTo(target, { force: true });
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

  // A new route: arrive at its top, or at its hash target, at once — never
  // eased down through the previous page's scroll position. Not on the first
  // load, where the browser may be restoring a position after a refresh.
  const firstRoute = useRef(true);
  useEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    const lenis = getLenis();
    if (!lenis) return;
    const hash = window.location.hash;
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
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
  }, [pathname]);

  return null;
}
