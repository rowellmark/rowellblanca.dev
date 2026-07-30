"use client";
import React, { useEffect, useState } from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { ContactModal } from "../ui/contact-modal";
import { resolveValidImageSrc } from "@/lib/image-utils";

interface Project {
    id: number;
    sitename: string;
    permalink: string;
    url?: string;
    image: string;
    mobileImage?: string;
    fullMobileImage?: string;
    description?: string;
    spotlight?: boolean;
    featured?: boolean;
}

export function FeaturedProject() {
    const [spotlightProject, setSpotlightProject] = useState<Project | null>(null);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    useEffect(() => {
        const fetchSpotlight = async () => {
            try {
                const res = await fetch('/api/projects');
                const data = await res.json();
                if (data.success && Array.isArray(data.projects)) {
                    const activeProjects = data.projects.filter((p: any) => p.active !== false);
                    const spotlightMatch = activeProjects.find((p: Project) => p.spotlight) || activeProjects[0];
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
    const projectDescription = spotlightProject?.description ||
        "A closer look at one of my recent full-stack builds — engineered end-to-end with React, Next.js, and a custom content architecture, designed for speed, scalability, and measurable business results.";

    const resolveImageSrc = (src?: string | null) => {
        return resolveValidImageSrc(src);
    };

    const initialImgSrc = resolveImageSrc(spotlightProject?.image);
    const [projectImgSrc, setProjectImgSrc] = useState(initialImgSrc);
    const mobileImgSrc = resolveImageSrc(spotlightProject?.fullMobileImage || spotlightProject?.mobileImage || spotlightProject?.image);

    useEffect(() => {
        setProjectImgSrc(resolveImageSrc(spotlightProject?.image));
    }, [spotlightProject]);

    const truncateDescription = (text: string, maxLength = 160) => {
        if (!text) return "";
        const cleanText = text.replace(/<[^>]*>?/gm, '').trim();
        if (cleanText.length <= maxLength) return cleanText;
        return cleanText.substring(0, maxLength).trim() + "...";
    };

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
                        <p className="mt-3 max-w-xl mx-auto text-xs sm:text-sm text-brand-slate leading-relaxed line-clamp-2 font-medium">
                            {truncateDescription(projectDescription, 150)}
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 relative z-30">
                            <button
                                onClick={() => setIsContactModalOpen(true)}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-slate-900 text-slate-950 hover:text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer group duration-300"
                            >
                                <MessageSquare className="w-4 h-4 text-slate-950 group-hover:text-amber-400 transition-colors" />
                                <span>Start a Similar Project</span>
                            </button>
                            <Link
                                href={projectLink}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-900 border border-slate-200 hover:border-slate-800 text-slate-800 hover:text-white font-extrabold text-sm shadow-xs hover:shadow-md transition-all hover:scale-105 active:scale-95 group duration-300"
                            >
                                <span>View Case Study</span>
                                <ArrowRight className="w-4 h-4 text-amber-500 group-hover:text-amber-400 transition-colors" />
                            </Link>
                        </div>
                    </>
                }
            >
                <Link href={projectLink} className="relative block w-full h-full">
                    <Image
                        src={projectImgSrc}
                        alt={projectTitle}
                        fill
                        className="object-contain object-top"
                        onError={() => setProjectImgSrc('/no-image-placeholder.svg')}
                        draggable={false}
                        unoptimized
                    />
                </Link>
            </ContainerScroll>

            {/* Project Inquiry Modal */}
            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                defaultService={`Custom Web App based on ${projectTitle}`}
            />
        </div>
    );
}