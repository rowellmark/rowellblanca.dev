'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IconArrowLeft } from '@tabler/icons-react';
import { ExternalLink, Mail, Target, Calendar, UserCheck, Briefcase, Star, Quote, Sparkles, MessageSquare, CheckCircle2 } from 'lucide-react';
import { IconBrandGithub, IconBrandLinkedin, IconBrandFacebook, IconBrandInstagram } from '@tabler/icons-react';
import { ProjectDetailPreview, ProjectGallery, PortfolioProject } from '@/components/ui/portfolio-card';
import { ContactModal } from '@/components/ui/contact-modal';
import { BlogAiAssistant } from '@/components/ui/blog-ai-assistant';
import { TestimonialsSection } from '@/components/homepage/testimonials';

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

    // Fetch client testimonials
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        const rawList = Array.isArray(data.testimonials) ? data.testimonials : Array.isArray(data) ? data : [];
        const activeList = rawList.filter((t: any) => t.active !== false);
        setTestimonials(activeList);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-brand-navy pb-24 font-sans">
      {/* Hero Header */}
      <div className="relative pt-32 pb-24 bg-gradient-to-br from-slate-900 via-[#0B172A] to-slate-950 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-violet-500/10 blur-[80px] pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-6 space-y-4">
          <Link
            href="/mywork"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-bold uppercase tracking-wider transition-all"
          >
            <IconArrowLeft className="h-4 w-4 text-brand-amber" /> Back to My Work
          </Link>

          {/* Category Pill */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {project.category && (
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500 text-slate-950 shadow-xs">
                {project.category}
              </span>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {project.sitename}
          </h1>

          {/* Client, Role & Duration Info */}
          {(project.client || project.role || project.duration) && (
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium pt-1">
              {project.client && (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-brand-amber" />
                  Client: <strong className="text-white font-bold">{project.client}</strong>
                </span>
              )}
              {project.role && (
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  Role: <strong className="text-white font-bold">{project.role}</strong>
                </span>
              )}
              {project.duration && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Timeline: <strong className="text-white font-bold">{project.duration}</strong>
                </span>
              )}
            </div>
          )}

          {/* URL & Source Link */}
          {project.url && project.url !== '#' && (
            <div className="flex items-center gap-2 text-sm text-slate-400 pt-1">
              <ExternalLink className="h-4 w-4 text-brand-amber" />
              {project.url.startsWith('wp-content') ? (
                <span className="font-mono text-amber-400 font-bold">Plugin Source: {project.url}</span>
              ) : (
                <a
                  href={project.url.startsWith('http') ? project.url : `https://${project.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-amber-400 hover:underline font-bold flex items-center gap-1"
                >
                  {project.url}
                </a>
              )}
            </div>
          )}

          {/* Technologies Used Moved Directly Below URL */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mr-1">Technologies Used:</span>
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-brand-amber border border-amber-500/30 shadow-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Side-by-Side Showcase: Scrollable Browser Preview + 450px AI Assistant & Profile */}
      <div className="max-w-[1440px] mx-auto px-6 -mt-14 relative z-20">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* Scrollable Browser Preview (Expanded Width) */}
          <div className="flex-1 min-w-0 w-full flex flex-col">
            <ProjectDetailPreview project={project} />
          </div>

          {/* AI Engineering Assistant + Profile Below (450px Width Column, Even Height) */}
          <div className="w-full lg:w-[450px] shrink-0 flex flex-col justify-between space-y-4">
            <div className="flex-1 min-h-0 flex flex-col">
              <BlogAiAssistant
                title={project.sitename}
                category={project.category}
                technologies={project.technologies}
                description={project.description}
                challenge={project.challenge}
                solution={project.solution}
                results={project.results}
                content={project.content}
                className="my-0 flex-1"
              />
            </div>

            {/* Rowell's Developer Profile Card Directly Below AI Assistant */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-3 text-xs shrink-0">
              <div className="flex items-center gap-3">
                {authorAvatar ? (
                  <div className="w-11 h-11 rounded-full overflow-hidden relative border border-slate-200 shrink-0">
                    <Image src={authorAvatar} alt="Rowell Mark Blanca" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-sm shrink-0 shadow-xs">
                    RB
                  </div>
                )}
                <div>
                  <h4 className="font-extrabold text-[#0b1a30] text-xs sm:text-sm">Rowell Mark Blanca</h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">Senior Full-Stack Engineer & WordPress Architect</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                8+ years of production experience building high-performance web platforms for UK and global companies.
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-500">Connect with Rowell:</span>
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
                      <Icon size="14" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content & Metadata Grid */}
      <div className="max-w-[1440px] mx-auto px-6 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column — Case Study / Description */}
        <div className="lg:col-span-8 space-y-8">
          {/* Executive Impact Cards */}
          {(project.challenge || project.solution || project.results) && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-[#0b1a30] flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-amber" /> Executive Case Study Breakdown
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {project.challenge && (
                  <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                    <div className="h-8 w-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-brand-amber font-black text-xs">
                      01
                    </div>
                    <h3 className="font-extrabold text-[#0b1a30] text-xs uppercase tracking-wider">The Challenge</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{project.challenge}</p>
                  </div>
                )}
                {project.solution && (
                  <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                    <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 font-black text-xs">
                      02
                    </div>
                    <h3 className="font-extrabold text-[#0b1a30] text-xs uppercase tracking-wider">The Solution</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{project.solution}</p>
                  </div>
                )}
                {project.results && (
                  <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                    <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-black text-xs">
                      03
                    </div>
                    <h3 className="font-extrabold text-[#0b1a30] text-xs uppercase tracking-wider">Key Impact</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{project.results}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Long-Form Blog Post Body OR About Description */}
          {project.content ? (
            <div className="space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-md">
              <h2 className="text-2xl font-black text-[#0b1a30] border-b border-slate-100 pb-4">
                Case Study Deep-Dive
              </h2>
              <div
                className="prose prose-slate max-w-none text-slate-700 leading-relaxed prose-headings:font-black prose-headings:text-[#0b1a30] prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-a:text-[#1d63ed] prose-a:font-bold hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-amber-400 prose-blockquote:bg-amber-500/5 prose-blockquote:p-4 prose-blockquote:rounded-r-2xl prose-img:rounded-2xl prose-img:border prose-img:border-slate-200 prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            </div>
          ) : (
            project.description && (
              <div className="space-y-4 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md">
                <h2 className="text-2xl font-black text-[#0b1a30]">About This Project</h2>
                <p className="text-base text-slate-700 leading-relaxed">{project.description}</p>
              </div>
            )
          )}

          <ProjectGallery project={project} />

          {/* Testimonials on Projects Section */}
          {testimonials.length > 0 && (
            <TestimonialsSection
              testimonials={testimonials}
              badge="★ Client Proof & Endorsements"
              title="Client Testimonials & Proven Results"
              subtitle="Endorsements from company leaders, agency partners, and tech stakeholders."
              className="py-12 bg-white rounded-3xl border border-slate-200/80 shadow-md my-8"
            />
          )}
        </div>

        {/* Right Column — Sidebar Meta & Direct CTA */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          {/* Quick Specs Box */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-3.5 text-xs">
            <h4 className="font-black text-[#0b1a30] text-sm border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Project At A Glance</span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                ● Live Production
              </span>
            </h4>

            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Client:</span>
              <span className="font-bold text-[#0b1a30]">{project.client || 'Bespoke Client Build'}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Category:</span>
              <span className="font-bold text-brand-amber">{project.category || 'Web Application'}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Role:</span>
              <span className="font-bold text-[#0b1a30]">{project.role || 'Senior Full-Stack Engineer'}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Timeline:</span>
              <span className="font-bold text-[#0b1a30]">{project.duration || 'Production Deployment'}</span>
            </div>

            {project.technologies && project.technologies.length > 0 && (
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Primary Tech:</span>
                <span className="font-bold text-slate-800">{project.technologies[0]}</span>
              </div>
            )}
          </div>

          {/* Have a Similar Project in Mind? CTA Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0b1a30] via-slate-900 to-indigo-950 border border-slate-800 text-white space-y-4 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-400/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Have a similar project in mind?</span>
              </span>
              <h4 className="text-lg font-black text-white">Let&apos;s Build Your Custom Platform</h4>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Partner with Rowell Mark Blanca for bespoke React, Next.js, and WordPress solutions tailored to your business goals.
              </p>
            </div>

            <div className="pt-1 relative z-10 space-y-3">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-slate-950" />
                <span>Book Discovery Call →</span>
              </button>

              <a
                href="mailto:rowellblanca94@gmail.com"
                className="flex items-center justify-center gap-2 text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors pt-1"
              >
                <Mail className="h-3.5 w-3.5 text-amber-400" />
                rowellblanca94@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
}
