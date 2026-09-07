'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ExternalLink,
  Mail,
  Target,
  Calendar,
  UserCheck,
  Briefcase,
  Star,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Cpu,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
  ChevronRight,
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

  const region = isUK ? 'UK 🇬🇧' : isUS ? 'US 🇺🇸' : 'Global 🌐';

  // Live URL cleaner
  const cleanUrl = project.url && project.url !== '#' ? project.url : null;
  const isPlugin =
    cleanUrl?.startsWith('wp-content') ||
    project.permalink?.includes('plugin') ||
    project.technologies?.some((t) => t.toLowerCase().includes('plugin'));

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#0b1a30] font-sans">
      
      {/* ─── 1. TOP HEADER & BREADCRUMBS BAR ─── */}
      <div className="bg-[#080f1d] border-b border-slate-800/80 text-white pt-28 pb-16 relative overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-6">
          
          {/* Breadcrumbs & Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Link href="/" className="hover:text-amber-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <Link href="/mywork" className="hover:text-amber-400 transition-colors">
                My Work
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-white font-bold truncate max-w-[200px] sm:max-w-xs">
                {project.sitename}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/mywork"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-bold transition-all shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                <span>All Projects</span>
              </Link>

              {cleanUrl && !isPlugin && (
                <a
                  href={cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-xs"
                >
                  <span>Visit Live Platform</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Badges Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-mono font-bold bg-white/10 text-white border border-white/15 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5">
              <span>{region}</span>
              <span>{project.client || 'Enterprise Client'}</span>
            </span>

            {project.category && (
              <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full">
                {project.category}
              </span>
            )}

            <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Verified Production Shipped
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-3 max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {project.sitename}
            </h1>
            {project.description && (
              <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-3xl">
                {project.description}
              </p>
            )}
          </div>

          {/* Key Engineering Telemetry Row */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider mr-1">
              Stack Architecture:
            </span>
            {project.technologies?.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono font-bold text-slate-200 bg-slate-900/90 border border-slate-700/80 px-3 py-1 rounded-lg"
              >
                {tech}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* ─── 2. CENTER-STAGE INTERACTIVE PREVIEW ─── */}
      <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-20">
        <div className="rounded-3xl shadow-2xl overflow-hidden border border-slate-200/90 bg-white">
          <ProjectDetailPreview project={project} />
        </div>
      </div>

      {/* ─── 3. ARCHITECTURE & SPECIFICATIONS MAIN GRID ─── */}
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column (8 cols): Executive Breakdown & Long Form Content */}
        <div className="lg:col-span-8 space-y-10">

          {/* Executive 3-Pillar Breakdown or Engineering Highlights */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Engineering Scope
              </span>
              <h2 className="text-xl font-black text-[#0b1a30] tracking-tight">
                {project.challenge || project.solution || project.results
                  ? 'Executive Case Study Breakdown'
                  : 'Core Engineering Highlights'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
                <div className="h-8 w-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-700 font-mono font-black text-xs">
                  01
                </div>
                <h3 className="font-extrabold text-[#0b1a30] text-xs uppercase tracking-wider">
                  {project.challenge ? 'The Challenge' : 'Architecture & Scope'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {project.challenge ||
                    `Engineered with ${project.technologies?.slice(0, 3).join(', ') || 'React & Next.js'} adhering to strict modular component architecture and sub-second rendering pipelines.`}
                </p>
              </div>

              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
                <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 font-mono font-black text-xs">
                  02
                </div>
                <h3 className="font-extrabold text-[#0b1a30] text-xs uppercase tracking-wider">
                  {project.solution ? 'Architectural Solution' : 'Performance & UX'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {project.solution ||
                    'Optimized for zero layout shift, smooth responsive typography, and tactile scroll-driven interaction states tested across mobile and desktop.'}
                </p>
              </div>

              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-mono font-black text-xs">
                  03
                </div>
                <h3 className="font-extrabold text-[#0b1a30] text-xs uppercase tracking-wider">
                  {project.results ? 'Production Impact' : 'Production Standards'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {project.results ||
                    'Fully responsive production deployment with streamlined bundle size, fast Time to Interactive, and modern aesthetic polish.'}
                </p>
              </div>
            </div>
          </div>

          {/* Long-Form Deep-Dive or Description */}
          {project.content ? (
            <div className="space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-sm">
              <h2 className="text-2xl font-black text-[#0b1a30] border-b border-slate-100 pb-4">
                Technical Case Study Deep-Dive
              </h2>
              <div
                className="prose prose-slate max-w-none text-slate-700 leading-relaxed prose-headings:font-black prose-headings:text-[#0b1a30] prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-a:text-[#1d63ed] prose-a:font-bold hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-amber-400 prose-blockquote:bg-amber-500/5 prose-blockquote:p-4 prose-blockquote:rounded-r-2xl prose-img:rounded-2xl prose-img:border prose-img:border-slate-200 prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            </div>
          ) : (
            <div className="space-y-4 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
              <h2 className="text-2xl font-black text-[#0b1a30]">About This Architecture</h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                {project.description}
              </p>
            </div>
          )}

          {/* Screenshot Gallery */}
          <ProjectGallery project={project} />

          {/* Interactive AI Architecture Co-Pilot (Dedicated Section) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Interactive Co-Pilot
              </span>
              <h3 className="text-xl font-black text-[#0b1a30] tracking-tight">
                Ask Questions About This Build&apos;s Architecture
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Query RowBot regarding latency budgets, caching strategies, database schema, and custom WordPress/Next.js implementations.
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

        {/* Right Column (4 cols): Sticky Sidebar Specs & Conversion */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">

          {/* 1. Technical Specifications Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-black text-[#0b1a30] text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-500" />
                <span>Architecture Specs</span>
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Production Shipped
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Client / Company:</span>
                <span className="font-bold text-[#0b1a30]">{project.client || 'Direct Client Build'}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Region:</span>
                <span className="font-bold text-[#0b1a30]">{region}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Category:</span>
                <span className="font-bold text-amber-700">{project.category || 'Web Platform'}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Role:</span>
                <span className="font-bold text-[#0b1a30]">{project.role || 'Senior Full-Stack Engineer'}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Timeline:</span>
                <span className="font-bold text-[#0b1a30]">{project.duration || 'Sprint Shipped'}</span>
              </div>

              {cleanUrl && (
                <div className="pt-2">
                  <span className="text-slate-500 font-medium block mb-1">Live Endpoint:</span>
                  <a
                    href={cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs font-bold text-amber-700 hover:text-amber-900 break-all flex items-center gap-1"
                  >
                    <span>{cleanUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* 2. Direct Technical Engagement CTA */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#0b1a30] border border-slate-800 text-white space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 border border-amber-400/30 px-3 py-0.5 rounded-full inline-flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Ready to Build?</span>
              </span>
              <h4 className="text-lg font-black text-white tracking-tight">
                Need Similar Platform Architecture?
              </h4>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Skip agency overhead and partner directly with a senior full-stack engineer for sub-second web platforms.
              </p>
            </div>

            <div className="pt-1 relative z-10 space-y-2.5">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-slate-950" />
                <span>Schedule Discovery Call</span>
              </button>

              <a
                href="mailto:rowellblanca94@gmail.com"
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="h-3.5 w-3.5 text-amber-400" />
                <span>rowellblanca94@gmail.com</span>
              </a>
            </div>
          </div>

          {/* 3. Author Engineer Capsule */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden relative border border-slate-200 bg-slate-100 shrink-0">
                <Image
                  src={authorAvatar || '/rowellbanner.png'}
                  alt="Rowell Mark Blanca"
                  fill
                  unoptimized
                  className="object-cover object-top"
                />
              </div>
              <div>
                <h5 className="font-extrabold text-[#0b1a30] text-sm">Rowell Mark Blanca</h5>
                <p className="text-[11px] text-slate-500 font-medium">Senior Full-Stack & Next.js Engineer</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              8+ years building enterprise React web apps, custom WordPress platforms, and serverless PostgreSQL architectures.
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[10px] font-mono font-bold text-slate-500">Connect:</span>
              <div className="flex gap-1.5">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700 flex items-center justify-center transition-all"
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ─── 4. FULL-WIDTH CLIENT TESTIMONIALS & SOCIAL PROOF ─── */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-slate-900 text-white border-t border-slate-800 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <TestimonialsSection
              testimonials={testimonials}
              dark={true}
              badge="★ Verified Stakeholder Proof"
              title="Client Endorsements & Proven Results"
              subtitle="What founders, CEOs, and agency partners say about shipping high-concurrency platforms with Rowell."
              className="p-0 border-0 shadow-none bg-transparent"
            />
          </div>
        </section>
      )}

      {/* ─── 5. NEXT PROJECT EXPLORATION BAR ─── */}
      {nextProject && (
        <div className="bg-slate-900 text-white py-12 border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Next in Portfolio →
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight">
                {nextProject.sitename}
              </h3>
              <p className="text-xs text-slate-300 font-medium line-clamp-1 max-w-xl">
                {nextProject.description}
              </p>
            </div>

            <Link
              href={`/mywork/${nextProject.permalink}`}
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-white text-slate-950 font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Explore Next Case Study</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* ─── 5. PROJECT ESTIMATOR & ENGAGEMENT FRAMEWORK ─── */}
      <div id="project-estimator" className="border-t border-slate-200 bg-white">
        <ProjectEstimator />
      </div>

      <EngagementModels />

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
}
