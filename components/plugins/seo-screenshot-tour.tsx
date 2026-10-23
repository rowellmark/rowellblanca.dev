'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Maximize2, X } from 'lucide-react';
import { heroChipClass } from '@/components/ui/page-hero';

interface Screenshot {
    id: string;
    tab: string;
    title: string;
    badge: string;
    description: string;
    src: string;
    highlights: string[];
    metrics: { label: string; value: string }[];
}

const SCREENSHOTS: Screenshot[] = [
    {
        id: 'serp-preview',
        tab: 'SERP & pixel meter',
        title: 'Live multi-platform SERP & social simulator',
        badge: 'Desktop & mobile preview',
        description:
            "Real-time Google snippet preview with HTML5 Canvas pixel-width measurement against Google's 600px desktop truncation limit, so titles never get cut off after publishing.",
        src: '/images/plugins/buildforuser-seo/serp-preview.jpg',
        highlights: [
            'HTML5 Canvas 600px title truncation measurement',
            'Instant toggle: Google desktop vs Google mobile',
            'Facebook OpenGraph & Twitter / X card simulators',
            'Live character & pixel gauges with safety zones',
        ],
        metrics: [
            { label: 'Measurement', value: 'Canvas pixels' },
            { label: 'Desktop cutoff', value: '600px' },
            { label: 'Platforms', value: '4 previews' },
        ],
    },
    {
        id: 'content-audit',
        tab: 'Content audit & LSI',
        title: 'Deep on-page audit & multi-keyword matrix',
        badge: 'Audit & readability',
        description:
            'Audit a primary focus keyphrase plus up to five secondary/LSI keyphrases, validate the H1–H6 heading tree and score readability while you write.',
        src: '/images/plugins/buildforuser-seo/content-audit.jpg',
        highlights: [
            'Primary keyword + up to 5 secondary/LSI keyphrases',
            'Placement pills: title, slug, description, intro, headings',
            'H1–H6 hierarchy validator (catches skipped levels)',
            'Flesch reading ease & transition-word density',
        ],
        metrics: [
            { label: 'LSI keyphrases', value: 'Up to 5' },
            { label: 'Headings', value: 'H1–H6 tree' },
            { label: 'Readability', value: 'Flesch' },
        ],
    },
    {
        id: 'sitemaps-config',
        tab: 'Sitemaps & llms.txt',
        title: 'Multi-part XML sitemaps & AI search feeds',
        badge: 'Index & AI crawlers',
        description:
            'A dynamic sitemap index with dedicated sub-sitemaps for posts, pages, categories, custom post types, news and video — plus /llms.txt manifests for AI search bots.',
        src: '/images/plugins/buildforuser-seo/sitemaps-config.jpg',
        highlights: [
            'Dynamic /sitemap.xml index with automatic cache purging',
            'Sub-sitemaps with <image:image> tags for featured art',
            'Google News (48-hour window) & video sitemaps',
            '/llms.txt and /llms-full.txt feeds for AI assistants',
        ],
        metrics: [
            { label: 'Sitemap types', value: '6 sub-maps' },
            { label: 'AI manifest', value: '/llms.txt' },
            { label: 'Styling', value: 'XSL' },
        ],
    },
    {
        id: 'redirects-manager',
        tab: '301 & regex redirects',
        title: 'Redirect engine with automatic slug monitoring',
        badge: 'Link hygiene',
        description:
            '301, 302, 307 and 410 redirects with automatic slug-change detection, regex capture-group routing, CSV bulk import and circular-loop detection.',
        src: '/images/plugins/buildforuser-seo/redirects-manager.jpg',
        highlights: [
            'Slug-change detector so URL edits never drop rankings',
            'Regex matching with capture groups ($1, $2)',
            '410 Content Deleted headers to clear thin content fast',
            'CSV import/export & redirect-chain detection',
        ],
        metrics: [
            { label: 'Status codes', value: '301 · 302 · 307 · 410' },
            { label: 'Patterns', value: 'Regex' },
            { label: 'Bulk import', value: 'CSV' },
        ],
    },
];

export function SeoScreenshotTour() {
    const [active, setActive] = useState(SCREENSHOTS[0]);
    const [zoomed, setZoomed] = useState(false);

    useEffect(() => {
        if (!zoomed) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setZoomed(false);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKey);
        };
    }, [zoomed]);

    return (
        <div className="flex flex-col gap-8">
            <div role="tablist" aria-label="Plugin screens" className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                {SCREENSHOTS.map((s) => (
                    <button
                        key={s.id}
                        type="button"
                        role="tab"
                        aria-selected={active.id === s.id}
                        onClick={() => setActive(s)}
                        className={`${heroChipClass(active.id === s.id)} shrink-0 whitespace-nowrap`}
                    >
                        {s.tab}
                    </button>
                ))}
            </div>

            <div className="rounded-[28px] bg-brand-ink-2 border border-white/[0.08] overflow-hidden">
                {/* Window bar */}
                <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="flex gap-1.5 shrink-0" aria-hidden="true">
                            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                        </span>
                        <span className="truncate font-mono text-xs text-slate-400">
                            wp-admin / <span className="text-slate-200">admin.php?page=buildforuser-seo</span>
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setZoomed(true)}
                        className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-white/15 hover:border-white/40 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer transition-colors"
                    >
                        <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" /> Zoom
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => setZoomed(true)}
                    aria-label={`Enlarge screenshot: ${active.title}`}
                    className="group relative block w-full aspect-[1376/768] bg-black overflow-hidden cursor-zoom-in"
                >
                    <Image
                        key={active.id}
                        src={active.src}
                        alt={active.title}
                        fill
                        priority={active.id === SCREENSHOTS[0].id}
                        sizes="(max-width: 1400px) 100vw, 1360px"
                        className="object-cover object-top motion-fade transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015]"
                    />
                </button>

                <div className="p-6 sm:p-10 border-t border-white/10 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
                    <div className="flex flex-col gap-4">
                        <span className="font-mono text-xs uppercase tracking-[0.08em] text-amber-400">{active.badge}</span>
                        <h3 className="m-0 text-[clamp(26px,2.6vw,38px)] font-extrabold tracking-[-0.04em] leading-[1.05]">{active.title}</h3>
                        <p className="m-0 text-slate-300 text-[17px] leading-relaxed">{active.description}</p>
                        <dl className="m-0 mt-2 grid grid-cols-3 border-t border-white/10">
                            {active.metrics.map((m) => (
                                <div key={m.label} className="flex flex-col-reverse gap-1 pt-4 pr-3">
                                    <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-500">{m.label}</dt>
                                    <dd className="m-0 font-extrabold text-white text-[15px] sm:text-lg leading-tight">{m.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                    <ul className="m-0 p-0 list-none flex flex-col border-t border-white/10 self-start">
                        {active.highlights.map((h) => (
                            <li key={h} className="flex gap-3.5 py-3.5 border-b border-white/10 text-[15px] leading-snug text-slate-300">
                                <span aria-hidden="true" className="text-amber-500">—</span>
                                {h}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {zoomed && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={active.title}
                    data-lenis-prevent
                    onClick={() => setZoomed(false)}
                    className="fixed inset-0 z-[100000] bg-brand-ink/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-8"
                >
                    <div className="relative w-full max-w-[1376px]" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            onClick={() => setZoomed(false)}
                            aria-label="Close"
                            className="absolute -top-12 right-0 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="relative w-full aspect-[1376/768] rounded-2xl overflow-hidden bg-black">
                            <Image src={active.src} alt={active.title} fill sizes="100vw" className="object-contain" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
