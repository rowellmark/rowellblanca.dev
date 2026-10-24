import { Metadata } from "next";
import rowellbanner from "@/assets/images/rowellbanner.png";
import Image from "next/image";
import { CVDownloadButton } from "@/components/ui/cv-download-button";
import { IconBrandGithub, IconBrandLinkedin, IconBrandFacebook, IconBrandInstagram, IconCode, IconCpu, IconRocket, IconShieldCheck } from "@tabler/icons-react";
import { PageHero } from "@/components/ui/page-hero";
import { TechGalaxy } from "@/components/homepage/tech-galaxy";
import WorkHistory from "@/components/homepage/work-history";
import { ProjectEstimator } from "@/components/homepage/project-estimator";
import { EngagementModels } from "@/components/homepage/engagement-models";
import { SpeedRacerGame } from "@/components/interactive/speed-racer-game";
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: "About Rowell Mark Blanca — Senior Full-Stack Developer",
  description:
    "12+ years building React, Next.js and custom WordPress platforms for UK, US and Australian businesses. Background, skills, tech stack and career history.",
  keywords: ["Rowell Mark Blanca", "senior full-stack developer", "Next.js developer", "WordPress developer", "freelance web developer"],
});

export default function AboutPage() {
    const socialMedia = [
        { title: 'GitHub', icon: IconBrandGithub, url: 'https://github.com/rowellmark' },
        { title: 'LinkedIn', icon: IconBrandLinkedin, url: 'https://www.linkedin.com/in/rowell-blanca/' },
        { title: 'Facebook', icon: IconBrandFacebook, url: 'https://www.facebook.com/itsmrrowrow' },
        { title: 'Instagram', icon: IconBrandInstagram, url: 'https://www.instagram.com/its.mr.row/' },
    ];

    const stats = [
        { label: "Years of experience", value: "12+" },
        { label: "Job success rate", value: "100%" },
        { label: "Production builds", value: "50+" },
        { label: "Timezone overlap", value: "UK·US·AU" },
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
            items: ["Node.js (Express)", "PHP (Laravel, WordPress)", "PostgreSQL", "NeonDB", "Prisma ORM", "MySQL", "Redis", "REST & GraphQL APIs"],
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
            <PageHero
                label="About · Senior full-stack software engineer"
                titleLines={["Hi, I'm", "Rowell Mark Blanca."]}
                accentLine={1}
                lead="Over 12 years of hands-on software development partnering with agency leaders, corporate platforms, and clients across the US, UK, Hong Kong, and the Philippines — specializing in high-performance Next.js apps, custom WordPress systems, and AI-driven automation."
            >
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <dl className="m-0 flex flex-wrap gap-x-10 gap-y-4">
                        <div className="flex flex-col-reverse gap-1">
                            <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">Email</dt>
                            <dd className="m-0"><a href="mailto:hello@rowellblanca.dev" className="motion-underline text-white font-semibold">hello@rowellblanca.dev</a></dd>
                        </div>
                        <div className="flex flex-col-reverse gap-1">
                            <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">Phone / WhatsApp</dt>
                            <dd className="m-0"><a href="tel:+639688900418" className="motion-underline text-white font-semibold">+63 968 890 0418</a></dd>
                        </div>
                    </dl>
                    <div className="flex flex-wrap items-center gap-3">
                        {socialMedia.map(({ title, icon: Icon, url }) => (
                            <a
                                key={title}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={title}
                                className="h-[52px] w-[52px] rounded-full border border-white/15 hover:border-amber-400 text-slate-300 hover:text-amber-400 flex items-center justify-center transition-colors"
                            >
                                <Icon size="18" />
                            </a>
                        ))}
                        <CVDownloadButton tone="dark" />
                    </div>
                </div>
            </PageHero>

            {/* Portrait + stats */}
            <section className="px-4 sm:px-6 lg:px-10 pt-20 lg:pt-28">
                <div className="mx-auto max-w-[1360px] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                    <div className="motion-reveal lg:col-span-5 relative aspect-[4/5] rounded-[28px] overflow-hidden bg-brand-cream">
                        <Image
                            src={rowellbanner}
                            alt="Rowell Mark Blanca — Senior Software Engineer"
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 1024px) 100vw, 520px"
                            priority
                        />
                        <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-brand-ink/90 backdrop-blur-md text-white px-5 py-4 flex items-center justify-between gap-4">
                            <span className="flex flex-col gap-0.5">
                                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-amber-400">Full-stack & WP engineer</span>
                                <span className="font-extrabold">12+ years experience</span>
                            </span>
                            <span className="motion-pulse h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
                        </div>
                    </div>
                    <div className="lg:col-span-7 flex flex-col gap-10">
                        <div className="motion-reveal flex flex-col gap-5">
                            <p className="m-0 font-mono text-[13px] tracking-[0.08em] uppercase text-brand-slate">(01) — At a glance</p>
                            <h2 className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(36px,4.6vw,72px)]">
                                Senior engineering, without the agency layer.
                            </h2>
                        </div>
                        <dl className="m-0 grid grid-cols-2 border-t border-brand-border">
                            {stats.map(({ label, value }, i) => (
                                <div key={label} className={`motion-reveal flex flex-col-reverse gap-2 py-7 border-b border-brand-border ${i % 2 === 1 ? 'pl-6 border-l' : 'pr-6'}`}>
                                    <dt className="text-brand-slate">{label}</dt>
                                    <dd className="m-0 font-extrabold tracking-[-0.05em] leading-none text-brand-navy text-[clamp(36px,4vw,64px)]">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </section>

            {/* Core capabilities */}
            <section className="px-4 sm:px-6 lg:px-10 pt-24 lg:pt-36">
                <div className="mx-auto max-w-[1360px] flex flex-col gap-12">
                    <div className="motion-reveal flex flex-col gap-5">
                        <p className="m-0 font-mono text-[13px] tracking-[0.08em] uppercase text-brand-slate">(02) — Core capabilities</p>
                        <h2 className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(36px,5vw,80px)]">What I build.</h2>
                    </div>
                    <ol className="m-0 p-0 list-none grid grid-cols-1 md:grid-cols-2 border-t border-brand-border">
                        {coreCapabilities.map(({ title, description, icon: Icon }, i) => (
                            <li key={title} className={`motion-reveal flex gap-6 py-10 border-b border-brand-border ${i % 2 === 1 ? 'md:pl-10 md:border-l' : 'md:pr-10'}`}>
                                <span className="font-mono text-sm text-amber-700 pt-1.5">{String(i + 1).padStart(2, '0')}</span>
                                <div className="flex flex-col gap-3">
                                    <h3 className="m-0 flex items-center gap-3 text-2xl font-extrabold tracking-[-0.03em] text-brand-navy">
                                        <Icon size={22} className="text-amber-600 shrink-0" aria-hidden="true" />
                                        {title}
                                    </h3>
                                    <p className="m-0 text-brand-slate leading-relaxed">{description}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Technical skills */}
            <section className="px-4 sm:px-6 lg:px-10 pt-24 lg:pt-36">
                <div className="mx-auto max-w-[1360px] flex flex-col gap-12">
                    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
                        <div className="motion-reveal flex flex-col gap-5">
                            <p className="m-0 font-mono text-[13px] tracking-[0.08em] uppercase text-brand-slate">(03) — Technology matrix</p>
                            <h2 className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(36px,5vw,80px)]">Skills & ecosystem.</h2>
                            <p className="m-0 max-w-[480px] text-brand-slate text-[17px] leading-relaxed">
                                The tools I reach for every day — from React and Next.js on the front end to PostgreSQL, Prisma and
                                WordPress behind it, deployed on Vercel.
                            </p>
                        </div>
                        <div className="motion-reveal rounded-[28px] bg-brand-ink p-6 sm:p-10 overflow-hidden">
                            <TechGalaxy className="max-w-[480px] mx-auto" />
                        </div>
                    </div>
                    <dl className="m-0 flex flex-col border-t border-brand-border">
                        {techCategories.map(({ label, items }) => (
                            <div key={label} className="motion-reveal grid grid-cols-1 md:grid-cols-12 gap-4 py-7 border-b border-brand-border">
                                <dt className="md:col-span-3 font-mono text-[13px] uppercase tracking-[0.08em] text-brand-slate pt-2">{label}</dt>
                                <dd className="md:col-span-9 m-0">
                                    <ul className="m-0 p-0 list-none flex flex-wrap gap-2">
                                        {items.map((item) => (
                                            <li key={item} className="px-3.5 py-2 rounded-full border border-brand-border bg-white text-sm font-medium text-brand-navy">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            {/* Verified Career & Work History */}
            <WorkHistory />

            {/* Interactive Scope & Architecture Estimator */}
            <div id="project-estimator" className="border-t border-brand-border pt-24 lg:pt-32">
                <ProjectEstimator />
            </div>

            {/* How We Can Work Together (Engagement Models) */}
            <EngagementModels />

            {/* Interactive Speed Racer Game */}
            <div className="px-4 sm:px-6 lg:px-10 pb-24">
                <div className="mx-auto max-w-[1360px]">
                    <SpeedRacerGame />
                </div>
            </div>
        </div>
    );
}
