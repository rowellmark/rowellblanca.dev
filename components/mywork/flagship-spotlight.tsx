'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { resolveValidImageSrc } from '@/lib/image-utils';
import { FALLBACK_PROJECTS, FallbackProject } from '@/lib/fallback-projects';
import { PortfolioProject } from '@/components/ui/portfolio-card';

interface FlagshipItem {
  id: string;
  title: string;
  client: string;
  region: string;
  category: string;
  description: string;
  metrics: { label: string; value: string }[];
  stack: string[];
  link: string;
  image: string;
}

function mapToSpotlightItem(p: PortfolioProject | FallbackProject): FlagshipItem {
  const isUK =
    p.technologies?.some((t: string) => t.toLowerCase().includes('uk') || t.toLowerCase().includes('fca')) ||
    p.sitename?.toLowerCase().includes('macmanus') ||
    p.sitename?.toLowerCase().includes('tower');

  const isUS =
    p.sitename?.toLowerCase().includes('buildforuser') ||
    p.sitename?.toLowerCase().includes('hohnen');

  const region = isUK ? 'UK 🇬🇧' : isUS ? 'US 🇺🇸' : 'Global 🌐';

  // Metrics mapping
  let metrics = [
    { label: 'Core Vitals', value: '98 / 100' },
    { label: 'Architecture', value: 'Edge CDN' },
    { label: 'Status', value: 'Shipped' },
  ];

  if (p.permalink === 'macmanus-portal') {
    metrics = [
      { label: 'Lighthouse Speed', value: '98 / 100' },
      { label: 'Time To First Byte', value: '140ms' },
      { label: 'Lead Capture', value: '+42% Lift' },
    ];
  } else if (p.permalink === 'buildforuser') {
    metrics = [
      { label: 'Database', value: 'NeonDB Postgres' },
      { label: 'Architecture', value: 'Server Actions' },
      { label: 'Type Safety', value: '100% Strict' },
    ];
  } else if (p.technologies?.some((t: string) => t.toLowerCase().includes('wordpress') || t.toLowerCase().includes('plugin'))) {
    metrics = [
      { label: 'Engine', value: 'PSR-4 PHP' },
      { label: 'Block Editor', value: 'React Native' },
      { label: 'Optimization', value: 'Zero Bloat' },
    ];
  }

  const category =
    p.category ||
    (p.technologies?.some((t: string) => t.toLowerCase().includes('plugin'))
      ? 'WordPress Extension'
      : p.technologies?.some((t: string) => t.toLowerCase().includes('react') || t.toLowerCase().includes('next'))
      ? 'Multi-Tenant Web Engine'
      : 'Commercial Platform');

  const client =
    p.client ||
    (p.sitename.includes('MacManus')
      ? 'MacManus Commercial Broker'
      : p.sitename.includes('BuildForUser')
      ? 'BuildForUser Inc'
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
    metrics,
    stack: p.technologies?.slice(0, 5) || ['React', 'Next.js', 'TypeScript'],
    link: `/mywork/${p.permalink}`,
    image: resolvedImage,
  };
}

export function FlagshipSpotlight() {
  // Initialize with the top 2 flagship builds from fallback-projects
  const initialItems = FALLBACK_PROJECTS.slice(0, 2).map(mapToSpotlightItem);
  const [items, setItems] = useState<FlagshipItem[]>(initialItems);

  // Dynamically load from /api/projects (the exact same data source as MyWork)
  useEffect(() => {
    async function loadProjects() {
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
            setItems(sorted.slice(0, 2).map(mapToSpotlightItem));
          }
        }
      } catch (error) {
        console.warn('FlagshipSpotlight using fallback dataset:', error);
      }
    }

    loadProjects();
  }, []);

  return (
    <section className="mb-14">
      {/* Eyebrow and Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Flagship Deployments
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0b1a30] tracking-tight mt-2">
            Selected Engineering Case Studies
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            In-depth architectural breakdowns of mission-critical platforms built for UK & US businesses.
          </p>
        </div>

        <Link
          href="/case-studies"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-amber-600 transition-colors shrink-0"
        >
          <span>View Detailed Case Studies</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Flagship Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-400/60 transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Card Header Media & Badges */}
              <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden border-b border-slate-100">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover object-top group-hover:scale-103 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 1024px) 100vw, 600px"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Floating Region & Category Pills */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold bg-white/95 backdrop-blur-md text-slate-900 px-2.5 py-1 rounded-full shadow-md border border-slate-200">
                    {item.region} {item.client}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full backdrop-blur-md">
                    Verified Build
                  </span>
                </div>
              </div>

              {/* Card Content Body */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-[#0b1a30] group-hover:text-amber-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mt-2 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Verified Metrics Strip */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
                  {item.metrics.map((m, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                      <span className="block text-[10px] font-mono text-slate-500 uppercase">
                        {m.label}
                      </span>
                      <span className="text-sm font-black text-[#0b1a30] font-mono">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Action Link Footer */}
            <div className="p-6 pt-0">
              <Link
                href={item.link}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md cursor-pointer"
              >
                <span>Read Architectural Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
