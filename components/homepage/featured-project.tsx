"use client";
import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import Image from "next/image";

export function FeaturedProject() {
    return (
        <div className="flex flex-col overflow-hidden px-8 max-sm:px-0">
            <ContainerScroll
                titleComponent={
                    <>
                        <h1 className="text-4xl font-semibold text-white dark:text-white">
                           Work in progress <br />
                            <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                                mycv.com
                            </span>
                        </h1>
                    </>
                }
            >
                <Image
                    src={`/my-cv-screenshot.jpg`}
                    alt="hero"
                    height={720}
                    width={1400}
                    className="mx-auto rounded-2xl object-cover h-full object-left-top"
                    draggable={false}
                />
            </ContainerScroll>
        </div>
    );
}