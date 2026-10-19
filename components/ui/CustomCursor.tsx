"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor spotlight: a soft accent glow that trails the pointer and lights up
 * whatever is beneath it. The native cursor stays.
 *
 * The glow is a gradient painted once and moved with a transform; the frame
 * loop stops once it has caught up. It brightens over links and buttons.
 * Mouse only, and off for reduced motion (`glow-on` on <html> shows it).
 */

const INTERACTIVE = "a, button, [role='button'], label, summary, select";

/** Share of the remaining distance covered per frame. */
const EASE = 0.14;

export function CustomCursor() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const glow = glowRef.current;
    if (!glow) return;

    const root = document.documentElement;
    root.classList.add("glow-on");

    let px = 0;
    let py = 0;
    let gx = 0;
    let gy = 0;
    let frame = 0;

    const tick = () => {
      gx += (px - gx) * EASE;
      gy += (py - gy) * EASE;
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
      frame =
        Math.abs(px - gx) + Math.abs(py - gy) > 0.1
          ? requestAnimationFrame(tick)
          : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      if (!root.dataset.glow) {
        // First move: start on the pointer instead of sliding in from 0,0.
        gx = px;
        gy = py;
      }
      const el = e.target instanceof Element ? e.target : null;
      root.dataset.glow = el?.closest(INTERACTIVE) ? "hover" : "idle";
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onLeave = () => delete root.dataset.glow;

    document.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);

    return () => {
      document.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      root.classList.remove("glow-on");
      delete root.dataset.glow;
    };
  }, []);

  return (
    <div ref={glowRef} aria-hidden="true" className="cursor-glow">
      <span />
    </div>
  );
}
