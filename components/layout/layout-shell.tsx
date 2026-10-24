'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import { WelcomeLoading } from '@/components/loading-intro/loading-screen';
import dynamic from 'next/dynamic';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { CommandPaletteLoader } from '@/components/ui/command-palette-loader';
import { useIdle } from '@/components/layout/use-idle';
import { SmoothScroll } from '@/components/layout/smooth-scroll';
import { MotionEffects } from '@/components/layout/motion-effects';

const ChatBubble = dynamic(() => import('@/components/ui/chat-bubble'), { ssr: false });

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // RowBot isn't needed for first paint: load it once the page is idle.
  const idle = useIdle();

  // Hide main website header, footer, and intro loading on admin routes and login page
  const isAdminOrLogin = pathname.startsWith('/admin') || pathname === '/login';

  if (isAdminOrLogin) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <SmoothScroll />
      <MotionEffects />
      <ScrollProgress />
      <WelcomeLoading />
      <CommandPaletteLoader />
      <Header />
      <main>{children}</main>
      <Footer />
      {idle && <ChatBubble />}
    </>
  );
}
