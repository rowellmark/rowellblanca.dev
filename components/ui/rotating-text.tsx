'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RotatingTextProps {
  texts: string[];
  rotationInterval?: number;
  className?: string;
}

export function RotatingText({
  texts,
  rotationInterval = 2000,
  className = '',
}: RotatingTextProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [texts, rotationInterval]);

  return (
    <span className={`inline-flex relative overflow-hidden align-bottom ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentTextIndex}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="inline-block whitespace-nowrap font-bold text-brand-amber"
        >
          {texts[currentTextIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
