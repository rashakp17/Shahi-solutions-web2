import type Lenis from "lenis";

/**
 * Shared Lenis instance (used by the mobile menu and in-page links). Null when
 * smooth scrolling is off or not mounted yet; callers fall back to native scroll.
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
 * The Lenis RAF loop only runs while scrolling (see SmoothScroll.tsx), so
 * programmatic scrolls must wake it.
 */
export function wakeSmoothScroll() {
  wake?.();
}
