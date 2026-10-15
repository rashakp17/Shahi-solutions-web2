"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useTheme } from "@/lib/useTheme";
import { PALETTE, createParticleEngine, type Ink } from "./particleEngine";

/**
 * What the component needs from whichever thread is drawing. The simulation
 * itself lives in particleEngine.ts; this is only the remote control.
 */
type Driver = {
  resize(width: number, height: number, dpr: number): void;
  setInk(ink: Ink): void;
  setIntensity(intensity: number): void;
  run(on: boolean): void;
  dispose(): void;
};

/**
 * Drawn in a worker, the normal path.
 *
 * A main-thread rAF loop wakes the main thread sixty times a second, and each
 * of those frames re-ticks the style of every running CSS animation on the
 * page — measured on the hero at ~40x the idle style work of the page without
 * the loop. Transferred to an OffscreenCanvas, the field draws in its worker
 * and commits straight to the compositor; the main thread sleeps.
 *
 * `transferControlToOffscreen` can only ever be called once per canvas, and
 * React's development double-mount runs the effect, its cleanup and the
 * effect again on the same element. So the worker is keyed to the canvas and
 * its shutdown deferred by a tick: an immediate remount claims it back.
 */
const workers = new WeakMap<
  HTMLCanvasElement,
  { worker: Worker; kill?: ReturnType<typeof setTimeout> }
>();

function workerDriver(
  canvas: HTMLCanvasElement,
  init: { width: number; height: number; dpr: number; ink: Ink; intensity: number; reduceMotion: boolean },
): Driver {
  let entry = workers.get(canvas);

  if (entry) {
    clearTimeout(entry.kill);
    entry.kill = undefined;
    entry.worker.postMessage({ type: "intensity", intensity: init.intensity });
    entry.worker.postMessage({ type: "ink", ink: init.ink });
    entry.worker.postMessage({ type: "resize", width: init.width, height: init.height, dpr: init.dpr });
  } else {
    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker(new URL("./particles.worker.ts", import.meta.url), {
      type: "module",
    });
    worker.postMessage({ type: "init", canvas: offscreen, ...init }, [offscreen]);
    entry = { worker };
    workers.set(canvas, entry);
  }

  const { worker } = entry;
  const current = entry;

  return {
    resize: (width, height, dpr) => worker.postMessage({ type: "resize", width, height, dpr }),
    setInk: (ink) => worker.postMessage({ type: "ink", ink }),
    setIntensity: (intensity) => worker.postMessage({ type: "intensity", intensity }),
    run: (run) => worker.postMessage({ type: "run", run }),
    dispose: () => {
      worker.postMessage({ type: "run", run: false });
      current.kill = setTimeout(() => {
        worker.terminate();
        workers.delete(canvas);
      }, 0);
    },
  };
}

/** Drawn on the main thread — only where OffscreenCanvas is unavailable. */
function mainThreadDriver(
  canvas: HTMLCanvasElement,
  init: { width: number; height: number; dpr: number; ink: Ink; intensity: number; reduceMotion: boolean },
): Driver | null {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return null;

  const engine = createParticleEngine(canvas, ctx, (size) => {
    const tile = document.createElement("canvas");
    tile.width = tile.height = size;
    return tile;
  });
  engine.setIntensity(init.intensity);
  engine.setInk(init.ink);
  engine.resize(init.width, init.height, init.dpr);
  engine.paint(0);

  let frame = 0;
  let lastTime = 0;
  const step = (time: number) => {
    const dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    engine.step(dt, time / 1000);
    frame = requestAnimationFrame(step);
  };

  return {
    resize: (w, h, dpr) => {
      engine.resize(w, h, dpr);
      engine.paint(performance.now() / 1000);
    },
    setInk: (ink) => {
      engine.setInk(ink);
      if (!frame) engine.paint(performance.now() / 1000);
    },
    setIntensity: (v) => engine.setIntensity(v),
    run: (on) => {
      if (init.reduceMotion) return;
      if (on && !frame) {
        // Reset the clock, or the first frame back integrates the whole time
        // spent paused and every point jumps.
        lastTime = performance.now();
        frame = requestAnimationFrame(step);
      } else if (!on && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    dispose: () => {
      cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}

const canUseWorker = () =>
  typeof Worker !== "undefined" &&
  typeof OffscreenCanvas !== "undefined" &&
  "transferControlToOffscreen" in HTMLCanvasElement.prototype;

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
  const driverRef = useRef<Driver | null>(null);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const appliedIntensity = useRef(intensity);
  const theme = useTheme();
  // Read by the mount effect without making it re-run: a theme or intensity
  // change is a message to the running field, not a teardown of it.
  const latest = useRef({ ink: PALETTE[theme] as Ink, intensity });
  latest.current = { ink: PALETTE[theme], intensity };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      sizeRef.current = {
        width: rect.width,
        height: rect.height,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      };
      return sizeRef.current;
    };

    const init = { ...measure(), ...latest.current, reduceMotion };
    appliedIntensity.current = init.intensity;
    const driver = canUseWorker()
      ? workerDriver(canvas, init)
      : mainThreadDriver(canvas, init);
    if (!driver) return;
    driverRef.current = driver;

    // Rebuild on resize, debounced — orientation changes on mobile fire a lot.
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const { width, height, dpr } = measure();
        driver.resize(width, height, dpr);
      }, 180);
    };
    window.addEventListener("resize", onResize);

    if (reduceMotion) {
      return () => {
        clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);
        driver.dispose();
        driverRef.current = null;
      };
    }

    /* --- Run only when the field is actually being looked at --- */

    let onScreen = true;
    let sceneLit = true;
    const sync = () => driver.run(!document.hidden && onScreen && sceneLit);

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

    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      clearTimeout(resizeTimer);
      observer.disconnect();
      sceneWatcher?.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", sync);
      driver.dispose();
      driverRef.current = null;
    };
  }, []);

  // Theme: new tiles, same points.
  useEffect(() => {
    driverRef.current?.setInk(PALETTE[theme]);
  }, [theme]);

  // Intensity: a different point count, so the field is reseeded.
  useEffect(() => {
    const driver = driverRef.current;
    if (!driver || appliedIntensity.current === intensity) return;
    appliedIntensity.current = intensity;
    driver.setIntensity(intensity);
    const { width, height, dpr } = sizeRef.current;
    if (width) driver.resize(width, height, dpr);
  }, [intensity]);

  return (
    // The field is faded in by the caller; the drift itself never stops.
    <canvas ref={canvasRef} aria-hidden="true" className={className} style={style} />
  );
}
