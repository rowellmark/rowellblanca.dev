'use client';

import React, { useState } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContactModal } from './contact-modal';

interface FloatingContactCTAProps {
  defaultService?: string;
}

export function FloatingContactCTA({ defaultService }: FloatingContactCTAProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#0b1a30] hover:bg-[#1d63ed] text-white border border-amber-400/40 shadow-2xl hover:shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>

          <div className="text-left leading-tight">
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 block group-hover:text-white transition-colors">
              Have a Project in Mind?
            </span>
            <span className="text-xs font-black text-white block">
              Book Discovery Call →
            </span>
          </div>

          <div className="h-8 w-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 group-hover:bg-white transition-colors">
            <Sparkles className="w-4 h-4 text-slate-950" />
          </div>
        </button>
      </motion.div>

      <ContactModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultService={defaultService || 'Custom Software Project'}
      />
    </>
  );
}
