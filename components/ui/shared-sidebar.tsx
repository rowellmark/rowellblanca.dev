'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Code2,
  Layers,
  ShieldCheck,
  Layout,
  Cpu,
  ShoppingBag,
  Zap,
} from 'lucide-react';
import { ContactModal } from './contact-modal';

interface SharedSidebarProps {
  defaultService?: string;
  serviceType?: 'react' | 'wordpress' | 'both';
}

const REACT_SERVICES = [
  {
    icon: Code2,
    title: 'Next.js 14 & React 19',
    description: 'Server Components (RSC), TypeScript strict safety, and streaming SSR performance.',
  },
  {
    icon: Layers,
    title: 'Full-Stack SaaS Portals',
    description: 'Custom lead CRM pipelines, financial portals, NeonDB PostgreSQL & Prisma ORM.',
  },
  {
    icon: Sparkles,
    title: 'Multi-Provider AI Agents',
    description: 'RAG knowledge search, Gemini 2.5, OpenAI GPT-4o, and local Ollama integrations.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise Architecture',
    description: 'Modular component refactoring, test coverage, and full GMT/BST availability.',
  },
];

const WP_SERVICES = [
  {
    icon: Layout,
    title: 'Bespoke WordPress Themes',
    description: 'Hand-coded PHP & Gutenberg block themes built without third-party page builder bloat.',
  },
  {
    icon: Cpu,
    title: 'Headless WP + Next.js',
    description: 'De-coupled architecture combining WP content agility with sub-second React speeds.',
  },
  {
    icon: ShoppingBag,
    title: 'WooCommerce Optimization',
    description: 'Custom payment gateways, database index tuning, and high-volume checkout flows.',
  },
  {
    icon: Zap,
    title: 'Page Speed & 95+ Core Web Vitals',
    description: 'Aggressive script deferral, image optimization, and Lighthouse score hardening.',
  },
];

export function SharedSidebar({ defaultService, serviceType = 'both' }: SharedSidebarProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [authorAvatar, setAuthorAvatar] = useState<string>('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.authorAvatar) {
          setAuthorAvatar(data.settings.authorAvatar);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="sticky top-28 space-y-6">
        {/* Widget 1: Floating Contact Sidebar Card */}
        <div className="bg-gradient-to-br from-[#0b1a30] to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-400/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>Have a Project in Mind?</span>
            </span>

            <h3 className="text-xl font-black text-white leading-tight">
              Build Your Custom Platform
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Partner with senior developer Rowell Mark Blanca for bespoke React, Next.js, and WordPress solutions.
            </p>
          </div>

          <ul className="space-y-2 text-xs text-slate-300 border-t border-white/10 pt-4 font-medium relative z-10">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>GMT/BST Full Timezone Overlap</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>95+ Core Web Vitals & Speed</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Clean Code & Custom Architecture</span>
            </li>
          </ul>

          <div className="pt-2 relative z-10 space-y-3">
            <button
              onClick={() => setIsContactOpen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Book Discovery Call</span>
            </button>

            <p className="text-[11px] text-center text-slate-400 font-mono">
              ⚡ Quick response within 2-4 hours
            </p>
          </div>
        </div>

        {/* Widget 2: Contextual Services Sidebar Widget */}
        {(serviceType === 'react' || serviceType === 'both') && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="space-y-1 pb-2 border-b border-slate-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full inline-block">
                React & Next.js Services
              </span>
              <h3 className="text-sm font-black text-[#0b1a30]">Engineering Capabilities</h3>
            </div>

            <div className="space-y-3">
              {REACT_SERVICES.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div key={idx} className="flex gap-3 items-start group">
                    <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0b1a30] group-hover:text-amber-600 transition-colors">
                        {s.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-snug font-medium">
                        {s.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(serviceType === 'wordpress' || serviceType === 'both') && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="space-y-1 pb-2 border-b border-slate-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full inline-block">
                WordPress Services
              </span>
              <h3 className="text-sm font-black text-[#0b1a30]">WordPress Capabilities</h3>
            </div>

            <div className="space-y-3">
              {WP_SERVICES.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div key={idx} className="flex gap-3 items-start group">
                    <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0b1a30] group-hover:text-amber-600 transition-colors">
                        {s.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-snug font-medium">
                        {s.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Widget 3: Author Micro Profile Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-3">
            {authorAvatar ? (
              <div className="w-12 h-12 rounded-full overflow-hidden relative border border-slate-200 shrink-0">
                <Image src={authorAvatar} alt="Author" fill className="object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-black text-slate-950 text-base shrink-0 shadow-xs">
                RB
              </div>
            )}
            <div>
              <span className="font-extrabold text-[#0b1a30] text-sm block">Rowell Mark Blanca</span>
              <span className="text-[11px] text-slate-500 font-medium block">Senior Full-Stack Engineer</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Senior Full-Stack Engineer & WordPress Architect with 8+ years of experience building high-performance platforms.
          </p>
        </div>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        defaultService={defaultService || 'Custom Project Inquiry'}
      />
    </>
  );
}
