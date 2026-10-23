'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { IconBrandGithub, IconBrandLinkedin, IconBrandFacebook, IconBrandInstagram } from '@tabler/icons-react';
import { ProjectDetailPreview, ProjectGallery, PortfolioProject } from '@/components/ui/portfolio-card';
import { ContactModal } from '@/components/ui/contact-modal';
import { BlogAiAssistant } from '@/components/ui/blog-ai-assistant';
import { TestimonialsSection } from '@/components/homepage/testimonials';
import { ProjectEstimator } from '@/components/homepage/project-estimator';
import { EngagementModels } from '@/components/homepage/engagement-models';
import { FALLBACK_PROJECTS } from '@/lib/fallback-projects';
import { resolveValidImageSrc } from '@/lib/image-utils';

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/rowellmark', Icon: IconBrandGithub },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rowell-blanca/', Icon: IconBrandLinkedin },
  { label: 'Facebook', href: 'https://www.facebook.com/itsmrrowrow', Icon: IconBrandFacebook },
  { label: 'Instagram', href: 'https://www.instagram.com/its.mr.row/', Icon: IconBrandInstagram },
];

interface Testimonial {
  id?: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarUrl?: string;
  rating: number;
  active?: boolean;
}

export default function CaseStudyView({ project }: { project: PortfolioProject }) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [authorAvatar, setAuthorAvatar] = useState<string>('');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [allProjects, setAllProjects] = useState<PortfolioProject[]>([]);

  useEffect(() => {
    // Fetch author avatar
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.authorAvatar) {
          setAuthorAvatar(data.settings.authorAvatar);
        }
      })
      .catch(() => {});

    // Fetch testimonials
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        const rawList = Array.isArray(data.testimonials) ? data.testimonials : Array.isArray(data) ? data : [];
        const activeList = rawList.filter((t: any) => t.active !== false);
        setTestimonials(activeList);
      })
      .catch(() => {});

    // Fetch projects catalog for next/prev navigation
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.projects)) {
          setAllProjects(data.projects.filter((p: any) => p.active !== false));
        }
      })
      .catch(() => {
        setAllProjects(FALLBACK_PROJECTS as any);
      });
  }, []);

  // Compute Next Project for seamless portfolio discovery
  const projectList = allProjects.length > 0 ? allProjects : (FALLBACK_PROJECTS as any);
  const currentIndex = projectList.findIndex((p: any) => p.permalink === project.permalink);
  const nextProject =
    currentIndex !== -1 && currentIndex < projectList.length - 1
      ? projectList[currentIndex + 1]
      : projectList[0] && projectList[0].permalink !== project.permalink
      ? projectList[0]
      : null;

  // Determine regional footprint
  const isUK =
    project.technologies?.some((t: string) => t.toLowerCase().includes('uk') || t.toLowerCase().includes('fca')) ||
    project.sitename?.toLowerCase().includes('macmanus') ||
    project.sitename?.toLowerCase().includes('tower');

  const isUS =
    project.sitename?.toLowerCase().includes('buildforuser') ||
    project.sitename?.toLowerCase().includes('hohnen');

  const region = isUK ? 'United Kingdom' : isUS ? 'United States' : 'Global';

  // Live URL cleaner
  const cleanUrl = project.url && project.url !== '#' ? project.url : null;
  const isPlugin =
    cleanUrl?.startsWith('wp-content') ||
    project.permalink?.includes('plugin') ||
    project.technologies?.some((t) => t.toLowerCase().includes('plugin'));

  const liveHref = cleanUrl ? (cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`) : null;

  const breakdown = [
    {
      title: project.challenge ? 'The challenge' : 'Architecture & scope',
      body:
        project.challenge ||
        `Engineered with ${project.technologies?.slice(0, 3).join(', ') || 'React & Next.js'} adhering to strict modular component architecture and sub-second rendering pipelines.`,
    },
    {
      title: project.solution ? 'Architectural solution' : 'Performance & UX',
      body:
        project.solution ||
        'Optimized for zero layout shift, smooth responsive typography, and tactile scroll-driven interaction states tested across mobile and desktop.',
    },
    {
      title: project.results ? 'Production impact' : 'Production standards',
      body:
        project.results ||
        'Fully responsive production deployment with streamlined bundle size, fast Time to Interactive, and modern aesthetic polish.',
    },
  ];

  const specs = [
    { label: 'Client', value: project.client || 'Direct client build' },
    { label: 'Role', value: project.role || 'Senior Full-Stack Engineer' },
    { label: 'Timeline', value: project.duration || 'Sprint shipped' },
    { label: 'Region', value: region },
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-navy font-sans">
      {/* ─── 1. HERO ─── */}
      <section className="bg-brand-ink text-white px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1360px] pt-32 lg:pt-40 pb-36 lg:pb-44 flex flex-col gap-10">
          <nav aria-label="Breadcrumb" className="motion-fade motion-d1 flex flex-wrap items-center gap-2 font-mono text-xs text-slate-400">
            <Link href="/" className="motion-underline hover:text-white">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/mywork" className="motion-underline hover:text-white">My Work</Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-200 truncate max-w-[60vw]" aria-current="page">{project.sitename}</span>
          </nav>

          <div className="flex flex-col gap-6 max-w-[1100px]">
            <span className="motion-fade motion-d1 inline-flex flex-wrap items-center gap-2.5 font-mono text-xs sm:text-[13px] uppercase tracking-[0.08em] text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
              {isPlugin ? 'WordPress plugin' : 'Case study'}
              {project.category ? ` · ${project.category}` : ''}
              <span className="inline-flex items-center gap-2 text-emerald-400">
                · <span className="motion-pulse h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" /> Shipped to production
              </span>
            </span>
            <h1 className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-[clamp(40px,6.4vw,104px)]">
              <span className="motion-mask">
                <span className="motion-rise motion-d1">{project.sitename}</span>
              </span>
            </h1>
            {project.description && (
              <p className="motion-fade motion-d4 m-0 max-w-[720px] text-[17px] sm:text-lg leading-relaxed text-slate-300 whitespace-pre-line line-clamp-6">
                {project.description.split('\n\n')[0]}
              </p>
            )}
          </div>

          <div className="motion-fade motion-d5 flex flex-col gap-8 border-t border-white/10 pt-8">
            <dl className="m-0 grid grid-cols-2 lg:grid-cols-4 gap-y-6">
              {specs.map((spec, i) => (
                <div key={spec.label} className={`flex flex-col-reverse gap-1.5 pr-4 ${i > 0 ? 'lg:pl-6 lg:border-l lg:border-white/10' : ''} ${i % 2 === 1 ? 'pl-6 border-l border-white/10' : ''}`}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">{spec.label}</dt>
                  <dd className="m-0 text-white font-semibold">{spec.value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <ul className="m-0 p-0 list-none flex flex-wrap gap-2" aria-label="Tech stack">
                {project.technologies?.map((tech) => (
                  <li key={tech} className="font-mono text-xs px-3 py-1.5 rounded-full border border-white/15 text-slate-200">
                    {tech}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/mywork"
                  className="motion-btn motion-magnetic inline-flex items-center gap-2.5 min-h-[52px] px-6 rounded-full border border-white/25 hover:border-white/60 font-semibold"
                >
                  <span aria-hidden="true">←</span> All projects
                </Link>
                {liveHref && !isPlugin && (
                  <a
                    href={liveHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="motion-btn motion-magnetic inline-flex items-center gap-2.5 min-h-[52px] px-6 rounded-full bg-amber-500 hover:bg-amber-400 text-brand-ink font-bold"
                  >
                    Visit live platform <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. INTERACTIVE PREVIEW (overlaps the hero) ─── */}
      <div className="px-4 sm:px-6 lg:px-10 -mt-24 lg:-mt-28 relative z-20">
        <div className="motion-reveal mx-auto max-w-[1360px] rounded-[28px] overflow-hidden bg-white border border-brand-border shadow-[0_40px_120px_-40px_rgba(11,16,32,0.6)]">
          <ProjectDetailPreview project={project} />
        </div>
      </div>

      {/* ─── 3. BREAKDOWN ─── */}
      <section className="px-4 sm:px-6 lg:px-10 pt-24 lg:pt-36">
        <div className="mx-auto max-w-[1360px] flex flex-col gap-12">
          <div className="motion-reveal flex flex-col gap-5">
            <p className="m-0 font-mono text-[13px] tracking-[0.08em] uppercase text-brand-slate">(01) — Engineering scope</p>
            <h2 className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-[clamp(36px,5vw,80px)]">
              {project.challenge || project.solution || project.results ? 'The case study, in brief.' : 'Core engineering highlights.'}
            </h2>
          </div>
          <ol className="m-0 p-0 list-none grid grid-cols-1 md:grid-cols-3 border-t border-brand-border">
            {breakdown.map((item, i) => (
              <li key={item.title} className={`motion-reveal flex flex-col gap-4 py-10 md:pr-10 ${i > 0 ? 'md:pl-10 md:border-l border-brand-border border-t md:border-t-0' : ''}`}>
                <span className="font-mono text-sm text-amber-700">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="m-0 text-2xl font-extrabold tracking-[-0.03em]">{item.title}</h3>
                <p className="m-0 text-brand-slate leading-relaxed whitespace-pre-line">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── 4. DEEP-DIVE + STICKY SIDEBAR ─── */}
      <section className="px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-8 flex flex-col gap-10">
            <article className="motion-reveal rounded-[28px] bg-white border border-brand-border p-7 sm:p-12 flex flex-col gap-6">
              <p className="m-0 font-mono text-[13px] tracking-[0.08em] uppercase text-brand-slate">(02) — Deep-dive</p>
              {project.content ? (
                <div className="case-study-content" dangerouslySetInnerHTML={{ __html: project.content }} />
              ) : (
                <>
                  <h2 className="m-0 text-[clamp(28px,3vw,44px)] font-extrabold tracking-[-0.04em] leading-tight">About this architecture</h2>
                  <p className="m-0 text-lg text-brand-slate leading-relaxed whitespace-pre-line">{project.description}</p>
                </>
              )}
            </article>

            {/* Screenshot Gallery */}
            <ProjectGallery project={project} />

            {/* Interactive AI Architecture Co-Pilot */}
            <div className="motion-reveal rounded-[28px] bg-white border border-brand-border p-7 sm:p-10 flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <span className="inline-flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-[0.08em] text-brand-slate">
                  <Sparkles className="w-4 h-4 text-amber-600" aria-hidden="true" /> Interactive co-pilot
                </span>
                <h3 className="m-0 text-[clamp(24px,2.4vw,32px)] font-extrabold tracking-[-0.03em] leading-tight">
                  Ask about this build&apos;s architecture
                </h3>
                <p className="m-0 text-brand-slate leading-relaxed">
                  Query RowBot about latency budgets, caching strategies, database schema, and custom WordPress/Next.js
                  implementations.
                </p>
              </div>
              <BlogAiAssistant
                title={project.sitename}
                category={project.category}
                technologies={project.technologies}
                description={project.description}
                challenge={project.challenge}
                solution={project.solution}
                results={project.results}
                content={project.content}
                className="my-0 border-0 p-0 shadow-none bg-transparent"
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-5">
            <div className="rounded-[28px] bg-brand-ink text-white p-7 sm:p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-slate-400">Architecture specs</span>
                <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" /> Shipped
                </span>
              </div>
              <dl className="m-0 flex flex-col border-t border-white/10">
                {[...specs, { label: 'Category', value: project.category || 'Web platform' }].map((spec) => (
                  <div key={spec.label} className="flex items-baseline justify-between gap-4 py-3 border-b border-white/10 text-sm">
                    <dt className="text-slate-400">{spec.label}</dt>
                    <dd className="m-0 font-semibold text-right">{spec.value}</dd>
                  </div>
                ))}
              </dl>
              {liveHref && (
                <a href={liveHref} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-3 font-mono text-sm text-amber-400 break-all">
                  <span className="motion-underline">{cleanUrl}</span>
                  <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                </a>
              )}
              <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
                <h4 className="m-0 text-xl font-extrabold tracking-[-0.02em]">Need a similar platform?</h4>
                <p className="m-0 text-sm text-slate-300 leading-relaxed">
                  Skip agency overhead and partner directly with a senior full-stack engineer.
                </p>
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(true)}
                  className="motion-btn motion-magnetic mt-2 w-full min-h-[56px] px-6 rounded-full bg-amber-500 hover:bg-amber-400 text-brand-ink font-bold flex items-center justify-between gap-3 cursor-pointer"
                >
                  Schedule a discovery call <span className="motion-arrow" aria-hidden="true">→</span>
                </button>
                <a href="mailto:hello@rowellblanca.dev" className="motion-underline self-start text-sm text-slate-300 hover:text-white">
                  hello@rowellblanca.dev
                </a>
              </div>
            </div>

            {/* Author */}
            <div className="rounded-[28px] bg-white border border-brand-border p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden relative bg-slate-100 shrink-0">
                  <Image src={authorAvatar || '/rowellbanner.png'} alt="Rowell Mark Blanca" fill unoptimized className="object-cover object-top" />
                </div>
                <div>
                  <p className="m-0 font-extrabold">Rowell Mark Blanca</p>
                  <p className="m-0 text-sm text-brand-slate">Senior Full-Stack &amp; Next.js Engineer</p>
                </div>
              </div>
              <div className="flex gap-2">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="h-11 w-11 rounded-full border border-brand-border hover:border-brand-navy text-brand-slate hover:text-brand-navy flex items-center justify-center transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ─── 5. TESTIMONIALS ─── */}
      {testimonials.length > 0 && (
        <TestimonialsSection
          testimonials={testimonials}
          dark={true}
          badge="Verified stakeholder proof"
          title="Client endorsements & proven results"
          subtitle="What founders, CEOs, and agency partners say about shipping high-concurrency platforms with Rowell."
        />
      )}

      {/* ─── 6. NEXT PROJECT ─── */}
      {nextProject && (
        <Link
          href={`/mywork/${nextProject.permalink}`}
          data-cursor="view"
          className="group block bg-brand-ink text-white border-t border-white/10 px-4 sm:px-6 lg:px-10"
        >
          <div className="mx-auto max-w-[1360px] py-20 lg:py-28 flex flex-col gap-6">
            <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-slate-400">Next case study</span>
            <span className="flex items-end justify-between gap-8">
              <span className="font-extrabold tracking-[-0.05em] leading-[0.95] text-[clamp(40px,7vw,120px)] group-hover:text-amber-500 transition-colors duration-500">
                {nextProject.sitename}
              </span>
              <span aria-hidden="true" className="hidden sm:flex h-20 w-20 lg:h-28 lg:w-28 shrink-0 rounded-full border border-white/20 items-center justify-center text-3xl transition-transform duration-500 group-hover:-rotate-45 group-hover:border-amber-500">
                →
              </span>
            </span>
            <span className="max-w-[640px] text-slate-400 line-clamp-2">{nextProject.description?.split('\n\n')[0]}</span>
          </div>
        </Link>
      )}

      {/* ─── 7. PROJECT ESTIMATOR & ENGAGEMENT FRAMEWORK ─── */}
      <div id="project-estimator" className="pt-24 lg:pt-32">
        <ProjectEstimator />
      </div>

      <EngagementModels />

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
}
