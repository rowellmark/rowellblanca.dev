"use client";

import React, { useState } from 'react';

interface TabItem {
    label: string;
    content: {
        key: number;
        url: string;
        image: string;
        sitename: string;
        stacks: string;
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
                            ? 'border-b-2 border-blue-500 text-blue-500'
                            : 'text-base text-white'
                            } focus:outline-none`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div>
                {tabs[activeTab].content.map((item, index) => (
                    <div className="tabCol w-1/3 p-4" key={index}>
                        <a href={item.url}>
                            <img src={item.image} alt={item.sitename} className="w-full h-auto mb-2" />
                            <h3 className="text-lg font-semibold">{item.sitename}</h3>
                            <ul dangerouslySetInnerHTML={{ __html: item.stacks }}></ul>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
