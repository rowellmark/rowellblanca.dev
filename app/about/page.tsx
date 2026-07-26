import { Metadata } from "next";
import rowellPic from "@/assets/images/ROWELL-6.jpg";
import Image from "next/image";
import Link from "next/link";
import { CVDownloadButton } from "@/components/ui/cv-download-button";
import { IconArrowLeft, IconBrandGithub, IconBrandLinkedin, IconBrandFacebook, IconBrandInstagram } from "@tabler/icons-react";
import Banner from "@/components/banner/banner";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
    title: "About Rowell Mark Blanca",
    description: "Learn more about Rowell Mark Blanca — Software Engineer with 12+ years experience in React, Next.js, Node.js, PHP, and custom WordPress systems.",
};

export default function AboutPage() {
    const socialMedia = [
        { title: 'GitHub', icon: IconBrandGithub, url: 'https://github.com/rowellmark' },
        { title: 'LinkedIn', icon: IconBrandLinkedin, url: 'https://www.linkedin.com/in/rowell-blanca/' },
        { title: 'Facebook', icon: IconBrandFacebook, url: 'https://www.facebook.com/itsmrrowrow' },
        { title: 'Instagram', icon: IconBrandInstagram, url: 'https://www.instagram.com/its.mr.row/' },
    ];

    const techCategories = [
        { label: "Frontend", items: "HTML5, CSS3, JavaScript (ES6+), TypeScript, React.js, Next.js, Tailwind CSS, SASS/SCSS" },
        { label: "Backend & DB", items: "Node.js (Express), PHP (Laravel, WordPress), NeonDB (PostgreSQL), MySQL, Redis, REST & GraphQL APIs" },
        { label: "DevOps & Tools", items: "Git, Docker, GitHub Actions CI/CD, Figma, Photoshop, Vercel, AWS" },
        { label: "Automation & AI", items: "n8n, Dify, OpenAI ChatGPT API, Google Gemini API, Automated Workflows" },
        { label: "Testing & Security", items: "Playwright, Cypress E2E, JWT, OAuth 2.0, Security Hardening" },
    ];

    return (
        <div className="bg-brand-bg min-h-screen">
            <Banner title="About Me" subtitle="Biography & Background" />

            <div className="py-12 pb-24">
                <div className="container mx-auto px-6 max-w-6xl space-y-8">
                    
                    {/* Back link */}
                    <div className="flex items-start">
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 uppercase font-extrabold text-xs tracking-wider rounded-xl bg-white border border-slate-200 text-brand-navy hover:border-brand-amber transition-all shadow-xs hover:shadow-sm"
                        >
                            <IconArrowLeft className="mr-2 h-4 w-4 text-brand-amber" /> Back to Home
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        
                        {/* Left Info Column */}
                        <div className="lg:col-span-7 space-y-6">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-brand-amber bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 inline-block mb-3">
                                    Software Engineer
                                </span>
                                <h1 className="text-4xl sm:text-5xl font-black text-brand-navy tracking-tight">
                                    Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber to-amber-600">Rowell</span>
                                </h1>
                                <p className="text-base text-brand-slate mt-4 leading-relaxed font-medium">
                                    Over 12 years of hands-on software development experience partnering with clients across the US, UK, Hong Kong, and Philippines. I build fast, scalable, accessible digital products using modern web standards.
                                </p>
                            </div>

                            {/* Contact Badges */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                                        <Mail className="h-4 w-4 text-brand-amber" /> Email
                                    </div>
                                    <p className="text-xs sm:text-sm font-extrabold text-brand-navy">rowellblanca94@gmail.com</p>
                                </div>

                                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                                        <Phone className="h-4 w-4 text-brand-amber" /> Phone / WhatsApp
                                    </div>
                                    <p className="text-xs sm:text-sm font-extrabold text-brand-navy">+63 968 890 0418</p>
                                </div>
                            </div>

                            {/* Key Technologies */}
                            <div className="space-y-4 pt-2">
                                <h2 className="text-xl font-extrabold text-brand-navy">Technical Summary</h2>
                                <div className="space-y-3">
                                    {techCategories.map(({ label, items }, idx) => (
                                        <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                                            <div className="flex items-center gap-2 text-xs font-extrabold text-brand-amber uppercase tracking-wider">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                                {label}
                                            </div>
                                            <p className="text-xs text-slate-700 font-medium leading-relaxed">{items}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="pt-2 flex items-center gap-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Find Me:</span>
                                {socialMedia.map(({ title, icon: Icon, url }, idx) => (
                                    <a
                                        key={idx}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={title}
                                        className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-amber hover:border-amber-300 transition-all shadow-xs"
                                    >
                                        <Icon size="18" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Right Photo Column */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white p-3">
                                <Image
                                    src={rowellPic}
                                    alt="Rowell Mark Blanca"
                                    fill
                                    className="object-cover rounded-2xl"
                                    sizes="(max-width: 1024px) 100vw, 450px"
                                />
                            </div>

                            <CVDownloadButton />
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
