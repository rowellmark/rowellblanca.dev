"use client";
import React, { useEffect, useState } from "react";
import { HeroParallax } from "../ui/hero-parallax";

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
                const res = await fetch('/api/projects');
                const data = await res.json();
                if (data.success && Array.isArray(data.projects)) {
                    setProjects(data.projects);
                }
            } catch (error) {
                console.error("Error fetching projects from API:", error);
            }
        };

        fetchProjects();
    }, []);

    return <HeroParallax products={projects} />;
}