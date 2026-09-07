import { Metadata } from "next";
import { FlagshipSpotlight } from "@/components/mywork/flagship-spotlight";
import { MyWork } from "@/components/homepage/my-work";
import { ProjectEstimator } from "@/components/homepage/project-estimator";
import { EngagementModels } from "@/components/homepage/engagement-models";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import Banner from "@/components/banner/banner";

export const metadata: Metadata = {
    title: "My Work & Engineering Portfolio — Rowell Mark Blanca",
    description: "Explore 50+ production full-stack builds, Next.js web apps, serverless PostgreSQL architectures, and custom WordPress engines by Rowell Mark Blanca.",
};

export default function MyWorkPage() {
    return (
        <div className="bg-brand-bg min-h-screen">
            <Banner title="Selected Work" subtitle="Engineering Portfolio & Client Builds" />
            
            <div className="py-12">
                <div className="container mx-auto px-6 max-w-6xl">
                    {/* Back to Home Link */}
                    <div className="flex items-start pb-6">
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 uppercase font-extrabold text-xs tracking-wider rounded-xl bg-white border border-slate-200 text-[#0b1a30] hover:border-amber-400 transition-all shadow-2xs hover:shadow-xs"
                        >
                            <IconArrowLeft className="mr-2 h-4 w-4 text-amber-500" /> Back to Home
                        </Link>
                    </div>

                    {/* Flagship Case Studies Spotlight */}
                    <FlagshipSpotlight />

                    {/* Searchable Full Project Directory with Live Filter HUD */}
                    <MyWork notitle="true" />
                </div>
            </div>

            {/* Interactive Scope & Architecture Estimator */}
            <div id="project-estimator" className="border-t border-slate-200 bg-white">
                <ProjectEstimator />
            </div>

            {/* Transparent Engagement Models */}
            <EngagementModels />
        </div>
    );
}
