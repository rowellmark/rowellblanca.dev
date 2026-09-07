"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Code, CheckCircle, ShieldCheck, Award, Zap, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ContactModal } from "@/components/ui/contact-modal";
import { RotatingText } from "@/components/ui/rotating-text";
import { DeveloperTelemetryHud } from "./developer-telemetry-hud";

const ROTATING_PREFIXES = [
    "Full-Stack",
    "Senior React",
    "Systems & API",
    "Next.js & PHP",
];

const TECH_PILLS = [
    { label: "React 19", bg: "bg-cyan-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100" },
    { label: "Next.js 14", bg: "bg-slate-900 text-white border-slate-700 hover:bg-slate-800" },
    { label: "TypeScript", bg: "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100" },
    { label: "PostgreSQL", bg: "bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100" },
    { label: "WordPress & PHP", bg: "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100" },
    { label: "Node.js", bg: "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100" },
    { label: "Prisma ORM", bg: "bg-violet-50 text-violet-800 border-violet-200 hover:bg-violet-100" },
];

export function Hero() {
    const [titleIndex, setTitleIndex] = useState(0);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTitleIndex((prev) => (prev + 1) % ROTATING_PREFIXES.length);
        }, 2800);
        return () => clearInterval(interval);
    }, []);

    const triggerCommandPalette = () => {
        window.dispatchEvent(new CustomEvent('open-command-palette'));
    };

    return (
        <section className="relative w-full pt-28 pb-16 lg:pt-34 lg:pb-22 bg-[#FAFAF7] border-b border-slate-200/70 overflow-hidden">
            
            {/* Crisp Technical Grid Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                
                {/* Main Hero Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

                    {/* Left Column (Content) */}
                    <div className="lg:col-span-7 space-y-6 text-left">
                        
                        {/* Status Badge & UK/US/AU Trust Badge */}
                        <div className="flex flex-wrap items-center gap-2">
                            <motion.div
                                initial={{ y: -15, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                </span>
                                <span className="text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider">
                                    Available for Select Contracts
                                </span>
                            </motion.div>

                            <Link href="/case-studies">
                                <motion.div
                                    initial={{ y: -15, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                                    whileHover={{ scale: 1.03 }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 shadow-2xs cursor-pointer hover:bg-amber-500/20 transition-all"
                                >
                                    <span className="text-[11px] font-bold text-slate-800 tracking-wide">
                                        Client Footprint: <span className="font-extrabold text-amber-700">UK</span> · <span className="font-extrabold text-amber-700">US</span> · <span className="font-extrabold text-amber-700">AU</span>
                                    </span>
                                </motion.div>
                            </Link>

                            {/* ⌘K Trigger Pill */}
                            <button
                                onClick={triggerCommandPalette}
                                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300/80 text-slate-700 text-[11px] font-mono font-bold transition-colors cursor-pointer"
                                title="Open Developer Command Palette"
                            >
                                <Terminal className="w-3 h-3 text-slate-500" />
                                <span>⌘K Menu</span>
                            </button>
                        </div>

                        {/* Title */}
                        <h1 className="space-y-2">
                            <span className="sr-only">Rowell Mark Blanca — Senior Software Engineer</span>
                            <div className="flex items-center gap-2">
                                <RotatingText
                                    texts={ROTATING_PREFIXES}
                                    rotationInterval={2600}
                                    badgeBg="text-[#0b1a30] text-4xl sm:text-5xl lg:text-6xl font-black"
                                />
                            </div>
                            <span className="block text-4xl sm:text-5xl lg:text-6xl font-black text-[#0b1a30] tracking-tight leading-normal py-0.5">
                                Software Engineer
                            </span>
                        </h1>

                        {/* Tech Stack Pills Bar */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="flex flex-wrap items-center gap-2 pt-0.5"
                        >
                            {TECH_PILLS.map(({ label, bg }, idx) => (
                                <motion.span
                                    key={idx}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.2 + idx * 0.04 }}
                                    whileHover={{ y: -2 }}
                                    className={`text-[11px] font-mono font-extrabold px-3 py-1 rounded-lg border shadow-2xs transition-all ${bg}`}
                                >
                                    {label}
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl"
                        >
                            Senior Full-Stack & Next.js Engineer helping funded startups, agencies, and UK, US & Australian businesses build high-concurrency web platforms, zero-bloat WordPress engines, and high-performance APIs—without agency overhead.
                        </motion.p>

                        {/* Conversion CTAs */}
                        <motion.div
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="pt-1 flex flex-wrap items-center gap-3"
                        >
                            <button
                                onClick={() => setIsContactModalOpen(true)}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-slate-900 text-slate-950 hover:text-white font-extrabold text-xs uppercase tracking-wider shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
                            >
                                <Sparkles className="h-4 w-4 text-slate-950 group-hover:text-amber-400 transition-colors" />
                                <span>Book Discovery Call</span>
                            </button>

                            <a
                                href="#architecture-inspector"
                                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-slate-800 hover:bg-slate-900 text-slate-800 hover:text-white font-extrabold text-xs uppercase tracking-wider shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 group"
                            >
                                <span>Inspect Architecture</span>
                                <ArrowRight className="h-4 w-4 text-amber-600 group-hover:text-amber-400 transition-colors" />
                            </a>

                            <button
                                onClick={triggerCommandPalette}
                                className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-mono font-bold text-xs transition-colors cursor-pointer"
                            >
                                <span>Press</span>
                                <kbd className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 rounded shadow-2xs text-slate-800">
                                    ⌘K
                                </kbd>
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column: Interactive Developer Telemetry HUD */}
                    <div className="lg:col-span-5 flex justify-center relative">
                        <DeveloperTelemetryHud onOpenContact={() => setIsContactModalOpen(true)} />
                    </div>

                </div>

            </div>

            {/* Popup Contact Modal */}
            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </section>
    );
}
