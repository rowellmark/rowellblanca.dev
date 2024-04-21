import React, { useState } from 'react';
import Accordion from "../ui/accordion";

import {
    IconMap2,
    IconLink
} from "@tabler/icons-react";
import Image from 'next/image';
import a99logo from "@/assets/images/a99logo.png";
import ideallogo from "@/assets/images/ideal-logo.jpg";
import hibu from "@/assets/images/hibu-logo.png";
import upwork from "@/assets/images/upworklogo.jpg";

export default function WorkHistory() {
    const [openAccordion, setOpenAccordion] = useState(0); // Set initial state to 0 to open the first accordion


    const jobHistory = [
        {
            "key": 0,
            "title": "Software Engineer @ August99",
            "year": "2014 - Present",
            "location": "Ortigas Pasig, Philippines",
            "desciption": "Expertise in WordPress development, including theme creation, plugin development, and template optimization to meet industry standards and enhance user experience. It emphasizes skills in cross-browser compatibility testing, training, and collaboration on product development. Additionally, it covers UI/UX design integration, SEO implementation, version control, custom post types, performance optimization, accessibility compliance, and security measures to ensure efficient, inclusive, and secure WordPress websites.",
            "companyurl": "https://august99.com/", 
            "company": "august99.com",
            "logo": a99logo,
            "stacks": ["Wordpress", "Javascript", "PHP", "jQuery", "Figma", "Photoshop"]
        },
        {
            "key": 1,
            "title": "Software Engineer @ Ideal International Education Corp",
            "year": "2013 - 2014",
            "location": "Makati City, Philippines",
            "desciption": " Developing single-page PHP applications for dynamic web experiences, along with expertise in maintaining and securing online education platforms. It also emphasizes skills in creating engaging landing pages using HTML, CSS, and JavaScript to effectively engage and convert visitors.",
            "companyurl": "https://idealeducationhk.co/",
            "company": "idealeducationhk.com",
            "logo": ideallogo,
            "stacks": ["Wordpress", "Javascript", "PHP", "jQuery", "Figma", "Photoshop"]
        },
        {
            "key": 2,
            "title": "Front-end Web Developer @ Hibu/Yell Adworks",
            "year": "2012 - 2013",
            "location": "Eastwood City, Philippines",
            "desciption": "Converting PSD design files into fully functional HTML and CSS web pages with pixel-perfect accuracy. It highlights expertise in thorough cross-browser compatibility testing to ensure consistent functionality and appearance across different browsers. Additionally, it emphasizes the ability to develop custom Content Management Systems (CMS) using PHP, tailored to project requirements for efficient content management.",
            "companyurl": "https://hibu.com/",
            "company": "hibu.com",
            "logo": hibu,
            "stacks": ["Wordpress", "Javascript", "PHP", "jQuery", "Photoshop"]
        },
        {
            "key": 3,
            "title": "Occasional Software Engineer @ Upwork",
            "year": "2013 - Present",
            "location": "Eastwood City, Philippines",
            "desciption": "Top-Rated developer on Upwork specializing in Front-end (React,Nexjs WordPress) technologies with a 100% job success rate and client satisfaction.",
            "companyurl": "https://www.upwork.com/freelancers/~0173d7d6f41ce01c95?mp_source=share",
            "company": "Upwork",
            "logo": upwork,
            "stacks": ["Wordpress", "Javascript", "PHP", "React", "Nexjs","Figma", "Photoshop"]
        }
    ];

    return (
        <>
            <div className="workHistory w-full bg-primary-accent py-28 max-sm:px-6">

                <div className="workHistory__container container mx-auto">
                    <h2 className="text-white relative z-20 font-bold text-7xl text-center w-full pb-6 max-sm:text-6xl">
                        <span className="block text-text-accent font-medium text-lg uppercase">Professional</span>
                        Experience
                    </h2>

                    <div className="workHistory__wrap w-2/4 mx-auto max-sm:w-full">

                        {jobHistory.map((history, index) => (
                            <Accordion
                                key={index}
                                title={history.title}
                                index={history.key}
                                openAccordion={openAccordion}
                                setOpenAccordion={setOpenAccordion}
                                workyear={history.year}

                            >
                                <ul className="flex items-center max-sm:flex-col max-sm:items-start">
                                    <li className='flex items-center px-5 pl-0'>
                                        <IconMap2 color="#F8C15F" className="mr-2" />
                                        <span>{history.location}</span>
                                    </li>
                                    <li className='flex items-center'>
                                        <IconLink color="#F8C15F" className="mr-2" />
                                        <span>
                                            <a href={history.companyurl} target="_blank" className='transition-all duration-700 hover:text-accent-color-slate'>{history.company}</a>
                                        </span>
                                    </li>
                                </ul>
                                <div className="flex max-sm:flex-col-reverse">
                                    <div className="accordConent w-full pr-9">
                                        <p className="py-5">
                                            {history.desciption}
                                        </p>
                                        <div className="stackbubbles flex py-6 max-sm:flex-wrap">
                                            {history.stacks.map((stack, key) => (
                                                <span key={key} className="bg-accent-color px-3 py-1 rounded-3xl m-1 text-sm text-black">{stack}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="accordLogo w-1/6 shrink-0 max-sm:py-3">
                                        <Image src={history.logo} className="w-full block" alt="a99" />
                                    </div>
                                </div>
                            </Accordion>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
