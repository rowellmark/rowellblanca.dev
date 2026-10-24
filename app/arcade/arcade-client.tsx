'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  Swords,
  Rocket,
  Activity,
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
import { GameShareModal } from '@/components/arcade/game-share-modal';
import { ProjectEstimator } from '@/components/homepage/project-estimator';
import { EngagementModels } from '@/components/homepage/engagement-models';
import { ContactModal } from '@/components/ui/contact-modal';
import { Share2 } from 'lucide-react';
import { PageHero, heroChipClass } from '@/components/ui/page-hero';

type ActiveGame = 'racing' | 'saber' | 'snake' | 'space' | 'pong' | 'duel' | 'racer';

const GAME_NAMES: Record<ActiveGame, string> = {
  racing: 'Neon Grand Prix 2-Player Racing',
  saber: 'Lightsaber Duel: Cyber Blade Arena',
  snake: 'Cyber Snake: Full-Stack Devourer',
  space: 'Space Impact: Galaxy Defender',
  duel: 'Code Duel: Architecture 1v1 Battle',
  pong: 'Cyber Pong: High-RPS Packet Duel',
  racer: 'Speed Runner: Core Web Vitals Dash',
};

const GAME_TABS: { id: ActiveGame; label: string; Icon: typeof Gauge }[] = [
  { id: 'racing', label: 'Grand Prix 2P', Icon: Gauge },
  { id: 'saber', label: 'Lightsaber Duel', Icon: Swords },
  { id: 'snake', label: 'Cyber Snake', Icon: Zap },
  { id: 'space', label: 'Space Impact', Icon: Rocket },
  { id: 'duel', label: 'Code Duel', Icon: Activity },
  { id: 'pong', label: 'Cyber Pong', Icon: Flame },
  { id: 'racer', label: 'Speed Runner', Icon: Gauge },
];

export function ArcadeClient() {
  const [activeGame, setActiveGame] = useState<ActiveGame>('racing');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Sync with URL query parameter ?game=...
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const requested = params.get('game') as ActiveGame;
      if (requested && GAME_NAMES[requested]) {
        setActiveGame(requested);
      }
    }
  }, []);

  const switchGame = (gameId: ActiveGame) => {
    setActiveGame(gameId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('game', gameId);
      window.history.pushState({}, '', url.toString());
    }
  };

  return (
    <div className="min-h-screen bg-brand-ink text-white font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Arcade Hero Banner */}
      <PageHero
        label="Interactive developer arena"
        titleLines={['Engineering', 'arcade arena.']}
        accentLine={1}
        lead="7 retro arcade & multiplayer games: Grand Prix Racing, Lightsaber Fighting, Cyber Snake, Space Impact, Code Duel and more."
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a game">
            {GAME_TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={activeGame === id}
                onClick={() => switchGame(id)}
                className={`${heroChipClass(activeGame === id)} inline-flex items-center gap-2`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            className="self-start inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-amber-400 hover:text-amber-300 motion-underline cursor-pointer"
          >
            <Share2 className="w-4 h-4" aria-hidden="true" />
            Share &amp; challenge: {GAME_NAMES[activeGame]}
          </button>
        </div>
      </PageHero>

      {/* Main Active Game Stage */}
      <section className="px-4 sm:px-6 lg:px-10 pb-24">
        <div className="mx-auto max-w-[1360px]">
          {activeGame === 'racing' && <CyberRacingGame />}
          {activeGame === 'saber' && <LightsaberDuelGame />}
          {activeGame === 'snake' && <CyberSnakeGame />}
          {activeGame === 'space' && <SpaceImpactGame />}
          {activeGame === 'duel' && <CodeDuelGame />}
          {activeGame === 'pong' && <CyberPongGame />}
          {activeGame === 'racer' && <SpeedRacerGame />}
        </div>
      </section>

      {/* Share Modal */}
      <GameShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        gameId={activeGame}
        gameTitle={GAME_NAMES[activeGame]}
      />

      {/* Estimator & engagement models on the light ground they are designed for */}
      <div className="bg-brand-bg text-brand-navy rounded-t-[40px]">
        <div id="project-estimator" className="pt-24 lg:pt-32">
          <ProjectEstimator />
        </div>
        <EngagementModels />
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
