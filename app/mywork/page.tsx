import { Metadata } from "next";
import { FlagshipSpotlight } from "@/components/mywork/flagship-spotlight";
import { sortFlagship } from "@/lib/flagship";
import { prisma } from "@/lib/prisma";
import { FALLBACK_PROJECTS } from "@/lib/fallback-projects";
import { MyWork } from "@/components/homepage/my-work";
import { ProjectEstimator } from "@/components/homepage/project-estimator";
import { EngagementModels } from "@/components/homepage/engagement-models";
import { PageHero } from "@/components/ui/page-hero";
import { pageMetadata } from '@/lib/seo';
import Link from "next/link";
import { STACKS } from "@/lib/stacks";
import { StackIcon } from "@/components/work/stack-icon";
import { heroChipClass } from "@/components/ui/page-hero";

export const metadata: Metadata = pageMetadata({
  path: "/mywork",
  title: "Portfolio: Next.js & WordPress Projects",
  description:
    "Client builds by Rowell Mark Blanca: Next.js web apps, FCA-regulated finance portals, custom WordPress sites and plugins, with live links and case studies.",
  keywords: ["Next.js portfolio", "WordPress developer portfolio", "web developer portfolio UK", "case studies"],
});

// Re-render at most hourly so admin project edits show up without a redeploy.
export const revalidate = 3600;

async function getFlagshipProjects() {
    try {
        const rows = await prisma.project.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } });
        if (rows.length > 0) return sortFlagship(rows).slice(0, 2);
    } catch {
        // DB unreachable: fall back to the bundled dataset (same as /api/projects).
    }
    return sortFlagship(FALLBACK_PROJECTS as any[]).slice(0, 2);
}

export default async function MyWorkPage() {
    const flagship = await getFlagshipProjects();
    return (
        <div className="bg-brand-bg min-h-screen">
            <PageHero
                label="Engineering portfolio & client builds"
                titleLines={["Selected work", "& client builds."]}
                accentLine={1}
                lead="Explore 50+ production full-stack builds, Next.js web apps, serverless PostgreSQL architectures, and custom WordPress engines."
            >
                <nav aria-label="Browse by tech stack" className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-slate-400 mr-2">Browse by stack</span>
                    {STACKS.map((s) => (
                        <Link key={s.slug} href={`/work/${s.slug}`} className={`${heroChipClass(false)} inline-flex items-center gap-2`}>
                            <StackIcon icon={s.icon} className="h-4 w-4" />
                            {s.name}
                        </Link>
                    ))}
                    <Link href="/results" className="motion-underline ml-auto font-semibold text-amber-400 inline-flex items-center min-h-[44px]">
                        See the results →
                    </Link>
                </nav>
            </PageHero>

            <div className="px-4 sm:px-6 lg:px-10 pt-20 lg:pt-28">
                <div className="mx-auto max-w-[1360px]">
                    {/* Flagship Case Studies Spotlight */}
                    <FlagshipSpotlight initialProjects={flagship} />
                </div>
            </div>

            {/* Searchable Full Project Directory with Live Filter HUD */}
            <MyWork notitle="true" />

            {/* Interactive Scope & Architecture Estimator */}
            <div id="project-estimator" className="border-t border-brand-border pt-24 lg:pt-32">
                <ProjectEstimator />
            </div>

            {/* Transparent Engagement Models */}
            <EngagementModels />
        </div>
    );
}
