import type Lenis from "lenis";

/**
 * The page's one Lenis instance, shared so the rest of the site can reach
 * it — the mobile menu pauses it, in-page links glide through it. Null when
 * smooth scrolling is off (reduced motion, or before it has mounted), and
 * every caller treats that as "use the browser's own scroll".
 */
let instance: Lenis | null = null;
let wake: (() => void) | null = null;

export function setLenis(lenis: Lenis | null, onWake: (() => void) | null) {
  instance = lenis;
  wake = onWake;
}

export function getLenis() {
  return instance;
}

/**
 * Lenis is driven frame by frame only while it is actually moving (see
 * SmoothScroll.tsx), so anything that starts a scroll programmatically has
 * to wake the driver as well.
 */
export function wakeSmoothScroll() {
  wake?.();
}
