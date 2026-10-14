'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';

/* ------------------------------------------------------------------
   React Bits "Warp Text", from the @react-bits registry.

   Upstream source, with three additions and nothing else. The shader,
   the warp maths, the pointer lensing and the render loop are exactly
   as shipped.

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

const vertex = `#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;

uniform sampler2D uTextTexture;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform float uTime;
uniform float uWarpStrength;
uniform float uWarpScale;
uniform float uSpeed;
uniform float uPointerInfluence;
uniform float uPointerStrength;
uniform float uRefraction;
uniform float uRipple;
uniform float uMotion;

in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.02;
    amplitude *= 0.5;
  }
  return value;
}

vec4 sampleText(vec2 uv) {
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    return vec4(0.0);
  }
  return texture(uTextTexture, uv);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float time = uTime * uSpeed;
  float scale = max(uWarpScale, 0.001);

  vec2 drift = vec2(time * 0.055, -time * 0.045);
  float n1 = fbm(uv * scale * 3.1 + drift);
  float n2 = fbm((uv + 19.17) * scale * 3.4 - drift.yx);
  vec2 ambient = (vec2(n1, n2) - 0.5) * uWarpStrength * 0.045 * uMotion;

  vec2 pointerDelta = uv - uPointer;
  vec2 aspectDelta = vec2(pointerDelta.x * aspect, pointerDelta.y);
  float dist = length(aspectDelta);
  float radius = max(uPointerInfluence, 0.001);
  float t = clamp(dist / radius, 0.0, 1.0);
  float lens = smoothstep(radius, 0.0, dist) * uPointerActive;
  float bulge = t * (1.0 - t) * (1.0 - t) * 6.75 * uPointerActive;
  vec2 dir = dist > 0.0001 ? vec2(aspectDelta.x / aspect, aspectDelta.y) / dist : vec2(0.0);

  float rippleWave = sin(dist * 28.0 - time * 4.2) * 0.5 + 0.5;
  float rippleRing = (rippleWave - 0.5) * uRipple;
  vec2 pointerWarp = -dir * bulge * uPointerStrength * 0.045;
  pointerWarp += dir * rippleRing * bulge * uPointerStrength * 0.016;

  vec2 displaced = uv + ambient + pointerWarp;
  vec2 splitDir = ambient + pointerWarp;
  float splitLen = length(splitDir);
  splitDir = splitLen > 0.00001 ? splitDir / splitLen : vec2(0.7071, 0.7071);
  vec2 split = splitDir * uRefraction * 0.16 * (0.35 + lens * 1.65);

  vec4 base = sampleText(displaced);
  float r = sampleText(displaced + split).r;
  float g = base.g;
  float b = sampleText(displaced - split).b;
  float a = max(max(sampleText(displaced + split).a, base.a), sampleText(displaced - split).a);

  vec3 color = vec3(r, g, b) + lens * base.a * 0.055;
  fragColor = vec4(color, a);
}
`;

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
 * Compiles and links the shader pair off the main thread, and resolves once
 * the GPU process has finished.
 *
 * ogl's Program compiles and then immediately asks for the info log and the
 * link status, and either query blocks the main thread until the driver is
 * done. For this fragment shader that measured ~100–230ms in one task, and it
 * lands mid-scroll, because the component is mounted on approach.
 *
 * With KHR_parallel_shader_compile the same compile runs while the page keeps
 * scrolling, polled through COMPLETION_STATUS_KHR, which never blocks. The
 * program is then thrown away: what is kept is the GPU process's program
 * cache, keyed on the source, so the Program built afterwards from identical
 * source links from cache instead of from scratch. Without the extension this
 * resolves at once and the component behaves exactly as before.
 */
const warmShader = (gl, vertexSource, fragmentSource) =>
  new Promise(resolve => {
    const ext = gl.getExtension('KHR_parallel_shader_compile');
    if (!ext) {
      resolve();
      return;
    }

    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    const prog = gl.createProgram();
    gl.shaderSource(vs, vertexSource);
    gl.shaderSource(fs, fragmentSource);
    gl.compileShader(vs);
    gl.compileShader(fs);
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    const started = performance.now();
    const poll = () => {
      const done =
        gl.isContextLost() ||
        gl.getProgramParameter(prog, ext.COMPLETION_STATUS_KHR) ||
        performance.now() - started > 3000;

      if (!done) {
        // setTimeout rather than rAF, so a backgrounded tab still finishes.
        setTimeout(poll, 24);
        return;
      }

      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      resolve();
    };
    poll();
  });

const syncUniforms = (program, props) => {
  const uniforms = program.uniforms;
  uniforms.uWarpStrength.value = props.warpStrength;
  uniforms.uWarpScale.value = props.warpScale;
  uniforms.uSpeed.value = props.speed;
  uniforms.uPointerInfluence.value = props.pointerInfluence;
  uniforms.uPointerStrength.value = props.pointerStrength;
  uniforms.uRefraction.value = props.refraction;
  uniforms.uRipple.value = props.ripple ? 1 : 0;
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
      syncUniforms(contextRef.current.program, propsRef.current);
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

    let renderer;
    let gl;
    let program;
    let geometry;
    let mesh;
    let texture;
    let resizeObserver;
    let intersectionObserver;
    let raf = 0;
    let disposed = false;
    let contextLost = false;
    let visible = true;
    let pageVisible = !document.hidden;
    let reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let rasterVersion = 0;
    let fontSettled = false;
    let sizeKey = '';

    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: 0, activeTarget: 0 };
    const startTime = performance.now();

    try {
      renderer = new Renderer({
        webgl: 2,
        alpha: true,
        premultipliedAlpha: false,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 2)
      });
      gl = renderer.gl;
    } catch (error) {
      console.warn('WarpText: WebGL could not be initialized.', error);
      return undefined;
    }

    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(canvas);

    // Everything that needs the compiled program, run once warmShader is done.
    const build = () => {
      texture = new Texture(gl, {
        generateMipmaps: false,
        minFilter: gl.LINEAR,
        magFilter: gl.LINEAR,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE
      });
  
      geometry = new Triangle(gl);
      program = new Program(gl, {
        vertex,
        fragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTextTexture: { value: texture },
          uResolution: { value: new Float32Array([1, 1]) },
          uPointer: { value: new Float32Array([0.5, 0.5]) },
          uPointerActive: { value: 0 },
          uTime: { value: 0 },
          uWarpStrength: { value: propsRef.current.warpStrength },
          uWarpScale: { value: propsRef.current.warpScale },
          uSpeed: { value: propsRef.current.speed },
          uPointerInfluence: { value: propsRef.current.pointerInfluence },
          uPointerStrength: { value: propsRef.current.pointerStrength },
          uRefraction: { value: propsRef.current.refraction },
          uRipple: { value: propsRef.current.ripple ? 1 : 0 },
          uMotion: { value: reduceMotion ? 0 : 1 }
        }
      });
      mesh = new Mesh(gl, { geometry, program });
    };

    const renderOnce = () => {
      if (disposed || contextLost) return;
      renderer.render({ scene: mesh });
    };

    const draw = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return false;

      texture.image = buildTextCanvas({
        container,
        width: rect.width,
        height: rect.height,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        props: propsRef.current
      });
      texture.needsUpdate = true;
      renderOnce();
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
      if (disposed || contextLost) return;
      if (!draw()) return;
      if (fontSettled || !document.fonts?.ready) return;

      try {
        await document.fonts.ready;
      } catch {}
      if (disposed || contextLost || version !== rasterVersion) return;

      fontSettled = true;
      draw();
    };

    const resize = () => {
      if (disposed || contextLost) return;
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      // The observer reports the frame once on observe, at the size start()
      // has just drawn at. Re-rasterising then would redo the sentence and
      // re-upload a full-frame texture for nothing — so an unchanged size is
      // a no-op. (setSize itself is skipped too: resetting a canvas's width,
      // even to the same value, clears what is on it.)
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const key = `${rect.width}x${rect.height}@${dpr}`;
      if (key === sizeKey) return;
      sizeKey = key;

      renderer.dpr = dpr;
      renderer.setSize(rect.width, rect.height);
      program.uniforms.uResolution.value[0] = gl.drawingBufferWidth;
      program.uniforms.uResolution.value[1] = gl.drawingBufferHeight;
      rasterize();
    };

    const onPointerMove = event => {
      if (event.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointer.tx = (event.clientX - rect.left) / rect.width;
      pointer.ty = 1 - (event.clientY - rect.top) / rect.height;
      pointer.activeTarget = 1;
    };

    const onPointerLeave = () => {
      pointer.activeTarget = 0;
    };

    const onContextLost = event => {
      event.preventDefault();
      contextLost = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible && visible && !raf) raf = requestAnimationFrame(loop);
      if (!pageVisible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const onReducedMotion = event => {
      reduceMotion = event.matches;
      program.uniforms.uMotion.value = reduceMotion ? 0 : 1;
      renderOnce();
    };

    const loop = now => {
      if (disposed || contextLost) return;

      const elapsed = (now - startTime) * 0.001;
      const idleX = 0.5 + Math.sin(elapsed * 0.33) * 0.12;
      const idleY = 0.5 + Math.cos(elapsed * 0.27) * 0.1;
      const targetX = pointer.activeTarget > 0 ? pointer.tx : idleX;
      const targetY = pointer.activeTarget > 0 ? pointer.ty : idleY;
      const damping = pointer.activeTarget > 0 ? 0.12 : 0.035;

      pointer.x += (targetX - pointer.x) * damping;
      pointer.y += (targetY - pointer.y) * damping;
      pointer.active += ((pointer.activeTarget > 0 ? 1 : 0.18) - pointer.active) * 0.06;

      program.uniforms.uPointer.value[0] = pointer.x;
      program.uniforms.uPointer.value[1] = pointer.y;
      program.uniforms.uPointerActive.value = reduceMotion ? pointer.active * 0.35 : pointer.active;
      program.uniforms.uTime.value = reduceMotion ? 0 : elapsed;

      renderOnce();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible && pageVisible && !raf) raf = requestAnimationFrame(loop);
          if (!visible && raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        },
        { threshold: 0 }
      );
      intersectionObserver.observe(container);

      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerleave', onPointerLeave);
      canvas.addEventListener('webglcontextlost', onContextLost, false);
      document.addEventListener('visibilitychange', onVisibility);
      mediaQuery?.addEventListener('change', onReducedMotion);

      syncUniforms(program, propsRef.current);
      contextRef.current = { program, rasterize };
      resize();
      raf = requestAnimationFrame(loop);
    };

    // build() and start() in separate frames: the program link and texture
    // setup in one, the sentence's rasterisation and first draw in the next,
    // so neither lands in a single long task in the middle of a scroll.
    warmShader(gl, vertex, fragment).then(() => {
      if (disposed || contextLost) return;
      build();
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (disposed || contextLost) return;
        start();
      });
    });

    return () => {
      disposed = true;
      contextRef.current = null;
      if (raf) cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      document.removeEventListener('visibilitychange', onVisibility);
      mediaQuery?.removeEventListener('change', onReducedMotion);

      if (!contextLost) {
        try {
          if (texture?.texture) gl.deleteTexture(texture.texture);
          geometry?.remove?.();
          program?.remove?.();
          gl.getExtension('WEBGL_lose_context')?.loseContext();
        } catch {}
      }

      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, []);

  return (
    <div ref={containerRef} className={`warp-text ${className}`.trim()} style={style} role="img" aria-label={text} />
  );
};

export default WarpText;
