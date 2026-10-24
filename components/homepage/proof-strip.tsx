"use client";

import React, { useEffect, useRef, useState } from "react";

const PROOF = [
    { value: 98, suffix: "+", label: "Core Web Vitals performance guarantee" },
    { value: 50, suffix: "+", label: "Projects shipped across WordPress & Next.js" },
    { value: 30, suffix: "d", label: "Post-launch warranty & bug-free handover" },
    { value: 3, suffix: " TZ", label: "UK (GMT), US & Australian (AEST) overlap" },
];

const DURATION = 1400;
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

// Server HTML carries the final numbers; the count-up only runs client-side
// once the strip scrolls into view (skipped under reduced motion).
function useCountUp(target: number, armed: boolean, start: boolean) {
    const [value, setValue] = useState(target);

    // Reset to 0 while still off-screen so the count starts cleanly when it enters.
    useEffect(() => {
        if (armed && !start) setValue(0);
    }, [armed, start]);

    useEffect(() => {
        if (!start) return;
        let raf = 0;
        const t0 = performance.now();
        const tick = (now: number) => {
            const p = Math.min(1, (now - t0) / DURATION);
            setValue(Math.round(target * easeOutExpo(p)));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [start, target]);

    return value;
}

function ProofValue({ value, suffix, armed, start }: { value: number; suffix: string; armed: boolean; start: boolean }) {
    const shown = useCountUp(value, armed, start);
    return (
        <>
            <span className="tabular-nums">{shown}</span>
            {suffix}
        </>
    );
}

export function ProofStrip() {
    const ref = useRef<HTMLDListElement>(null);
    const [armed, setArmed] = useState(false);
    const [start, setStart] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const rect = el.getBoundingClientRect();
        // Already on screen at load: keep the final numbers rather than flashing back to 0.
        if (rect.top < window.innerHeight) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStart(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "0px 0px -15% 0px" }
        );
        observer.observe(el);
        setArmed(true);
        return () => observer.disconnect();
    }, []);

    return (
        <section aria-label="Guarantees" className="px-4 sm:px-6 lg:px-10 py-24 lg:py-40">
            <dl ref={ref} className="mx-auto max-w-[1360px] m-0 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] border-t border-brand-border">
                {PROOF.map((item) => (
                    <div
                        key={item.label}
                        className="motion-reveal flex flex-col-reverse gap-3 py-10 pr-8 border-b sm:border-b-0 sm:border-r last:border-r-0 border-brand-border sm:[&:not(:first-child)]:pl-8"
                    >
                        <dt className="text-brand-slate text-base leading-normal">{item.label}</dt>
                        <dd className="m-0 font-extrabold tracking-[-0.05em] leading-none text-brand-navy text-[clamp(56px,6vw,96px)]">
                            <ProofValue value={item.value} suffix={item.suffix} armed={armed} start={start} />
                        </dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
