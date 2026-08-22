"use client";

import { Hero } from "@/components/homepage/hero";
import { TrustBanner } from "@/components/homepage/trust-banner";
import { ShowCasePortfolios } from "@/components/homepage/showcase-portfolios";
import MyExpertise from "@/components/homepage/my-expertise";
import { ProjectEstimator } from "@/components/homepage/project-estimator";
import { EngagementModels } from "@/components/homepage/engagement-models";
import ContactSection from "@/components/homepage/contact-section";
import { FeaturedProject } from "@/components/homepage/featured-project";
import { MyWork } from "@/components/homepage/my-work";
import { LandingPagesShowcase } from "@/components/homepage/landing-pages-showcase";
import WorkHistory from "@/components/homepage/work-history";
import { TestimonialsSection } from "@/components/homepage/testimonials";
import { LatestArticlesSection } from "@/components/homepage/latest-articles";
import { SpeedRacerGame } from "@/components/interactive/speed-racer-game";
import { WelcomeLoading } from "@/components/loading-intro/loading-screen";

export default function Home() {
  return (
    <>
      <WelcomeLoading />
      <Hero />
      <TrustBanner />
      <ShowCasePortfolios />
      <MyExpertise />
      <FeaturedProject />
      <SpeedRacerGame />
      <MyWork notitle="" />
      <div id="project-estimator">
        <ProjectEstimator />
      </div>
      <EngagementModels />
      <LandingPagesShowcase />
      <LatestArticlesSection />
      <WorkHistory />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
