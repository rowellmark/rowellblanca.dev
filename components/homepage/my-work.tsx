import { Tab } from "../ui/tabs";

interface Props {
    notitle: string;
}

const projects_tab: string[] = ["All", "Wordpress", "Wordpress Plugins", "React/Nextjs", "Prisma", "NeonDB"];

export function MyWork({ notitle }: Props) {
    return (
        <section className={`py-24 ${notitle ? "bg-brand-bg" : "bg-[#F8FAFC] border-t border-slate-200"}`}>
            <div className="container mx-auto max-w-6xl px-6">
                {!notitle && (
                    <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-amber bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                            Portfolio Showcase
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-navy tracking-tight">
                            React, Next.js & WordPress Projects
                        </h2>
                        <p className="text-base text-brand-slate">
                            A curated selection of production builds — from custom WordPress platforms and plugin development to full-stack React and Next.js applications backed by Prisma and NeonDB.
                        </p>
                    </div>
                )}
                <Tab nav={projects_tab} />
            </div>
        </section>
    );
}