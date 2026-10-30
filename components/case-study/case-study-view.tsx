'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { ProjectDetailPreview, ProjectGallery, PortfolioProject } from '@/components/ui/portfolio-card';
import { BlogAiAssistant } from '@/components/ui/blog-ai-assistant';
import { TestimonialsSection } from '@/components/homepage/testimonials';
import { FALLBACK_PROJECTS } from '@/lib/fallback-projects';
import { ArticleToc } from '@/components/article/article-toc';
import { AuthorCard, ShareButtons } from '@/components/article/article-extras';
import { ServiceLinks, relatedServices } from '@/components/article/service-links';
import { DeviceShowcase } from '@/components/work/device-showcase';
import { stackForTech, stackHref } from '@/lib/stacks';

/** Split stored plain text into paragraphs (blank-line separated). */
function paragraphs(text?: string) {
  return (text || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

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

  // Only real write-up sections; the overview always comes from the description.
  const sections = [
    { title: 'The challenge', body: project.challenge },
    { title: 'The solution', body: project.solution },
    { title: 'The impact', body: project.results },
  ].filter((section): section is { title: string; body: string } => Boolean(section.body?.trim()));

  const pageUrl = `https://www.rowellblanca.dev/mywork/${project.permalink}`;
  const [intro, ...overview] = paragraphs(project.description);

  const specs = [
    { label: 'Client', value: project.client || 'Direct client build' },
    { label: 'Role', value: project.role || 'Senior Full-Stack Engineer' },
    { label: 'Timeline', value: project.duration || 'Delivered in sprints' },
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
                · <span className="motion-pulse h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" /> Live in production
              </span>
            </span>
            <h1 className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-[clamp(40px,6.4vw,104px)]">
              <span className="motion-mask">
                <span className="motion-rise motion-d1">{project.sitename}</span>
              </span>
            </h1>
            {intro && (
              <p className="motion-fade motion-d4 m-0 max-w-[760px] text-[17px] sm:text-xl leading-relaxed text-slate-300">
                {intro}
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
                {project.technologies?.map((tech) => {
                  const hub = stackForTech(tech);
                  const chip = 'font-mono text-xs px-3 py-1.5 rounded-full border border-white/15 text-slate-200';
                  return (
                    <li key={tech}>
                      {hub ? (
                        <Link href={stackHref(hub)} title={`More ${hub.name} work`} className={`${chip} inline-block hover:border-amber-400 hover:text-white transition-colors`}>
                          {tech}
                        </Link>
                      ) : (
                        <span className={`${chip} inline-block`}>{tech}</span>
                      )}
                    </li>
                  );
                })}
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
          {isPlugin ? <ProjectDetailPreview project={project} /> : <DeviceShowcase project={project} />}
        </div>
      </div>

      {/* ─── 3. ARTICLE: reading column + sticky rail ─── */}
      <div className="px-4 sm:px-6 lg:px-10 pt-16 lg:pt-28 pb-24 lg:pb-32">
        <div className="mx-auto max-w-[1360px] grid gap-10 lg:grid-cols-[240px_minmax(0,720px)] lg:justify-center lg:gap-20">
          <aside className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-10">
              <ArticleToc scope="#case-study-article" />
              <dl className="m-0 flex flex-col border-t border-brand-border">
                {[...specs, { label: 'Category', value: project.category || 'Web platform' }].map((spec) => (
                  <div key={spec.label} className="flex flex-col gap-0.5 py-3 border-b border-brand-border">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-brand-slate">{spec.label}</dt>
                    <dd className="m-0 text-[15px] font-semibold text-brand-navy">{spec.value}</dd>
                  </div>
                ))}
              </dl>
              {liveHref && !isPlugin && (
                <a href={liveHref} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 font-mono text-sm text-brand-navy break-all">
                  <span className="motion-underline">{cleanUrl}</span>
                  <ExternalLink className="w-4 h-4 shrink-0 text-amber-600" aria-hidden="true" />
                </a>
              )}
              <div className="flex flex-col gap-3">
                <p className="m-0 font-mono text-xs uppercase tracking-[0.08em] text-brand-slate">Share</p>
                <ShareButtons title={`${project.sitename} — case study`} url={pageUrl} />
              </div>
            </div>
          </aside>

          <article id="case-study-article" className="min-w-0 flex flex-col gap-12">
            <div className="lg:hidden">
              <ArticleToc scope="#case-study-article" variant="inline" />
            </div>

            <div className="case-study-content article-prose">
              {/* The hero already shows the first paragraph of the description. */}
              {overview.length > 0 && <h2>Overview</h2>}
              {overview.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              {/* No written-up sections yet: summarise the facts we do have. */}
              {overview.length === 0 && sections.length === 0 && !project.content && (
                <>
                  <h2>At a glance</h2>
                  <ul>
                    <li>
                      <strong>Category:</strong> {project.category || 'Web platform'}
                    </li>
                    <li>
                      <strong>Role:</strong> {project.role || 'Senior Full-Stack Engineer'} — architecture, build and launch
                    </li>
                    {project.technologies?.length ? (
                      <li>
                        <strong>Stack:</strong> {project.technologies.join(', ')}
                      </li>
                    ) : null}
                    <li>
                      <strong>Region:</strong> {region}
                    </li>
                    {liveHref && !isPlugin && (
                      <li>
                        <strong>Live:</strong>{' '}
                        <a href={liveHref} target="_blank" rel="noopener noreferrer">
                          {cleanUrl}
                        </a>
                      </li>
                    )}
                  </ul>
                  <p>
                    Want the details? Ask RowBot below how it was built — caching, data model, integrations and
                    performance budgets.
                  </p>
                </>
              )}
              {sections.map((section) => (
                <React.Fragment key={section.title}>
                  <h2>{section.title}</h2>
                  {paragraphs(section.body).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </React.Fragment>
              ))}
            </div>

            {project.content && (
              <div className="case-study-content article-prose" dangerouslySetInnerHTML={{ __html: project.content }} />
            )}

            {/* Screenshot Gallery */}
            <ProjectGallery project={project} />

            {/* Interactive AI Architecture Co-Pilot */}
            <div className="rounded-[28px] bg-white border border-brand-border p-6 sm:p-9 flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <span className="inline-flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-[0.08em] text-brand-slate">
                  <Sparkles className="w-4 h-4 text-amber-600" aria-hidden="true" /> Interactive co-pilot
                </span>
                <h2 className="m-0 text-[clamp(24px,2.4vw,32px)] font-extrabold tracking-[-0.03em] leading-tight">
                  Ask about this build&apos;s architecture
                </h2>
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

            <div className="flex flex-wrap items-center justify-between gap-4 border-y border-brand-border py-6">
              <p className="m-0 font-semibold text-brand-navy">Know someone planning a similar build? Share it.</p>
              <ShareButtons title={`${project.sitename} — case study`} url={pageUrl} />
            </div>

            <ServiceLinks services={relatedServices(`${project.sitename} ${project.category || ''} ${(project.technologies || []).join(' ')}`)} />

            <AuthorCard avatar={authorAvatar || undefined} service={`Similar build to ${project.sitename}`} />
          </article>
        </div>
      </div>

      {/* ─── 5. TESTIMONIALS ─── */}
      {testimonials.length > 0 && (
        <TestimonialsSection
          testimonials={testimonials}
          dark={true}
          badge="Verified stakeholder proof"
          title="Client endorsements & proven results"
          subtitle="What founders, CEOs, and agency partners say about building high-concurrency platforms with Rowell."
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

    </div>
  );
}
