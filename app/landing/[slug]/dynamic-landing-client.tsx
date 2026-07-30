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
  ShieldCheck,
  Star,
  Quote,
  Layout,
  Cpu,
  ShoppingBag,
  Zap,
  Code2,
  Layers,
  Building2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PortfolioCard } from '@/components/ui/portfolio-card';
import { ContactModal } from '@/components/ui/contact-modal';
import { generateTestimonialsJsonLd } from '@/lib/seo';

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
    serviceSectionType?: string; // 'wordpress' | 'react' | 'both'
    ctaTitle?: string;
    ctaSubtitle?: string;
    active: boolean;
  };
}

const WP_SERVICES = [
  {
    icon: Layout,
    title: 'Bespoke WordPress Theme & Plugin Dev',
    description:
      'Hand-coded custom WordPress themes and custom plugins built to your exact design specifications without reliance on bloated third-party plugins.',
    features: ['Bespoke PHP Themes', 'ACF Pro & Gutenberg Blocks', 'Custom Plugin Development', 'Clean Code Standards'],
  },
  {
    icon: Cpu,
    title: 'Headless WordPress + Next.js',
    description:
      'Combine the intuitive WordPress content management experience with the lightning speed and security of a modern Next.js React frontend.',
    features: ['GraphQL & REST API', 'Instant Page Loads', 'Enhanced Security', 'Modern React Components'],
  },
  {
    icon: ShoppingBag,
    title: 'WooCommerce & E-Commerce Engineering',
    description:
      'Custom WooCommerce store builds, bespoke payment gateway integrations, custom checkout flows, and high-volume product database optimization.',
    features: ['Custom Checkout Flows', 'Stripe & UK Gateways', 'Speed Tuning', 'Inventory Sync'],
  },
  {
    icon: Zap,
    title: 'Page Speed, Core Web Vitals & UK SEO',
    description:
      'Drastic reduction of page load times, image optimization, database cleanup, script deferral, and 95+ Google Lighthouse scores for UK rankings.',
    features: ['Lighthouse 95+ Scores', 'Database Optimization', 'Schema.org Markup', 'Security Hardening'],
  },
];

const REACT_SERVICES = [
  {
    icon: Code2,
    title: 'Next.js 14 App Router & React 19',
    description:
      'Enterprise React web application development utilizing Server Components, Streaming SSR, and Next.js App Router for sub-second performance.',
    features: ['Server Components (RSC)', 'TypeScript & Strict Types', 'Tailwind CSS & Animations', 'SEO & OpenGraph Meta'],
  },
  {
    icon: Layers,
    title: 'Full-Stack Dashboards & Client Portals',
    description:
      'Custom SaaS dashboards, lead pipelines, admin control panels, and financial CRM applications with NeonDB PostgreSQL and Prisma ORM.',
    features: ['Prisma & NeonDB', 'Role-Based Auth (RBAC)', 'REST & GraphQL APIs', 'Real-Time Updates'],
  },
  {
    icon: Sparkles,
    title: 'Multi-Provider AI & LLM Integrations',
    description:
      'Integrating OpenAI, Gemini 2.5, Claude 3.5, and local Ollama LLMs for RAG knowledge search, lead scoring, and automated workflow agents.',
    features: ['Vector RAG Knowledge', 'Gemini & OpenAI API', 'Human-in-the-Loop AI', 'Custom AI Widgets'],
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise Architecture & Refactoring',
    description:
      'Refactoring legacy codebases into modular TypeScript components, improving test coverage, and optimizing client-side memory usage.',
    features: ['Clean Code Standards', 'Performance Audit', 'API Route Optimization', 'GMT/BST Overlap'],
  },
];

export function DynamicLandingPageClient({ page }: DynamicLandingPageClientProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  const serviceType = page.serviceSectionType || (page.slug.includes('wordpress') ? 'wordpress' : 'react');
  const pitchTitle = page.ctaTitle || (serviceType === 'wordpress' ? 'Need a Custom WordPress Architect for Your UK Business?' : 'Need a Senior React & Next.js Engineer for Your UK Business?');
  const pitchSubtitle = page.ctaSubtitle || "Let's discuss your web project requirement. Enjoy seamless GMT/BST communication, clean code standards, and enterprise-grade delivery.";

  const fetchPageData = React.useCallback(async () => {
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
  }, [page]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  return (
    <div className="min-h-screen bg-[#071224] text-slate-100 font-sans selection:bg-brand-amber selection:text-slate-950 overflow-x-hidden">
      {/* Top Notification Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-brand-amber to-amber-600 text-slate-950 px-4 py-2 text-center text-xs font-black tracking-wide shadow-md flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4 shrink-0" />
        <span>Senior Full-Stack & Bespoke Software Engineer</span>
        <span className="hidden sm:inline">• GMT/BST UK Timezone Overlap</span>
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

      {/* DYNAMIC SERVICES SECTION (WordPress vs React vs Both) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-t border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-16">
          {(serviceType === 'wordpress' || serviceType === 'both') && (
            <div className="space-y-12">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
                  WordPress Services
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Bespoke WordPress Engineering
                </h2>
                <p className="text-slate-300 text-sm font-medium">
                  Custom theme development, headless CMS integrations, WooCommerce, and Lighthouse 95+ speed tuning.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {WP_SERVICES.map((service, idx) => {
                  const Icon = service.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-xl"
                    >
                      <div className="space-y-3">
                        <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white">{service.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                          {service.description}
                        </p>
                      </div>

                      <ul className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800">
                        {service.features.map((feat, fIdx) => (
                          <li key={fIdx} className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(serviceType === 'react' || serviceType === 'both') && (
            <div className="space-y-12">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">
                  React & Next.js Services
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Full-Stack React & Next.js Engineering
                </h2>
                <p className="text-slate-300 text-sm font-medium">
                  Next.js 14 App Router, TypeScript, Prisma/NeonDB data models, and multi-provider AI workflow engines.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {REACT_SERVICES.map((service, idx) => {
                  const Icon = service.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-indigo-500/40 transition-all flex flex-col justify-between shadow-xl"
                    >
                      <div className="space-y-3">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white">{service.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                          {service.description}
                        </p>
                      </div>

                      <ul className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800">
                        {service.features.map((feat, fIdx) => (
                          <li key={fIdx} className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Client Reviews Section */}
      {testimonials.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateTestimonialsJsonLd(testimonials)),
            }}
          />
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
                className={`rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl relative transition-all ${
                  t.featured
                    ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/30 border-2 border-amber-400/70 shadow-amber-500/10 ring-1 ring-amber-400/30'
                    : 'bg-slate-900 border border-slate-800'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {t.featured && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3 fill-slate-950" /> Featured
                      </span>
                    )}
                  </div>

                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed italic">
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
        </section>
      )}

      {/* FINAL CUSTOM CTA PITCH BANNER SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6 shadow-2xl relative overflow-hidden">
          <Sparkles className="h-10 w-10 text-amber-400 mx-auto animate-pulse" />
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {pitchTitle}
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed font-medium">
            {pitchSubtitle}
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
