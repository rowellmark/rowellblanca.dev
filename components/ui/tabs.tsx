"use client";

import React, { useState } from 'react';

interface TabItem {
    label: string;
    content: { key: number; text: string; }[] | React.ReactNode[];
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
                    // Type assertion to let TypeScript know that item is not null or undefined
                    <div className="tabCol w-1/3 p-4" key={index}>
                        {item && (
                            <>
                                <a href="#">
                                    <canvas width="300" height="200" className="bg-slate-400 block w-full h-auto"></canvas>
                                    {item.text}
                                </a>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
