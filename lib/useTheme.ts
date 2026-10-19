"use client";

import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

/**
 * Current theme from `data-theme` on <html>. Only for canvas/WebGL code that
 * can't use CSS variables; everything else should rely on CSS.
 *
 * Starts on the default and syncs in an effect to avoid hydration mismatches.
 * The initial value must match the theme script's fallback in app/layout.tsx.
 */
export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const root = document.documentElement;

    const read = () => {
      setTheme(root.dataset.theme === "light" ? "light" : "dark");
    };

    read();

    // Watch the attribute directly so changes from both the inline script
    // and the toggle are picked up.
    const observer = new MutationObserver(read);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}
