"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FALLBACK_PROJECTS } from "@/lib/fallback-projects";
import { resolveValidImageSrc, canOptimizeImage } from "@/lib/image-utils";
import { SplitText } from "@/components/ui/split-text";

interface WorkProject {
    sitename: string;
    permalink: string;
    image: string;
    description: string;
    technologies: string[];
    category?: string;
}

const CARD_COUNT = 6;

// Card skins cycle ink → cream → amber → white; each sticks 16px lower than the last.
const SKINS = [
    { card: "bg-brand-ink-2 text-white border border-white/[0.08]", muted: "text-slate-300", label: "text-amber-500", chip: "border-white/15 text-slate-300", frame: "bg-[#1E2740]", bar: "bg-[#0F1628]", dot: "bg-slate-700" },
    { card: "bg-brand-cream text-brand-navy", muted: "text-brand-slate", label: "text-brand-slate", chip: "border-slate-900/20", frame: "bg-[#E7E1D3]", bar: "bg-[#DDD6C6]", dot: "bg-[#B8AF9C]" },
    { card: "bg-amber-500 text-brand-ink", muted: "text-brand-ink", label: "text-brand-ink", chip: "border-brand-ink/30", frame: "bg-brand-ink/10", bar: "bg-brand-ink/10", dot: "bg-brand-ink/30" },
    { card: "bg-white text-brand-navy", muted: "text-brand-slate", label: "text-brand-slate", chip: "border-slate-900/20", frame: "bg-slate-100", bar: "bg-slate-200", dot: "bg-slate-300" },
];
const STICKY_TOPS = ["top-[104px]", "top-[120px]", "top-[136px]", "top-[152px]", "top-[168px]", "top-[184px]"];

function isPlugin(project: WorkProject) {
    return (
        project.sitename?.toLowerCase().includes("plugin") ||
        project.permalink?.toLowerCase().includes("plugin") ||
        project.technologies?.some((t) => t.toLowerCase().includes("plugin"))
    );
}

function pickProjects(projects: WorkProject[]) {
    return projects.filter((p) => !isPlugin(p)).slice(0, CARD_COUNT);
}

export function SelectedWork() {
    // Fallback data renders on the server so the cards and links are in the initial HTML.
    const [projects, setProjects] = useState<WorkProject[]>(() => pickProjects(FALLBACK_PROJECTS));

    useEffect(() => {
        let cancelled = false;
        fetch("/api/projects?featured=true")
            .then((res) => res.json())
            .then((data) => {
                if (cancelled || !data.success || !Array.isArray(data.projects)) return;
                const picked = pickProjects(data.projects);
                if (picked.length) setProjects(picked);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <section
            id="selected-work"
            className="bg-brand-ink text-white rounded-t-[40px] px-4 sm:px-6 lg:px-10 pt-24 sm:pt-32 lg:pt-40 pb-32 lg:pb-40"
        >
            <div className="mx-auto max-w-[1360px]">
                <div className="motion-reveal flex flex-wrap items-end justify-between gap-8 mb-16 lg:mb-20">
                    <div className="flex flex-col gap-5">
                        <p className="m-0 font-mono text-[13px] tracking-[0.08em] uppercase text-slate-400">(02) — Selected work</p>
                        <h2 data-inview className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-[clamp(44px,6.4vw,104px)]">
                            <SplitText lines={["Built to", "perform."]} />
                        </h2>
                    </div>
                    <Link
                        href="/mywork"
                        className="motion-btn motion-magnetic inline-flex items-center gap-2.5 min-h-[52px] px-6 rounded-full border border-white/25 hover:border-white/60 font-semibold"
                    >
                        All 50+ projects <span className="motion-arrow" aria-hidden="true">→</span>
                    </Link>
                </div>

                <div className="flex flex-col gap-10">
                    {projects.map((project, i) => {
                        const skin = SKINS[i % SKINS.length];
                        const isLast = i === projects.length - 1;
                        return (
                            <article
                                key={project.permalink}
                                data-cursor="view"
                                className={`motion-card ${isLast ? "" : "motion-recede"} sticky ${STICKY_TOPS[i % STICKY_TOPS.length]} ${skin.card} rounded-[28px] p-6 sm:p-8 lg:p-11 flex flex-wrap gap-10 min-h-[560px]`}
                            >
                                {/* Whole-card click target (kept separate from the animated button) */}
                                <Link
                                    href={`/mywork/${project.permalink}`}
                                    aria-hidden="true"
                                    tabIndex={-1}
                                    className="absolute inset-0 z-[1] rounded-[inherit]"
                                />
                                <div className="flex-[1_1_340px] flex flex-col justify-between gap-8">
                                    <div className="flex flex-col gap-4">
                                        <span className={`font-mono text-[13px] ${skin.label}`}>
                                            {String(i + 1).padStart(2, "0")}
                                            {project.category ? ` / ${project.category}` : ""}
                                        </span>
                                        <h3 className="m-0 font-extrabold tracking-[-0.04em] leading-none text-[clamp(32px,3.4vw,52px)]">
                                            {project.sitename}
                                        </h3>
                                        <p className={`m-0 max-w-[440px] text-[17px] leading-relaxed ${skin.muted}`}>
                                            {project.description}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-6">
                                        <ul className="m-0 p-0 list-none flex flex-wrap gap-2">
                                            {project.technologies?.slice(0, 4).map((tech) => (
                                                <li key={tech} className={`font-mono text-xs px-3 py-1.5 rounded-full border ${skin.chip}`}>
                                                    {tech}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            href={`/mywork/${project.permalink}`}
                                            className="motion-btn relative z-[2] inline-flex items-center gap-2.5 min-h-[44px] font-bold self-start"
                                        >
                                            View case study <span className="sr-only">: {project.sitename}</span>
                                            <span className="motion-arrow" aria-hidden="true">→</span>
                                        </Link>
                                    </div>
                                </div>
                                <div className={`flex-[1.4_1_420px] rounded-[18px] overflow-hidden min-h-[380px] flex flex-col ${skin.frame}`}>
                                    <div className={`flex gap-1.5 px-4 py-3.5 ${skin.bar}`} aria-hidden="true">
                                        <span className={`h-2.5 w-2.5 rounded-full ${skin.dot}`} />
                                        <span className={`h-2.5 w-2.5 rounded-full ${skin.dot}`} />
                                        <span className={`h-2.5 w-2.5 rounded-full ${skin.dot}`} />
                                    </div>
                                    <div className="relative flex-1 overflow-hidden">
                                        <Image
                                            src={resolveValidImageSrc(project.image)}
                                            alt={`${project.sitename} screenshot`}
                                            fill
                                            sizes="(min-width: 1024px) 760px, 100vw"
                                            className="motion-shot motion-parallax object-cover object-left-top"
                                            unoptimized={!canOptimizeImage(resolveValidImageSrc(project.image))}
                                        />
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
