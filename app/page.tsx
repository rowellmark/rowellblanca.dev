"use client";

import { Hero } from "@/components/homepage/hero";
import { ShowCasePortfolios } from "@/components/homepage/showcase-portfolios";
import { ArchitectureInspector } from "@/components/homepage/architecture-inspector";
import { RefactorBenchmark } from "@/components/homepage/refactor-benchmark";
import { FeaturedProject } from "@/components/homepage/featured-project";
import { FlagshipWork } from "@/components/homepage/flagship-work";
import { ProjectEstimator } from "@/components/homepage/project-estimator";
import { EngagementModels } from "@/components/homepage/engagement-models";
import { TestimonialsSection } from "@/components/homepage/testimonials";
import ContactSection from "@/components/homepage/contact-section";

export default function Home() {
  return (
    <>
      {/* 1. Hero with Developer Telemetry & Timezone HUD */}
      <Hero />

      {/* 2. Unified Trust Banner & Interactive Portfolio Showcase */}
      <ShowCasePortfolios />

      {/* 3. Interactive System Architecture & Request Flow Blueprint */}
      <ArchitectureInspector />

      {/* 4. Interactive Before & After Performance & Code Benchmark */}
      <RefactorBenchmark />

      {/* 5. In-Depth Case Study Spotlight (MacManus Finance) */}
      <FeaturedProject />

      {/* 6. Top 5 Flagship Engineering Builds & View More */}
      <FlagshipWork />

      {/* 7. Interactive Project Scope & Budget Estimator */}
      <div id="project-estimator">
        <ProjectEstimator />
      </div>

      {/* 8. Engagement Models & Retainer Framework */}
      <EngagementModels />

      {/* 9. Client Reviews & Social Proof */}
      <TestimonialsSection />

      {/* 10. Direct Contact & Discovery Call Scheduling */}
      <ContactSection />
    </>
  );
}
