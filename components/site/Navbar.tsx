"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { START_HREF } from "@/lib/contact";
import { cn } from "@/lib/cn";

/**
 * The four destinations, all of them places on the one page there is.
 *
 * Bare `#id` rather than `/#id`. The leading slash was load-bearing while the
 * work and the team had routes of their own — from /projects a bare `#shipping`
 * would have meant "on the page you are already on" and quietly done nothing.
 * With a single page there is nowhere else to be, and the slash would send the
 * router through a navigation to reach an element already on screen.
 *
 * `Home` stays "/" rather than becoming "#top": it is the one link whose job
 * is to put the visitor back at the beginning, and an anchor to the top of the
 * document is what the browser already does for "/".
 */
const LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "#projects" },
  { label: "About Us", href: "#about" },
  { label: "Contact Us", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Tighten the bar once the page leaves the top of the hero. Compared
  // against the last value rather than handed to React on every scroll event:
  // this is one boolean that flips twice in a session, and the header renders
  // the whole nav tree.
  useEffect(() => {
    let last = false;

    const onScroll = () => {
      const next = window.scrollY > 12;
      if (next === last) return;
      last = next;
      setScrolled(next);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the body while the mobile sheet is open, and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
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
                <li key={link.href}>
                  <Link
                    href={link.href}
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

              <Link
                href="#login"
                className="rounded-full px-3.5 py-2 text-[13px] font-medium text-fg/55 transition-colors duration-300 hover:bg-[color:var(--veil-2)] hover:text-fg"
              >
                Log in
              </Link>
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
              <li key={link.href}>
                <Link
                  href={link.href}
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
            <Button
              href="#login"
              variant="secondary"
              size="md"
              className="w-full"
            >
              Log in
            </Button>
            <Button href={START_HREF} size="md" className="w-full">
              Get started
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
