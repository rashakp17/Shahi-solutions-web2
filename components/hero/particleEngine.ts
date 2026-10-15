/**
 * The particle field's simulation and drawing, with no DOM in it.
 *
 * Shared by the two places the field can run: a Web Worker drawing into an
 * OffscreenCanvas (the normal path — see particles.worker.ts), and the main
 * thread, as a fallback for browsers without OffscreenCanvas. Everything here
 * takes a 2D context and a tile factory rather than reaching for `document`,
 * which a worker does not have.
 */

export type Ink = { core: string; pale: string; halo: string };

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
export const PALETTE = {
  dark: { core: "138,178,255", pale: "232,238,252", halo: "109,155,255" },
  light: { core: "20,33,61", pale: "0,0,0", halo: "20,33,61" },
} as const satisfies Record<"dark" | "light", Ink>;

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
   for the halo. A sprite reduces the inner loop to one alpha write and
   one drawImage. The tiles are built once per size, and rebuilt only
   when the device pixel ratio or the palette actually changes.
   ------------------------------------------------------------------ */

/** Tile radius, CSS px. Points scale down from this, never up. */
const SPRITE_R = 12;
/** Fraction of the tile the solid core fills before the edge feather. */
const CORE_SOLID = 0.78;

type Ctx2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
type Tile = HTMLCanvasElement | OffscreenCanvas;
/** Makes a blank square tile of the given pixel size. */
export type TileFactory = (size: number) => Tile;

function makeSprite(
  newTile: TileFactory,
  dpr: number,
  paint: (g: Ctx2D, r: number) => void,
) {
  const tile = newTile(Math.ceil(SPRITE_R * 2 * dpr));
  const g = tile.getContext("2d") as Ctx2D | null;
  if (g) {
    // Origin at the tile centre, so the paint callbacks work in radii.
    g.setTransform(dpr, 0, 0, dpr, SPRITE_R * dpr, SPRITE_R * dpr);
    paint(g, SPRITE_R);
  }
  return tile;
}

/** A point: solid to `CORE_SOLID`, then a short feather standing in for AA. */
function makeDot(newTile: TileFactory, dpr: number, rgb: string) {
  return makeSprite(newTile, dpr, (g, r) => {
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
function makeHalo(newTile: TileFactory, dpr: number, rgb: string) {
  return makeSprite(newTile, dpr, (g, r) => {
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
 * One field. `resize` sizes the backing store and reseeds the points; `step`
 * advances and draws one frame; `paint` draws without advancing (the static
 * frame for reduced motion).
 */
export function createParticleEngine(
  canvas: Tile,
  ctx: Ctx2D,
  newTile: TileFactory,
) {
  let particles: Particle[] = [];
  let width = 0;
  let height = 0;
  let intensity = 1;
  let ink: Ink = PALETTE.light;
  let spriteKey = "";
  let blueDot: Tile | null = null;
  let paleDot: Tile | null = null;
  let haloDot: Tile | null = null;

  const sprites = (dpr: number) => {
    const key = `${dpr}|${ink.core}|${ink.pale}|${ink.halo}`;
    if (key === spriteKey) return;
    spriteKey = key;
    blueDot = makeDot(newTile, dpr, ink.core);
    paleDot = makeDot(newTile, dpr, ink.pale);
    haloDot = makeHalo(newTile, dpr, ink.halo);
  };

  let dprNow = 1;

  const resize = (w: number, h: number, dpr: number) => {
    width = w;
    height = h;
    dprNow = dpr;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sprites(dpr);

    const count = Math.round(
      Math.min(MAX_PARTICLES, Math.round(width * height * DENSITY)) * intensity,
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

  /** Advances by `dt` seconds (clamped by the caller) and draws. */
  const step = (dt: number, seconds: number) => {
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
  };

  return {
    resize,
    paint,
    step,
    setIntensity(v: number) {
      intensity = v;
    },
    /** New palette: rebuild the tiles in place, keep the points. */
    setInk(next: Ink) {
      ink = next;
      if (width) sprites(dprNow);
    },
  };
}
