'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Lenis-style smooth wheel scrolling for the public site. Touch-only devices
// skip Lenis entirely (native momentum scroll, and no per-frame RAF loop on
// phones), and prefers-reduced-motion disables smoothing (respectReducedMotion).
export function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const lenis = new Lenis({
      lerp: 0.1,
      autoRaf: true,
      anchors: { offset: -80 },
      stopInertiaOnNavigate: true,
      // chat panel, command palette and modals keep their own native scroll
      allowNestedScroll: true,
    });
    // Expose a clamped scroll velocity (-1..1) as a CSS variable for velocity-linked effects.
    const root = document.documentElement;
    let last = 0;
    lenis.on('scroll', ({ velocity }: Lenis) => {
      const raw = Math.max(-1, Math.min(1, velocity / 40));
      const v = Math.abs(raw) < 0.02 ? 0 : raw;
      if (Math.abs(v - last) > 0.01) {
        last = v;
        root.style.setProperty('--scroll-velocity', v.toFixed(3));
      }
    });
    const settle = setInterval(() => {
      if (!lenis.isScrolling && last !== 0) {
        last = 0;
        root.style.setProperty('--scroll-velocity', '0');
      }
    }, 150);

    return () => {
      clearInterval(settle);
      root.style.removeProperty('--scroll-velocity');
      lenis.destroy();
    };
  }, []);

  return null;
}
