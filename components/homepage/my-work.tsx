import { Tab } from "../ui/tabs";


export function MyWork() {
    const tabs = [
        {
            label: 'All',
            content: [
                {
                    key: 1,
                    text: 'Content of Tab 1'
                }
            ]
        },
        {
            label: 'Wordpress',
            content: [
                {
                    key: 2,
                    text: 'Content 1 of Tab 2'
                },
                {
                    key: 3,
                    text: 'Content 2 of Tab 2'
                }
            ]
        },
        {
            label: 'React, NextJs',
            content: [
                {
                    key: 4,
                    text: 'Content of Tab 3'
                }
            ]
        },
        {
            label: 'Shopify',
            content: [
                {
                    key: 5,
                    text: 'Content of Tab 4'
                }
            ]
        },
        {
            label: 'Work in Progress',
            content: [
                {
                    key: 6,
                    text: 'Content of Tab 5'
                }
            ]
        },
    ];

    return (
        <div className="container mx-auto w-full">
            <Tab tabs={tabs} />
        </div>
    );
}
