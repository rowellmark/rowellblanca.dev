import { Metadata } from "next";
import { MyWork } from "@/components/homepage/my-work";
import { LandingPagesShowcase } from "@/components/homepage/landing-pages-showcase";
import { BlogAiAssistant } from "@/components/ui/blog-ai-assistant";
import { ProjectEstimator } from "@/components/homepage/project-estimator";
import { EngagementModels } from "@/components/homepage/engagement-models";
import { SpeedRacerGame } from "@/components/interactive/speed-racer-game";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import Banner from "@/components/banner/banner";

export const metadata: Metadata = {
    title: "My Work & Projects Portfolio",
    description: "Explore selected full-stack projects, React web apps, custom WordPress plugins, and digital builds by Rowell Mark Blanca.",
};

export default function MyWorkPage() {
    return (
        <div className="bg-brand-bg min-h-screen">
            <Banner title="Selected Work" subtitle="Portfolio" />
            <div className="py-12">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="flex items-start pb-6">
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 uppercase font-extrabold text-xs tracking-wider rounded-xl bg-white border border-slate-200 text-brand-navy hover:border-brand-amber transition-all shadow-xs hover:shadow-sm"
                        >
                            <IconArrowLeft className="mr-2 h-4 w-4 text-brand-amber" /> Back to Home
                        </Link>
                    </div>
                    <MyWork notitle="true" />

                    {/* RowBot AI Assistant Section */}
                    <div className="mt-16">
                        <BlogAiAssistant
                            title="Selected Portfolio Projects & Engineering Architecture"
                            category="Full-Stack Portfolio"
                            technologies={["React / Next.js 14", "Custom WordPress", "Prisma & NeonDB", "AI & LLM Integration"]}
                            description="Interactive AI Assistant for exploring Rowell Mark Blanca's project portfolio, full-stack architecture, UK client builds, and custom engineering capabilities."
                        />
                    </div>
                </div>
            </div>
            <LandingPagesShowcase />

            {/* Interactive Scope & Architecture Estimator */}
            <div id="project-estimator" className="border-t border-slate-200">
                <ProjectEstimator />
            </div>

            {/* Transparent Engagement Models */}
            <EngagementModels />

            {/* Interactive Speed Racer Game */}
            <SpeedRacerGame />
        </div>
    );
}
