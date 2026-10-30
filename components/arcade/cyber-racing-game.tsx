'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Rocket,
  Zap,
  Play,
  RotateCcw,
  Trophy,
  Volume2,
  VolumeX,
  Bot,
  Users,
  Sparkles,
  Award,
  ChevronRight,
  Flame,
  Gauge,
  Flag,
} from 'lucide-react';
import { ContactModal } from '@/components/ui/contact-modal';
import { createFrameStepper, drawRaceCar, getAudioContext, prepareCanvas, throttle } from './engine';

type RaceMode = 'ai' | 'local';
type AiDifficulty = 'rookie' | 'pro' | 'master';

interface Racer {
  id: string;
  name: string;
  x: number; // Screen x of the car's centre
  vx: number; // Sideways velocity (grip model)
  steer: number; // Visual steering angle (radians)
  speed: number;
  maxSpeed: number;
  nitro: number; // 0 to 100
  isBoosting: boolean;
  isBraking: boolean;
  boostTimer: number; // AI: frames of nitro left in the current burst
  laneTarget: number; // AI: preferred offset from the road centre
  spin: number; // Frames of wobble left after hitting oil
  color: string;
  distance: number;
  lap: number;
  rank: number;
  isAi: boolean;
}

interface TrackObstacle {
  d: number; // Track distance
  offset: number; // From the road centre
  width: number;
  height: number;
  type: 'battery' | 'glitch';
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
  kind: 'spark' | 'smoke' | 'dirt';
}

const TOTAL_LAPS = 3;
const LAP_DISTANCE = 8000; // in units

const VIEW_W = 660;
const VIEW_H = 360;
const CAR_W = 30;
const CAR_H = 54;
const CAR_BASE_Y = VIEW_H - 70; // Screen y of the camera car's centre
const TRACK_SCALE = 0.7; // Pixels per track unit
const ROAD_HALF = 200;
const KERB_W = 10;
const ASPHALT = ['#2b2f36', '#2d3138', '#292d33', '#2c3037'];

/** The circuit bends left and right; this is the road centre's x at a given track distance. */
function roadCenter(d: number) {
  return VIEW_W / 2 + Math.sin(d / 1100) * 46 + Math.sin(d / 430 + 1.3) * 18;
}

export function CyberRacingGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winnerName, setWinnerName] = useState<string | null>(null);
  const [raceMode, setRaceMode] = useState<RaceMode>('ai');
  const [aiDifficulty, setAiDifficulty] = useState<AiDifficulty>('pro');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [p1AutoPilot, setP1AutoPilot] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);

  // HUD state displays
  const [p1SpeedDisplay, setP1SpeedDisplay] = useState(0);
  const [p1NitroDisplay, setP1NitroDisplay] = useState(100);
  const [p1LapDisplay, setP1LapDisplay] = useState(1);
  const [p1RankDisplay, setP1RankDisplay] = useState(1);

  const [p2SpeedDisplay, setP2SpeedDisplay] = useState(0);
  const [p2NitroDisplay, setP2NitroDisplay] = useState(100);
  const [p2LapDisplay, setP2LapDisplay] = useState(1);
  const [p2RankDisplay, setP2RankDisplay] = useState(2);

  // Audio synthesizer helper (Self-contained Web Audio API)
  const playSound = useCallback(
    (type: 'boost' | 'crash' | 'pickup' | 'lap' | 'win' | 'beep' | 'go') => {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;

        if (type === 'boost') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(960, now + 0.3);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
        } else if (type === 'crash') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.linearRampToValueAtTime(50, now + 0.25);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (type === 'pickup') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587, now);
          osc.frequency.setValueAtTime(880, now + 0.08);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.18);
        } else if (type === 'lap') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523, now);
          osc.frequency.setValueAtTime(659, now + 0.1);
          osc.frequency.setValueAtTime(783, now + 0.2);
          osc.frequency.setValueAtTime(1046, now + 0.3);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.45);
          osc.start(now);
          osc.stop(now + 0.45);
        } else if (type === 'beep' || type === 'go') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(type === 'go' ? 880 : 440, now);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.linearRampToValueAtTime(0.001, now + (type === 'go' ? 0.5 : 0.2));
          osc.start(now);
          osc.stop(now + 0.5);
        } else if (type === 'win') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.setValueAtTime(554, now + 0.12);
          osc.frequency.setValueAtTime(659, now + 0.24);
          osc.frequency.setValueAtTime(880, now + 0.36);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
          osc.start(now);
          osc.stop(now + 0.6);
        }
      } catch (e) {}
    },
    [soundEnabled]
  );

  // Internal Game State
  const gameStateRef = useRef<{
    racers: Racer[];
    items: TrackObstacle[];
    sparks: Spark[];
    countdown: number; // Frames until the lights go out; negative while "GO!" shows
    keys: {
      a: boolean;
      d: boolean;
      w: boolean;
      s: boolean;
      left: boolean;
      right: boolean;
      up: boolean;
      down: boolean;
    };
    animationId: number;
  }>({
    racers: [],
    items: [],
    sparks: [],
    countdown: 0,
    keys: {
      a: false,
      d: false,
      w: false,
      s: false,
      left: false,
      right: false,
      up: false,
      down: false,
    },
    animationId: 0,
  });

  const startRace = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setWinnerName(null);
    setP1LapDisplay(1);
    setP2LapDisplay(1);
    setP1RankDisplay(1);
    setP2RankDisplay(2);

    // Starting grid: two rows, players at the back
    const grid = (name: string, color: string, distance: number, lane: number, maxSpeed: number, isAi: boolean, id: string): Racer => ({
      id,
      name,
      x: roadCenter(distance) + lane * ROAD_HALF,
      vx: 0,
      steer: 0,
      speed: 0,
      maxSpeed,
      nitro: 100,
      isBoosting: false,
      isBraking: false,
      boostTimer: 0,
      laneTarget: lane * ROAD_HALF,
      spin: 0,
      color,
      distance,
      lap: 1,
      rank: 1,
      isAi,
    });
    const rivalPace = aiDifficulty === 'master' ? 11.8 : aiDifficulty === 'pro' ? 11.3 : 10.7;

    gameStateRef.current.racers = [
      grid('Player 1 (Cyan)', '#0ea5e9', 0, -0.35, 11.5, false, 'p1'),
      grid(raceMode === 'ai' ? 'AI Rival (Amber)' : 'Player 2 (Amber)', '#f59e0b', 0, 0.35, raceMode === 'ai' ? rivalPace : 11.5, raceMode === 'ai', 'p2'),
      grid('AI Phantom (Purple)', '#8b5cf6', 110, -0.35, 11.0, true, 'drone1'),
      grid('AI Demon (Crimson)', '#e11d48', 110, 0.35, 11.2, true, 'drone2'),
    ];
    gameStateRef.current.items = [];
    gameStateRef.current.sparks = [];
    gameStateRef.current.countdown = 180;
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = gameStateRef.current.keys;
      if (['KeyA', 'a', 'A'].includes(e.key) || e.code === 'KeyA') k.a = true;
      if (['KeyD', 'd', 'D'].includes(e.key) || e.code === 'KeyD') k.d = true;
      if (['KeyW', 'w', 'W'].includes(e.key) || e.code === 'KeyW') k.w = true;
      if (['KeyS', 's', 'S'].includes(e.key) || e.code === 'KeyS') k.s = true;

      if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') k.left = true;
      if (e.key === 'ArrowRight' || e.code === 'ArrowRight') k.right = true;
      if (e.key === 'ArrowUp' || e.code === 'ArrowUp') k.up = true;
      if (e.key === 'ArrowDown' || e.code === 'ArrowDown') k.down = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = gameStateRef.current.keys;
      if (['KeyA', 'a', 'A'].includes(e.key) || e.code === 'KeyA') k.a = false;
      if (['KeyD', 'd', 'D'].includes(e.key) || e.code === 'KeyD') k.d = false;
      if (['KeyW', 'w', 'W'].includes(e.key) || e.code === 'KeyW') k.w = false;
      if (['KeyS', 's', 'S'].includes(e.key) || e.code === 'KeyS') k.s = false;

      if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') k.left = false;
      if (e.key === 'ArrowRight' || e.code === 'ArrowRight') k.right = false;
      if (e.key === 'ArrowUp' || e.code === 'ArrowUp') k.up = false;
      if (e.key === 'ArrowDown' || e.code === 'ArrowDown') k.down = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = prepareCanvas(canvas, VIEW_W, VIEW_H);
    if (!ctx) return;

    let isRunning = true;
    const stepper = createFrameStepper();
    const hud = throttle(10);
    let bumpSoundCooldown = 0;
    let lastLights = -1;

    // Engine note: a filtered sawtooth plus a sub-octave rumble whose pitch follows P1's speed.
    let engine: { osc: OscillatorNode; sub: OscillatorNode; gain: GainNode } | null = null;
    const audio = soundEnabled ? getAudioContext() : null;
    if (audio) {
      const osc = audio.createOscillator();
      const sub = audio.createOscillator();
      const filter = audio.createBiquadFilter();
      const gain = audio.createGain();
      osc.type = 'sawtooth';
      sub.type = 'square';
      filter.type = 'lowpass';
      filter.frequency.value = 700;
      gain.gain.value = 0.025;
      osc.connect(filter);
      sub.connect(filter);
      filter.connect(gain);
      gain.connect(audio.destination);
      osc.start();
      sub.start();
      engine = { osc, sub, gain };
    }

    const width = VIEW_W;
    const height = VIEW_H;
    const carCenterY = (r: Racer, cam: number) => CAR_BASE_Y - (r.distance - cam) * TRACK_SCALE;
    const worldAt = (y: number, cam: number) => cam + (CAR_BASE_Y - y) / TRACK_SCALE;
    const screenYOf = (d: number, cam: number) => CAR_BASE_Y - (d - cam) * TRACK_SCALE;

    const drawTrack = (cam: number) => {
      const strip = 4;
      for (let y = -strip; y < height + strip; y += strip) {
        const d = worldAt(y, cam);
        const c = roadCenter(d);
        const left = c - ROAD_HALF;
        const right = c + ROAD_HALF;

        // Mowed grass bands
        ctx.fillStyle = Math.floor(d / 140) % 2 === 0 ? '#1d5c34' : '#216a3b';
        ctx.fillRect(0, y, width, strip);

        // Asphalt with a little scrolling grain
        ctx.fillStyle = ASPHALT[Math.abs(Math.floor(d / 9)) % ASPHALT.length];
        ctx.fillRect(left, y, ROAD_HALF * 2, strip);

        // Red/white kerbs
        ctx.fillStyle = Math.floor(d / 36) % 2 === 0 ? '#dc2626' : '#f1f5f9';
        ctx.fillRect(left - KERB_W, y, KERB_W, strip);
        ctx.fillRect(right, y, KERB_W, strip);

        // White edge lines
        ctx.fillStyle = 'rgba(241,245,249,0.75)';
        ctx.fillRect(left + 5, y, 2, strip);
        ctx.fillRect(right - 7, y, 2, strip);

        // Lane dashes
        if (Math.floor(d / 55) % 2 === 0) {
          ctx.fillStyle = 'rgba(241,245,249,0.55)';
          ctx.fillRect(c - ROAD_HALF / 3 - 1.5, y, 3, strip);
          ctx.fillRect(c + ROAD_HALF / 3 - 1.5, y, 3, strip);
        }
      }

      // Start/finish line (and each lap line) as a checkered band
      for (let lap = 0; lap <= TOTAL_LAPS; lap++) {
        const y = screenYOf(lap * LAP_DISTANCE - CAR_H / 2 / TRACK_SCALE, cam);
        if (y < -20 || y > height + 20) continue;
        const c = roadCenter(lap * LAP_DISTANCE);
        const sq = 9;
        for (let row = 0; row < 2; row++) {
          for (let x = c - ROAD_HALF, i = 0; x < c + ROAD_HALF; x += sq, i++) {
            ctx.fillStyle = (i + row) % 2 === 0 ? '#f8fafc' : '#0f172a';
            ctx.fillRect(x, y + row * sq, Math.min(sq, c + ROAD_HALF - x), sq);
          }
        }
      }
    };

    const drawItem = (item: TrackObstacle, x: number, y: number) => {
      if (item.type === 'battery') {
        // Green boost pad with chevrons
        ctx.fillStyle = 'rgba(16,185,129,0.25)';
        ctx.beginPath();
        ctx.roundRect(x - item.width / 2, y - item.height / 2, item.width, item.height, 5);
        ctx.fill();
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        for (let i = 0; i < 2; i++) {
          const cy = y + 4 - i * 9;
          ctx.beginPath();
          ctx.moveTo(x - 9, cy + 4);
          ctx.lineTo(x, cy - 3);
          ctx.lineTo(x + 9, cy + 4);
          ctx.stroke();
        }
        ctx.lineCap = 'butt';
      } else {
        // Oil slick with a faint rainbow sheen
        ctx.fillStyle = 'rgba(2,6,23,0.85)';
        ctx.beginPath();
        ctx.ellipse(x, y, item.width / 2, item.height / 2, 0.3, 0, Math.PI * 2);
        ctx.ellipse(x + 10, y + 4, item.width / 3, item.height / 3, -0.4, 0, Math.PI * 2);
        ctx.fill();
        const sheen = ctx.createLinearGradient(x - 14, y - 6, x + 14, y + 6);
        sheen.addColorStop(0, 'rgba(168,85,247,0.35)');
        sheen.addColorStop(0.5, 'rgba(56,189,248,0.3)');
        sheen.addColorStop(1, 'rgba(250,204,21,0.25)');
        ctx.fillStyle = sheen;
        ctx.beginPath();
        ctx.ellipse(x - 4, y - 2, item.width / 4, item.height / 5, 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawStartLights = (countdown: number) => {
      const lit = countdown > 0 ? 3 - Math.ceil(countdown / 60) + 1 : 0;
      const go = countdown <= 0;
      const boxW = 132;
      const x0 = width / 2 - boxW / 2;
      ctx.fillStyle = 'rgba(2,6,23,0.85)';
      ctx.beginPath();
      ctx.roundRect(x0, 22, boxW, 44, 10);
      ctx.fill();
      for (let i = 0; i < 3; i++) {
        const on = go || i < lit;
        const color = go ? '#22c55e' : '#ef4444';
        ctx.fillStyle = on ? color : '#1e293b';
        if (on) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 16;
        }
        ctx.beginPath();
        ctx.arc(x0 + 30 + i * 36, 44, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      if (go) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 30px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GO!', width / 2, 108);
      }
    };

    /** Lateral grip model: input builds sideways velocity, grip bleeds it off, so steering has weight. */
    const drive = (r: Racer, input: { steer: number; boost: boolean; brake: boolean }, limit: number) => {
      const c = roadCenter(r.distance);
      const offRoad = Math.abs(r.x - c) > ROAD_HALF + KERB_W - CAR_W / 4;

      if (input.boost && r.nitro > 0) {
        r.isBoosting = true;
        r.nitro = Math.max(0, r.nitro - 0.7);
        r.speed = Math.min(limit * 1.35, r.speed + 0.28);
      } else {
        r.isBoosting = false;
        if (input.brake) r.speed = Math.max(2, r.speed - 0.32);
        else if (r.speed < limit) r.speed += 0.16 * (1 - r.speed / limit) + 0.012;
        else r.speed = Math.max(limit, r.speed - 0.06);
      }
      r.isBraking = input.brake;
      if (offRoad) r.speed = Math.max(4, r.speed * 0.982);

      const authority = 0.5 + 0.5 * Math.min(1, r.speed / 8);
      const grip = offRoad ? 0.9 : 0.82;
      r.vx = r.vx * grip + input.steer * 0.9 * authority;
      if (r.spin > 0) {
        r.spin--;
        r.vx += Math.sin(r.spin * 0.5) * 0.9;
      }
      r.x += r.vx;
      r.steer = r.vx * 0.045 + (r.spin > 0 ? Math.sin(r.spin * 0.35) * 0.5 : 0);

      const minX = CAR_W / 2 + 4;
      const maxX = width - CAR_W / 2 - 4;
      if (r.x < minX || r.x > maxX) {
        r.x = Math.max(minX, Math.min(maxX, r.x));
        r.vx = 0;
        r.speed *= 0.96;
      }
      return offRoad;
    };

    /** Racing line for AI: grab boost pads, dodge oil and slower cars, follow the bends. */
    const aiInput = (r: Racer, boostChance: number) => {
      const { items, racers } = gameStateRef.current;
      const ahead = (d: number) => d > r.distance && d < r.distance + 280;
      const pad = items.find((it) => it.type === 'battery' && ahead(it.d));
      const oil = items.find((it) => it.type === 'glitch' && ahead(it.d) && Math.abs(it.offset - r.laneTarget) < 46);
      if (pad) r.laneTarget = pad.offset;
      else if (oil) r.laneTarget = oil.offset > 0 ? oil.offset - 110 : oil.offset + 110;

      const blocker = racers.find(
        (o) => o !== r && o.distance > r.distance && o.distance - r.distance < 110 && Math.abs(o.x - r.x) < CAR_W + 4
      );
      if (blocker && blocker.speed < r.speed + 0.5) r.laneTarget = blocker.x - roadCenter(blocker.distance) > 0 ? -ROAD_HALF * 0.55 : ROAD_HALF * 0.55;

      if (Math.random() < 0.004) r.laneTarget = [-0.55, 0, 0.55][Math.floor(Math.random() * 3)] * ROAD_HALF;
      r.laneTarget = Math.max(-ROAD_HALF + 30, Math.min(ROAD_HALF - 30, r.laneTarget));

      const aimX = roadCenter(r.distance + 60) + r.laneTarget;
      const steer = Math.max(-1, Math.min(1, (aimX - r.x - r.vx * 4) / 30));

      if (r.boostTimer > 0) r.boostTimer--;
      else if (r.nitro > 30 && Math.random() < boostChance) r.boostTimer = 45;
      return { steer, boost: r.boostTimer > 0, brake: false };
    };

    const loop = () => {
      if (!isRunning) return;

      const state = gameStateRef.current;
      const { racers, items, sparks, keys } = state;
      const p1 = racers[0];
      const p2 = racers[1];
      // Camera follows P1, or in 2-player mode keeps both players in view (leader wins if they can't both fit)
      let cam = p1.distance;
      if (raceMode === 'local') {
        const lead = Math.max(p1.distance, p2.distance);
        const trail = Math.min(p1.distance, p2.distance);
        const lo = lead - (CAR_BASE_Y - 60) / TRACK_SCALE;
        const hi = trail + (height - 58 - CAR_BASE_Y) / TRACK_SCALE;
        cam = Math.max(lo, Math.min(hi, (p1.distance + p2.distance) / 2));
      }
      const racing = state.countdown <= 0;

      // 1. Track
      drawTrack(cam);

      // 2. Spawn boost pads and oil slicks just beyond the top of the screen
      if (racing && Math.random() < 0.022 && items.length < 6) {
        const type = Math.random() < 0.6 ? 'battery' : 'glitch';
        items.push({
          d: worldAt(-40, cam),
          offset: (Math.random() * 2 - 1) * (ROAD_HALF - 40),
          width: type === 'battery' ? 34 : 40,
          height: type === 'battery' ? 26 : 22,
          type,
        });
      }

      // 3. Items: draw, collect, despawn
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        const ix = roadCenter(item.d) + item.offset;
        const iy = screenYOf(item.d, cam);
        if (iy > height + 40) {
          items.splice(i, 1);
          continue;
        }
        drawItem(item, ix, iy);

        const hitBy = racers.find(
          (r) =>
            Math.abs(r.x - ix) < (item.width + CAR_W) / 2 - 4 &&
            Math.abs(carCenterY(r, cam) - iy) < (item.height + CAR_H) / 2 - 6
        );
        if (!hitBy) continue;
        const human = hitBy === p1 || (hitBy === p2 && !p2.isAi);
        if (item.type === 'battery') {
          hitBy.nitro = Math.min(100, hitBy.nitro + 35);
          hitBy.speed = Math.min(hitBy.maxSpeed * 1.3, hitBy.speed + 2.5);
          if (human) playSound('pickup');
        } else {
          hitBy.speed = Math.max(3, hitBy.speed - 3.5);
          hitBy.nitro = Math.max(0, hitBy.nitro - 15);
          hitBy.spin = 36;
          if (human) playSound('crash');
        }
        items.splice(i, 1);
      }

      // 4. Controls
      const boostChance = aiDifficulty === 'master' ? 0.02 : aiDifficulty === 'pro' ? 0.012 : 0.005;
      const humanInput = (left: boolean, right: boolean, boost: boolean, brake: boolean) => ({
        steer: (right ? 1 : 0) - (left ? 1 : 0),
        boost,
        brake,
      });
      const inputs = racers.map((r, idx) => {
        if (idx === 0) return p1AutoPilot ? aiInput(r, 0.01) : humanInput(keys.a, keys.d, keys.w, keys.s);
        if (idx === 1 && raceMode === 'local') return humanInput(keys.left, keys.right, keys.up, keys.down);
        return aiInput(r, idx === 1 ? boostChance : 0.009);
      });

      // 5. Physics
      if (racing) {
        racers.forEach((r, idx) => {
          // AI pace adapts to the gap so the pack stays close (rubber-banding), as in real arcade racers
          const gap = p1.distance - r.distance;
          const limit = r.isAi ? r.maxSpeed * (1 + Math.max(-0.1, Math.min(0.14, gap / 1800))) : r.maxSpeed;
          const offRoad = drive(r, inputs[idx], limit);

          r.distance += r.speed;
          const currentLap = Math.min(TOTAL_LAPS, Math.floor(r.distance / LAP_DISTANCE) + 1);
          if (currentLap > r.lap) {
            r.lap = currentLap;
            if (idx === 0 || (idx === 1 && !r.isAi)) playSound('lap');
          }

          const cy = carCenterY(r, cam);
          const rearY = cy + CAR_H / 2 - 4;
          const scrubbing = (inputs[idx].brake && r.speed > 5) || Math.abs(r.vx) > 3.6 || r.spin > 0;
          if ((scrubbing || offRoad) && sparks.length < 160 && Math.random() < 0.6) {
            for (const side of [-1, 1]) {
              sparks.push({
                x: r.x + side * CAR_W * 0.38,
                y: rearY,
                vx: (Math.random() - 0.5) * 0.8,
                vy: r.speed * TRACK_SCALE * 0.55,
                life: offRoad ? 20 : 32,
                color: offRoad ? '#4d3b22' : '#cbd5e1',
                size: offRoad ? 3 : 5,
                kind: offRoad ? 'dirt' : 'smoke',
              });
            }
          }
        });

        // Contact between cars: side-by-side shove, rear-end loses speed
        for (let i = 0; i < racers.length; i++) {
          for (let j = i + 1; j < racers.length; j++) {
            const a = racers[i];
            const b = racers[j];
            const dy = (a.distance - b.distance) * TRACK_SCALE;
            const dx = a.x - b.x;
            if (Math.abs(dy) >= CAR_H * 0.9 || Math.abs(dx) >= CAR_W * 0.95) continue;

            const push = (CAR_W * 0.95 - Math.abs(dx)) / 2 + 0.5;
            const dir = dx === 0 ? 1 : Math.sign(dx);
            a.x += dir * push;
            b.x -= dir * push;
            a.vx += dir * 0.8;
            b.vx -= dir * 0.8;

            if (Math.abs(dx) < CAR_W * 0.6) {
              const [front, back] = a.distance > b.distance ? [a, b] : [b, a];
              back.speed = Math.min(back.speed, front.speed * 0.96);
              back.distance = Math.min(back.distance, front.distance - (CAR_H * 0.9) / TRACK_SCALE);
            }
            if (sparks.length < 160) {
              for (let s = 0; s < 4; s++) {
                sparks.push({
                  x: (a.x + b.x) / 2,
                  y: (carCenterY(a, cam) + carCenterY(b, cam)) / 2,
                  vx: (Math.random() - 0.5) * 7,
                  vy: (Math.random() - 0.5) * 7,
                  life: 14,
                  color: '#fbbf24',
                  size: 2,
                  kind: 'spark',
                });
              }
            }
            if (bumpSoundCooldown <= 0 && (i <= 1 || j <= 1)) {
              playSound('crash');
              bumpSoundCooldown = 20;
            }
          }
        }
      } else {
        // Waiting on the lights: engines rev, cars stay on the grid
        state.countdown--;
        const lights = Math.ceil(state.countdown / 60);
        if (lights !== lastLights) {
          lastLights = lights;
          playSound(state.countdown > 0 ? 'beep' : 'go');
        }
      }
      if (state.countdown <= 0 && state.countdown > -50) state.countdown--;
      if (bumpSoundCooldown > 0) bumpSoundCooldown--;

      // 6. Rankings
      [...racers].sort((a, b) => b.distance - a.distance).forEach((r, i) => (r.rank = i + 1));

      // 7. Smoke, dirt and sparks
      for (let s = sparks.length - 1; s >= 0; s--) {
        const p = sparks[s];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.kind === 'smoke') {
          const t = p.life / 32;
          ctx.fillStyle = `rgba(203,213,225,${0.32 * t})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + (1 - t) * 9, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
        if (p.life <= 0) sparks.splice(s, 1);
      }

      // 8. Cars; anyone off screen gets a distance marker along the edge (drawn last, on top)
      const offscreen: Racer[] = [];
      racers.forEach((r, idx) => {
        const cy = carCenterY(r, cam);
        if (cy < -CAR_H / 2 || cy > height + CAR_H / 2) {
          offscreen.push(r);
          return;
        }
        drawRaceCar(ctx, r.x - CAR_W / 2, cy - CAR_H / 2, CAR_W, CAR_H, {
          color: r.color,
          boosting: r.isBoosting,
          braking: r.isBraking,
          steer: r.steer,
          number: idx + 1,
        });
        ctx.fillStyle = 'rgba(2,6,23,0.75)';
        ctx.beginPath();
        ctx.roundRect(r.x - 12, cy - CAR_H / 2 - 17, 24, 13, 4);
        ctx.fill();
        ctx.fillStyle = r.rank === 1 ? '#fbbf24' : '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`P${r.rank}`, r.x, cy - CAR_H / 2 - 7);
      });

      const placed: { x: number; top: boolean }[] = [];
      offscreen.forEach((r) => {
        const top = carCenterY(r, cam) < 0;
        let x = Math.max(30, Math.min(width - 30, r.x));
        while (placed.some((m) => m.top === top && Math.abs(m.x - x) < 54)) x += 56;
        if (x > width - 30) x = r.x - 56;
        placed.push({ x, top });
        const y = top ? 8 : height - 24;
        const label = `${top ? '▲' : '▼'} ${Math.round(Math.abs(r.distance - cam) / 10)}m`;
        ctx.fillStyle = 'rgba(2,6,23,0.8)';
        ctx.beginPath();
        ctx.roundRect(x - 26, y, 52, 16, 8);
        ctx.fill();
        ctx.fillStyle = r.color;
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y + 11);
      });

      // Depth: darker horizon at the top, soft vignette at the sides
      const fade = ctx.createLinearGradient(0, 0, 0, 70);
      fade.addColorStop(0, 'rgba(2,6,23,0.45)');
      fade.addColorStop(1, 'rgba(2,6,23,0)');
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, width, 70);

      if (state.countdown > -50) drawStartLights(state.countdown);

      // 9. Engine pitch + HUD (React state at 10 Hz, not every frame)
      if (engine && audio) {
        const revs = racing ? p1.speed : 3 + Math.random() * 2;
        engine.osc.frequency.setTargetAtTime(46 + revs * 9 + (p1.isBoosting ? 26 : 0), audio.currentTime, 0.06);
        engine.sub.frequency.setTargetAtTime(23 + revs * 4.5, audio.currentTime, 0.06);
      }
      hud(() => {
        setP1SpeedDisplay(Math.floor(p1.speed * 18));
        setP1NitroDisplay(Math.floor(p1.nitro));
        setP1LapDisplay(p1.lap);
        setP1RankDisplay(p1.rank);
        setP2SpeedDisplay(Math.floor(p2.speed * 18));
        setP2NitroDisplay(Math.floor(p2.nitro));
        setP2LapDisplay(p2.lap);
        setP2RankDisplay(p2.rank);
      });

      // 10. First across the line after the final lap wins
      const finishedRacer = racers.find((r) => r.distance >= TOTAL_LAPS * LAP_DISTANCE);
      if (finishedRacer) {
        isRunning = false;
        setP1RankDisplay(p1.rank);
        setP2RankDisplay(p2.rank);
        setIsPlaying(false);
        setIsGameOver(true);
        setWinnerName(finishedRacer.name);
        playSound('win');
        return;
      }

      state.animationId = stepper.request(loop);
    };

    gameStateRef.current.animationId = stepper.request(loop);

    return () => {
      isRunning = false;
      stepper.cancel();
      if (engine && audio) {
        engine.gain.gain.setTargetAtTime(0, audio.currentTime, 0.05);
        engine.osc.stop(audio.currentTime + 0.2);
        engine.sub.stop(audio.currentTime + 0.2);
      }
    };
  }, [isPlaying, raceMode, aiDifficulty, playSound, p1AutoPilot, soundEnabled]);

  return (
    <div className="w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white font-sans space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Rocket className="w-4 h-4" />
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">Neon Cyber Grand Prix: 2-Player & AI Circuit</h3>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            High-speed circuit racer. Steer, drift, grab Nitro batteries, and battle for 1st place!
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => {
              setRaceMode('ai');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              raceMode === 'ai' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" /> <span>vs AI Rivals</span>
          </button>
          <button
            onClick={() => {
              setRaceMode('local');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              raceMode === 'local' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> <span>Local 2-Player</span>
          </button>
        </div>
      </div>

      {/* Main Track & HUD Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Canvas Race Viewport (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="relative w-full rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-3 overflow-hidden">
            
            {/* Top Match HUD with Speed & Nitro Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 px-4 py-2.5 bg-slate-900/90 rounded-xl border border-slate-800/80 mb-3 text-xs font-mono font-bold">
              
              {/* Player 1 HUD (5 Cols) */}
              <div className="sm:col-span-5 space-y-1">
                <div className="flex items-center justify-between text-cyan-400">
                  <div className="flex items-center gap-1.5">
                    <span>PLAYER 1 (POS #{p1RankDisplay})</span>
                    <button
                      onClick={() => setP1AutoPilot(!p1AutoPilot)}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-sans uppercase font-black transition-all ${
                        p1AutoPilot ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p1AutoPilot ? 'AI Driving' : 'AI Pilot'}
                    </button>
                  </div>
                  <span>{p1SpeedDisplay} KM/H</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-150"
                    style={{ width: `${p1NitroDisplay}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>LAP {p1LapDisplay}/{TOTAL_LAPS}</span>
                  <span>NITRO: {p1NitroDisplay}%</span>
                </div>
              </div>

              {/* Center Checkered Flag Icon (2 Cols) */}
              <div className="sm:col-span-2 flex flex-col items-center justify-center text-center">
                <Flag className="w-4 h-4 text-amber-400 mb-0.5" />
                <span className="text-[10px] text-slate-400 uppercase font-black">GRAND PRIX</span>
              </div>

              {/* Player 2 / AI Rival HUD (5 Cols) */}
              <div className="sm:col-span-5 space-y-1">
                <div className="flex items-center justify-between text-amber-400">
                  <span>{p2SpeedDisplay} KM/H</span>
                  <span>{raceMode === 'ai' ? `AI RIVAL (POS #${p2RankDisplay})` : `PLAYER 2 (POS #${p2RankDisplay})`}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-150"
                    style={{ width: `${p2NitroDisplay}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>NITRO: {p2NitroDisplay}%</span>
                  <span>LAP {p2LapDisplay}/{TOTAL_LAPS}</span>
                </div>
              </div>

            </div>

            {/* Canvas Viewport */}
            <div className="relative w-full aspect-[16/9.2] rounded-xl overflow-hidden bg-[#070d18] border border-slate-800 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={660}
                height={360}
                className="w-full h-full block"
              />

              {/* Start Screen Overlay */}
              {!isPlaying && !isGameOver && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 z-20">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-lg">
                    <Rocket className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-black text-white">READY TO RACE?</h4>
                    <p className="text-xs text-slate-300 font-medium max-w-sm">
                      {raceMode === 'ai'
                        ? 'Compete against 3 AI rivals across 3 laps! Wait for the lights, grab green boost pads for Nitro and steer clear of oil slicks.'
                        : 'Player 1: A/D Steer · W Nitro | Player 2: Arrows Steer · Up Nitro'}
                    </p>
                  </div>

                  {raceMode === 'ai' && (
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-slate-400">AI Difficulty:</span>
                      {(['rookie', 'pro', 'master'] as AiDifficulty[]).map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setAiDifficulty(diff)}
                          className={`px-3 py-1 rounded-lg uppercase tracking-wider text-[10px] ${
                            aiDifficulty === diff
                              ? 'bg-amber-400 text-slate-950 font-black'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={startRace}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Start Grand Prix</span>
                  </button>
                </div>
              )}

              {/* Game Over Screen */}
              {isGameOver && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4 z-20">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg">
                    <Trophy className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white">
                      🏁 {winnerName} WINS THE GRAND PRIX!
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Completed 3 Laps ({TOTAL_LAPS * LAP_DISTANCE} units) on Cyber Circuit.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold space-y-1 max-w-xs">
                    <span>🏆 Speed Grandmaster Unlocked!</span>
                    <p className="text-[11px] text-slate-300 font-normal">
                      Claim a free 30-min Architecture & Web Performance Audit with Rowell.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={startRace}
                      className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Race Again</span>
                    </button>
                    <button
                      onClick={() => setShowRewardModal(true)}
                      className="px-5 py-2.5 rounded-xl bg-[#1d63ed] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Claim Audit</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Touch Steering & Nitro Pads */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="flex gap-2">
                <button
                  onMouseDown={() => (gameStateRef.current.keys.a = true)}
                  onMouseUp={() => (gameStateRef.current.keys.a = false)}
                  onTouchStart={() => (gameStateRef.current.keys.a = true)}
                  onTouchEnd={() => (gameStateRef.current.keys.a = false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-cyan-500 active:text-slate-950 rounded-xl text-xs font-black select-none text-cyan-300"
                >
                  ← STEER
                </button>
                <button
                  onMouseDown={() => (gameStateRef.current.keys.d = true)}
                  onMouseUp={() => (gameStateRef.current.keys.d = false)}
                  onTouchStart={() => (gameStateRef.current.keys.d = true)}
                  onTouchEnd={() => (gameStateRef.current.keys.d = false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-cyan-500 active:text-slate-950 rounded-xl text-xs font-black select-none text-cyan-300"
                >
                  STEER →
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onMouseDown={() => (gameStateRef.current.keys.w = true)}
                  onMouseUp={() => (gameStateRef.current.keys.w = false)}
                  onTouchStart={() => (gameStateRef.current.keys.w = true)}
                  onTouchEnd={() => (gameStateRef.current.keys.w = false)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-90 rounded-xl text-xs font-black select-none text-slate-950 shadow-md flex items-center justify-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>⚡ NITRO BOOST</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Controls, Track Tips & Lead Reward (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Controls Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Race Controls Guide
            </h4>
            <div className="space-y-2 text-xs text-slate-300 font-medium">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-300">P1 Steer / Brake:</span>
                <span className="font-mono text-white font-bold"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">A</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">D</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">S</kbd></span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-300">P1 Nitro Boost:</span>
                <span className="font-mono text-white font-bold"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">W</kbd> (Hyper Speed)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-amber-300">P2 Steer / Brake:</span>
                <span className="font-mono text-white font-bold"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">←</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">→</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↓</kbd></span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-amber-300">P2 Nitro Boost:</span>
                <span className="font-mono text-white font-bold"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↑</kbd> (Hyper Speed)</span>
              </div>
            </div>
          </div>

          {/* Pro Racing Tips */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Pro Circuit Tips
            </h4>
            <ul className="space-y-1.5 text-[11px] leading-relaxed">
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400">✦</span>
                <span><strong>Green Batteries:</strong> Refills +35% Nitro energy.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-rose-400">✦</span>
                <span><strong>Red Glitches:</strong> Slows down speed & drains nitro.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-cyan-400">✦</span>
                <span><strong>Bumping:</strong> Shoves opponents sideways into hazards!</span>
              </li>
            </ul>
          </div>

          {/* Architecture Audit Reward Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-indigo-950 border border-cyan-400/40 space-y-2.5">
            <div className="flex items-center gap-2 text-cyan-300">
              <Trophy className="w-4 h-4" />
              <h4 className="text-xs font-black uppercase tracking-wider">High-Speed Performance</h4>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              Want your web application to run at 60 FPS and 100/100 Core Web Vitals? Book a <strong>Free 30-Min Architecture Consultation</strong> with Rowell.
            </p>
            <button
              onClick={() => setShowRewardModal(true)}
              className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all shadow-md"
            >
              <span>Book Review With Rowell</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      <ContactModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        defaultService="Grand Prix Champion — Performance Audit"
      />
    </div>
  );
}
