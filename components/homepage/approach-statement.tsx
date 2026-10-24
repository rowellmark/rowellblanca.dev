const LINES = [
    { text: "I design the architecture first,", cls: "motion-l1" },
    { text: "ship clean, typed code second,", cls: "motion-l2" },
    { text: "and obsess over the milliseconds", cls: "motion-l3" },
    { text: "your users never notice —", cls: "motion-l4" },
    { text: "because they never", cls: "motion-l5 text-brand-slate" },
    { text: "have to wait.", cls: "motion-l6 text-brand-slate" },
];

// Each phrase scrubs from dim to full opacity with scroll position.
export function ApproachStatement() {
    return (
        <section className="px-4 sm:px-6 lg:px-10 py-24 sm:py-36 lg:py-48">
            <div className="mx-auto max-w-[1360px] flex flex-wrap gap-12">
                <h2 className="motion-reveal m-0 flex-[1_1_200px] font-mono text-[13px] font-normal tracking-[0.08em] uppercase text-brand-slate">
                    (01) — Approach
                </h2>
                <p className="m-0 flex-[999_1_640px] font-bold tracking-[-0.035em] leading-[1.1] text-[clamp(32px,4.4vw,68px)] text-brand-navy">
                    {LINES.map((line) => (
                        <span key={line.text} className={`motion-lit ${line.cls}`}>
                            {line.text}{" "}
                        </span>
                    ))}
                </p>
            </div>
        </section>
    );
}
