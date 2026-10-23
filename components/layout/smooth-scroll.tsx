'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Lenis-style smooth wheel scrolling for the public site. Touch devices keep
// native momentum scroll (syncTouch off) and prefers-reduced-motion disables
// smoothing entirely (respectReducedMotion defaults to true).
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      autoRaf: true,
      anchors: { offset: -80 },
      stopInertiaOnNavigate: true,
      // chat panel, command palette and modals keep their own native scroll
      allowNestedScroll: true,
    });
    return () => lenis.destroy();
  }, []);

  return null;
}
