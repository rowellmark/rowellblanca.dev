"use client";
import React, { useEffect, useState } from "react";
import { ContainerScroll, useIsMobile } from "../ui/container-scroll-animation";
import Image from "next/image";
import Link from "next/link";

interface Project {
    id: number;
    sitename: string;
    permalink: string;
    url?: string;
    image: string;
    mobileImage?: string;
    spotlight?: boolean;
    featured?: boolean;
}

export function FeaturedProject() {
    const [spotlightProject, setSpotlightProject] = useState<Project | null>(null);

    useEffect(() => {
        const fetchSpotlight = async () => {
            try {
                const res = await fetch('/api/projects');
                const data = await res.json();
                if (data.success && Array.isArray(data.projects)) {
                    // Find project flagged as spotlight or default to first project
                    const spotlightMatch = data.projects.find((p: Project) => p.spotlight) || data.projects[0];
                    if (spotlightMatch) {
                        setSpotlightProject(spotlightMatch);
                    }
                }
            } catch (error) {
                console.error("Error fetching spotlight project:", error);
            }
        };

        fetchSpotlight();
    }, []);

    const projectTitle = spotlightProject?.sitename || "MacManus Asset Finance Portal";
    const projectLink = spotlightProject ? `/mywork/${spotlightProject.permalink}` : "/mywork/macmanus-portal";
    
    const projectImgSrc = spotlightProject?.image
        ? (spotlightProject.image.startsWith('http') || spotlightProject.image.startsWith('/') ? spotlightProject.image : `/${spotlightProject.image}`)
        : "/macmanusfd.jpg";

    // Use mobileImage if uploaded, otherwise fallback to projectImgSrc (never static macmanus-mobile)
    const mobileImgSrc = (spotlightProject?.mobileImage && spotlightProject.mobileImage.trim() !== "")
        ? (spotlightProject.mobileImage.startsWith('http') || spotlightProject.mobileImage.startsWith('/') ? spotlightProject.mobileImage : `/${spotlightProject.mobileImage}`)
        : projectImgSrc;

    return (
        <div className="flex flex-col overflow-hidden px-8 max-sm:px-0 relative">
            <ContainerScroll
                mobileImgSrc={mobileImgSrc}
                titleComponent={
                    <>
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-amber bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 inline-block mb-3">
                            Featured Spotlight
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">
                            Project Spotlight <br />
                            <span className="text-3xl sm:text-4xl md:text-[3rem] font-black text-brand-navy mt-1 leading-tight block">
                                {projectTitle}
                            </span>
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-brand-slate leading-relaxed">
                            A closer look at one of my recent full-stack builds — engineered end-to-end with React, Next.js, and a custom content architecture, designed for speed, scalability, and measurable business results.
                        </p>
                    </>
                }
            >
                <Link href={projectLink} className="relative block w-full h-full">
                    <Image
                        src={projectImgSrc}
                        alt={projectTitle}
                        height={720}
                        width={1400}
                        className="mx-auto rounded-2xl object-cover h-full object-top"
                        draggable={false}
                        unoptimized
                    />
                </Link>
            </ContainerScroll>
        </div>
    );
}