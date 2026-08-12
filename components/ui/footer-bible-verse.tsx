'use client';

import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';

interface BibleVerse {
  bookname: string;
  chapter: string;
  verse: string;
  text: string;
}

const SESSION_KEY = 'daily_bible_verse_v2';

export function FooterBibleVerse() {
  const [verse, setVerse] = useState<BibleVerse | null>(null);

  useEffect(() => {
    // Serve from session cache first — only one real fetch per browser session
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached) {
      try { setVerse(JSON.parse(cached)); return; } catch {}
    }

    fetch('https://labs.bible.org/api/?passage=votd&type=json')
      .then((r) => r.json())
      .then((data: BibleVerse[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setVerse(data[0]);
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(data[0]));
        }
      })
      .catch(() => {
        const fallback: BibleVerse = {
          bookname: 'Philippians', chapter: '4', verse: '13',
          text: 'I am able to do all things through the one who strengthens me.',
        };
        setVerse(fallback);
      });
  }, []);

  if (!verse) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-950 via-[#0d1f3c] to-slate-900 border-b border-indigo-800/40">
      <div className="container mx-auto px-6 max-w-6xl py-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-7 w-7 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-amber-400" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 whitespace-nowrap">
            Verse of the Day
          </span>
        </div>
        <div className="hidden sm:block h-8 w-px bg-indigo-700/50 shrink-0" />
        <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
          <em>&ldquo;{verse.text.trim()}&rdquo;</em>
          <span className="ml-2 text-amber-400 font-bold not-italic whitespace-nowrap">
            &mdash; {verse.bookname} {verse.chapter}:{verse.verse} (NET)
          </span>
        </p>
      </div>
    </div>
  );
}
