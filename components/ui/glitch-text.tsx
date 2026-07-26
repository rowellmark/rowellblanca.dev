'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlitchTextProps {
  children: string;
  className?: string;
  enableShadows?: boolean;
}

export function GlitchText({
  children,
  className = '',
  enableShadows = true,
}: GlitchTextProps) {
  return (
    <div className={`relative inline-block select-none font-black tracking-tight ${className}`}>
      {/* Base Text Layer */}
      <span className="relative z-10 block font-black text-brand-navy">
        {children}
      </span>

      {/* Top Cyan Chromatic Glitch Layer */}
      {enableShadows && (
        <motion.span
          aria-hidden="true"
          animate={{
            x: [-3, 2, -4, 3, -1, 0],
            y: [1, -2, 1, -1, 2, 0],
            opacity: [0.9, 0.6, 1, 0.7, 0.95, 0.85],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'linear',
          }}
          className="absolute top-0 left-0 z-0 block w-full h-full text-cyan-500 opacity-90 pointer-events-none animate-glitch-top font-black -translate-x-1 -translate-y-0.5"
        >
          {children}
        </motion.span>
      )}

      {/* Bottom Amber Chromatic Glitch Layer */}
      {enableShadows && (
        <motion.span
          aria-hidden="true"
          animate={{
            x: [3, -2, 4, -3, 1, 0],
            y: [-1, 2, -1, 1, -2, 0],
            opacity: [0.85, 0.95, 0.7, 1, 0.6, 0.9],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'linear',
          }}
          className="absolute top-0 left-0 z-0 block w-full h-full text-amber-500 opacity-90 pointer-events-none animate-glitch-bottom font-black translate-x-1 translate-y-0.5"
        >
          {children}
        </motion.span>
      )}
    </div>
  );
}
