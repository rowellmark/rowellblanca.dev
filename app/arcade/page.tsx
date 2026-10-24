import { Metadata } from 'next';
import { ArcadeClient } from './arcade-client';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: "/arcade",
  title: "Developer Arcade: 7 Free Browser Games",
  description:
    "Play 7 retro browser games built with React and Canvas: Grand Prix racing, Lightsaber Duel, Cyber Snake, Space Impact and Code Duel, vs a friend or AI.",
  keywords: ["browser games", "React canvas games", "developer arcade"],
});

export default function ArcadePage() {
  return <ArcadeClient />;
}
