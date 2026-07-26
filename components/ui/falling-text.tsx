'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RefreshCw, Play, Sparkles } from 'lucide-react';

interface FallingTextProps {
  words?: string[];
  containerHeight?: number;
  gravity?: number;
  bounce?: number;
  fontSize?: number;
  highlightColor?: string;
  className?: string;
}

interface Particle {
  id: number;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  vRot: number;
  isDragging?: boolean;
}

const DEFAULT_WORDS = [
  'React',
  'Next.js',
  'TypeScript',
  'WordPress',
  'Node.js',
  'AI Workflows',
  'Tailwind CSS',
  'PostgreSQL',
  'GraphQL',
  'Rest API',
  'UI/UX',
  'Full-Stack',
];

const PALETTE = [
  { bg: '#0b1a30', text: '#f59e0b', border: '#1e293b' },
  { bg: '#0284c7', text: '#ffffff', border: '#38bdf8' },
  { bg: '#4f46e5', text: '#ffffff', border: '#818cf8' },
  { bg: '#059669', text: '#ffffff', border: '#34d399' },
  { bg: '#d97706', text: '#ffffff', border: '#fbbf24' },
  { bg: '#7c3aed', text: '#ffffff', border: '#a78bfa' },
  { bg: '#0f172a', text: '#38bdf8', border: '#334155' },
];

export function FallingText({
  words = DEFAULT_WORDS,
  containerHeight = 320,
  gravity = 0.45,
  bounce = 0.65,
  fontSize = 13,
  className = '',
}: FallingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  const initParticles = useCallback(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth || 600;

    const newParticles: Particle[] = words.map((word, i) => {
      const colorScheme = PALETTE[i % PALETTE.length];
      const approxWidth = Math.max(70, word.length * (fontSize * 0.75) + 24);
      const approxHeight = fontSize + 16;

      return {
        id: i,
        text: word,
        x: Math.random() * (width - approxWidth - 20) + 10,
        y: -30 - i * 40, // Staggered drop from top
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 2 + 1,
        width: approxWidth,
        height: approxHeight,
        color: colorScheme.bg,
        rotation: (Math.random() - 0.5) * 15,
        vRot: (Math.random() - 0.5) * 2,
      };
    });

    setParticles(newParticles);
  }, [words, fontSize]);

  useEffect(() => {
    initParticles();
    const handleResize = () => initParticles();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initParticles]);

  // Physics animation loop
  useEffect(() => {
    let animationFrameId: number;

    const updatePhysics = () => {
      if (!containerRef.current) return;
      const boundsWidth = containerRef.current.clientWidth;
      const boundsHeight = containerHeight;

      setParticles((prevParticles) => {
        return prevParticles.map((p) => {
          let { x, y, vx, vy, rotation, vRot, width, height } = p;

          // Apply Gravity
          vy += gravity;

          // Apply Velocity
          x += vx;
          y += vy;
          rotation += vRot;

          // Damping / Friction
          vx *= 0.99;
          vy *= 0.99;
          vRot *= 0.98;

          // Bottom boundary collision (Floor)
          if (y + height >= boundsHeight) {
            y = boundsHeight - height;
            vy = -vy * bounce;
            vx *= 0.85; // Friction on floor
            vRot *= 0.7;
          }

          // Left boundary collision
          if (x <= 5) {
            x = 5;
            vx = -vx * bounce;
          }

          // Right boundary collision
          if (x + width >= boundsWidth - 5) {
            x = boundsWidth - width - 5;
            vx = -vx * bounce;
          }

          return {
            ...p,
            x,
            y,
            vx,
            vy,
            rotation,
            vRot,
          };
        });
      });

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [containerHeight, gravity, bounce]);

  // Click on pill to toss / fling upward
  const handlePillClick = (id: number) => {
    setParticles((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            vy: -8 - Math.random() * 6,
            vx: (Math.random() - 0.5) * 10,
            vRot: (Math.random() - 0.5) * 15,
          };
        }
        return p;
      })
    );
  };

  return (
    <div className={`relative w-full rounded-3xl bg-slate-950/90 border border-slate-800 p-4 shadow-2xl overflow-hidden ${className}`}>
      
      {/* Header controls */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Interactive Physics Tech Playground</span>
        </div>

        <button
          type="button"
          onClick={initParticles}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-extrabold text-amber-400 border border-slate-700 transition-all cursor-pointer"
          title="Drop Pills Again"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Drop Again</span>
        </button>
      </div>

      {/* Physics Container */}
      <div
        ref={containerRef}
        style={{ height: containerHeight }}
        className="relative w-full select-none cursor-grab active:cursor-grabbing overflow-hidden"
      >
        {particles.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handlePillClick(p.id)}
            style={{
              transform: `translate3d(${p.x}px, ${p.y}px, 0px) rotate(${p.rotation}deg)`,
              position: 'absolute',
              top: 0,
              left: 0,
              fontSize: `${fontSize}px`,
            }}
            className="px-3.5 py-1.5 rounded-full text-white font-extrabold shadow-lg transition-transform duration-75 active:scale-95 border border-white/20 hover:border-amber-400 hover:text-amber-300 flex items-center justify-center cursor-pointer"
          >
            <span
              className="px-2 py-0.5 rounded-md"
              style={{ backgroundColor: p.color }}
            >
              {p.text}
            </span>
          </button>
        ))}

        {/* Hint text at bottom */}
        <div className="absolute bottom-2 inset-x-0 text-center pointer-events-none">
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
            💡 Click any skill pill to toss it back into gravity!
          </span>
        </div>
      </div>
    </div>
  );
}
