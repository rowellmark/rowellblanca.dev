'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, ChevronDown, ChevronUp } from 'lucide-react';

interface BibleVerse {
  bookname: string;
  chapter: string;
  verse: string;
  text: string;
}

const SESSION_KEY = 'daily_bible_verse';

export function DailyBibleVerse() {
  const [verse, setVerse] = useState<BibleVerse | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Check if user previously dismissed for this session
    const dismissed = sessionStorage.getItem(`${SESSION_KEY}_dismissed`);
    if (dismissed === 'true') {
      setIsVisible(false);
      return;
    }

    // Check session cache first to avoid redundant API calls
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached) {
      try {
        setVerse(JSON.parse(cached));
        return;
      } catch {}
    }

    // Fetch verse of the day — labs.bible.org (NET Bible, free, no API key)
    fetch('https://labs.bible.org/api/?passage=votd&type=json')
      .then((res) => res.json())
      .then((data: BibleVerse[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const v = data[0];
          setVerse(v);
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(v));
        }
      })
      .catch(() => {
        // Graceful fallback — use a curated verse if fetch fails
        const fallback: BibleVerse = {
          bookname: 'Philippians',
          chapter: '4',
          verse: '13',
          text: 'I am able to do all things through the one who strengthens me.',
        };
        setVerse(fallback);
      });
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem(`${SESSION_KEY}_dismissed`, 'true');
  };

  if (!isMounted || !isVisible || !verse) return null;

  const reference = `${verse.bookname} ${verse.chapter}:${verse.verse}`;
  // Strip trailing spaces/punctuation inconsistencies from the API
  const verseText = verse.text.trim().replace(/\s+/g, ' ');

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full bg-gradient-to-r from-indigo-950 via-[#0d1f3c] to-slate-900 border-b border-indigo-800/50 shadow-md shadow-indigo-900/20"
          role="complementary"
          aria-label="Daily Bible verse"
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
            {/* Collapsed bar */}
            <div
              className="flex items-center justify-between py-2 gap-3 cursor-pointer select-none"
              onClick={() => setIsCollapsed((c) => !c)}
            >
              {/* Left: icon + label */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="h-6 w-6 rounded-md bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
                  <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 hidden sm:block">
                  Verse of the Day
                </span>
              </div>

              {/* Center: verse preview / full */}
              <div className="flex-1 min-w-0">
                {isCollapsed ? (
                  <p className="text-[11px] sm:text-xs text-slate-300 font-medium truncate">
                    <em>"{verseText}"</em>{' '}
                    <span className="text-amber-400 font-bold not-italic">— {reference}</span>
                  </p>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="py-1"
                  >
                    <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed line-clamp-3 sm:line-clamp-none">
                      <em>"{verseText}"</em>
                    </p>
                    <p className="text-[11px] text-amber-400 font-bold mt-0.5">— {reference} (NET)</p>
                  </motion.div>
                )}
              </div>

              {/* Right: collapse toggle + close */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  aria-label={isCollapsed ? 'Expand verse' : 'Collapse verse'}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCollapsed((c) => !c);
                  }}
                >
                  {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </button>
                <button
                  aria-label="Dismiss daily verse"
                  id="dismiss-daily-verse"
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDismiss();
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
