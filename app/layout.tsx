import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

/**
 * The display face, and only that.
 *
 * Deliberately not bound to `--font-sans`. That name is already a Tailwind
 * theme token in globals.css, resolving to Inter, and `body` is set from it —
 * so publishing Geist under the same name does not give the giant line a
 * different face, it swaps the typeface of the whole site and leaves the two
 * definitions racing on source order to decide it. Under its own name it can
 * be asked for exactly where it is wanted.
 */
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-geist",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Shahi Solutions — Build Beyond The Ordinary",
  description:
    "Infrastructure for teams who refuse the default. Ship faster, scale quieter, and let the engineering disappear behind the product.",
};

export const viewport: Viewport = {
  /* The light ground, matching the default theme, and a single value rather
     than the two media-scoped ones Next will happily generate. A media query
     tracks the *system* preference, which this site deliberately does not
     follow — see the theme script below — so a media-scoped tag would have
     the address bar advertising a theme the page is never in. ThemeToggle
     rewrites this tag directly instead, and the script corrects it before
     first paint for a returning visitor who chose dark. */
  themeColor: "#ffffff",
  /* Both, so form controls, scrollbars and the rest of the UA's own
     furniture follow the page instead of staying dark under a light theme.
     The per-theme `color-scheme` in globals.css narrows this to whichever
     one is actually active. */
  colorScheme: "dark light",
};

/**
 * Resolve the theme before the first paint.
 *
 * This has to be an inline, synchronous script in the head, and there is no
 * way around that. The alternative is deciding the theme in a component —
 * which cannot run until hydration, several hundred ms in — so a visitor who
 * prefers light would watch the dark design paint and then be swapped out
 * from under them. A flash of the wrong theme is the one bug every themed
 * site has, and it is caused entirely by asking too late.
 *
 * Light is the default, and it is the *only* default: the one thing that can
 * override it is a choice the visitor made here, with the toggle. The OS
 * `prefers-color-scheme` setting is deliberately not consulted.
 *
 * That is a decision worth stating rather than leaving to be discovered.
 * Reading the system preference would mean every visitor on a dark desktop
 * lands on the dark design no matter what this site's default says — which
 * makes "the default is light" true only for the half of the audience whose
 * OS already agreed. Ignoring it costs the visitor who keeps their machine
 * dark for a reason; they get one click, and it is remembered from then on.
 * If that trade should go the other way, this is the line to change:
 *
 *   var t=(s==="light"||s==="dark")?s
 *     :(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
 *
 * The `catch` falls back to light too. A browser that throws on localStorage
 * — private mode on older Safari, storage disabled by policy — should still
 * get the design the site actually ships, not the alternate.
 *
 * Written as a string rather than as source so that nothing in the build can
 * decide to defer, bundle or module-scope it. Kept small for the same reason
 * — it is parse-blocking, and every byte here is on the critical path.
 */
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem("theme");var t=(s==="dark")?"dark":"light";document.documentElement.dataset.theme=t;if(t==="dark"){var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content","#04050a");}}catch(e){document.documentElement.dataset.theme="light";}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      /* globals.css sets `scroll-behavior: smooth` on this element, and without
         this attribute Next cannot tell a deliberate smooth scroll from one it
         is about to perform itself — so it smooth-scrolls route changes too,
         and a click on a nav link crawls to the top of the new page instead of
         arriving there. Declaring it hands scroll restoration back to the
         router and silences the warning it logs on every transition. */
      data-scroll-behavior="smooth"
      /* The theme script writes `data-theme` onto this element before React
         sees the document, so the attribute the client hydrates against is
         not the one the server rendered. That is the intended behaviour
         rather than a bug — the whole point is that the value is decided in
         the browser — and this is what tells React so instead of warning
         about it and rewriting the attribute back. */
      suppressHydrationWarning
      className={cn(inter.variable, mono.variable, geist.variable, "font-sans")}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
