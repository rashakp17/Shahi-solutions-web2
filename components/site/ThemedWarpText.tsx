"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import type WarpTextComponent from "@/components/WarpText";
import { scrollSpeed, trackScrollSpeed } from "@/lib/scrollSpeed";
import { useTheme } from "@/lib/useTheme";
import { cn } from "@/lib/cn";
import "@/components/WarpText.css";

/**
 * The stylesheet is imported here rather than inside WarpText.jsx, and that
 * move is what makes the lazy load below free of layout shift.
 *
 * `.warp-text` carries `min-height: 220px`, which beats the 150px `.giant-warp`
 * asks for on a phone — so those rules, not the frame's own, are what decide
 * the height of the box down there. Left inside the component they would have
 * arrived with its chunk, and the placeholder would have stood 150px tall
 * until the moment the real thing landed and pushed the page down by 70.
 * Loaded from here they are in the main stylesheet, present from the first
 * paint, and the placeholder measures exactly what replaces it.
 */

/**
 * The heavy part, off the critical path.
 *
 * WarpText pulls in `ogl` — a WebGL renderer, and on its own the single
 * largest dependency in the project. It draws one sentence, in a section three
 * screens down, that cannot be seen until the visitor has scrolled past the
 * hero, the services grid and most of the statement pane. Bundled statically
 * it was ~127KB of the initial JavaScript, parsed and evaluated before the
 * hero had finished arriving, to render nothing.
 *
 * `ssr: false` as well as dynamic: the component is a WebGL context built in
 * an effect and renders an empty div on the server, so pre-rendering it buys
 * nothing and only puts the module back in the server graph.
 */
const WarpText = dynamic(() => import("@/components/WarpText"), { ssr: false });

type WarpTextProps = ComponentProps<typeof WarpTextComponent>;

/**
 * When the component is mounted: in the first still moment after load.
 *
 * The WebGL setup — module, context, shader, the sentence's raster — is a
 * few long tasks however it is sliced, and the only question is where they
 * land. Each earlier answer put them somewhere the visitor was looking:
 *
 *   400px ahead of the line   the context came up 10–30ms before the line
 *                             entered, so the pane arrived empty and the
 *                             setup stalled the frame the line appeared in.
 *   1.5 screens ahead         on a phone that is the services grid, so the
 *                             setup stalled the cards mid-entrance — the
 *                             section read as slow again.
 *
 * Nobody is watching anything arrive while the page is sitting still on the
 * hero after load, so that is where it goes: an idle callback after `load`,
 * deferred for as long as the page is being scrolled. The render loop does
 * its own pausing off screen, so mounting early costs no frames — only the
 * one context, which every visit that reaches the section would pay anyway.
 *
 * The one exception is the line already being on screen — a visitor who
 * scrolls without pausing from the first frame, or lands there directly — and
 * then it mounts at once rather than waiting for a pause that is not coming.
 */
const STILL_RETRY_MS = 250;

/**
 * WarpText, with its fill chosen by the current theme, mounted once the page
 * is still after load (see STILL_RETRY_MS above).
 *
 * Exists only so that StatementSection can stay a server component. The
 * palette has to be picked in the browser — the canvas takes hex, not custom
 * properties, so the cascade cannot reach it and something has to read the
 * attribute at runtime. Doing that inline would mean marking the whole
 * section as client, which would drag the entire statement subtree, its copy
 * and its two reveals across the boundary to decide the colour of one canvas.
 *
 * A wrapper this thin is the cheaper trade: one client component that knows
 * about exactly one prop, and everything around it stays on the server.
 *
 * The placeholder it renders before then is not a skeleton and deliberately
 * has nothing in it. This section's ground is the composition — the giant line
 * is uncovered by the scroll rather than revealed in place — so an empty frame
 * of exactly the right size is indistinguishable from the frame before the
 * shader's first draw, which is what was there anyway.
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
      // One-shot. Once the module is in, it stays in — the component does
      // its own pausing when the section leaves the screen.
      done = true;
      view.disconnect();
      setArmed(true);
    };

    // The on-screen exception. No margin: this is the fallback, not the plan.
    const view = new IntersectionObserver((entries) => {
      if (entries[entries.length - 1].isIntersecting) arm();
    });
    view.observe(holder);

    // Waits out any scroll in progress, so the setup never lands on a frame
    // the visitor is watching move.
    const armWhenStill = () => {
      if (done || disposed) return;
      if (scrollSpeed() > 0) {
        timer = setTimeout(armWhenStill, STILL_RETRY_MS);
        return;
      }
      arm();
    };

    // Fetched first, mounted once it is in — so the chunk's evaluation and
    // the context's creation are two separate tasks rather than one long one.
    const onIdle = () => {
      import("@/components/WarpText").then(armWhenStill, armWhenStill);
    };

    // requestIdleCallback is missing in Safari, where a timeout stands in.
    const schedule = () => {
      if (window.requestIdleCallback) {
        idle = window.requestIdleCallback(onIdle, { timeout: 4000 });
      } else {
        timer = setTimeout(onIdle, 1500);
      }
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

  // Copied out of the readonly tuple: the underlying component takes a
  // mutable string[], and `as const` on the palette is what keeps the two
  // ramps honest about being fixed lists at the point they are written.
  return <WarpText {...props} className={className} color={[...colors[theme]]} />;
}
