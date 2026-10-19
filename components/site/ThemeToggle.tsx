"use client";

import { cn } from "@/lib/cn";

/**
 * theme-color meta values (browser UI). Must match --ground in globals.css;
 * a meta tag can't read CSS variables.
 */
const CHROME = { dark: "#04050a", light: "#ffffff" } as const;

/**
 * Theme toggle. Writes data-theme on <html> directly (set initially by the
 * layout's inline script) instead of React state. Both icons are rendered and
 * CSS shows the right one, avoiding hydration mismatches.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";

    root.dataset.theme = next;

    // Disable other transitions during the swap; firing them all at once
    // drops frames.
    root.dataset.themeSwitching = "true";
    window.setTimeout(() => {
      delete root.dataset.themeSwitching;
    }, 340);

    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage unavailable: the theme still changes, just isn't persisted.
    }

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", CHROME[next]);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      // Static label so it can't mismatch on hydration.
      aria-label="Switch between light and dark theme"
      title="Switch between light and dark theme"
      className={cn(
        "grid h-8 w-8 place-items-center rounded-full",
        "border border-[color:var(--hair-2)] text-fg/45",
        "transition-colors duration-300",
        "hover:border-fg/15 hover:text-fg/75",
        className,
      )}
    >
      {/* Icon shows the theme you switch to: sun in dark mode, moon in light. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="tt-sun h-[15px] w-[15px]"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>

      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="tt-moon h-[15px] w-[15px]"
      >
        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}
