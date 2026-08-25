import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/cn";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  socialMetadata,
} from "@/lib/site";

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
  /* Not preloaded, unlike the other two.
   *
   * `next/font` emits a `<link rel="preload">` for every family by default,
   * which is right for a face that is on the first screen and wrong for this
   * one: --font-display has exactly one consumer, `.giant-warp`, and that is
   * the statement section three screens down — where it is not even laid out
   * as text but rasterised into a canvas by WarpText. Preloading it puts a
   * font file on the critical path competing with the hero's own.
   *
   * The face still loads, just on first use. WarpText re-rasterises once the
   * font actually arrives rather than trusting `document.fonts.ready`, which
   * resolves immediately when nothing has requested the file yet — see the
   * note on `rasterize` in WarpText.jsx. Without that this line would draw
   * the sentence in the fallback face. */
  preload: false,
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
  /**
   * `metadataBase` is what lets every page below this one write its canonical
   * and its Open Graph URL as a path rather than as an absolute address. That
   * is the whole reason it is here: a canonical hardcoded to the production
   * hostname is copied onto every preview deployment, and a preview telling
   * search engines it is the production page is how a site de-indexes itself.
   * With a base, `alternates: { canonical: "/resources" }` resolves correctly
   * against whatever origin is actually serving the page.
   *
   * The origin comes from `NEXT_PUBLIC_SITE_URL`; see lib/site.ts, which is
   * also where to set it before going live.
   */
  metadataBase: new URL(SITE_URL),

  /**
   * The title, and the single highest-value string on the site.
   *
   * It was "Shahi Solutions — Build Beyond The Ordinary", which is a good
   * brand line and a poor title tag, because a title tag has two jobs and
   * that string only did one. It said who this is. It did not say what this
   * is — so the one line a person reads in a page of search results, deciding
   * whether to click, told them nothing about whether they had found a
   * software company.
   *
   * "Custom Software Development Company" is what the business is, in the
   * words somebody looking for it would use, and it is not stuffing: it is
   * the category, once, after the brand. Brand first because establishing
   * "Shahi Solutions" as the entity is the point — a searcher who already
   * knows the name finds it immediately, and the category earns the ones who
   * do not.
   *
   * 52 characters, which matters: Google renders roughly 580px of title and
   * truncates the rest, and a truncated title tends to lose its tail — which
   * is where the brand would be under the other ordering.
   *
   * The slogan is not lost. It is published as `slogan` in the organisation's
   * structured data, which is where a slogan belongs.
   *
   * `template` gives every page below this one the brand suffix without each
   * page having to remember it, so an article titled
   * "Custom Software Development Examples" is filed under the brand in a
   * result, a browser tab and a bookmark alike.
   */
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} — Custom Software Development Company`,
  },

  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },

  /**
   * Explicit, where the defaults would already have been index/follow.
   *
   * The two that are not defaults are the ones worth having. `max-image-preview:
   * large` is what permits a full-size thumbnail beside a result and in Google
   * Discover instead of a 60px square — on a site whose whole argument is
   * visual, that is the difference between a result that looks like a design
   * studio and one that looks like a directory entry. `max-snippet: -1` lifts
   * the cap on how much of a page Google may quote, which matters for the
   * resource articles, where the useful answer is often a full sentence.
   */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  applicationName: SITE_NAME,
  publisher: SITE_NAME,

  /* Both card blocks from one call, so they cannot drift apart and neither can
     lose the image — see `socialMetadata` in lib/site.ts for the Next.js
     metadata-merging trap that makes writing these by hand unsafe.

     The card title is longer than the title tag on purpose: a social card is
     not competing for 580px of a results page and can afford the extra words.
     Open Graph has no template mechanism, so it has to be a literal. */
  ...socialMetadata({
    title: `${SITE_NAME} — Custom Software, Web & Mobile Development`,
    description: SITE_DESCRIPTION,
    path: "/",
  }),
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
      /* en-IN rather than en. The company is in Kerala, the copy is written in
         British spellings throughout ("organisation", "customisation",
         "prioritised"), and the prices are quoted for an Indian practice — so
         the regional subtag is simply true, and it is the honest signal for a
         search engine weighing regional relevance. It is not an hreflang
         setup and does not pretend to be: there is one language version of
         this site, and this says which one it is. */
      lang="en-IN"
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
