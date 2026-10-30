'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Zap,
  Play,
  RotateCcw,
  Trophy,
  Sparkles,
  Shield,
  Flame,
  Volume2,
  VolumeX,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Award,
  ChevronRight,
} from 'lucide-react';
import { ContactModal } from '@/components/ui/contact-modal';
import { createFrameStepper, drawRaceCar, getAudioContext, prepareCanvas, throttle } from '@/components/arcade/engine';

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  label: string;
  type: 'obstacle' | 'boost' | 'gemini';
  color: string;
  icon: string;
  points: number;
}

export function SpeedRacerGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [webVitalsHealth, setWebVitalsHealth] = useState(100);
  const [distance, setDistance] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [aiAutoPilot, setAiAutoPilot] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [combo, setCombo] = useState(0);
  const [turboActive, setTurboActive] = useState(false);

  // Audio synthesizer helper (Web Audio API - no external mp3 dependencies)
  const playSound = useCallback(
    (type: 'boost' | 'hit' | 'start' | 'over' | 'turbo') => {
      if (!soundEnabled || typeof window === 'undefined') return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === 'boost') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
        } else if (type === 'hit') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.linearRampToValueAtTime(80, now + 0.2);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
        } else if (type === 'turbo') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(1040, now + 0.3);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
        } else if (type === 'start') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(330, now);
          osc.frequency.setValueAtTime(440, now + 0.1);
          osc.frequency.setValueAtTime(660, now + 0.2);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.35);
        } else if (type === 'over') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.linearRampToValueAtTime(120, now + 0.4);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
        }
      } catch (e) {
        // Ignore audio block restrictions
      }
    },
    [soundEnabled]
  );

  // Load high score from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rb_speed_racer_high_score');
      if (saved) setHighScore(parseInt(saved, 10));
    } catch (e) {}
  }, []);

  // Game Loop Ref variables
  const gameStateRef = useRef({
    playerX: 200,
    targetPlayerX: 200,
    playerY: 340,
    playerWidth: 44,
    playerHeight: 52,
    speed: 5,
    vx: 0,
    scroll: 0,
    obstacles: [] as Obstacle[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
    keys: { left: false, right: false, space: false },
    score: 0,
    health: 100,
    distance: 0,
    combo: 0,
    turboTimer: 0,
    lastObstacleSpawn: 0,
    animationId: 0,
  });

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setDistance(0);
    setWebVitalsHealth(100);
    setCombo(0);
    setTurboActive(false);

    const canvas = canvasRef.current;
    const width = 388;
    const height = 460;

    gameStateRef.current = {
      playerX: width / 2 - 22,
      targetPlayerX: width / 2 - 22,
      playerY: height - 80,
      playerWidth: 44,
      playerHeight: 54,
      speed: 2.6,
      vx: 0,
      scroll: 0,
      obstacles: [],
      particles: [],
      keys: { left: false, right: false, space: false },
      score: 0,
      health: 100,
      distance: 0,
      combo: 0,
      turboTimer: 0,
      lastObstacleSpawn: Date.now(),
      animationId: 0,
    };

    playSound('start');
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA', 'a'].includes(e.code) || e.key === 'ArrowLeft') {
        gameStateRef.current.keys.left = true;
      }
      if (['ArrowRight', 'KeyD', 'd'].includes(e.code) || e.key === 'ArrowRight') {
        gameStateRef.current.keys.right = true;
      }
      if (e.code === 'Space' || e.key === ' ') {
        gameStateRef.current.keys.space = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA', 'a'].includes(e.code) || e.key === 'ArrowLeft') {
        gameStateRef.current.keys.left = false;
      }
      if (['ArrowRight', 'KeyD', 'd'].includes(e.code) || e.key === 'ArrowRight') {
        gameStateRef.current.keys.right = false;
      }
      if (e.code === 'Space' || e.key === ' ') {
        gameStateRef.current.keys.space = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Canvas Animation Loop
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = prepareCanvas(canvas, 388, 460);
    if (!ctx) return;

    let isRunning = true;

    const stepper = createFrameStepper();
    const hud = throttle(10);

    const OBSTACLE_TYPES: Array<Omit<Obstacle, 'x' | 'y' | 'width' | 'height' | 'speed'>> = [
      { label: '5MB PNG', type: 'obstacle', color: '#dc2626', icon: '⚠️', points: -20 },
      { label: 'BLOCKING JS', type: 'obstacle', color: '#e11d48', icon: '⛔', points: -15 },
      { label: 'BLOAT CSS', type: 'obstacle', color: '#be123c', icon: '🐢', points: -20 },
      { label: 'SLOW SQL', type: 'obstacle', color: '#ea580c', icon: '⏳', points: -15 },
      { label: 'SUB-SEC LCP', type: 'boost', color: '#059669', icon: '⚡', points: 30 },
      { label: 'NEXT.JS RSC', type: 'boost', color: '#0891b2', icon: '🚀', points: 25 },
      { label: 'EDGE CACHE', type: 'boost', color: '#2563eb', icon: '🛡️', points: 35 },
      { label: 'NEONDB FAST', type: 'boost', color: '#7c3aed', icon: '💎', points: 30 },
      { label: 'AI TURBO 100', type: 'gemini', color: '#d97706', icon: '👑', points: 50 },
    ];

    const loop = () => {
      if (!isRunning) return;

      const state = gameStateRef.current;
      const width = 388;
      const height = 460;

      // 1. Clear background
      ctx.fillStyle = '#070d18';
      ctx.fillRect(0, 0, width, height);

      // Road: grass verges, red/white kerbs, asphalt grain and lane dashes, all scrolling together
      const roadLeft = 35;
      const roadRight = width - 35;
      const roadWidth = roadRight - roadLeft;
      state.scroll += state.speed * (state.turboTimer > 0 ? 1.4 : 1) * 1.6;
      const strip = 4;
      for (let y = 0; y < height; y += strip) {
        const d = state.scroll - y;
        ctx.fillStyle = Math.floor(d / 90) % 2 === 0 ? '#1d5c34' : '#216a3b';
        ctx.fillRect(0, y, width, strip);
        ctx.fillStyle = ['#2b2f36', '#2d3138', '#292d33', '#2c3037'][Math.abs(Math.floor(d / 7)) % 4];
        ctx.fillRect(roadLeft, y, roadWidth, strip);
        ctx.fillStyle = Math.floor(d / 26) % 2 === 0 ? '#dc2626' : '#f1f5f9';
        ctx.fillRect(roadLeft - 8, y, 8, strip);
        ctx.fillRect(roadRight, y, 8, strip);
        ctx.fillStyle = 'rgba(241,245,249,0.7)';
        ctx.fillRect(roadLeft + 4, y, 2, strip);
        ctx.fillRect(roadRight - 6, y, 2, strip);
        if (Math.floor(d / 40) % 2 === 0) {
          ctx.fillStyle = state.turboTimer > 0 ? 'rgba(251,191,36,0.8)' : 'rgba(241,245,249,0.55)';
          ctx.fillRect(width / 2 - 1.5, y, 3, strip);
        }
      }

      // 2. Handle Player Movement (Manual or AI Auto-Pilot)
      const moveSpeed = 8.5;
      const startX = state.playerX;
      if (aiAutoPilot) {
        // AI Radar: Look ahead for nearest obstacle or boost
        const nearest = state.obstacles
          .filter((o) => o.y < state.playerY + 50 && o.y > state.playerY - 240)
          .sort((a, b) => b.y - a.y)[0];

        if (nearest) {
          const itemCenter = nearest.x + nearest.width / 2;
          const playerCenter = state.playerX + state.playerWidth / 2;

          if (nearest.type === 'boost' || nearest.type === 'gemini') {
            // Seek speed boost
            if (playerCenter < itemCenter - 6) state.playerX += moveSpeed * 0.7;
            else if (playerCenter > itemCenter + 6) state.playerX -= moveSpeed * 0.7;
          } else {
            // Evade obstacle
            if (playerCenter >= itemCenter) state.playerX += moveSpeed * 0.8;
            else state.playerX -= moveSpeed * 0.8;
          }
        }
      } else {
        // Steering with momentum: input builds sideways speed, grip bleeds it off
        const steer = (state.keys.right ? 1 : 0) - (state.keys.left ? 1 : 0);
        state.vx = state.vx * 0.8 + steer * 1.7;
        state.playerX += state.vx;
      }
      if (aiAutoPilot) state.vx = state.playerX - startX;

      // Constrain player inside road
      state.playerX = Math.max(roadLeft + 5, Math.min(roadRight - state.playerWidth - 5, state.playerX));

      // 3. Spawn Obstacles & Boosts (Comfortable reading pace)
      const now = Date.now();
      const spawnInterval = state.turboTimer > 0 ? 550 : Math.max(750, 1200 - state.distance * 0.2);

      if (now - state.lastObstacleSpawn > spawnInterval) {
        state.lastObstacleSpawn = now;
        const template = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
        const obsWidth = 118;
        const obsHeight = 36;
        const obsX = roadLeft + Math.random() * (roadWidth - obsWidth);

        state.obstacles.push({
          x: obsX,
          y: -45,
          width: obsWidth,
          height: obsHeight,
          speed: state.speed,
          label: template.label,
          type: template.type,
          color: template.color,
          icon: template.icon,
          points: template.points,
        });
      }

      // 4. Update & Render Obstacles with High Contrast & Border
      for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        obs.y += obs.speed * (state.turboTimer > 0 ? 1.4 : 1);

        // Render obstacle badge background
        ctx.fillStyle = obs.color;
        ctx.shadowColor = obs.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 10);
        ctx.fill();

        // High-contrast border
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Crisp High-Contrast Bold Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${obs.icon} ${obs.label}`, obs.x + obs.width / 2, obs.y + obs.height / 2);

        // Collision Detection
        const hitX = state.playerX < obs.x + obs.width && state.playerX + state.playerWidth > obs.x;
        const hitY = state.playerY < obs.y + obs.height && state.playerY + state.playerHeight > obs.y;

        if (hitX && hitY) {
          // Explode particles
          for (let p = 0; p < 14; p++) {
            state.particles.push({
              x: obs.x + obs.width / 2,
              y: obs.y + obs.height / 2,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              life: 20,
              color: obs.color,
            });
          }

          if (obs.type === 'obstacle') {
            if (state.turboTimer > 0) {
              // Destroy obstacle when in turbo frenzy
              state.score += 20;
              playSound('hit');
            } else {
              state.health = Math.max(0, state.health - 25);
              state.combo = 0;
              playSound('hit');
            }
          } else if (obs.type === 'boost' || obs.type === 'gemini') {
            state.score += obs.points;
            state.health = Math.min(100, state.health + 10);
            state.combo += 1;
            if (obs.type === 'gemini') {
              state.turboTimer = 180; // 3 seconds turbo
              playSound('turbo');
            } else {
              playSound('boost');
            }
          }

          state.obstacles.splice(i, 1);
          continue;
        }

        // Remove off-screen
        if (obs.y > height + 50) {
          state.obstacles.splice(i, 1);
        }
      }

      // 5. Update Turbo Timer
      if (state.turboTimer > 0) {
        state.turboTimer--;
        setTurboActive(true);
      } else {
        setTurboActive(false);
      }

      // 6. Render Particles
      for (let p = state.particles.length - 1; p >= 0; p--) {
        const particle = state.particles[p];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, 3, 3);
        if (particle.life <= 0) state.particles.splice(p, 1);
      }

      // 7. Render Player Ship (High-Speed Rocket)
      const px = state.playerX;
      const py = state.playerY;
      const pw = state.playerWidth;
      const ph = state.playerHeight;

      drawRaceCar(ctx, px + (pw - 36) / 2, py, 36, ph, {
        color: state.turboTimer > 0 ? '#f59e0b' : '#0ea5e9',
        boosting: state.turboTimer > 0,
        steer: Math.max(-0.3, Math.min(0.3, state.vx * 0.04)),
      });

      // Shield Ring if Turbo
      if (state.turboTimer > 0) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(px + pw / 2, py + ph / 2, 34, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // 8. Distance & Score Increment (Gentle, Readable Scaling)
      state.distance += 1;
      state.score += 1;
      state.speed = 2.6 + Math.min(2.4, Math.floor(state.distance / 600) * 0.4);

      hud(() => {
        setScore(state.score);
        setDistance(Math.floor(state.distance / 10));
        setWebVitalsHealth(state.health);
        setCombo(state.combo);
      });

      // Check Game Over
      if (state.health <= 0) {
        isRunning = false;
        setScore(state.score);
        setDistance(Math.floor(state.distance / 10));
        setWebVitalsHealth(0);
        setIsPlaying(false);
        setIsGameOver(true);
        playSound('over');

        if (state.score > highScore) {
          setHighScore(state.score);
          try {
            localStorage.setItem('rb_speed_racer_high_score', state.score.toString());
          } catch (e) {}
        }
        return;
      }

      state.animationId = stepper.request(loop);
    };

    gameStateRef.current.animationId = stepper.request(loop);

    return () => {
      isRunning = false;
      stepper.cancel();
    };
  }, [isPlaying, highScore, playSound, aiAutoPilot]);

  return (
    <section className="relative w-full py-16 bg-[#070d18] border-y border-slate-800 text-white font-sans overflow-hidden">
      {/* Background Cyber Ambient Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Header Eyebrow */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Engineering Mini-Game</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Core Web Vitals <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200">Speed Racer</span>
          </h2>
          <p className="text-sm text-slate-300 font-medium">
            Steer past unoptimized bloated assets, catch Next.js RSC & Edge Cache turbo boosts, and keep Lighthouse Core Web Vitals at 100/100!
          </p>
        </div>

        {/* Game Arcade Console Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Arcade Canvas Screen (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full max-w-[420px] rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl p-4 overflow-hidden">
              
              {/* Top Arcade Status Bar */}
              <div className="flex items-center justify-between text-xs font-mono font-bold mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">VITALS:</span>
                  <div className="w-24 h-3.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${
                        webVitalsHealth > 60
                          ? 'bg-emerald-400'
                          : webVitalsHealth > 30
                          ? 'bg-amber-400'
                          : 'bg-rose-500 animate-pulse'
                      }`}
                      style={{ width: `${webVitalsHealth}%` }}
                    />
                  </div>
                  <span className={webVitalsHealth > 60 ? 'text-emerald-400' : 'text-rose-400'}>
                    {webVitalsHealth}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAiAutoPilot(!aiAutoPilot)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-sans font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                      aiAutoPilot
                        ? 'bg-emerald-500 text-slate-950 shadow-xs'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                    title="Toggle AI Auto-Pilot to play for you"
                  >
                    <span>{aiAutoPilot ? '🤖 AI Driving' : '🤖 AI Auto-Pilot'}</span>
                  </button>

                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                    title="Toggle Sound FX"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                  </button>
                </div>
              </div>

              {/* Canvas Canvas Element */}
              <div className="relative w-full aspect-[4/4.8] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={388}
                  height={460}
                  className="w-full h-full block"
                />

                {/* Start Overlay with Clear Visual Instructions */}
                {!isPlaying && !isGameOver && (
                  <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-5 text-center space-y-3.5 z-20">
                    <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-lg">
                      <Zap className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-white tracking-wide">HOW TO PLAY</h3>
                      <p className="text-xs text-slate-300 font-medium max-w-xs leading-relaxed">
                        Steer your rocket down the fiber-optic highway. Keep Lighthouse Vitals at 100%!
                      </p>
                    </div>

                    {/* Quick Keys visual badges */}
                    <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-slate-300">
                      <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-amber-400">← / A</span>
                      <span>STEER LEFT</span>
                      <span className="text-slate-500">·</span>
                      <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-amber-400">→ / D</span>
                      <span>STEER RIGHT</span>
                    </div>

                    {/* Quick rules */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] w-full max-w-xs text-left">
                      <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
                        <strong>DODGE ⛔</strong> Slow SQL & 5MB bloat
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                        <strong>COLLECT ⚡</strong> Next.js & LCP boosts
                      </div>
                    </div>

                    <button
                      onClick={startGame}
                      className="w-full max-w-xs py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>Start Turbo Run</span>
                    </button>
                  </div>
                )}

                {/* Game Over Overlay */}
                {isGameOver && (
                  <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg">
                      <Trophy className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-white">RUN COMPLETED</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        FINAL SCORE: <strong className="text-amber-400 text-sm">{score} PTS</strong> · DISTANCE:{' '}
                        <strong className="text-emerald-400 text-sm">{distance}m</strong>
                      </p>
                    </div>

                    {/* Reward Unlock Prompt */}
                    {score >= 350 && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold space-y-1 max-w-xs">
                        <span>🏆 High Performance Score Unlocked!</span>
                        <p className="text-[11px] text-slate-300 font-normal">
                          You've qualified for a free 30-min Architecture & Speed Audit.
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={startGame}
                        className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Play Again</span>
                      </button>

                      {score >= 350 && (
                        <button
                          onClick={() => setShowRewardModal(true)}
                          className="px-5 py-2.5 rounded-xl bg-[#1d63ed] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Claim Audit</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Touch Control Buttons */}
              <div className="flex items-center justify-between gap-3 mt-3">
                <button
                  onMouseDown={() => (gameStateRef.current.keys.left = true)}
                  onMouseUp={() => (gameStateRef.current.keys.left = false)}
                  onTouchStart={() => (gameStateRef.current.keys.left = true)}
                  onTouchEnd={() => (gameStateRef.current.keys.left = false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 rounded-xl border border-slate-700 text-xs font-black flex items-center justify-center gap-1 transition-colors select-none"
                >
                  <ArrowLeft className="w-4 h-4" /> LEFT
                </button>
                <button
                  onMouseDown={() => (gameStateRef.current.keys.right = true)}
                  onMouseUp={() => (gameStateRef.current.keys.right = false)}
                  onTouchStart={() => (gameStateRef.current.keys.right = true)}
                  onTouchEnd={() => (gameStateRef.current.keys.right = false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 rounded-xl border border-slate-700 text-xs font-black flex items-center justify-center gap-1 transition-colors select-none"
                >
                  RIGHT <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Scoreboard, Legend & Lead Rewards (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Stats Console */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Score & Records</span>
                <span className="text-[10px] font-extrabold uppercase text-amber-400 bg-amber-500/10 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  60 FPS Engine
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Score</span>
                  <span className="text-2xl font-black text-white">{score} <span className="text-xs text-amber-400">PTS</span></span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">All-Time High</span>
                  <span className="text-2xl font-black text-amber-400">{highScore} <span className="text-xs text-slate-400">PTS</span></span>
                </div>
              </div>

              {combo > 1 && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-xs font-black flex items-center justify-between animate-pulse">
                  <span>⚡ BOOST COMBO STREAK</span>
                  <span>{combo}x SPEED</span>
                </div>
              )}
            </div>

            {/* How to Play & Controls Card */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> How To Play & Controls
                </h4>
                <span className="text-[10px] font-bold text-slate-400">Desktop & Mobile</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 font-medium">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400">Keyboard Controls:</span>
                  <div className="flex items-center gap-1 font-mono text-[11px] text-white">
                    <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-bold">←</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-bold">A</kbd> Left · <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-bold">→</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-bold">D</kbd> Right
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400">Mobile Controls:</span>
                  <span className="text-slate-200 font-bold">Touch LEFT / RIGHT pads</span>
                </div>

                <div className="p-2.5 rounded-xl bg-indigo-950/50 border border-indigo-800/40 text-indigo-200 text-[11px] leading-relaxed">
                  💡 <strong>Game Goal:</strong> Keep your <strong>Core Web Vitals health above 0%</strong> by dodging slow SQL queries & bloated assets while grabbing Next.js & LCP speed boosts.
                </div>
              </div>
            </div>

            {/* Performance Legend Guide */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
                Web Performance Legend
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400">
                  <span>⚡</span>
                  <span className="text-[11px] text-slate-300">Sub-Sec LCP (+30)</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
                  <span>🚀</span>
                  <span className="text-[11px] text-slate-300">Next.js RSC (+25)</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-rose-400">
                  <span>⚠️</span>
                  <span className="text-[11px] text-slate-300">5MB PNG (-20)</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-rose-400">
                  <span>🐢</span>
                  <span className="text-[11px] text-slate-300">Bloat CSS (-20)</span>
                </div>
              </div>
            </div>

            {/* Client Lead Reward Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/20 via-indigo-950 to-slate-900 border border-amber-400/40 space-y-3 shadow-2xl">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-black text-white">Score 350+ Points & Claim Reward</h4>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Reach 350+ points to unlock a <strong>Free 30-Minute Architecture & Codebase Speed Audit</strong> for your business platform.
              </p>
              <button
                onClick={() => setShowRewardModal(true)}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
              >
                <span>Book Direct Architecture Review</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>

      <ContactModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        defaultService="Codebase Rescue & Speed Audit"
      />
    </section>
  );
}
