"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PortfolioCard, PortfolioProject } from '@/components/ui/portfolio-card';
import { Globe, Package, Sparkles, Code2 } from 'lucide-react';

interface TabProps {
    nav: string[];
}

export function Tab({ nav }: TabProps) {
    const [activeTab, setActiveTab] = useState(nav[0]);
    const [allProjects, setAllProjects] = useState<PortfolioProject[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<PortfolioProject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/projects');
                const data = await res.json();
                if (data.success && Array.isArray(data.projects)) {
                    setAllProjects(data.projects);
                }
            } catch (error) {
                console.error("Error fetching projects from API:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        if (activeTab === 'All') {
            setFilteredProjects(allProjects);
        } else {
            const lowerTab = activeTab.toLowerCase();
            const filtered = allProjects.filter((p: any) => {
                const catMatch = Array.isArray(p.categories)
                    ? p.categories.some((c: string) => c.toLowerCase() === lowerTab || c.toLowerCase().includes(lowerTab))
                    : p.category && p.category.toLowerCase() === lowerTab;
                const techMatch = p.technologies?.some((tech: string) => tech.toLowerCase().includes(lowerTab));
                return catMatch || techMatch;
            });
            setFilteredProjects(filtered);
        }
    }, [activeTab, allProjects]);

    const isPlugin = (p: PortfolioProject) =>
        p.url?.startsWith('wp-content') ||
        p.permalink?.includes('plugin') ||
        p.technologies?.some((t) => t.toLowerCase() === 'wordpress plugins');


    const webProjects = filteredProjects.filter((p) => !isPlugin(p));
    const pluginProjects = filteredProjects.filter((p) => isPlugin(p));

    return (
        <>
            {/* Tab nav */}
            <div className="flex space-x-4 justify-center flex-wrap gap-y-3 max-sm:flex-col max-sm:items-center mb-8">
                {nav.map((tab, index) => (
                    <button
                        key={index}
                        className={`relative px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none ${
                            activeTab === tab
                                ? 'text-brand-navy font-extrabold'
                                : 'text-slate-500 hover:text-brand-navy'
                        }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div
                                layoutId="tab-underline"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-amber rounded-full"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Loading Indicator */}
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="flex gap-1.5">
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
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <p className="text-sm font-medium">No projects found in this category.</p>
                </div>
            ) : (
                <div className="space-y-16 py-6">
                    {/* SECTION 1: WEB APPLICATIONS & PLATFORMS */}
                    {webProjects.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                                <Globe className="w-5 h-5 text-amber-500 shrink-0" />
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-black text-[#0b1a30] tracking-tight">
                                        Web Applications & Client Platforms
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium">
                                        Full-stack web applications, Next.js SaaS portals, and custom responsive digital builds.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {webProjects.map((project, i) => (
                                    <motion.div
                                        key={project.permalink || i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35, delay: i * 0.05 }}
                                    >
                                        <PortfolioCard project={project} index={i} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION 2: SEPARATED WORDPRESS PLUGINS BLOCK */}
                    {pluginProjects.length > 0 && (
                        <div className="bg-gradient-to-b from-[#0b1426] via-[#09101f] to-[#050914] rounded-3xl p-6 sm:p-10 border border-indigo-900/60 shadow-2xl space-y-6 text-white relative overflow-hidden">
                            {/* Background Mesh Glow */}
                            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

                            {/* Section Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 relative z-10">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                                            <Code2 className="w-3 h-3 text-cyan-400" />
                                            Developer Extensions
                                        </span>
                                        <Sparkles className="w-4 h-4 text-amber-400" />
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-1">
                                        WordPress Plugins & Custom Extensions
                                    </h3>
                                    <p className="text-xs text-slate-300 font-medium max-w-2xl leading-relaxed">
                                        Bespoke PHP plugins built for WordPress — featuring multi-AI lead nurturing CRMs, visual JSON-LD schema generators, and custom Gutenberg block engines.
                                    </p>
                                </div>

                                <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-2xl shrink-0">
                                    <Package className="w-4 h-4 text-indigo-400" />
                                    <span>PHP 8+ &bull; WP REST API</span>
                                </div>
                            </div>

                            {/* Plugin Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                {pluginProjects.map((project, i) => (
                                    <motion.div
                                        key={project.permalink || i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35, delay: i * 0.08 }}
                                    >
                                        <PortfolioCard project={project} index={i} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}