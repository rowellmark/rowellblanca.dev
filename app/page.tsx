
import { FeaturedProject } from "@/components/homepage/featured-project";
import { Hero } from "@/components/homepage/hero";
import { WelcomeLoading } from "@/components/homepage/loading-screen";
import { ShowCasePortfolios } from "@/components/homepage/showcase-portfolios";
import Contact from "@/components/ui/contactForm";
import Image from "next/image";

export default function Home() {
  
  return (
    <>
      <Hero />
      <ShowCasePortfolios />
      <FeaturedProject />
    </>
  );
}
