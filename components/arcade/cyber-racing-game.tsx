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

type RaceMode = 'ai' | 'local';
type AiDifficulty = 'rookie' | 'pro' | 'master';

interface Racer {
  id: string;
  name: string;
  x: number; // Lane position (0 to roadWidth)
  y: number; // Vertical offset on screen
  speed: number;
  maxSpeed: number;
  nitro: number; // 0 to 100
  isBoosting: boolean;
  color: string;
  glowColor: string;
  distance: number;
  lap: number;
  rank: number;
  isAi: boolean;
  score: number;
}

interface TrackObstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'boost' | 'battery' | 'glitch' | 'barrier';
  label: string;
  color: string;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

const TOTAL_LAPS = 3;
const LAP_DISTANCE = 8000; // in units

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
    (type: 'engine' | 'boost' | 'crash' | 'pickup' | 'lap' | 'win') => {
      if (!soundEnabled || typeof window === 'undefined') return;
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
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
    trackScrollY: number;
    curveOffset: number;
    curveTarget: number;
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
    trackScrollY: 0,
    curveOffset: 0,
    curveTarget: 0,
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

    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 680;
    const roadLeft = width * 0.15;
    const roadWidth = width * 0.7;

    // Initialize 4 Racers Grid
    const p1: Racer = {
      id: 'p1',
      name: 'Player 1 (Cyan)',
      x: roadLeft + roadWidth * 0.25,
      y: 280,
      speed: 0,
      maxSpeed: 11.5,
      nitro: 100,
      isBoosting: false,
      color: '#38bdf8',
      glowColor: '#00f0ff',
      distance: 0,
      lap: 1,
      rank: 1,
      isAi: false,
      score: 0,
    };

    const p2: Racer = {
      id: 'p2',
      name: raceMode === 'ai' ? 'AI Rival (Amber)' : 'Player 2 (Amber)',
      x: roadLeft + roadWidth * 0.75,
      y: 280,
      speed: 0,
      maxSpeed: 11.2,
      nitro: 100,
      isBoosting: false,
      color: '#f59e0b',
      glowColor: '#fbbf24',
      distance: 0,
      lap: 1,
      rank: 2,
      isAi: raceMode === 'ai',
      score: 0,
    };

    const aiDrone1: Racer = {
      id: 'drone1',
      name: 'AI Phantom (Purple)',
      x: roadLeft + roadWidth * 0.45,
      y: 190,
      speed: 8.5,
      maxSpeed: 10.8,
      nitro: 80,
      isBoosting: false,
      color: '#a855f7',
      glowColor: '#c084fc',
      distance: 200,
      lap: 1,
      rank: 3,
      isAi: true,
      score: 0,
    };

    const aiDrone2: Racer = {
      id: 'drone2',
      name: 'AI Demon (Crimson)',
      x: roadLeft + roadWidth * 0.6,
      y: 110,
      speed: 9.0,
      maxSpeed: 11.0,
      nitro: 90,
      isBoosting: false,
      color: '#f43f5e',
      glowColor: '#fb7185',
      distance: 450,
      lap: 1,
      rank: 4,
      isAi: true,
      score: 0,
    };

    gameStateRef.current.racers = [p1, p2, aiDrone1, aiDrone2];
    gameStateRef.current.items = [];
    gameStateRef.current.sparks = [];
    gameStateRef.current.trackScrollY = 0;
    gameStateRef.current.curveOffset = 0;
    gameStateRef.current.curveTarget = 0;

    playSound('boost');
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
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const loop = () => {
      if (!isRunning) return;

      const state = gameStateRef.current;
      const { racers, items, sparks, keys } = state;
      const width = canvas.width;
      const height = canvas.height;

      const roadLeft = width * 0.12;
      const roadRight = width * 0.88;
      const roadWidth = roadRight - roadLeft;

      // 1. Clear background
      ctx.fillStyle = '#070d18';
      ctx.fillRect(0, 0, width, height);

      // Road background surface with perspective gradient
      const roadGrad = ctx.createLinearGradient(0, 0, 0, height);
      roadGrad.addColorStop(0, '#0b1322');
      roadGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = roadGrad;
      ctx.fillRect(roadLeft, 0, roadWidth, height);

      // Road Neon Borders
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(roadLeft, 0);
      ctx.lineTo(roadLeft, height);
      ctx.moveTo(roadRight, 0);
      ctx.lineTo(roadRight, height);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 2. Animate Road Dashes & Lane Stripes
      state.trackScrollY = (state.trackScrollY + 7.5) % 40;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.setLineDash([16, 24]);
      
      const lane1 = roadLeft + roadWidth * 0.33;
      const lane2 = roadLeft + roadWidth * 0.66;

      ctx.beginPath();
      ctx.moveTo(lane1, -state.trackScrollY);
      ctx.lineTo(lane1, height);
      ctx.moveTo(lane2, -state.trackScrollY);
      ctx.lineTo(lane2, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Spawn Road Boost Pads & Glitch Hazards
      if (Math.random() < 0.035 && items.length < 5) {
        const itemType = Math.random() < 0.6 ? 'battery' : 'glitch';
        items.push({
          x: roadLeft + 20 + Math.random() * (roadWidth - 70),
          y: -40,
          width: 50,
          height: 24,
          type: itemType,
          label: itemType === 'battery' ? '⚡ NITRO' : '⚠️ BUG',
          color: itemType === 'battery' ? '#10b981' : '#f43f5e',
        });
      }

      // Update and Render Items
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += 6.5;

        // Render Item Badge
        ctx.fillStyle = item.color;
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(item.x, item.y, item.width, item.height, 6);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, item.x + item.width / 2, item.y + 15);

        // Check collection with racers
        racers.forEach((r) => {
          const hit =
            r.x < item.x + item.width &&
            r.x + 32 > item.x &&
            r.y < item.y + item.height &&
            r.y + 54 > item.y;

          if (hit) {
            if (item.type === 'battery') {
              r.nitro = Math.min(100, r.nitro + 35);
              r.speed = Math.min(r.maxSpeed * 1.3, r.speed + 3);
              playSound('pickup');
            } else {
              r.speed = Math.max(3, r.speed - 4);
              r.nitro = Math.max(0, r.nitro - 20);
              playSound('crash');
              // Sparks
              for (let s = 0; s < 12; s++) {
                sparks.push({
                  x: r.x + 16,
                  y: r.y + 25,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  life: 18,
                  color: '#f43f5e',
                  size: 2,
                });
              }
            }
            items.splice(i, 1);
          }
        });

        if (item.y > height + 50) {
          items.splice(i, 1);
        }
      }

      // 4. Update Racers Controls & AI Behaviors
      const p1 = racers[0];
      const p2 = racers[1];

      // Player 1 Logic
      if (p1AutoPilot) {
        // AI Steering for Player 1: Evade hazards and seek batteries
        const targetItem = items.find((it) => it.y < p1.y && it.y > p1.y - 180);
        if (targetItem) {
          if (targetItem.type === 'battery') {
            if (p1.x < targetItem.x) p1.x += 3.8;
            else if (p1.x > targetItem.x) p1.x -= 3.8;
          } else {
            if (p1.x <= targetItem.x) p1.x -= 4.2;
            else p1.x += 4.2;
          }
        }
        // Auto Nitro
        if (p1.nitro > 40 && Math.random() < 0.05) {
          p1.isBoosting = true;
          p1.nitro -= 0.8;
          p1.speed = Math.min(p1.maxSpeed * 1.35, p1.speed + 0.3);
        } else {
          p1.isBoosting = false;
          p1.speed = Math.min(p1.maxSpeed, p1.speed + 0.15);
        }
      } else {
        // Manual Player 1 Controls
        if (keys.a) p1.x -= 5.5;
        if (keys.d) p1.x += 5.5;
        if (keys.w && p1.nitro > 0) {
          p1.isBoosting = true;
          p1.nitro = Math.max(0, p1.nitro - 0.7);
          p1.speed = Math.min(p1.maxSpeed * 1.35, p1.speed + 0.25);
          if (Math.random() < 0.15) playSound('boost');
        } else {
          p1.isBoosting = false;
          p1.speed = keys.s ? Math.max(2, p1.speed - 0.3) : Math.min(p1.maxSpeed, p1.speed + 0.12);
        }
      }

      // Player 2 / AI Rival Logic
      if (raceMode === 'local' && !p2.isAi) {
        if (keys.left) p2.x -= 5.5;
        if (keys.right) p2.x += 5.5;
        if (keys.up && p2.nitro > 0) {
          p2.isBoosting = true;
          p2.nitro = Math.max(0, p2.nitro - 0.7);
          p2.speed = Math.min(p2.maxSpeed * 1.35, p2.speed + 0.25);
        } else {
          p2.isBoosting = false;
          p2.speed = keys.down ? Math.max(2, p2.speed - 0.3) : Math.min(p2.maxSpeed, p2.speed + 0.12);
        }
      } else {
        // AI Rival Racing algorithm
        const aiBoostChance = aiDifficulty === 'master' ? 0.08 : aiDifficulty === 'pro' ? 0.04 : 0.01;
        const targetItem = items.find((it) => it.y < p2.y && it.y > p2.y - 180);
        if (targetItem) {
          if (targetItem.type === 'battery') {
            if (p2.x < targetItem.x) p2.x += 3.8;
            else if (p2.x > targetItem.x) p2.x -= 3.8;
          } else {
            if (p2.x <= targetItem.x) p2.x -= 4.0;
            else p2.x += 4.0;
          }
        }
        if (p2.nitro > 30 && Math.random() < aiBoostChance) {
          p2.isBoosting = true;
          p2.nitro -= 0.8;
          p2.speed = Math.min(p2.maxSpeed * 1.35, p2.speed + 0.3);
        } else {
          p2.isBoosting = false;
          p2.speed = Math.min(p2.maxSpeed, p2.speed + 0.12);
        }
      }

      // Update AI Drones
      racers.slice(2).forEach((drone) => {
        drone.x += (Math.random() - 0.5) * 2;
        drone.speed = Math.min(drone.maxSpeed, drone.speed + 0.08);
      });

      // 5. Physics, Collisions & Lap Counting
      racers.forEach((r, idx) => {
        // Constrain to road boundaries
        r.x = Math.max(roadLeft + 10, Math.min(roadRight - 42, r.x));

        // Increment distance
        r.distance += r.speed;
        const currentLap = Math.min(TOTAL_LAPS, Math.floor(r.distance / LAP_DISTANCE) + 1);

        if (currentLap > r.lap) {
          r.lap = currentLap;
          if (idx === 0 || idx === 1) playSound('lap');
        }

        // Collisions between racers (Bump mechanics)
        racers.forEach((other, oIdx) => {
          if (idx !== oIdx) {
            const hit =
              Math.abs(r.x - other.x) < 32 && Math.abs(r.y - other.y) < 48;
            if (hit) {
              if (r.x < other.x) {
                r.x -= 3;
                other.x += 3;
              } else {
                r.x += 3;
                other.x -= 3;
              }
              // Sparks
              for (let s = 0; s < 6; s++) {
                sparks.push({
                  x: (r.x + other.x) / 2 + 16,
                  y: (r.y + other.y) / 2 + 25,
                  vx: (Math.random() - 0.5) * 8,
                  vy: (Math.random() - 0.5) * 8,
                  life: 14,
                  color: '#fbbf24',
                  size: 2,
                });
              }
            }
          }
        });
      });

      // 6. Calculate Dynamic Rankings (1st, 2nd, 3rd, 4th)
      const sortedByDistance = [...racers].sort((a, b) => b.distance - a.distance);
      sortedByDistance.forEach((r, rankIdx) => {
        r.rank = rankIdx + 1;
      });

      // 7. Render Sparks
      for (let s = sparks.length - 1; s >= 0; s--) {
        const spark = sparks[s];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.life--;
        ctx.fillStyle = spark.color;
        ctx.fillRect(spark.x, spark.y, spark.size, spark.size);
        if (spark.life <= 0) sparks.splice(s, 1);
      }

      // 8. Render All 4 Cyber Racecars
      racers.forEach((r) => {
        // Car Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(r.x + 16, r.y + 54, 20, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Nitro Thruster Flame if boosting
        if (r.isBoosting || r.speed > r.maxSpeed) {
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.moveTo(r.x + 8, r.y + 52);
          ctx.lineTo(r.x + 16, r.y + 68 + Math.random() * 8);
          ctx.lineTo(r.x + 24, r.y + 52);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Cyber Car Body
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = r.glowColor;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(r.x, r.y, 32, 54, 8);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Cockpit glass
        ctx.fillStyle = r.color;
        ctx.fillRect(r.x + 6, r.y + 14, 20, 16);

        // Headlights
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(r.x + 4, r.y + 4, 6, 4);
        ctx.fillRect(r.x + 22, r.y + 4, 6, 4);

        // Name tag & Rank badge
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`P${r.rank}`, r.x + 16, r.y - 6);
      });

      // 9. Update UI HUD Displays
      setP1SpeedDisplay(Math.floor(p1.speed * 18));
      setP1NitroDisplay(Math.floor(p1.nitro));
      setP1LapDisplay(p1.lap);
      setP1RankDisplay(p1.rank);

      setP2SpeedDisplay(Math.floor(p2.speed * 18));
      setP2NitroDisplay(Math.floor(p2.nitro));
      setP2LapDisplay(p2.lap);
      setP2RankDisplay(p2.rank);

      // 10. Check Grand Prix Victory (First to finish 3 Laps)
      const finishedRacer = racers.find((r) => r.distance >= TOTAL_LAPS * LAP_DISTANCE);
      if (finishedRacer) {
        isRunning = false;
        setIsPlaying(false);
        setIsGameOver(true);
        setWinnerName(finishedRacer.name);
        playSound('win');
        return;
      }

      state.animationId = requestAnimationFrame(loop);
    };

    gameStateRef.current.animationId = requestAnimationFrame(loop);
    const animId = gameStateRef.current.animationId;

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, raceMode, aiDifficulty, playSound, p1AutoPilot]);

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
                        ? 'Compete against 3 AI rivals across 3 laps! Grab green batteries for Nitro boosts and avoid red glitches.'
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
