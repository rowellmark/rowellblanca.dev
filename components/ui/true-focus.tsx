'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface TrueFocusProps {
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
}

export function TrueFocus({
  sentence = 'Specialized Technical Expertise',
  manualMode = false,
  blurAmount = 2.5,
  borderColor = '#f59e0b',
  glowColor = 'rgba(245, 158, 11, 0.5)',
  animationDuration = 0.4,
  pauseBetweenAnimations = 1.6,
  className = '',
}: TrueFocusProps) {
  const words = sentence.split(' ');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-switch focus word on timer if not manualMode
  useEffect(() => {
    if (manualMode) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, (animationDuration + pauseBetweenAnimations) * 1000);
    return () => clearInterval(interval);
  }, [manualMode, words.length, animationDuration, pauseBetweenAnimations]);

  // Recalculate focus box dimensions accurately
  const updateFocusRect = useCallback(() => {
    if (!wordRefs.current[currentIndex] || !containerRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();

    if (activeRect.width > 0 && activeRect.height > 0) {
      setFocusRect({
        x: activeRect.left - parentRect.left - 8,
        y: activeRect.top - parentRect.top - 4,
        width: activeRect.width + 16,
        height: activeRect.height + 8,
      });
    }
  }, [currentIndex]);

  useEffect(() => {
    updateFocusRect();
    window.addEventListener('resize', updateFocusRect);
    const timeout = setTimeout(updateFocusRect, 100);
    return () => {
      window.removeEventListener('resize', updateFocusRect);
      clearTimeout(timeout);
    };
  }, [updateFocusRect, sentence]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 select-none py-1 ${className}`}
    >
      {words.map((word, idx) => {
        const isFocused = idx === currentIndex;
        return (
          <span
            key={idx}
            ref={(el) => {
              wordRefs.current[idx] = el;
            }}
            onMouseEnter={() => setCurrentIndex(idx)}
            style={{
              filter: isFocused ? 'none' : `blur(${blurAmount}px)`,
              opacity: isFocused ? 1 : 0.4,
              transition: `filter ${animationDuration}s ease, opacity ${animationDuration}s ease`,
            }}
            className="cursor-pointer font-black tracking-tight transition-all duration-300 relative z-0"
          >
            {word}
          </span>
        );
      })}

      {/* ReactBits TrueFocus Glowing Frame Box with Corner Accents */}
      <motion.div
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: focusRect.width > 0 ? 1 : 0,
        }}
        transition={{
          duration: animationDuration,
          ease: 'easeOut',
        }}
        style={{
          boxShadow: `0 0 25px ${glowColor}`,
        }}
        className="pointer-events-none absolute left-0 top-0 rounded-xl border border-amber-400/40 bg-amber-500/10 z-10"
      >
        {/* Top-Left Corner Bracket */}
        <span
          className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 rounded-tl-sm"
          style={{ borderColor }}
        />
        {/* Top-Right Corner Bracket */}
        <span
          className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 rounded-tr-sm"
          style={{ borderColor }}
        />
        {/* Bottom-Left Corner Bracket */}
        <span
          className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 rounded-bl-sm"
          style={{ borderColor }}
        />
        {/* Bottom-Right Corner Bracket */}
        <span
          className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 rounded-br-sm"
          style={{ borderColor }}
        />
      </motion.div>
    </div>
  );
}
