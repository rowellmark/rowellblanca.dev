import Link from "next/link";
import { AnimatedLogo } from "@/components/ui/animated-logo";
import { IconBrandGithub, IconBrandLinkedin, IconBrandFacebook, IconBrandInstagram } from "@tabler/icons-react";
import { FooterBibleVerse } from "@/components/ui/footer-bible-verse";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const socialMedia = [
        { title: 'GitHub', icon: IconBrandGithub, url: 'https://github.com/rowellmark' },
        { title: 'LinkedIn', icon: IconBrandLinkedin, url: 'https://www.linkedin.com/in/rowell-blanca/' },
        { title: 'Facebook', icon: IconBrandFacebook, url: 'https://www.facebook.com/itsmrrowrow' },
        { title: 'Instagram', icon: IconBrandInstagram, url: 'https://www.instagram.com/its.mr.row/' },
    ];

    const navLinks = [
        { href: '/about', label: 'About' },
        { href: '/mywork', label: 'My Work' },
        { href: '/case-studies', label: 'Case Studies' },
        { href: '/blog', label: 'Blog' },
        { href: '/arcade', label: 'Arcade 🎮', highlight: true },
        { href: '/contact', label: 'Contact' },
        { href: '/privacy', label: 'Privacy' },
    ];

    return (
        <footer className="bg-[#FAFAF7] border-t border-slate-200/80 text-brand-slate">
            {/* ✝ Daily Bible Verse — client component, fetches on mount */}
            <FooterBibleVerse />

            {/* Main Footer Container */}
            <div className="container mx-auto px-6 max-w-6xl py-10 sm:py-12">
                
                {/* Top Row: Brand Info + Navigation */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8 pb-8 border-b border-slate-200/80">
                    
                    {/* Brand Info */}
                    <div className="flex items-center gap-3.5 shrink-0">
                        <div className="relative h-10 w-10 shrink-0">
                            <AnimatedLogo className="h-full w-full" title="Rowell Mark Blanca" />
                        </div>
                        <div>
                            <span className="font-extrabold text-slate-900 text-sm sm:text-base block tracking-tight">
                                Rowell Mark Blanca
                            </span>
                            <span className="text-xs text-slate-500 font-medium block">
                                Full-Stack Software Engineer
                            </span>
                        </div>
                    </div>

                    {/* Navigation Links with generous breathing room and no cramped line wraps */}
                    <nav className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-2.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`whitespace-nowrap transition-colors duration-200 ${
                                    link.highlight
                                        ? 'text-amber-600 hover:text-amber-500 font-black'
                                        : 'hover:text-slate-900'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Bottom Row: Copyright + Social Media */}
                <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p className="font-medium text-center sm:text-left">
                        © {currentYear} Rowell Mark Blanca. Built with Next.js &amp; Tailwind CSS.
                    </p>

                    {/* Social Media Links with refined pill card buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                        {socialMedia.map(({ title, icon: Icon, url }) => (
                            <a
                                key={title}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={title}
                                className="h-8 w-8 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center text-slate-500 hover:text-amber-600 hover:border-amber-400 hover:shadow-xs transition-all duration-200"
                            >
                                <Icon size={16} />
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </footer>
    );
}