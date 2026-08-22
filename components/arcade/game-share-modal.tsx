'use client';

import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface GameShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: string;
  gameTitle: string;
  gameDescription?: string;
  score?: number;
}

export function GameShareModal({
  isOpen,
  onClose,
  gameId,
  gameTitle,
  gameDescription,
  score,
}: GameShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://rowellblanca.dev';
  const shareUrl = `${origin}/arcade?game=${gameId}`;

  const defaultText = score
    ? `🕹️ I just scored ${score} in ${gameTitle}! Think you can beat my high score on @RowellMark's Engineering Arcade?`
    : `🕹️ Play ${gameTitle} in the Engineering Arcade by @RowellMark! 60FPS Cyberpunk 2-Player & vs AI games:`;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(defaultText);

  // Social Share URLs
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=WebDev,React,Gaming,IndieGame,GroqAI`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
  const redditUrl = `https://reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(
    `Play ${gameTitle} on Engineering Arcade!`
  )}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {}
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: `${gameTitle} — Engineering Arcade`,
          text: defaultText,
          url: shareUrl,
        });
      } catch (e) {}
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-white">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Share {gameTitle}</h3>
            <p className="text-xs text-slate-400 font-medium">
              Challenge friends or share your game score!
            </p>
          </div>
        </div>

        {/* Direct Link Copy Box */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Direct Game URL
          </label>
          <div className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-1.5 bg-transparent text-xs font-mono text-cyan-300 select-all focus:outline-hidden"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* 1-Click Social Media Channels */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Share Directly to Socials
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            
            {/* 𝕏 (Twitter) */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex items-center gap-2.5 text-xs font-bold text-slate-200 transition-all cursor-pointer"
            >
              <span className="w-5 h-5 rounded-lg bg-black flex items-center justify-center text-white text-[11px] font-black">
                𝕏
              </span>
              <span>Post to 𝕏</span>
            </a>

            {/* LinkedIn */}
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex items-center gap-2.5 text-xs font-bold text-blue-400 transition-all cursor-pointer"
            >
              <span className="w-5 h-5 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold">
                in
              </span>
              <span>LinkedIn</span>
            </a>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex items-center gap-2.5 text-xs font-bold text-emerald-400 transition-all cursor-pointer"
            >
              <span className="w-5 h-5 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-[11px] font-bold">
                WA
              </span>
              <span>WhatsApp</span>
            </a>

            {/* Telegram */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex items-center gap-2.5 text-xs font-bold text-cyan-400 transition-all cursor-pointer"
            >
              <span className="w-5 h-5 rounded-lg bg-cyan-600 flex items-center justify-center text-white text-[11px] font-bold">
                TG
              </span>
              <span>Telegram</span>
            </a>

            {/* Reddit */}
            <a
              href={redditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex items-center gap-2.5 text-xs font-bold text-orange-400 transition-all cursor-pointer"
            >
              <span className="w-5 h-5 rounded-lg bg-orange-600 flex items-center justify-center text-white text-[11px] font-bold">
                r/
              </span>
              <span>Reddit</span>
            </a>

            {/* Native Mobile Share */}
            <button
              onClick={handleNativeShare}
              className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400 flex items-center gap-2.5 text-xs font-bold text-amber-300 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>More...</span>
            </button>

          </div>
        </div>

        {/* Footer Note */}
        <p className="text-[11px] text-slate-500 text-center font-medium">
          Deep links directly open this specific game cabinet on any device!
        </p>

      </div>
    </div>
  );
}
