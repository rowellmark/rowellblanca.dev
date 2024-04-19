import { useState } from 'react';

interface AccordionProps {
    title: string;
    workyear: string;
    children: React.ReactNode;
    index: number; // Add index prop to identify each accordion
    openAccordion: number; // Add openAccordion prop to track which accordion is open
    setOpenAccordion: (index: number) => void; // Add setOpenAccordion prop to update openAccordion
}

const Accordion: React.FC<AccordionProps> = ({
    title,
    workyear,
    children,
    index,
    openAccordion,
    setOpenAccordion,
}) => {
    const isOpen = openAccordion === index;

    const handleClick = () => {
        setOpenAccordion(isOpen ? -1 : index); // Close if already open, otherwise open
    };

    return (
        <div className="border border-gray-200 rounded-md bg-white text-primary-accent accordionHead my-3">
            <div
                className="flex justify-between items-center p-4  font-semibold cursor-pointer relative"
                onClick={handleClick}
            >
                <h2 className="text-lg font-semibold">{title}</h2>

                <div className="workyear px-10">
                    {workyear}
                </div>
                <div className="arrows absolute right-0 top-0 h-full flex items-center px-4">
                <svg
                    className={`w-6 h-6 transition-transform transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={isOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                    />
                    </svg>
                </div>
            </div>
            {isOpen && <div className="p-4 accordionContent text-base leading-7">{children}</div>}
        </div>
    );
};

export default Accordion;