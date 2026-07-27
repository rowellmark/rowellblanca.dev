'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import { ExternalLink, Mail, Target, Calendar, UserCheck, Briefcase } from 'lucide-react';
import { IconBrandGithub, IconBrandLinkedin, IconBrandFacebook, IconBrandInstagram } from '@tabler/icons-react';
import { ProjectDetailPreview, ProjectGallery, PortfolioProject } from '@/components/ui/portfolio-card';
import { ContactModal } from '@/components/ui/contact-modal';
import { BlogAiAssistant } from '@/components/ui/blog-ai-assistant';

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/rowellmark', Icon: IconBrandGithub },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rowell-blanca/', Icon: IconBrandLinkedin },
  { label: 'Facebook', href: 'https://www.facebook.com/itsmrrowrow', Icon: IconBrandFacebook },
  { label: 'Instagram', href: 'https://www.instagram.com/its.mr.row/', Icon: IconBrandInstagram },
];

export default function CaseStudyView({ project }: { project: PortfolioProject }) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-brand-navy pb-24 font-sans">
      {/* Hero Header */}
      <div className="relative pt-32 pb-24 bg-gradient-to-br from-slate-900 via-[#0B172A] to-slate-950 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-violet-500/10 blur-[80px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 space-y-4">
          <Link
            href="/mywork"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-bold uppercase tracking-wider transition-all"
          >
            <IconArrowLeft className="h-4 w-4 text-brand-amber" /> Back to My Work
          </Link>

          {/* Category & Tech Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {project.category && (
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500 text-slate-950 shadow-xs">
                {project.category}
              </span>
            )}

            {project.technologies?.slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-brand-amber border border-amber-500/30"
              >
                {t}
              </span>
            ))}
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

          {project.url && project.url !== '#' && (
            <div className="flex items-center gap-2 text-sm text-slate-400 pt-2">
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
        </div>
      </div>

      {/* Browser Mockup Showcase */}
      <div className="max-w-6xl mx-auto px-6 -mt-14 relative z-20">
        <ProjectDetailPreview project={project} />
      </div>

      {/* Content & Metadata Grid */}
      <div className="max-w-6xl mx-auto px-6 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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

          {project.technologies && project.technologies.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 bg-white shadow-md space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gemini AI Article Assistant */}
          <BlogAiAssistant
            title={project.sitename}
            category={project.category}
            technologies={project.technologies}
            description={project.description}
            challenge={project.challenge}
            solution={project.solution}
            results={project.results}
            content={project.content}
          />
        </div>

        {/* Right Column — Sidebar Meta & Direct CTA */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          {/* Quick Specs Box */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-4 text-xs">
            <h4 className="font-black text-[#0b1a30] text-sm border-b border-slate-100 pb-3">Project At A Glance</h4>
            {project.client && (
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Client:</span>
                <span className="font-bold text-[#0b1a30]">{project.client}</span>
              </div>
            )}
            {project.category && (
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Category:</span>
                <span className="font-bold text-brand-amber">{project.category}</span>
              </div>
            )}
            {project.role && (
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Role:</span>
                <span className="font-bold text-[#0b1a30]">{project.role}</span>
              </div>
            )}
            {project.duration && (
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Timeline:</span>
                <span className="font-bold text-[#0b1a30]">{project.duration}</span>
              </div>
            )}
          </div>

          {/* CTA Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-orange-500/10 border border-amber-300/60 space-y-4 shadow-md">
            <h4 className="text-lg font-black text-[#0b1a30]">Have a similar project in mind?</h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Let me help you build a fast, scalable digital solution tailored to your business goals.
            </p>

            <a
              href="mailto:rowellblanca94@gmail.com"
              className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-brand-amber transition-colors"
            >
              <Mail className="h-4 w-4 text-brand-amber" />
              rowellblanca94@gmail.com
            </a>

            <div className="flex gap-2 pt-1">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-amber hover:border-amber-300 transition-all shadow-xs"
                >
                  <Icon size="18" />
                </a>
              ))}
            </div>

            <button
              onClick={() => setIsContactModalOpen(true)}
              className="w-full text-center mt-2 px-6 py-3.5 rounded-2xl bg-brand-amber hover:bg-brand-amber-h text-brand-navy text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </div>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
}
