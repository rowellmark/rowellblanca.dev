"use client";
import React from "react";
import { BackgroundBeams } from "../ui/background-beams";
import Image from "next/image";
import rowellbanner from '@/assets/images/rowellbanner.png';
import PrimaryButton from "../buttons/primaryButton";

export function Hero() {
    return (
        <div className="w-full rounded-md bg-primary relative flex flex-col items-center justify-center antialiased hero pt-32 h-[100vh] z-10 max-sm:h-auto">
            <div className="hero__container flex items-center justify-center relative z-50 w-full h-full container mx-auto max-sm:flex-col-reverse">
                <div className="hero__image flex-shrink-0 w-[38%] self-end relative max-sm:w-full">
                    <Image src={rowellbanner} alt="rowell mark blanca" />

                    <div className="absolute left-0 bottom-0 w-full text-center py-5">
                        <h2 className="font-semibold text-2xl">Rowell Mark  M. Blanca</h2>
                    </div>
                </div>
                <div className="hero__content w-full pl-[5%] px-[8%] pb-11 max-sm:w-full">
                    <h5 className="text-text-accent font-medium text-lg uppercase">Introduction</h5>
                    <h1 className="text-white relative z-20 font-bold text-7xl max-sm:text-6xl">
                        Software Engineer<br />
                        based in Philippines
                    </h1>
                    <p className="mt-2 text-neutral-300 relative z-20 leading-6 pt-6">
                        As a seasoned Software Engineer with over a decade of experience, I've had the privilege of working with clients across diverse industries and countries. My passion lies in crafting robust and scalable frontend products that prioritize exceptional user experiences. With a keen eye for detail and a commitment to excellence, I strive to deliver solutions that not only meet but exceed client expectations.
                    </p>
                    <PrimaryButton link="/about" label="More about Me" className="mt-20" />
                </div>
            </div>
            <BackgroundBeams />
        </div>
    );
}
