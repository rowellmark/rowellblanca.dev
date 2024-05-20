"use client";
import React, { useEffect, useState } from "react";
import { HeroParallax } from "../ui/hero-parallax";
import { db } from '@/utils/firebaseconfig';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

interface Project {
    key: number;
    url: string;
    image: string;
    permalink: string;
    sitename: string;
    technologies: string[];
}


export function ShowCasePortfolios() {

    const [projects, setProjects] = useState<Project[]>([]);
    useEffect(() => {
    const fetchProjects = async () => {
        try {
            let q = query(collection(db, "projects"), orderBy("technologies", "desc"));
            const querySnapshot = await getDocs(q);
            const projects: Project[] = [];
            querySnapshot.forEach((doc) => {
                projects.push(doc.data() as Project);
            });
            setProjects(projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
        }
    };

    fetchProjects();
    }, []);

    
    
    return <HeroParallax products={projects} />;
}