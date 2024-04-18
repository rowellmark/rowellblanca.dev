"use client";

import Image from 'next/image';
import React, { useState } from 'react';

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
            <div className="flex space-x-4">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`${index === activeTab
                            ? 'border-b-2 border-accent-color text-accent-color'
                            : 'text-base text-white'
                            } focus:outline-none uppercase`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className='tabContainer py-10 flex -mx-4 flex-wrap'>
                {tabs[activeTab].content.map((item, index) => (
                    <div className="tabCol w-1/3 p-4 text-base text-primary" key={index}>
                        <a href={item.url} className='block w-full bg-white p-4 rounded-lg'>
                            <Image src={item.image} alt={item.sitename} className="w-full h-auto mb-2" width="640" height="461"></Image>
                            <h3 className="text-lg font-semibold">{item.sitename}</h3>
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