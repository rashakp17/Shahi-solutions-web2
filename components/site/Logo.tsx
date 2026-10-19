import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/** Intrinsic size of the logo PNGs, so next/image reserves space. */
const ART = { w: 2201, h: 773 };

/**
 * Rendered width for `sizes`. Without it next/image serves a ~3840px image
 * for a ~114px box. 120px covers the sm:h-10 size; update if the height changes.
 */
const RENDERED_WIDTH = "120px";

/**
 * Wordmark linking home. Light and dark PNGs are both rendered and CSS shows
 * the one for the current theme, so there's no hydration flash.
 * Images use alt="" because the link's aria-label already names it.
 */
export function Logo({
  className,
  prefetch,
}: {
  className?: string;
  /** `false` when already on the home page (see Navbar). */
  prefetch?: false;
}) {
  return (
    <Link
      href="/"
      prefetch={prefetch}
      className={cn(
        // py-2 / -my-2 enlarges the tap target without changing layout.
        // w-fit stops the link stretching full width in the footer.
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
        sizes={RENDERED_WIDTH}
        // Above the fold on every route.
        priority
        className="logo-light h-9 w-auto sm:h-10"
      />
      <Image
        src="/brand/shahi-logo-dark.png"
        alt=""
        width={ART.w}
        height={ART.h}
        sizes={RENDERED_WIDTH}
        priority
        className="logo-dark h-9 w-auto sm:h-10"
      />
    </Link>
  );
}
