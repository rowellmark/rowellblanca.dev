'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { AnimatedLogo } from "@/components/ui/animated-logo";
import { IconPhone } from "@tabler/icons-react";
import { ContactModal } from "@/components/ui/contact-modal";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navs = [
        { name: 'About', link: '/about' },
        { name: 'My Work', link: '/mywork' },
        { name: 'Case Studies', link: '/case-studies' },
        { name: 'Blog', link: '/blog' },
        { name: 'Arcade 🎮', link: '/arcade' },
    ];

    const toggleMobileNav = () => {
        setIsMobileNavOpen(!isMobileNavOpen);
    };

    const handleMobileMenuClick = () => {
        setIsMobileNavOpen(false);
    };

    return (
        <>
            <header
                className={`fixed w-full z-50 top-0 left-0 transition-all duration-300 ${
                    scrolled
                        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/90 py-3'
                        : 'bg-white/80 backdrop-blur-md py-4 border-b border-slate-200/60 shadow-2xs'
                }`}
            >
                <div className="container mx-auto px-6 max-w-6xl flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative h-10 w-10 shrink-0 group-hover:scale-105 transition-transform">
                            <AnimatedLogo className="h-full w-full" title="Rowell Mark Blanca" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-[#0b1a30] text-base tracking-tight leading-none">
                                Rowell Blanca
                            </span>
                            <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider mt-1">
                                Software Engineer
                            </span>
                        </div>
                    </Link>

                    {/* Mobile Menu Icon */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
                            className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-mono text-xs font-bold"
                            title="Command Palette"
                        >
                            ⌘K
                        </button>
                        <button
                            onClick={() => setIsContactModalOpen(true)}
                            className="p-2 rounded-lg bg-amber-50 text-brand-amber border border-amber-200"
                        >
                            <IconPhone size="20" />
                        </button>
                        <button
                            onClick={toggleMobileNav}
                            className="p-2 rounded-lg text-brand-navy hover:bg-slate-100 transition-colors"
                            aria-label="Toggle Navigation"
                        >
                            <div className="w-5 h-4 flex flex-col justify-between">
                                <span className={`h-0.5 w-full bg-brand-navy rounded transition-all ${isMobileNavOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                                <span className={`h-0.5 w-full bg-brand-navy rounded transition-all ${isMobileNavOpen ? 'opacity-0' : ''}`} />
                                <span className={`h-0.5 w-full bg-brand-navy rounded transition-all ${isMobileNavOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                            </div>
                        </button>
                    </div>

                    {/* Desktop Nav */}
                    <nav className={`lg:flex items-center gap-6 ${isMobileNavOpen ? 'flex flex-col absolute top-full left-0 w-full bg-white border-b border-slate-200 p-6 shadow-xl' : 'hidden lg:flex'}`}>
                        <ul className="flex items-center gap-6 max-lg:flex-col max-lg:w-full">
                            {navs.map((nav, index) => (
                                <li key={index} onClick={handleMobileMenuClick} className="max-lg:w-full max-lg:text-center">
                                    <Link
                                        href={nav.link}
                                        className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-brand-amber transition-colors"
                                    >
                                        {nav.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* ⌘K Trigger Pill */}
                        <button
                            onClick={() => {
                                handleMobileMenuClick();
                                window.dispatchEvent(new CustomEvent('open-command-palette'));
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 font-mono text-[11px] font-bold transition-all cursor-pointer max-lg:w-full max-lg:justify-center"
                            title="Open Command Palette (⌘K)"
                        >
                            <span className="text-[10px] text-slate-400">Search</span>
                            <kbd className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 rounded shadow-2xs text-slate-800">
                                ⌘K
                            </kbd>
                        </button>

                        <button
                            onClick={() => {
                                handleMobileMenuClick();
                                setIsContactModalOpen(true);
                            }}
                            className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-slate-900 text-slate-950 hover:text-white font-extrabold text-xs uppercase tracking-wider shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 max-lg:w-full max-lg:text-center cursor-pointer"
                        >
                            Say Hello!
                        </button>
                    </nav>
                </div>
            </header>

            {/* Popup Contact Modal */}
            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </>
    );
}