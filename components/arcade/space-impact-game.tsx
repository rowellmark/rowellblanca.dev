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
  Award,
  ChevronRight,
  Shield,
  Zap,
  Rocket,
  Flame,
} from 'lucide-react';
import { ContactModal } from '@/components/ui/contact-modal';

interface Star {
  x: number;
  y: number;
  speed: number;
  size: number;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isEnemy: boolean;
  color: string;
  radius: number;
}

interface Missile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetIdx?: number;
}

interface Enemy {
  id: number;
  type: 'scout' | 'fighter' | 'asteroid' | 'boss';
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  width: number;
  height: number;
  color: string;
  shootTimer: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  radius: number;
}

interface PowerUp {
  x: number;
  y: number;
  type: 'triple' | 'shield' | 'bomb';
  color: string;
  label: string;
}

export function SpaceImpactGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [p1AutoPilot, setP1AutoPilot] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [hpDisplay, setHpDisplay] = useState(100);
  const [bombsDisplay, setBombsDisplay] = useState(3);
  const [shieldDisplay, setShieldDisplay] = useState(100);
  const [bossHpDisplay, setBossHpDisplay] = useState<number | null>(null);

  // Audio synthesizer helper (Web Audio API)
  const playSound = useCallback(
    (type: 'laser' | 'missile' | 'hit' | 'explosion' | 'bomb' | 'powerup' | 'win') => {
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

        if (type === 'laser') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        } else if (type === 'missile') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.linearRampToValueAtTime(600, now + 0.15);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
        } else if (type === 'explosion') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.linearRampToValueAtTime(30, now + 0.25);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (type === 'bomb') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
          gain.gain.setValueAtTime(0.35, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
          osc.start(now);
          osc.stop(now + 0.5);
        } else if (type === 'powerup') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523, now);
          osc.frequency.setValueAtTime(659, now + 0.08);
          osc.frequency.setValueAtTime(784, now + 0.16);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.24);
          osc.start(now);
          osc.stop(now + 0.24);
        }
      } catch (e) {}
    },
    [soundEnabled]
  );

  // Game state ref
  const stateRef = useRef<{
    player: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      width: number;
      height: number;
      hp: number;
      shield: number;
      bombs: number;
      tripleTimer: number;
      invulnerableTimer: number;
    };
    keys: Record<string, boolean>;
    stars: Star[];
    bullets: Bullet[];
    missiles: Missile[];
    enemies: Enemy[];
    particles: Particle[];
    powerUps: PowerUp[];
    wave: number;
    score: number;
    lastSpawn: number;
    bossSpawned: boolean;
    animationId: number;
  }>({
    player: {
      x: 60,
      y: 180,
      vx: 0,
      vy: 0,
      width: 32,
      height: 20,
      hp: 100,
      shield: 100,
      bombs: 3,
      tripleTimer: 0,
      invulnerableTimer: 0,
    },
    keys: {},
    stars: [],
    bullets: [],
    missiles: [],
    enemies: [],
    particles: [],
    powerUps: [],
    wave: 1,
    score: 0,
    lastSpawn: 0,
    bossSpawned: false,
    animationId: 0,
  });

  // Load High Score
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rb_space_impact_high_score');
      if (saved) setHighScore(parseInt(saved, 10));
    } catch (e) {}
  }, []);

  // Fire main laser
  const firePlayerLaser = useCallback(() => {
    const state = stateRef.current;
    if (!isPlaying || state.player.hp <= 0) return;

    playSound('laser');
    const px = state.player.x + state.player.width;
    const py = state.player.y + state.player.height / 2;

    if (state.player.tripleTimer > 0) {
      state.bullets.push(
        { x: px, y: py - 6, vx: 12, vy: -1.5, isEnemy: false, color: '#38bdf8', radius: 3 },
        { x: px, y: py, vx: 13, vy: 0, isEnemy: false, color: '#38bdf8', radius: 3.5 },
        { x: px, y: py + 6, vx: 12, vy: 1.5, isEnemy: false, color: '#38bdf8', radius: 3 }
      );
    } else {
      state.bullets.push({
        x: px,
        y: py,
        vx: 13,
        vy: 0,
        isEnemy: false,
        color: '#38bdf8',
        radius: 3,
      });
    }
  }, [isPlaying, playSound]);

  // Fire EMP Nuke Bomb
  const fireBomb = useCallback(() => {
    const state = stateRef.current;
    if (!isPlaying || state.player.bombs <= 0) return;

    state.player.bombs -= 1;
    setBombsDisplay(state.player.bombs);
    playSound('bomb');

    // Wipe all enemy bullets
    state.bullets = state.bullets.filter((b) => !b.isEnemy);

    // Damage all enemies
    state.enemies.forEach((enemy) => {
      enemy.hp -= 60;
      for (let i = 0; i < 15; i++) {
        state.particles.push({
          x: enemy.x + enemy.width / 2,
          y: enemy.y + enemy.height / 2,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          color: '#fbbf24',
          life: 1,
          maxLife: 30,
          radius: Math.random() * 3 + 1,
        });
      }
    });
  }, [isPlaying, playSound]);

  // Start / Reset Game
  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setIsVictory(false);
    setScore(0);
    setWave(1);
    setHpDisplay(100);
    setShieldDisplay(100);
    setBombsDisplay(3);
    setBossHpDisplay(null);

    // Starfield
    const stars: Star[] = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * 660,
        y: Math.random() * 360,
        speed: Math.random() * 2 + 0.5,
        size: Math.random() * 2 + 0.5,
      });
    }

    stateRef.current = {
      player: {
        x: 60,
        y: 170,
        vx: 0,
        vy: 0,
        width: 32,
        height: 20,
        hp: 100,
        shield: 100,
        bombs: 3,
        tripleTimer: 0,
        invulnerableTimer: 60,
      },
      keys: {},
      stars,
      bullets: [],
      missiles: [],
      enemies: [],
      particles: [],
      powerUps: [],
      wave: 1,
      score: 0,
      lastSpawn: Date.now(),
      bossSpawned: false,
      animationId: 0,
    };
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      stateRef.current.keys[e.code] = true;
      if (['Space', 'KeyJ'].includes(e.code)) {
        e.preventDefault();
        firePlayerLaser();
      }
      if (['KeyK', 'KeyL'].includes(e.code)) {
        e.preventDefault();
        fireBomb();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      stateRef.current.keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [firePlayerLaser, fireBomb]);

  // Main 60FPS Game Loop
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const loop = () => {
      if (!isRunning) return;

      const state = stateRef.current;
      const { player, keys } = state;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Player Movement (WASD / Arrows or AI Auto-Pilot)
      const speed = 4.5;
      if (p1AutoPilot) {
        // AI Radar steering: Dodge bullets and track closest enemy Y-level
        const incoming = state.bullets.find((b) => b.isEnemy && b.x > player.x && b.x < player.x + 180);
        if (incoming) {
          if (incoming.y > player.y + player.height / 2) player.y -= speed;
          else player.y += speed;
        } else if (state.enemies.length > 0) {
          const target = state.enemies[0];
          const targetY = target.y + target.height / 2 - player.height / 2;
          if (Math.abs(targetY - player.y) > 4) {
            player.y += targetY > player.y ? speed * 0.75 : -speed * 0.75;
          }
          if (Math.random() < 0.2) firePlayerLaser();
        }
      } else {
        if (keys['KeyW'] || keys['ArrowUp']) player.y -= speed;
        if (keys['KeyS'] || keys['ArrowDown']) player.y += speed;
        if (keys['KeyA'] || keys['ArrowLeft']) player.x -= speed;
        if (keys['KeyD'] || keys['ArrowRight']) player.x += speed;
      }

      // Clamp Player Position
      player.x = Math.max(10, Math.min(width - player.width - 20, player.x));
      player.y = Math.max(10, Math.min(height - player.height - 10, player.y));

      // Timers
      if (player.tripleTimer > 0) player.tripleTimer -= 1;
      if (player.invulnerableTimer > 0) player.invulnerableTimer -= 1;

      // Shield passive regen
      if (player.shield < 100) player.shield = Math.min(100, player.shield + 0.05);
      setShieldDisplay(Math.floor(player.shield));

      // 2. Stars Parallax Background
      state.stars.forEach((star) => {
        star.x -= star.speed;
        if (star.x < 0) {
          star.x = width;
          star.y = Math.random() * height;
        }
      });

      // 3. Enemy Spawner
      const now = Date.now();
      if (!state.bossSpawned && state.score >= 500 && state.wave === 1) {
        // Spawn Server Monolith Boss
        state.bossSpawned = true;
        state.enemies.push({
          id: Date.now(),
          type: 'boss',
          x: width - 110,
          y: height / 2 - 45,
          vx: 0,
          vy: 1.2,
          hp: 450,
          maxHp: 450,
          width: 80,
          height: 90,
          color: '#e11d48',
          shootTimer: 0,
        });
      } else if (!state.bossSpawned && now - state.lastSpawn > 1200) {
        state.lastSpawn = now;
        const enemyType = Math.random() < 0.6 ? 'scout' : Math.random() < 0.8 ? 'fighter' : 'asteroid';
        const ey = Math.random() * (height - 60) + 20;

        if (enemyType === 'scout') {
          state.enemies.push({
            id: Date.now() + Math.random(),
            type: 'scout',
            x: width + 20,
            y: ey,
            vx: -3.2,
            vy: Math.sin(now * 0.005) * 1.5,
            hp: 20,
            maxHp: 20,
            width: 24,
            height: 18,
            color: '#a855f7',
            shootTimer: 0,
          });
        } else if (enemyType === 'fighter') {
          state.enemies.push({
            id: Date.now() + Math.random(),
            type: 'fighter',
            x: width + 20,
            y: ey,
            vx: -2.2,
            vy: 0,
            hp: 45,
            maxHp: 45,
            width: 30,
            height: 24,
            color: '#f59e0b',
            shootTimer: 40,
          });
        } else {
          state.enemies.push({
            id: Date.now() + Math.random(),
            type: 'asteroid',
            x: width + 20,
            y: ey,
            vx: -2.8,
            vy: (Math.random() - 0.5) * 0.8,
            hp: 70,
            maxHp: 70,
            width: 26,
            height: 26,
            color: '#64748b',
            shootTimer: 9999,
          });
        }
      }

      // 4. Update Enemies & Enemy Shooting
      state.enemies.forEach((enemy) => {
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;

        if (enemy.type === 'boss') {
          if (enemy.y < 30 || enemy.y > height - enemy.height - 30) {
            enemy.vy = -enemy.vy;
          }
          setBossHpDisplay(Math.max(0, Math.floor((enemy.hp / enemy.maxHp) * 100)));

          enemy.shootTimer += 1;
          if (enemy.shootTimer > 45) {
            enemy.shootTimer = 0;
            // Boss 3-way spread attack
            state.bullets.push(
              { x: enemy.x, y: enemy.y + 20, vx: -7, vy: -1.5, isEnemy: true, color: '#f43f5e', radius: 4 },
              { x: enemy.x, y: enemy.y + enemy.height / 2, vx: -8, vy: 0, isEnemy: true, color: '#f43f5e', radius: 5 },
              { x: enemy.x, y: enemy.y + enemy.height - 20, vx: -7, vy: 1.5, isEnemy: true, color: '#f43f5e', radius: 4 }
            );
          }
        } else if (enemy.type === 'fighter') {
          enemy.shootTimer += 1;
          if (enemy.shootTimer > 90) {
            enemy.shootTimer = 0;
            state.bullets.push({
              x: enemy.x,
              y: enemy.y + enemy.height / 2,
              vx: -6,
              vy: 0,
              isEnemy: true,
              color: '#fbbf24',
              radius: 3,
            });
          }
        }
      });

      // Remove off-screen enemies
      state.enemies = state.enemies.filter((e) => e.x > -100);

      // 5. Update Bullets
      state.bullets.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
      });
      state.bullets = state.bullets.filter((b) => b.x > -20 && b.x < width + 20 && b.y > -20 && b.y < height + 20);

      // 6. Bullet Collisions
      // Player bullets hitting Enemies
      state.bullets
        .filter((b) => !b.isEnemy)
        .forEach((b, bIdx) => {
          state.enemies.forEach((enemy) => {
            if (
              b.x > enemy.x &&
              b.x < enemy.x + enemy.width &&
              b.y > enemy.y &&
              b.y < enemy.y + enemy.height
            ) {
              enemy.hp -= 15;
              b.x = 9999; // mark dead
              // Spark
              for (let i = 0; i < 4; i++) {
                state.particles.push({
                  x: b.x,
                  y: b.y,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  color: '#38bdf8',
                  life: 1,
                  maxLife: 15,
                  radius: 2,
                });
              }
            }
          });
        });

      // Check Enemy Defeat & Power-Up Drops
      state.enemies = state.enemies.filter((enemy) => {
        if (enemy.hp <= 0) {
          playSound('explosion');
          const pts = enemy.type === 'boss' ? 500 : enemy.type === 'fighter' ? 50 : 25;
          state.score += pts;
          setScore(state.score);

          if (state.score > highScore) {
            setHighScore(state.score);
            try {
              localStorage.setItem('rb_space_impact_high_score', state.score.toString());
            } catch (e) {}
          }

          // Large explosion particles
          for (let i = 0; i < 20; i++) {
            state.particles.push({
              x: enemy.x + enemy.width / 2,
              y: enemy.y + enemy.height / 2,
              vx: (Math.random() - 0.5) * 7,
              vy: (Math.random() - 0.5) * 7,
              color: enemy.color,
              life: 1,
              maxLife: 25,
              radius: Math.random() * 3 + 1,
            });
          }

          // Chance to drop power-up
          if (Math.random() < 0.35 || enemy.type === 'boss') {
            const types: ('triple' | 'shield' | 'bomb')[] = ['triple', 'shield', 'bomb'];
            const type = types[Math.floor(Math.random() * types.length)];
            state.powerUps.push({
              x: enemy.x,
              y: enemy.y,
              type,
              color: type === 'triple' ? '#38bdf8' : type === 'shield' ? '#10b981' : '#f59e0b',
              label: type === 'triple' ? '3x' : type === 'shield' ? '🛡️' : '💣',
            });
          }

          // If boss died -> Victory!
          if (enemy.type === 'boss') {
            setBossHpDisplay(null);
            setIsVictory(true);
            setIsPlaying(false);
            return false;
          }

          return false;
        }
        return true;
      });

      // 7. Enemy Bullets / Collision Hitting Player
      if (player.invulnerableTimer <= 0) {
        state.bullets
          .filter((b) => b.isEnemy)
          .forEach((b) => {
            if (
              b.x > player.x &&
              b.x < player.x + player.width &&
              b.y > player.y &&
              b.y < player.y + player.height
            ) {
              b.x = -999;
              // Absorb with shield first
              if (player.shield > 10) {
                player.shield -= 25;
              } else {
                player.hp -= 20;
              }
              setHpDisplay(Math.max(0, player.hp));
              setShieldDisplay(Math.max(0, Math.floor(player.shield)));
              player.invulnerableTimer = 20;
            }
          });

        // Direct Enemy Body Ramming
        state.enemies.forEach((enemy) => {
          if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
          ) {
            player.hp -= 35;
            enemy.hp -= 40;
            setHpDisplay(Math.max(0, player.hp));
            player.invulnerableTimer = 35;
          }
        });
      }

      // Check Game Over
      if (player.hp <= 0) {
        isRunning = false;
        setIsPlaying(false);
        setIsGameOver(true);
        playSound('explosion');
        return;
      }

      // 8. Power-Up Collection
      state.powerUps.forEach((pu) => {
        pu.x -= 1.5;
        if (
          player.x < pu.x + 20 &&
          player.x + player.width > pu.x &&
          player.y < pu.y + 20 &&
          player.y + player.height > pu.y
        ) {
          pu.x = -999;
          playSound('powerup');
          if (pu.type === 'triple') player.tripleTimer = 400;
          if (pu.type === 'shield') player.shield = 100;
          if (pu.type === 'bomb') {
            player.bombs = Math.min(5, player.bombs + 1);
            setBombsDisplay(player.bombs);
          }
        }
      });
      state.powerUps = state.powerUps.filter((p) => p.x > -50);

      // 9. Update Particles
      state.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;
      });
      state.particles = state.particles.filter((p) => p.life < p.maxLife);

      // 10. RENDER CANVAS
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, width, height);

      // Parallax Stars
      state.stars.forEach((star) => {
        ctx.fillStyle = star.speed > 1.5 ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Power-Ups
      state.powerUps.forEach((pu) => {
        ctx.fillStyle = pu.color;
        ctx.shadowColor = pu.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(pu.x, pu.y, 20, 20, 6);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(pu.label, pu.x + 10, pu.y + 13);
      });

      // Render Bullets
      state.bullets.forEach((b) => {
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Render Enemies
      state.enemies.forEach((enemy) => {
        ctx.fillStyle = enemy.color;
        ctx.shadowColor = enemy.color;
        ctx.shadowBlur = 12;

        if (enemy.type === 'boss') {
          // Boss Ship Frame
          ctx.beginPath();
          ctx.roundRect(enemy.x, enemy.y, enemy.width, enemy.height, 12);
          ctx.fill();

          // Glowing Red Core
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(enemy.x + 25, enemy.y + enemy.height / 2, 14, 0, Math.PI * 2);
          ctx.fill();
        } else if (enemy.type === 'scout') {
          // Sleek Arrow Scout
          ctx.beginPath();
          ctx.moveTo(enemy.x, enemy.y + enemy.height / 2);
          ctx.lineTo(enemy.x + enemy.width, enemy.y);
          ctx.lineTo(enemy.x + enemy.width - 6, enemy.y + enemy.height / 2);
          ctx.lineTo(enemy.x + enemy.width, enemy.y + enemy.height);
          ctx.closePath();
          ctx.fill();
        } else if (enemy.type === 'fighter') {
          // Heavy Corvette
          ctx.beginPath();
          ctx.roundRect(enemy.x, enemy.y, enemy.width, enemy.height, 6);
          ctx.fill();
        } else {
          // Asteroid
          ctx.beginPath();
          ctx.arc(enemy.x + 13, enemy.y + 13, 13, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      });

      // Render Player Ship (Cyan Interceptor)
      if (player.invulnerableTimer % 6 < 3) {
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 14;

        // Ship geometry
        ctx.beginPath();
        ctx.moveTo(player.x + player.width, player.y + player.height / 2);
        ctx.lineTo(player.x, player.y);
        ctx.lineTo(player.x + 6, player.y + player.height / 2);
        ctx.lineTo(player.x, player.y + player.height);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        // Thruster Jet Flame
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(player.x, player.y + player.height * 0.35);
        ctx.lineTo(player.x - (Math.random() * 8 + 6), player.y + player.height / 2);
        ctx.lineTo(player.x, player.y + player.height * 0.65);
        ctx.closePath();
        ctx.fill();

        // Energy Shield Glow
        if (player.shield > 20) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(player.x + player.width / 2, player.y + player.height / 2, 22, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Render Particles
      state.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      state.animationId = requestAnimationFrame(loop);
    };

    stateRef.current.animationId = requestAnimationFrame(loop);
    const animId = stateRef.current.animationId;

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, highScore, playSound, p1AutoPilot, firePlayerLaser]);

  return (
    <div className="w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white font-sans space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Rocket className="w-4 h-4" />
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">Space Impact: Retro Galaxy Defender</h3>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            The legendary classic retro shooter reimagined with plasma cannons, EMP bombs, and Server Overlord Bosses!
          </p>
        </div>

        {/* AI Pilot Toggle */}
        <button
          onClick={() => setP1AutoPilot(!p1AutoPilot)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
            p1AutoPilot ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>{p1AutoPilot ? 'AI Pilot Active' : 'AI Auto-Pilot'}</span>
        </button>
      </div>

      {/* Main Duel Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Canvas Frame (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="relative w-full rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-3 overflow-hidden">
            
            {/* Top Match HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 py-2.5 bg-slate-900/90 rounded-xl border border-slate-800/80 mb-3 text-xs font-mono font-bold">
              {/* Hull Health */}
              <div className="space-y-1">
                <div className="flex justify-between text-cyan-400">
                  <span>HULL:</span>
                  <span>{hpDisplay}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-200"
                    style={{ width: `${hpDisplay}%` }}
                  />
                </div>
              </div>

              {/* Shield */}
              <div className="space-y-1">
                <div className="flex justify-between text-emerald-400">
                  <span>SHIELD:</span>
                  <span>{shieldDisplay}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-200"
                    style={{ width: `${shieldDisplay}%` }}
                  />
                </div>
              </div>

              {/* EMP Bombs */}
              <div className="flex items-center justify-between text-amber-400">
                <span>EMP BOMBS:</span>
                <span className="text-sm font-black">{bombsDisplay} 💣</span>
              </div>

              {/* Score */}
              <div className="flex items-center justify-between text-white">
                <span>SCORE:</span>
                <span className="text-sm font-black text-amber-400">{score}</span>
              </div>
            </div>

            {/* Boss HP Gauge */}
            {bossHpDisplay !== null && (
              <div className="mb-3 px-4 py-2 bg-rose-950/80 rounded-xl border border-rose-500/50 text-xs font-mono space-y-1">
                <div className="flex justify-between text-rose-400 font-black">
                  <span>⚠️ SERVER MONOLITH BOSS:</span>
                  <span>{bossHpDisplay}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 transition-all duration-150"
                    style={{ width: `${bossHpDisplay}%` }}
                  />
                </div>
              </div>
            )}

            {/* Canvas Viewport */}
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#050811] border border-slate-800 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={660}
                height={370}
                className="w-full h-full block"
              />

              {/* Start Screen Overlay */}
              {!isPlaying && !isGameOver && !isVictory && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 z-20">
                  <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg">
                    <Rocket className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-black text-white">LAUNCH SPACE IMPACT</h4>
                    <p className="text-xs text-slate-300 font-medium max-w-sm">
                      Maneuver your interceptor with WASD / Arrows. Fire laser with Space / Click. Unleash EMP Bombs with K!
                    </p>
                  </div>

                  <button
                    onClick={startGame}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Engage Thrusters</span>
                  </button>
                </div>
              )}

              {/* Victory Screen */}
              {isVictory && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4 z-20">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white">🏆 GALAXY DEFENDED!</h3>
                    <p className="text-xs text-slate-300 font-mono">
                      FINAL SCORE: {score} · SERVER MONOLITH DESTROYED!
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold space-y-1 max-w-xs">
                    <span>⭐ Space Commander Reward Unlocked!</span>
                    <p className="text-[11px] text-slate-300 font-normal">
                      Claim a free 30-min Architecture & Cloud Infrastructure Audit with Rowell.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={startGame}
                      className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Replay Mission</span>
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

              {/* Game Over Screen */}
              {isGameOver && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4 z-20">
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg">
                    <Flame className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white">💀 SHIP DESTROYED</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      FINAL SCORE: {score} · HIGH SCORE: {highScore}
                    </p>
                  </div>

                  <button
                    onClick={startGame}
                    className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Relaunch Interceptor</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Touch Action Controls */}
            <div className="flex items-center justify-between gap-2 mt-3">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    stateRef.current.player.y -= 25;
                  }}
                  className="px-4 py-2 bg-slate-800 active:bg-cyan-500 active:text-slate-950 rounded-xl text-xs font-black text-cyan-300"
                >
                  ↑ UP
                </button>
                <button
                  onClick={() => {
                    stateRef.current.player.y += 25;
                  }}
                  className="px-4 py-2 bg-slate-800 active:bg-cyan-500 active:text-slate-950 rounded-xl text-xs font-black text-cyan-300"
                >
                  ↓ DOWN
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={firePlayerLaser}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 rounded-xl text-xs font-black uppercase"
                >
                  ⚡ Laser
                </button>
                <button
                  onClick={fireBomb}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-400 active:scale-95 text-slate-950 rounded-xl text-xs font-black uppercase"
                >
                  💣 EMP Bomb
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Weapon Stats & Reward (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Weapon Arsenal Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Arsenal & Controls
            </h4>
            <div className="space-y-2 text-xs text-slate-300 font-medium">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-300">Thrusters:</span>
                <span className="font-mono text-white font-bold"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">WASD</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">Arrows</kbd></span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-300">Plasma Laser:</span>
                <span className="font-mono text-white font-bold"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">Space</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">J</kbd></span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-rose-400">EMP Nuke Bomb:</span>
                <span className="font-mono text-white font-bold"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">K</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">L</kbd></span>
              </div>
            </div>
          </div>

          {/* Drops & Power-ups */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Orbital Power-Up Drops
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center justify-between">
                <span className="text-cyan-400">✦ Triple Plasma Cannon (3x)</span>
                <strong className="text-white">10 Secs</strong>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-emerald-400">🛡️ Full Shield Battery</span>
                <strong className="text-emerald-400">100% Boost</strong>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-amber-400">💣 EMP Nuke Ordinance</span>
                <strong className="text-amber-400">+1 Bomb</strong>
              </li>
            </ul>
          </div>

          {/* Reward Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/20 via-slate-900 to-purple-950 border border-rose-400/40 space-y-2.5">
            <div className="flex items-center gap-2 text-rose-300">
              <Trophy className="w-4 h-4" />
              <h4 className="text-xs font-black uppercase tracking-wider">Defeat the Overlord</h4>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              Destroy the <strong>Server Monolith Boss</strong> to claim a <strong>Free 30-Min Architecture & Scaling Audit</strong> with Rowell.
            </p>
            <button
              onClick={() => setShowRewardModal(true)}
              className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all shadow-md"
            >
              <span>Claim Free Consultation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      <ContactModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        defaultService="Space Impact Galaxy Defender — Architecture Audit"
      />
    </div>
  );
}
