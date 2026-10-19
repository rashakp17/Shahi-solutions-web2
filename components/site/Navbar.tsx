"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { START_HREF } from "@/lib/contact";
import { cn } from "@/lib/cn";
import { getLenis } from "@/lib/smoothScroll";

// Home-page sections use `hash` so hrefFor can build the right link for the
// current route; real routes use `href`.
const LINKS: Array<{ label: string; href?: string; hash?: string }> = [
  { label: "Home", href: "/" },
  { label: "Projects", hash: "projects" },
  { label: "About Us", hash: "about" },
  { label: "Resources", href: "/resources" },
  { label: "Contact Us", hash: "contact" },
];

// Bare `#hash` on the home page (no router navigation), `/#hash` elsewhere,
// where a bare fragment would point at nothing.
function hrefFor(link: (typeof LINKS)[number], onHome: boolean): string {
  if (link.href) return link.href;
  return onHome ? `#${link.hash}` : `/#${link.hash}`;
}

// Disable prefetch for links to the current (home) page. Otherwise each one
// in the viewport fetches the home page's own RSC payload (~24KB) during
// initial load, for a navigation that never happens.
function prefetchFor(
  link: (typeof LINKS)[number],
  onHome: boolean,
): false | undefined {
  return onHome && (link.href === "/" || link.hash) ? false : undefined;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const onHome = usePathname() === "/";

  // Switch to the scrolled style once the top marker leaves the viewport.
  // IntersectionObserver instead of a scroll listener: reading scrollY on
  // every scroll forced a style recalc while animations were running.
  const topRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const marker = topRef.current;
    if (!marker) return;
    const view = new IntersectionObserver((entries) => {
      setScrolled(!entries[entries.length - 1].isIntersecting);
    });
    view.observe(marker);
    return () => view.disconnect();
  }, []);

  // Lock body scroll while the mobile sheet is open; Escape closes it.
  // Lenis must be paused too, since overflow: hidden doesn't stop scripted scrolling.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    // 300ms delay must match START in Hero.tsx so the navbar enters with the hero.
    <>
      {/* Scroll marker: the top 12px of the document, watched by the observer above. */}
      <div
        ref={topRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-3 w-px"
      />
      <header
        className="anim-rise fixed inset-x-0 top-0 z-50"
        style={{ animationDelay: "300ms" }}
      >
        <div className="mx-auto max-w-6xl px-4 pt-3 sm:px-6 sm:pt-5">
          <nav
            className={cn(
              "flex h-14 items-center justify-between rounded-full border pl-5 pr-2.5 sm:pl-6 sm:pr-3",
              "transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-cinematic",
              // Blur only after scrolling. Over the animated hero background a
              // backdrop filter would re-blur every frame for no visible gain.
              scrolled
                ? "nav-glass border-fg/10 bg-ink-900/70 backdrop-blur-xl shadow-[var(--shadow-card)]"
                : "border-[color:var(--hair-2)] bg-[color:var(--veil-1)]",
            )}
          >
            <Logo prefetch={onHome ? false : undefined} />

            {/* Desktop links */}
            <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={hrefFor(link, onHome)}
                    prefetch={prefetchFor(link, onHome)}
                    className="relative rounded-full px-3.5 py-2 text-[13px] font-medium text-fg/55 transition-colors duration-300 hover:bg-[color:var(--veil-2)] hover:text-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop actions */}
            <div className="hidden items-center gap-1 lg:flex">
              <ThemeToggle className="mr-1" />
              <Button href={START_HREF} size="sm" className="px-5">
                Get started
              </Button>
            </div>

            {/* Mobile trigger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--hair-2)] text-fg/70 transition-colors duration-300 hover:border-fg/15 hover:text-fg lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute left-0 block h-px w-4 bg-current transition-all duration-300 ease-cinematic",
                    open ? "top-1.5 rotate-45" : "top-0.5",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px w-4 bg-current transition-all duration-300 ease-cinematic",
                    open ? "top-1.5 -rotate-45" : "top-2.5",
                  )}
                />
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile sheet. Must stay outside <header>: the header's .anim-rise
          leaves a transform/filter applied, which would make it the
          containing block for this fixed panel and shrink it to the bar's
          size. z-40 keeps it under the header (z-50). */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 top-0 z-40 lg:hidden",
          "transition-[opacity,visibility] duration-400 ease-cinematic",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="nav-scrim absolute inset-0 h-full w-full cursor-default backdrop-blur-xl"
        />

        <div className="nav-sheet relative mx-4 mt-[4.75rem] overflow-hidden rounded-3xl border border-[color:var(--hair-2)] p-2 backdrop-blur-2xl sm:mx-6">
          <ul className="flex flex-col">
            {LINKS.map((link, i) => (
              <li key={link.label}>
                <Link
                  href={hrefFor(link, onHome)}
                  prefetch={prefetchFor(link, onHome)}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-2xl px-4 py-3.5 text-[15px] font-medium text-fg/70",
                    "transition-[color,background-color,transform] duration-300 ease-cinematic",
                    "hover:bg-[color:var(--veil-2)] hover:text-fg",
                    open
                      ? "translate-y-0 opacity-100"
                      : "translate-y-2 opacity-0",
                  )}
                  style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Theme toggle for mobile; the desktop one is hidden below lg. */}
          <div className="mt-2 flex items-center justify-between gap-2 border-t border-[color:var(--hair-1)] px-4 pb-1 pt-4">
            <span className="text-[13px] font-medium text-fg/55">
              Appearance
            </span>
            <ThemeToggle />
          </div>

          <div className="mt-2 flex flex-col gap-2 border-t border-[color:var(--hair-1)] p-2 pt-4">
            <Button href={START_HREF} size="md" className="w-full">
              Get started
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
