/**
 * Current scroll speed in px/s. Reveal animations check this and skip their
 * choreography above FAST_SCROLL (see `data-reveal-fast` in globals.css).
 *
 * `scrollY` is sampled on an interval while scrolling instead of read in the
 * scroll handler, because reading it forces a style recalc each event. The
 * sampler stops when scrolling goes idle.
 */

/** Above this (px/s), entrances skip their animation. */
export const FAST_SCROLL = 1500;

/** Sample interval while scrolling. */
const SAMPLE_MS = 50;
/** Stop sampling after this long without scroll events. */
const IDLE_MS = 180;
/** Minimum time window used to measure speed. */
const WINDOW_MS = 150;

const history: Array<{ t: number; y: number }> = [];

let installed = false;
let sampler: ReturnType<typeof setInterval> | undefined;
let lastEvent = 0;
let speed = 0;
let wasFast = false;
const onFastListeners = new Set<() => void>();

function sample() {
  const now = performance.now();

  if (now - lastEvent > IDLE_MS) {
    clearInterval(sampler);
    sampler = undefined;
    speed = 0;
    wasFast = false;
    return;
  }

  // Measure over WINDOW_MS, not one sample, so discrete wheel jumps don't
  // read as fast scrolling.
  const y = window.scrollY;
  history.push({ t: now, y });
  while (history.length > 2 && now - history[1].t >= WINDOW_MS) history.shift();
  const first = history[0];
  const span = now - first.t;
  // Ignore until at least 100ms of movement has been seen.
  speed = span >= 100 ? (Math.abs(y - first.y) / span) * 1000 : 0;

  const fast = speed > FAST_SCROLL;
  if (fast && !wasFast) onFastListeners.forEach((fn) => fn());
  wasFast = fast;
}

function install() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  window.addEventListener(
    "scroll",
    () => {
      lastEvent = performance.now();
      if (sampler) return;
      // Record the starting position, then start sampling.
      history.length = 0;
      history.push({ t: lastEvent, y: window.scrollY });
      speed = 0;
      sampler = setInterval(sample, SAMPLE_MS);
    },
    { passive: true },
  );
}

export function scrollSpeed(): number {
  install();
  return sampler ? speed : 0;
}

/** Starts tracking. Call from an effect on mount. */
export function trackScrollSpeed() {
  install();
}

/**
 * Calls `fn` each time scrolling becomes fast, so running animations can
 * finish early. Returns an unsubscribe function.
 */
export function onScrollFast(fn: () => void): () => void {
  install();
  onFastListeners.add(fn);
  return () => onFastListeners.delete(fn);
}
