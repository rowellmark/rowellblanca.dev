"use client";

import Banner from '@/components/banner/banner';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import PrimaryButton from '@/components/buttons/primaryButton';
import facebook from "@/assets/images/facebook.png";
import instagram from "@/assets/images/instagram.png";
import linkedin from "@/assets/images/linkedin.png";
import git from "@/assets/images/git.png";
import { useEffect, useState } from 'react';
import { db } from '@/utils/firebaseconfig';
import { collection, query, where, getDocs, orderBy} from "firebase/firestore";


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


interface ProjectDetails {
    key: number;
    url: string;
    image: string;
    permalink: string;
    sitename: string;
    technologies: string[];
}


export default function Projects({ params }: ProjectProps) {
    const [project, setProject] = useState<ProjectDetails[]>([]);
    const router = useRouter();
    
    useEffect(() => {


        const fetchProjects = async () => {
            try {
                const q = query(collection(db, 'projects'), where('permalink', '==', params.projects));
                const querySnapshot = await getDocs(q);
                
                const projectsData: ProjectDetails[] = [];
                    querySnapshot.forEach((doc) => {
                    projectsData.push(doc.data() as ProjectDetails);
                });

                if (projectsData.length > 0) {
                    setProject(projectsData);
                } else {
                    router.push('/404'); // Redirect to 404 if no project data is found
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
                router.push('/404'); // Redirect to 404 in case of an error
            }
        };


        fetchProjects();


    }, [params.projects, router]);


    const socialMedia = [
        {
            'title' : 'facebook',
            'icon': facebook,
            'url': 'https://www.facebook.com/itsmrrowrow',
        },
        {
            'title': 'instagram',
            'icon': instagram,
            'url': 'https://www.instagram.com/its.mr.row/',
        },
        {
            'title': 'linkedin',
            'icon': linkedin,
            'url': 'https://www.linkedin.com/in/rowell-blanca/',
        },
        {
            'title': 'git',
            'icon': git,
            'url': 'https://github.com/rowellmark',
        }
    ];

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
                        {project[0] && (
                            <>
                                <div className="projectTitle">
                                    <h1 className="text-7xl font-semibold  max-lg:text-3xl">{project[0]['sitename'] }</h1>
                            
                                </div>

                                <div className="projectDetails pt-20 flex justify-between max-lg:flex-col">

                                    <div className="projectDescriptionLeft">
                                        <div className="projectDescription text-lg">
                                            <p>Have an exciting project you need help with?</p>
                                            <p>Send me an email <a href="mailto:rowellblanca94@gmail.com" className="text-accent-color">rowellblanca94@gmail.com</a> or hit say hello!</p>
                                            <ul className="flex -mx-1 pt-5 pb-7">
                                                {socialMedia.map( (social, index) => (
                                                    <li
                                                        key={index}
                                                        className="px-1"
                                                    >
                                                        <a href={social.url} className="block relative w-7" target="_blank">
                                                            <Image src={social.icon} alt={social.title} priority />
                                                            <span className="hidden">{social.title}</span>
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                            <PrimaryButton link="/about" label="Say Hello!" className=" mt-7" />
                                        </div>
                                    </div>
                                    <div className="projectDescriptionRight flex max-lg:flex-col">
                                        <div className="projectClient border-t border-slate-200 px-5 max-lg:py-8 mt-10">
                                            <h3 className="font-bold text-accent-color pb-4 pt-2 text-lg">Client</h3>
                                            <p>Personal Project</p>
                                        </div>
                                        <div className="projectTechonologies border-t border-slate-200 ml-20 px-5 max-lg:ml-0 max-lg:py-8">
                                            <h3 className="font-bold text-accent-color pb-4 pt-2 text-lg">Technologies</h3>
                                            <ul className="list-disc px-4">
                                                {project[0].technologies.map((technology, index) => (
                                                    <li key={index} className="py-2">{technology}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="projectImage pt-11">
                                    <Image src={`/${project[0]['image']}`} alt={project[0]['sitename']} width="1600" height="600" className='w-full h-auto'/>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
           
        </>
    )
} 

