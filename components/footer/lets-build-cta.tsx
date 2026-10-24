'use client';

import React, { useState } from 'react';
import { ContactModal } from '@/components/ui/contact-modal';
import { SplitText } from '@/components/ui/split-text';

const VALUE_PROPS = [
    'Over 12 years of hands-on full-stack development experience',
    'Expertise across React, Next.js, Node.js, and WordPress custom plugins',
    'Proven track record with top-rated client reviews & 100% job success rate',
    'Seamless communication, fast response times, and ongoing post-launch support',
];

// Site-wide closing call to action (top of the footer): merges the old
// "Let's build." footer banner with the homepage "Have a project in mind?" section.
export function LetsBuildCta() {
    const [modal, setModal] = useState<{ open: boolean; tab: 'inquiry' | 'call' }>({ open: false, tab: 'inquiry' });

    return (
        <section aria-labelledby="lets-build-title" className="mx-auto px-4 sm:px-6 lg:px-10 max-w-[1360px] pt-24 sm:pt-32 lg:pt-40 pb-20 lg:pb-24">
            <h2 id="lets-build-title" className="m-0 flex flex-col gap-6">
                <span className="motion-reveal font-mono text-[13px] font-normal tracking-[0.08em] uppercase text-slate-400">
                    Have a project in mind?
                </span>
                <span data-inview className="motion-scale-in block text-white font-extrabold tracking-[-0.06em] leading-[0.86] text-[clamp(64px,13vw,220px)]">
                    <SplitText lines={['Let\u2019s build']} suffix={<span className="text-amber-500">.</span>} stagger={45} />
                </span>
            </h2>

            <div className="mt-14 lg:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                {/* Pitch */}
                <div className="motion-reveal lg:col-span-6 flex flex-col gap-8">
                    <p className="m-0 text-[clamp(18px,1.6vw,22px)] leading-relaxed text-slate-300 max-w-[560px]">
                        Whether you need a modern web application, custom WordPress architecture, or an automated workflow
                        integration — I&rsquo;m here to turn your vision into a scalable, high-converting digital product.
                    </p>
                    <ul className="m-0 p-0 list-none flex flex-col border-t border-white/10">
                        {VALUE_PROPS.map((prop) => (
                            <li key={prop} className="flex gap-4 py-4 border-b border-white/10 text-[15px] text-slate-300">
                                <span aria-hidden="true" className="text-amber-500">—</span>
                                {prop}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Direct inquiry card */}
                <div className="motion-reveal lg:col-span-6 rounded-[28px] bg-brand-ink-2 border border-white/[0.08] p-7 sm:p-10 flex flex-col gap-8">
                    <div className="flex items-center justify-between gap-4">
                        <span className="font-mono text-xs uppercase tracking-[0.08em] text-slate-400">Direct inquiry</span>
                        <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-emerald-400">
                            <span className="motion-pulse h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                            Open for new work
                        </span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="m-0 text-white text-[clamp(24px,2.4vw,32px)] font-extrabold tracking-[-0.03em] leading-tight">
                            Fast turnaround &amp; dedicated support
                        </h3>
                        <p className="m-0 text-slate-400">
                            Open for new projects, custom feature development, and long-term retainer engagements.
                        </p>
                    </div>

                    <dl className="m-0 grid grid-cols-2 gap-px rounded-2xl overflow-hidden bg-white/10">
                        <div className="bg-brand-ink-2 p-5 flex flex-col-reverse gap-1">
                            <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">Response time</dt>
                            <dd className="m-0 text-white text-lg font-extrabold">Under 24 hours</dd>
                        </div>
                        <div className="bg-brand-ink-2 p-5 flex flex-col-reverse gap-1">
                            <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">Timezones</dt>
                            <dd className="m-0 text-white text-lg font-extrabold">UK · US · AU</dd>
                        </div>
                    </dl>

                    <div className="flex flex-col gap-3">
                        <button
                            type="button"
                            onClick={() => setModal({ open: true, tab: 'inquiry' })}
                            className="motion-btn motion-magnetic w-full min-h-[60px] px-7 rounded-full bg-amber-500 hover:bg-amber-400 text-brand-ink font-bold text-base flex items-center justify-between gap-3 cursor-pointer"
                        >
                            Send a message or request a quote <span className="motion-arrow" aria-hidden="true">→</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setModal({ open: true, tab: 'call' })}
                            className="motion-btn motion-magnetic w-full min-h-[60px] px-7 rounded-full border border-white/25 hover:border-white/60 text-white font-semibold text-base flex items-center justify-between gap-3 cursor-pointer"
                        >
                            Book a discovery call <span className="motion-arrow" aria-hidden="true">→</span>
                        </button>
                    </div>

                    <a
                        href="mailto:hello@rowellblanca.dev"
                        className="group flex items-center justify-between gap-4 pt-6 border-t border-white/10 text-white"
                    >
                        <span className="flex flex-col gap-1">
                            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">Or email directly</span>
                            <span className="motion-underline self-start text-[clamp(18px,1.8vw,24px)] font-semibold tracking-[-0.02em]">
                                hello@rowellblanca.dev
                            </span>
                        </span>
                        <span aria-hidden="true" className="h-12 w-12 shrink-0 rounded-full border border-white/15 flex items-center justify-center transition-transform duration-500 group-hover:-rotate-45">
                            →
                        </span>
                    </a>
                </div>
            </div>

            <ContactModal isOpen={modal.open} onClose={() => setModal({ ...modal, open: false })} initialTab={modal.tab} />
        </section>
    );
}
