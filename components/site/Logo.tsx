import Link from "next/link";
import { cn } from "@/lib/cn";

/** Wordmark + geometric glyph. Kept flat and small — no gradient logo. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        // py-2 -mp: the mark plus wordmark is only 23px tall, which is under the
        // 24px minimum for a tap target and well under what a thumb wants. The
        // padding grows the hit area and the negative margin gives the space
        // back, so the bar keeps its height.
        "group -my-2 flex items-center gap-2.5 py-2 transition-opacity duration-300 hover:opacity-80",
        className,
      )}
      aria-label="Shahi Solutions — home"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="1"
          y="1"
          width="20"
          height="20"
          rx="6"
          stroke="currentColor"
          className="text-accent-300/22 origin-center transition-all duration-700 ease-cinematic group-hover:rotate-45 group-hover:text-accent-400/45"
        />
        <path
          d="M7 14.2c1.1.9 2.3 1.3 3.7 1.3 1.9 0 3-.8 3-2 0-1.1-.8-1.6-2.6-2-2.5-.5-3.7-1.4-3.7-3.2C7.4 6.5 8.8 5.4 11 5.4c1.3 0 2.4.3 3.4 1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-accent-400 transition-colors duration-500 ease-cinematic group-hover:text-accent-200"
        />
      </svg>
      <span className="text-[15px] font-semibold tracking-[-0.02em] text-fg">
        Shahi<span className="text-fg/45"> Solutions</span>
      </span>
    </Link>
  );
}
