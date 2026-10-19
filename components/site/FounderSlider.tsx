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

/** Pause after user interaction before auto-advancing resumes, ms. */
const RESUME_AFTER = 6000;

/**
 * Auto-advancing slider on a native scroll-snap container (advances with
 * scrollTo), so touch, momentum and keyboard scrolling work natively and it
 * still works without JS. Pauses on interaction, when off screen, and never
 * advances with reduced motion.
 */
export function FounderSlider({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  /** Accessible name for the list. */
  label: string;
}) {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const slides = Children.toArray(children);
  const count = slides.length;

  const [index, setIndex] = useState(0);
  /** True during user interaction and for RESUME_AFTER ms afterwards. */
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

  const hold = useCallback(() => {
    heldRef.current = true;
    clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => {
      heldRef.current = false;
    }, RESUME_AFTER);
  }, []);

  // Derive `index` from the scroll position so the dots always match the
  // visible card, however it got there.
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

  // Auto-advance.
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

      {/* Dots are real buttons so users can go back to a card. */}
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
