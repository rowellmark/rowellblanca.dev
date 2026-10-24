'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Search,
  Code2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ContactModal } from '@/components/ui/contact-modal';
import { SharedSidebar } from '@/components/ui/shared-sidebar';
import { ProjectEstimator } from '@/components/homepage/project-estimator';
import { EngagementModels } from '@/components/homepage/engagement-models';
import { SpeedRacerGame } from '@/components/interactive/speed-racer-game';
import { PageHero, heroSearchClass, heroChipClass } from '@/components/ui/page-hero';

interface LandingPageItem {
  id: number;
  slug: string;
  badgeText?: string;
  heroTitle: string;
  heroSubtitle: string;
  targetKeyword?: string;
  active?: boolean;
}

interface ProjectItem {
  id: number;
  sitename: string;
  permalink: string;
  url?: string;
  image?: string;
  description: string;
  technologies: string[];
  featured?: boolean;
}

export function CaseStudiesClient() {
  const [landingPages, setLandingPages] = useState<LandingPageItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'landing' | 'projects' | 'plugins'>('all');
  const [search, setSearch] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [lpRes, projRes] = await Promise.all([
          fetch('/api/landing-pages'),
          fetch('/api/projects'),
        ]);

        if (lpRes.ok) {
          const lpData = await lpRes.json();
          if (lpData.success && Array.isArray(lpData.landingPages)) {
            setLandingPages(lpData.landingPages.filter((p: any) => p.active !== false));
          }
        }

        if (projRes.ok) {
          const projData = await projRes.json();
          if (projData.success && Array.isArray(projData.projects)) {
            setProjects(projData.projects.filter((p: any) => p.active !== false));
          }
        }
      } catch (e) {
        console.warn('Failed to load case studies datasets');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredLandingPages = landingPages.filter(
    (lp) =>
      lp.heroTitle.toLowerCase().includes(search.toLowerCase()) ||
      lp.heroSubtitle.toLowerCase().includes(search.toLowerCase()) ||
      lp.targetKeyword?.toLowerCase().includes(search.toLowerCase()) ||
      lp.slug.toLowerCase().includes(search.toLowerCase())
  );

  const wpPluginSlugs = [
    'blanc-leads-plugin',
    'blanc-schema-ld-generator',
    'blanc-chatbot-plugin',
    'buildforuser-login-customizer-plugin',
  ];

  const pluginProjects = projects.filter((p) => wpPluginSlugs.includes(p.permalink));
  const nonPluginProjects = projects.filter((p) => !wpPluginSlugs.includes(p.permalink));

  const filteredPlugins = pluginProjects.filter(
    (p) =>
      p.sitename.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredProjects = nonPluginProjects.filter(
    (p) =>
      p.sitename.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-brand-bg text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden">
      {/* Hero Header */}
      <PageHero
        label="Production case studies & engineering solutions"
        titleLines={['Case studies', '& engineering solutions.']}
        accentLine={1}
        lead="Explore targeted landing pages, production client architectures, and specialized engineering solutions for web and enterprise platforms."
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-[560px]">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              type="text"
              aria-label="Search solutions"
              placeholder="Search by keyword, stack or industry (React, WordPress, FinTech)…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={heroSearchClass}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All solutions' },
              { id: 'landing', label: `Landing pages (${landingPages.length})` },
              { id: 'projects', label: `Projects (${nonPluginProjects.length})` },
              { id: 'plugins', label: `WP plugins (${pluginProjects.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={heroChipClass(activeTab === tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </PageHero>

      {/* Main 2-Column Section (8 Cols Solutions + 4 Cols Shared Sidebar) */}
      <section className="py-16 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* MAIN SOLUTIONS COLUMN (8 Cols) */}
          <div className="lg:col-span-8 space-y-16">
            {/* FEATURED CASE STUDY SPOTLIGHT CARD */}
            {!search && (activeTab === 'all' || activeTab === 'projects') && (
              <div className="p-6 sm:p-8 rounded-[28px] bg-brand-ink text-white border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">

                <div className="flex items-center justify-between gap-2 flex-wrap relative z-10">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Featured Architecture Spotlight
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    98/100 Core Web Vitals
                  </span>
                </div>

                <div className="space-y-3 relative z-10">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    MacManus Asset Finance Portal — Enterprise FinTech Platform
                  </h2>
                  <p className="text-[15px] text-slate-300 leading-relaxed">
                    End-to-end asset finance platform engineered for a regulated UK lender — featuring a custom CRM lead pipeline, multi-funder product directory, document hub, and support ticketing unified in a sub-second Next.js and NeonDB architecture.
                  </p>
                </div>

                {/* Architecture Highlights Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80 text-xs font-bold relative z-10">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-0.5">
                    <span className="text-[11px] uppercase text-slate-400 block font-semibold">Tech Stack</span>
                    <span className="text-white text-xs">Next.js 14 · NeonDB · Prisma</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-0.5">
                    <span className="text-[11px] uppercase text-slate-400 block font-semibold">Performance</span>
                    <span className="text-amber-400 text-xs">Sub-Second SSR & RSC</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-0.5 col-span-2 sm:col-span-1">
                    <span className="text-[11px] uppercase text-slate-400 block font-semibold">Security</span>
                    <span className="text-emerald-400 text-xs">FCA Compliance Hardened</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between flex-wrap gap-4 relative z-10">
                  <Link
                    href="/mywork/macmanus-portal"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl motion-btn motion-magnetic bg-amber-500 hover:bg-amber-400 text-brand-ink font-bold text-sm"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="https://macmanusfd.finance"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 min-h-[40px] text-xs font-extrabold text-slate-300 hover:text-white transition-colors"
                  >
                    <span>Visit Live Platform</span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  </a>
                </div>
              </div>
            )}

            {/* SECTION 1: TARGETED LANDING PAGES */}
            {(activeTab === 'all' || activeTab === 'landing') && filteredLandingPages.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[13px] font-normal uppercase tracking-[0.08em] text-brand-slate">
                      Targeted Service Pages
                    </span>
                    <h2 className="text-[clamp(32px,4vw,56px)] font-extrabold tracking-[-0.04em] leading-[1] text-brand-navy">
                      Specialized Solutions ({filteredLandingPages.length})
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredLandingPages.map((lp, idx) => (
                    <motion.div
                      key={lp.id || idx}
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="bg-white border border-slate-200 rounded-[28px] p-6 flex flex-col justify-between space-y-6 motion-lift group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                          {lp.badgeText && (
                            <span className="font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-lg">
                              {lp.badgeText}
                            </span>
                          )}
                          {lp.targetKeyword && (
                            <span className="font-mono text-slate-500 text-[11px] bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                              🎯 {lp.targetKeyword}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-extrabold text-brand-navy group-hover:text-amber-600 transition-colors leading-snug line-clamp-2">
                          <Link href={`/landing/${lp.slug}`}>{lp.heroTitle}</Link>
                        </h3>

                        <p className="text-sm text-brand-slate leading-relaxed line-clamp-3">
                          {lp.heroSubtitle}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400 font-bold">
                          /landing/{lp.slug}
                        </span>
                        <Link
                          href={`/landing/${lp.slug}`}
                          className="inline-flex items-center gap-1 min-h-[40px] text-xs font-extrabold text-brand-navy group-hover:text-amber-700 transition-colors"
                        >
                          <span>Explore Solution</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 2: PRODUCTION CASE STUDY PROJECTS */}
            {(activeTab === 'all' || activeTab === 'projects') && filteredProjects.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[13px] font-normal uppercase tracking-[0.08em] text-brand-slate">
                      Client Case Studies
                    </span>
                    <h2 className="text-[clamp(32px,4vw,56px)] font-extrabold tracking-[-0.04em] leading-[1] text-brand-navy">
                      Production Project Architectures ({filteredProjects.length})
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredProjects.map((proj, idx) => (
                    <motion.div
                      key={proj.id || idx}
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="bg-white border border-slate-200 rounded-[28px] p-6 flex flex-col justify-between space-y-6 motion-lift group"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-extrabold text-brand-navy group-hover:text-amber-600 transition-colors leading-snug">
                            <Link href={`/mywork/${proj.permalink}`}>{proj.sitename}</Link>
                          </h3>
                          {proj.url && (
                            <a
                              href={`https://${proj.url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-amber-500 transition-colors"
                              title="Visit live site"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>

                        <p className="text-sm text-brand-slate leading-relaxed line-clamp-3">
                          {proj.description}
                        </p>

                        {/* Tech Tags */}
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {proj.technologies.map((tech: string, tIdx: number) => (
                              <span
                                key={tIdx}
                                className="text-xs font-mono text-brand-slate border border-brand-border px-2.5 py-1 rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400 font-bold">
                          /mywork/{proj.permalink}
                        </span>
                        <Link
                          href={`/mywork/${proj.permalink}`}
                          className="inline-flex items-center gap-1 min-h-[40px] text-xs font-extrabold text-brand-navy group-hover:text-amber-700 transition-colors"
                        >
                          <span>View Architecture</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 3: WORDPRESS PLUGIN CASE STUDIES */}
            {(activeTab === 'all' || activeTab === 'plugins') && filteredPlugins.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[13px] font-normal uppercase tracking-[0.08em] text-brand-slate">
                      Custom WordPress Plugins
                    </span>
                    <h2 className="text-[clamp(32px,4vw,56px)] font-extrabold tracking-[-0.04em] leading-[1] text-brand-navy">
                      Bespoke WP Plugin Suite ({filteredPlugins.length})
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Hand-coded WordPress plugins built and maintained in production.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredPlugins.map((proj, idx) => (
                    <motion.div
                      key={proj.id || idx}
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="bg-white border border-slate-200 rounded-[28px] p-6 flex flex-col justify-between space-y-6 motion-lift group"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            <Code2 className="w-3 h-3" /> WP Plugin
                          </span>
                        </div>
                        <h3 className="text-lg font-extrabold text-brand-navy group-hover:text-amber-600 transition-colors leading-snug">
                          <Link href={`/mywork/${proj.permalink}`}>{proj.sitename}</Link>
                        </h3>

                        <p className="text-sm text-brand-slate leading-relaxed line-clamp-4">
                          {proj.description.split('\n\n')[0]}
                        </p>

                        {/* Tech Tags */}
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {proj.technologies.map((tech: string, tIdx: number) => (
                              <span
                                key={tIdx}
                                className="text-xs font-mono text-brand-slate border border-brand-border px-2.5 py-1 rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400 font-bold">
                          /mywork/{proj.permalink}
                        </span>
                        <Link
                          href={`/mywork/${proj.permalink}`}
                          className="inline-flex items-center gap-1 min-h-[40px] text-xs font-extrabold text-brand-navy group-hover:text-amber-700 transition-colors"
                        >
                          <span>View Plugin Docs</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STICKY RIGHT SIDEBAR (4 Cols) */}
          <div className="lg:col-span-4">
            <SharedSidebar defaultService="Case Studies Inquiry — Custom Project" serviceType="both" />
          </div>
        </div>
      </section>

      {/* Interactive Scope & Architecture Estimator */}
      <div id="project-estimator" className="border-t border-brand-border pt-24 lg:pt-32">
        <ProjectEstimator />
      </div>

      {/* Transparent Engagement Models */}
      <EngagementModels />

      {/* Interactive Speed Racer Game */}
      <SpeedRacerGame />

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
