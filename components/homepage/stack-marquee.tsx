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
    type SimpleIcon,
} from "simple-icons";

// Official brand marks (simple-icons, CC0), drawn in one ink colour on the amber band.
const STACK: SimpleIcon[] = [
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
];

function StackRun({ hidden }: { hidden?: boolean }) {
    return (
        <ul className="m-0 p-0 list-none flex shrink-0" aria-hidden={hidden || undefined}>
            {STACK.map((icon) => (
                <li key={icon.slug} className="flex items-center gap-3 sm:gap-4 pr-12 sm:pr-16">
                    <svg
                        role="img"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-[0.9em] w-[0.9em] shrink-0 fill-current"
                    >
                        <path d={icon.path} />
                    </svg>
                    <span>{icon.title}</span>
                </li>
            ))}
        </ul>
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
