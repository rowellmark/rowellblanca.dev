"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ContactModal } from "@/components/ui/contact-modal";

const CLOCKS = [
    { label: "London", timeZone: "Europe/London" },
    { label: "New York", timeZone: "America/New_York" },
    { label: "Sydney", timeZone: "Australia/Sydney" },
];

function formatTime(timeZone: string) {
    return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone,
    }).format(new Date());
}

// Times only render after mount so server and client markup match.
function useClocks() {
    const [times, setTimes] = useState<string[] | null>(null);

    useEffect(() => {
        const tick = () => setTimes(CLOCKS.map((c) => formatTime(c.timeZone)));
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, []);

    return times;
}

// Cropped hero thumbnails (public/images/hero) of launched client sites.
const REEL = [
    ["macmanusfd", "MacManus Funeral Director Finance"],
    ["joy-homes", "Joy Baresel — Engel & Völkers"],
    ["juliettehohnen", "Juliette Hohnen real estate"],
    ["bellemere", "Bellemere fashion store"],
    ["minimalist-studio", "Minimalist studio slider"],
    ["community-scheduler", "Community scheduler"],
    ["car-landing", "Car rental landing page"],
    ["smooth-fruit", "Smooth fruit app landing"],
] as const;
const REEL_COLUMNS = [REEL.slice(0, 3), REEL.slice(3, 6), REEL.slice(5, 8).concat(REEL.slice(0, 1))];

function ReelShot({ name, label }: { name: string; label: string }) {
    return (
        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-brand-ink-2 ring-1 ring-white/10 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.8)]">
            <Image src={`/images/hero/${name}.webp`} alt={label} fill sizes="(min-width: 1024px) 220px, 200px" className="object-cover object-top" />
        </div>
    );
}

/** Tilted wall of project screenshots drifting up/down (desktop). */
function ProjectReel() {
    return (
        <div aria-hidden="true" className="motion-reel relative h-full min-h-[560px] overflow-hidden rounded-[28px] [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]">
            <div className="absolute inset-[-18%] grid grid-cols-3 gap-4 [transform:perspective(1800px)_rotateX(14deg)_rotateZ(-10deg)]">
                {REEL_COLUMNS.map((col, c) => (
                    <div key={c} className={`flex flex-col gap-4 ${c === 1 ? "motion-reel-down" : "motion-reel-up"}`}>
                        {[...col, ...col].map(([name, label], i) => (
                            <ReelShot key={`${name}-${i}`} name={name} label={label} />
                        ))}
                    </div>
                ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-brand-ink to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-brand-ink to-transparent" />
        </div>
    );
}

/** Single-row marquee of the same screenshots (phones and tablets). */
function ProjectStrip() {
    return (
        <div aria-hidden="true" className="motion-marquee -mx-4 sm:-mx-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="motion-marquee-track gap-3">
                {[...REEL, ...REEL].map(([name, label], i) => (
                    <div key={`${name}-${i}`} className="w-[220px] shrink-0">
                        <ReelShot name={name} label={label} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function Hero() {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const times = useClocks();

    return (
        <section className="relative bg-brand-ink text-white px-4 sm:px-6 lg:px-10 overflow-hidden">
            <div className="mx-auto max-w-[1360px] min-h-[min(920px,100svh)] flex flex-col lg:justify-end gap-10 lg:gap-12 pt-32 lg:pt-40 pb-12 lg:pb-16">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12 items-stretch">
                    <div className="flex flex-col justify-end gap-10 min-w-0">
                        <div className="motion-fade motion-d1 flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-white/15 font-mono text-xs tracking-[0.08em] uppercase text-slate-300">
                                <span className="motion-pulse h-2 w-2 rounded-full bg-emerald-500" />
                                Available for new projects
                            </span>
                            <span className="px-3.5 py-2 rounded-full border border-white/15 font-mono text-xs tracking-[0.08em] uppercase text-slate-300">
                                Client footprint · UK · US · AU
                            </span>
                        </div>

                        <h1 className="motion-hero-exit m-0 flex flex-col font-extrabold tracking-[-0.05em] leading-[0.92] text-[clamp(52px,7.4vw,124px)]">
                            <span className="motion-fade motion-d1 block mb-7 font-mono font-medium tracking-[0.06em] leading-snug uppercase text-slate-400 text-[clamp(13px,1.1vw,15px)]">
                                Rowell Mark Blanca — Freelance Next.js &amp; WordPress Developer
                            </span>{" "}
                            <span className="motion-mask"><span className="motion-rise motion-d1">Engineering</span></span>
                            <span className="motion-mask">
                                <span className="motion-rise motion-d2">
                                    fast, <em className="font-medium italic text-amber-500">quiet</em> &amp;
                                </span>
                            </span>
                            <span className="motion-mask"><span className="motion-rise motion-d3">scalable web.</span></span>
                        </h1>
                    </div>

                    {/* Visual: live wall of launched work + floating proof cards */}
                    <div className="motion-fade motion-d3 relative hidden lg:block">
                        <ProjectReel />
                        <div className="motion-float absolute left-[-28px] bottom-10 flex items-center gap-3 rounded-full bg-brand-ink/85 backdrop-blur-xl border border-white/10 py-2 pl-2 pr-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)]">
                            <Image src="/images/hero/rowell-avatar.webp" alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover ring-2 ring-amber-500" />
                            <span className="flex flex-col leading-tight">
                                <span className="font-bold text-sm">Rowell Mark Blanca</span>
                                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">Senior engineer · 12+ yrs</span>
                            </span>
                        </div>
                        <Link
                            href="/plugins/buildforuser-seo"
                            className="motion-float group absolute right-6 top-8 flex flex-col gap-1 rounded-2xl bg-white text-brand-ink py-3.5 px-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] [animation-delay:-3s]"
                        >
                            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-brand-slate">Just launched</span>
                            <span className="font-extrabold text-sm">
                                BuildForUser SEO <span className="text-amber-600">v1.0</span>{" "}
                                <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" aria-hidden="true">→</span>
                            </span>
                        </Link>
                    </div>
                </div>

                <div className="motion-fade motion-d4 lg:hidden">
                    <ProjectStrip />
                </div>

                <div className="flex flex-wrap items-end justify-between gap-10 border-t border-white/10 pt-8">
                    <p className="motion-fade motion-d4 m-0 max-w-[560px] text-[clamp(17px,1.4vw,20px)] leading-relaxed text-slate-300">
                        Senior Full-Stack &amp; Next.js engineer helping funded startups, agencies and UK, US &amp; Australian
                        businesses build high-concurrency platforms, zero-bloat WordPress engines and high-performance
                        APIs — without agency overhead.
                    </p>
                    <div className="motion-fade motion-d5 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => setIsContactModalOpen(true)}
                            className="motion-btn motion-magnetic inline-flex items-center gap-2.5 min-h-[56px] px-7 rounded-full bg-amber-500 hover:bg-amber-400 text-brand-ink font-bold text-base cursor-pointer"
                        >
                            Book discovery call <span className="motion-arrow" aria-hidden="true">→</span>
                        </button>
                        <Link
                            href="#selected-work"
                            className="motion-btn motion-magnetic inline-flex items-center gap-2.5 min-h-[56px] px-7 rounded-full border border-white/25 hover:border-white/60 text-white font-semibold text-base"
                        >
                            See selected work
                        </Link>
                    </div>
                </div>

                <div className="motion-fade motion-d5 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex flex-wrap gap-7 font-mono text-xs tracking-[0.06em] uppercase text-slate-400">
                        {CLOCKS.map((clock, i) => (
                            <span key={clock.label}>
                                {clock.label}{" "}
                                <span className="text-white tabular-nums">{times ? times[i] : "--:--:--"}</span>
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 font-mono text-xs tracking-[0.08em] uppercase text-slate-400" aria-hidden="true">
                        Scroll
                        <span className="relative block h-10 w-px overflow-hidden bg-white/15">
                            <span className="motion-cue absolute inset-0 bg-white" />
                        </span>
                    </div>
                </div>
            </div>

            <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} initialTab="call" />
        </section>
    );
}
