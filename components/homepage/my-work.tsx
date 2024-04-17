import { Tab } from "../ui/tabs";

export function MyWork() {
    const tabs = [
        {
            label: 'All',
            content: [
                {
                    key: 1,
                    url: "#",
                    image: "/",
                    sitename: "Test Site",
                    stacks: "<li>Wordpress</li><li>Wordpress</li><li>Wordpress</li><li>Wordpress</li>"
                }
            ]
        },
        {
            label: 'Wordpress',
            content: [
                {
                    key: 1,
                    url: "#",
                    image: "/",
                    sitename: "Test Site",
                    stacks: "<li>Wordpress</li><li>Wordpress</li><li>Wordpress</li><li>Wordpress</li>"
                },
                {
                    key: 1,
                    url: "#",
                    image: "/",
                    sitename: "Test Site",
                    stacks: "<li>Wordpress</li><li>Wordpress</li><li>Wordpress</li><li>Wordpress</li>"
                }
            ]
        },
        {
            label: 'React, NextJs',
            content: [
                {
                    key: 1,
                    url: "#",
                    image: "/",
                    sitename: "Test Site",
                    stacks: "<li>Wordpress</li><li>Wordpress</li><li>Wordpress</li><li>Wordpress</li>"
                }
            ]
        },
        {
            label: 'Shopify',
            content: [
                {
                    key: 1,
                    url: "#",
                    image: "/",
                    sitename: "Test Site",
                    stacks: "<li>Wordpress</li><li>Wordpress</li><li>Wordpress</li><li>Wordpress</li>"
                }
            ]
        },
        {
            label: 'Work in Progress',
            content: [
                {
                    key: 1,
                    url: "#",
                    image: "/",
                    sitename: "Test Site",
                    stacks: "<li>Wordpress</li><li>Wordpress</li><li>Wordpress</li><li>Wordpress</li>"
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
