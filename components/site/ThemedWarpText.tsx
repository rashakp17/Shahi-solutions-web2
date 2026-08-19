"use client";

import { ComponentProps } from "react";
import WarpText from "@/components/WarpText";
import { useTheme } from "@/lib/useTheme";

type WarpTextProps = ComponentProps<typeof WarpText>;

/**
 * WarpText, with its fill chosen by the current theme.
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
 */
export function ThemedWarpText({
  colors,
  ...props
}: Omit<WarpTextProps, "color"> & {
  colors: { dark: readonly string[]; light: readonly string[] };
}) {
  const theme = useTheme();

  // Copied out of the readonly tuple: the underlying component takes a
  // mutable string[], and `as const` on the palette is what keeps the two
  // ramps honest about being fixed lists at the point they are written.
  return <WarpText {...props} color={[...colors[theme]]} />;
}
