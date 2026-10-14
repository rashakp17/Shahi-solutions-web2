/**
 * How fast the page is being scrolled right now, in px/s.
 *
 * Every entrance on the page is released as its section approaches and then
 * plays a few hundred ms of choreography. At a reading pace that is the
 * design. At a brisk scroll it is the bug: the section has crossed the screen
 * before its content has finished arriving, so the visitor flies past blank
 * bands. The gates ask this before releasing anything, and above
 * FAST_SCROLL they skip the choreography and arrive almost at once (see
 * `data-reveal-fast` in globals.css).
 *
 * One passive listener for the whole page, installed by whichever gate mounts
 * first. Smoothed over consecutive events so a single jumpy delta does not
 * flip the mode, and reported as zero once the scroll has been still for a
 * moment — a resting page is not a fast one.
 */

/** Above this, entrances skip their choreography. A brisk wheel or flick. */
export const FAST_SCROLL = 1500;

let installed = false;
let lastY = 0;
let lastT = 0;
let speed = 0;

function install() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  lastY = window.scrollY;
  lastT = performance.now();

  window.addEventListener(
    "scroll",
    () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = now - lastT;
      if (dt > 0) {
        const instant = (Math.abs(y - lastY) / dt) * 1000;
        // After a pause, start fresh rather than averaging against stale data.
        speed = dt > 120 ? instant : speed * 0.5 + instant * 0.5;
      }
      lastY = y;
      lastT = now;
    },
    { passive: true },
  );
}

export function scrollSpeed(): number {
  install();
  return performance.now() - lastT > 160 ? 0 : speed;
}

/** Starts tracking without asking — call from an effect on mount. */
export function trackScrollSpeed() {
  install();
}
