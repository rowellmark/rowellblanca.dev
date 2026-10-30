"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PortfolioCard, PortfolioProject } from '@/components/ui/portfolio-card';
import { PluginCard } from '@/components/plugins/plugin-card';
import { STANDALONE_PLUGINS, pluginFromProject } from '@/lib/plugins';
import { Globe, Package, Sparkles, Code2, Search, X, Filter } from 'lucide-react';

interface TabProps {
    nav: string[];
}

const isPlugin = (p: PortfolioProject) =>
    p.url?.startsWith('wp-content') ||
    p.permalink?.includes('plugin') ||
    p.technologies?.some((t) => t.toLowerCase().includes('plugin'));

// Compute category matches
const matchesCategory = (p: any, tab: string) => {
    if (tab === 'All') return true;
    const lowerTab = tab.toLowerCase();

    if (lowerTab === 'wordpress plugins') {
        return isPlugin(p);
    }

    const catMatch = Array.isArray(p.categories)
        ? p.categories.some((c: string) => c.toLowerCase().includes(lowerTab))
        : p.category && p.category.toLowerCase().includes(lowerTab);

    const techMatch = p.technologies?.some((tech: string) =>
        tech.toLowerCase().includes(lowerTab) ||
        (lowerTab.includes('react') && tech.toLowerCase().includes('react')) ||
        (lowerTab.includes('next') && tech.toLowerCase().includes('next')) ||
        (lowerTab.includes('prisma') && tech.toLowerCase().includes('prisma')) ||
        (lowerTab.includes('neondb') && (tech.toLowerCase().includes('neon') || tech.toLowerCase().includes('postgres')))
    );

    return catMatch || techMatch;
};

export function Tab({ nav }: TabProps) {
    const [activeTab, setActiveTab] = useState(nav[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [allProjects, setAllProjects] = useState<PortfolioProject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/projects');
                const data = await res.json();
                if (data.success && Array.isArray(data.projects)) {
                    setAllProjects(data.projects.filter((p: any) => p.active !== false));
                }
            } catch (error) {
                console.error("Error fetching projects from API:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Calculate count per tab
    const tabCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        nav.forEach((tab) => {
            counts[tab] = allProjects.filter((p) => matchesCategory(p, tab)).length;
        });
        return counts;
    }, [allProjects, nav]);

    // Filter projects by tab AND search query
    const filteredProjects = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();

        return allProjects.filter((project) => {
            // Category match
            const inCat = matchesCategory(project, activeTab);
            if (!inCat) return false;

            // Search query match
            if (!q) return true;

            const nameMatch = project.sitename?.toLowerCase().includes(q);
            const descMatch = project.description?.toLowerCase().includes(q);
            const clientMatch = project.client?.toLowerCase().includes(q);
            const techMatch = project.technologies?.some((t) => t.toLowerCase().includes(q));

            return nameMatch || descMatch || clientMatch || techMatch;
        });
    }, [allProjects, activeTab, searchQuery]);

    const webProjects = filteredProjects.filter((p) => !isPlugin(p));
    const pluginProjects = filteredProjects.filter((p) => isPlugin(p));
    // The standalone SEO plugin has no project row; show it whenever plugins are in scope and no search is narrowing.
    const showStandalone = !searchQuery.trim() && ['All', 'Wordpress', 'Wordpress Plugins'].includes(activeTab);
    const pluginCards = [...(showStandalone ? STANDALONE_PLUGINS : []), ...pluginProjects.map(pluginFromProject)];

    return (
        <div className="space-y-8">
            {/* Interactive Search & Filter Toolbar HUD */}
            <div className="bg-white rounded-[28px] p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
                
                {/* Search Bar Input */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter 50+ projects by name, tech stack (e.g. Next.js, Stripe, PostgreSQL)..."
                            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-md"
                                title="Clear search"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Result Counter Badge */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                        <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                            Showing <span className="text-slate-900 font-extrabold">{filteredProjects.length}</span> of {allProjects.length}
                        </span>

                        {(searchQuery || activeTab !== 'All') && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setActiveTab('All');
                                }}
                                className="text-xs font-bold text-amber-700 hover:text-amber-900 px-2 py-1 underline cursor-pointer"
                            >
                                Reset Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {nav.map((tab) => {
                        const isSelected = activeTab === tab;
                        const count = tabCounts[tab] ?? 0;

                        return (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#0b1a30] text-white border-slate-900 shadow-xs font-extrabold'
                                : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            <span>{tab}</span>
                            <span
                              className={`text-[11px] font-mono px-1.5 py-0.2 rounded-md ${
                                isSelected ? 'bg-amber-500 text-slate-950 font-extrabold' : 'bg-slate-200/80 text-slate-600'
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                    })}
                </div>

            </div>

            {/* Loading Indicator */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="h-2.5 w-2.5 rounded-full bg-amber-400"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                            />
                        ))}
                    </div>
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="p-16 rounded-[28px] bg-white border border-slate-200 text-center space-y-3">
                    <p className="text-base font-bold text-slate-800">
                        No projects matched your filter <span className="font-mono text-amber-600">"{searchQuery || activeTab}"</span>
                    </p>
                    <p className="text-xs text-slate-500">
                        Try clearing your search keyword or switching to another category.
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setActiveTab('All');
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-amber-500 hover:text-slate-950 transition-colors"
                    >
                        View All Projects
                    </button>
                </div>
            ) : (
                <div className="space-y-14">
                    {/* SECTION 1: WEB APPLICATIONS & CLIENT PLATFORMS */}
                    {webProjects.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-amber-500 shrink-0" />
                                    <h3 className="text-lg sm:text-xl font-extrabold text-brand-navy tracking-tight">
                                        Web Applications & Platforms ({webProjects.length})
                                    </h3>
                                </div>
                                <span className="text-[11px] font-mono text-slate-500">
                                    Full-Stack & React
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {webProjects.map((project, i) => (
                                    <motion.div
                                        key={project.permalink || i}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
                                    >
                                        <PortfolioCard project={project} index={i} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION 2: WORDPRESS PLUGINS (same cards as the homepage and /plugins) */}
                    {pluginCards.length > 0 && (
                        <section aria-labelledby="mywork-plugins" className="flex flex-col gap-8 pt-6">
                            <div className="flex flex-wrap items-end justify-between gap-6">
                                <div className="flex flex-col gap-3">
                                    <p className="m-0 font-mono text-[13px] tracking-[0.08em] uppercase text-brand-slate">WordPress plugins</p>
                                    <h3 id="mywork-plugins" className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(32px,4vw,56px)]">
                                        Plugins I build & maintain.
                                    </h3>
                                </div>
                                <Link href="/plugins" className="motion-underline font-semibold text-brand-navy inline-flex items-center min-h-[44px]">
                                    All plugins →
                                </Link>
                            </div>
                            <ul className="m-0 p-0 list-none grid grid-cols-1 lg:grid-cols-2 gap-5">
                                {pluginCards.slice(0, 4).map((plugin) => (
                                    <li key={plugin.key}>
                                        <PluginCard plugin={plugin} compact />
                                    </li>
                                ))}
                            </ul>
                            {pluginCards.length > 4 && (
                                <Link
                                    href="/plugins"
                                    className="motion-btn self-center inline-flex items-center gap-3 min-h-[56px] px-7 rounded-full bg-brand-ink text-white font-semibold hover:bg-brand-ink-2"
                                >
                                    See all {pluginCards.length} plugins <span aria-hidden="true">→</span>
                                </Link>
                            )}
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}