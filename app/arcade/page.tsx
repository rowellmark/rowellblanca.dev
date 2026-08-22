import { Metadata } from 'next';
import { ArcadeClient } from './arcade-client';

export const metadata: Metadata = {
  title: 'Engineering Arcade Arena 🎮 | 7 Retro & AI Multiplayer Games',
  description:
    'Play 60FPS multiplayer & vs AI developer games: Grand Prix Racing, Lightsaber Duel, Cyber Snake, Space Impact, and Code Duel. Built by Rowell Mark Blanca.',
  keywords: [
    'Developer Arcade',
    'Cyber Snake',
    'Space Impact',
    'Lightsaber Duel',
    'Grand Prix Racing',
    'Code Duel',
    'Cyber Pong',
    'React Canvas Game',
    'Groq AI Games',
  ],
  openGraph: {
    title: 'Engineering Arcade Arena 🎮 | 7 Retro & AI Multiplayer Games',
    description:
      'Challenge friends or AI bots in 7 retro cyberpunk games: Grand Prix Racing, Lightsaber Duel with Groq AI, Cyber Snake, Space Impact, and Code Duel!',
    url: 'https://rowellblanca.dev/arcade',
    siteName: 'Rowell Mark Blanca — Senior Full-Stack Engineer',
    type: 'website',
    images: [
      {
        url: 'https://rowellblanca.dev/opengraph-image1.jpg',
        width: 1200,
        height: 630,
        alt: 'Rowell Mark Blanca Engineering Arcade Arena',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engineering Arcade Arena 🎮 | Play 7 Retro Developer Games',
    description:
      'Play 2-Player & vs AI games: Grand Prix Racing, Lightsaber Duel, Cyber Snake, Space Impact, and Code Duel!',
    creator: '@RowellMark',
    images: ['https://rowellblanca.dev/opengraph-image1.jpg'],
  },
};

export default function ArcadePage() {
  return <ArcadeClient />;
}
