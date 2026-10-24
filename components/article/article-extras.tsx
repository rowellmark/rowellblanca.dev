'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Check, Link2 } from 'lucide-react';
import { IconBrandLinkedin, IconBrandX, IconBrandGithub } from '@tabler/icons-react';
import { ContactModal } from '@/components/ui/contact-modal';

const shareBtn =
  'h-11 w-11 rounded-full border border-brand-border bg-white hover:border-brand-navy text-brand-slate hover:text-brand-navy flex items-center justify-center transition-colors cursor-pointer';

/** Copy-link + LinkedIn / X share buttons for the current page. */
export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };
  const enc = encodeURIComponent;
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={copy} aria-label={copied ? 'Link copied' : 'Copy link'} className={shareBtn}>
        {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Link2 className="h-4 w-4" />}
      </button>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={shareBtn}
      >
        <IconBrandLinkedin size={17} />
      </a>
      <a
        href={`https://x.com/intent/post?text=${enc(title)}&url=${enc(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={shareBtn}
      >
        <IconBrandX size={16} />
      </a>
      <span aria-live="polite" className="sr-only">{copied ? 'Link copied' : ''}</span>
    </div>
  );
}

/** End-of-article author bio with a discovery-call CTA (opens the contact popup). */
export function AuthorCard({ avatar, service }: { avatar?: string; service?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <aside aria-label="About the author" className="rounded-[28px] bg-brand-ink text-white p-6 sm:p-9 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <span className="relative h-16 w-16 shrink-0 rounded-full overflow-hidden ring-2 ring-amber-500">
          <Image src={avatar || '/images/hero/rowell-avatar.webp'} alt="" fill sizes="64px" className="object-cover" />
        </span>
        <span className="flex flex-col gap-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">Written by</span>
          <span className="text-xl font-extrabold tracking-[-0.02em]">Rowell Mark Blanca</span>
          <span className="text-sm text-slate-400">Senior Full-Stack &amp; Next.js Engineer · 12+ yrs</span>
        </span>
      </div>
      <p className="m-0 text-slate-300 leading-relaxed">
        I build fast, quiet and scalable web platforms — Next.js apps, custom WordPress engines and APIs — for teams in
        the UK, US and Australia, without the agency overhead.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="motion-btn motion-magnetic inline-flex items-center gap-3 min-h-[52px] px-6 rounded-full bg-amber-500 hover:bg-amber-400 text-brand-ink font-bold cursor-pointer"
        >
          Book a discovery call <span className="motion-arrow" aria-hidden="true">→</span>
        </button>
        <a
          href="https://www.linkedin.com/in/rowell-blanca/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Rowell on LinkedIn"
          className="h-[52px] w-[52px] rounded-full border border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
        >
          <IconBrandLinkedin size={18} />
        </a>
        <a
          href="https://github.com/rowellmark"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Rowell on GitHub"
          className="h-[52px] w-[52px] rounded-full border border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
        >
          <IconBrandGithub size={18} />
        </a>
      </div>
      <ContactModal isOpen={open} onClose={() => setOpen(false)} initialTab="call" defaultService={service} />
    </aside>
  );
}
