import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { Bot, Code2, CornerDownRight, FileSpreadsheet, Gauge, Layers, Search, ShieldCheck, Target, Zap } from 'lucide-react';
import { PageHero } from '@/components/ui/page-hero';
import { SplitText } from '@/components/ui/split-text';
import { SeoScreenshotTour } from '@/components/plugins/seo-screenshot-tour';
import { SerpTestBench } from '@/components/plugins/serp-test-bench';
import { PluginInquiryButton } from '@/components/plugins/plugin-inquiry-button';

const PAGE_URL = 'https://www.rowellblanca.dev/plugins/buildforuser-seo';
const TITLE = 'BuildForUser SEO — WordPress SEO Plugin | Rowell Mark Blanca';
const DESCRIPTION =
    'An all-in-one WordPress SEO plugin with live SERP previews, a Canvas pixel-width meter, multi-keyword audits, XML sitemaps, 301 redirects and llms.txt for AI search — every feature unlocked.';

export const metadata: Metadata = {
    metadataBase: new URL('https://www.rowellblanca.dev'),
    title: TITLE,
    description: DESCRIPTION,
    keywords: [
        'BuildForUser SEO',
        'WordPress SEO plugin',
        'SERP preview plugin',
        'llms.txt WordPress',
        'XML sitemap plugin',
        'WordPress 301 redirects',
        'Yoast alternative',
    ],
    openGraph: { type: 'website', url: PAGE_URL, title: TITLE, description: DESCRIPTION, siteName: 'Rowell Mark Blanca Portfolio' },
    alternates: { canonical: PAGE_URL },
};

const MODULES = [
    { Icon: Search, title: 'Multi-platform SERP & social previews', desc: 'See the page as it will look on Google desktop, Google mobile, Facebook OpenGraph and Twitter / X cards, live as you type.' },
    { Icon: Gauge, title: 'Canvas pixel-width meter', desc: "Measures the rendered title in pixels against Google's 600px desktop cutoff, instead of guessing from character counts." },
    { Icon: Target, title: 'Multi-keyword & LSI audit', desc: 'A primary focus keyphrase plus up to five secondary terms, with placement pills for title, slug, meta description, intro and headings.' },
    { Icon: Layers, title: 'Multi-part XML sitemaps', desc: 'A dynamic /sitemap.xml index with sub-sitemaps for posts, pages, categories, custom post types, news and video.' },
    { Icon: Bot, title: 'llms.txt for AI search', desc: 'Dynamic /llms.txt, /llm.txt and /llms-full.txt Markdown feeds for ChatGPT, Claude, Perplexity, Gemini and Cursor.' },
    { Icon: CornerDownRight, title: 'Smart 301 & regex redirects', desc: 'Automatic slug-change monitoring, regex capture groups, 410 Content Deleted headers and CSV bulk import.' },
    { Icon: ShieldCheck, title: '404 & broken-link monitor', desc: 'A built-in 404 detector and internal link health checker, with one-click redirects for anything broken.' },
    { Icon: Zap, title: 'Performance SEO', desc: 'Removes emoji scripts and legacy jQuery Migrate, cleans up <head> and preloads LCP assets for better Core Web Vitals.' },
    { Icon: Code2, title: 'Schema delegation', desc: 'Hands structured data to a dedicated schema plugin, so pages never ship duplicate or conflicting JSON-LD.' },
    { Icon: FileSpreadsheet, title: 'One-click importers', desc: 'Migrates focus keywords, SEO titles, descriptions and canonical URLs from Yoast SEO, Rank Math and All in One SEO.' },
];

const INSTALL_STEPS = [
    'Upload the buildforuser-seo folder to /wp-content/plugins/, or install it from the WordPress Plugins screen.',
    'Activate it from the Plugins menu.',
    'Open BFU SEO in the admin menu to set up Search Appearance and XML sitemaps.',
    'Edit any post or page to use the BuildForUser SEO & SERP Optimizer metabox.',
];

const FAQ = [
    {
        q: 'Are all features included, with no paywall?',
        a: 'Yes. Every feature is available to every user. There are no license gates, trial limits or upsell tiers in the code.',
    },
    { q: 'Where is my XML sitemap?', a: 'It is generated automatically at https://yourdomain.com/sitemap.xml.' },
    {
        q: 'Does it conflict with schema plugins?',
        a: 'No. It is designed to hand structured data to a dedicated schema plugin (such as BuildForUser Schema LD Generator) so there is no duplicate JSON-LD.',
    },
    {
        q: 'How does the pixel-width meter work?',
        a: 'Google truncates titles by pixel width (about 600px on desktop), not character count. The preview measures the real rendered width of your title with HTML5 Canvas.',
    },
    {
        q: 'Can I import my metadata from Yoast SEO or Rank Math?',
        a: 'Yes. Go to BFU SEO › Tools › Importer to migrate focus keywords, SEO titles, descriptions and canonical URLs in one click. All in One SEO is supported too.',
    },
];

const LLMS_SAMPLE = `# Your Business Name
> One-line summary of what the site offers.

## Core pages
- Services: https://yourdomain.com/services
- Case studies: https://yourdomain.com/case-studies
- Contact: https://yourdomain.com/contact

## Latest articles
- How we cut LCP to 1.2s: https://yourdomain.com/blog/lcp`;

const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'SoftwareApplication',
            '@id': `${PAGE_URL}#software`,
            name: 'BuildForUser SEO',
            url: PAGE_URL,
            applicationCategory: 'WebApplication',
            applicationSubCategory: 'WordPress plugin',
            operatingSystem: 'WordPress 5.8+, PHP 7.4+',
            softwareVersion: '1.0.0',
            license: 'https://www.gnu.org/licenses/gpl-2.0.html',
            description: DESCRIPTION,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            author: { '@type': 'Person', name: 'Rowell Mark Blanca', url: 'https://www.rowellblanca.dev' },
        },
        {
            '@type': 'FAQPage',
            '@id': `${PAGE_URL}#faq`,
            mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        },
        {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.rowellblanca.dev' },
                { '@type': 'ListItem', position: 2, name: 'Plugins', item: 'https://www.rowellblanca.dev/#plugins' },
                { '@type': 'ListItem', position: 3, name: 'BuildForUser SEO', item: PAGE_URL },
            ],
        },
    ],
};

function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
    return (
        <p className={`m-0 font-mono text-[13px] tracking-[0.08em] uppercase ${dark ? 'text-slate-400' : 'text-brand-slate'}`}>{children}</p>
    );
}

export default function BuildForUserSeoPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <PageHero
                label="WordPress plugin · BuildForUser SEO v1.0.0"
                titleLines={['First-page rankings.', 'Zero guesswork.']}
                accentLine={1}
                lead="An all-in-one WordPress SEO engine: live SERP previews, a Canvas pixel-width meter, multi-keyword audits, sitemaps, redirects and llms.txt for AI search. No bloat, no paywalls."
            >
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="#tour"
                            className="motion-btn inline-flex items-center gap-3 min-h-[56px] px-7 rounded-full bg-amber-500 hover:bg-amber-400 text-brand-ink font-bold"
                        >
                            Tour the plugin <span className="motion-arrow" aria-hidden="true">↓</span>
                        </a>
                        <a
                            href="#test-bench"
                            className="motion-btn inline-flex items-center min-h-[56px] px-7 rounded-full border border-white/25 hover:border-white/60 text-white font-semibold"
                        >
                            Try the pixel meter
                        </a>
                    </div>
                    <ul className="m-0 p-0 list-none flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.08em] text-slate-400">
                        <li>WP 5.8+</li>
                        <li>PHP 7.4+</li>
                        <li>GPLv2</li>
                        <li className="text-amber-400">100% unlocked</li>
                    </ul>
                </div>
            </PageHero>

            {/* Screenshot tour */}
            <section id="tour" className="scroll-mt-24 bg-brand-ink text-white px-4 sm:px-6 lg:px-10 pb-24 lg:pb-36">
                <div className="mx-auto max-w-[1360px] flex flex-col gap-10">
                    <div className="motion-reveal flex flex-wrap items-end justify-between gap-6">
                        <div className="flex flex-col gap-4">
                            <SectionLabel dark>(01) — Inside the plugin</SectionLabel>
                            <h2 data-inview className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-[clamp(36px,4.6vw,72px)]">
                                <SplitText lines={['A clean admin,', 'built to be fast.']} />
                            </h2>
                        </div>
                        <p className="m-0 max-w-[420px] text-slate-300 text-[17px] leading-relaxed">
                            Four screens from the WordPress admin. Pick one to see what it does; click the screenshot to enlarge it.
                        </p>
                    </div>
                    <SeoScreenshotTour />
                </div>
            </section>

            {/* Interactive test bench */}
            <section id="test-bench" className="scroll-mt-24 px-4 sm:px-6 lg:px-10 py-24 lg:py-36">
                <div className="mx-auto max-w-[1360px] flex flex-col gap-12">
                    <div className="motion-reveal flex flex-wrap items-end justify-between gap-6">
                        <div className="flex flex-col gap-4">
                            <SectionLabel>(02) — Test bench</SectionLabel>
                            <h2 data-inview className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(36px,4.6vw,72px)]">
                                <SplitText lines={['Try the pixel', 'meter yourself.']} />
                            </h2>
                        </div>
                        <p className="m-0 max-w-[420px] text-brand-slate text-[17px] leading-relaxed">
                            Type a title and description. The meter measures the title in pixels with HTML5 Canvas, the same way the plugin&apos;s metabox does.
                        </p>
                    </div>
                    <div className="motion-reveal">
                        <SerpTestBench />
                    </div>
                </div>
            </section>

            {/* Modules */}
            <section aria-labelledby="modules-title" className="px-4 sm:px-6 lg:px-10 pb-24 lg:pb-36">
                <div className="mx-auto max-w-[1360px] flex flex-col gap-12">
                    <div className="motion-reveal flex flex-wrap items-end justify-between gap-6">
                        <div className="flex flex-col gap-4">
                            <SectionLabel>(03) — Modules</SectionLabel>
                            <h2 id="modules-title" data-inview className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(36px,4.6vw,72px)]">
                                <SplitText lines={['10 modules.', 'No paywalls.']} />
                            </h2>
                        </div>
                        <p className="m-0 max-w-[420px] text-brand-slate text-[17px] leading-relaxed">
                            Every module is on out of the box. No license keys, usage caps or upgrade nags.
                        </p>
                    </div>
                    <ol className="m-0 p-0 list-none grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-brand-border">
                        {MODULES.map(({ Icon, title, desc }, i) => (
                            <li key={title} className="motion-reveal group flex flex-col gap-4 p-7 lg:p-8 border-r border-b border-brand-border bg-brand-surface hover:bg-brand-muted transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className="h-11 w-11 rounded-full bg-brand-ink text-amber-400 grid place-items-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-105">
                                        <Icon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <span className="font-mono text-xs text-slate-400">{String(i + 1).padStart(2, '0')}</span>
                                </div>
                                <h3 className="m-0 text-xl font-extrabold tracking-[-0.02em] text-brand-navy leading-tight">{title}</h3>
                                <p className="m-0 text-[15px] leading-relaxed text-brand-slate">{desc}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* GEO / llms.txt */}
            <section className="px-4 sm:px-6 lg:px-10 pb-24 lg:pb-36">
                <div className="motion-reveal mx-auto max-w-[1360px] rounded-[28px] bg-brand-ink text-white p-6 sm:p-10 lg:p-14 grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
                    <div className="flex flex-col gap-5">
                        <SectionLabel dark>(04) — Generative engine optimisation</SectionLabel>
                        <h2 className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-[clamp(32px,3.8vw,60px)]">
                            Show up in AI answers<span className="text-amber-500">,</span> not just Google.
                        </h2>
                        <p className="m-0 text-slate-300 text-[17px] leading-relaxed">
                            Classic SEO targets search crawlers. BuildForUser SEO also serves <code className="font-mono text-amber-300">/llms.txt</code>,{' '}
                            <code className="font-mono text-amber-300">/llm.txt</code> and <code className="font-mono text-amber-300">/llms-full.txt</code> — clean
                            Markdown manifests that ChatGPT, Claude, Perplexity, Gemini and Cursor can read — cached and purged automatically when content changes.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-black/50 border border-white/10 overflow-hidden">
                        <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.08em]">
                            <span className="text-slate-400">GET /llms.txt</span>
                            <span className="text-emerald-400">200 · text/plain</span>
                        </div>
                        <pre className="m-0 p-5 overflow-x-auto font-mono text-[13px] leading-relaxed text-slate-200">{LLMS_SAMPLE}</pre>
                    </div>
                </div>
            </section>

            {/* Install + FAQ */}
            <section aria-labelledby="faq-title" className="px-4 sm:px-6 lg:px-10 pb-24 lg:pb-36">
                <div className="mx-auto max-w-[1360px] grid gap-14 lg:grid-cols-2 lg:gap-20">
                    <div className="motion-reveal flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <SectionLabel>(05) — Get started</SectionLabel>
                            <h2 className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(32px,3.6vw,56px)]">
                                Up and running in four steps.
                            </h2>
                        </div>
                        <ol className="m-0 p-0 list-none flex flex-col border-t border-brand-border">
                            {INSTALL_STEPS.map((step, i) => (
                                <li key={step} className="flex gap-5 py-5 border-b border-brand-border">
                                    <span className="font-mono text-sm text-amber-600 pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="text-[17px] leading-relaxed text-brand-navy">{step}</span>
                                </li>
                            ))}
                        </ol>
                        <div className="flex flex-wrap items-center gap-4">
                            <PluginInquiryButton>Ask about this plugin</PluginInquiryButton>
                            <Link href="/#plugins" className="motion-underline font-semibold text-brand-navy">
                                All plugins
                            </Link>
                        </div>
                    </div>

                    <div className="motion-reveal flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <SectionLabel>(06) — FAQ</SectionLabel>
                            <h2 id="faq-title" className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(32px,3.6vw,56px)]">
                                Common questions.
                            </h2>
                        </div>
                        <div className="border-t border-brand-border">
                            {FAQ.map((f) => (
                                <details key={f.q} className="group border-b border-brand-border">
                                    <summary className="flex items-center justify-between gap-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                                        <span className="text-lg font-bold text-brand-navy leading-snug">{f.q}</span>
                                        <span
                                            aria-hidden="true"
                                            className="shrink-0 h-9 w-9 rounded-full border border-brand-border grid place-items-center text-brand-navy transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:rotate-45"
                                        >
                                            +
                                        </span>
                                    </summary>
                                    <p className="m-0 pb-6 pr-14 text-[16px] leading-relaxed text-brand-slate">{f.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
