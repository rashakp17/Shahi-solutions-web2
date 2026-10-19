import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/cn";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { CardSpotlight } from "@/components/ui/CardSpotlight";
import { CustomCursor } from "@/components/ui/CustomCursor";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  socialMetadata,
} from "@/lib/site";

/**
 * Display face only. Not bound to `--font-sans`: that token already maps to
 * Inter in globals.css and reusing it would change the font site-wide.
 */
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
  /* Not preloaded: only used by `.giant-warp`, well below the fold, so it
     shouldn't compete with the hero fonts. WarpText re-rasterises once the
     font loads (see `rasterize` in WarpText.jsx). */
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
  /* Not preloaded: nothing above the fold on mobile uses it. Loads on first
     use and swaps in. */
  preload: false,
});

export const metadata: Metadata = {
  /* Lets pages use relative canonical/OG URLs, so preview deployments don't
     claim to be production. Origin comes from NEXT_PUBLIC_SITE_URL (lib/site.ts). */
  metadataBase: new URL(SITE_URL),

  /* Brand first, then the category. Keep under ~60 chars to avoid truncation.
     `template` adds the brand suffix to child page titles. */
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} — Custom Software Development Company`,
  },

  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },

  /* index/follow are defaults; the googleBot extras allow large image
     previews and uncapped snippets. */
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

  /* Use socialMetadata() rather than writing openGraph/twitter by hand; see
     lib/site.ts for the metadata merge gotcha. OG has no title template. */
  ...socialMetadata({
    title: `${SITE_NAME} — Custom Software, Web & Mobile Development`,
    description: SITE_DESCRIPTION,
    path: "/",
  }),
};

export const viewport: Viewport = {
  /* Single value, not media-scoped, since we ignore the system preference.
     ThemeToggle and the theme script update it for dark mode. */
  themeColor: "#ffffff",
  /* globals.css narrows this per active theme. */
  colorScheme: "dark light",
};

/**
 * Sets the theme before first paint. Must be inline and synchronous in <head>
 * to avoid a flash of the wrong theme; kept as a string so the build can't
 * defer or bundle it, and kept small since it blocks parsing.
 *
 * Light is the default; only a saved toggle choice overrides it. The OS
 * preference is ignored. To follow it instead:
 *
 *   var t=(s==="light"||s==="dark")?s
 *     :(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
 */
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem("theme");var t=(s==="dark")?"dark":"light";document.documentElement.dataset.theme=t;if(t==="dark"){var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content","#04050a");}}catch(e){document.documentElement.dataset.theme="light";}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      /* Indian English site, single language (not an hreflang setup). */
      lang="en-IN"
      /* Tells Next the smooth scroll in globals.css is intentional, so route
         changes jump instead of smooth-scrolling. */
      data-scroll-behavior="smooth"
      /* The theme script sets data-theme before hydration. */
      suppressHydrationWarning
      className={cn(inter.variable, mono.variable, geist.variable, "font-sans")}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="antialiased">
        <SmoothScroll />
        <CardSpotlight />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
