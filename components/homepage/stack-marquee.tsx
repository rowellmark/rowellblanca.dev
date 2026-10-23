const STACK = [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "Prisma",
    "NeonDB",
    "WordPress",
    "PHP",
    "Custom Gutenberg Blocks",
];

function StackRun({ hidden }: { hidden?: boolean }) {
    return (
        <>
            {STACK.map((item) => (
                <span key={item} className="flex items-center gap-16 pr-16" aria-hidden={hidden || undefined}>
                    <span>{item}</span>
                    <span aria-hidden="true">✦</span>
                </span>
            ))}
        </>
    );
}

// Infinite tech-stack band; the second run is a visual duplicate for the loop.
export function StackMarquee() {
    return (
        <section aria-label="Tech stack" className="motion-marquee overflow-hidden bg-amber-500 text-brand-ink py-6">
            <div className="motion-velocity-skew">
                <div className="motion-marquee-track whitespace-nowrap font-extrabold tracking-[-0.03em] text-[clamp(24px,3vw,40px)]">
                    <StackRun />
                    <StackRun hidden />
                </div>
            </div>
        </section>
    );
}
