"use client";

import { Hero } from "@/components/homepage/hero";
import { StatsBar } from "@/components/homepage/stats-bar";
import { ShowCasePortfolios } from "@/components/homepage/showcase-portfolios";
import MyExpertise from "@/components/homepage/my-expertise";
import ContactSection from "@/components/homepage/contact-section";
import { FeaturedProject } from "@/components/homepage/featured-project";
import { MyWork } from "@/components/homepage/my-work";
import WorkHistory from "@/components/homepage/work-history";
import { TestimonialsSection } from "@/components/homepage/testimonials";
import { ContactFormSection } from "@/components/footer/contact-form-section";
import { WelcomeLoading } from "@/components/loading-intro/loading-screen";

export default function Home() {
  return (
    <>
      <WelcomeLoading />
      <Hero />
      <StatsBar />
      <ShowCasePortfolios />
      <MyExpertise />
      <FeaturedProject />
      <MyWork notitle="" />
      <WorkHistory />
      <TestimonialsSection />
      <ContactSection />
      <ContactFormSection />
    </>
  );
}
