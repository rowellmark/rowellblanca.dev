import { Metadata } from "next";
import rowellPic from "@/assets/images/ROWELL-6.jpg";
import Image from "next/image";
import Link from "next/link";
import { CVDownloadButton } from "@/components/ui/cv-download-button";
import { IconArrowLeft, IconBrandGithub, IconBrandLinkedin, IconBrandFacebook, IconBrandInstagram, IconCode, IconCpu, IconRocket, IconShieldCheck } from "@tabler/icons-react";
import Banner from "@/components/banner/banner";
import { Mail, Phone, MapPin, CheckCircle2, Award, Briefcase, Sparkles, Send, Globe } from "lucide-react";
import { ProjectEstimator } from "@/components/homepage/project-estimator";
import { EngagementModels } from "@/components/homepage/engagement-models";
import { SpeedRacerGame } from "@/components/interactive/speed-racer-game";

export const metadata: Metadata = {
    title: "About Rowell Mark Blanca — Senior Full-Stack Software Engineer",
    description: "Learn more about Rowell Mark Blanca — Senior Full-Stack Engineer with 12+ years experience in React, Next.js, TypeScript, and custom WordPress architecture for UK, US & Australian clients.",
};

export default function AboutPage() {
    const socialMedia = [
        { title: 'GitHub', icon: IconBrandGithub, url: 'https://github.com/rowellmark' },
        { title: 'LinkedIn', icon: IconBrandLinkedin, url: 'https://www.linkedin.com/in/rowell-blanca/' },
        { title: 'Facebook', icon: IconBrandFacebook, url: 'https://www.facebook.com/itsmrrowrow' },
        { title: 'Instagram', icon: IconBrandInstagram, url: 'https://www.instagram.com/its.mr.row/' },
    ];

    const stats = [
        { label: "Years Experience", value: "12+", icon: Award },
        { label: "Job Success Rate", value: "100%", icon: Sparkles },
        { label: "Production Builds", value: "50+", icon: Briefcase },
        { label: "Global Overlap", value: "UK · US · AU", icon: Globe },
    ];

    const coreCapabilities = [
        {
            title: "Full-Stack Web & SaaS Engineering",
            description: "Architecting sub-second Next.js 14 and React applications using strict TypeScript, Tailwind CSS, PostgreSQL (NeonDB), and Prisma ORM.",
            icon: IconCode,
        },
        {
            title: "Bespoke WordPress & Gutenberg Architecture",
            description: "Engineering custom Gutenberg block plugins, headless WordPress setups, and scalable themes without third-party page builder bloat.",
            icon: IconCpu,
        },
        {
            title: "AI Workflows & LLM Copilots",
            description: "Integrating multi-provider AI solutions (OpenAI, Google Gemini, Ollama), vector RAG pipelines, n8n automations, and intelligent chatbot systems.",
            icon: IconRocket,
        },
        {
            title: "Performance CRO & Security Hardening",
            description: "Enforcing 98+ Lighthouse Core Web Vitals, automated CI/CD pipelines, strict anti-spam defenses, and enterprise security standards.",
            icon: IconShieldCheck,
        },
    ];

    const techCategories = [
        {
            label: "Frontend",
            items: ["HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript", "React.js", "Next.js", "Tailwind CSS", "SASS/SCSS", "Framer Motion"],
        },
        {
            label: "Backend & Database",
            items: ["Node.js (Express)", "PHP (Laravel, WordPress)", "NeonDB (PostgreSQL)", "Prisma ORM", "MySQL", "Redis", "REST & GraphQL APIs"],
        },
        {
            label: "DevOps & Cloud Tools",
            items: ["Git", "Docker", "GitHub Actions CI/CD", "Vercel", "AWS", "Figma", "Photoshop"],
        },
        {
            label: "AI & Automation Workflows",
            items: ["n8n", "Dify", "OpenAI ChatGPT API", "Google Gemini API", "Ollama", "RAG Knowledge Indexing"],
        },
        {
            label: "Testing & Security",
            items: ["Playwright", "Cypress E2E", "JWT", "OAuth 2.0", "Security Hardening", "Lighthouse SEO"],
        },
    ];

    return (
        <div className="bg-brand-bg min-h-screen">
            <Banner title="About Me" subtitle="Biography, Skills & Technical Background" />

            <div className="py-12 pb-24">
                <div className="container mx-auto px-6 max-w-6xl space-y-16">
                    
                    {/* Back link */}
                    <div className="flex items-start">
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 uppercase font-extrabold text-xs tracking-wider rounded-xl bg-white border border-slate-200 text-brand-navy hover:border-brand-amber transition-all shadow-xs hover:shadow-sm"
                        >
                            <IconArrowLeft className="mr-2 h-4 w-4 text-brand-amber" /> Back to Home
                        </Link>
                    </div>

                    {/* Main Hero Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        
                        {/* Left Info Column */}
                        <div className="lg:col-span-7 space-y-6">
                            <div>
                                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-amber bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/30 inline-block mb-3">
                                    Senior Software Engineer
                                </span>
                                <h1 className="text-4xl sm:text-5xl font-black text-brand-navy tracking-tight leading-tight">
                                    Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber to-amber-600">Rowell Mark Blanca</span>
                                </h1>
                                <p className="text-base text-brand-slate mt-4 leading-relaxed font-medium">
                                    Over 12 years of hands-on software development experience partnering with agency leaders, corporate platforms, and clients across the US, UK, Hong Kong, and Philippines. Specializing in high-performance Next.js web applications, custom WordPress systems, and AI-driven automation workflows.
                                </p>
                            </div>

                            {/* Quick Contact Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
                                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                                        <Mail className="h-4 w-4 text-brand-amber" /> Email
                                    </div>
                                    <p className="text-xs sm:text-sm font-black text-brand-navy">rowellblanca94@gmail.com</p>
                                </div>

                                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
                                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                                        <Phone className="h-4 w-4 text-brand-amber" /> Phone / WhatsApp
                                    </div>
                                    <p className="text-xs sm:text-sm font-black text-brand-navy">+63 968 890 0418</p>
                                </div>
                            </div>

                            {/* Social Media & Action */}
                            <div className="pt-2 flex flex-wrap items-center gap-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Connect:</span>
                                <div className="flex items-center gap-2.5">
                                    {socialMedia.map(({ title, icon: Icon, url }, idx) => (
                                        <a
                                            key={idx}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={title}
                                            className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-amber hover:border-amber-400 hover:shadow-md transition-all shadow-xs"
                                        >
                                            <Icon size="18" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Photo Column */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-white p-3 group">
                                <Image
                                    src={rowellPic}
                                    alt="Rowell Mark Blanca"
                                    fill
                                    className="object-cover rounded-2xl group-hover:scale-102 transition-transform duration-500"
                                    sizes="(max-width: 1024px) 100vw, 450px"
                                    priority
                                />
                                
                                {/* Floating Experience Badge */}
                                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/20 text-white shadow-xl flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">Full-Stack & WP Engineer</p>
                                        <p className="text-sm font-black text-white mt-0.5">12+ Years Experience</p>
                                    </div>
                                    <Sparkles className="w-6 h-6 text-amber-400 shrink-0" />
                                </div>
                            </div>

                            <CVDownloadButton />
                        </div>

                    </div>

                    {/* Key Stats Bar */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                        {stats.map(({ label, value, icon: Icon }, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-center space-y-2 hover:shadow-md hover:border-amber-300 transition-all">
                                <Icon className="w-6 h-6 text-brand-amber mx-auto" />
                                <h3 className="text-3xl font-black text-brand-navy">{value}</h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Core Capabilities */}
                    <div className="space-y-6 pt-4">
                        <div className="text-center max-w-xl mx-auto space-y-2">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-amber bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/30 inline-block">
                                Core Capabilities
                            </span>
                            <h2 className="text-3xl font-black text-brand-navy">What I Build & Specialize In</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {coreCapabilities.map(({ title, description, icon: Icon }, idx) => (
                                <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 hover:shadow-md hover:border-amber-300 transition-all">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="text-lg font-black text-brand-navy">{title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Categorized Technical Summary Chips */}
                    <div className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-amber bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/30 inline-block">
                                Technology Matrix
                            </span>
                            <h2 className="text-3xl font-black text-brand-navy">Technical Skills & Ecosystem</h2>
                        </div>

                        <div className="space-y-4">
                            {techCategories.map(({ label, items }, idx) => (
                                <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-extrabold text-brand-navy uppercase tracking-wider border-b border-slate-100 pb-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                        {label}
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {items.map((item, i) => (
                                            <span
                                                key={i}
                                                className="bg-slate-100/90 border border-slate-200/90 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 transition-all cursor-default"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Interactive Scope & Architecture Estimator */}
                    <div id="project-estimator" className="pt-4">
                        <ProjectEstimator />
                    </div>

                    {/* How We Can Work Together (Engagement Models) */}
                    <EngagementModels />

                    {/* Interactive Speed Racer Game */}
                    <SpeedRacerGame />

                    {/* Bottom CTA Card */}
                    <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden border border-slate-800 text-center space-y-5">
                        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-amber bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/30 inline-block">
                                Let's Build Together
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                                Have a Project or Product in Mind?
                            </h2>
                            <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
                                Whether you need a full Next.js web application, a custom WordPress ecosystem, or AI workflow integrations, I'm available for technical contracts and high-impact projects.
                            </p>
                            <div className="pt-2 flex justify-center gap-4">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md hover:shadow-xl transition-all cursor-pointer"
                                >
                                    <Send className="h-4 w-4" />
                                    <span>Get In Touch</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
