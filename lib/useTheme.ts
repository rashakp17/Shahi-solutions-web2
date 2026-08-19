"use client";

import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

/**
 * The current theme, for the two places on this page that cannot read CSS.
 *
 * Almost nothing needs this. The palette is published as custom properties
 * and the entire page flips by itself when the attribute on <html> changes —
 * a component that reaches for this hook to colour a div is doing by hand,
 * and one render late, what the stylesheet already does for free.
 *
 * What it is actually for is the two canvases. A `fillStyle` and a WebGL
 * uniform are plain numbers handed to a drawing API; neither resolves
 * `var()`, `color-mix()`, or anything else that would let the cascade reach
 * them. Those two have to be told.
 *
 * Reads the attribute rather than the OS preference, because the attribute is
 * the answer — it already accounts for a stored choice overriding the system,
 * and it is what every other colour on the page is keyed to. Watching
 * `prefers-color-scheme` here instead would put the canvases on a different
 * source of truth from the stylesheet, and they would disagree the moment
 * somebody used the toggle.
 *
 * Starts on the site default and corrects in an effect. The alternative —
 * reading the DOM during render — is a hydration mismatch by construction,
 * since the server has no attribute to read. One frame of the default is the
 * cost, and on the canvases it is invisible: neither has drawn anything yet.
 *
 * This initial value has to track whatever the layout's theme script treats
 * as its fallback. They are two expressions of one decision, and if they ever
 * disagree the canvases spend a frame painted for the wrong ground.
 */
export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const root = document.documentElement;

    const read = () => {
      setTheme(root.dataset.theme === "light" ? "light" : "dark");
    };

    read();

    // A MutationObserver rather than a subscription the toggle publishes to.
    // The attribute is written from two places — the inline script in the
    // layout, before any of this exists, and the toggle — and watching the
    // attribute itself covers both without either of them having to know
    // that anything is listening.
    const observer = new MutationObserver(read);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}
