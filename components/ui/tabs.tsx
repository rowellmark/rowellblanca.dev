"use client";

import React, { useState } from 'react';

interface TabItem {
    label: string;
    content: React.ReactNode[]; // Update to accept an array of React nodes
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
            <div className="tabContainer">
                {tabs[activeTab].content.map(item => (
                    
                    <div className="tabCol" key={item.key}>
                        {item.text}
                    </div>
                   
                ))}
            </div>
        </div>
    );
}