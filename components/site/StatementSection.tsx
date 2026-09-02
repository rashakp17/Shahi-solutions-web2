import { ThemedWarpText } from "@/components/site/ThemedWarpText";
import { ScrollScrub } from "@/components/ui/ScrollScrub";

/* ------------------------------------------------------------------
   Copy. All of it, in one place.
   ------------------------------------------------------------------ */

/**
 * The giant line, broken over two.
 *
 * The newline is the break — WarpText splits the string on it and rasterises
 * one line per part, each centred. Broken after "That" rather than after
 * "Move", so "Move Businesses Forward" stays intact: splitting a verb from its
 * object is the one place a two-line headline reads as an accident.
 *
 * Still not solved against the viewport. The crop is the composition, so the
 * copy is free to be any length and the only thing the window decides is how
 * much of the longer line you get.
 */
const PHRASE = "Building Ideas That\nMove Businesses Forward";

/**
 * Delays for the small content, in ms from the moment it is released, which
 * ScrollScrub does at 45% of the scrub — with the giant line part way up.
 *
 * Overlapping rather than sequential. Waiting for the typography to finish
 * completely leaves a hole in the middle of the section where nothing is
 * happening; coming in over its tail reads as one continuous arrival, which
 * is what the rest of the page does too.
 *
 * Only `eyebrow` is read. `note`, `stats` and `statStagger` are kept, unused,
 * and that is deliberate: the supporting block they timed — a line of copy and
 * three invented figures — has been removed (see the note in the markup
 * below). These are the numbers anything that replaces it would need in order
 * to arrive on the same clock as everything else here, and re-deriving them
 * later from the surrounding rhythm is harder than leaving them written down.
 */
const CONTENT = { eyebrow: 0, note: 140, stats: 380, statStagger: 90 } as const;

/**
 * The warp, at the component's own defaults.
 *
 * These are the React Bits values, unchanged — the glass lens that follows the
 * cursor, with its ambient undulation underneath. Nothing in this section
 * drives the animation: the component owns its loop, and it stops itself
 * whenever the section is off screen or the tab is hidden.
 *
 * The one thing this section has to get right is that the cursor can actually
 * reach the canvas. See the pointer-events notes in the markup below — the
 * effect is invisible without them, however the shader is tuned.
 */
const WARP = {
  strength: 0.08,
  scale: 1.7,
  speed: 0.55,
  pointerInfluence: 0.42,
  pointerStrength: 0.38,
  refraction: 0.018,
} as const;

/**
 * The fill for the giant line, left to right across the frame — the same ramp
 * the CSS version painted through the glyphs.
 *
 * Literal hex, not tokens: this goes into a canvas `fillStyle`, which resolves
 * neither custom properties nor `color-mix()`. The values are the existing
 * blue ramp read out by hand — accent-500, accent-300, a near-white through
 * the middle where the sentence is actually read, then down to a muted
 * blue-grey as it runs to the right edge.
 */
const GIANT_FILL = {
  dark: ["#4d84f5", "#8db3ff", "#eef2fb", "#5f7099", "#39435e"],
  /**
   * The same five stops, re-derived rather than inverted.
   *
   * The dark ramp runs blue → pale → near-white through the middle, because
   * on black the middle of the sentence — the part actually being read — has
   * to be the *brightest* thing in the gradient. On white the same role needs
   * the opposite: near-black through the middle, since contrast against the
   * ground is what legibility is made of, and there is nothing paler than the
   * page to reach for.
   *
   * The two ends stay blue and stay quieter than the centre, which is what
   * the effect is really about — a line that resolves as it reaches you and
   * falls back into the ground at both edges.
   */
  // The last two stops carry the fall-off, and they have to fall *toward* the
  // ground without reaching it. #E5E5E5 was the honest palette answer and the
  // wrong one in practice: it is the page, so the tail of "Forward" simply
  // disappeared. It went unnoticed while the line was cropped off the screen
  // anyway; once it fitted, the last word read as a rendering fault.
  //
  // These two are the navy walked most of the way to the grey — still clearly
  // receding, still clearly type.
  light: ["#14213D", "#14213D", "#000000", "#3d4a6b", "#8892a8"],
} as const;

export function StatementSection() {
  return (
    // span 1.0, down from 1.25: the scrub now completes exactly as the pane
    // pins, instead of a quarter-viewport later. The approach was spending
    // that quarter on an almost-empty screen.
    //
    // releaseAt 0.45, down from 0.62: the eyebrow and the stats are what fill
    // the top and bottom of this pane, and holding them back that long left it
    // a blank slab for most of the way in. At 0.45 the giant line is still well
    // ahead of them — it is released at 0.25 and takes a beat over a second —
    // so the typography establishes the scene first, just not into a vacuum.
    <ScrollScrub className="relative isolate bg-ink-950" span={1} releaseAt={0.45}>
      {/* 106svh, down from 112, 125 and originally 150. Everything past 100 is
          pinned dwell — the pane held on screen with nothing new happening —
          and the warp is a hover effect rather than a scroll-driven one, so it
          does not need scroll distance to play out. 6svh still registers as a
          held beat; much less and the pane starts leaving as it arrives. */}
      <section id="shipping" className="relative min-h-[68svh] sm:min-h-[106svh]">
        {/* Pinned for the length of the scrub, so the line arrives, holds the
            screen and settles, rather than sliding straight back off the top
            while it is still resolving.

            The crop lives here, and this is the only place it lives: the type
            is free to run as far past the left and right edges as it likes,
            none of it can reach the document and cause a sideways scroll, and
            the line's own mask is left to do nothing but the vertical reveal. */}
        {/* min-height below sm, fixed height above it.

              A fixed 62svh clips on short phones: the column needs roughly
              590px for the label, the line, the note and three stats, and
              62% of a 640px screen is 397. The pane has overflow-hidden, so
              what did not fit simply vanished — the stats were cut off with
              nothing to indicate it.

              As a minimum it still fills most of the screen on a tall phone
              and grows on a short one instead of hiding content. Above sm it
              is a fixed viewport again, because there the pane IS the scene
              and has to be exactly one screen for the pin to read. */}
        <div className="sticky top-0 min-h-[62svh] overflow-hidden sm:h-[100svh] sm:min-h-0">
          {/* Genuinely black. The typography is the only event in this
              section, so the ground stays out of its way — no particle field,
              no drifting marks, one static source of light behind the type. */}
          <div className="absolute inset-0 bg-[radial-gradient(125%_85%_at_50%_46%,var(--ground-4)_0%,var(--ground)_52%,var(--ground-deep)_100%)]" />
          <div className="atmo-glow absolute left-1/2 top-1/2 h-[38rem] w-[68rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(47,99,214,0.13)_0%,rgba(30,70,163,0.05)_45%,transparent_70%)] blur-[64px]" />
          {/* No mix-blend here, unlike the other sections. A blend mode needs
              its backdrop resolved before it can composite, which stops this
              pane from being flattened. At 2% over near-black the blend was
              buying nothing. */}
          <div className="bg-grain absolute inset-0 opacity-[0.025]" />

          {/* The join. The services section ends on the dark end of its own
              vignette and this one opens on the light middle of a radial, which
              put a visible horizontal step exactly where the two meet. Fading
              the top back to ink-950 hides it, and once the pane pins it is
              just a darker top edge for the navbar to sit against. */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950 to-transparent" />

          {/* ---------------- content over the layer ----------------

              pointer-events-none on the column, auto on the two blocks inside
              it. This column is h-full and sits at z-10, so as a solid box it
              covers the canvas completely and every pointermove lands here
              instead — the lens would only ever respond in the margins, which
              is indistinguishable from it not working at all.

              The blocks themselves take their events back, so the copy is
              still selectable; they sit at the top and bottom of the pane and
              the giant line runs through the middle, so they are not in its
              way. Nothing in here is interactive, so nothing else is lost. */}
          {/* The column is full-bleed now and the max-width sits on the two text
              blocks instead. It has to be: the giant line is a child of this
              column below sm, and a max-w-6xl parent would stop it running off
              the edges, which is the whole composition. */}
          {/* justify-center below sm, justify-between above it, where it used
              to be justify-between throughout.

              Below sm the giant line is a flex child, so this column held
              three of them — eyebrow, line, supporting block — and spreading
              them was what put the line in the middle of the pane. With the
              block gone, spreading two children pins the line to the bottom
              edge and opens a void under the eyebrow. Centring the pair keeps
              the composition the section is built on.

              Above sm the line is absolute and the eyebrow is the only child
              in flow, where justify-between and justify-start are the same
              thing — so the desktop pane is untouched, and centring there
              would have moved the eyebrow off the top. */}
          <div className="pointer-events-none relative z-10 flex h-full flex-col justify-center pb-[7svh] pt-24 sm:justify-between sm:py-24">
            <p
              className="anim-rise pointer-events-auto mx-auto w-full max-w-6xl px-5 font-mono text-[10px] uppercase tracking-[0.32em] text-fg/28 sm:px-8"
              style={{ animationDelay: `${CONTENT.eyebrow}ms` }}
            >
              How we ship
            </p>


          {/* ---------------- the typographic layer ----------------

              Emphatically NOT pointer-events-none, unlike every other
              decorative layer on this page. The warp is a cursor lens: the
              canvas has to receive pointermove or the shader never leaves its
              ambient idle, which is the whole effect missing. */}
          <div
            data-scrub-target=""
            // items-start with a top offset below sm, centred above it.
            //
            // Centring is the right instinct on a full-height pane and the
            // wrong one here. The supporting block at the bottom is 206px
            // tall, so pinning the line to the pane centre forces the eyebrow
            // roughly 220px clear of it whatever the pane height is — the gap
            // moves between the top of the pane and the middle of it, but it
            // cannot be removed. Placing the line a fixed distance below the
            // eyebrow instead lets the three parts sit at reading distance
            // from each other and the pane shrink to what they need.
            // In the flex flow below sm, absolute above it.
            //
            // It was absolute at every width, positioned by a fixed
            // pt-[8.5rem] on mobile. That could not hold: the pane is sized
            // in svh and the supporting block is anchored to its bottom, so
            // on any viewport short enough the fixed offset put the line
            // straight through the stats. A number cannot be right for every
            // screen height, and picking a safer one only moves the failure.
            //
            // As a flex child between the eyebrow and the block, it cannot
            // overlap either of them at any height — the layout does the
            // arithmetic. Above sm it goes back to spanning the pane, which
            // is what lets the line run off both edges.
            //
            // pointer-events-auto is not optional: this now sits inside the
            // pointer-events-none column and would otherwise inherit it,
            // leaving the warp on its ambient idle with the cursor lens
            // permanently dead.
            className="pointer-events-auto relative z-0 grid w-full items-center sm:absolute sm:inset-0"
          >
            <h2 className="sr-only">{PHRASE}</h2>

            {/* display: contents, so .giant-warp lands on the component's own
                container rather than on a box wrapped around it — the frame
                height has to be on the element the canvas measures. aria-hidden
                still covers the subtree, keeping the component's own role="img"
                from announcing the phrase a second time. */}
            <div aria-hidden="true" className="contents">
              <ThemedWarpText
                className="giant-warp"
                text={PHRASE}
                warpStrength={WARP.strength}
                warpScale={WARP.scale}
                speed={WARP.speed}
                pointerInfluence={WARP.pointerInfluence}
                pointerStrength={WARP.pointerStrength}
                refraction={WARP.refraction}
                ripple
                // The line is meant to run off both edges, so it must not be
                // shrunk to fit the frame.
                fitToContainer={false}
                colors={GIANT_FILL}
                // The component measures a probe span with exactly these
                // styles; the family is inherited from .giant-warp.
                //
                // 7.9vw, up from 5.2. Two lines halves the longest run of
                // characters — 23 now against 42 before — so at the old size
                // the type would have stopped running off the edges and the
                // composition would have quietly become a normal centred
                // heading. This holds the longer line at roughly 106% of the
                // viewport, which is the same crop as before at a little over
                // half again the size.
                fontFamily="inherit"
                // The floor, not the vw term, is what has to be right here.
                //
                // 7.9vw holds the longest line at ~90% of the screen at every
                // width it actually governs. But `clamp` stops honouring it
                // below 648px, and from there down the line is locked at
                // 3.2rem while the screen keeps shrinking: 155% of a 375px
                // phone, 182% of a 320px one. The crop IS the composition in
                // this section, but a crop that eats 27% off each side stops
                // being a composition and starts eating the words — "Move
                // Businesses Forward" arrived on a phone as "ve Businesses
                // Forw".
                //
                // 1.95rem puts the same line back at 111%/94%/90% across
                // 320/375/414, so it still bleeds off the edges on the
                // smallest screens and reads everywhere. Nothing at or above
                // 648px changes at all — the floor never applied there.
                fontSize="clamp(1.95rem, 7.9vw, 12rem)"
                fontWeight={600}
                letterSpacing="-0.05em"
                lineHeight={1.05}
              />
            </div>
          </div>

            {/* ── The supporting block that used to close this pane is gone ──

                A note in the masked-reveal rig read "Staged rollouts and
                automatic rollback.", and a <dl> of three figures stood beside
                it: "99.99% Release success", "0 Manual rollbacks", "24/7
                Automated recovery".

                The figures went first, and the reason is worth keeping: they
                were placeholders that had been shipping as fact, and every
                honest replacement is something only the business can measure.
                An unverifiable superlative is precisely what E-E-A-T
                assessment and every AI answer engine discount a commercial
                page for, so "99.99% release success" with nothing behind it
                was worth less than silence.

                The note followed, at the owner's direction. It named a
                deployment practice rather than the section's subject, and once
                the figures were gone it was a lone footnote under a line that
                does not need one.

                To put something back: a flex row at max-w-6xl, here, below the
                typographic layer. `note`, `stats` and `statStagger` are all
                still in the CONTENT object above, so a new block can arrive on
                the same clock as the eyebrow without re-deriving the rhythm. */}
          </div>
        </div>
      </section>
    </ScrollScrub>
  );
}
