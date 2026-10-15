/**
 * The warp's WebGL, off the main thread.
 *
 * Same reason as the particle field's worker: a render loop on the main
 * thread wakes it every frame, and every main-thread frame re-ticks every
 * running CSS animation on the page. Here the context, the shader compile
 * and the loop all live in the worker and commit straight to the
 * compositor — including the compile, which on the main thread was a
 * 100–230ms stall however carefully it was scheduled.
 *
 * The page still owns every decision (size, visibility, pointer) and the
 * sentence's rasterisation, and sends them here as messages.
 */
import { createWarpRenderer } from './warpGL';

const raf =
  typeof self.requestAnimationFrame === 'function'
    ? cb => self.requestAnimationFrame(cb)
    : cb => setTimeout(() => cb(performance.now()), 16);
const caf =
  typeof self.cancelAnimationFrame === 'function'
    ? id => self.cancelAnimationFrame(id)
    : id => clearTimeout(id);

let warp = null;

self.onmessage = event => {
  const msg = event.data;

  if (msg.type === 'init') {
    try {
      warp = createWarpRenderer({
        canvas: msg.canvas,
        dpr: msg.dpr,
        uniforms: msg.uniforms,
        reduceMotion: msg.reduceMotion,
        requestFrame: raf,
        cancelFrame: caf
      });
      msg.canvas.addEventListener?.('webglcontextlost', e => {
        e.preventDefault();
        warp?.contextLost();
      });
      warp.setSize(msg.width, msg.height, msg.dpr);
      warp.build();
      self.postMessage({ type: 'ready' });
    } catch (error) {
      self.postMessage({ type: 'failed', message: String(error) });
    }
    return;
  }

  if (!warp) return;

  switch (msg.type) {
    case 'size':
      warp.setSize(msg.width, msg.height, msg.dpr);
      break;
    case 'image':
      warp.setImage(msg.image);
      break;
    case 'uniforms':
      warp.setUniforms(msg.uniforms);
      break;
    case 'motion':
      warp.setMotion(msg.on);
      break;
    case 'pointer':
      warp.pointerMove(msg.x, msg.y);
      break;
    case 'leave':
      warp.pointerLeave();
      break;
    case 'run':
      warp.run(msg.on);
      break;
    case 'dispose':
      warp.dispose();
      warp = null;
      self.close();
      break;
  }
};
