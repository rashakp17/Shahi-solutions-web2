"use client";

import { cn } from "@/lib/cn";

/**
 * Ground colours for the browser's own chrome — the address bar on mobile,
 * the window frame on some desktops. Kept in step with the toggle so the
 * furniture around the page does not stay on the theme the visitor just left.
 *
 * These two are the `--ground` values from globals.css. Duplicated here
 * because a `<meta>` attribute cannot read a custom property; if the ground
 * changes there, it changes here.
 */
const CHROME = { dark: "#04050a", light: "#ffffff" } as const;

/**
 * The theme switch.
 *
 * Writes straight to `document.documentElement` rather than going through
 * React state, and that is deliberate rather than a shortcut. The attribute
 * is already on <html> before React exists — the inline script in the layout
 * puts it there to avoid a flash — so making a component the owner of that
 * value would mean two sources of truth for it, and a first render that has
 * to guess which one is right.
 *
 * The same reasoning drives the icon. Which glyph is correct depends on the
 * current theme, which is a client-only fact, so deriving it during render
 * would either mismatch on hydration or force a mounted-yet flag and a frame
 * of nothing. Both glyphs are therefore always in the markup and CSS shows
 * exactly one, keyed off the same attribute everything else reads. The server
 * and the client render identical HTML and the correct icon is up on the
 * first paint.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";

    root.dataset.theme = next;

    // Suppress the page-wide colour transition for the length of the swap.
    // Ground and ink cross-fading is what makes the switch feel deliberate;
    // every *other* transition on the page firing at once — fifty hairlines,
    // every hover state, the navbar's glass — is just noise, and on a long
    // page it is enough work to drop frames.
    root.dataset.themeSwitching = "true";
    window.setTimeout(() => {
      delete root.dataset.themeSwitching;
    }, 340);

    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode, or storage disabled. The theme still changes for this
      // page view; it just will not be remembered, which is the right
      // failure — losing the preference is better than losing the toggle.
    }

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", CHROME[next]);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      // Static, on purpose. A label that named the current theme would be a
      // third thing to keep in sync with the attribute, and it would be the
      // one thing on the page that could hydrate wrong without being visible.
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
      {/* Sun on the dark theme, moon on the light one: the icon is the
          destination, not the current state — it is what you get if you
          press it. */}
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
