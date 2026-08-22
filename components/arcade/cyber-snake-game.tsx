'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Sparkles,
  Play,
  RotateCcw,
  Trophy,
  Volume2,
  VolumeX,
  Bot,
  Users,
  Award,
  ChevronRight,
  Shield,
  Zap,
} from 'lucide-react';
import { ContactModal } from '@/components/ui/contact-modal';

type GameMode = 'solo' | 'ai' | 'duel';
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
interface Point {
  x: number;
  y: number;
}

interface FoodNode extends Point {
  type: 'standard' | 'golden' | 'speed' | 'ghost';
  label: string;
  color: string;
  points: number;
  timer?: number;
}

const GRID_SIZE = 20; // 20x20 Grid
const CELL_COUNT_X = 28;
const CELL_COUNT_Y = 18;

export function CyberSnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('solo');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [p1AutoPilot, setP1AutoPilot] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const [scoreP1, setScoreP1] = useState(0);
  const [scoreP2, setScoreP2] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);

  // Audio synthesizer helper (Web Audio API)
  const playSound = useCallback(
    (type: 'eat' | 'golden' | 'die' | 'turn' | 'powerup') => {
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

        if (type === 'eat') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        } else if (type === 'golden') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523, now);
          osc.frequency.setValueAtTime(659, now + 0.06);
          osc.frequency.setValueAtTime(784, now + 0.12);
          osc.frequency.setValueAtTime(1046, now + 0.18);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (type === 'die') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.linearRampToValueAtTime(60, now + 0.3);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
        } else if (type === 'turn') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(300, now);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.03);
          osc.start(now);
          osc.stop(now + 0.03);
        }
      } catch (e) {}
    },
    [soundEnabled]
  );

  // Internal Game State Ref
  const gameStateRef = useRef<{
    snake1: Point[];
    dir1: Direction;
    nextDir1: Direction;
    snake2: Point[];
    dir2: Direction;
    nextDir2: Direction;
    foods: FoodNode[];
    score1: number;
    score2: number;
    speedMs: number;
    lastTick: number;
    animationId: number;
  }>({
    snake1: [
      { x: 5, y: 8 },
      { x: 4, y: 8 },
      { x: 3, y: 8 },
    ],
    dir1: 'RIGHT',
    nextDir1: 'RIGHT',
    snake2: [
      { x: 22, y: 8 },
      { x: 23, y: 8 },
      { x: 24, y: 8 },
    ],
    dir2: 'LEFT',
    nextDir2: 'LEFT',
    foods: [],
    score1: 0,
    score2: 0,
    speedMs: 95,
    lastTick: 0,
    animationId: 0,
  });

  // Load High Score
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rb_snake_high_score');
      if (saved) setHighScore(parseInt(saved, 10));
    } catch (e) {}
  }, []);

  const spawnFood = (existingFoods: FoodNode[], s1: Point[], s2: Point[]): FoodNode => {
    const isGolden = Math.random() < 0.2;
    const isPower = Math.random() < 0.15;
    let x = 0;
    let y = 0;
    let occupied = true;

    while (occupied) {
      x = Math.floor(Math.random() * CELL_COUNT_X);
      y = Math.floor(Math.random() * CELL_COUNT_Y);
      const onS1 = s1.some((p) => p.x === x && p.y === y);
      const onS2 = s2.some((p) => p.x === x && p.y === y);
      const onFood = existingFoods.some((f) => f.x === x && f.y === y);
      occupied = onS1 || onS2 || onFood;
    }

    if (isGolden) {
      return { x, y, type: 'golden', label: '⭐ NEON', color: '#fbbf24', points: 35 };
    }
    if (isPower) {
      return { x, y, type: 'speed', label: '⚡ FAST', color: '#a855f7', points: 20 };
    }
    const stackLabels = ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Prisma'];
    const label = stackLabels[Math.floor(Math.random() * stackLabels.length)];
    return { x, y, type: 'standard', label, color: '#38bdf8', points: 10 };
  };

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScoreP1(0);
    setScoreP2(0);
    setWinner(null);

    const s1: Point[] = [
      { x: 5, y: 9 },
      { x: 4, y: 9 },
      { x: 3, y: 9 },
    ];
    const s2: Point[] = [
      { x: 22, y: 9 },
      { x: 23, y: 9 },
      { x: 24, y: 9 },
    ];

    const initialFoods = [spawnFood([], s1, s2), spawnFood([], s1, s2)];

    gameStateRef.current = {
      snake1: s1,
      dir1: 'RIGHT',
      nextDir1: 'RIGHT',
      snake2: s2,
      dir2: 'LEFT',
      nextDir2: 'LEFT',
      foods: initialFoods,
      score1: 0,
      score2: 0,
      speedMs: 90,
      lastTick: Date.now(),
      animationId: 0,
    };
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = gameStateRef.current;

      // Player 1 controls (WASD)
      if ((['KeyW', 'w', 'W'].includes(e.key) || e.code === 'KeyW') && state.dir1 !== 'DOWN') {
        state.nextDir1 = 'UP';
        playSound('turn');
      }
      if ((['KeyS', 's', 'S'].includes(e.key) || e.code === 'KeyS') && state.dir1 !== 'UP') {
        state.nextDir1 = 'DOWN';
        playSound('turn');
      }
      if ((['KeyA', 'a', 'A'].includes(e.key) || e.code === 'KeyA') && state.dir1 !== 'RIGHT') {
        state.nextDir1 = 'LEFT';
        playSound('turn');
      }
      if ((['KeyD', 'd', 'D'].includes(e.key) || e.code === 'KeyD') && state.dir1 !== 'LEFT') {
        state.nextDir1 = 'RIGHT';
        playSound('turn');
      }

      // Player 2 controls (Arrow keys)
      if (e.key === 'ArrowUp' && state.dir2 !== 'DOWN') {
        state.nextDir2 = 'UP';
        playSound('turn');
      }
      if (e.key === 'ArrowDown' && state.dir2 !== 'UP') {
        state.nextDir2 = 'DOWN';
        playSound('turn');
      }
      if (e.key === 'ArrowLeft' && state.dir2 !== 'RIGHT') {
        state.nextDir2 = 'LEFT';
        playSound('turn');
      }
      if (e.key === 'ArrowRight' && state.dir2 !== 'LEFT') {
        state.nextDir2 = 'RIGHT';
        playSound('turn');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playSound]);

  // AI Pathfinding Bot (BFS / Safe Food Tracker)
  const getAiNextDirection = (snake: Point[], food: Point, otherSnake: Point[]): Direction => {
    const head = snake[0];
    const obstacles = new Set(snake.concat(otherSnake).map((p) => `${p.x},${p.y}`));

    const moves: { dir: Direction; dx: number; dy: number }[] = [
      { dir: 'UP', dx: 0, dy: -1 },
      { dir: 'DOWN', dx: 0, dy: 1 },
      { dir: 'LEFT', dx: -1, dy: 0 },
      { dir: 'RIGHT', dx: 1, dy: 0 },
    ];

    // Filter out immediate wall/body collisions
    const validMoves = moves.filter((m) => {
      const nx = head.x + m.dx;
      const ny = head.y + m.dy;
      if (nx < 0 || nx >= CELL_COUNT_X || ny < 0 || ny >= CELL_COUNT_Y) return false;
      return !obstacles.has(`${nx},${ny}`);
    });

    if (validMoves.length === 0) return 'UP';

    // Pick move minimizing Manhattan distance to food
    validMoves.sort((a, b) => {
      const distA = Math.abs(head.x + a.dx - food.x) + Math.abs(head.y + a.dy - food.y);
      const distB = Math.abs(head.x + b.dx - food.x) + Math.abs(head.y + b.dy - food.y);
      return distA - distB;
    });

    return validMoves[0].dir;
  };

  // Main Canvas Render & Tick Loop
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
      const now = Date.now();

      // Tick Logic at paced interval
      if (now - state.lastTick > state.speedMs) {
        state.lastTick = now;
        const targetFood = state.foods[0] || { x: 14, y: 9 };

        // 1. AI Auto-Pilot for Snake 1 if enabled
        if (p1AutoPilot) {
          state.nextDir1 = getAiNextDirection(state.snake1, targetFood, gameMode === 'duel' ? state.snake2 : []);
        }

        // 2. AI Opponent for Snake 2 in AI Mode
        if (gameMode === 'ai') {
          state.nextDir2 = getAiNextDirection(state.snake2, targetFood, state.snake1);
        }

        state.dir1 = state.nextDir1;
        state.dir2 = state.nextDir2;

        // Move Snake 1
        const head1 = { ...state.snake1[0] };
        if (state.dir1 === 'UP') head1.y -= 1;
        if (state.dir1 === 'DOWN') head1.y += 1;
        if (state.dir1 === 'LEFT') head1.x -= 1;
        if (state.dir1 === 'RIGHT') head1.x += 1;

        // Check Snake 1 Wall / Self Collision
        let s1Dead =
          head1.x < 0 ||
          head1.x >= CELL_COUNT_X ||
          head1.y < 0 ||
          head1.y >= CELL_COUNT_Y ||
          state.snake1.some((p) => p.x === head1.x && p.y === head1.y);

        let s2Dead = false;
        let head2 = { ...state.snake2[0] };

        if (gameMode !== 'solo') {
          // Move Snake 2
          if (state.dir2 === 'UP') head2.y -= 1;
          if (state.dir2 === 'DOWN') head2.y += 1;
          if (state.dir2 === 'LEFT') head2.x -= 1;
          if (state.dir2 === 'RIGHT') head2.x += 1;

          s2Dead =
            head2.x < 0 ||
            head2.x >= CELL_COUNT_X ||
            head2.y < 0 ||
            head2.y >= CELL_COUNT_Y ||
            state.snake2.some((p) => p.x === head2.x && p.y === head2.y);

          // Head-to-Body cross collisions
          if (state.snake2.some((p) => p.x === head1.x && p.y === head1.y)) s1Dead = true;
          if (state.snake1.some((p) => p.x === head2.x && p.y === head2.y)) s2Dead = true;
        }

        if (s1Dead || s2Dead) {
          isRunning = false;
          setIsPlaying(false);
          setIsGameOver(true);
          playSound('die');

          if (gameMode === 'solo') {
            setWinner(null);
          } else {
            if (s1Dead && s2Dead) setWinner('TIE GAME');
            else if (s1Dead) setWinner(gameMode === 'ai' ? 'SENIOR AI' : 'PLAYER 2');
            else setWinner('PLAYER 1');
          }
          return;
        }

        // Advance Snake 1
        state.snake1.unshift(head1);

        // Check Food Consumption for Snake 1
        const foodIdx1 = state.foods.findIndex((f) => f.x === head1.x && f.y === head1.y);
        if (foodIdx1 !== -1) {
          const eaten = state.foods[foodIdx1];
          state.score1 += eaten.points;
          setScoreP1(state.score1);
          if (eaten.type === 'golden') playSound('golden');
          else playSound('eat');

          if (state.score1 > highScore) {
            setHighScore(state.score1);
            try {
              localStorage.setItem('rb_snake_high_score', state.score1.toString());
            } catch (e) {}
          }
          state.foods.splice(foodIdx1, 1);
          state.foods.push(spawnFood(state.foods, state.snake1, state.snake2));
        } else {
          state.snake1.pop();
        }

        // Advance Snake 2 (in Duel / AI Mode)
        if (gameMode !== 'solo') {
          state.snake2.unshift(head2);
          const foodIdx2 = state.foods.findIndex((f) => f.x === head2.x && f.y === head2.y);
          if (foodIdx2 !== -1) {
            const eaten = state.foods[foodIdx2];
            state.score2 += eaten.points;
            setScoreP2(state.score2);
            if (eaten.type === 'golden') playSound('golden');
            else playSound('eat');
            state.foods.splice(foodIdx2, 1);
            state.foods.push(spawnFood(state.foods, state.snake1, state.snake2));
          } else {
            state.snake2.pop();
          }
        }
      }

      // 3. Render Canvas
      const width = canvas.width;
      const height = canvas.height;
      const cellW = width / CELL_COUNT_X;
      const cellH = height / CELL_COUNT_Y;

      // Dark Cyber Grid Background
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      for (let c = 0; c <= CELL_COUNT_X; c++) {
        ctx.beginPath();
        ctx.moveTo(c * cellW, 0);
        ctx.lineTo(c * cellW, height);
        ctx.stroke();
      }
      for (let r = 0; r <= CELL_COUNT_Y; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * cellH);
        ctx.lineTo(width, r * cellH);
        ctx.stroke();
      }

      // Outer Neon Border
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, width, height);

      // Render Foods with Glowing Badges
      state.foods.forEach((food) => {
        const fx = food.x * cellW;
        const fy = food.y * cellH;

        ctx.fillStyle = food.color;
        ctx.shadowColor = food.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(fx + 2, fy + 2, cellW - 4, cellH - 4, 4);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(food.label.slice(0, 5), fx + cellW / 2, fy + cellH / 2 + 2.5);
      });

      // Render Snake 1 (Cyan Neon)
      state.snake1.forEach((seg, idx) => {
        const sx = seg.x * cellW;
        const sy = seg.y * cellH;
        const isHead = idx === 0;

        ctx.fillStyle = isHead ? '#38bdf8' : '#0284c7';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = isHead ? 15 : 6;
        ctx.beginPath();
        ctx.roundRect(sx + 1.5, sy + 1.5, cellW - 3, cellH - 3, isHead ? 6 : 4);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (isHead) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(sx + cellW * 0.5, sy + cellH * 0.5, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Render Snake 2 (Amber Neon)
      if (gameMode !== 'solo') {
        state.snake2.forEach((seg, idx) => {
          const sx = seg.x * cellW;
          const sy = seg.y * cellH;
          const isHead = idx === 0;

          ctx.fillStyle = isHead ? '#f59e0b' : '#b45309';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = isHead ? 15 : 6;
          ctx.beginPath();
          ctx.roundRect(sx + 1.5, sy + 1.5, cellW - 3, cellH - 3, isHead ? 6 : 4);
          ctx.fill();
          ctx.shadowBlur = 0;

          if (isHead) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(sx + cellW * 0.5, sy + cellH * 0.5, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      state.animationId = requestAnimationFrame(loop);
    };

    gameStateRef.current.animationId = requestAnimationFrame(loop);
    const animId = gameStateRef.current.animationId;

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, gameMode, highScore, playSound, p1AutoPilot]);

  return (
    <div className="w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white font-sans space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">Cyber Snake: Full-Stack Devourer</h3>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Devour technology nodes to scale throughput. Play solo, vs AI bot, or 2-player local duel!
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => {
              setGameMode('solo');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              gameMode === 'solo' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Solo Marathon
          </button>
          <button
            onClick={() => {
              setGameMode('ai');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              gameMode === 'ai' ? 'bg-purple-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" /> <span>vs Senior AI</span>
          </button>
          <button
            onClick={() => {
              setGameMode('duel');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              gameMode === 'duel' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> <span>2P Duel</span>
          </button>
        </div>
      </div>

      {/* Main Game Frame & Scoreboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Canvas Frame (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="relative w-full rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-3 overflow-hidden">
            
            {/* Top Scoreboard HUD */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-slate-900/80 rounded-xl border border-slate-800/80 mb-3 text-xs font-mono font-black">
              <div className="flex items-center gap-2 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>P1 NODES: {scoreP1}</span>
                <button
                  onClick={() => setP1AutoPilot(!p1AutoPilot)}
                  className={`ml-2 px-2 py-0.5 rounded-md text-[10px] font-sans font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                    p1AutoPilot ? 'bg-emerald-500 text-slate-950 shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  <Bot className="w-3 h-3" />
                  <span>{p1AutoPilot ? 'AI Driving' : 'AI Pilot'}</span>
                </button>
              </div>

              <div className="text-slate-400 text-[11px] font-bold">
                HIGH SCORE: <span className="text-amber-400">{highScore}</span>
              </div>

              {gameMode !== 'solo' && (
                <div className="flex items-center gap-2 text-amber-400">
                  <span>{gameMode === 'ai' ? 'SENIOR AI' : 'PLAYER 2'}: {scoreP2}</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                </div>
              )}
            </div>

            {/* Canvas Screen */}
            <div className="relative w-full aspect-[16/10.2] rounded-xl overflow-hidden bg-[#060a12] border border-slate-800 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={660}
                height={400}
                className="w-full h-full block"
              />

              {/* Start Screen Overlay */}
              {!isPlaying && !isGameOver && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 z-20">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-lg">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-black text-white">START CYBER SNAKE</h4>
                    <p className="text-xs text-slate-300 font-medium max-w-sm">
                      {gameMode === 'solo'
                        ? 'Collect Next.js & React tech nodes! Steer with WASD or Arrow keys.'
                        : gameMode === 'ai'
                        ? 'Compete against the Senior AI Bot to devour nodes without crashing!'
                        : 'Player 1: WASD Steer | Player 2: Arrow Keys Steer'}
                    </p>
                  </div>

                  <button
                    onClick={startGame}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Launch Grid</span>
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
                      {winner ? `${winner} WINS!` : '💀 SERVER CRASH / GAME OVER'}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      FINAL NODES: P1 {scoreP1} {gameMode !== 'solo' ? `vs P2 ${scoreP2}` : ''} · HIGH SCORE: {highScore}
                    </p>
                  </div>

                  {scoreP1 >= 100 && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold space-y-1 max-w-xs">
                      <span>🏆 High Throughput Architect Unlocked!</span>
                      <p className="text-[11px] text-slate-300 font-normal">
                        Claim a free 30-min Architecture & Scaling Audit with Rowell.
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
                    {scoreP1 >= 100 && (
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

            {/* Mobile Touch Direction Controls */}
            <div className="flex justify-center gap-2 mt-3">
              <button
                onClick={() => {
                  if (gameStateRef.current.dir1 !== 'RIGHT') gameStateRef.current.nextDir1 = 'LEFT';
                }}
                className="px-4 py-2.5 bg-slate-800 active:bg-cyan-500 active:text-slate-950 rounded-xl text-xs font-black select-none text-cyan-300"
              >
                ← LEFT
              </button>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    if (gameStateRef.current.dir1 !== 'DOWN') gameStateRef.current.nextDir1 = 'UP';
                  }}
                  className="px-4 py-1.5 bg-slate-800 active:bg-cyan-500 active:text-slate-950 rounded-xl text-xs font-black select-none text-cyan-300"
                >
                  ↑ UP
                </button>
                <button
                  onClick={() => {
                    if (gameStateRef.current.dir1 !== 'UP') gameStateRef.current.nextDir1 = 'DOWN';
                  }}
                  className="px-4 py-1.5 bg-slate-800 active:bg-cyan-500 active:text-slate-950 rounded-xl text-xs font-black select-none text-cyan-300"
                >
                  ↓ DOWN
                </button>
              </div>
              <button
                onClick={() => {
                  if (gameStateRef.current.dir1 !== 'LEFT') gameStateRef.current.nextDir1 = 'RIGHT';
                }}
                className="px-4 py-2.5 bg-slate-800 active:bg-cyan-500 active:text-slate-950 rounded-xl text-xs font-black select-none text-cyan-300"
              >
                RIGHT →
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Controls, Nodes & Audit Reward (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Controls Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Controls Guide
            </h4>
            <div className="space-y-2 text-xs text-slate-300 font-medium">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-300">P1 Snake:</span>
                <span className="font-mono text-white font-bold"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">W</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">A</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">S</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">D</kbd></span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-amber-300">P2 Snake:</span>
                <span className="font-mono text-white font-bold"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↑</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">←</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↓</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">→</kbd></span>
              </div>
            </div>
          </div>

          {/* Node Values */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Technology Nodes
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center justify-between">
                <span className="text-cyan-400">✦ Standard Tech Node (React / Next)</span>
                <strong className="text-white">+10 PTS</strong>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-amber-400">⭐ Golden Neon Super-Node</span>
                <strong className="text-amber-400">+35 PTS</strong>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-purple-400">⚡ Turbo Speed Cluster</span>
                <strong className="text-purple-400">+20 PTS</strong>
              </li>
            </ul>
          </div>

          {/* Audit Reward Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-indigo-950 border border-cyan-400/40 space-y-2.5">
            <div className="flex items-center gap-2 text-cyan-300">
              <Trophy className="w-4 h-4" />
              <h4 className="text-xs font-black uppercase tracking-wider">Score 100+ Nodes</h4>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              Devour 100+ technology nodes to claim a <strong>Free 30-Min Architecture & Scaling Consultation</strong> with Rowell.
            </p>
            <button
              onClick={() => setShowRewardModal(true)}
              className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all shadow-md"
            >
              <span>Book Consultation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      <ContactModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        defaultService="Cyber Snake Champion — Scaling Consultation"
      />
    </div>
  );
}
