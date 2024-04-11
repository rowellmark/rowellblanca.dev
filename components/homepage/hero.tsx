"use client";
import React from "react";
import { BackgroundBeams } from "../ui/background-beams";
import Image from "next/image";
import rowellbanner from '@/assets/images/rowellbanner.png';
import PrimaryButton from "../buttons/primaryButton";

export function Hero() {
    return (
        <div className="w-full rounded-md bg-primary relative flex flex-col items-center justify-center antialiased hero pt-32  ">
            <div className="hero__container flex items-center justify-center relative z-50 w-full h-full">
                <div className="hero__image flex-shrink-0 w-[30%] ml-[8%] self-end">
                    <Image src={rowellbanner} alt="rowell mark blanca" />

                    <div className="absolute"></div>
                </div>
                <div className="hero__content w-full pl-[5%] px-[8%] pb-11">
                    <h5 className="text-text-accent font-medium text-lg uppercase">Introduction</h5>
                    <h1 className="text-white relative z-20 font-bold text-7xl">
                        Software Engineer,<br />
                        based in Philippines
                    </h1>
                    <p className="mt-2 text-neutral-300 relative z-20 leading-6 pt-6">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                    </p>
                    <PrimaryButton link="/" label="More about Me" className="mt-20" />
                    
                </div>

            </div>
            <BackgroundBeams />
        </div>
    );
}
