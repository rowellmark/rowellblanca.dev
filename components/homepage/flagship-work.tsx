'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Zap, ShieldCheck, Layers, ExternalLink } from 'lucide-react';
import { resolveValidImageSrc } from '@/lib/image-utils';
import { FALLBACK_PROJECTS, FallbackProject } from '@/lib/fallback-projects';
import { PortfolioProject } from '@/components/ui/portfolio-card';

interface FlagshipDisplayItem {
  id: string;
  title: string;
  client: string;
  region: string;
  category: string;
  description: string;
  metricBadge: string;
  techStack: string[];
  image: string;
  permalink: string;
}

function mapProjectToFlagship(p: PortfolioProject | FallbackProject): FlagshipDisplayItem {
  const isUK =
    p.technologies?.some((t: string) => t.toLowerCase().includes('uk') || t.toLowerCase().includes('fca')) ||
    p.sitename?.toLowerCase().includes('macmanus') ||
    p.sitename?.toLowerCase().includes('tower');

  const isUS =
    p.sitename?.toLowerCase().includes('buildforuser') ||
    p.sitename?.toLowerCase().includes('hohnen');

  const region = isUK ? 'UK 🇬🇧' : isUS ? 'US 🇺🇸' : 'Global 🌐';

  // Extract or formulate high-impact metrics
  let metricBadge = 'Production Shipped & Tested';
  if (p.permalink === 'macmanus-portal') {
    metricBadge = '98/100 Core Web Vitals · 140ms TTFB';
  } else if (p.permalink === 'buildforuser') {
    metricBadge = 'Serverless PostgreSQL · Edge Auth';
  } else if (p.permalink === 'juliette-hohnen') {
    metricBadge = 'High-Converting Real Estate Funnel';
  } else if (p.permalink === 'tower-fire') {
    metricBadge = 'Zero-Bloat Native Gutenberg Blocks';
  } else if (p.permalink === 'blanc-leads-plugin' || p.permalink === 'buildforuser-login-customizer-plugin') {
    metricBadge = 'PSR-4 OOP PHP · Custom Database Tables';
  } else if (p.technologies?.some((t: string) => t.toLowerCase().includes('next'))) {
    metricBadge = 'Next.js App Router · Edge Performance';
  }

  const category =
    p.category ||
    (p.technologies?.some((t: string) => t.toLowerCase().includes('plugin'))
      ? 'WordPress Extension'
      : p.technologies?.some((t: string) => t.toLowerCase().includes('react') || t.toLowerCase().includes('next'))
      ? 'Full-Stack Web Engine'
      : 'Bespoke Engineering Platform');

  const client =
    p.client ||
    (p.sitename.includes('MacManus')
      ? 'MacManus Commercial Broker'
      : p.sitename.includes('BuildForUser')
      ? 'BuildForUser Inc'
      : p.sitename.includes('Juliette Hohnen')
      ? 'Beverly Hills Luxury Agent'
      : p.sitename.includes('Tower Fire')
      ? 'Tower Fire Safety Group'
      : 'Enterprise Client');

  const resolvedImage = resolveValidImageSrc(p.fullDesktopImage || p.image);

  return {
    id: p.permalink || String(p.id),
    title: p.sitename,
    client,
    region,
    category,
    description:
      p.description ||
      'Mission-critical engineering platform designed for sub-second performance, strict type safety, and measurable business growth.',
    metricBadge,
    techStack: p.technologies?.slice(0, 5) || ['React', 'Next.js', 'TypeScript'],
    image: resolvedImage,
    permalink: p.permalink,
  };
}

export function FlagshipWork() {
  // Initialize with the top 5 curated builds from fallback-projects
  const initialFlagships = FALLBACK_PROJECTS.slice(0, 5).map(mapProjectToFlagship);
  const [flagships, setFlagships] = useState<FlagshipDisplayItem[]>(initialFlagships);

  // Dynamically load from /api/projects (the exact same data source as MyWork)
  useEffect(() => {
    async function loadMyWorkData() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.success && Array.isArray(data.projects)) {
          const activeProjects = data.projects.filter((p: any) => p.active !== false);

          // Prioritize spotlight project first, followed by projects marked as featured (flagship)
          const sorted = [...activeProjects].sort((a: any, b: any) => {
            if (a.spotlight && !b.spotlight) return -1;
            if (!a.spotlight && b.spotlight) return 1;
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
          });

          if (sorted.length > 0) {
            setFlagships(sorted.slice(0, 5).map(mapProjectToFlagship));
          }
        }
      } catch (error) {
        console.warn('FlagshipWork using fallback dataset:', error);
      }
    }

    loadMyWorkData();
  }, []);

  const primaryFlagships = flagships.slice(0, 2);
  const secondaryFlagships = flagships.slice(2, 5);

  return (
    <section className="py-24 bg-[#FAFAF7] border-b border-slate-200/80 relative overflow-hidden font-sans">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 inline-flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Curated Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0b1a30] tracking-tight leading-tight">
              Flagship Engineering Builds
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl leading-relaxed">
              Top 5 mission-critical platforms engineered for sub-second performance, strict type safety, and measurable business growth—curated from my live project catalog.
            </p>
          </div>

          <Link
            href="/mywork"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors shrink-0"
          >
            <span>View All 50+ Projects Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ROW 1: TOP 2 PRIMARY FLAGSHIPS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {primaryFlagships.map((project) => (
            <div
              key={project.id}
              className="group rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-400/60 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Visual Header */}
                <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden border-b border-slate-100">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    unoptimized
                    className="object-cover object-top group-hover:scale-103 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 1024px) 100vw, 600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold bg-white/95 backdrop-blur-md text-slate-900 px-3 py-1 rounded-full shadow-md border border-slate-200">
                      {project.region} {project.client}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {project.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full backdrop-blur-md">
                      Production Shipped
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-7 space-y-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#0b1a30] group-hover:text-amber-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mt-2 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Metric Pill */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {project.metricBadge}
                    </span>
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  </div>

                  {/* Tech Stack Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/70"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 sm:p-7 pt-0">
                <Link
                  href={`/mywork/${project.permalink}`}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md cursor-pointer"
                >
                  <span>View Case Study & Tech Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* ROW 2: 3 COMPANION FLAGSHIPS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {secondaryFlagships.map((project) => (
            <div
              key={project.id}
              className="group rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-amber-400/50 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden border-b border-slate-100">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    unoptimized
                    className="object-cover object-top group-hover:scale-103 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono font-bold bg-white/95 backdrop-blur-md text-slate-900 px-2.5 py-0.5 rounded-full border border-slate-200">
                      {project.region}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-[11px] font-mono font-bold text-amber-400 truncate">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-black text-[#0b1a30] group-hover:text-amber-600 transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60 text-[10px] font-mono font-bold text-slate-700 truncate">
                    {project.metricBadge}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href={`/mywork/${project.permalink}`}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#0b1a30] text-slate-900 hover:text-white font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Case Study</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM ACTION: EXPLORE ALL 50+ PROJECTS */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Looking for More Client Builds & Plugins?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl leading-relaxed">
              Explore 50+ production full-stack web applications, custom Gutenberg block suites, and serverless PostgreSQL architectures.
            </p>
          </div>

          <Link
            href="/mywork"
            className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-white text-slate-950 font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>View All 50+ Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
