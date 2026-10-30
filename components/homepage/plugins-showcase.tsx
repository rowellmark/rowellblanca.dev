"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SplitText } from "@/components/ui/split-text";
import { LoginPreview, SerpPreview } from "@/components/plugins/plugin-previews";

const SEO_FEATURES = [
    "Live Google, Facebook & X previews with a 600px title pixel-width meter",
    "Primary + up to 5 secondary/LSI keyphrase content audit",
    "Multi-part XML sitemaps, 301/410 redirect manager & CSV import",
    "llms.txt endpoints for AI search (ChatGPT, Claude, Perplexity, Gemini)",
    "One-click import from Yoast SEO, Rank Math & All in One SEO",
];

const LOGIN_FEATURES = [
    "Branded split-panel login screen replacing the default wp-login.php",
    "Live logo, background, accent colour & tagline settings — no code",
    "Secure custom login slug; /wp-login.php returns a 404",
    "Shares the BuildForUser Dashboard admin menu & UI shell",
];

const SEO_PLUGIN_HREF = "/plugins/buildforuser-seo";

// Default case-study link; refreshed from /api/projects in case the DB uses another permalink.
const LOGIN_FALLBACK_HREF = "/mywork/buildforuser-login-customizer-plugin";
const LOGIN_PLUGIN_PATH = "buildforuser-login-customizer";

function useLoginCustomizerHref() {
    const [href, setHref] = useState(LOGIN_FALLBACK_HREF);
    useEffect(() => {
        let cancelled = false;
        fetch("/api/projects")
            .then((res) => res.json())
            .then((data) => {
                if (cancelled || !Array.isArray(data?.projects)) return;
                const match = data.projects.find(
                    (p: { url?: string; permalink?: string }) => p.url?.includes(LOGIN_PLUGIN_PATH) && p.permalink
                );
                if (match) setHref(`/mywork/${match.permalink}`);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);
    return href;
}

function FeatureList({ items }: { items: string[] }) {
    return (
        <ul className="m-0 p-0 list-none flex flex-col border-t border-white/10">
            {items.map((item) => (
                <li key={item} className="flex gap-3.5 py-3.5 border-b border-white/10 text-[15px] leading-snug text-slate-300">
                    <span aria-hidden="true" className="text-amber-500">—</span>
                    {item}
                </li>
            ))}
        </ul>
    );
}

export function PluginsShowcase() {
    const loginHref = useLoginCustomizerHref();

    return (
        <section id="plugins" className="px-4 sm:px-6 lg:px-10 pb-24 lg:pb-40">
            <div className="mx-auto max-w-[1360px] flex flex-col gap-14 lg:gap-16">
                <div className="motion-reveal flex flex-wrap items-end justify-between gap-8">
                    <div className="flex flex-col gap-5">
                        <p className="m-0 font-mono text-[13px] tracking-[0.08em] uppercase text-brand-slate">(03) — WordPress plugins</p>
                        <h2 data-inview className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(44px,6.4vw,104px)]">
                            <SplitText lines={["Plugins I", "build & maintain."]} />
                        </h2>
                    </div>
                    <div className="flex flex-col items-start gap-4 max-w-[420px]">
                        <p className="m-0 text-brand-slate text-[17px] leading-relaxed">
                            Hand-coded WordPress plugins from the BuildForUser suite — fast, dependency-light, and with every
                            feature unlocked.
                        </p>
                        <Link href="/plugins" className="motion-underline font-semibold text-brand-navy inline-flex items-center min-h-[44px]">
                            Browse all plugins →
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* BuildForUser SEO */}
                    <article data-cursor="view" className="relative motion-reveal motion-card rounded-[28px] bg-brand-ink text-white p-6 sm:p-10 flex flex-col gap-8">
                        {/* Whole-card click target (kept separate from the animated button) */}
                        <Link href={SEO_PLUGIN_HREF} aria-hidden="true" tabIndex={-1} className="absolute inset-0 z-[1] rounded-[inherit]" />
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="font-mono text-xs uppercase tracking-[0.08em] text-amber-400">SEO engine · v1.0.0</span>
                            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">WP 5.8+ · PHP 7.4+ · GPLv2</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h3 className="m-0 text-[clamp(30px,3vw,44px)] font-extrabold tracking-[-0.04em] leading-none">BuildForUser SEO</h3>
                            <p className="m-0 text-slate-300 text-[17px] leading-relaxed max-w-[520px]">
                                All-in-one WordPress SEO engine with live multi-platform SERP previews, multi-keyword
                                auditing, XML sitemaps and 301 redirects — no paywalls or license gates.
                            </p>
                        </div>
                        <SerpPreview />
                        <FeatureList items={SEO_FEATURES} />
                        <Link
                            href={SEO_PLUGIN_HREF}
                            aria-label="Know more about BuildForUser SEO"
                            className="motion-btn motion-magnetic relative z-[2] mt-auto self-start inline-flex items-center gap-3 min-h-[56px] px-7 rounded-full bg-amber-500 hover:bg-amber-400 text-brand-ink font-bold"
                        >
                            Know more <span className="motion-arrow" aria-hidden="true">→</span>
                        </Link>
                    </article>

                    {/* Login Customizer */}
                    <article data-cursor="view" className="relative motion-reveal motion-card rounded-[28px] bg-brand-ink-2 text-white border border-white/[0.08] p-6 sm:p-10 flex flex-col gap-8">
                        <Link href={loginHref} aria-hidden="true" tabIndex={-1} className="absolute inset-0 z-[1] rounded-[inherit]" />
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="font-mono text-xs uppercase tracking-[0.08em] text-amber-400">Security · Admin UI</span>
                            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">WordPress plugin</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h3 className="m-0 text-[clamp(30px,3vw,44px)] font-extrabold tracking-[-0.04em] leading-none">Login Customizer</h3>
                            <p className="m-0 text-slate-300 text-[17px] leading-relaxed max-w-[520px]">
                                A premium split-panel login screen with live branding controls and a secure login URL that
                                hides the default wp-login.php from brute-force bots.
                            </p>
                        </div>
                        <LoginPreview />
                        <FeatureList items={LOGIN_FEATURES} />
                        <Link
                            href={loginHref}
                            aria-label="Know more about Login Customizer"
                            className="motion-btn motion-magnetic relative z-[2] mt-auto self-start inline-flex items-center gap-3 min-h-[56px] px-7 rounded-full border border-white/25 hover:border-white/60 text-white font-semibold"
                        >
                            Know more <span className="motion-arrow" aria-hidden="true">→</span>
                        </Link>
                    </article>
                </div>
            </div>

        </section>
    );
}
