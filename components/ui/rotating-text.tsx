'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RotatingTextProps {
  texts?: string[];
  rotationInterval?: number;
  staggerDuration?: number;
  className?: string;
  badgeBg?: string;
}

const DEFAULT_TEXTS = [
  'Creative',
  'Full-Stack',
  'Solutions-Driven',
  'Product-Focused',
];

export function RotatingText({
  texts = DEFAULT_TEXTS,
  rotationInterval = 2600,
  staggerDuration = 0.025,
  className = '',
  badgeBg = 'text-brand-navy font-black',
}: RotatingTextProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % texts.length);
    }, rotationInterval);
    return () => clearInterval(interval);
  }, [texts.length, rotationInterval]);

  const currentText = texts[currentIdx];
  const characters = Array.from(currentText);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDuration,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: staggerDuration,
        staggerDirection: -1,
      },
    },
  };

  const letterVariants = {
    hidden: {
      y: '100%',
      opacity: 0,
      rotateX: -90,
      filter: 'blur(4px)',
    },
    visible: {
      y: '0%',
      opacity: 1,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 380,
        damping: 24,
      },
    },
    exit: {
      y: '-100%',
      opacity: 0,
      rotateX: 90,
      filter: 'blur(4px)',
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className={`inline-flex items-center align-middle ${className}`}>
      <span className={`inline-flex items-center overflow-hidden py-1 font-black tracking-tight ${badgeBg}`}>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentText}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="inline-flex flex-wrap items-center whitespace-pre [perspective:1000px]"
          >
            {characters.map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                variants={letterVariants}
                className="inline-block origin-center"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
