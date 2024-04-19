"use client";

import Image from 'next/image';
import React, { useState } from 'react';

import {
    IconLink
} from "@tabler/icons-react";

interface TabItem {
    label: string;
    content: {
        key: number;
        url: string;
        image: string;
        sitename: string;
        stacks: string[];
    }[];
}
interface TabProps {
    tabs: TabItem[];
}

export function Tab({ tabs }: TabProps) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <div className="flex space-x-4 justify-center max-sm:flex-col">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`${index === activeTab
                            ? 'border-b-2 border-accent-color text-accent-color'
                            : 'text-base text-white'
                            } focus:outline-none uppercase max-sm:py-5`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className='tabContainer py-10 flex -mx-4 flex-wrap'>
                {tabs[activeTab].content.map((item, index) => (
                    <div className="tabCol w-1/3 p-4 text-base text-primary max-sm:w-full" key={index}>
                        <a href="#" className='block w-full bg-white p-4 rounded-lg group'>
                            <div className="projectImage relative overflow-hidden">
                                <canvas width="640" height="380" className="w-full h-auto bg-black"></canvas>
                                <Image src={item.image} alt={item.sitename} className="w-full h-full mb-2 absolute top-0 left-0 object-cover object-left-top z-10 transition-all duration-500 group-hover:scale-110 group-hover:opacity-40" width="640" height="461"></Image>
                                <div className="viewWebsite absolute z-30 -bottom-20 right-0 flex items-center text-base text-white p-3 transition-all duration-500 group-hover:bottom-0">Show Project <IconLink className='ml-2'/></div>
                            </div>
                          
                            <h3 className="text-lg font-semibold pt-3">{item.sitename}</h3>
                            <ul className="flex items-center -mx-1 py-3">
                                {item.stacks.map((stack, stackIndex) => (
                                    <li key={stackIndex} className="bg-accent-color px-3 py-1 rounded-3xl mx-1 text-sm text-black">{stack}</li>
                                ))}
                            </ul>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}