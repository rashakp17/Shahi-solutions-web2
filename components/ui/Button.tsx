import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

// Carries no `will-change` hint. The hover lift is a single pixel on a
// transition, not a running animation, so the hint pinned a compositor layer
// per button for the whole session in exchange for nothing. (Spelled out
// rather than written as the utility class, which the Tailwind scanner would
// read straight back out of this comment and re-emit.)
const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "whitespace-nowrap select-none transition-[transform,background-color,border-color,color,box-shadow,opacity] " +
  "duration-300 ease-cinematic " +
  "hover:-translate-y-px active:translate-y-0 active:duration-100 " +
  "motion-reduce:transform-none";

/**
 * Two pills, and the whole design is that one of them is solid and the other
 * is not. Nothing else distinguishes them — same shape, same height, same
 * weight of type — because a pair of actions side by side is read as a pair,
 * and any second difference between them starts arguing about which is which.
 *
 * Both are deliberately flat. They used to carry a blue bloom underneath, and
 * a lit shadow on a button reads as the button glowing rather than as the
 * button sitting on something: at the size of the hero pair it was the loudest
 * thing on a screen whose subject is the headline above it. What is left is a
 * neutral contact shadow on the solid one and nothing at all on the outlined
 * one, which is what makes the two of them read as objects on a surface.
 */
const variants: Record<Variant, string> = {
  // Solid white on near-black. The hover is a shade off white rather than a
  // tint of the accent — a primary action that changes hue on approach reads
  // as a state change, not as a hover.
  primary: cn(
    "bg-fg text-ink-950",
    "shadow-[0_1px_0_0_var(--plate-sheen)_inset,0_10px_26px_-16px_var(--plate-shadow)]",
    "hover:bg-[var(--plate-hover)]",
    "hover:shadow-[0_1px_0_0_var(--plate-sheen)_inset,0_14px_30px_-16px_var(--plate-shadow-hover)]",
  ),
  // Filled dark pill with a light hairline. Filled, not transparent: at 3% it
  // disappeared over the darker parts of the hero's atmosphere and the pair
  // stopped reading as a pair. No backdrop-blur — these sit over an atmosphere
  // that never stops moving, and blurring it costs a re-sample every frame.
  secondary: cn(
    "border border-[color:var(--hair-3)] bg-[color:var(--veil-3)] text-fg/90",
    "hover:border-fg/25 hover:bg-[color:var(--veil-4)] hover:text-fg",
  ),
  ghost: "text-fg/60 hover:text-fg",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px] tracking-[-0.005em]",
  md: "h-11 px-6 text-sm tracking-[-0.005em]",
  // Unused since the hero pair moved into a bar and dropped to `md` — a 52px
  // button inside a bar makes the bar the size of a section heading. Left at
  // its designed proportions rather than tuned for a caller that no longer
  // exists.
  lg: "h-[52px] px-7 text-[15px] tracking-[-0.01em]",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = BaseProps & { href: string };
type ButtonAsButton = BaseProps &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (typeof props.href === "string") {
    /**
     * Anything leaving the document gets a real anchor, not next/link.
     *
     * The router has nothing to do for a wa.me link — there is no route to
     * prefetch and no client navigation to perform — and handing it one means
     * a Link that can only ever fall through to a full page load, with the
     * prefetch machinery attached to it for the entire time it is on screen.
     *
     * The `rel` is the part that actually matters. `noopener` stops the page
     * that opens from reaching back through `window.opener`, which is a real
     * hole rather than a formality; `noreferrer` keeps this site's URL out of
     * the referrer sent to it.
     */
    if (/^https?:/i.test(props.href)) {
      return (
        <a
          href={props.href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {children}
        </a>
      );
    }

    // tel: and mailto: hand off to another application rather than opening a
    // page, so they get the anchor but not the new tab — a target on those
    // leaves an empty window behind once the handler takes over.
    if (/^(tel:|mailto:)/i.test(props.href)) {
      return (
        <a href={props.href} className={classes}>
          {children}
        </a>
      );
    }

    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;

  return (
    <button type="button" {...rest} className={classes}>
      {children}
    </button>
  );
}
