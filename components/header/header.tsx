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
                        ? 'bg-brand-ink/90 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/10 py-3'
                        : 'bg-brand-ink/70 backdrop-blur-md py-4 border-b border-white/[0.08]'
                }`}
            >
                <div className="mx-auto px-4 sm:px-6 lg:px-10 max-w-[1360px] flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative h-10 w-10 shrink-0 group-hover:scale-105 transition-transform">
                            <AnimatedLogo className="h-full w-full" title="Rowell Mark Blanca" tone="dark" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-white text-base tracking-tight leading-none">
                                Rowell Blanca
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                                Software Engineer
                            </span>
                        </div>
                    </Link>

                    {/* Mobile Menu Icon */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
                            className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] text-slate-200 border border-white/15 font-mono text-xs font-bold"
                            title="Command Palette"
                        >
                            ⌘K
                        </button>
                        <button
                            onClick={() => setIsContactModalOpen(true)}
                            aria-label="Contact"
                            className="p-2 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-400/30"
                        >
                            <IconPhone size="20" />
                        </button>
                        <button
                            onClick={toggleMobileNav}
                            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                            aria-label="Toggle Navigation"
                        >
                            <div className="w-5 h-4 flex flex-col justify-between">
                                <span className={`h-0.5 w-full bg-white rounded transition-all ${isMobileNavOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                                <span className={`h-0.5 w-full bg-white rounded transition-all ${isMobileNavOpen ? 'opacity-0' : ''}`} />
                                <span className={`h-0.5 w-full bg-white rounded transition-all ${isMobileNavOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                            </div>
                        </button>
                    </div>

                    {/* Desktop Nav */}
                    <nav className={`lg:flex items-center gap-6 ${isMobileNavOpen ? 'flex flex-col absolute top-full left-0 w-full bg-brand-ink border-b border-white/10 p-6 shadow-xl' : 'hidden lg:flex'}`}>
                        <ul className="flex items-center gap-6 max-lg:flex-col max-lg:w-full">
                            {navs.map((nav, index) => (
                                <li key={index} onClick={handleMobileMenuClick} className="max-lg:w-full max-lg:text-center">
                                    <Link
                                        href={nav.link}
                                        className="motion-underline text-[15px] font-medium text-slate-300 hover:text-white transition-colors"
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
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 hover:border-white/30 text-slate-300 font-mono text-xs transition-all cursor-pointer max-lg:w-full max-lg:justify-center"
                            title="Open Command Palette (⌘K)"
                        >
                            <span className="text-xs text-slate-400">Search</span>
                            <kbd className="px-1.5 py-0.5 text-[11px] bg-white/10 border border-white/20 rounded text-white">
                                ⌘K
                            </kbd>
                        </button>

                        <button
                            onClick={() => {
                                handleMobileMenuClick();
                                setIsContactModalOpen(true);
                            }}
                            className="motion-btn inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-full bg-white hover:bg-amber-400 text-brand-ink font-bold text-[15px] max-lg:w-full cursor-pointer"
                        >
                            Say Hello! <span className="motion-arrow" aria-hidden="true">→</span>
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