"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Code, CheckCircle, ShieldCheck, Award, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import rowellbanner from '@/assets/images/rowellbanner.png';
import { ContactModal } from "@/components/ui/contact-modal";
import { RotatingText } from "@/components/ui/rotating-text";

const ROTATING_PREFIXES = [
    "Full-Stack",
    "Creative",
    "Solutions-Driven",
    "Product-Focused",
];

const TECH_PILLS = [
    { label: "React", bg: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100" },
    { label: "Next.js", bg: "bg-slate-900 text-white border-slate-700 hover:bg-slate-800" },
    { label: "TypeScript", bg: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
    { label: "PHP", bg: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100" },
    { label: "WordPress", bg: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100" },
    { label: "Node.js", bg: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
    { label: "AI Workflows", bg: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100" },
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

    return (
        <section className="relative w-full pt-28 pb-16 lg:pt-36 lg:pb-24 bg-[#FAFAF7] overflow-hidden">
            
            {/* Subtle Textured Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

            {/* Pulsing Ambient Background Mesh Blobs */}
            <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.08, 0.95] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-400/20 to-orange-300/10 blur-3xl pointer-events-none"
            />
            <motion.div
                animate={{ opacity: [0.25, 0.5, 0.25], scale: [1.05, 0.95, 1.05] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-violet-400/15 to-indigo-300/10 blur-3xl pointer-events-none"
            />

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                
                {/* Main Hero Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                    {/* Left Column (Content) */}
                    <div className="lg:col-span-7 space-y-6 text-left">
                        
                        {/* Status Badge & UK Trust Badge */}
                        <div className="flex flex-wrap items-center gap-2">
                            <motion.div
                                initial={{ y: -15, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs"
                            >
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                                </span>
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                    Available for Select Projects
                                </span>
                            </motion.div>

                            <Link href="/hire-uk-react-developer">
                                <motion.div
                                    initial={{ y: -15, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    whileHover={{ scale: 1.04 }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 shadow-xs cursor-pointer hover:bg-amber-500/20 transition-all"
                                >
                                    <span className="text-xs">🇬🇧</span>
                                    <span className="text-xs font-bold text-slate-800 tracking-wide">
                                        Trusted by UK Clients: <span className="font-extrabold text-amber-700">Towerfire</span> & <span className="font-extrabold text-amber-700">Macmanus</span>
                                    </span>
                                </motion.div>
                            </Link>
                        </div>

                        {/* Title with ReactBits RotatingText Animation */}
                        <h1 className="space-y-2">
                            <span className="sr-only">Rowell Mark Blanca — </span>
                            <div className="flex items-center gap-2">
                                <RotatingText
                                    texts={ROTATING_PREFIXES}
                                    rotationInterval={2600}
                                    badgeBg="text-brand-navy text-4xl sm:text-5xl lg:text-6xl font-black"
                                />
                            </div>
                            <span className="block text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-amber via-amber-600 to-brand-navy tracking-tight leading-normal py-1 pb-2">
                                Software Engineer
                            </span>
                        </h1>

                        {/* Tech Stack Pills Bar */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-wrap items-center gap-2 pt-1"
                        >
                            {TECH_PILLS.map(({ label, bg }, idx) => (
                                <motion.span
                                    key={idx}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.35, delay: 0.25 + idx * 0.06 }}
                                    whileHover={{ scale: 1.08, y: -2 }}
                                    className={`text-xs font-extrabold px-3 py-1 rounded-lg border shadow-2xs cursor-pointer transition-colors ${bg}`}
                                >
                                    {label}
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="text-base sm:text-lg text-brand-slate font-medium leading-relaxed max-w-xl"
                        >
                            I turn ideas into reliable, high-performing digital products—from custom WordPress platforms to scalable React and Next.js applications—built to solve real business challenges, improve user experiences, and support long-term growth.
                        </motion.p>

                        {/* Dual CTA */}
                        <motion.div
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            className="pt-2 flex flex-wrap items-center gap-4"
                        >
                            <button
                                onClick={() => setIsContactModalOpen(true)}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-brand-amber hover:bg-slate-900 text-brand-navy hover:text-white font-extrabold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
                            >
                                <Sparkles className="h-4 w-4 text-brand-navy group-hover:text-amber-400 transition-colors" />
                                <span>Let's Build Your Project</span>
                            </button>

                            <Link
                                href="/mywork"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white border border-slate-200 hover:border-slate-800 hover:bg-slate-900 text-brand-navy hover:text-white font-bold text-sm shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                            >
                                <span>View My Work</span>
                                <ArrowRight className="h-4 w-4 text-brand-amber group-hover:text-amber-400 transition-colors" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Column (Floating Photo Card + Badges) */}
                    <div className="lg:col-span-5 flex justify-center relative">
                        
                        {/* Glow behind image card */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/30 via-violet-400/20 to-transparent rounded-full blur-2xl transform scale-90 pointer-events-none" />

                        {/* Floating Main Image Container */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: [0, -8, 0], opacity: 1 }}
                            transition={{
                                opacity: { duration: 0.8, delay: 0.3 },
                                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                            }}
                            className="relative w-full max-w-sm aspect-[4/4.5] rounded-3xl p-3 bg-white border border-slate-200 shadow-2xl overflow-hidden group"
                        >
                            <Image
                                src={rowellbanner}
                                alt="Rowell Mark Blanca — Software Engineer specializing in React, Next.js and WordPress development"
                                fill
                                priority
                                className="object-cover object-top rounded-2xl group-hover:scale-103 transition-transform duration-500"
                                sizes="(max-width: 768px) 320px, 400px"
                            />

                            {/* Floating Top Badge */}
                            <motion.div
                                animate={{ y: [0, 6, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 z-20"
                            >
                                <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
                                <span className="text-[11px] font-extrabold text-brand-navy">12+ Years Exp</span>
                            </motion.div>

                            {/* Floating Bottom Card */}
                            <div className="absolute bottom-4 inset-x-4 bg-white/95 backdrop-blur-md border border-slate-200/90 p-3 rounded-2xl text-left shadow-xl z-20 flex items-center justify-between">
                                <div>
                                    <h3 className="font-extrabold text-brand-navy text-sm leading-tight">Rowell Mark Blanca</h3>
                                    <p className="text-[11px] font-bold text-brand-amber">Software Engineer</p>
                                </div>
                                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-xl text-[10px] font-extrabold border border-amber-200 shrink-0">
                                    <ShieldCheck className="h-3.5 w-3.5 text-amber-500" /> Top Rated
                                </div>
                            </div>
                        </motion.div>

                    </div>

                </div>

                {/* Bottom Quick Feature Highlights Row */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-16 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    <motion.div whileHover={{ y: -3 }} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs transition-shadow hover:shadow-md">
                        <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                            <Award className="h-4 w-4" />
                        </div>
                        <div>
                            <span className="font-extrabold text-brand-navy text-sm block leading-none">12+ Years</span>
                            <span className="text-[11px] font-semibold text-slate-500">Field Experience</span>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -3 }} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs transition-shadow hover:shadow-md">
                        <div className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
                            <Code className="h-4 w-4" />
                        </div>
                        <div>
                            <span className="font-extrabold text-brand-navy text-sm block leading-none">50+ Projects</span>
                            <span className="text-[11px] font-semibold text-slate-500">Shipped Worldwide</span>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -3 }} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs transition-shadow hover:shadow-md">
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                            <CheckCircle className="h-4 w-4" />
                        </div>
                        <div>
                            <span className="font-extrabold text-brand-navy text-sm block leading-none">100% Success</span>
                            <span className="text-[11px] font-semibold text-slate-500">Upwork Top Rated</span>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -3 }} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs transition-shadow hover:shadow-md">
                        <div className="h-9 w-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <div>
                            <span className="font-extrabold text-brand-navy text-sm block leading-none">AI & Web Stack</span>
                            <span className="text-[11px] font-semibold text-slate-500">React, Next & WP</span>
                        </div>
                    </motion.div>
                </motion.div>

            </div>

            {/* Popup Contact Modal */}
            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </section>
    );
}
