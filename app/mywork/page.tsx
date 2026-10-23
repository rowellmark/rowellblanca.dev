import { Metadata } from "next";
import { FlagshipSpotlight } from "@/components/mywork/flagship-spotlight";
import { MyWork } from "@/components/homepage/my-work";
import { ProjectEstimator } from "@/components/homepage/project-estimator";
import { EngagementModels } from "@/components/homepage/engagement-models";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
    title: "My Work & Engineering Portfolio — Rowell Mark Blanca",
    description: "Explore 50+ production full-stack builds, Next.js web apps, serverless PostgreSQL architectures, and custom WordPress engines by Rowell Mark Blanca.",
};

export default function MyWorkPage() {
    return (
        <div className="bg-brand-bg min-h-screen">
            <PageHero
                label="Engineering portfolio & client builds"
                titleLines={["Selected work", "& client builds."]}
                accentLine={1}
                lead="Explore 50+ production full-stack builds, Next.js web apps, serverless PostgreSQL architectures, and custom WordPress engines."
            />

            <div className="px-4 sm:px-6 lg:px-10 pt-20 lg:pt-28">
                <div className="mx-auto max-w-[1360px]">
                    {/* Flagship Case Studies Spotlight */}
                    <FlagshipSpotlight />
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
