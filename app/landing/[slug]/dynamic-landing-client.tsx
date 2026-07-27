'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Clock,
  Coins,
  Code2,
  ShieldCheck,
  Star,
  Quote,
  Layers,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import PortfolioCard from '@/components/ui/portfolio-card';
import { ContactModal } from '@/components/ui/contact-modal';

interface DynamicLandingPageClientProps {
  page: {
    id: number;
    slug: string;
    badgeText?: string;
    heroTitle: string;
    heroSubtitle: string;
    heroCtaText?: string;
    targetKeyword?: string;
    projectIds: number[];
    testimonialIds: number[];
    active: boolean;
  };
}

export function DynamicLandingPageClient({ page }: DynamicLandingPageClientProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    fetchPageData();
  }, [page]);

  const fetchPageData = async () => {
    try {
      const [pRes, tRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/testimonials'),
      ]);

      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData.success && Array.isArray(pData.projects)) {
          if (page.projectIds && page.projectIds.length > 0) {
            setProjects(pData.projects.filter((p: any) => page.projectIds.includes(p.id)));
          } else {
            setProjects(pData.projects.slice(0, 4));
          }
        }
      }

      if (tRes.ok) {
        const tData = await tRes.json();
        if (tData.success && Array.isArray(tData.testimonials)) {
          if (page.testimonialIds && page.testimonialIds.length > 0) {
            setTestimonials(tData.testimonials.filter((t: any) => page.testimonialIds.includes(t.id)));
          } else {
            setTestimonials(tData.testimonials.slice(0, 3));
          }
        }
      }
    } catch (e) {
      console.error('Error loading page components:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#071224] text-slate-100 font-sans selection:bg-brand-amber selection:text-slate-950 overflow-x-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-brand-amber to-amber-600 text-slate-950 px-4 py-2 text-center text-xs font-black tracking-wide shadow-md flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4 shrink-0" />
        <span>Senior Full-Stack & Bespoke Software Engineer</span>
        <span className="hidden sm:inline">• Available for New Project Engineering</span>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#071224] to-[#040a14]">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {page.badgeText && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-brand-amber text-xs font-extrabold tracking-wider uppercase"
            >
              <span>{page.badgeText}</span>
            </motion.div>
          )}

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white max-w-4xl mx-auto"
          >
            {page.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto"
          >
            {page.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-amber to-amber-600 hover:from-amber-600 hover:to-brand-amber text-slate-950 font-extrabold text-base shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{page.heroCtaText || 'Book Discovery Call'}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              href="#selected-projects"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base transition-all flex items-center justify-center gap-2"
            >
              <span>View Case Studies & Proof</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-semibold"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Direct Senior Engineer
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Competitive Rates & Top Quality
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Fast Execution & Scalable Architecture
            </span>
          </motion.div>
        </div>
      </section>

      {/* Selected Projects Grid */}
      <section id="selected-projects" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-black uppercase tracking-wider text-brand-amber bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Featured Case Studies
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Selected Live Engineering Projects
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Explore live production web apps, portals, and custom engines built with senior software architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Client Reviews Section */}
      {testimonials.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-t border-b border-slate-800/80">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Verified Client Reviews
              </span>
              <h2 className="text-3xl font-black text-white">Client Feedback & Results</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl relative"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-white text-sm block">{t.name}</span>
                      <span className="text-xs text-slate-400 block">
                        {t.role} {t.company && `• ${t.company}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Banner */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-8">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Ready to Build Your Platform with Senior Architecture?
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
            Get direct senior engineering support with transparent communication and rapid deployment.
          </p>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-brand-amber to-amber-600 hover:from-amber-600 hover:to-brand-amber text-slate-950 font-black text-base shadow-xl hover:shadow-amber-500/25 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>{page.heroCtaText || 'Start Your Project Call'}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        defaultService={page.heroTitle}
      />
    </div>
  );
}
