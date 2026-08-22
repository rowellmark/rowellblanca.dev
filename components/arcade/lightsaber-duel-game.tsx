'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Swords,
  Shield,
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
} from 'lucide-react';
import { ContactModal } from '@/components/ui/contact-modal';

type DuelMode = 'ai' | 'local';
type AiRank = 'apprentice' | 'knight' | 'master';

interface Fighter {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  hp: number;
  maxHp: number;
  force: number;
  maxForce: number;
  state: 'idle' | 'run' | 'jump' | 'attack' | 'parry' | 'hit' | 'special';
  attackTimer: number;
  parryTimer: number;
  hitTimer: number;
  facing: 1 | -1; // 1 = right, -1 = left
  color: string;
  saberColor: string;
  saberGlow: string;
  combo: number;
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

interface SlashWave {
  x: number;
  y: number;
  vx: number;
  radius: number;
  color: string;
  damage: number;
  owner: 'p1' | 'p2';
}

export function LightsaberDuelGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<'p1' | 'p2' | null>(null);
  const [gameMode, setGameMode] = useState<DuelMode>('ai');
  const [aiRank, setAiRank] = useState<AiRank>('knight');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [p1AutoPilot, setP1AutoPilot] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const [p1HpDisplay, setP1HpDisplay] = useState(100);
  const [p2HpDisplay, setP2HpDisplay] = useState(100);
  const [p1ForceDisplay, setP1ForceDisplay] = useState(100);
  const [p2ForceDisplay, setP2ForceDisplay] = useState(100);
  const [clashCount, setClashCount] = useState(0);

  // Audio synthesizer helper (Self-contained Web Audio API)
  const playSound = useCallback(
    (type: 'ignite' | 'swing' | 'clash' | 'parry' | 'force' | 'hit' | 'win') => {
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

        if (type === 'swing') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(360, now + 0.12);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
        } else if (type === 'clash') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.linearRampToValueAtTime(160, now + 0.15);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
        } else if (type === 'parry') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(980, now);
          osc.frequency.exponentialRampToValueAtTime(1400, now + 0.2);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
        } else if (type === 'force') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(120, now);
          osc.frequency.linearRampToValueAtTime(480, now + 0.25);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (type === 'hit') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.linearRampToValueAtTime(60, now + 0.2);
          gain.gain.setValueAtTime(0.22, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
        } else if (type === 'ignite') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(100, now);
          osc.frequency.exponentialRampToValueAtTime(440, now + 0.25);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
        } else if (type === 'win') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.setValueAtTime(554, now + 0.1);
          osc.frequency.setValueAtTime(659, now + 0.2);
          osc.frequency.setValueAtTime(880, now + 0.3);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
          osc.start(now);
          osc.stop(now + 0.5);
        }
      } catch (e) {}
    },
    [soundEnabled]
  );

  // Internal Game State
  const gameStateRef = useRef<{
    p1: Fighter;
    p2: Fighter;
    sparks: Spark[];
    waves: SlashWave[];
    clashes: number;
    keys: {
      a: boolean;
      d: boolean;
      w: boolean;
      j: boolean;
      k: boolean;
      l: boolean;
      left: boolean;
      right: boolean;
      up: boolean;
      num1: boolean;
      num2: boolean;
      num3: boolean;
    };
    animationId: number;
  }>({
    p1: {
      x: 120,
      y: 260,
      vx: 0,
      vy: 0,
      width: 36,
      height: 64,
      isGrounded: true,
      hp: 100,
      maxHp: 100,
      force: 100,
      maxForce: 100,
      state: 'idle',
      attackTimer: 0,
      parryTimer: 0,
      hitTimer: 0,
      facing: 1,
      color: '#38bdf8',
      saberColor: '#00f0ff',
      saberGlow: 'rgba(0, 240, 255, 0.8)',
      combo: 0,
    },
    p2: {
      x: 520,
      y: 260,
      vx: 0,
      vy: 0,
      width: 36,
      height: 64,
      isGrounded: true,
      hp: 100,
      maxHp: 100,
      force: 100,
      maxForce: 100,
      state: 'idle',
      attackTimer: 0,
      parryTimer: 0,
      hitTimer: 0,
      facing: -1,
      color: '#f43f5e',
      saberColor: '#ff0055',
      saberGlow: 'rgba(255, 0, 85, 0.8)',
      combo: 0,
    },
    sparks: [],
    waves: [],
    clashes: 0,
    keys: {
      a: false,
      d: false,
      w: false,
      j: false,
      k: false,
      l: false,
      left: false,
      right: false,
      up: false,
      num1: false,
      num2: false,
      num3: false,
    },
    animationId: 0,
  });

  const startDuel = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setWinner(null);
    setP1HpDisplay(100);
    setP2HpDisplay(100);
    setP1ForceDisplay(100);
    setP2ForceDisplay(100);
    setClashCount(0);

    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 680;
    const floorY = 270;

    gameStateRef.current.p1 = {
      x: width * 0.2,
      y: floorY,
      vx: 0,
      vy: 0,
      width: 36,
      height: 64,
      isGrounded: true,
      hp: 100,
      maxHp: 100,
      force: 100,
      maxForce: 100,
      state: 'idle',
      attackTimer: 0,
      parryTimer: 0,
      hitTimer: 0,
      facing: 1,
      color: '#38bdf8',
      saberColor: '#00f0ff',
      saberGlow: 'rgba(0, 240, 255, 0.9)',
      combo: 0,
    };

    gameStateRef.current.p2 = {
      x: width * 0.8 - 36,
      y: floorY,
      vx: 0,
      vy: 0,
      width: 36,
      height: 64,
      isGrounded: true,
      hp: 100,
      maxHp: 100,
      force: 100,
      maxForce: 100,
      state: 'idle',
      attackTimer: 0,
      parryTimer: 0,
      hitTimer: 0,
      facing: -1,
      color: '#f43f5e',
      saberColor: '#ff0055',
      saberGlow: 'rgba(255, 0, 85, 0.9)',
      combo: 0,
    };

    gameStateRef.current.sparks = [];
    gameStateRef.current.waves = [];
    gameStateRef.current.clashes = 0;

    playSound('ignite');
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = gameStateRef.current.keys;
      if (['KeyA', 'a', 'A'].includes(e.key) || e.code === 'KeyA') k.a = true;
      if (['KeyD', 'd', 'D'].includes(e.key) || e.code === 'KeyD') k.d = true;
      if (['KeyW', 'w', 'W'].includes(e.key) || e.code === 'KeyW') k.w = true;
      if (['KeyJ', 'j', 'J'].includes(e.key) || e.code === 'KeyJ') k.j = true;
      if (['KeyK', 'k', 'K'].includes(e.key) || e.code === 'KeyK') k.k = true;
      if (['KeyL', 'l', 'L'].includes(e.key) || e.code === 'KeyL') k.l = true;

      if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') k.left = true;
      if (e.key === 'ArrowRight' || e.code === 'ArrowRight') k.right = true;
      if (e.key === 'ArrowUp' || e.code === 'ArrowUp') k.up = true;
      if (['Digit1', 'Numpad1', '1'].includes(e.key)) k.num1 = true;
      if (['Digit2', 'Numpad2', '2'].includes(e.key)) k.num2 = true;
      if (['Digit3', 'Numpad3', '3'].includes(e.key)) k.num3 = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = gameStateRef.current.keys;
      if (['KeyA', 'a', 'A'].includes(e.key) || e.code === 'KeyA') k.a = false;
      if (['KeyD', 'd', 'D'].includes(e.key) || e.code === 'KeyD') k.d = false;
      if (['KeyW', 'w', 'W'].includes(e.key) || e.code === 'KeyW') k.w = false;
      if (['KeyJ', 'j', 'J'].includes(e.key) || e.code === 'KeyJ') k.j = false;
      if (['KeyK', 'k', 'K'].includes(e.key) || e.code === 'KeyK') k.k = false;
      if (['KeyL', 'l', 'L'].includes(e.key) || e.code === 'KeyL') k.l = false;

      if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') k.left = false;
      if (e.key === 'ArrowRight' || e.code === 'ArrowRight') k.right = false;
      if (e.key === 'ArrowUp' || e.code === 'ArrowUp') k.up = false;
      if (['Digit1', 'Numpad1', '1'].includes(e.key)) k.num1 = false;
      if (['Digit2', 'Numpad2', '2'].includes(e.key)) k.num2 = false;
      if (['Digit3', 'Numpad3', '3'].includes(e.key)) k.num3 = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Canvas Render & Combat Loop
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    const gravity = 0.55;
    const floorY = 270;

    const loop = () => {
      if (!isRunning) return;

      const state = gameStateRef.current;
      const { p1, p2, keys } = state;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear background & Cyber Temple Arena
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      // Cyber grid background
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Temple Floor Platform
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(20, floorY + 64, width - 40, 40);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.strokeRect(20, floorY + 64, width - 40, 40);

      // Floor Neon Glow line
      ctx.strokeStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(20, floorY + 64);
      ctx.lineTo(width - 20, floorY + 64);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 2. Recharge Force Energy over time
      p1.force = Math.min(p1.maxForce, p1.force + 0.15);
      p2.force = Math.min(p2.maxForce, p2.force + 0.15);

      // 3. Handle Player 1 Controls (Manual or AI Auto-Pilot)
      const moveSpeed = 4.2;
      if (p1AutoPilot) {
        // AI Auto-Pilot algorithm for Player 1
        const dist = Math.abs(p2.x - p1.x);
        p1.facing = p2.x > p1.x ? 1 : -1;

        if (dist > 75) {
          p1.vx = p1.facing * moveSpeed;
        } else {
          p1.vx = 0;
          if (p2.state === 'attack' && Math.random() < 0.7) {
            p1.state = 'parry';
            p1.parryTimer = 18;
          } else if (p1.attackTimer <= 0) {
            p1.state = 'attack';
            p1.attackTimer = 16;
            playSound('swing');
          }
        }
        if (p1.force >= 35 && dist > 140 && Math.random() < 0.04) {
          p1.force -= 35;
          state.waves.push({
            x: p1.x + (p1.facing === 1 ? p1.width + 10 : -10),
            y: p1.y + p1.height / 2,
            vx: p1.facing * 7,
            radius: 14,
            color: p1.saberColor,
            damage: 22,
            owner: 'p1',
          });
          playSound('force');
        }
      } else {
        // Manual controls
        if (keys.a) {
          p1.vx = -moveSpeed;
          p1.facing = -1;
        } else if (keys.d) {
          p1.vx = moveSpeed;
          p1.facing = 1;
        } else {
          p1.vx = 0;
        }

        if (keys.w && p1.isGrounded) {
          p1.vy = -12;
          p1.isGrounded = false;
        }

        // Attacks & Parries
        if (keys.j && p1.attackTimer <= 0 && p1.parryTimer <= 0) {
          p1.state = 'attack';
          p1.attackTimer = 16;
          playSound('swing');
        }

        if (keys.k && p1.parryTimer <= 0) {
          p1.state = 'parry';
          p1.parryTimer = 22;
        }

        // Force Blast
        if (keys.l && p1.force >= 35) {
          p1.force -= 35;
          keys.l = false;
          state.waves.push({
            x: p1.x + (p1.facing === 1 ? p1.width + 10 : -10),
            y: p1.y + p1.height / 2,
            vx: p1.facing * 7,
            radius: 14,
            color: p1.saberColor,
            damage: 22,
            owner: 'p1',
          });
          playSound('force');
        }
      }

      // 4. Handle Player 2 Controls (Local or AI Opponent)
      if (gameMode === 'local') {
        if (keys.left) {
          p2.vx = -moveSpeed;
          p2.facing = -1;
        } else if (keys.right) {
          p2.vx = moveSpeed;
          p2.facing = 1;
        } else {
          p2.vx = 0;
        }

        if (keys.up && p2.isGrounded) {
          p2.vy = -12;
          p2.isGrounded = false;
        }

        if (keys.num1 && p2.attackTimer <= 0 && p2.parryTimer <= 0) {
          p2.state = 'attack';
          p2.attackTimer = 16;
          playSound('swing');
        }

        if (keys.num2 && p2.parryTimer <= 0) {
          p2.state = 'parry';
          p2.parryTimer = 22;
        }

        if (keys.num3 && p2.force >= 35) {
          p2.force -= 35;
          keys.num3 = false;
          state.waves.push({
            x: p2.x + (p2.facing === 1 ? p2.width + 10 : -10),
            y: p2.y + p2.height / 2,
            vx: p2.facing * 7,
            radius: 14,
            color: p2.saberColor,
            damage: 22,
            owner: 'p2',
          });
          playSound('force');
        }
      } else if (gameMode === 'ai') {
        // Advanced Combat AI Behavior
        const dist = Math.abs(p1.x - p2.x);
        p2.facing = p1.x > p2.x ? 1 : -1;

        const aiSpeed = aiRank === 'master' ? 4.5 : aiRank === 'knight' ? 3.6 : 2.5;
        const parryChance = aiRank === 'master' ? 0.75 : aiRank === 'knight' ? 0.45 : 0.2;

        if (dist > 75) {
          p2.vx = p2.facing * aiSpeed;
        } else {
          p2.vx = 0;
          if (p1.state === 'attack' && Math.random() < parryChance) {
            p2.state = 'parry';
            p2.parryTimer = 18;
          } else if (p2.attackTimer <= 0) {
            p2.state = 'attack';
            p2.attackTimer = 16;
            playSound('swing');
          }
        }

        // AI Force Wave Cast
        if (p2.force >= 40 && dist > 150 && Math.random() < 0.035) {
          p2.force -= 40;
          state.waves.push({
            x: p2.x + (p2.facing === 1 ? p2.width + 10 : -10),
            y: p2.y + p2.height / 2,
            vx: p2.facing * 7,
            radius: 14,
            color: p2.saberColor,
            damage: 22,
            owner: 'p2',
          });
          playSound('force');
        }
      }

      // 5. Physics & Boundary Checks for both fighters
      [p1, p2].forEach((f) => {
        f.x += f.vx;
        f.y += f.vy;

        if (!f.isGrounded) {
          f.vy += gravity;
        }

        // Floor collision
        if (f.y >= floorY) {
          f.y = floorY;
          f.vy = 0;
          f.isGrounded = true;
        }

        // Stage bounds
        f.x = Math.max(30, Math.min(width - 30 - f.width, f.x));

        // Timers update
        if (f.attackTimer > 0) {
          f.attackTimer--;
          if (f.attackTimer <= 0) f.state = 'idle';
        }
        if (f.parryTimer > 0) {
          f.parryTimer--;
          if (f.parryTimer <= 0) f.state = 'idle';
        }
        if (f.hitTimer > 0) f.hitTimer--;
      });

      // 6. Blade Clash & Hit Box Collision Logic
      const dist = Math.abs((p1.x + p1.width / 2) - (p2.x + p2.width / 2));
      const inRange = dist < 72;

      if (inRange) {
        // Scenario A: Both attack at same time -> BLADE CLASH!
        if (p1.attackTimer === 10 && p2.attackTimer === 10) {
          state.clashes++;
          setClashCount(state.clashes);
          p1.vx = -p1.facing * 5;
          p2.vx = -p2.facing * 5;
          playSound('clash');

          // Sparks explosion
          for (let s = 0; s < 25; s++) {
            state.sparks.push({
              x: (p1.x + p2.x) / 2 + 15,
              y: floorY + 25,
              vx: (Math.random() - 0.5) * 10,
              vy: (Math.random() - 0.5) * 10,
              life: 25,
              color: '#ffffff',
              size: Math.random() * 3 + 1,
            });
          }
        }
        // Scenario B: P1 attacks P2
        else if (p1.attackTimer === 10) {
          if (p2.state === 'parry') {
            // P2 successfully Parried P1
            p1.hitTimer = 15;
            p1.vx = -p1.facing * 6;
            playSound('parry');
            for (let s = 0; s < 15; s++) {
              state.sparks.push({
                x: p2.x + 10,
                y: p2.y + 25,
                vx: -p2.facing * (Math.random() * 6 + 2),
                vy: (Math.random() - 0.5) * 6,
                life: 20,
                color: '#38bdf8',
                size: 2.5,
              });
            }
          } else {
            // Direct Saber Hit on P2!
            p2.hp = Math.max(0, p2.hp - 14);
            p2.hitTimer = 12;
            p2.vx = p1.facing * 5;
            playSound('hit');
            for (let s = 0; s < 18; s++) {
              state.sparks.push({
                x: p2.x + 15,
                y: p2.y + 30,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 20,
                color: '#f43f5e',
                size: 2.5,
              });
            }
          }
        }
        // Scenario C: P2 attacks P1
        else if (p2.attackTimer === 10) {
          if (p1.state === 'parry') {
            // P1 successfully Parried P2
            p2.hitTimer = 15;
            p2.vx = -p2.facing * 6;
            playSound('parry');
            for (let s = 0; s < 15; s++) {
              state.sparks.push({
                x: p1.x + 10,
                y: p1.y + 25,
                vx: -p1.facing * (Math.random() * 6 + 2),
                vy: (Math.random() - 0.5) * 6,
                life: 20,
                color: '#ff0055',
                size: 2.5,
              });
            }
          } else {
            // Direct Saber Hit on P1!
            p1.hp = Math.max(0, p1.hp - 14);
            p1.hitTimer = 12;
            p1.vx = p2.facing * 5;
            playSound('hit');
            for (let s = 0; s < 18; s++) {
              state.sparks.push({
                x: p1.x + 15,
                y: p1.y + 30,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 20,
                color: '#38bdf8',
                size: 2.5,
              });
            }
          }
        }
      }

      // 7. Update & Render Force Waves
      for (let w = state.waves.length - 1; w >= 0; w--) {
        const wave = state.waves[w];
        wave.x += wave.vx;

        // Render Wave
        ctx.fillStyle = wave.color;
        ctx.shadowColor = wave.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Collision with opponent
        const target = wave.owner === 'p1' ? p2 : p1;
        const hit = Math.abs(wave.x - (target.x + target.width / 2)) < 24 && Math.abs(wave.y - (target.y + target.height / 2)) < 36;

        if (hit) {
          if (target.state === 'parry') {
            target.vx = wave.vx * 0.5;
            playSound('parry');
          } else {
            target.hp = Math.max(0, target.hp - wave.damage);
            target.vx = wave.vx * 1.2;
            target.hitTimer = 12;
            playSound('hit');
          }
          state.waves.splice(w, 1);
          continue;
        }

        // Out of bounds
        if (wave.x < 0 || wave.x > width) {
          state.waves.splice(w, 1);
        }
      }

      // 8. Render Sparks
      for (let s = state.sparks.length - 1; s >= 0; s--) {
        const spark = state.sparks[s];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.life--;
        ctx.fillStyle = spark.color;
        ctx.fillRect(spark.x, spark.y, spark.size, spark.size);
        if (spark.life <= 0) state.sparks.splice(s, 1);
      }

      // 9. Render Fighters & Lightsabers
      const renderFighter = (f: Fighter) => {
        // Shadow on floor
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(f.x + f.width / 2, floorY + 62, 22, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Fighter Body (Ninja / Jedi Silhouette with glowing tech armor)
        ctx.fillStyle = f.hitTimer > 0 ? '#ffffff' : '#1e293b';
        ctx.strokeStyle = f.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(f.x, f.y, f.width, f.height, 8);
        ctx.fill();
        ctx.stroke();

        // Visor glow
        ctx.fillStyle = f.color;
        ctx.shadowColor = f.color;
        ctx.shadowBlur = 8;
        const visorX = f.facing === 1 ? f.x + f.width - 12 : f.x + 4;
        ctx.fillRect(visorX, f.y + 12, 8, 4);
        ctx.shadowBlur = 0;

        // Saber Blade Origin
        const handX = f.facing === 1 ? f.x + f.width + 2 : f.x - 2;
        const handY = f.y + 32;

        let saberAngle = f.facing === 1 ? -Math.PI / 4 : (-3 * Math.PI) / 4;
        let saberLen = 46;

        if (f.state === 'attack') {
          saberAngle = f.facing === 1 ? Math.PI / 8 : (7 * Math.PI) / 8;
          saberLen = 54;
        } else if (f.state === 'parry') {
          saberAngle = f.facing === 1 ? -Math.PI / 2 : -Math.PI / 2;
          saberLen = 48;
        }

        const tipX = handX + Math.cos(saberAngle) * saberLen;
        const tipY = handY + Math.sin(saberAngle) * saberLen;

        // Plasma Lightsaber Blade Glow
        ctx.strokeStyle = f.saberColor;
        ctx.shadowColor = f.saberGlow;
        ctx.shadowBlur = 20;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(handX, handY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        // Core White Plasma Hotspot
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(handX, handY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();
        ctx.shadowBlur = 0;
      };

      renderFighter(p1);
      renderFighter(p2);

      // 10. Update Displays
      setP1HpDisplay(p1.hp);
      setP2HpDisplay(p2.hp);
      setP1ForceDisplay(Math.floor(p1.force));
      setP2ForceDisplay(Math.floor(p2.force));

      // 11. Check Victory
      if (p1.hp <= 0 || p2.hp <= 0) {
        isRunning = false;
        setIsPlaying(false);
        setIsGameOver(true);
        setWinner(p1.hp > 0 ? 'p1' : 'p2');
        playSound('win');
        return;
      }

      state.animationId = requestAnimationFrame(loop);
    };

    const animId = gameStateRef.current.animationId;

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, gameMode, aiRank, playSound, p1AutoPilot]);

  return (
    <div className="w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white font-sans space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Swords className="w-4 h-4" />
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">Lightsaber Duel: Cyber Blade Arena</h3>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Real-time fighting game. Execute blade strikes, parry incoming attacks, and unleash Force blasts!
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => {
              setGameMode('ai');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              gameMode === 'ai' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" /> <span>vs AI Boss</span>
          </button>
          <button
            onClick={() => {
              setGameMode('local');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              gameMode === 'local' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> <span>Local 2-Player</span>
          </button>
        </div>
      </div>

      {/* Main Duel Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Canvas Battle Screen (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="relative w-full rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-3 overflow-hidden">
            
            {/* Top Match HUD with Health & Force Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 px-4 py-2.5 bg-slate-900/90 rounded-xl border border-slate-800/80 mb-3 text-xs font-mono font-bold">
              
              {/* Player 1 HUD (5 Cols) */}
              <div className="sm:col-span-5 space-y-1">
                <div className="flex items-center justify-between text-cyan-400">
                  <div className="flex items-center gap-1.5">
                    <span>PLAYER 1 (JEDI)</span>
                    <button
                      onClick={() => setP1AutoPilot(!p1AutoPilot)}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-sans uppercase font-black transition-all ${
                        p1AutoPilot ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p1AutoPilot ? 'AI Driving' : 'AI Pilot'}
                    </button>
                  </div>
                  <span>{p1HpDisplay}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-200"
                    style={{ width: `${p1HpDisplay}%` }}
                  />
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-200"
                    style={{ width: `${p1ForceDisplay}%` }}
                  />
                </div>
              </div>

              {/* Center Clash Counter (2 Cols) */}
              <div className="sm:col-span-2 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-slate-400">CLASHES</span>
                <span className="text-sm font-black text-amber-400">{clashCount}</span>
              </div>

              {/* Player 2 / AI Boss HUD (5 Cols) */}
              <div className="sm:col-span-5 space-y-1">
                <div className="flex items-center justify-between text-rose-400">
                  <span>{p2HpDisplay}%</span>
                  <span>{gameMode === 'ai' ? 'SITH ARCHITECT (AI)' : 'PLAYER 2'}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-rose-500 transition-all duration-200"
                    style={{ width: `${p2HpDisplay}%` }}
                  />
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 transition-all duration-200"
                    style={{ width: `${p2ForceDisplay}%` }}
                  />
                </div>
              </div>

            </div>

            {/* Canvas Viewport */}
            <div className="relative w-full aspect-[16/9.2] rounded-xl overflow-hidden bg-[#060a12] border border-slate-800 flex items-center justify-center">
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
                    <Swords className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-black text-white">IGNITE YOUR LIGHTSABER</h4>
                    <p className="text-xs text-slate-300 font-medium max-w-sm">
                      {gameMode === 'ai'
                        ? 'Duel the Senior AI Sith Architect! Strike with J, Parry with K, and Blast with L.'
                        : 'Player 1: A/D Move · J Slash · K Parry · L Force | Player 2: Arrows Move · 1 Slash · 2 Parry · 3 Force'}
                    </p>
                  </div>

                  {gameMode === 'ai' && (
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-slate-400">AI Difficulty:</span>
                      {(['apprentice', 'knight', 'master'] as AiRank[]).map((rank) => (
                        <button
                          key={rank}
                          onClick={() => setAiRank(rank)}
                          className={`px-3 py-1 rounded-lg uppercase tracking-wider text-[10px] ${
                            aiRank === rank
                              ? 'bg-amber-400 text-slate-950 font-black'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {rank}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={startDuel}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Ignite Plasma Blades</span>
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
                      {winner === 'p1' ? '🎉 JEDI KNIGHT VICTORIOUS!' : '👑 SITH LORD WINS THE DUEL!'}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      FINAL HP: P1 {p1HpDisplay}% vs P2 {p2HpDisplay}% · CLASHES: {clashCount}
                    </p>
                  </div>

                  {winner === 'p1' && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold space-y-1 max-w-xs">
                      <span>🏆 Lightsaber Grandmaster Unlocked!</span>
                      <p className="text-[11px] text-slate-300 font-normal">
                        You defeated the AI Boss! Claim a free 30-min Architecture & Speed Audit.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={startDuel}
                      className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Play Again</span>
                    </button>
                    {winner === 'p1' && (
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

            {/* Mobile Touch Combat Pads */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="flex gap-2">
                <button
                  onMouseDown={() => (gameStateRef.current.keys.a = true)}
                  onMouseUp={() => (gameStateRef.current.keys.a = false)}
                  onTouchStart={() => (gameStateRef.current.keys.a = true)}
                  onTouchEnd={() => (gameStateRef.current.keys.a = false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-cyan-500 active:text-slate-950 rounded-xl text-xs font-black select-none text-cyan-300"
                >
                  ← MOVE
                </button>
                <button
                  onMouseDown={() => (gameStateRef.current.keys.d = true)}
                  onMouseUp={() => (gameStateRef.current.keys.d = false)}
                  onTouchStart={() => (gameStateRef.current.keys.d = true)}
                  onTouchEnd={() => (gameStateRef.current.keys.d = false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-cyan-500 active:text-slate-950 rounded-xl text-xs font-black select-none text-cyan-300"
                >
                  MOVE →
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onMouseDown={() => (gameStateRef.current.keys.j = true)}
                  onMouseUp={() => (gameStateRef.current.keys.j = false)}
                  onTouchStart={() => (gameStateRef.current.keys.j = true)}
                  onTouchEnd={() => (gameStateRef.current.keys.j = false)}
                  className="flex-1 py-2.5 bg-rose-600/80 hover:bg-rose-500 active:bg-rose-400 rounded-xl text-xs font-black select-none text-white shadow-md"
                >
                  ⚔️ SLASH
                </button>
                <button
                  onMouseDown={() => (gameStateRef.current.keys.k = true)}
                  onMouseUp={() => (gameStateRef.current.keys.k = false)}
                  onTouchStart={() => (gameStateRef.current.keys.k = true)}
                  onTouchEnd={() => (gameStateRef.current.keys.k = false)}
                  className="flex-1 py-2.5 bg-cyan-600/80 hover:bg-cyan-500 active:bg-cyan-400 rounded-xl text-xs font-black select-none text-white shadow-md"
                >
                  🛡️ PARRY
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Controls, Combat Moves & Lead Reward (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Controls Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Combat Controls Guide
            </h4>
            <div className="space-y-2 text-xs text-slate-300 font-medium">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-300">Move / Jump:</span>
                <span className="font-mono text-white font-bold"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">A</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">D</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">W</kbd></span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-rose-300">Saber Slash:</span>
                <span className="font-mono text-white font-bold"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">J</kbd> (Inflicts -14 HP)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-amber-300">Saber Parry:</span>
                <span className="font-mono text-white font-bold"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">K</kbd> (Staggers Foe)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-blue-300">Force Blast:</span>
                <span className="font-mono text-white font-bold"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">L</kbd> (-22 HP Wave)</span>
              </div>
            </div>
          </div>

          {/* Combat Mechanics Tip */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Grandmaster Combat Tips
            </h4>
            <ul className="space-y-1.5 text-[11px] leading-relaxed">
              <li className="flex items-center gap-1.5">
                <span className="text-cyan-400">✦</span>
                <span><strong>Simultaneous Strikes:</strong> Causes sparks & blade clash!</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-amber-400">✦</span>
                <span><strong>Timed Parry:</strong> Deflects attacks & pushes opponent back.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-blue-400">✦</span>
                <span><strong>Force Wave:</strong> Uses 35% Force bar for long-range poke.</span>
              </li>
            </ul>
          </div>

          {/* Architecture Audit Reward Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-indigo-950 border border-cyan-400/40 space-y-2.5">
            <div className="flex items-center gap-2 text-cyan-300">
              <Trophy className="w-4 h-4" />
              <h4 className="text-xs font-black uppercase tracking-wider">Defeat the Sith Boss</h4>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              Win the duel against the Senior AI Boss to claim a <strong>Free 30-Min Architecture & Code Review</strong>.
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
        defaultService="Lightsaber Champion — Architecture Audit"
      />
    </div>
  );
}
