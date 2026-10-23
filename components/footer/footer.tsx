import Link from "next/link";
import { AnimatedLogo } from "@/components/ui/animated-logo";
import { IconBrandGithub, IconBrandLinkedin, IconBrandFacebook, IconBrandInstagram } from "@tabler/icons-react";
import { FooterBibleVerse } from "@/components/ui/footer-bible-verse";
import { LetsBuildCta } from "@/components/footer/lets-build-cta";

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
        <footer className="bg-brand-ink text-slate-400">
            {/* Site-wide closing call to action */}
            <LetsBuildCta />

            {/* ✝ Daily Bible Verse — client component, fetches on mount */}
            <FooterBibleVerse />

            {/* Main Footer Container */}
            <div className="mx-auto px-4 sm:px-6 lg:px-10 max-w-[1360px] py-10 sm:py-12">
                
                {/* Top Row: Brand Info + Navigation */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8 pb-8 border-b border-white/10">
                    
                    {/* Brand Info */}
                    <div className="flex items-center gap-3.5 shrink-0">
                        <div className="relative h-10 w-10 shrink-0">
                            <AnimatedLogo className="h-full w-full" title="Rowell Mark Blanca" tone="dark" />
                        </div>
                        <div>
                            <span className="font-extrabold text-white text-sm sm:text-base block tracking-tight">
                                Rowell Mark Blanca
                            </span>
                            <span className="text-xs text-slate-400 font-medium block">
                                Full-Stack Software Engineer
                            </span>
                        </div>
                    </div>

                    {/* Navigation Links with generous breathing room and no cramped line wraps */}
                    <nav className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-0 lg:gap-y-2.5 text-sm font-medium text-slate-400">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`inline-flex items-center min-h-[40px] lg:min-h-0 whitespace-nowrap transition-colors duration-200 ${
                                    link.highlight
                                        ? 'motion-underline text-amber-400 hover:text-amber-300 font-bold'
                                        : 'motion-underline hover:text-white'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Bottom Row: Copyright + Social Media */}
                <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
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
                                aria-label={title}
                                className="h-11 w-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-400/60 transition-all duration-200"
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