"use client";
import React from "react";
import { Boxes } from "../ui/background-boxes";
import { cn } from "@/utils/cn";
import Image from "next/image";


import rowellbanner from '@/assets/images/rowellbanner.png';

export function Hero() {
    return (
        <div className="relative w-full overflow-hidden bg-slate-800 hero pt-48">

            <div className="absolute inset-0 w-full h-full bg-slate-800 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

            <Boxes />

            <div className="hero__container flex items-center justify-center relative z-50 w-full h-full">
                <div className="hero__image flex-shrink-0 w-[38%]">
                    <Image src={rowellbanner} alt="rowell mark blanca"/>
                </div>
                <div className="hero__content w-full px-[8%]">
                    <h5 className="text-text-accent font-medium text-lg">Introduction</h5>
                    <h1 className="md:text-4xl text-xl text-white relative z-20">
                        Software Engineer,<br />
                        based in Philippines
                    </h1>
                    <p className="mt-2 text-neutral-300 relative z-20">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                    </p>
                </div>
                
            </div>
           
        </div>
    );
}