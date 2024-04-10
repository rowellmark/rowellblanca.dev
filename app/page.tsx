import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { FeaturedProject } from "@/components/homepage/featured-project";
import { Portfolios } from "@/components/homepage/portfolios";
import Image from "next/image";

export default function Home() {
  
  return (
    <>
      <Header /> 
        <Portfolios />
        <FeaturedProject />
      <Footer/>
    </>
  );
}
