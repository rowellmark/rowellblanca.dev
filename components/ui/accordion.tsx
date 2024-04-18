import { useState } from 'react';

interface AccordionProps {
    title: string;
    children: React.ReactNode;
    initiallyOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
    title,
    children,
    initiallyOpen = false,
}) => {
    const [isOpen, setIsOpen] = useState(initiallyOpen);

    return (
        <div className="border border-gray-200 rounded-md">
            <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h2 className="text-lg font-semibold">{title}</h2>
                <svg
                    className={`w-6 h-6 transition-transform transform ${isOpen ? 'rotate-180' : ''
                        }`}
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
            {isOpen && <div className="p-4">{children}</div>}
        </div>
    );
};

export default Accordion;