"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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

export function Hero() {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const times = useClocks();

    return (
        <section className="relative bg-brand-ink text-white px-4 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-[1360px] min-h-[min(920px,100svh)] flex flex-col justify-end gap-12 lg:gap-14 pt-36 lg:pt-48 pb-12 lg:pb-16">
                <div className="motion-fade motion-d1 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-white/15 font-mono text-xs tracking-[0.08em] uppercase text-slate-300">
                        <span className="motion-pulse h-2 w-2 rounded-full bg-emerald-500" />
                        Available for new projects
                    </span>
                    <span className="px-3.5 py-2 rounded-full border border-white/15 font-mono text-xs tracking-[0.08em] uppercase text-slate-300">
                        Client footprint · UK · US · AU
                    </span>
                </div>

                <h1 className="motion-hero-exit m-0 flex flex-col font-extrabold tracking-[-0.05em] leading-[0.92] text-[clamp(52px,9vw,148px)]">
                    <span className="motion-fade motion-d1 block mb-7 font-mono font-medium tracking-[0.06em] leading-snug uppercase text-slate-400 text-[clamp(13px,1.1vw,15px)]">
                        Rowell Mark Blanca — Senior Full-Stack &amp; Next.js Engineer
                    </span>
                    <span className="motion-mask"><span className="motion-rise motion-d1">Engineering</span></span>
                    <span className="motion-mask">
                        <span className="motion-rise motion-d2">
                            fast, <em className="font-medium italic text-amber-500">quiet</em> &amp;
                        </span>
                    </span>
                    <span className="motion-mask"><span className="motion-rise motion-d3">scalable web.</span></span>
                </h1>

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
