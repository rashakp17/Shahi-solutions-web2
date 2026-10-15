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

/**
 * The destinations. Four of them are places on the home page; one is a route.
 *
 * `hash` rather than `href` for the four, because the correct link depends on
 * where the bar is being rendered — and it is now rendered in more than one
 * place. See `hrefFor` below.
 *
 * `Home` stays "/" rather than becoming "#top": it is the one link whose job
 * is to put the visitor back at the beginning, and an anchor to the top of the
 * document is what the browser already does for "/".
 *
 * `Resources` is a real route and is listed last before the action, which is
 * where a reference section belongs — it is the link somebody follows when
 * they are not ready to talk yet, and putting it ahead of Contact would be
 * arguing with the order of the page.
 */
const LINKS: Array<{ label: string; href?: string; hash?: string }> = [
  { label: "Home", href: "/" },
  { label: "Projects", hash: "projects" },
  { label: "About Us", hash: "about" },
  { label: "Resources", href: "/resources" },
  { label: "Contact Us", hash: "contact" },
];

/**
 * Where a section link should point, given where we are standing.
 *
 * On the home page a bare `#projects` is right: the target is already in this
 * document, and `/#projects` would send the router through a navigation to
 * reach an element that is on screen. Anywhere else a bare fragment means
 * "somewhere on the page you are already on", where no such element exists —
 * so the link silently does nothing, which is exactly what happened to this
 * bar the moment /resources gained a page.
 *
 * The prefix is therefore computed rather than written down, and it is
 * computed from the pathname rather than from a prop, so a new route cannot
 * forget to pass it.
 */
function hrefFor(link: (typeof LINKS)[number], onHome: boolean): string {
  if (link.href) return link.href;
  return onHome ? `#${link.hash}` : `/#${link.hash}`;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const onHome = usePathname() === "/";

  // Tighten the bar once the page leaves the top of the hero.
  //
  // An observer on a 12px marker at the top of the document, not a scroll
  // listener. The listener read `window.scrollY` on every scroll event, and
  // in Chrome that read brings style and layout up to date first — so with
  // the page's entrances animating it forced a style recalc per event,
  // measured as the most expensive script on the page on a throttled phone.
  // The observer answers the same yes/no without touching layout at all.
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

  // Lock the body while the mobile sheet is open, and let Escape close it.
  // Lenis is paused too: it scrolls by script, which overflow: hidden does
  // not stop, so a wheel over the sheet would otherwise move the page behind.
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
    // Arrives with everything else in the hero, on the shared default rise.
    //
    // Only the delay is set. The header is a sibling of the hero rather than a
    // child of it, so any `--rise-*` override the hero carries has to be
    // duplicated here — which is exactly how this drifted out of step before.
    // Leaving both on the default means there is nothing to keep in sync.
    // 300ms is `START` in components/site/Hero.tsx; that is the one number
    // that has to match.
    <>
      {/* The marker the bar watches: the top 12px of the document. Absolute
          against the initial containing block, so it scrolls away with the
          page however the page itself is laid out. */}
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
              // The glass only exists once there is content to see through it.
              // At the top of the page the bar is over the hero's atmosphere,
              // which never stops moving — a fixed backdrop filter there means
              // re-sampling and re-blurring that strip every single frame, for
              // a blur of empty darkness. Below the fold it earns its keep.
              scrolled
                ? "nav-glass border-fg/10 bg-ink-900/70 backdrop-blur-xl shadow-[var(--shadow-card)]"
                : "border-[color:var(--hair-2)] bg-[color:var(--veil-1)]",
            )}
          >
            <Logo />

            {/* Desktop links */}
            <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={hrefFor(link, onHome)}
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

      {/* ---------------- Mobile sheet ----------------

          A sibling of the header, emphatically not a child of it, and this is
          load-bearing rather than tidiness.

          The header carries `.anim-rise`, whose entrance animates transform
          and filter — and which settles on `translate3d(0,0,0)` and
          `blur(0)` rather than on `none`, because `animation-fill-mode: both`
          holds the last keyframe forever. Any transform or filter other than
          `none` makes an element the containing block for `position: fixed`
          descendants. So inside the header this panel was not fixed to the
          viewport at all: it was fixed to the 68px-tall bar, and measured
          375x68 on a 375x812 screen.

          The sheet itself still appeared, because nothing was clipping it —
          which is exactly what made this hard to see. What did not work was
          everything depending on the panel's *size*: the scrim covered only
          the strip behind the navbar instead of dimming the page, and
          tap-outside-to-close only registered in the top 68px of the screen.

          Out here there is no transformed ancestor and `fixed inset-0` means
          the viewport again. z-40 against the header's z-50 keeps the bar and
          its close button painting on top, which is the arrangement the
          design already had. */}
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

          {/* The toggle is in the desktop actions too, but that row is
              `hidden lg:flex` — without this the switch simply does not exist
              on a phone, which is the half of the audience whose device is
              most likely to have picked the theme for them. */}
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
