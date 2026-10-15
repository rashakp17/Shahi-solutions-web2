import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';

/* ------------------------------------------------------------------
   The warp's WebGL half, with no DOM in it.

   Split out of WarpText.jsx so it can run in two places: a Web Worker
   drawing into an OffscreenCanvas (the normal path — see warp.worker.js)
   and the main thread, as the fallback where OffscreenCanvas is missing.
   The shader, the warp maths and the pointer lensing are exactly the
   React Bits originals; only where they run has changed.

   What stays on the main thread is the sentence's rasterisation, because
   it needs the DOM — a probe span to resolve the font, letter-spacing and
   line-height the page would actually use. It arrives here as an image.
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
export const warmShader = (gl, vertexSource, fragmentSource) =>
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

/**
 * One warp. `onFrame` schedules the next animation frame on whichever thread
 * this is running on; everything else is plain WebGL through ogl.
 *
 * @param {{
 *   canvas: HTMLCanvasElement | OffscreenCanvas,
 *   dpr: number,
 *   uniforms: Record<string, number>,
 *   reduceMotion: boolean,
 *   requestFrame: (cb: (t: number) => void) => number,
 *   cancelFrame: (id: number) => void,
 * }} options
 */
export function createWarpRenderer({ canvas, dpr, uniforms, reduceMotion, requestFrame, cancelFrame }) {
  const renderer = new Renderer({
    canvas,
    webgl: 2,
    alpha: true,
    premultipliedAlpha: false,
    antialias: true,
    dpr
  });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);

  let program;
  let mesh;
  let texture;
  let geometry;
  let ready = false;
  let hasImage = false;
  let running = false;
  let raf = 0;
  let lost = false;
  let motion = !reduceMotion;
  const startTime = performance.now();
  const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: 0, activeTarget: 0 };

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
        uResolution: { value: new Float32Array([gl.drawingBufferWidth || 1, gl.drawingBufferHeight || 1]) },
        uPointer: { value: new Float32Array([0.5, 0.5]) },
        uPointerActive: { value: 0 },
        uTime: { value: 0 },
        uWarpStrength: { value: uniforms.warpStrength },
        uWarpScale: { value: uniforms.warpScale },
        uSpeed: { value: uniforms.speed },
        uPointerInfluence: { value: uniforms.pointerInfluence },
        uPointerStrength: { value: uniforms.pointerStrength },
        uRefraction: { value: uniforms.refraction },
        uRipple: { value: uniforms.ripple ? 1 : 0 },
        uMotion: { value: motion ? 1 : 0 }
      }
    });
    mesh = new Mesh(gl, { geometry, program });
    ready = true;
  };

  const render = () => {
    if (!ready || !hasImage || lost) return;
    renderer.render({ scene: mesh });
  };

  const loop = now => {
    raf = 0;
    if (!running || !ready || lost) return;

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
    program.uniforms.uPointerActive.value = motion ? pointer.active : pointer.active * 0.35;
    program.uniforms.uTime.value = motion ? elapsed : 0;

    render();
    raf = requestFrame(loop);
  };

  const kick = () => {
    if (running && ready && !raf && !lost) raf = requestFrame(loop);
  };

  return {
    gl,
    /** Compile and link. Callers on the main thread warm the shader first. */
    build() {
      build();
      kick();
    },
    setSize(width, height, nextDpr) {
      renderer.dpr = nextDpr;
      renderer.setSize(width, height);
      if (program) {
        program.uniforms.uResolution.value[0] = gl.drawingBufferWidth;
        program.uniforms.uResolution.value[1] = gl.drawingBufferHeight;
      }
    },
    /** The rasterised sentence: a canvas on the main thread, an ImageBitmap in a worker. */
    setImage(image) {
      if (!ready) return;
      const previous = texture.image;
      texture.image = image;
      texture.needsUpdate = true;
      hasImage = true;
      render();
      if (previous && previous !== image && typeof previous.close === 'function') previous.close();
    },
    setUniforms(next) {
      if (!ready) return;
      const u = program.uniforms;
      u.uWarpStrength.value = next.warpStrength;
      u.uWarpScale.value = next.warpScale;
      u.uSpeed.value = next.speed;
      u.uPointerInfluence.value = next.pointerInfluence;
      u.uPointerStrength.value = next.pointerStrength;
      u.uRefraction.value = next.refraction;
      u.uRipple.value = next.ripple ? 1 : 0;
      render();
    },
    setMotion(on) {
      motion = on;
      if (program) program.uniforms.uMotion.value = on ? 1 : 0;
      render();
    },
    pointerMove(x, y) {
      pointer.tx = x;
      pointer.ty = y;
      pointer.activeTarget = 1;
    },
    pointerLeave() {
      pointer.activeTarget = 0;
    },
    run(on) {
      running = on;
      if (on) kick();
      else if (raf) {
        cancelFrame(raf);
        raf = 0;
      }
    },
    contextLost() {
      lost = true;
      if (raf) cancelFrame(raf);
      raf = 0;
    },
    dispose() {
      running = false;
      if (raf) cancelFrame(raf);
      raf = 0;
      if (lost) return;
      try {
        if (texture?.texture) gl.deleteTexture(texture.texture);
        geometry?.remove?.();
        program?.remove?.();
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      } catch {}
    }
  };
}

export { vertex, fragment };
