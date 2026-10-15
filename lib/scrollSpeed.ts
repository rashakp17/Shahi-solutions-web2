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
 * Sampled, not read per event — and that is a performance decision, not a
 * stylistic one. `window.scrollY` is not a free read in Chrome: it brings
 * style and layout up to date first. Read in a scroll listener, while the
 * page's entrances are animating, it forced a style recalc on every scroll
 * event, ahead of the one the frame was about to do anyway. On a throttled
 * phone that was the single most expensive script on the page.
 *
 * So the listener only notes that a scroll is happening and starts a sampler,
 * which reads the position every SAMPLE_MS while the page moves and stops
 * itself once it has been still for a moment. A resting page reads nothing
 * and reports zero — a resting page is not a fast one.
 */

/** Above this, entrances skip their choreography. A brisk wheel or flick. */
export const FAST_SCROLL = 1500;

/** How often the position is read while scrolling. ~20 reads a second. */
const SAMPLE_MS = 50;
/** Still for this long and the sampler stands down. */
const IDLE_MS = 180;
/** Speed is measured as distance over (at least) this much time. */
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

  // Distance over the last WINDOW_MS, not over one sample. Wheel input
  // without smooth scrolling arrives as discrete jumps, and a 50ms sample
  // that happens to catch two of them reads a reading pace as a sprint.
  const y = window.scrollY;
  history.push({ t: now, y });
  while (history.length > 2 && now - history[1].t >= WINDOW_MS) history.shift();
  const first = history[0];
  const span = now - first.t;
  // Not trusted until a tenth of a second of movement has been seen — the
  // first sample of a burst spans only one interval and has the same
  // problem. A real flick still registers inside 100ms.
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
      // One read to anchor the burst, then the sampler takes over.
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

/** Starts tracking without asking — call from an effect on mount. */
export function trackScrollSpeed() {
  install();
}

/**
 * Called each time the scroll crosses into fast. For entrances released at a
 * reading pace that are still playing when the visitor suddenly flicks: they
 * would otherwise be carried past mid-choreography. Returns an unsubscribe.
 */
export function onScrollFast(fn: () => void): () => void {
  install();
  onFastListeners.add(fn);
  return () => onFastListeners.delete(fn);
}
