'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Shield,
  Zap,
  Flame,
  RotateCcw,
  Trophy,
  Bot,
  Users,
  Sparkles,
  Award,
  ChevronRight,
  Server,
  Activity,
  Cpu,
  AlertTriangle,
  Play,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContactModal } from '@/components/ui/contact-modal';

type DuelMode = 'ai' | 'local' | 'room';

interface Card {
  id: string;
  name: string;
  type: 'attack' | 'defense' | 'buff';
  cost: number;
  value: number;
  description: string;
  icon: string;
  color: string;
}

const CARDS_DECK: Card[] = [
  {
    id: 'ddos',
    name: '10k DDoS Spike',
    type: 'attack',
    cost: 3,
    value: 18,
    description: 'Overwhelms opponent node with simulated traffic.',
    icon: '⚡',
    color: 'from-rose-500 to-red-600',
  },
  {
    id: 'sql_inject',
    name: 'Unindexed Query Spill',
    type: 'attack',
    cost: 4,
    value: 26,
    description: 'Forces full table scans and locks memory tables.',
    icon: '💣',
    color: 'from-amber-600 to-rose-600',
  },
  {
    id: 'mem_leak',
    name: 'RAM Buffer Overflow',
    type: 'attack',
    cost: 5,
    value: 34,
    description: 'Spills memory pool causing server throttles.',
    icon: '🔥',
    color: 'from-red-600 to-purple-700',
  },
  {
    id: 'bloat_bomb',
    name: '50MB Bloated Library',
    type: 'attack',
    cost: 6,
    value: 45,
    description: 'Deploys 200 unnecessary dependencies.',
    icon: '💥',
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: 'rsc_shield',
    name: 'Next.js RSC Shield',
    type: 'defense',
    cost: 3,
    value: 20,
    description: 'Installs React Server Components edge cache barrier.',
    icon: '🛡️',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'cloudflare_waf',
    name: 'Cloudflare WAF Filter',
    type: 'defense',
    cost: 4,
    value: 30,
    description: 'Blocks malicious bot floods at edge CDN.',
    icon: '🌐',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'neondb_pool',
    name: 'NeonDB Serverless Pool',
    type: 'buff',
    cost: 2,
    value: 16,
    description: 'Instantly scales connection pool & restores HP.',
    icon: '💎',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'lighthouse_turbo',
    name: 'Lighthouse 100 Overclock',
    type: 'buff',
    cost: 5,
    value: 30,
    description: 'Restores +30 Uptime and overclocks CPU cycles.',
    icon: '🚀',
    color: 'from-amber-400 to-amber-600',
  },
];

export function CodeDuelGame() {
  const [mode, setMode] = useState<DuelMode>('ai');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<'p1' | 'p2' | null>(null);

  // Player 1 State
  const [p1Hp, setP1Hp] = useState(100);
  const [p1Shield, setP1Shield] = useState(0);
  const [p1Energy, setP1Energy] = useState(5);
  const [p1Hand, setP1Hand] = useState<Card[]>([]);

  // Player 2 / AI State
  const [p2Hp, setP2Hp] = useState(100);
  const [p2Shield, setP2Shield] = useState(0);
  const [p2Energy, setP2Energy] = useState(5);
  const [p2Hand, setP2Hand] = useState<Card[]>([]);

  const [activeTurn, setActiveTurn] = useState<'p1' | 'p2'>('p1');
  const [p1AutoPilot, setP1AutoPilot] = useState(false);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  // Forge Custom AI Card via Groq LPU
  const forgeAiCard = async (themePrompt?: string) => {
    if (isGeneratingCard) return;
    setIsGeneratingCard(true);
    try {
      const promptToUse = themePrompt || customPrompt || 'Redis Cache Leak Attack';
      const res = await fetch('/api/games/ai-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_card',
          prompt: promptToUse,
        }),
      });
      const data = await res.json();
      if (data.card) {
        setP1Hand((prev) => [...prev.slice(0, 4), data.card]);
        setCombatLog((prev) => [
          `✨ [Groq AI Forge] Created wildcard card: [${data.card.name}]!`,
          ...prev.slice(0, 5),
        ]);
        setCustomPrompt('');
      }
    } catch (e) {
      console.error('Failed to forge AI card', e);
    } finally {
      setIsGeneratingCard(false);
    }
  };

  // Audio synthesizer
  const playSound = useCallback((type: 'attack' | 'shield' | 'buff' | 'win') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'attack') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'shield') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'buff') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'win') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(659, now + 0.1);
        osc.frequency.setValueAtTime(783, now + 0.2);
        osc.frequency.setValueAtTime(1046, now + 0.3);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {}
  }, []);

  const drawCard = (): Card => {
    return CARDS_DECK[Math.floor(Math.random() * CARDS_DECK.length)];
  };

  const startDuel = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setWinner(null);
    setP1Hp(100);
    setP1Shield(0);
    setP1Energy(5);
    setP2Hp(100);
    setP2Shield(0);
    setP2Energy(5);
    setActiveTurn('p1');
    setP1Hand([drawCard(), drawCard(), drawCard(), drawCard()]);
    setP2Hand([drawCard(), drawCard(), drawCard(), drawCard()]);
    setCombatLog(['🚀 Match Started: Production Server Duel initialized!']);
  };

  // Turn Energy Regeneration
  const endTurn = useCallback(() => {
    if (activeTurn === 'p1') {
      setActiveTurn('p2');
      setP2Energy((prev) => Math.min(10, prev + 3));
      setP2Hand((prev) => (prev.length < 5 ? [...prev, drawCard()] : prev));
    } else {
      setActiveTurn('p1');
      setP1Energy((prev) => Math.min(10, prev + 3));
      setP1Hand((prev) => (prev.length < 5 ? [...prev, drawCard()] : prev));
    }
  }, [activeTurn]);

  // Play Card Action
  const playCard = useCallback((card: Card, player: 'p1' | 'p2') => {
    if (player === 'p1') {
      setP1Energy((prev) => prev - card.cost);
      setP1Hand((prev) => prev.filter((c, idx) => idx !== prev.findIndex((item) => item.id === card.id)));

      if (card.type === 'attack') {
        playSound('attack');
        let damage = card.value;
        setP2Shield((prevShield) => {
          if (prevShield > 0) {
            const absorbed = Math.min(prevShield, damage);
            damage -= absorbed;
            return Math.max(0, prevShield - card.value);
          }
          return 0;
        });

        setP2Hp((prevHp) => {
          const newHp = Math.max(0, prevHp - damage);
          if (newHp <= 0) {
            setWinner('p1');
            setIsPlaying(false);
            setIsGameOver(true);
            playSound('win');
          }
          return newHp;
        });

        setCombatLog((prev) => [
          `⚡ P1 deployed [${card.name}] inflicting ${card.value} damage!`,
          ...prev.slice(0, 5),
        ]);
      } else if (card.type === 'defense') {
        playSound('shield');
        setP1Shield((prev) => Math.min(50, prev + card.value));
        setCombatLog((prev) => [
          `🛡️ P1 deployed [${card.name}] gaining +${card.value} Shield!`,
          ...prev.slice(0, 5),
        ]);
      } else if (card.type === 'buff') {
        playSound('buff');
        setP1Hp((prev) => Math.min(100, prev + card.value));
        setCombatLog((prev) => [
          `💎 P1 deployed [${card.name}] restoring +${card.value} Uptime!`,
          ...prev.slice(0, 5),
        ]);
      }
    } else {
      // Player 2
      setP2Energy((prev) => prev - card.cost);
      setP2Hand((prev) => prev.filter((c, idx) => idx !== prev.findIndex((item) => item.id === card.id)));

      if (card.type === 'attack') {
        playSound('attack');
        let damage = card.value;
        setP1Shield((prevShield) => {
          if (prevShield > 0) {
            const absorbed = Math.min(prevShield, damage);
            damage -= absorbed;
            return Math.max(0, prevShield - card.value);
          }
          return 0;
        });

        setP1Hp((prevHp) => {
          const newHp = Math.max(0, prevHp - damage);
          if (newHp <= 0) {
            setWinner('p2');
            setIsPlaying(false);
            setIsGameOver(true);
            playSound('win');
          }
          return newHp;
        });

        setCombatLog((prev) => [
          `🔥 P2 / AI deployed [${card.name}] inflicting ${card.value} damage!`,
          ...prev.slice(0, 5),
        ]);
      } else if (card.type === 'defense') {
        playSound('shield');
        setP2Shield((prev) => Math.min(50, prev + card.value));
        setCombatLog((prev) => [
          `🛡️ P2 / AI deployed [${card.name}] gaining +${card.value} Shield!`,
          ...prev.slice(0, 5),
        ]);
      } else if (card.type === 'buff') {
        playSound('buff');
        setP2Hp((prev) => Math.min(100, prev + card.value));
        setCombatLog((prev) => [
          `💎 P2 / AI deployed [${card.name}] restoring +${card.value} Uptime!`,
          ...prev.slice(0, 5),
        ]);
      }
    }
  }, [playSound]);

  // Player 1 AI Auto-Pilot Execution
  useEffect(() => {
    if (isPlaying && p1AutoPilot && activeTurn === 'p1' && !isGameOver) {
      const timer = setTimeout(() => {
        const affordableCards = p1Hand.filter((c) => c.cost <= p1Energy);

        if (affordableCards.length > 0) {
          let chosen = affordableCards.find((c) => p1Hp < 40 && (c.type === 'defense' || c.type === 'buff'));
          if (!chosen) {
            chosen = affordableCards.find((c) => c.type === 'attack') || affordableCards[0];
          }
          if (chosen) playCard(chosen, 'p1');
        }

        setTimeout(() => {
          endTurn();
        }, 800);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, p1AutoPilot, activeTurn, p1Energy, p1Hand, isGameOver, p1Hp, playCard, endTurn]);

  // AI Opponent Automatic Turn Execution
  useEffect(() => {
    if (isPlaying && mode === 'ai' && activeTurn === 'p2' && !isGameOver) {
      const timer = setTimeout(() => {
        // AI Strategy: Find affordable playable cards
        const affordableCards = p2Hand.filter((c) => c.cost <= p2Energy);

        if (affordableCards.length > 0) {
          let chosen = affordableCards.find((c) => p2Hp < 40 && (c.type === 'defense' || c.type === 'buff'));
          if (!chosen) {
            chosen = affordableCards.find((c) => c.type === 'attack') || affordableCards[0];
          }
          if (chosen) playCard(chosen, 'p2');
        }

        // End AI turn after playing
        setTimeout(() => {
          endTurn();
        }, 800);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, mode, activeTurn, p2Energy, p2Hand, isGameOver, p2Hp, playCard, endTurn]);

  return (
    <div className="w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white font-sans space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">Code Duel: 1v1 Server Battle</h3>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Deploy real-time infrastructure cards to defend your server and bring down opponent uptime to 0%!
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => {
              setMode('ai');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              mode === 'ai' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" /> <span>vs AI Architect</span>
          </button>
          <button
            onClick={() => {
              setMode('local');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              mode === 'local' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> <span>Local 2-Player</span>
          </button>
        </div>
      </div>

      {/* Main Battle Arena */}
      {!isPlaying && !isGameOver ? (
        /* Battle Intro Screen */
        <div className="p-8 sm:p-12 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mx-auto shadow-lg">
            <Server className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h4 className="text-2xl font-black text-white">ENTER THE SERVER ARENA</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Turn-based developer card duel. Manage Compute Energy, deploy DDoS attacks, install Next.js Edge WAFs, and crash the opponent node.
            </p>
          </div>
          <button
            onClick={startDuel}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Start Server Battle</span>
          </button>
        </div>
      ) : isGameOver ? (
        /* Game Over Result */
        <div className="p-8 sm:p-12 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-lg">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            {winner === 'p1' ? '🎉 PLAYER 1 NODE VICTORIOUS!' : '👑 PLAYER 2 / AI CRASHED YOUR SERVER!'}
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            {winner === 'p1' ? '100% Uptime Maintained · Architecture Mastered' : 'Server Status: 500 Fatal Error'}
          </p>

          {winner === 'p1' && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold space-y-1 max-w-sm mx-auto">
              <span>🏆 Architecture Master Award Unlocked!</span>
              <p className="text-[11px] text-slate-300 font-normal">
                You've defeated the production node! Book a free 30-min Architecture & Speed Audit.
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={startDuel}
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rematch Duel</span>
            </button>
            {winner === 'p1' && (
              <button
                onClick={() => setShowRewardModal(true)}
                className="px-6 py-2.5 rounded-xl bg-[#1d63ed] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Claim Free Audit</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Active Duel Gameplay Arena */
        <div className="space-y-6">
          
          {/* Opponent (Player 2 / AI) Node Strip */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-white block">
                  {mode === 'ai' ? 'SENIOR AI ARCHITECT' : 'PLAYER 2 (OPPONENT)'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  COMPUTE ENERGY: <strong className="text-amber-400">{p2Energy}/10 ⚡</strong>
                </span>
              </div>
            </div>

            {/* Opponent Health & Shield Bars */}
            <div className="flex items-center gap-4">
              {p2Shield > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/50">
                  <Shield className="w-3.5 h-3.5" />
                  <span>+{p2Shield} SHIELD</span>
                </div>
              )}
              <div className="w-40 sm:w-56 space-y-1">
                <div className="flex justify-between text-[11px] font-mono font-bold">
                  <span className="text-slate-400">UPTIME:</span>
                  <span className={p2Hp > 50 ? 'text-emerald-400' : 'text-rose-400'}>{p2Hp}%</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      p2Hp > 50 ? 'bg-emerald-400' : p2Hp > 25 ? 'bg-amber-400' : 'bg-rose-500 animate-pulse'
                    }`}
                    style={{ width: `${p2Hp}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Center Arena: Turn Banner & Live Combat Console Feed */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Active Turn Indicator (4 Cols) */}
            <div className="md:col-span-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">CURRENT TURN:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    activeTurn === 'p1'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                  }`}
                >
                  {activeTurn === 'p1' ? 'YOUR TURN' : 'OPPONENT TURN'}
                </span>
              </div>
              <button
                onClick={endTurn}
                disabled={activeTurn !== 'p1'}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-black uppercase tracking-wider text-white transition-all cursor-pointer disabled:cursor-not-allowed border border-slate-700"
              >
                End Turn (+3 ⚡ Energy)
              </button>
            </div>

            {/* Live Combat Feed (8 Cols) */}
            <div className="md:col-span-8 p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 h-24 overflow-y-auto">
              <span className="text-[10px] uppercase font-bold text-slate-400 block border-b border-slate-800 pb-1">
                Real-Time Console Feed
              </span>
              {combatLog.map((log, idx) => (
                <p key={idx} className="leading-tight truncate">
                  {log}
                </p>
              ))}
            </div>

          </div>

          {/* Player 1 (Your Node) Health Bar */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white block">PLAYER 1 NODE (YOU)</span>
                  <button
                    onClick={() => setP1AutoPilot(!p1AutoPilot)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-sans font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                      p1AutoPilot
                        ? 'bg-emerald-500 text-slate-950 shadow-xs'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                    title="Toggle AI Auto-Pilot to play for you"
                  >
                    <Bot className="w-3 h-3" />
                    <span>{p1AutoPilot ? 'AI Playing' : 'AI Auto-Pilot'}</span>
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  COMPUTE ENERGY: <strong className="text-amber-400">{p1Energy}/10 ⚡</strong>
                </span>
              </div>
            </div>

            {/* Health & Shield */}
            <div className="flex items-center gap-4">
              {p1Shield > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/50">
                  <Shield className="w-3.5 h-3.5" />
                  <span>+{p1Shield} SHIELD</span>
                </div>
              )}
              <div className="w-40 sm:w-56 space-y-1">
                <div className="flex justify-between text-[11px] font-mono font-bold">
                  <span className="text-slate-400">UPTIME:</span>
                  <span className={p1Hp > 50 ? 'text-emerald-400' : 'text-rose-400'}>{p1Hp}%</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      p1Hp > 50 ? 'bg-emerald-400' : p1Hp > 25 ? 'bg-amber-400' : 'bg-rose-500 animate-pulse'
                    }`}
                    style={{ width: `${p1Hp}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Groq AI Card Forge & Player Hand */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  Groq AI Wildcard Forge
                </span>
              </div>

              <div className="flex items-center gap-2 flex-1 max-w-md">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Memory leak attack or Redis cache shield..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') forgeAiCard();
                  }}
                />
                <button
                  onClick={() => forgeAiCard()}
                  disabled={isGeneratingCard}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingCard ? 'Forging...' : 'Forge'}</span>
                </button>
              </div>
            </div>

            <span className="text-xs font-black uppercase tracking-wider text-slate-400 block px-1">
              Your Infrastructure Hand (Click Card to Deploy)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {p1Hand.map((card, idx) => {
                const canAfford = p1Energy >= card.cost && activeTurn === 'p1';
                return (
                  <button
                    key={`${card.id}-${idx}`}
                    onClick={() => playCard(card, 'p1')}
                    disabled={!canAfford}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${
                      canAfford
                        ? 'bg-slate-950 hover:bg-slate-850 border-slate-700 hover:border-amber-400 hover:-translate-y-1 shadow-lg'
                        : 'bg-slate-950/50 border-slate-800 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{card.icon}</span>
                      <span className="text-xs font-mono font-black text-amber-400 bg-amber-500/10 border border-amber-400/30 px-2 py-0.5 rounded-md">
                        {card.cost} ⚡ COST
                      </span>
                    </div>

                    <div>
                      <h5 className="text-sm font-black text-white">{card.name}</h5>
                      <p className="text-[11px] text-slate-400 font-medium leading-snug mt-1">
                        {card.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold">
                      <span
                        className={
                          card.type === 'attack'
                            ? 'text-rose-400'
                            : card.type === 'defense'
                            ? 'text-cyan-400'
                            : 'text-emerald-400'
                        }
                      >
                        {card.type === 'attack'
                          ? `-${card.value} HP`
                          : card.type === 'defense'
                          ? `+${card.value} Shield`
                          : `+${card.value} HP`}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {canAfford ? 'Deploy Card →' : 'Low Energy'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      <ContactModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        defaultService="Code Duel Winner — Architecture Audit"
      />
    </div>
  );
}
