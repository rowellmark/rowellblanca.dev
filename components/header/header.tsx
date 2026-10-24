'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
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

    const pathname = usePathname();

    const toggleMobileNav = () => {
        setIsMobileNavOpen(!isMobileNavOpen);
    };

    // Close the menu whenever the route changes (e.g. browser back).
    useEffect(() => {
        setIsMobileNavOpen(false);
    }, [pathname]);

    // While the mobile menu is open: lock page scroll, close on Escape, and flag
    // <html> so the floating RowBot / cookie buttons hide behind it.
    useEffect(() => {
        if (!isMobileNavOpen) return;
        const root = document.documentElement;
        // <html> is the scroller here (globals.css sets overflow on it), so lock that, not <body>.
        const prevOverflow = root.style.overflow;
        root.style.overflow = 'hidden';
        root.dataset.menuOpen = 'true';
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsMobileNavOpen(false);
        const onResize = () => window.innerWidth >= 1024 && setIsMobileNavOpen(false);
        window.addEventListener('keydown', onKey);
        window.addEventListener('resize', onResize);
        return () => {
            root.style.overflow = prevOverflow;
            delete root.dataset.menuOpen;
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('resize', onResize);
        };
    }, [isMobileNavOpen]);

    const handleMobileMenuClick = () => {
        setIsMobileNavOpen(false);
    };

    return (
        <>
            <header
                className={`fixed w-full top-0 left-0 transition-all duration-300 ${isMobileNavOpen ? 'z-[100001]' : 'z-50'} ${
                    isMobileNavOpen
                        ? 'bg-brand-ink py-3 border-b border-white/10'
                        : scrolled
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
                            type="button"
                            onClick={toggleMobileNav}
                            aria-label={isMobileNavOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMobileNavOpen}
                            aria-controls="mobile-menu"
                            className={`relative h-10 w-10 rounded-lg border transition-colors cursor-pointer ${
                                isMobileNavOpen ? 'bg-white text-brand-ink border-white' : 'text-white border-transparent hover:bg-white/10'
                            }`}
                        >
                            {/* Three bars centred on the button; the outer two rotate into an X around the same centre. */}
                            <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-4 w-5 -translate-x-1/2 -translate-y-1/2">
                                <span className={`absolute left-0 top-1/2 h-0.5 w-full -mt-px rounded bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileNavOpen ? 'rotate-45' : '-translate-y-[6px]'}`} />
                                <span className={`absolute left-0 top-1/2 h-0.5 w-full -mt-px rounded bg-current transition-opacity duration-200 ${isMobileNavOpen ? 'opacity-0' : ''}`} />
                                <span className={`absolute left-0 top-1/2 h-0.5 w-full -mt-px rounded bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileNavOpen ? '-rotate-45' : 'translate-y-[6px]'}`} />
                            </span>
                        </button>
                    </div>

                    {/* Desktop Nav */}
                    <nav aria-label="Main" className="hidden lg:flex items-center gap-6">
                        <ul className="flex items-center gap-6">
                            {navs.map((nav, index) => (
                                <li key={index}>
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
                            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 hover:border-white/30 text-slate-300 font-mono text-xs transition-all cursor-pointer"
                            title="Open Command Palette (⌘K)"
                        >
                            <span className="text-xs text-slate-400">Search</span>
                            <kbd className="px-1.5 py-0.5 text-[11px] bg-white/10 border border-white/20 rounded text-white">
                                ⌘K
                            </kbd>
                        </button>

                        <button
                            onClick={() => setIsContactModalOpen(true)}
                            className="motion-btn motion-magnetic inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-full bg-white hover:bg-amber-400 text-brand-ink font-bold text-[15px] cursor-pointer"
                        >
                            Say Hello! <span className="motion-arrow" aria-hidden="true">→</span>
                        </button>
                    </nav>
                </div>

                {/* Mobile menu: full-screen panel under the header bar */}
                <div
                    id="mobile-menu"
                    data-lenis-prevent
                    aria-hidden={!isMobileNavOpen}
                    inert={!isMobileNavOpen}
                    className={`lg:hidden fixed inset-x-0 top-[65px] bottom-0 bg-brand-ink overflow-y-auto overscroll-contain transition-[opacity,visibility] duration-300 ${
                        isMobileNavOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                    }`}
                >
                    <div className="min-h-full px-4 sm:px-6 pt-6 pb-[calc(2rem+env(safe-area-inset-bottom))] flex flex-col gap-10">
                        <nav aria-label="Mobile">
                            <ul className="m-0 p-0 list-none flex flex-col border-t border-white/10">
                                {navs.map((nav, i) => {
                                    const active = pathname === nav.link || pathname?.startsWith(`${nav.link}/`);
                                    return (
                                        <li
                                            key={nav.link}
                                            className={`border-b border-white/10 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                                isMobileNavOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                                            }`}
                                            style={{ transitionDelay: isMobileNavOpen ? `${60 + i * 45}ms` : '0ms' }}
                                        >
                                            <Link
                                                href={nav.link}
                                                onClick={handleMobileMenuClick}
                                                aria-current={active ? 'page' : undefined}
                                                className="group flex items-center justify-between gap-4 py-4"
                                            >
                                                <span className="flex items-baseline gap-4">
                                                    <span className="font-mono text-xs text-slate-500">{String(i + 1).padStart(2, '0')}</span>
                                                    <span className={`text-[30px] font-extrabold tracking-[-0.04em] leading-none ${active ? 'text-amber-500' : 'text-white group-active:text-amber-400'}`}>
                                                        {nav.name}
                                                    </span>
                                                </span>
                                                <span aria-hidden="true" className="text-xl text-slate-500 group-active:translate-x-1 transition-transform">→</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        <div
                            className={`mt-auto flex flex-col gap-3 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                isMobileNavOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                            }`}
                            style={{ transitionDelay: isMobileNavOpen ? '300ms' : '0ms' }}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    handleMobileMenuClick();
                                    setIsContactModalOpen(true);
                                }}
                                className="inline-flex items-center justify-between gap-3 min-h-[56px] px-6 rounded-full bg-amber-500 active:bg-amber-400 text-brand-ink font-bold cursor-pointer"
                            >
                                Book a discovery call <span aria-hidden="true">→</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    handleMobileMenuClick();
                                    window.dispatchEvent(new CustomEvent('open-command-palette'));
                                }}
                                className="inline-flex items-center justify-between gap-3 min-h-[52px] px-6 rounded-full border border-white/20 text-slate-200 font-semibold cursor-pointer"
                            >
                                Search the site
                                <kbd className="px-1.5 py-0.5 font-mono text-[11px] bg-white/10 border border-white/20 rounded text-white">⌘K</kbd>
                            </button>
                            <a href="mailto:hello@rowellblanca.dev" className="self-start mt-2 inline-flex items-center min-h-[44px] font-mono text-sm text-slate-400">
                                hello@rowellblanca.dev
                            </a>
                        </div>
                    </div>
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