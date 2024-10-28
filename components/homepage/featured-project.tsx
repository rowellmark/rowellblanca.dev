"use client";
import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import Image from "next/image";
import Link from "next/link";

export function FeaturedProject() {
    return (
        <div className="flex flex-col overflow-hidden px-8 max-sm:px-0 relative">
            
            <ContainerScroll
                titleComponent={
                    <>
                        <h1 className="text-4xl font-semibold text-white dark:text-white">
                        Project Spotlight <br />
                            <span className="text-4xl md:text-[4rem] font-bold mt-1 leading-none">
                            macmanusfd.finance 
                            </span>
                        </h1>
                    </>
                }
            >
            
                <Link href="/mywork/macmanusfd.finance" className="relative">
                <Image
                    src={`/macmanusfd.jpg`}
                    alt="hero"
                    height={720}
                    width={1400}
                    className="mx-auto rounded-2xl object-cover h-full object-left-top"
                    draggable={false}
                />



                </Link>
            </ContainerScroll>
        </div>
        
    );
}