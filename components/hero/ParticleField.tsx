"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useTheme } from "@/lib/useTheme";
import { PALETTE, createParticleEngine, type Ink } from "./particleEngine";

/** Common interface for the worker and main-thread renderers (see particleEngine.ts). */
type Driver = {
  resize(width: number, height: number, dpr: number): void;
  setInk(ink: Ink): void;
  setIntensity(intensity: number): void;
  run(on: boolean): void;
  dispose(): void;
};

/**
 * Default path: draw in a worker via OffscreenCanvas so the main thread
 * doesn't run a rAF loop (which also forces style updates for every running
 * CSS animation each frame).
 *
 * `transferControlToOffscreen` can only be called once per canvas, and Strict
 * Mode mounts, cleans up and remounts on the same element. So workers are
 * keyed by canvas and termination is deferred a tick, letting a remount
 * reclaim the worker.
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

/** Fallback when OffscreenCanvas is unavailable. */
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
        // Reset the clock so points don't jump after a pause.
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
 * Drifting light points drawn on a canvas (cheaper than ~90 animated DOM
 * nodes).
 *
 * The loop pauses when the tab is hidden, the canvas is off screen, or its
 * scene is covered by the next one (see SceneCover). With reduced motion,
 * a single static frame is drawn.
 */
export function ParticleField({
  className,
  style,
  /** Scales the point count. */
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
  // Lets the mount effect read current values without re-running; theme and
  // intensity changes are sent to the running driver instead.
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

    // Debounced; mobile orientation changes fire many resize events.
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

    // Run only while visible.

    let onScreen = true;
    let sceneLit = true;
    const sync = () => driver.run(!document.hidden && onScreen && sceneLit);

    const observer = new IntersectionObserver(
      (entries) => {
        onScreen = entries[entries.length - 1].isIntersecting;
        sync();
      },
      // Start slightly before it enters the viewport.
      { rootMargin: "120px" },
    );
    observer.observe(canvas);

    // The hero stays in the viewport while the next section slides over it,
    // so also watch the scene's `data-scene-state` for "covered".
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

  // Theme change: recolour, keep the points.
  useEffect(() => {
    driverRef.current?.setInk(PALETTE[theme]);
  }, [theme]);

  // Intensity change: point count changes, so reseed.
  useEffect(() => {
    const driver = driverRef.current;
    if (!driver || appliedIntensity.current === intensity) return;
    appliedIntensity.current = intensity;
    driver.setIntensity(intensity);
    const { width, height, dpr } = sizeRef.current;
    if (width) driver.resize(width, height, dpr);
  }, [intensity]);

  return (
    // Fade-in is handled by the caller.
    <canvas ref={canvasRef} aria-hidden="true" className={className} style={style} />
  );
}
