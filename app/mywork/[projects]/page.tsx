"use client";

import Banner from '@/components/banner/banner';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
    IconArrowLeft
} from "@tabler/icons-react";

interface ProjectProps {
    params: any; 
}

interface Project {
    key: number;
    url: string;
    image: string;
    sitename: string;
    stacks: string[];
}


export default function Projects({ params }: ProjectProps) {
    const [project, setProject] = useState<Project | null>(null);
    const router = useRouter();
    
    useEffect(() => {
        const item = localStorage.getItem(params.projects);
        if (item) {
            setProject(JSON.parse(item));
        } else {
            router.push('/404'); // Redirect to 404 if project item is not found in localStorage
        }
    }, []);


    

    return (
        <>
            <div className="project py-36">
                <div className="projectContainer container mx-auto px-8">

                    <div className="back-button flex items-start pb-6 max-lg:px-0">
                        <Link href="/" className="flex items-center py-2 uppercase font-semibold rounded-mdtext-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md">
                            <IconArrowLeft className="mr-3" /> Back
                        </Link>
                    </div>

                    <div className="projectHeader">

                        {project && (
                            <>
                                <div className="projectTitle">
                                    <h1 className="text-7xl font-semibold  max-lg:text-3xl">{project.sitename}</h1>
                            
                                </div>

                                <div className="projectDetails py-3">
                                    <p className="text-accent-color">Tech Staks: {project.stacks.join(', ')}</p>
                                </div>

                                <div className="projectImage pt-11">
                                    <Image src={project.image} alt={project.sitename} width="1600" height="600" className='w-full h-auto'/>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
           
        </>
    )
} 

