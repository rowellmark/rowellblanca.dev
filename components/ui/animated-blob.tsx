'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBlobProps {
  children: React.ReactNode;
  colorPreset?: 'amber' | 'violet' | 'sky' | 'emerald' | 'rose' | 'indigo';
  gradient?: string;
  sizeClassName?: string;
  className?: string;
}

const COLOR_PRESETS: Record<string, [string, string]> = {
  amber: ['#f59e0b', '#ea580c'],
  violet: ['#8b5cf6', '#4f46e5'],
  sky: ['#38bdf8', '#0284c7'],
  emerald: ['#10b981', '#0d9488'],
  rose: ['#f43f5e', '#e11d48'],
  indigo: ['#6366f1', '#4338ca'],
};

const BLOB_PATHS = [
  'M41.5,-63.9C52.4,-57.4,59,-44.1,64.2,-31.2C69.4,-18.3,73.2,-5.8,72.4,6.5C71.6,18.8,66.2,30.9,58.8,41.4C51.4,51.9,42,60.8,30.7,66.1C19.4,71.4,6.2,73.1,-6.3,71.2C-18.8,69.3,-30.6,63.8,-41.4,55.9C-52.2,48,-62,37.7,-67.7,24.8C-73.4,11.9,-75,-3.6,-71.4,-17.8C-67.8,-32,-59,-44.9,-47.5,-51.2C-36,-57.5,-21.8,-57.2,-7.4,-56.3C7,-55.4,30.6,-70.4,41.5,-63.9Z',
  'M48.1,-70.5C61.3,-62.4,70.3,-47.8,75.4,-32.4C80.5,-17,81.7,-0.8,78.2,14.6C74.7,30,66.5,44.6,54.8,55.1C43.1,65.6,27.9,72,11.8,73.8C-4.3,75.6,-21.3,72.8,-35.8,64.8C-50.3,56.8,-62.3,43.6,-68.8,28.2C-75.3,12.8,-76.3,-4.8,-71.9,-20.6C-67.5,-36.4,-57.7,-50.4,-44.6,-58.5C-31.5,-66.6,-15.7,-68.8,0.7,-69.9C17.1,-71,34.9,-78.6,48.1,-70.5Z',
  'M38.7,-58.2C50.2,-51.5,59.8,-41.1,64.7,-28.9C69.6,-16.7,69.8,-2.7,66.8,10.6C63.8,23.9,57.6,36.5,48.3,46.5C39,56.5,26.6,63.9,12.8,66.2C-1,68.5,-16.2,65.7,-30.1,59.2C-44,52.7,-56.6,42.5,-63.3,29.1C-70,15.7,-70.8,-0.9,-66.9,-16.2C-63,-31.5,-54.4,-45.5,-42.2,-52.1C-30,-58.7,-15,-57.9,0.3,-58.4C15.6,-58.9,27.2,-64.9,38.7,-58.2Z',
  'M41.5,-63.9C52.4,-57.4,59,-44.1,64.2,-31.2C69.4,-18.3,73.2,-5.8,72.4,6.5C71.6,18.8,66.2,30.9,58.8,41.4C51.4,51.9,42,60.8,30.7,66.1C19.4,71.4,6.2,73.1,-6.3,71.2C-18.8,69.3,-30.6,63.8,-41.4,55.9C-52.2,48,-62,37.7,-67.7,24.8C-73.4,11.9,-75,-3.6,-71.4,-17.8C-67.8,-32,-59,-44.9,-47.5,-51.2C-36,-57.5,-21.8,-57.2,-7.4,-56.3C7,-55.4,30.6,-70.4,41.5,-63.9Z',
];

export function AnimatedBlob({
  children,
  colorPreset,
  gradient = 'amber',
  sizeClassName = 'w-14 h-14',
  className = '',
}: AnimatedBlobProps) {
  // Determine color preset based on explicit colorPreset or gradient string key
  let presetKey = colorPreset || 'amber';
  if (!colorPreset && gradient) {
    if (gradient.includes('violet')) presetKey = 'violet';
    else if (gradient.includes('sky') || gradient.includes('blue')) presetKey = 'sky';
    else if (gradient.includes('emerald') || gradient.includes('teal')) presetKey = 'emerald';
    else if (gradient.includes('rose')) presetKey = 'rose';
    else if (gradient.includes('indigo')) presetKey = 'indigo';
    else presetKey = 'amber';
  }

  const [startColor, stopColor] = COLOR_PRESETS[presetKey] || COLOR_PRESETS.amber;
  const gradId = `blob-grad-${presetKey}-${Math.random().toString(36).substring(2, 6)}`;

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 group ${sizeClassName} ${className}`}>
      {/* SVG Morphing Vector Blob Background */}
      <svg
        viewBox="-110 -110 220 220"
        className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible pointer-events-none"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={stopColor} />
          </linearGradient>
        </defs>

        <motion.path
          d={BLOB_PATHS}
          animate={{
            d: BLOB_PATHS,
            rotate: [0, 90, 180, 270, 360],
            scale: [1.1, 1.22, 1.14, 1.18, 1.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          fill={`url(#${gradId})`}
        />
      </svg>

      {/* Icon Centered Layer */}
      <div className="relative z-10 w-full h-full flex items-center justify-center text-white pointer-events-none group-hover:scale-110 transition-transform">
        {children}
      </div>
    </div>
  );
}
