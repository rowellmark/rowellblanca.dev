"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PortfolioCard, PortfolioProject } from '@/components/ui/portfolio-card';

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

    return (
        <>
            {/* Tab nav */}
            <div className="flex space-x-4 justify-center flex-wrap gap-y-3 max-sm:flex-col max-sm:items-center">
                {nav.map((tab, index) => (
                    <button
                        key={index}
                        className={`relative px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none ${
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

            {/* Content */}
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="h-2 w-2 rounded-full bg-[#F8C15F]"
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
                <div className="py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: i * 0.06 }}
                        >
                            <PortfolioCard project={project} />
                        </motion.div>
                    ))}
                </div>
            )}
        </>
    );
}