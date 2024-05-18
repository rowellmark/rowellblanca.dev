"use client";
import ContactSection from "@/components/homepage/contact-section";
import { FeaturedProject } from "@/components/homepage/featured-project";
import { Hero } from "@/components/homepage/hero";
import { WelcomeLoading } from "@/components/loading-intro/loading-screen";
import MyExpertise from "@/components/homepage/my-expertise";
import { MyWork } from "@/components/homepage/my-work";
import { ShowCasePortfolios } from "@/components/homepage/showcase-portfolios";
import Image from "next/image";
import WorkHistory from "@/components/homepage/work-history";
import { ContactFormSection } from "@/components/footer/contact-form-section";

export default function Home() {  
  return (
    <>
      <WelcomeLoading />
      <Hero />
      <ShowCasePortfolios />
      <ContactSection />
      <MyExpertise />
      <FeaturedProject />
      <MyWork notitle=""/>
      <WorkHistory />
      <ContactFormSection />
    </>
  );
}
