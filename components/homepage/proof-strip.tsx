const PROOF = [
    { value: "98+", label: "Core Web Vitals performance guarantee" },
    { value: "50+", label: "Projects shipped across WordPress & Next.js" },
    { value: "30d", label: "Post-launch warranty & bug-free handover" },
    { value: "3 TZ", label: "UK (GMT), US & Australian (AEST) overlap" },
];

export function ProofStrip() {
    return (
        <section aria-label="Guarantees" className="px-4 sm:px-6 lg:px-10 py-24 lg:py-40">
            <dl className="mx-auto max-w-[1360px] m-0 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] border-t border-brand-border">
                {PROOF.map((item) => (
                    <div
                        key={item.value}
                        className="motion-reveal flex flex-col-reverse gap-3 py-10 pr-8 border-b sm:border-b-0 sm:border-r last:border-r-0 border-brand-border sm:[&:not(:first-child)]:pl-8"
                    >
                        <dt className="text-brand-slate text-base leading-normal">{item.label}</dt>
                        <dd className="m-0 font-extrabold tracking-[-0.05em] leading-none text-brand-navy text-[clamp(56px,6vw,96px)]">
                            {item.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
