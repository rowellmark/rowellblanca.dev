"use client";

import React, { useState, useEffect } from "react";

import ContactSection from "@/components/homepage/contact-section";
import { FeaturedProject } from "@/components/homepage/featured-project";
import { Hero } from "@/components/homepage/hero";
import { WelcomeLoading } from "@/components/loading-intro/loading-screen";
import MyExpertise from "@/components/homepage/my-expertise";
import { MyWork } from "@/components/homepage/my-work";
import { ShowCasePortfolios } from "@/components/homepage/showcase-portfolios";
import Contact from "@/components/ui/contactForm";
import Image from "next/image";

export default function Home() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setLoading(true);
    }, 2000);

    // Clear the timeouts to avoid memory leaks
    return () => {
      clearTimeout(loadingTimeout);
    };

    
  }, []);
  return (
    <>
      
      {/* <WelcomeLoading /> */}
      <Hero />
      <ShowCasePortfolios />
      <ContactSection />
      <MyExpertise />
      <FeaturedProject />
      <MyWork/>
    </>
  );
}
