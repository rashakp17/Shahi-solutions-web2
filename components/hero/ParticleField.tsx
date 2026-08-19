"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useTheme } from "@/lib/useTheme";

type Particle = {
  x: number;
  y: number;
  /** 0 = far and faint, 1 = near, larger and quicker. */
  depth: number;
  r: number;
  /** Drift velocity in px/second. */
  vx: number;
  vy: number;
  alpha: number;
  /** Lateral sway, so travel is never a straight vertical line. */
  swayAmp: number;
  swaySpeed: number;
  /** Independent fade cycle — each point breathes on its own period. */
  fadeSpeed: number;
  phase: number;
  blue: boolean;
};

const DENSITY = 1 / 8200; // particles per CSS pixel²
const MAX_PARTICLES = 170;

/* ------------------------------------------------------------------
   Sprites.

   Points are stamped from pre-rendered tiles rather than rebuilt as a
   path each frame. Per point per frame the old loop did: beginPath, arc,
   a template-literal `rgba(...)`, a CSS colour parse, fill — and again
   for the halo. At ~200 points across two fields that is ~500 path
   builds and ~500 colour parses every frame, all on the main thread.

   A sprite reduces the inner loop to one alpha write and one drawImage,
   which the compositor handles. The tiles are built once per size, and
   rebuilt only when the device pixel ratio actually changes.
   ------------------------------------------------------------------ */

/** Tile radius, CSS px. Points scale down from this, never up. */
const SPRITE_R = 12;
/** Fraction of the tile the solid core fills before the edge feather. */
const CORE_SOLID = 0.78;

/**
 * The field, in both lights.
 *
 * Canvas takes numbers, not custom properties, so this is the one palette in
 * the project that has to be written out twice rather than flipping on its
 * own. See lib/useTheme.ts.
 *
 * The light set is not the dark set darkened. On black these are points of
 * light and the pale one is the brightest — it is what a particle near the
 * front looks like. On white there is nothing brighter than the ground, so
 * the field becomes ink instead: the "pale" role, still meaning "the ones in
 * front", becomes the *darkest* of the three rather than the lightest, and
 * the halo stays a mid blue because a soft blue bloom is one of the few
 * additive effects that survives being put on paper.
 */
const PALETTE = {
  dark: { core: "138,178,255", pale: "232,238,252", halo: "109,155,255" },
  light: { core: "20,33,61", pale: "0,0,0", halo: "20,33,61" },
} as const;

function makeSprite(
  dpr: number,
  paint: (g: CanvasRenderingContext2D, r: number) => void,
) {
  const tile = document.createElement("canvas");
  tile.width = tile.height = Math.ceil(SPRITE_R * 2 * dpr);

  const g = tile.getContext("2d");
  if (g) {
    // Origin at the tile centre, so the paint callbacks work in radii.
    g.setTransform(dpr, 0, 0, dpr, SPRITE_R * dpr, SPRITE_R * dpr);
    paint(g, SPRITE_R);
  }

  return tile;
}

/** A point: solid to `CORE_SOLID`, then a short feather standing in for AA. */
function makeDot(dpr: number, rgb: string) {
  return makeSprite(dpr, (g, r) => {
    const grad = g.createRadialGradient(0, 0, 0, 0, 0, r);
    grad.addColorStop(0, `rgba(${rgb},1)`);
    grad.addColorStop(CORE_SOLID, `rgba(${rgb},1)`);
    grad.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grad;
    g.beginPath();
    g.arc(0, 0, r, 0, Math.PI * 2);
    g.fill();
  });
}

/** The halo on the nearest points — near-flat, so it reads as the old disc. */
function makeHalo(dpr: number, rgb: string) {
  return makeSprite(dpr, (g, r) => {
    const grad = g.createRadialGradient(0, 0, 0, 0, 0, r);
    grad.addColorStop(0, `rgba(${rgb},1)`);
    grad.addColorStop(0.6, `rgba(${rgb},0.94)`);
    grad.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grad;
    g.beginPath();
    g.arc(0, 0, r, 0, Math.PI * 2);
    g.fill();
  });
}

/**
 * Floating light points on a continuous, never-resolving drift.
 *
 * Three things keep the field from reading as one animation: every point sits
 * at its own depth (which drives size, speed and brightness together), every
 * point sways laterally on its own period, and every point fades in and out
 * on a third, unrelated period. The result is sparse motion that the eye
 * registers as atmosphere rather than as elements moving.
 *
 * Canvas rather than DOM nodes: ~90 animated elements would each need their
 * own layer.
 *
 * The loop only runs when there is something to see. It stops when the tab is
 * hidden, when the canvas scrolls out of the viewport, and when the scene it
 * belongs to has been covered by the next one (see SceneCover) — so the two
 * fields on the page are never both burning frames at once. A single static
 * frame is rendered when the visitor prefers reduced motion.
 */
export function ParticleField({
  className,
  style,
  /** Scales the point count. The second scene runs a thinner field. */
  intensity = 1,
}: {
  className?: string;
  style?: CSSProperties;
  intensity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const ink = PALETTE[theme];

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = 0;
    let spriteDpr = 0;
    let blueDot: HTMLCanvasElement | null = null;
    let paleDot: HTMLCanvasElement | null = null;
    let haloDot: HTMLCanvasElement | null = null;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Only on a genuine DPR change — dragging to a second monitor, not
      // every orientation flip. A theme change does not need testing for
      // here: it re-runs the whole effect, so these are rebuilt from a
      // spriteDpr of 0 on the way through.
      if (dpr !== spriteDpr) {
        spriteDpr = dpr;
        blueDot = makeDot(dpr, ink.core);
        paleDot = makeDot(dpr, ink.pale);
        haloDot = makeHalo(dpr, ink.halo);
      }

      const count = Math.round(
        Math.min(MAX_PARTICLES, Math.round(width * height * DENSITY)) *
          intensity,
      );

      particles = Array.from({ length: Math.max(count, 0) }, () => {
        // Cubed so most points sit far back and only a few come forward —
        // with a dense field this is what keeps it from reading as a
        // starfield: the great majority are barely there.
        const depth = Math.pow(Math.random(), 3);

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          depth,
          r: 0.3 + depth * 1.5,
          // A third drift sideways or downward instead of up, so the field
          // has no single direction of travel.
          vx: (Math.random() - 0.5) * (3 + depth * 7),
          vy:
            Math.random() < 0.32
              ? (Math.random() - 0.35) * (2 + depth * 5)
              : -(2 + depth * 11 + Math.random() * 3),
          alpha: 0.05 + depth * 0.4,
          swayAmp: 4 + Math.random() * 14,
          swaySpeed: 0.06 + Math.random() * 0.16,
          fadeSpeed: 0.1 + Math.random() * 0.35,
          phase: Math.random() * Math.PI * 2,
          blue: Math.random() > 0.45,
        };
      });
    };

    const paint = (seconds: number) => {
      ctx.clearRect(0, 0, width, height);
      if (!blueDot || !paleDot || !haloDot) return;

      for (const p of particles) {
        // Two unrelated periods: a slow fade cycle, plus the sway offset.
        const fade = 0.45 + 0.55 * Math.sin(p.phase + seconds * p.fadeSpeed);
        const a = fade > 0 ? p.alpha * fade : 0;
        if (a <= 0.002) continue;

        const x = p.x + Math.sin(p.phase + seconds * p.swaySpeed) * p.swayAmp;

        // A faint halo on the nearest points only — cheap sense of depth.
        if (p.depth > 0.55) {
          const hr = p.r * 3.6;
          ctx.globalAlpha = a * 0.07;
          ctx.drawImage(haloDot, x - hr, p.y - hr, hr * 2, hr * 2);
        }

        const dr = p.r / CORE_SOLID;
        ctx.globalAlpha = p.blue ? a : a * 0.72;
        ctx.drawImage(p.blue ? blueDot : paleDot, x - dr, p.y - dr, dr * 2, dr * 2);
      }

      ctx.globalAlpha = 1;
    };

    const step = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      const seconds = time / 1000;

      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Wrap on every edge — the field drifts in mixed directions, so it
        // would deplete from the bottom if only the top were handled.
        if (p.y < -14) {
          p.y = height + 14;
          p.x = Math.random() * width;
        } else if (p.y > height + 14) {
          p.y = -14;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
      }

      paint(seconds);
      frame = requestAnimationFrame(step);
    };

    /* --- Run only when the field is actually being looked at --- */

    let onScreen = true;
    let sceneLit = true;

    const stop = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const start = () => {
      if (frame) return;
      // Reset the clock, or the first frame back integrates the whole time
      // spent paused and every point jumps.
      lastTime = performance.now();
      frame = requestAnimationFrame(step);
    };

    const sync = () => {
      if (!document.hidden && onScreen && sceneLit) start();
      else stop();
    };

    build();

    if (reduceMotion) {
      paint(0);

      let staticResize: ReturnType<typeof setTimeout>;
      const onStaticResize = () => {
        clearTimeout(staticResize);
        staticResize = setTimeout(() => {
          build();
          paint(0);
        }, 180);
      };
      window.addEventListener("resize", onStaticResize);

      return () => {
        clearTimeout(staticResize);
        window.removeEventListener("resize", onStaticResize);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        onScreen = entries[entries.length - 1].isIntersecting;
        sync();
      },
      // A little margin so the field is already drifting by the time its
      // first pixel is on screen.
      { rootMargin: "120px" },
    );
    observer.observe(canvas);

    // The hero stays inside the viewport while the next section slides over
    // the top of it, so intersection alone never reports it as gone. The
    // pinned pane advertises when it has been covered instead.
    const scene = canvas.closest<HTMLElement>("[data-scene-state]");
    let sceneWatcher: MutationObserver | undefined;

    if (scene) {
      const readScene = () => {
        sceneLit = scene.dataset.sceneState !== "covered";
      };
      readScene();
      sceneWatcher = new MutationObserver(() => {
        readScene();
        sync();
      });
      sceneWatcher.observe(scene, {
        attributes: true,
        attributeFilter: ["data-scene-state"],
      });
    }

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    // Rebuild on resize, debounced — orientation changes on mobile fire a lot.
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 180);
    };
    window.addEventListener("resize", onResize);

    sync();

    return () => {
      stop();
      clearTimeout(resizeTimer);
      observer.disconnect();
      sceneWatcher?.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intensity, theme]);

  return (
    // The field is faded in by the caller; the drift itself never stops.
    <canvas ref={canvasRef} aria-hidden="true" className={className} style={style} />
  );
}
