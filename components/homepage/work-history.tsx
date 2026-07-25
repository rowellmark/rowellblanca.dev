'use client';

import React, { useState } from 'react';
import Accordion from "../ui/accordion";
import { IconMap2, IconLink } from "@tabler/icons-react";
import Image from 'next/image';
import a99logo from "@/assets/images/a99logo.png";
import ideallogo from "@/assets/images/ideal-logo.jpg";
import hibu from "@/assets/images/hibu-logo.png";
import upwork from "@/assets/images/upworklogo.jpg";

export default function WorkHistory() {
    const [openAccordion, setOpenAccordion] = useState(0);

    const jobHistory = [
        {
            key: 0,
            title: "Software Engineer @ August99",
            year: "2014 - Present",
            location: "Ortigas Pasig, Philippines",
            desciption: "Expertise in WordPress architecture, custom theme and plugin creation, Bedrock/Sage frameworks, and modern React/Next.js client web applications. Emphasizes UI/UX precision, SEO performance optimization, accessibility compliance, and enterprise security measures.",
            companyurl: "https://august99.com/",
            company: "august99.com",
            logo: a99logo,
            logoAlt: "August99 logo",
            stacks: ["WordPress", "JavaScript", "PHP", "Bedrock", "React", "Next.js", "Figma"]
        },
        {
            key: 1,
            title: "Software Engineer @ Ideal International Education Corp",
            year: "2013 - 2014",
            location: "Makati City, Philippines",
            desciption: "Engineered single-page PHP web platforms and dynamic learning modules. Maintained high availability for online education systems and converted marketing designs into responsive landing pages.",
            companyurl: "https://idealeducationhk.com/",
            company: "idealeducationhk.com",
            logo: ideallogo,
            logoAlt: "Ideal International Education Corp logo",
            stacks: ["WordPress", "JavaScript", "PHP", "jQuery", "Figma"]
        },
        {
            key: 2,
            title: "Front-end Web Developer @ Hibu / Yell Adworks",
            year: "2012 - 2013",
            location: "Eastwood City, Philippines",
            desciption: "Converted high-fidelity PSD designs into pixel-perfect responsive HTML/CSS layouts. Performed cross-browser compatibility testing and developed lightweight custom PHP CMS modules.",
            companyurl: "https://hibu.com/",
            company: "hibu.com",
            logo: hibu,
            logoAlt: "Hibu logo",
            stacks: ["HTML5", "CSS3", "JavaScript", "PHP", "jQuery", "Photoshop"]
        },
        {
            key: 3,
            title: "Top-Rated Freelance Software Engineer @ Upwork",
            year: "2013 - Present",
            location: "Global Remote",
            desciption: "Top-Rated developer on Upwork specializing in React, Next.js, and custom WordPress systems with a 100% job success rate across US, UK, and European client projects.",
            companyurl: "https://www.upwork.com/freelancers/~0173d7d6f41ce01c95",
            company: "Upwork Profile",
            logo: upwork,
            logoAlt: "Upwork logo",
            stacks: ["React", "Next.js", "TypeScript", "WordPress", "Tailwind CSS", "REST APIs"]
        }
    ];

    return (
        <section className="py-24 bg-brand-bg relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-6xl">
                
                {/* Heading */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-amber bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                        Career Timeline
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-navy tracking-tight">
                        Professional Experience
                    </h2>
                    <p className="text-base text-brand-slate">
                        Over a decade of progressive engineering roles across agencies, corporate products, and global freelance contracts.
                    </p>
                </div>

                <div className="w-full max-w-4xl mx-auto space-y-4">
                    {jobHistory.map((history, index) => (
                        <Accordion
                            key={index}
                            title={history.title}
                            index={history.key}
                            openAccordion={openAccordion}
                            setOpenAccordion={setOpenAccordion}
                            workyear={history.year}
                        >
                            <div className="space-y-4 pt-2">
                                <ul className="flex items-center gap-6 text-xs font-semibold text-slate-600 max-sm:flex-col max-sm:items-start max-sm:gap-2">
                                    <li className="flex items-center gap-1.5 text-brand-amber">
                                        <IconMap2 size="16" />
                                        <span className="text-slate-700">{history.location}</span>
                                    </li>
                                    <li className="flex items-center gap-1.5 text-brand-amber">
                                        <IconLink size="16" />
                                        <a href={history.companyurl} target="_blank" rel="noopener noreferrer" className="text-brand-amber hover:underline">
                                            {history.company}
                                        </a>
                                    </li>
                                </ul>

                                <div className="flex max-lg:flex-col-reverse justify-between gap-6 items-start">
                                    <div className="w-full space-y-4">
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {history.desciption}
                                        </p>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {history.stacks.map((stack, key) => (
                                                <span key={key} className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-700">
                                                    {stack}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-24 shrink-0 p-2 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                                        <Image src={history.logo} className="w-full h-auto object-contain block" alt={history.logoAlt} />
                                    </div>
                                </div>
                            </div>
                        </Accordion>
                    ))}
                </div>

            </div>
        </section>
    );
}
