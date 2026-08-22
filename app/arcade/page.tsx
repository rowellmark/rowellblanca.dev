import { Metadata } from 'next';
import { ArcadeClient } from './arcade-client';

export const metadata: Metadata = {
  title: 'Multiplayer Developer Arcade | Cyber Pong, Code Duel & Speed Racer',
  description:
    'Play real-time multiplayer developer games built by Rowell Mark Blanca. Cyber Pong high-RPS packet duel, Code Duel 1v1 server battle, and Core Web Vitals speed runner.',
  keywords: [
    'Developer Arcade',
    'Cyber Pong',
    'Code Duel',
    'Web Vitals Speed Racer',
    'React Canvas Game',
    'Interactive Portfolio Game',
  ],
};

export default function ArcadePage() {
  return <ArcadeClient />;
}
