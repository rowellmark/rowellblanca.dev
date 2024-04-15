"use client";

import React, { useState } from 'react';

interface TabItem {
    label: string;
    content: React.ReactNode;
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
                                : 'text-gray-500'
                            } focus:outline-none`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div>{tabs[activeTab].content}</div>
        </div>
    );
}