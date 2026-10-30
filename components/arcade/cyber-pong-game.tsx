'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Zap,
  Play,
  RotateCcw,
  Trophy,
  Volume2,
  VolumeX,
  Users,
  Bot,
  Sparkles,
  Award,
  ChevronRight,
  Shield,
  Flame,
  Radio,
} from 'lucide-react';
import { ContactModal } from '@/components/ui/contact-modal';
import { createFrameStepper, getAudioContext, prepareCanvas } from './engine';

type GameMode = 'ai' | 'local' | 'room';
type AiDifficulty = 'easy' | 'medium' | 'hard';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  speed: number;
  color: string;
  isMulti?: boolean;
  spin?: number; // Topspin/backspin from a moving paddle; curves the ball (Magnus effect)
  trail?: { x: number; y: number }[];
}

const MAX_BALL_SPEED = 12.5;
const MAX_BOUNCE_ANGLE = (55 * Math.PI) / 180;

/** Where will the ball cross x = targetX? Follows wall bounces, ignores spin (as a human would). */
function predictBallY(ball: Ball, targetX: number, height: number) {
  if (ball.vx === 0) return ball.y;
  const t = (targetX - ball.x) / ball.vx;
  if (t < 0) return ball.y;
  const span = height - ball.radius * 2;
  let y = ball.y - ball.radius + ball.vy * t;
  y = ((y % (2 * span)) + 2 * span) % (2 * span);
  return (y > span ? 2 * span - y : y) + ball.radius;
}

interface PowerUp {
  x: number;
  y: number;
  radius: number;
  type: 'multiball' | 'speed' | 'grow' | 'shield';
  label: string;
  color: string;
  icon: string;
  active: boolean;
}

export function CyberPongGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<'p1' | 'p2' | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [aiDifficulty, setAiDifficulty] = useState<AiDifficulty>('medium');
  const [scoreP1, setScoreP1] = useState(0);
  const [scoreP2, setScoreP2] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [p1AutoPilot, setP1AutoPilot] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rallyCount, setRallyCount] = useState(0);
  const [roomCode, setRoomCode] = useState('');
  const [roomInput, setRoomInput] = useState('');
  const [isHost, setIsHost] = useState(true);

  // Audio synthesizer helper
  const playSound = useCallback(
    (type: 'paddle' | 'wall' | 'score' | 'powerup' | 'win') => {
      if (!soundEnabled || typeof window === 'undefined') return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;

        if (type === 'paddle') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(480, now + 0.08);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        } else if (type === 'wall') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(220, now);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
        } else if (type === 'powerup') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(1040, now + 0.2);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
        } else if (type === 'score') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(280, now);
          osc.frequency.linearRampToValueAtTime(140, now + 0.25);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (type === 'win') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.setValueAtTime(554, now + 0.1);
          osc.frequency.setValueAtTime(659, now + 0.2);
          osc.frequency.setValueAtTime(880, now + 0.3);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
          osc.start(now);
          osc.stop(now + 0.5);
        }
      } catch (e) {}
    },
    [soundEnabled]
  );

  // BroadcastChannel for cross-tab multiplayer
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('cyber_pong_channel');
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'PADDLE_MOVE' && gameMode === 'room') {
          if (isHost) {
            gameStateRef.current.p2Y = payload.y;
          } else {
            gameStateRef.current.p1Y = payload.y;
          }
        } else if (type === 'GAME_STATE_SYNC' && gameMode === 'room' && !isHost) {
          gameStateRef.current.balls = payload.balls;
          gameStateRef.current.p1Y = payload.p1Y;
          setScoreP1(payload.scoreP1);
          setScoreP2(payload.scoreP2);
        }
      };

      return () => {
        channel.close();
      };
    }
  }, [gameMode, isHost]);

  // Game internal state
  const gameStateRef = useRef({
    p1Y: 150,
    p2Y: 150,
    p1Height: 80,
    p2Height: 80,
    paddleWidth: 12,
    p1Speed: 6,
    p2Speed: 6,
    p1Vel: 0,
    p2Vel: 0,
    p1Flash: 0,
    p2Flash: 0,
    shake: 0,
    aiError: 0,
    balls: [] as Ball[],
    powerUps: [] as PowerUp[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
    keys: { w: false, s: false, up: false, down: false },
    scoreP1: 0,
    scoreP2: 0,
    rally: 0,
    lastPowerUpSpawn: Date.now(),
    animationId: 0,
  });

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setWinner(null);
    setScoreP1(0);
    setScoreP2(0);
    setRallyCount(0);

    const canvas = canvasRef.current;
    const width = 620;
    const height = 370;

    gameStateRef.current = {
      p1Y: height / 2 - 40,
      p2Y: height / 2 - 40,
      p1Height: 80,
      p2Height: 80,
      paddleWidth: 12,
      p1Speed: 6,
      p2Speed: 6,
      p1Vel: 0,
      p2Vel: 0,
      p1Flash: 0,
      p2Flash: 0,
      shake: 0,
      aiError: 0,
      balls: [
        {
          x: width / 2,
          y: height / 2,
          vx: (Math.random() > 0.5 ? 1 : -1) * 4.5,
          vy: (Math.random() * 2 - 1) * 3,
          radius: 7,
          speed: 4.5,
          color: '#38bdf8',
        },
      ],
      powerUps: [],
      particles: [],
      keys: { w: false, s: false, up: false, down: false },
      scoreP1: 0,
      scoreP2: 0,
      rally: 0,
      lastPowerUpSpawn: Date.now(),
      animationId: 0,
    };
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['KeyW', 'w', 'W'].includes(e.key) || e.code === 'KeyW') gameStateRef.current.keys.w = true;
      if (['KeyS', 's', 'S'].includes(e.key) || e.code === 'KeyS') gameStateRef.current.keys.s = true;
      if (e.key === 'ArrowUp' || e.code === 'ArrowUp') gameStateRef.current.keys.up = true;
      if (e.key === 'ArrowDown' || e.code === 'ArrowDown') gameStateRef.current.keys.down = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['KeyW', 'w', 'W'].includes(e.key) || e.code === 'KeyW') gameStateRef.current.keys.w = false;
      if (['KeyS', 's', 'S'].includes(e.key) || e.code === 'KeyS') gameStateRef.current.keys.s = false;
      if (e.key === 'ArrowUp' || e.code === 'ArrowUp') gameStateRef.current.keys.up = false;
      if (e.key === 'ArrowDown' || e.code === 'ArrowDown') gameStateRef.current.keys.down = false;
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
    const ctx = prepareCanvas(canvas, 620, 370);
    if (!ctx) return;

    let isRunning = true;

    const stepper = createFrameStepper();

    const resetBall = (direction: 1 | -1) => {
      const width = 620;
      const height = 370;
      gameStateRef.current.balls = [
        {
          x: width / 2,
          y: height / 2,
          vx: direction * 4.5,
          vy: (Math.random() * 2 - 1) * 3,
          radius: 7,
          speed: 4.5,
          color: '#38bdf8',
        },
      ];
      gameStateRef.current.rally = 0;
      setRallyCount(0);
    };

    const loop = () => {
      if (!isRunning) return;

      const state = gameStateRef.current;
      const width = 620;
      const height = 370;

      // 1. Clear background (with a brief camera shake after hard hits)
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      if (state.shake > 0) {
        ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);
        state.shake *= 0.8;
        if (state.shake < 0.3) state.shake = 0;
      }

      // Cyber Grid Center Net
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center glowing circle
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 48, 0, Math.PI * 2);
      ctx.stroke();

      // 2-3. Paddles have momentum: input accelerates, friction settles them.
      // The AI reads the ball's path (bounces included) and aims with a per-rally error.
      const movePaddle = (side: 'p1' | 'p2', dir: number) => {
        const velKey = side === 'p1' ? 'p1Vel' : 'p2Vel';
        const yKey = side === 'p1' ? 'p1Y' : 'p2Y';
        const hKey = side === 'p1' ? 'p1Height' : 'p2Height';
        state[velKey] = Math.max(-7, Math.min(7, state[velKey] * 0.78 + dir * 1.55));
        state[yKey] += state[velKey];
        const clamped = Math.max(10, Math.min(height - state[hKey] - 10, state[yKey]));
        if (clamped !== state[yKey]) state[velKey] = 0;
        state[yKey] = clamped;
      };
      const aiDir = (side: 'p1' | 'p2', maxSpeedFactor: number, deadZone: number) => {
        const isLeft = side === 'p1';
        const paddleY = isLeft ? state.p1Y : state.p2Y;
        const h = isLeft ? state.p1Height : state.p2Height;
        const incoming = state.balls
          .filter((b) => (isLeft ? b.vx < 0 : b.vx > 0))
          .sort((a, b) => Math.abs(a.x - (isLeft ? 25 : width - 25)) - Math.abs(b.x - (isLeft ? 25 : width - 25)))[0];
        const target = incoming
          ? predictBallY(incoming, isLeft ? 25 + state.paddleWidth : width - 25 - state.paddleWidth, height) + state.aiError * (isLeft ? 0.3 : 1)
          : height / 2;
        const diff = target - (paddleY + h / 2);
        if (Math.abs(diff) < deadZone) return 0;
        return Math.max(-1, Math.min(1, diff / 40)) * maxSpeedFactor;
      };

      if (p1AutoPilot) movePaddle('p1', aiDir('p1', 0.9, 6));
      else if (gameMode !== 'room' || isHost) movePaddle('p1', (state.keys.s ? 1 : 0) - (state.keys.w ? 1 : 0));

      if (gameMode === 'room' && !isHost) {
        // The guest plays the right paddle with W/S; its position is broadcast below
        movePaddle('p2', (state.keys.s ? 1 : 0) - (state.keys.w ? 1 : 0));
      } else if (gameMode === 'local') {
        movePaddle('p2', (state.keys.down ? 1 : 0) - (state.keys.up ? 1 : 0));
      } else if (gameMode === 'ai') {
        const reach = aiDifficulty === 'hard' ? 0.95 : aiDifficulty === 'medium' ? 0.72 : 0.5;
        movePaddle('p2', aiDir('p2', reach, aiDifficulty === 'hard' ? 4 : 10));
      }

      // Broadcast paddle position if in room
      if (gameMode === 'room' && broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({
          type: 'PADDLE_MOVE',
          payload: { y: isHost ? state.p1Y : state.p2Y },
        });
      }

      // 4. Spawn Stack Power-Ups in Center Field
      const now = Date.now();
      if (now - state.lastPowerUpSpawn > 8000 && state.powerUps.length === 0) {
        state.lastPowerUpSpawn = now;
        const PU_TYPES: Array<Omit<PowerUp, 'x' | 'y' | 'radius' | 'active'>> = [
          { type: 'multiball', label: 'Multi-Thread (x2)', color: '#f59e0b', icon: '⚡' },
          { type: 'speed', label: 'Edge Turbo (x1.5)', color: '#06b6d4', icon: '🚀' },
          { type: 'grow', label: 'Cache Shield (+Pad)', color: '#10b981', icon: '🛡️' },
        ];
        const chosen = PU_TYPES[Math.floor(Math.random() * PU_TYPES.length)];
        state.powerUps.push({
          x: width / 2 + (Math.random() * 120 - 60),
          y: height / 2 + (Math.random() * 140 - 70),
          radius: 16,
          type: chosen.type,
          label: chosen.label,
          color: chosen.color,
          icon: chosen.icon,
          active: true,
        });
      }

      // Render Power-Ups
      state.powerUps.forEach((pu) => {
        if (!pu.active) return;
        ctx.fillStyle = pu.color;
        ctx.shadowColor = pu.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(pu.x, pu.y, pu.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pu.icon, pu.x, pu.y);
      });

      // 5. Update & Render Balls
      for (let i = state.balls.length - 1; i >= 0; i--) {
        const ball = state.balls[i];
        // Spin bends the flight path and slowly wears off
        const spin = ball.spin || 0;
        ball.vy += spin * 0.12;
        ball.spin = spin * 0.985;
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.trail = [...(ball.trail || []), { x: ball.x, y: ball.y }].slice(-10);

        // Top / Bottom Wall Collision (pushed back inside so it can't stick in the wall)
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > height) {
          ball.y = ball.y - ball.radius < 0 ? ball.radius : height - ball.radius;
          ball.vy = -ball.vy * 0.96;
          ball.spin = -(ball.spin || 0) * 0.5;
          playSound('wall');
        }

        // Check Power-Up Collision
        state.powerUps.forEach((pu, puIdx) => {
          if (!pu.active) return;
          const dist = Math.hypot(ball.x - pu.x, ball.y - pu.y);
          if (dist < ball.radius + pu.radius) {
            pu.active = false;
            playSound('powerup');

            if (pu.type === 'multiball') {
              state.balls.push({
                x: ball.x,
                y: ball.y,
                vx: -ball.vx,
                vy: -ball.vy,
                radius: 7,
                speed: ball.speed,
                color: '#f59e0b',
                isMulti: true,
              });
            } else if (pu.type === 'speed') {
              ball.vx *= 1.4;
              ball.vy *= 1.4;
              ball.color = '#06b6d4';
            } else if (pu.type === 'grow') {
              if (ball.vx > 0) state.p1Height = Math.min(130, state.p1Height + 25);
              else state.p2Height = Math.min(130, state.p2Height + 25);
            }
            state.powerUps.splice(puIdx, 1);
          }
        });

        // Player 1 Paddle Collision (Left)
        const p1X = 25;
        if (
          ball.x - ball.radius <= p1X + state.paddleWidth &&
          ball.x + ball.radius >= p1X &&
          ball.y + ball.radius >= state.p1Y &&
          ball.y - ball.radius <= state.p1Y + state.p1Height &&
          ball.vx < 0
        ) {
          // Where it lands on the paddle sets the angle; paddle movement adds spin
          const hitOffset = Math.max(-1, Math.min(1, (ball.y - (state.p1Y + state.p1Height / 2)) / (state.p1Height / 2)));
          const angle = hitOffset * MAX_BOUNCE_ANGLE;
          const speed = Math.min(MAX_BALL_SPEED, Math.hypot(ball.vx, ball.vy) * 1.05 + 0.15);
          ball.vx = 1 * Math.cos(angle) * speed;
          ball.vy = Math.sin(angle) * speed + state.p1Vel * 0.3;
          ball.spin = state.p1Vel * 0.06;
          ball.x = p1X + state.paddleWidth + ball.radius;
          state.p1Flash = 10;
          if (speed > 9) state.shake = 5;
          state.aiError = (Math.random() - 0.5) * (aiDifficulty === 'hard' ? 18 : aiDifficulty === 'medium' ? 46 : 80);
          state.rally++;
          setRallyCount(state.rally);
          playSound('paddle');

          // Sparkle Particles
          for (let p = 0; p < 6 + Math.round(speed); p++) {
            state.particles.push({
              x: p1X + state.paddleWidth,
              y: ball.y,
              vx: Math.random() * 4,
              vy: (Math.random() - 0.5) * 4,
              life: 18,
              color: '#38bdf8',
            });
          }
        }

        // Player 2 Paddle Collision (Right)
        const p2X = width - 25 - state.paddleWidth;
        if (
          ball.x + ball.radius >= p2X &&
          ball.x - ball.radius <= p2X + state.paddleWidth &&
          ball.y + ball.radius >= state.p2Y &&
          ball.y - ball.radius <= state.p2Y + state.p2Height &&
          ball.vx > 0
        ) {
          // Where it lands on the paddle sets the angle; paddle movement adds spin
          const hitOffset = Math.max(-1, Math.min(1, (ball.y - (state.p2Y + state.p2Height / 2)) / (state.p2Height / 2)));
          const angle = hitOffset * MAX_BOUNCE_ANGLE;
          const speed = Math.min(MAX_BALL_SPEED, Math.hypot(ball.vx, ball.vy) * 1.05 + 0.15);
          ball.vx = -1 * Math.cos(angle) * speed;
          ball.vy = Math.sin(angle) * speed + state.p2Vel * 0.3;
          ball.spin = state.p2Vel * 0.06;
          ball.x = p2X - ball.radius;
          state.p2Flash = 10;
          if (speed > 9) state.shake = 5;
          state.aiError = (Math.random() - 0.5) * (aiDifficulty === 'hard' ? 18 : aiDifficulty === 'medium' ? 46 : 80);
          state.rally++;
          setRallyCount(state.rally);
          playSound('paddle');

          // Sparkle Particles
          for (let p = 0; p < 6 + Math.round(speed); p++) {
            state.particles.push({
              x: p2X,
              y: ball.y,
              vx: -Math.random() * 4,
              vy: (Math.random() - 0.5) * 4,
              life: 18,
              color: '#f59e0b',
            });
          }
        }

        // Score Check: P1 Scores (Ball passes right)
        if (ball.x > width + 20) {
          state.scoreP1++;
          setScoreP1(state.scoreP1);
          playSound('score');
          if (state.scoreP1 >= 7) {
            setWinner('p1');
            setIsPlaying(false);
            setIsGameOver(true);
            playSound('win');
            ctx.restore();
            return;
          }
          resetBall(-1);
          break;
        }

        // Score Check: P2 Scores (Ball passes left)
        if (ball.x < -20) {
          state.scoreP2++;
          setScoreP2(state.scoreP2);
          playSound('score');
          if (state.scoreP2 >= 7) {
            setWinner('p2');
            setIsPlaying(false);
            setIsGameOver(true);
            playSound('win');
            ctx.restore();
            return;
          }
          resetBall(1);
          break;
        }

        // Motion trail, then the ball
        ball.trail?.forEach((t, ti, arr) => {
          const k = (ti + 1) / arr.length;
          ctx.fillStyle = ball.color;
          ctx.globalAlpha = k * 0.35;
          ctx.beginPath();
          ctx.arc(t.x, t.y, ball.radius * (0.4 + 0.6 * k), 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        ctx.fillStyle = ball.color;
        ctx.shadowColor = ball.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 6. Render Particles
      for (let p = state.particles.length - 1; p >= 0; p--) {
        const particle = state.particles[p];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, 2.5, 2.5);
        if (particle.life <= 0) state.particles.splice(p, 1);
      }

      // 7. Render Paddles
      // Player 1 Paddle (Left - Cyan/Sky)
      ctx.fillStyle = state.p1Flash > 0 ? '#e0f2fe' : '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12 + state.p1Flash * 2;
      ctx.beginPath();
      ctx.roundRect(25, state.p1Y, state.paddleWidth, state.p1Height, 6);
      ctx.fill();

      // Player 2 Paddle (Right - Amber/Gold)
      ctx.fillStyle = state.p2Flash > 0 ? '#fef3c7' : '#f59e0b';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 12 + state.p2Flash * 2;
      ctx.beginPath();
      ctx.roundRect(width - 25 - state.paddleWidth, state.p2Y, state.paddleWidth, state.p2Height, 6);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
      if (state.p1Flash > 0) state.p1Flash--;
      if (state.p2Flash > 0) state.p2Flash--;

      state.animationId = stepper.request(loop);
    };

    gameStateRef.current.animationId = stepper.request(loop);

    return () => {
      isRunning = false;
      stepper.cancel();
    };
  }, [isPlaying, gameMode, aiDifficulty, playSound, isHost, p1AutoPilot]);

  return (
    <div className="w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white font-sans space-y-6">
      {/* Game Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">Cyber Pong: High-RPS Packet Duel</h3>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Deflect high-speed request packets across a fiber-optic grid. First to 7 wins!
          </p>
        </div>

        {/* Mode Switcher Tabs */}
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
            <Bot className="w-3.5 h-3.5" /> <span>vs Senior AI</span>
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

      {/* Main Game Screen & Scoreboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Canvas Arcade Frame (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="relative w-full rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-3 overflow-hidden">
            
            {/* Top Match Scoreboard */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-slate-900/80 rounded-xl border border-slate-800/80 mb-3 text-xs font-mono font-black">
              <div className="flex items-center gap-2 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>PLAYER 1: {scoreP1}</span>
                <button
                  onClick={() => setP1AutoPilot(!p1AutoPilot)}
                  className={`ml-2 px-2 py-0.5 rounded-md text-[10px] font-sans font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                    p1AutoPilot
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                  title="Toggle AI Auto-Pilot for Player 1"
                >
                  <Bot className="w-3 h-3" />
                  <span>{p1AutoPilot ? 'AI Playing' : 'AI Auto-Pilot'}</span>
                </button>
              </div>

              <div className="text-slate-400 text-[11px] font-bold">
                RALLY: <span className="text-amber-400">{rallyCount}</span>
              </div>

              <div className="flex items-center gap-2 text-amber-400">
                <span>{gameMode === 'ai' ? 'SENIOR AI' : 'PLAYER 2'}: {scoreP2}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              </div>
            </div>

            {/* Canvas Viewport */}
            <div className="relative w-full aspect-[16/9.5] rounded-xl overflow-hidden bg-[#060a12] border border-slate-800 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={620}
                height={370}
                className="w-full h-full block"
              />

              {/* Start Overlay */}
              {!isPlaying && !isGameOver && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 z-20">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-lg">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-black text-white">READY TO DUEL?</h4>
                    <p className="text-xs text-slate-300 font-medium max-w-sm">
                      {gameMode === 'ai'
                        ? 'Defend your server node against the AI Architect! Use W / S keys to steer.'
                        : 'Player 1 uses W / S keys · Player 2 uses Up / Down arrow keys.'}
                    </p>
                  </div>

                  {gameMode === 'ai' && (
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-slate-400">AI Difficulty:</span>
                      {(['easy', 'medium', 'hard'] as AiDifficulty[]).map((diff) => (
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
                    onClick={startGame}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Launch Packet Duel</span>
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
                      {winner === 'p1' ? '🎉 PLAYER 1 VICTORIOUS!' : '👑 PLAYER 2 / AI WINS!'}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      MATCH RESULT: {scoreP1} - {scoreP2} · MAX RALLY: {rallyCount}
                    </p>
                  </div>

                  {winner === 'p1' && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold space-y-1 max-w-xs">
                      <span>🏆 Champion Badge Unlocked!</span>
                      <p className="text-[11px] text-slate-300 font-normal">
                        Claim a free 30-min Architecture & Codebase Review with Rowell.
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

            {/* Mobile Touch Control Pads */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="flex gap-2">
                <button
                  onMouseDown={() => (gameStateRef.current.keys.w = true)}
                  onMouseUp={() => (gameStateRef.current.keys.w = false)}
                  onTouchStart={() => (gameStateRef.current.keys.w = true)}
                  onTouchEnd={() => (gameStateRef.current.keys.w = false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-cyan-500 active:text-slate-950 rounded-xl text-xs font-black select-none text-cyan-300"
                >
                  P1 UP (W)
                </button>
                <button
                  onMouseDown={() => (gameStateRef.current.keys.s = true)}
                  onMouseUp={() => (gameStateRef.current.keys.s = false)}
                  onTouchStart={() => (gameStateRef.current.keys.s = true)}
                  onTouchEnd={() => (gameStateRef.current.keys.s = false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-cyan-500 active:text-slate-950 rounded-xl text-xs font-black select-none text-cyan-300"
                >
                  P1 DOWN (S)
                </button>
              </div>

              {gameMode === 'local' && (
                <div className="flex gap-2">
                  <button
                    onMouseDown={() => (gameStateRef.current.keys.up = true)}
                    onMouseUp={() => (gameStateRef.current.keys.up = false)}
                    onTouchStart={() => (gameStateRef.current.keys.up = true)}
                    onTouchEnd={() => (gameStateRef.current.keys.up = false)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 rounded-xl text-xs font-black select-none text-amber-300"
                  >
                    P2 UP (↑)
                  </button>
                  <button
                    onMouseDown={() => (gameStateRef.current.keys.down = true)}
                    onMouseUp={() => (gameStateRef.current.keys.down = false)}
                    onTouchStart={() => (gameStateRef.current.keys.down = true)}
                    onTouchEnd={() => (gameStateRef.current.keys.down = false)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 rounded-xl text-xs font-black select-none text-amber-300"
                  >
                    P2 DOWN (↓)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Controls, Power-Ups & Lead Reward (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Controls Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Controls Guide
            </h4>
            <div className="space-y-2 text-xs text-slate-300 font-medium">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-300">Player 1:</span>
                <span className="font-mono text-white font-bold"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">W</kbd> Up · <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">S</kbd> Down</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-amber-300">Player 2:</span>
                <span className="font-mono text-white font-bold"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↑</kbd> Up · <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↓</kbd> Down</span>
              </div>
            </div>
          </div>

          {/* In-Game Stack Power-Ups */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Stack Power-Up Drops
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-300">
                <span>⚡</span> <span><strong>Multi-Thread:</strong> Splits into 2 packets</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300">
                <span>🚀</span> <span><strong>Edge Turbo:</strong> 1.5x Speed boost</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">
                <span>🛡️</span> <span><strong>Cache Shield:</strong> Extends paddle height</span>
              </div>
            </div>
          </div>

          {/* Architecture Audit Reward Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-indigo-950 border border-amber-400/40 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-300">
              <Trophy className="w-4 h-4" />
              <h4 className="text-xs font-black uppercase tracking-wider">Win 7 Points to Qualify</h4>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              Beat the Senior AI or a friend to unlock a <strong>Free 30-Min Architecture & Code Review</strong>.
            </p>
            <button
              onClick={() => setShowRewardModal(true)}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all shadow-md"
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
        defaultService="Cyber Pong Champion — Architecture Audit"
      />
    </div>
  );
}
