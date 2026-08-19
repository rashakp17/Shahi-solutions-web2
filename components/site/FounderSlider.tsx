"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/** Time on each card before it advances, ms. */
const INTERVAL = 2000;

/**
 * How long the slider waits after the visitor touches it before taking over
 * again. Long enough that reading a card, or swiping back to one, is not
 * immediately undone; short enough that an accidental brush does not stop the
 * thing for good.
 */
const RESUME_AFTER = 6000;

/**
 * An auto-advancing slider, built on the scroll container it already needs.
 *
 * The track is a real horizontally scrolling element with CSS scroll-snap, and
 * advancing is `scrollTo`. That is deliberate rather than the transform-based
 * carousel this would usually be: a scroll container gets native touch
 * dragging, momentum, snapping, keyboard scrolling and the platform's own
 * rubber-banding for free, and all of it behaves the way the rest of the phone
 * does. A transform track has to reimplement every one of those, and the
 * reimplementation is always slightly wrong.
 *
 * It also means the slider degrades honestly: with JavaScript disabled the
 * markup is still a scrollable row of cards that a person can swipe. Nothing
 * is hidden behind the script — the script only takes over the advancing.
 *
 * ── Pausing ──
 * Content that moves on its own has to be stoppable, and it stops for three
 * different reasons here:
 *
 *   the visitor touches it   they are reading, or steering; either way the
 *                            slider should not fight them
 *   it scrolls off screen    advancing a slider nobody can see burns frames
 *                            and loses the visitor's place in it
 *   reduced motion           it never advances at all, and stays a plain
 *                            swipeable row
 */
export function FounderSlider({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  /** Names the group for anyone arriving on it with a screen reader. */
  label: string;
}) {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const slides = Children.toArray(children);
  const count = slides.length;

  const [index, setIndex] = useState(0);
  /** Set while the visitor is steering, and for a beat afterwards. */
  const heldRef = useRef(false);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const goTo = useCallback((i: number, smooth = true) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({
      left: track.clientWidth * i,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  /** Called by anything the visitor does to the track. */
  const hold = useCallback(() => {
    heldRef.current = true;
    clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => {
      heldRef.current = false;
    }, RESUME_AFTER);
  }, []);

  // Keep `index` in step with wherever the track actually is — whether it got
  // there from the timer, a swipe, or a keyboard scroll. Reading the scroll
  // position rather than tracking it separately means there is one source of
  // truth and the dots can never disagree with the cards.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const w = track.clientWidth || 1;
        setIndex(Math.max(0, Math.min(count - 1, Math.round(track.scrollLeft / w))));
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, [count]);

  // The advance itself.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let onScreen = true;
    const observer = new IntersectionObserver(
      (entries) => {
        onScreen = entries[entries.length - 1].isIntersecting;
      },
      { threshold: 0.35 },
    );
    observer.observe(track);

    const tick = setInterval(() => {
      if (heldRef.current || !onScreen || document.hidden) return;
      const w = track.clientWidth || 1;
      const at = Math.round(track.scrollLeft / w);
      goTo(at + 1 >= count ? 0 : at + 1);
    }, INTERVAL);

    return () => {
      clearInterval(tick);
      observer.disconnect();
      clearTimeout(resumeRef.current);
    };
  }, [count, goTo]);

  return (
    <div className={className}>
      <ul
        ref={trackRef}
        // aria-label rather than a list role change: it is still a list of
        // people, it just happens to scroll.
        aria-label={label}
        className="fd-track"
        onPointerDown={hold}
        onTouchStart={hold}
        onWheel={hold}
        onMouseEnter={hold}
        onFocusCapture={hold}
      >
        {slides.map((slide, i) => (
          <li key={i} className="fd-slide">
            {slide}
          </li>
        ))}
      </ul>

      {/* Position, and a way to steer. Deliberately real buttons rather than
          decorative dots — on a slider that moves by itself, the ability to go
          back to the card that just left is the difference between a control
          and a decoration. */}
      <div className="fd-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show card ${i + 1} of ${count}`}
            aria-current={i === index ? "true" : undefined}
            data-active={i === index ? "" : undefined}
            onClick={() => {
              hold();
              goTo(i);
            }}
          />
        ))}
      </div>
    </div>
  );
}
