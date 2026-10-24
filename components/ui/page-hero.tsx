import React from 'react';

interface PageHeroProps {
    /** Small mono label above the headline. */
    label: string;
    /** Headline lines; each renders on its own line and rises in on load. */
    titleLines: string[];
    /** Index of the line to colour amber (optional). */
    accentLine?: number;
    lead?: React.ReactNode;
    /** Search, filters or stats rendered under a hairline. */
    children?: React.ReactNode;
}

// Shared dark editorial hero for inner pages (My Work, Case Studies, Blog,
// Arcade), matching the homepage's type scale and motion.
export function PageHero({ label, titleLines, accentLine, lead, children }: PageHeroProps) {
    return (
        <section className="bg-brand-ink text-white px-4 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-[1360px] pt-36 lg:pt-44 pb-14 lg:pb-20 flex flex-col gap-12">
                <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
                    <div className="flex flex-col gap-6 max-w-[1100px]">
                        <span className="motion-fade motion-d1 inline-flex items-center gap-2.5 font-mono text-xs sm:text-[13px] uppercase tracking-[0.08em] text-slate-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                            {label}
                        </span>
                        {/* Same CSS line-rise as the homepage hero: runs from first paint, no flash. */}
                        <h1 className="m-0 flex flex-col font-extrabold tracking-[-0.05em] leading-[0.95] text-[clamp(40px,5.6vw,92px)]">
                            {titleLines.map((line, i) => (
                                <React.Fragment key={line}>
                                    <span className="motion-mask">
                                        <span className={`motion-rise motion-d${Math.min(i + 1, 3)} ${i === accentLine ? 'text-amber-500' : ''}`}>
                                            {line}
                                        </span>
                                    </span>
                                    {i < titleLines.length - 1 ? ' ' : null}
                                </React.Fragment>
                            ))}
                        </h1>
                    </div>
                    {lead && (
                        <p className="motion-fade motion-d4 m-0 max-w-[440px] text-[17px] leading-relaxed text-slate-300">{lead}</p>
                    )}
                </div>
                {children && <div className="motion-fade motion-d5 border-t border-white/10 pt-8">{children}</div>}
            </div>
        </section>
    );
}

/** Search field styled for the dark hero. */
export const heroSearchClass =
    'w-full min-h-[56px] pl-12 pr-4 rounded-full bg-white/[0.06] border border-white/15 text-white placeholder-slate-500 text-[15px] focus:outline-none focus:border-amber-400 focus:bg-white/[0.09] transition-colors';

/** Filter chip styled for the dark hero. */
export const heroChipClass = (active: boolean) =>
    `motion-btn min-h-[44px] px-5 rounded-full text-sm font-semibold border cursor-pointer transition-colors ${
        active ? 'bg-amber-500 text-brand-ink border-amber-500' : 'bg-transparent text-slate-300 border-white/15 hover:border-white/40 hover:text-white'
    }`;
