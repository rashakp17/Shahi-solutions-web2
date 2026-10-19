/// <reference lib="webworker" />
/**
 * Draws the particle field into an OffscreenCanvas off the main thread. A
 * main-thread rAF loop would force style updates for every running CSS
 * animation each frame.
 *
 * The page decides when to run (visibility, scene state) and sends `run`.
 */
import { createParticleEngine, type Ink } from "./particleEngine";

type Message =
  | {
      type: "init";
      canvas: OffscreenCanvas;
      width: number;
      height: number;
      dpr: number;
      ink: Ink;
      intensity: number;
      reduceMotion: boolean;
    }
  | { type: "resize"; width: number; height: number; dpr: number }
  | { type: "ink"; ink: Ink }
  | { type: "intensity"; intensity: number }
  | { type: "run"; run: boolean };

const scope = self as unknown as DedicatedWorkerGlobalScope;

// Worker rAF where supported (Chromium, Firefox), else a ~60Hz timer.
const nextFrame: (cb: (t: number) => void) => number =
  typeof scope.requestAnimationFrame === "function"
    ? (cb) => scope.requestAnimationFrame(cb)
    : (cb) => setTimeout(() => cb(performance.now()), 16) as unknown as number;
const cancelFrame: (id: number) => void =
  typeof scope.cancelAnimationFrame === "function"
    ? (id) => scope.cancelAnimationFrame(id)
    : (id) => clearTimeout(id);

let engine: ReturnType<typeof createParticleEngine> | null = null;
let reduceMotion = false;
let running = false;
let frame = 0;
let lastTime = 0;

const loop = (time: number) => {
  if (!running || !engine) {
    frame = 0;
    return;
  }
  const dt = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;
  engine.step(dt, time / 1000);
  frame = nextFrame(loop);
};

const setRunning = (run: boolean) => {
  running = run && !reduceMotion;
  if (running && !frame) {
    // Reset the clock so points don't jump after a pause.
    lastTime = performance.now();
    frame = nextFrame(loop);
  } else if (!running && frame) {
    cancelFrame(frame);
    frame = 0;
  }
};

scope.onmessage = (event: MessageEvent<Message>) => {
  const msg = event.data;

  switch (msg.type) {
    case "init": {
      const ctx = msg.canvas.getContext("2d", { alpha: true });
      if (!ctx) return;
      reduceMotion = msg.reduceMotion;
      engine = createParticleEngine(msg.canvas, ctx, (size) => new OffscreenCanvas(size, size));
      engine.setIntensity(msg.intensity);
      engine.setInk(msg.ink);
      engine.resize(msg.width, msg.height, msg.dpr);
      engine.paint(0);
      break;
    }
    case "resize":
      engine?.resize(msg.width, msg.height, msg.dpr);
      engine?.paint(performance.now() / 1000);
      break;
    case "ink":
      engine?.setInk(msg.ink);
      if (!running) engine?.paint(performance.now() / 1000);
      break;
    case "intensity":
      engine?.setIntensity(msg.intensity);
      break;
    case "run":
      setRunning(msg.run);
      break;
  }
};
