import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

// No `will-change` hint: the 1px hover lift is a short transition, and the
// hint would keep a compositor layer per button alive for the whole session.
// (Don't write the utility class name here; Tailwind scans comments too.)
const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "whitespace-nowrap select-none transition-[transform,background-color,border-color,color,box-shadow,opacity] " +
  "duration-300 ease-cinematic " +
  "hover:-translate-y-px active:translate-y-0 active:duration-100 " +
  "motion-reduce:transform-none";

// Primary and secondary differ only in fill (solid vs outlined) so they read
// as a pair. Both are flat, with a neutral shadow on the solid one only.
const variants: Record<Variant, string> = {
  // Hover shifts to off-white rather than an accent tint.
  primary: cn(
    "bg-fg text-ink-950",
    "shadow-[0_1px_0_0_var(--plate-sheen)_inset,0_10px_26px_-16px_var(--plate-shadow)]",
    "hover:bg-[var(--plate-hover)]",
    "hover:shadow-[0_1px_0_0_var(--plate-sheen)_inset,0_14px_30px_-16px_var(--plate-shadow-hover)]",
  ),
  // Filled so it stays visible over the dark hero background. No
  // backdrop-blur: the background animates, so blur would re-sample every frame.
  secondary: cn(
    "border border-[color:var(--hair-3)] bg-[color:var(--veil-3)] text-fg/90",
    "hover:border-fg/25 hover:bg-[color:var(--veil-4)] hover:text-fg",
  ),
  ghost: "text-fg/60 hover:text-fg",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px] tracking-[-0.005em]",
  md: "h-11 px-6 text-sm tracking-[-0.005em]",
  // Currently unused.
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
    // External URLs use a plain anchor (next/link has nothing to prefetch).
    // noopener blocks window.opener access; noreferrer hides our URL.
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

    // tel:/mailto: get no target="_blank", which would leave an empty tab.
    // #hash links use a plain anchor too: through next/link they made the
    // router prefetch the current page's own payload. SmoothScroll still
    // handles the click since it listens on any a[href].
    if (/^(tel:|mailto:|#)/i.test(props.href)) {
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
