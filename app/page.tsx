"use client";

import { Hero } from "@/components/homepage/hero";
import { StackMarquee } from "@/components/homepage/stack-marquee";
import { ShowCasePortfolios } from "@/components/homepage/showcase-portfolios";
import { ApproachStatement } from "@/components/homepage/approach-statement";
import { SelectedWork } from "@/components/homepage/selected-work";
import { ProofStrip } from "@/components/homepage/proof-strip";
import { PluginsShowcase } from "@/components/homepage/plugins-showcase";
import { EngagementModels } from "@/components/homepage/engagement-models";
import { ProjectEstimator } from "@/components/homepage/project-estimator";
import { TestimonialsSection } from "@/components/homepage/testimonials";

export default function Home() {
  return (
    <>
      {/* 1. Hero: masked line reveal, live UK / US / AU clocks */}
      <Hero />

      {/* 2. Infinite tech-stack marquee */}
      <StackMarquee />

      {/* 3. Interactive Portfolio Showcase (parallax rows + trust panel) */}
      <ShowCasePortfolios />

      {/* 4. Approach statement, lit phrase by phrase on scroll */}
      <ApproachStatement />

      {/* 5. Selected work: sticky stacking case-study cards */}
      <SelectedWork />

      {/* 6. Guarantees */}
      <ProofStrip />

      {/* 7. WordPress plugins (BuildForUser SEO, Login Customizer) */}
      <PluginsShowcase />

      {/* 8. Engagement Models & Retainer Framework */}
      <EngagementModels />

      {/* 9. Interactive Project Scope & Budget Estimator */}
      <div id="project-estimator">
        <ProjectEstimator />
      </div>

      {/* 10. Client Reviews & Social Proof */}
      <TestimonialsSection
        badge="(06) — Client feedback & proof"
        title="Trusted by the people who ship with me."
      />
    </>
  );
}
