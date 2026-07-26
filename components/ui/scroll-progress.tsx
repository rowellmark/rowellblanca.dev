'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function ScrollProgress() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();

  // Smooth spring physics for fluid progress bar movement
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 35,
    restDelta: 0.001,
  });

  // Hide progress bar on admin portal & login page
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null;
  }

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 origin-left z-[9999] shadow-[0_0_10px_rgba(245,158,11,0.6)] pointer-events-none"
    />
  );
}
