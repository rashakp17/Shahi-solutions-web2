'use client';

import { useEffect, useRef } from 'react';
import { createWarpRenderer, warmShader, vertex, fragment } from './warpGL';

/* ------------------------------------------------------------------
   React Bits "Warp Text", from the @react-bits registry.

   Upstream source, with the additions below. The shader, the warp
   maths, the pointer lensing and the render loop are exactly as
   shipped — they now live in warpGL.js, and normally run in a Web
   Worker (warp.worker.js) rather than on the main thread. What stays
   here is the sentence's rasterisation, which needs the DOM, and the
   decisions about size, visibility and the pointer.

     'use client'    required; this project is the App Router and the
                     whole component is a WebGL context in an effect.
     JSDoc types     the file is .jsx in a strict TS project. Without a
                     declared prop type, TS infers `color` as string
                     from its default and the build fails on the
                     gradient below.
     color as array  canvas has no equivalent of background-clip: text,
                     so one fillStyle is the only way to colour the
                     glyphs, and this section's design is a ramp. A
                     plain string behaves exactly as before.
     fitToContainer  false draws at the declared size and lets the
                     frame crop, instead of shrinking the sentence to
                     86% of the frame. Defaults to true, i.e. upstream.
   ------------------------------------------------------------------ */

const getFontValue = value => (typeof value === 'number' ? `${value}px` : value);

const measureLine = (ctx, line, letterSpacing) => {
  const chars = Array.from(line);
  const textWidth = chars.reduce((width, char) => width + ctx.measureText(char).width, 0);
  return textWidth + Math.max(0, chars.length - 1) * letterSpacing;
};

const drawLine = (ctx, line, x, y, letterSpacing) => {
  const chars = Array.from(line);
  let cursor = x - measureLine(ctx, line, letterSpacing) / 2;

  chars.forEach((char, index) => {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + (index === chars.length - 1 ? 0 : letterSpacing);
  });
};

/**
 * The fill for the glyphs. Built across the full canvas width rather than
 * across the drawn text, so the ramp is anchored to the frame the visitor is
 * looking at whatever the sentence happens to measure.
 */
const buildFill = (ctx, color, width) => {
  if (typeof color === 'string') return color;
  if (!color || color.length === 0) return '#ffffff';
  if (color.length === 1) return color[0];

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  color.forEach((stop, index) => gradient.addColorStop(index / (color.length - 1), stop));
  return gradient;
};

const buildTextCanvas = ({ container, width, height, dpr, props }) => {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(width * dpr));
  canvas.height = Math.max(1, Math.floor(height * dpr));

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const probe = document.createElement('span');
  probe.textContent = props.text;
  Object.assign(probe.style, {
    position: 'absolute',
    visibility: 'hidden',
    pointerEvents: 'none',
    whiteSpace: 'pre',
    inset: '0 auto auto 0',
    fontFamily: props.fontFamily,
    fontSize: getFontValue(props.fontSize),
    fontWeight: String(props.fontWeight),
    letterSpacing: getFontValue(props.letterSpacing),
    lineHeight: typeof props.lineHeight === 'number' ? String(props.lineHeight) : props.lineHeight
  });
  container.appendChild(probe);
  const computed = window.getComputedStyle(probe);
  let fontSizePx = parseFloat(computed.fontSize) || 96;
  const fontFamily = computed.fontFamily || 'sans-serif';
  const fontWeight = computed.fontWeight || String(props.fontWeight);
  let letterSpacing = computed.letterSpacing === 'normal' ? 0 : parseFloat(computed.letterSpacing) || 0;
  let lineHeight = parseFloat(computed.lineHeight);
  if (!Number.isFinite(lineHeight)) {
    lineHeight = fontSizePx * (typeof props.lineHeight === 'number' ? props.lineHeight : 0.92);
  }
  probe.remove();

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = buildFill(ctx, props.color, width);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const lines = String(props.text || '').split('\n');
  const applyFont = () => {
    ctx.font = `${fontWeight} ${fontSizePx}px ${fontFamily}`;
  };
  applyFont();

  const maxWidth = width * 0.86;
  const maxHeight = height * 0.78;
  const widest = Math.max(...lines.map(line => measureLine(ctx, line, letterSpacing)), 1);
  const blockHeight = Math.max(lineHeight * lines.length, 1);
  const fit = props.fitToContainer
    ? Math.min(1, maxWidth / widest, maxHeight / blockHeight)
    : 1;

  if (fit < 1) {
    fontSizePx *= fit;
    letterSpacing *= fit;
    lineHeight *= fit;
    applyFont();
  }

  const startY = height / 2 - (lineHeight * (lines.length - 1)) / 2;
  lines.forEach((line, index) => drawLine(ctx, line, width / 2, startY + index * lineHeight, letterSpacing));

  return canvas;
};

/**
 * @typedef {Object} WarpTextProps
 * @property {string} [text]
 * @property {string | string[]} [color] Flat colour, or stops for a
 *   left-to-right gradient across the frame.
 * @property {number} [warpStrength]
 * @property {number} [warpScale]
 * @property {number} [speed]
 * @property {number} [pointerInfluence]
 * @property {number} [pointerStrength]
 * @property {number} [refraction]
 * @property {boolean} [ripple]
 * @property {string | number} [fontSize]
 * @property {string | number} [fontWeight]
 * @property {string} [fontFamily]
 * @property {string | number} [letterSpacing]
 * @property {string | number} [lineHeight]
 * @property {boolean} [fitToContainer] False draws at the declared size and
 *   lets the frame crop, instead of shrinking the sentence to fit.
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */

const uniformsOf = props => ({
  warpStrength: props.warpStrength,
  warpScale: props.warpScale,
  speed: props.speed,
  pointerInfluence: props.pointerInfluence,
  pointerStrength: props.pointerStrength,
  refraction: props.refraction,
  ripple: props.ripple
});

const canUseWorker = () =>
  typeof Worker !== 'undefined' &&
  typeof OffscreenCanvas !== 'undefined' &&
  typeof createImageBitmap === 'function' &&
  'transferControlToOffscreen' in HTMLCanvasElement.prototype;

/**
 * The WebGL side in a worker — the normal path. Everything goes over
 * postMessage; the sentence goes over as an ImageBitmap, transferred.
 * `onFail` hands over to the main thread if the worker cannot get a context.
 */
function workerDriver(canvas, init, onFail) {
  const offscreen = canvas.transferControlToOffscreen();
  const worker = new Worker(new URL('./warp.worker.js', import.meta.url), { type: 'module' });
  let dead = false;

  worker.onmessage = event => {
    if (event.data?.type === 'failed' && !dead) {
      dead = true;
      worker.terminate();
      onFail();
    }
  };
  worker.postMessage({ type: 'init', canvas: offscreen, ...init }, [offscreen]);

  const post = (msg, transfer) => {
    if (!dead) worker.postMessage(msg, transfer || []);
  };

  return {
    setSize: (width, height, dpr) => post({ type: 'size', width, height, dpr }),
    setImage: source => {
      // Flipped and left unpremultiplied here, because WebGL ignores both
      // UNPACK_FLIP_Y and UNPACK_PREMULTIPLY_ALPHA for an ImageBitmap —
      // without this the sentence uploads upside down, and its anti-aliased
      // edges pick up a dark fringe the canvas path never had.
      createImageBitmap(source, { imageOrientation: 'flipY', premultiplyAlpha: 'none' }).then(
        image => (dead ? image.close() : post({ type: 'image', image }, [image])),
        () => {}
      );
    },
    setUniforms: uniforms => post({ type: 'uniforms', uniforms }),
    setMotion: on => post({ type: 'motion', on }),
    pointerMove: (x, y) => post({ type: 'pointer', x, y }),
    pointerLeave: () => post({ type: 'leave' }),
    run: on => post({ type: 'run', on }),
    dispose: () => {
      post({ type: 'dispose' });
      dead = true;
      // The worker closes itself after tearing the context down; this is
      // only the backstop if that message never lands.
      setTimeout(() => worker.terminate(), 1000);
    }
  };
}

/**
 * The fallback, where OffscreenCanvas is unavailable: the same renderer on
 * the main thread, with the shader warmed asynchronously first so its
 * compile cannot stall a scroll (see warmShader in warpGL.js).
 */
function mainThreadDriver(canvas, init) {
  const warp = createWarpRenderer({
    canvas,
    dpr: init.dpr,
    uniforms: init.uniforms,
    reduceMotion: init.reduceMotion,
    requestFrame: cb => requestAnimationFrame(cb),
    cancelFrame: id => cancelAnimationFrame(id)
  });
  let disposed = false;
  let pendingImage = null;
  let built = false;

  warp.setSize(init.width, init.height, init.dpr);
  warmShader(warp.gl, vertex, fragment).then(() => {
    if (disposed) return;
    warp.build();
    built = true;
    if (pendingImage) warp.setImage(pendingImage);
    pendingImage = null;
  });

  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    warp.contextLost();
  });

  return {
    setSize: (w, h, dpr) => warp.setSize(w, h, dpr),
    setImage: source => {
      if (built) warp.setImage(source);
      else pendingImage = source;
    },
    setUniforms: u => warp.setUniforms(u),
    setMotion: on => warp.setMotion(on),
    pointerMove: (x, y) => warp.pointerMove(x, y),
    pointerLeave: () => warp.pointerLeave(),
    run: on => warp.run(on),
    dispose: () => {
      disposed = true;
      warp.dispose();
    }
  };
}

/** @type {(props: WarpTextProps) => import('react').ReactElement} */
const WarpText = ({
  text = 'Bend the moment',
  color = '#f8f5ff',
  warpStrength = 0.08,
  warpScale = 1.7,
  speed = 0.55,
  pointerInfluence = 0.42,
  pointerStrength = 0.38,
  refraction = 0.018,
  ripple = true,
  fontSize = 'clamp(3rem, 10vw, 9rem)',
  fontWeight = 800,
  fontFamily = 'inherit',
  letterSpacing = '-0.06em',
  lineHeight = 0.9,
  fitToContainer = true,
  className = '',
  style
}) => {
  const containerRef = useRef(null);
  const propsRef = useRef({
    text,
    color,
    fontSize,
    fontWeight,
    fontFamily,
    letterSpacing,
    lineHeight,
    fitToContainer,
    warpStrength,
    warpScale,
    speed,
    pointerInfluence,
    pointerStrength,
    refraction,
    ripple
  });
  const contextRef = useRef(null);

  useEffect(() => {
    propsRef.current = {
      text,
      color,
      fontSize,
      fontWeight,
      fontFamily,
      letterSpacing,
      lineHeight,
      fitToContainer,
      warpStrength,
      warpScale,
      speed,
      pointerInfluence,
      pointerStrength,
      refraction,
      ripple
    };

    if (contextRef.current) {
      contextRef.current.driver?.setUniforms(uniformsOf(propsRef.current));
      contextRef.current.rasterize();
    }
  }, [
    text,
    color,
    fontSize,
    fontWeight,
    fontFamily,
    letterSpacing,
    lineHeight,
    fitToContainer,
    warpStrength,
    warpScale,
    speed,
    pointerInfluence,
    pointerStrength,
    refraction,
    ripple
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return undefined;

    let disposed = false;
    let visible = false;
    let pageVisible = !document.hidden;
    let rasterVersion = 0;
    let fontSettled = false;
    let sizeKey = '';
    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const reduceMotion = mediaQuery?.matches ?? false;

    const makeCanvas = () => {
      const c = document.createElement('canvas');
      Object.assign(c.style, {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        display: 'block'
      });
      c.setAttribute('aria-hidden', 'true');
      container.appendChild(c);
      return c;
    };

    const rect0 = container.getBoundingClientRect();
    const dpr0 = Math.min(window.devicePixelRatio || 1, 2);
    const init = {
      width: Math.max(rect0.width, 1),
      height: Math.max(rect0.height, 1),
      dpr: dpr0,
      uniforms: uniformsOf(propsRef.current),
      reduceMotion
    };

    let canvas = makeCanvas();
    let driver = null;

    const sync = () => driver?.run(visible && pageVisible);

    const draw = () => {
      if (!driver) return false;
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return false;
      driver.setImage(
        buildTextCanvas({
          container,
          width: rect.width,
          height: rect.height,
          dpr: Math.min(window.devicePixelRatio || 1, 2),
          props: propsRef.current
        })
      );
      return true;
    };

    /* Drawn twice on the first pass, and the second one is not belt-and-braces.

       `document.fonts.ready` resolves when no font load is *pending* — not
       when a particular face has arrived. The display face here is not
       preloaded (see the note in app/layout.tsx) and nothing else on the page
       asks for it, so at this point there is nothing pending and the wait
       returns instantly, against a font the browser has not fetched. Drawing
       there rasterises the sentence in the fallback, and since this is a
       canvas rather than text the swap-in never reaches it.

       The probe inside buildTextCanvas is what finally requests the face. So
       the first draw puts something correct-in-shape on screen immediately,
       and the second — awaited *after* the probe has made the request — lands
       once the real face is in. Only ever done once; a resize redraws in the
       font that is by then already loaded. */
    const rasterize = async () => {
      const version = ++rasterVersion;
      if (disposed) return;
      if (!draw()) return;
      if (fontSettled || !document.fonts?.ready) return;

      try {
        await document.fonts.ready;
      } catch {}
      if (disposed || version !== rasterVersion) return;

      fontSettled = true;
      draw();
    };

    // The observer reports the frame once on observe, at the size the
    // renderer was created at. An unchanged size is a no-op: re-rasterising
    // would redo the sentence and re-upload a full-frame texture for nothing,
    // and resetting a canvas's width, even to the same value, clears it.
    const resize = () => {
      if (disposed || !driver) return;
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const key = `${rect.width}x${rect.height}@${dpr}`;
      if (key === sizeKey) return;
      sizeKey = key;
      driver.setSize(rect.width, rect.height, dpr);
      rasterize();
    };

    const onPointerMove = event => {
      if (event.pointerType === 'touch' || !driver) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      driver.pointerMove(
        (event.clientX - rect.left) / rect.width,
        1 - (event.clientY - rect.top) / rect.height
      );
    };
    const onPointerLeave = () => driver?.pointerLeave();

    const bindPointer = () => {
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerleave', onPointerLeave);
    };

    // Only if the worker cannot get a context: a fresh canvas (the first was
    // transferred and cannot come back) and the main-thread renderer.
    const fallBack = () => {
      if (disposed) return;
      console.warn('WarpText: worker rendering unavailable, drawing on the main thread.');
      canvas.remove();
      canvas = makeCanvas();
      bindPointer();
      try {
        driver = mainThreadDriver(canvas, init);
      } catch (error) {
        console.warn('WarpText: WebGL could not be initialized.', error);
        driver = null;
        return;
      }
      sizeKey = `${init.width}x${init.height}@${dpr0}`;
      rasterize();
      sync();
    };

    try {
      driver = canUseWorker() ? workerDriver(canvas, init, fallBack) : mainThreadDriver(canvas, init);
    } catch (error) {
      console.warn('WarpText: WebGL could not be initialized.', error);
      canvas.remove();
      return undefined;
    }
    sizeKey = `${init.width}x${init.height}@${dpr0}`;
    bindPointer();

    const onVisibility = () => {
      pageVisible = !document.hidden;
      sync();
    };
    const onReducedMotion = event => driver?.setMotion(!event.matches);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(container);

    document.addEventListener('visibilitychange', onVisibility);
    mediaQuery?.addEventListener('change', onReducedMotion);

    contextRef.current = {
      get driver() {
        return driver;
      },
      rasterize
    };
    rasterize();

    return () => {
      disposed = true;
      contextRef.current = null;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      mediaQuery?.removeEventListener('change', onReducedMotion);
      driver?.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div ref={containerRef} className={`warp-text ${className}`.trim()} style={style} role="img" aria-label={text} />
  );
};

export default WarpText;
