import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Intrinsic size of the artwork, after the white ground was unpremultiplied
 * into alpha and the canvas cropped to the ink. Passed to next/image so the
 * box is reserved before the file arrives and the bar never reflows around it.
 */
const ART = { w: 2201, h: 773 };

/**
 * The wordmark.
 *
 * Two files rather than one, and CSS picks between them.
 *
 * The supplied artwork is a navy lockup on an opaque white ground — the file
 * was 70% white by area — which is right for paper and unusable on a dark
 * page twice over: the white would print as a rectangle around the mark, and
 * the navy itself is barely off the ground it would be sitting on. So the
 * ground was removed into the alpha channel (coverage derived from distance
 * from white, which keeps the anti-aliased edges instead of leaving the halo
 * a hard threshold gives), and a second copy was recoloured for dark: the
 * wordmark to near-white, the accent "A" and "Solutions" to the house blue.
 * That split is the artwork's own — those two are a brighter blue than SHAHI
 * in the original, so the mark keeps its two-tone relationship rather than
 * flattening to one silhouette.
 *
 * Swapped in CSS rather than by reading the theme in JS, for the same reason
 * the theme toggle's icons are: both are in the markup the server sends, so
 * there is nothing to hydrate and the right one is up on the first paint.
 *
 * `alt=""` on both, deliberately. The link already carries the accessible
 * name; captioning the images too would announce the company twice.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        // py-2 with a matching negative margin: the artwork alone is under the
        // 24px minimum for a tap target on the shortest bar, and this grows
        // the hit area without the bar growing with it.
        // w-fit because `flex` makes the anchor block-level, so in the footer
        // — where it is not a flex child — it stretched the full column width
        // and clicking empty space navigated home.
        "group -my-2 flex w-fit items-center py-2 transition-opacity duration-300 hover:opacity-80",
        className,
      )}
      aria-label="Shahi Solutions — home"
    >
      <Image
        src="/brand/shahi-logo.png"
        alt=""
        width={ART.w}
        height={ART.h}
        // In the header on every route, so it is never worth lazy-loading —
        // that only buys a blank box where the wordmark should be.
        priority
        className="logo-light h-9 w-auto sm:h-10"
      />
      <Image
        src="/brand/shahi-logo-dark.png"
        alt=""
        width={ART.w}
        height={ART.h}
        priority
        className="logo-dark h-9 w-auto sm:h-10"
      />
    </Link>
  );
}
