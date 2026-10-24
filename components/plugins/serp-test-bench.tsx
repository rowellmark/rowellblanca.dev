'use client';

import React, { useEffect, useState } from 'react';
import { Check, Monitor, Share2, Smartphone, AtSign } from 'lucide-react';

type Platform = 'google-desktop' | 'google-mobile' | 'facebook' | 'twitter';

const PLATFORMS: { id: Platform; label: string; Icon: typeof Monitor }[] = [
    { id: 'google-desktop', label: 'Desktop', Icon: Monitor },
    { id: 'google-mobile', label: 'Mobile', Icon: Smartphone },
    { id: 'facebook', label: 'Facebook', Icon: Share2 },
    { id: 'twitter', label: 'X', Icon: AtSign },
];

const MAX_PIXELS = 600;

const fieldClass =
    'w-full px-4 py-3 rounded-2xl bg-white border border-brand-border text-brand-navy text-[15px] focus:outline-none focus:border-brand-navy transition-colors';

// Same idea as the plugin's metabox: measure the rendered title with Canvas
// (Google truncates by pixels, not characters).
function useTitlePixels(title: string) {
    const [px, setPx] = useState(Math.round(title.length * 8.5));
    useEffect(() => {
        const ctx = document.createElement('canvas').getContext('2d');
        if (!ctx) return;
        ctx.font = '20px Arial, sans-serif';
        setPx(Math.round(ctx.measureText(title || 'Page title').width));
    }, [title]);
    return px;
}

export function SerpTestBench() {
    const [keyword, setKeyword] = useState('WordPress SEO plugin');
    const [title, setTitle] = useState('BuildForUser SEO — Fast, Unlocked WordPress SEO Plugin');
    const [desc, setDesc] = useState(
        'Live SERP previews, a Canvas pixel-width meter, multi-keyword audits, XML sitemaps and 301 redirects — with every feature unlocked.'
    );
    const [platform, setPlatform] = useState<Platform>('google-desktop');
    const px = useTitlePixels(title);

    const pct = Math.min(100, Math.round((px / MAX_PIXELS) * 100));
    const over = px > MAX_PIXELS;
    const safe = px >= 300 && px <= 580;
    const meterColor = over ? 'bg-rose-500' : safe ? 'bg-emerald-500' : 'bg-amber-500';
    const kw = keyword.toLowerCase().trim();
    const inTitle = !!kw && title.toLowerCase().includes(kw);
    const inDesc = !!kw && desc.toLowerCase().includes(kw);

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="min-w-0 lg:col-span-5 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label htmlFor="bench-keyword" className="font-mono text-xs uppercase tracking-[0.08em] text-brand-slate">
                        Focus keyphrase
                    </label>
                    <input id="bench-keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} className={fieldClass} />
                    <div className="flex gap-2 flex-wrap">
                        {[
                            ['In title', inTitle],
                            ['In description', inDesc],
                        ].map(([label, ok]) => (
                            <span
                                key={label as string}
                                className={`inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-1 rounded-full border ${
                                    ok ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-white text-brand-slate border-brand-border'
                                }`}
                            >
                                {ok ? <Check className="h-3 w-3" aria-hidden="true" /> : '○'} {label as string}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-baseline">
                        <label htmlFor="bench-title" className="font-mono text-xs uppercase tracking-[0.08em] text-brand-slate">
                            SEO title
                        </label>
                        <span className="font-mono text-[11px] text-brand-slate">{title.length} chars</span>
                    </div>
                    <input id="bench-title" value={title} onChange={(e) => setTitle(e.target.value)} className={fieldClass} />
                    <div className="rounded-2xl border border-brand-border bg-white p-4 flex flex-col gap-2">
                        <div className="flex justify-between font-mono text-[11px] text-brand-slate">
                            <span>Title pixel width</span>
                            <span className={`font-bold ${over ? 'text-rose-600' : safe ? 'text-emerald-700' : 'text-amber-700'}`} aria-live="polite">
                                {px}px / {MAX_PIXELS}px
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className={`h-full rounded-full transition-[width] duration-300 ${meterColor}`} style={{ width: `${pct}%` }} />
                        </div>
                        <div className="flex justify-between font-mono text-[11px] text-slate-400">
                            <span>0px</span>
                            <span>Safe 300–580px</span>
                            <span>600px cutoff</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-baseline">
                        <label htmlFor="bench-desc" className="font-mono text-xs uppercase tracking-[0.08em] text-brand-slate">
                            Meta description
                        </label>
                        <span className={`font-mono text-[11px] ${desc.length > 160 ? 'text-rose-600' : 'text-brand-slate'}`}>{desc.length} / 160</span>
                    </div>
                    <textarea id="bench-desc" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} className={`${fieldClass} resize-none`} />
                </div>
            </div>

            <div className="min-w-0 lg:col-span-7 rounded-[28px] bg-brand-ink p-5 sm:p-8 flex flex-col gap-6">
                <div role="tablist" aria-label="Preview platform" className="self-start max-w-full overflow-x-auto flex gap-1 p-1 rounded-full bg-white/[0.06] border border-white/10">
                    {PLATFORMS.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            type="button"
                            role="tab"
                            aria-selected={platform === id}
                            onClick={() => setPlatform(id)}
                            className={`shrink-0 inline-flex items-center gap-1.5 h-9 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
                                platform === id ? 'bg-amber-500 text-brand-ink' : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 flex items-center">
                    {platform === 'google-desktop' && (
                        <div className="w-full rounded-2xl bg-white text-[#202124] p-6 flex flex-col gap-1.5 font-sans">
                            <div className="flex items-center gap-2.5 mb-1">
                                <span className="h-7 w-7 rounded-full bg-slate-100 grid place-items-center text-xs font-bold text-brand-navy">R</span>
                                <span className="flex flex-col leading-tight">
                                    <span className="text-sm">rowellblanca.dev</span>
                                    <span className="text-xs text-[#4d5156]">https://www.rowellblanca.dev › plugins</span>
                                </span>
                            </div>
                            <span className="text-xl leading-snug text-[#1a0dab] line-clamp-1 break-all">{title || 'Page title'}</span>
                            <span className="text-sm leading-relaxed text-[#4d5156] line-clamp-2">{desc || 'Add a meta description.'}</span>
                        </div>
                    )}
                    {platform === 'google-mobile' && (
                        <div className="mx-auto w-full max-w-[360px] rounded-[28px] border-[6px] border-brand-ink-2 bg-white text-[#202124] p-5 flex flex-col gap-1.5 font-sans">
                            <span className="text-xs text-[#4d5156]">rowellblanca.dev › plugins</span>
                            <span className="text-lg leading-snug text-[#1a0dab] line-clamp-2">{title || 'Page title'}</span>
                            <span className="text-[13px] leading-relaxed text-[#4d5156] line-clamp-3">{desc}</span>
                        </div>
                    )}
                    {platform === 'facebook' && (
                        <div className="w-full rounded-2xl overflow-hidden bg-white text-[#1c1e21] font-sans">
                            <div className="aspect-[1200/630] bg-gradient-to-br from-brand-ink-2 to-brand-ink grid place-items-center font-mono text-xs text-slate-400">
                                1200 × 630 OpenGraph image
                            </div>
                            <div className="p-4 bg-[#f0f2f5] flex flex-col gap-0.5">
                                <span className="text-xs uppercase text-[#606770]">rowellblanca.dev</span>
                                <span className="font-bold leading-snug line-clamp-2">{title}</span>
                                <span className="text-sm text-[#606770] line-clamp-1">{desc}</span>
                            </div>
                        </div>
                    )}
                    {platform === 'twitter' && (
                        <div className="w-full rounded-2xl overflow-hidden border border-white/15 bg-black text-white font-sans">
                            <div className="aspect-[2/1] bg-gradient-to-br from-neutral-900 to-black grid place-items-center font-mono text-xs text-neutral-500">
                                Summary card · large image (2:1)
                            </div>
                            <div className="p-4 flex flex-col gap-0.5">
                                <span className="text-xs text-neutral-500">rowellblanca.dev</span>
                                <span className="font-bold text-sm leading-snug line-clamp-1">{title}</span>
                                <span className="text-sm text-neutral-400 line-clamp-2">{desc}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
