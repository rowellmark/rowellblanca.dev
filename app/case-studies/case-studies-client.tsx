'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Globe,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Layers,
  Search,
  Code2,
  Layout,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ContactModal } from '@/components/ui/contact-modal';
import { SharedSidebar } from '@/components/ui/shared-sidebar';

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
    <div className="min-h-screen bg-[#FAFAF7] text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden">
      {/* Hero Header */}
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-indigo-950 via-slate-900 to-[#0b1a30] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#4338ca_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 relative z-10 text-center space-y-6">
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-extrabold tracking-wider uppercase"
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Case Studies & Specialized Solutions</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto"
          >
            Production Case Studies & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200">Engineering Solutions</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Explore targeted landing pages, production client architectures, and specialized engineering solutions for web and enterprise platforms.
          </motion.p>

          {/* Search Bar & Filter Buttons */}
          <div className="pt-4 max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search solutions by keyword, tech stack, or industry (e.g. React, WordPress, FinTech)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all shadow-inner"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { id: 'all', label: 'All Solutions' },
                { id: 'landing', label: `Landing Pages (${landingPages.length})` },
                { id: 'projects', label: `Production Projects (${nonPluginProjects.length})` },
                { id: 'plugins', label: `WP Plugins (${pluginProjects.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-400/40'
                      : 'bg-white/10 text-slate-300 border-white/20 hover:bg-white/20'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main 2-Column Section (8 Cols Solutions + 4 Cols Shared Sidebar) */}
      <section className="py-16 max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* MAIN SOLUTIONS COLUMN (8 Cols) */}
          <div className="lg:col-span-8 space-y-16">
            {/* SECTION 1: TARGETED LANDING PAGES */}
            {(activeTab === 'all' || activeTab === 'landing') && filteredLandingPages.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                      Targeted Service Pages
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#0b1a30]">
                      Specialized Landing Pages ({filteredLandingPages.length})
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
                      className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
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

                        <h3 className="text-lg font-black text-[#0b1a30] group-hover:text-amber-600 transition-colors leading-snug line-clamp-2">
                          <Link href={`/landing/${lp.slug}`}>{lp.heroTitle}</Link>
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                          {lp.heroSubtitle}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400 font-bold">
                          /landing/{lp.slug}
                        </span>
                        <Link
                          href={`/landing/${lp.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-black text-[#0b1a30] group-hover:text-[#1d63ed] transition-colors"
                        >
                          <span>Explore Page</span>
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
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                      Client Case Studies
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#0b1a30]">
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
                      className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-black text-[#0b1a30] group-hover:text-amber-600 transition-colors leading-snug">
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

                        <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                          {proj.description}
                        </p>

                        {/* Tech Tags */}
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {proj.technologies.map((tech: string, tIdx: number) => (
                              <span
                                key={tIdx}
                                className="text-[10px] font-mono text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md"
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
                          className="inline-flex items-center gap-1 text-xs font-black text-[#0b1a30] group-hover:text-[#1d63ed] transition-colors"
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
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                      Custom WordPress Plugins
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#0b1a30]">
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
                      className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            <Code2 className="w-3 h-3" /> WP Plugin
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-[#0b1a30] group-hover:text-amber-600 transition-colors leading-snug">
                          <Link href={`/mywork/${proj.permalink}`}>{proj.sitename}</Link>
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-4">
                          {proj.description.split('\n\n')[0]}
                        </p>

                        {/* Tech Tags */}
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {proj.technologies.map((tech: string, tIdx: number) => (
                              <span
                                key={tIdx}
                                className="text-[10px] font-mono text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md"
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
                          className="inline-flex items-center gap-1 text-xs font-black text-[#0b1a30] group-hover:text-[#1d63ed] transition-colors"
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

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
