"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import type WarpTextComponent from "@/components/WarpText";
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
 * How far ahead of the viewport the module is fetched.
 *
 * Far enough that a fast scroll does not arrive at an empty frame — the chunk
 * has to be fetched, parsed, and then compile a shader and rasterise the
 * sentence before it draws — and near enough that a visitor who never reaches
 * the statement section never pays for it. Roughly half a screen on a laptop.
 */
const ARM_MARGIN = "400px 0px";

/**
 * WarpText, with its fill chosen by the current theme, loaded on approach.
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

    const view = new IntersectionObserver(
      (entries) => {
        if (!entries[entries.length - 1].isIntersecting) return;
        // One-shot. Once the module is in, it stays in — the component does
        // its own pausing when the section leaves the screen.
        view.disconnect();
        setArmed(true);
      },
      { rootMargin: ARM_MARGIN },
    );

    view.observe(holder);
    return () => view.disconnect();
  }, []);

  if (!armed) {
    return <div ref={holderRef} className={cn("warp-text", className)} />;
  }

  // Copied out of the readonly tuple: the underlying component takes a
  // mutable string[], and `as const` on the palette is what keeps the two
  // ramps honest about being fixed lists at the point they are written.
  return <WarpText {...props} className={className} color={[...colors[theme]]} />;
}
