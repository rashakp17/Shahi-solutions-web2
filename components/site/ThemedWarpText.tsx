"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import type WarpTextComponent from "@/components/WarpText";
import { scrollSpeed, trackScrollSpeed } from "@/lib/scrollSpeed";
import { useTheme } from "@/lib/useTheme";
import { cn } from "@/lib/cn";
import "@/components/WarpText.css";

// WarpText.css is imported here, not in WarpText.jsx, so its min-height is in
// the main stylesheet and the placeholder below has the same size (no layout shift).

// Lazy-loaded: WarpText pulls in ogl (WebGL), the largest dependency, for a
// section well below the fold. ssr: false since it only renders client-side.
const WarpText = dynamic(() => import("@/components/WarpText"), { ssr: false });

type WarpTextProps = ComponentProps<typeof WarpTextComponent>;

// WebGL setup causes long tasks, so mount when the page is idle and not
// scrolling after load (retrying at this interval), or immediately if the
// element is already on screen.
const STILL_RETRY_MS = 250;

/**
 * WarpText with colors picked by the current theme, lazily mounted. Client
 * wrapper so StatementSection can stay a server component. Renders an empty,
 * correctly sized placeholder until mounted.
 */
export function ThemedWarpText({
  colors,
  className,
  ...props
}: Omit<WarpTextProps, "color"> & {
  colors: { dark: readonly string[]; light: readonly string[] };
}) {
  const theme = useTheme();
  const [armed, setArmed] = useState(false);
  const holderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;

    trackScrollSpeed();

    let done = false;
    let disposed = false;
    let idle = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const arm = () => {
      if (done || disposed) return;
      // One-shot; WarpText pauses itself when off screen.
      done = true;
      view.disconnect();
      setArmed(true);
    };

    // Fallback: mount immediately if already on screen.
    const view = new IntersectionObserver((entries) => {
      if (entries[entries.length - 1].isIntersecting) arm();
    });
    view.observe(holder);

    // Wait until scrolling stops so setup doesn't cause visible jank.
    const armWhenStill = () => {
      if (done || disposed) return;
      if (scrollSpeed() > 0) {
        timer = setTimeout(armWhenStill, STILL_RETRY_MS);
        return;
      }
      arm();
    };

    // Load the chunk first, then mount, splitting evaluation and WebGL setup
    // into separate tasks.
    const onIdle = () => {
      import("@/components/WarpText").then(armWhenStill, armWhenStill);
    };

    // Wait 1.5s after load (same as RenderAhead): load fires early, and
    // loading during the hero entrance hurt LCP on phones. Falls back to
    // calling directly where requestIdleCallback is missing (Safari).
    const schedule = () => {
      timer = setTimeout(() => {
        if (window.requestIdleCallback) {
          idle = window.requestIdleCallback(onIdle, { timeout: 4000 });
        } else {
          onIdle();
        }
      }, 1500);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      disposed = true;
      view.disconnect();
      window.removeEventListener("load", schedule);
      if (idle) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, []);

  if (!armed) {
    return <div ref={holderRef} className={cn("warp-text", className)} />;
  }

  // Copy the readonly array; WarpText expects a mutable string[].
  return <WarpText {...props} className={className} color={[...colors[theme]]} />;
}
