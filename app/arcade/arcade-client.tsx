'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  Swords,
  Rocket,
  Trophy,
  Sparkles,
  ArrowRight,
  Shield,
  Award,
  Users,
  Bot,
  Activity,
  ChevronRight,
  Flame,
  Gauge,
} from 'lucide-react';
import { LightsaberDuelGame } from '@/components/arcade/lightsaber-duel-game';
import { CyberRacingGame } from '@/components/arcade/cyber-racing-game';
import { CyberPongGame } from '@/components/arcade/cyber-pong-game';
import { CodeDuelGame } from '@/components/arcade/code-duel-game';
import { CyberSnakeGame } from '@/components/arcade/cyber-snake-game';
import { SpaceImpactGame } from '@/components/arcade/space-impact-game';
import { SpeedRacerGame } from '@/components/interactive/speed-racer-game';
import { ProjectEstimator } from '@/components/homepage/project-estimator';
import { EngagementModels } from '@/components/homepage/engagement-models';
import { ContactModal } from '@/components/ui/contact-modal';

type ActiveGame = 'racing' | 'saber' | 'snake' | 'space' | 'pong' | 'duel' | 'racer';

export function ArcadeClient() {
  const [activeGame, setActiveGame] = useState<ActiveGame>('racing');
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070d18] text-white font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Arcade Hero Banner */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-slate-800 bg-gradient-to-b from-[#0b172a] via-[#070d18] to-[#070d18]">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10 space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Developer Arena</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200">Arcade Arena</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            7 retro arcade & multiplayer games: Grand Prix Racing, Lightsaber Fighting, Cyber Snake, Space Impact, and Code Duel!
          </p>

          {/* Game Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
            <button
              onClick={() => setActiveGame('racing')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                activeGame === 'racing'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-105'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Gauge className="w-4 h-4" />
              <span>Grand Prix 2P 🏎️</span>
            </button>

            <button
              onClick={() => setActiveGame('saber')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                activeGame === 'saber'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 scale-105'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>Lightsaber Duel ⚔️</span>
            </button>

            <button
              onClick={() => setActiveGame('snake')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                activeGame === 'snake'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Cyber Snake 🐍</span>
            </button>

            <button
              onClick={() => setActiveGame('space')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                activeGame === 'space'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25 scale-105'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Rocket className="w-4 h-4" />
              <span>Space Impact 🚀</span>
            </button>

            <button
              onClick={() => setActiveGame('duel')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                activeGame === 'duel'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 scale-105'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Code Duel 🃏</span>
            </button>

            <button
              onClick={() => setActiveGame('pong')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                activeGame === 'pong'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 scale-105'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Cyber Pong 🏓</span>
            </button>

            <button
              onClick={() => setActiveGame('racer')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                activeGame === 'racer'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 scale-105'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Gauge className="w-4 h-4" />
              <span>Speed Runner ⚡</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Active Game Stage */}
      <section className="py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          {activeGame === 'racing' && <CyberRacingGame />}
          {activeGame === 'saber' && <LightsaberDuelGame />}
          {activeGame === 'snake' && <CyberSnakeGame />}
          {activeGame === 'space' && <SpaceImpactGame />}
          {activeGame === 'duel' && <CodeDuelGame />}
          {activeGame === 'pong' && <CyberPongGame />}
          {activeGame === 'racer' && <SpeedRacerGame />}
        </div>
      </section>

      {/* Interactive Scope & Architecture Estimator */}
      <div id="project-estimator" className="border-t border-slate-800">
        <ProjectEstimator />
      </div>

      {/* Transparent Engagement Models */}
      <EngagementModels />

      {/* Bottom Conversion Banner */}
      <section className="py-20 bg-gradient-to-r from-[#0b1a30] via-slate-900 to-[#0b1a30] border-t border-slate-800 text-white text-center">
        <div className="container mx-auto px-6 max-w-4xl space-y-5">
          <Trophy className="h-12 w-12 text-amber-400 mx-auto" />
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Build Your Real-World Platform?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium">
            From high-RPS Next.js microservices to bespoke WordPress platforms, partner directly with senior full-stack engineer Rowell Mark Blanca.
          </p>
          <div className="pt-3 flex justify-center">
            <button
              onClick={() => setIsContactOpen(true)}
              className="px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Schedule Direct 15-Min Technical Call</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
