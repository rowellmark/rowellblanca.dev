import React from "react";
import {
    siNextdotjs,
    siReact,
    siTypescript,
    siNodedotjs,
    siPrisma,
    siPostgresql,
    siNeon,
    siWordpress,
    siPhp,
    siTailwindcss,
    siVercel,
    siMysql,
    siJavascript,
    siGit,
    siSass,
    siGithub,
    type SimpleIcon,
} from "simple-icons";
import { AnimatedLogo } from "@/components/ui/animated-logo";

// Orbits from the core outwards: diameter (% of the galaxy), seconds per lap, direction.
const ORBITS: { size: number; duration: number; reverse?: boolean; icons: SimpleIcon[] }[] = [
    { size: 40, duration: 28, icons: [siReact, siNextdotjs, siTypescript, siNodedotjs] },
    { size: 68, duration: 44, reverse: true, icons: [siWordpress, siPhp, siTailwindcss, siPrisma, siPostgresql, siGithub] },
    { size: 96, duration: 64, icons: [siVercel, siMysql, siNeon, siJavascript, siGit, siSass] },
];

// Dark brand marks (Next.js, Vercel, MySQL, PHP…) get lost on the dark sky; draw those white.
export function iconFill(hex: string) {
    const n = parseInt(hex, 16);
    const lum = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
    return lum < 0.5 ? "#FFFFFF" : `#${hex}`;
}

// Fixed star positions so server and client markup match.
const STARS = [
    [8, 14, 2], [22, 6, 1], [41, 11, 1], [63, 4, 2], [86, 12, 1], [95, 30, 1], [4, 44, 1], [12, 72, 2],
    [27, 90, 1], [49, 96, 1], [70, 88, 2], [91, 76, 1], [97, 55, 2], [79, 22, 1], [17, 33, 1], [58, 80, 1],
];

/**
 * Rotating "galaxy" of the tech stack: logo core, three counter-rotating orbits of brand marks.
 * `decorative` renders it as a hidden-from-assistive-tech backdrop (homepage hero) with no hover effects.
 */
export function TechGalaxy({ className = "", decorative = false }: { className?: string; decorative?: boolean }) {
    const all = ORBITS.flatMap((o) => o.icons.map((i) => i.title));
    return (
        <figure
            aria-hidden={decorative || undefined}
            className={`relative m-0 aspect-square w-full ${decorative ? "pointer-events-none select-none" : "motion-galaxy"} ${className}`}
        >
            {!decorative && <figcaption className="sr-only">Tech stack: {all.join(", ")}</figcaption>}

            {/* Nebula glow + stars */}
            {/* Gradients rather than blur() filters: same glow, no per-frame filter cost behind the orbits */}
            <div aria-hidden="true" className="absolute inset-[4%] rounded-full bg-[radial-gradient(closest-side,rgba(245,158,11,0.22),transparent)]" />
            <div aria-hidden="true" className="absolute inset-[24%] rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.2),transparent)]" />
            {STARS.map(([x, y, s], i) => (
                <span
                    key={i}
                    aria-hidden="true"
                    className="motion-twinkle absolute rounded-full bg-white"
                    style={{ left: `${x}%`, top: `${y}%`, width: s * 2, height: s * 2, animationDelay: `${(i % 6) * -0.7}s` }}
                />
            ))}

            {ORBITS.map((orbit, o) => (
                <div
                    key={o}
                    aria-hidden="true"
                    className={`motion-orbit absolute rounded-full border border-white/10 [will-change:rotate] ${orbit.reverse ? "motion-orbit-reverse" : ""}`}
                    style={{
                        width: `${orbit.size}%`,
                        height: `${orbit.size}%`,
                        left: `${(100 - orbit.size) / 2}%`,
                        top: `${(100 - orbit.size) / 2}%`,
                        animationDuration: `${orbit.duration}s`,
                    }}
                >
                    {orbit.icons.map((icon, i) => {
                        const angle = (i / orbit.icons.length) * Math.PI * 2 + o * 0.6;
                        return (
                            <span
                                key={icon.slug}
                                className="absolute -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${50 + 50 * Math.cos(angle)}%`, top: `${50 + 50 * Math.sin(angle)}%` }}
                            >
                                {/* Counter-rotates at the same speed so each mark stays upright. */}
                                <span
                                    title={icon.title}
                                    className={`motion-orbit ${orbit.reverse ? "" : "motion-orbit-reverse"} [will-change:rotate] grid place-items-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-brand-ink-2 border border-white/10 ${
                                        decorative ? "" : "shadow-[0_10px_30px_-10px_rgba(0,0,0,0.9)] transition-[border-color,scale] duration-500 hover:border-amber-400/70 hover:scale-110"
                                    }`}
                                    style={{ animationDuration: `${orbit.duration}s` }}
                                >
                                    <svg viewBox="0 0 24 24" className="h-[50%] w-[50%]" fill={iconFill(icon.hex)}>
                                        <path d={icon.path} />
                                    </svg>
                                </span>
                            </span>
                        );
                    })}
                </div>
            ))}

            {/* Core (omitted as a backdrop, where it would peek out from behind the page content) */}
            {!decorative && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center h-[22%] w-[22%] rounded-full bg-brand-ink border border-white/15 shadow-[0_0_0_10px_rgba(245,158,11,0.06),0_0_80px_10px_rgba(245,158,11,0.25)]">
                <AnimatedLogo className="h-[58%] w-[58%]" title="Rowell Mark Blanca" tone="dark" />
            </div>}
        </figure>
    );
}
