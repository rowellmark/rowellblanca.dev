import React from 'react';
import {
    siNextdotjs,
    siReact,
    siTypescript,
    siNodedotjs,
    siWordpress,
    siPhp,
    siTailwindcss,
    siPostgresql,
    siPrisma,
    siVercel,
    siGit,
    siMysql,
    type SimpleIcon,
} from 'simple-icons';
import { iconFill } from '@/components/homepage/tech-galaxy';

// x / y: position in % of the container; size in px; float: seconds per drift loop.
type Spot = { icon: SimpleIcon; x: number; y: number; size: number; float: number; m?: [number, number] };

// Spots hug the edges and the right-hand side so they stay clear of headings and copy.
// Only spots with `m` (their phone position, in %) show on phones, where text spans the full
// width; those positions sit in the open space above the section's heading.
const LAYOUTS: Record<'cta' | 'lost', Spot[]> = {
    cta: [
        { icon: siNextdotjs, x: 88, y: 9, size: 64, float: 11, m: [84, 3] },
        { icon: siReact, x: 72, y: 20, size: 52, float: 13, m: [40, 3] },
        { icon: siWordpress, x: 94, y: 33, size: 56, float: 15 },
        { icon: siTypescript, x: 80, y: 44, size: 44, float: 12 },
        { icon: siPostgresql, x: 62, y: 8, size: 42, float: 14 },
        { icon: siTailwindcss, x: 96, y: 58, size: 44, float: 10, m: [62, 2.5] },
        { icon: siPhp, x: 34, y: 95, size: 44, float: 16 },
        { icon: siNodedotjs, x: 4, y: 94, size: 40, float: 12 },
        { icon: siVercel, x: 52, y: 92, size: 38, float: 14 },
    ],
    lost: [
        { icon: siNextdotjs, x: 12, y: 18, size: 60, float: 12, m: [14, 14] },
        { icon: siReact, x: 84, y: 14, size: 56, float: 14, m: [84, 16] },
        { icon: siWordpress, x: 90, y: 66, size: 64, float: 16, m: [86, 82] },
        { icon: siTypescript, x: 8, y: 72, size: 46, float: 11, m: [12, 80] },
        { icon: siPostgresql, x: 26, y: 88, size: 44, float: 13, m: [30, 92] },
        { icon: siPrisma, x: 70, y: 88, size: 42, float: 15, m: [66, 94] },
        { icon: siPhp, x: 72, y: 34, size: 40, float: 10 },
        { icon: siGit, x: 22, y: 42, size: 38, float: 14 },
        { icon: siMysql, x: 50, y: 8, size: 44, float: 12 },
        { icon: siTailwindcss, x: 46, y: 94, size: 36, float: 11 },
    ],
};

/**
 * Decorative tech-stack logos drifting slowly behind a dark section. Each logo
 * floats on its own loop; in browsers with scroll timelines they also gather in
 * from the centre as the section scrolls into view. Static under reduced motion.
 * The parent must be `relative` (and usually `overflow-hidden`).
 */
export function FloatingStack({ layout = 'cta', className = '' }: { layout?: keyof typeof LAYOUTS; className?: string }) {
    return (
        <div aria-hidden="true" className={`opacity-[0.55] max-lg:opacity-30 pointer-events-none select-none absolute inset-0 overflow-hidden ${className}`}>
            {LAYOUTS[layout].map(({ icon, x, y, size, float, m }, i) => (
                <span
                    key={icon.slug}
                    className={`motion-gather absolute -translate-x-1/2 -translate-y-1/2 left-[var(--mx)] top-[var(--my)] lg:left-[var(--x)] lg:top-[var(--y)] ${m ? "" : "max-lg:hidden"}`}
                    style={{
                        ['--x' as string]: `${x}%`,
                        ['--y' as string]: `${y}%`,
                        ['--mx' as string]: `${m?.[0] ?? x}%`,
                        ['--my' as string]: `${m?.[1] ?? y}%`,
                        ['--gx' as string]: `${(50 - x) * 3}px`,
                        ['--gy' as string]: `${(50 - y) * 2}px`,
                    }}
                >
                    <span
                        className="motion-drift grid place-items-center rounded-full bg-brand-ink-2 border border-white/10 h-[var(--sm)] w-[var(--sm)] lg:h-[var(--s)] lg:w-[var(--s)]"
                        style={{
                            ['--s' as string]: `${size}px`,
                            ['--sm' as string]: `${Math.round(size * 0.72)}px`,
                            animationDuration: `${float}s`,
                            animationDelay: `${-i * 1.7}s`,
                        }}
                    >
                        <svg viewBox="0 0 24 24" className="h-[46%] w-[46%]" fill={iconFill(icon.hex)}>
                            <path d={icon.path} />
                        </svg>
                    </span>
                </span>
            ))}
        </div>
    );
}
