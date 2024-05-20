"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { db } from '@/utils/firebaseconfig';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { IconLink } from "@tabler/icons-react";
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Project {
    key: number;
    url: string;
    image: string;
    permalink: string;
    sitename: string;
    technologies: string[];
}

interface TabProps {
    nav: string[];
}

const loadingVariants = {
    animationOne: {
        x: [-20, 20],
        y: [0, -30],
        transition: {
            x: {
                yoyo: Infinity,
                duration: 0.5,
            },
            y: {
                yoyo: Infinity,
                duration: 0.25,
                ease: 'easeOut',
            },
        },
    },
};

export function Tab({ nav }: TabProps) {
    const [activeTab, setActiveTab] = useState(nav[0]);
    const [projectsData, setProjectsData] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                let q;
                if (activeTab === 'All') {
                    q = query(collection(db, "projects"), orderBy("technologies", "desc"));
                } else {
                    q = query(collection(db, "projects"), where("technologies", "array-contains", activeTab));
                }

                const querySnapshot = await getDocs(q);
                const projects: Project[] = [];
                querySnapshot.forEach((doc) => {
                    projects.push(doc.data() as Project);
                });
                setProjectsData(projects);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [activeTab]);

    return (
        <>
            <div>
                <div className="flex space-x-4 justify-center max-sm:flex-col">
                    {nav.map((tab, index) => (
                        <button
                            key={index}
                            className={`${activeTab === tab
                                ? 'border-b-2 border-accent-color text-accent-color'
                                : 'text-base text-white'
                                } focus:outline-none uppercase max-sm:py-5`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {
                                tab != 'Firebase' ? tab : 'Build with Firebase'
                            }
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <motion.div
                            className="loader"
                            variants={loadingVariants}
                            animate="animationOne"
                        >
                            Loading...
                        </motion.div>
                    </div>
                ) : (
                    <div className='tabContainer py-10 flex -mx-4 flex-wrap'>
                        {projectsData.map((data, i) => (
                            <motion.div 
                                className="tabCol w-1/3 p-4 text-base text-primary max-sm:w-full max-xl:w-2/4" 
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Link href={`/mywork/${data.permalink}`} className='block w-full bg-white p-4 rounded-lg group h-full'>
                                    <div className="projectImage relative overflow-hidden">
                                        <canvas width="640" height="380" className="w-full h-auto bg-black"></canvas>
                                        <Image src={`/${data.image}`} alt={data.sitename} className="w-full h-full mb-2 absolute top-0 left-0 object-cover object-left-top z-10 transition-all duration-500 group-hover:scale-110 group-hover:opacity-40" width="640" height="461"></Image>
                                        <div className="viewWebsite absolute z-30 -bottom-20 right-0 flex items-center text-base text-white p-3 transition-all duration-500 group-hover:bottom-0">Show Project <IconLink className='ml-2' /></div>
                                    </div>

                                    <h3 className="text-lg font-semibold pt-3">{data.sitename}</h3>
                                    <ul className="flex items-center -mx-1 py-3 flex-wrap">
                                        {data.technologies.map((tech, i) => (
                                            <li key={i} className="bg-accent-color px-3 py-1 rounded-3xl m-1 text-sm text-black">{tech}</li>
                                        ))}
                                    </ul>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}