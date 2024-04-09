import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { Portfolios } from "@/components/homepage/portfolios";
import Image from "next/image";

export default function Home() {
  
  return (
    <>
      <Header /> 
        <Portfolios />
      <Footer/>
    </>
  );
}
