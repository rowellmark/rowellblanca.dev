// Shared runtime helpers for the canvas arcade games.

/**
 * Size a canvas for the screen's pixel density and return a context that draws in logical
 * (CSS-sized) units. Games keep their fixed logical size (e.g. 660x360) while rendering
 * sharply on retina/high-DPI displays. Idempotent: only resizes when the density changed.
 */
export function prepareCanvas(canvas: HTMLCanvasElement, width: number, height: number): CanvasRenderingContext2D | null {
  const dpr = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
  const pw = Math.round(width * dpr);
  const ph = Math.round(height * dpr);
  if (canvas.width !== pw || canvas.height !== ph) {
    canvas.width = pw;
    canvas.height = ph;
  }
  const ctx = canvas.getContext('2d');
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

const STEP_MS = 1000 / 60;

/**
 * Drop-in replacement for requestAnimationFrame in the game loops: runs the callback at a
 * steady 60 updates per second whatever the display refresh rate. All games move things a
 * fixed amount per update, so on 120/144 Hz screens they used to run 2-2.4x too fast.
 */
export function createFrameStepper() {
  let rafId = 0;
  let last = 0;
  let acc = 0;
  let stopped = false;

  const request = (cb: () => void): number => {
    const tick = (now: number) => {
      if (stopped) return;
      if (!last) last = now - STEP_MS;
      acc = Math.min(acc + (now - last), STEP_MS * 3);
      last = now;
      if (acc >= STEP_MS - 0.5) {
        acc -= STEP_MS;
        cb();
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);
    return rafId;
  };

  const cancel = () => {
    stopped = true;
    cancelAnimationFrame(rafId);
  };

  return { request, cancel };
}

let sharedAudio: AudioContext | null = null;

/**
 * One AudioContext for every game sound. Creating a context per sound effect hits the
 * browser's limit after a few dozen effects and then the game goes silent.
 */
export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudio) {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return null;
    sharedAudio = new Ctor();
  }
  if (sharedAudio.state === 'suspended') void sharedAudio.resume();
  return sharedAudio;
}

/** Ticks a callback at most `hz` times a second — for React HUD state that changes every frame. */
export function throttle(hz: number) {
  let lastAt = 0;
  return (fn: () => void) => {
    const now = performance.now();
    if (now - lastAt >= 1000 / hz) {
      lastAt = now;
      fn();
    }
  };
}

function shade(hex: string, amount: number) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amount));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amount));
  const b = Math.max(0, Math.min(255, (n & 255) + amount));
  return `rgb(${r},${g},${b})`;
}

export interface CarLook {
  /** Body paint (hex). */
  color: string;
  /** Front points up (the default for the scrolling racers). */
  braking?: boolean;
  boosting?: boolean;
  /** Steering angle in radians; tilts the car slightly. */
  steer?: number;
  /** Large number painted on the engine cover. */
  number?: string | number;
}

/**
 * Top-down race car drawn with paths and gradients: drop shadow, tyres, shaded bodywork,
 * cockpit with halo, front/rear wings, headlights, brake lights and a nitro exhaust flame.
 * (x, y) is the top-left of a w x h box; the car faces up.
 */
export function drawRaceCar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, look: CarLook) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  ctx.save();
  ctx.translate(cx, cy);
  if (look.steer) ctx.rotate(look.steer);

  // Soft shadow offset towards the bottom-right (sun from top-left)
  ctx.fillStyle = 'rgba(0,0,0,0.38)';
  ctx.beginPath();
  ctx.ellipse(w * 0.08, h * 0.08, w * 0.52, h * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Exhaust flame under nitro
  if (look.boosting) {
    const len = h * (0.35 + Math.random() * 0.2);
    const flame = ctx.createLinearGradient(0, h / 2, 0, h / 2 + len);
    flame.addColorStop(0, 'rgba(255,255,255,0.95)');
    flame.addColorStop(0.25, 'rgba(56,189,248,0.9)');
    flame.addColorStop(1, 'rgba(56,189,248,0)');
    ctx.fillStyle = flame;
    for (const ox of [-w * 0.14, w * 0.14]) {
      ctx.beginPath();
      ctx.moveTo(ox - w * 0.07, h / 2 - 2);
      ctx.quadraticCurveTo(ox, h / 2 + len, ox + w * 0.07, h / 2 - 2);
      ctx.fill();
    }
  }

  // Tyres
  ctx.fillStyle = '#111';
  const tw = w * 0.2;
  const th = h * 0.2;
  for (const [tx, ty] of [
    [-w / 2, -h * 0.38],
    [w / 2 - tw, -h * 0.38],
    [-w / 2, h * 0.2],
    [w / 2 - tw, h * 0.2],
  ]) {
    ctx.beginPath();
    ctx.roundRect(tx, ty, tw, th, 3);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  for (const tx of [-w / 2 + 2, w / 2 - tw + 2]) ctx.fillRect(tx, -h * 0.36, 2, th - 4);

  // Bodywork: tapered nose, wide sidepods, rounded tail
  const body = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
  body.addColorStop(0, shade(look.color, -70));
  body.addColorStop(0.35, look.color);
  body.addColorStop(0.55, shade(look.color, 45));
  body.addColorStop(1, shade(look.color, -80));
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(0, -h / 2);
  ctx.bezierCurveTo(w * 0.18, -h / 2, w * 0.2, -h * 0.25, w * 0.34, -h * 0.12);
  ctx.lineTo(w * 0.38, h * 0.3);
  ctx.quadraticCurveTo(w * 0.36, h / 2, w * 0.18, h / 2);
  ctx.lineTo(-w * 0.18, h / 2);
  ctx.quadraticCurveTo(-w * 0.36, h / 2, -w * 0.38, h * 0.3);
  ctx.lineTo(-w * 0.34, -h * 0.12);
  ctx.bezierCurveTo(-w * 0.2, -h * 0.25, -w * 0.18, -h / 2, 0, -h / 2);
  ctx.fill();

  // Front and rear wings
  ctx.fillStyle = shade(look.color, -60);
  ctx.beginPath();
  ctx.roundRect(-w * 0.46, -h * 0.5, w * 0.92, h * 0.07, 2);
  ctx.roundRect(-w * 0.42, h * 0.43, w * 0.84, h * 0.08, 2);
  ctx.fill();

  // Racing stripe
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillRect(-w * 0.04, -h * 0.46, w * 0.08, h * 0.24);

  // Cockpit + halo
  const glass = ctx.createLinearGradient(0, -h * 0.12, 0, h * 0.16);
  glass.addColorStop(0, '#1e293b');
  glass.addColorStop(1, '#020617');
  ctx.fillStyle = glass;
  ctx.beginPath();
  ctx.ellipse(0, h * 0.02, w * 0.15, h * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(226,232,240,0.7)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(0, h * 0.02, w * 0.17, h * 0.17, 0, Math.PI * 1.05, Math.PI * 1.95);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.beginPath();
  ctx.ellipse(-w * 0.05, -h * 0.04, w * 0.04, h * 0.05, -0.5, 0, Math.PI * 2);
  ctx.fill();

  // Number on the engine cover
  if (look.number !== undefined) {
    ctx.fillStyle = '#fff';
    ctx.font = `800 ${Math.round(w * 0.3)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(look.number), 0, h * 0.3);
  }

  // Headlights
  ctx.fillStyle = '#fef9c3';
  for (const hx of [-w * 0.2, w * 0.2]) {
    ctx.beginPath();
    ctx.ellipse(hx, -h * 0.3, w * 0.05, h * 0.025, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Brake lights
  ctx.fillStyle = look.braking ? '#ff1f3d' : '#7f1d1d';
  if (look.braking) {
    ctx.shadowColor = '#ff1f3d';
    ctx.shadowBlur = 12;
  }
  for (const bx of [-w * 0.22, w * 0.14]) ctx.fillRect(bx, h * 0.45, w * 0.08, h * 0.035);
  ctx.shadowBlur = 0;

  ctx.restore();
}
