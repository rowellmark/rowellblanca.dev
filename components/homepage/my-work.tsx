"use client";

import { motion } from "framer-motion";
import { Tab } from "../ui/tabs";

interface Props {
    notitle: string;
}

const projects_tab: string[] = ["All", "Wordpress", "Wordpress Plugins", "React/Nextjs", "Prisma", "NeonDB"];

export function MyWork({ notitle }: Props) {
    return (
        <section className={`py-24 relative overflow-hidden ${notitle ? "bg-brand-bg" : "bg-[#F8FAFC] border-t border-slate-200"}`}>

            {/* Subtle Textured Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

            {/* Pulsing Ambient Background Mesh Blobs */}
            <motion.div
                animate={{ opacity: [0.25, 0.5, 0.25], scale: [0.95, 1.08, 0.95] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-sky-400/15 to-indigo-300/10 blur-3xl pointer-events-none"
            />
            <motion.div
                animate={{ opacity: [0.2, 0.4, 0.2], scale: [1.05, 0.95, 1.05] }}
                transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-400/15 to-orange-300/10 blur-3xl pointer-events-none"
            />

            <div className="container mx-auto max-w-6xl px-6 relative z-10">
                {!notitle && (
                    <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-amber bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                            Portfolio Showcase
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-navy tracking-tight">
                            React, Next.js & WordPress Projects
                        </h2>
                        <p className="text-base text-brand-slate">
                            A curated selection of production builds — from custom WordPress platforms and plugin development to full-stack React and Next.js applications backed by Prisma and NeonDB.
                        </p>
                    </div>
                )}
                <Tab nav={projects_tab} />
            </div>
        </section>
    );
}