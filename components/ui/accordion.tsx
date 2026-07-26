'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
    title: string;
    workyear: string;
    children: React.ReactNode;
    index: number;
    openAccordion: number;
    setOpenAccordion: (index: number) => void;
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
        setOpenAccordion(isOpen ? -1 : index);
    };

    return (
        <div
            className={`rounded-2xl transition-all duration-300 border overflow-hidden my-3.5 ${
                isOpen
                    ? 'bg-white border-amber-400/80 shadow-lg shadow-amber-500/5 ring-1 ring-amber-400/30'
                    : 'bg-white/95 border-slate-200/90 shadow-xs hover:border-amber-300/60 hover:shadow-md'
            }`}
        >
            <button
                type="button"
                className="w-full flex items-center justify-between p-5 text-left font-bold cursor-pointer transition-colors duration-200 group focus:outline-none max-sm:flex-col max-sm:items-start"
                onClick={handleClick}
            >
                <div className="flex items-center gap-3 pr-4">
                    <span
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shrink-0 ${
                            isOpen ? 'bg-amber-500 scale-125 shadow-xs shadow-amber-500/50' : 'bg-slate-300 group-hover:bg-amber-400'
                        }`}
                    />
                    <h2 className={`text-base sm:text-lg font-black transition-colors ${isOpen ? 'text-slate-900' : 'text-slate-800 group-hover:text-amber-600'}`}>
                        {title}
                    </h2>
                </div>

                <div className="flex items-center gap-4 shrink-0 max-sm:mt-3 max-sm:w-full max-sm:justify-between">
                    <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200/80 shadow-xs">
                        {workyear}
                    </span>
                    <div
                        className={`p-1.5 rounded-full transition-transform duration-300 ${
                            isOpen ? 'rotate-180 bg-amber-500/10 text-amber-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                    >
                        <ChevronDown className="w-5 h-5" />
                    </div>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 pt-3 border-t border-slate-100/90 text-base leading-7">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Accordion;