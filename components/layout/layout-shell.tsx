'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import { WelcomeLoading } from '@/components/loading-intro/loading-screen';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide main website header, footer, and intro loading on admin routes and login page
  const isAdminOrLogin = pathname.startsWith('/admin') || pathname === '/login';

  if (isAdminOrLogin) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <WelcomeLoading />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
