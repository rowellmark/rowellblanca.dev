'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Page scroll progress bar. Uses a CSS scroll timeline where supported
// (zero JS per frame); otherwise falls back to a passive scroll listener.
export function ScrollProgress() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const hidden = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

  useEffect(() => {
    const el = ref.current;
    if (!el || CSS.supports('animation-timeline: scroll()')) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="motion-scroll-progress fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 origin-left z-[9999] shadow-[0_0_10px_rgba(245,158,11,0.6)] pointer-events-none"
      style={{ transform: 'scaleX(0)' }}
    />
  );
}
