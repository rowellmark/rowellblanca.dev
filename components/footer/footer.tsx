import logo from "@/assets/images/logo.png";
import Image from "next/image";
import Link from "next/link";
import { IconBrandGithub, IconBrandLinkedin, IconBrandFacebook, IconBrandInstagram } from "@tabler/icons-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const socialMedia = [
        { title: 'GitHub', icon: IconBrandGithub, url: 'https://github.com/rowellmark' },
        { title: 'LinkedIn', icon: IconBrandLinkedin, url: 'https://www.linkedin.com/in/rowell-blanca/' },
        { title: 'Facebook', icon: IconBrandFacebook, url: 'https://www.facebook.com/itsmrrowrow' },
        { title: 'Instagram', icon: IconBrandInstagram, url: 'https://www.instagram.com/its.mr.row/' },
    ];

    return (
        <footer className="bg-[#FAFAF7] border-t border-slate-200/80 py-12 text-brand-slate">
            <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Brand info */}
                <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0">
                        <Image
                            src={logo}
                            className="object-contain brightness-0"
                            alt="Rowell Mark Blanca"
                            fill
                        />
                    </div>
                    <div>
                        <span className="font-extrabold text-slate-900 text-sm block">Rowell Mark Blanca</span>
                        <span className="text-xs text-slate-900 font-bold">Software Engineer</span>
                    </div>
                </div>

                {/* Navigation links */}
                <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-600">
                    <Link href="/about" className="hover:text-brand-amber transition-colors">About</Link>
                    <Link href="/mywork" className="hover:text-brand-amber transition-colors">My Work</Link>
                    <Link href="/case-studies" className="hover:text-brand-amber transition-colors">Case Studies</Link>
                    <Link href="/blog" className="hover:text-brand-amber transition-colors">Blog</Link>
                    <Link href="/contact" className="hover:text-brand-amber transition-colors">Contact</Link>
                    <Link href="/privacy" className="hover:text-brand-amber transition-colors">Privacy</Link>
                </div>

                {/* Social & copyright */}
                <div className="flex flex-col items-center md:items-end gap-2">
                    <div className="flex items-center gap-2">
                        {socialMedia.map(({ title, icon: Icon, url }, idx) => (
                            <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={title}
                                className="text-slate-400 hover:text-brand-amber transition-colors p-1"
                            >
                                <Icon size="18" />
                            </a>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                        © {currentYear} Rowell Mark Blanca. Built with Next.js & Tailwind.
                    </p>
                </div>

            </div>
        </footer>
    );
}