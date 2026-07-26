'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Monitor, Smartphone, Maximize2, X, ExternalLink, ArrowRight, Package, Terminal, Code2, CheckCircle2, Cpu, Sparkles, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';


// ─── Shared Project Type ──────────────────────────────────────────────────────

export interface PortfolioProject {
  key?: number;
  url: string;
  image: string;
  mobileImage?: string;
  fullDesktopImage?: string;
  fullMobileImage?: string;
  screenshots?: string[];
  sitename: string;
  permalink: string;
  technologies: string[];
  description?: string;
}


import { resolveValidImageSrc } from '@/lib/image-utils';

function getImageSrc(imgSrc?: string | null) {
  return resolveValidImageSrc(imgSrc);
}


// ─── WordPress Plugin Dedicated Card ──────────────────────────────────────────

export function WordPressPluginCard({ project, index = 0 }: { project: PortfolioProject; index?: number }) {
  return (
    <div className="group relative rounded-2xl border border-indigo-950/40 bg-gradient-to-b from-[#0e1626] to-[#070d18] shadow-md hover:shadow-2xl hover:border-indigo-500/50 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col text-white">
      {/* Top Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shrink-0" />

      {/* Code Header Bar */}
      <div className="p-3.5 bg-[#111927] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          <span className="text-[10px] font-mono text-slate-400 ml-2 truncate max-w-[150px]">
            {project.url.replace('wp-content/plugins/', '') || 'plugin.php'}
          </span>
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
          <Package className="w-3 h-3 text-indigo-400" />
          WP Plugin
        </span>
      </div>

      {/* Code Snippet Spec Preview */}
      <div className="p-4 bg-[#080d17] font-mono text-[11px] space-y-1 text-slate-300 border-b border-slate-800/80 select-none">
        <div className="text-purple-400 font-semibold">&lt;?php</div>
        <div className="text-slate-500 font-semibold">{"/**"}</div>
        <div className="text-slate-300 pl-2 truncate">
          * <span className="text-cyan-300 font-bold">Plugin Name:</span> {project.sitename.split('—')[0]}
        </div>
        <div className="text-slate-400 pl-2">
          * <span className="text-amber-400 font-bold">Engine:</span> Custom PHP &bull; Hooks &bull; REST API
        </div>
        <div className="text-slate-500 font-semibold">{"*/"}</div>
      </div>


      {/* Main Info */}
      <div className="p-5 flex flex-col flex-1 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-black text-white text-base leading-snug group-hover:text-cyan-400 transition-colors">
            {project.sitename}
          </h3>
        </div>

        {project.description && (
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 font-normal">
            {project.description}
          </p>
        )}

        {/* Feature badges */}
        <div className="space-y-1.5 pt-1 text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold text-slate-200">Production WordPress Plugin Package</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Cpu className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold text-slate-200">PHP 8+ Compatible & Security Hardened</span>
          </div>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800">
          {project.technologies?.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-950/70 text-indigo-200 border border-indigo-800/60"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`/mywork/${project.permalink}`}
          className="mt-auto pt-2 inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-slate-900 text-white font-extrabold text-xs border border-indigo-500/40 hover:border-slate-700 shadow-md hover:shadow-xl transition-all duration-300 group/btn cursor-pointer"
        >
          <span>Explore Plugin Architecture</span>
          <ArrowRight className="h-3.5 w-3.5 text-amber-400 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}


// ─── Browser Chrome Wrapper ───────────────────────────────────────────────────

function BrowserChrome({
  url,
  children,
  onMaximize,
  showToggle = true,
  previewMode,
  setPreviewMode,
  size = 'card',
}: {
  url: string;
  children: React.ReactNode;
  onMaximize?: () => void;
  showToggle?: boolean;
  previewMode: 'desktop' | 'mobile';
  setPreviewMode: (m: 'desktop' | 'mobile') => void;
  size?: 'card' | 'detail';
}) {
  const iconSize = size === 'detail' ? 'h-3 w-3' : 'h-2.5 w-2.5';
  const dotSize = size === 'detail' ? 'h-2.5 w-2.5' : 'h-2 w-2';
  const urlSize = size === 'detail' ? 'text-[10px]' : 'text-[8px]';

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-[#1a191d]">
      {/* Chrome bar */}
      <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#111] border-b border-white/10">
        <div className={`${dotSize} rounded-full bg-rose-500`} />
        <div className={`${dotSize} rounded-full bg-amber-400`} />
        <div className={`${dotSize} rounded-full bg-emerald-400`} />

        {/* URL bar */}
        <div className={`flex-1 mx-2 h-5 rounded-full bg-[#2a2a2a] border border-white/10 flex items-center px-2 gap-1.5 overflow-hidden`}>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span className={`${urlSize} font-mono text-white/40 truncate`}>{url || 'rowellblanca.dev'}</span>
        </div>

        {/* Desktop / Mobile toggle */}
        {showToggle && (
          <div className="flex items-center bg-[#2a2a2a] rounded-md p-0.5 gap-0.5">
            <button
              onClick={() => setPreviewMode('desktop')}
              title="Desktop preview"
              className={`p-0.5 rounded transition-all ${previewMode === 'desktop' ? 'bg-white/20 text-white' : 'text-white/30 hover:text-white/60'}`}
            >
              <Monitor className={iconSize} />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              title="Mobile preview"
              className={`p-0.5 rounded transition-all ${previewMode === 'mobile' ? 'bg-white/20 text-white' : 'text-white/30 hover:text-white/60'}`}
            >
              <Smartphone className={iconSize} />
            </button>
          </div>
        )}

        {/* Maximise button */}
        {onMaximize && (
          <button
            onClick={onMaximize}
            title="Fullscreen preview"
            className="ml-1 p-1 rounded text-white/30 hover:text-white hover:bg-white/10 transition-all"
          >
            <Maximize2 className={iconSize} />
          </button>
        )}
      </div>

      {children}
    </div>
  );
}

// ─── Screenshot Preview (desktop or phone frame) ──────────────────────────────

function ScreenshotPreview({
  project,
  mobile = false,
  height = 'h-44',
}: {
  project: PortfolioProject;
  mobile?: boolean;
  height?: string;
}) {
  if (!mobile) {
    return (
      <div className={`relative ${height} overflow-hidden bg-[#111]`}>
        <Image
          src={getImageSrc(project.image || project.fullDesktopImage)}
          alt={project.sitename}
          fill
          className="object-cover object-left-top"
          sizes="(max-width: 768px) 100vw, 640px"
          unoptimized
        />
      </div>
    );
  }

  // Phone frame
  const mobileSrc = getImageSrc(project.mobileImage || project.fullMobileImage || project.image);


  return (
    <div className={`${height} bg-[#111] flex items-center justify-center p-3`}>
      <div className="relative shadow-2xl transition-all" style={{ width: '90px', height: '150px' }}>
        <div className="absolute inset-0 rounded-2xl bg-[#222] border border-white/20" />
        <div className="absolute inset-1 rounded-xl overflow-hidden bg-black">
          <Image
            src={mobileSrc}
            alt={`${project.sitename} Mobile`}
            fill
            className="object-cover object-left-top"
            sizes="90px"
            unoptimized
          />
        </div>
        {/* Notch */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 h-2 w-10 rounded-full bg-[#222] z-10" />
        {/* Home bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-white/30 z-10" />
      </div>
    </div>
  );
}

// ─── Portfolio Card ───────────────────────────────────────────────────────────

const ACCENT_COLORS = [
  'from-amber-400 via-orange-500 to-amber-400',
  'from-violet-400 via-indigo-500 to-violet-400',
  'from-sky-400 via-blue-500 to-sky-400',
  'from-emerald-400 via-teal-500 to-emerald-400',
];

const ACCENT_TEXT_COLORS = ['text-amber-600', 'text-violet-600', 'text-sky-600', 'text-emerald-600'];

const TAG_STYLES: Record<string, string> = {
  'React': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'React/Nextjs': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Next.js': 'bg-slate-900 text-white border-slate-700',
  'TypeScript': 'bg-blue-50 text-blue-700 border-blue-200',
  'PHP': 'bg-violet-50 text-violet-700 border-violet-200',
  'Wordpress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Wordpress Plugins': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Node.js': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Prisma': 'bg-teal-50 text-teal-700 border-teal-200',
  'NeonDB': 'bg-lime-50 text-lime-700 border-lime-200',
};

function getTagStyle(tag: string) {
  return TAG_STYLES[tag] || 'bg-slate-100 text-slate-700 border-slate-200';
}

export function PortfolioCard({ project, index = 0 }: { project: PortfolioProject; index?: number }) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [modalOpen, setModalOpen] = useState(false);

  const isPlugin =
    project.url?.startsWith('wp-content') ||
    project.permalink?.includes('plugin') ||
    project.technologies?.some((t) => t.toLowerCase() === 'wordpress plugins');


  if (isPlugin) {
    return <WordPressPluginCard project={project} index={index} />;
  }

  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const accentText = ACCENT_TEXT_COLORS[index % ACCENT_TEXT_COLORS.length];



  return (
    <>
      <div className="group relative rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/60 shadow-sm hover:shadow-2xl hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col">
        {/* Accent top bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${accent} shrink-0`} />

        <BrowserChrome
          url={project.url}
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
          onMaximize={() => setModalOpen(true)}
        >
          {/* Preview area */}
          <div className="relative">
            <ScreenshotPreview project={project} mobile={previewMode === 'mobile'} height="h-44" />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
              <Link
                href={`/mywork/${project.permalink}`}
                className="px-4 py-2 rounded-full bg-brand-amber text-brand-navy text-xs font-extrabold shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform"
              >
                <ExternalLink className="h-3.5 w-3.5" /> View Project
              </Link>
            </div>
          </div>
        </BrowserChrome>

        {/* Card info */}
        <div className="p-5 flex flex-col flex-1">
          {project.technologies?.[0] && (
            <span className={`text-[10px] font-extrabold uppercase tracking-wider ${accentText} mb-1.5`}>
              {project.technologies[0]}
            </span>
          )}

          <div className="flex items-start justify-between gap-2">
            <h3 className="font-extrabold text-brand-navy text-base leading-snug line-clamp-2 group-hover:text-brand-amber transition-colors">{project.sitename}</h3>
            {project.url && project.url !== '#' && (
              <a
                href={project.url.startsWith('http') ? project.url : `https://${project.url}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Visit live site"
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 h-7 w-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand-amber hover:border-amber-300 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          {project.description && (
            <p className="mt-1.5 text-xs text-brand-slate leading-relaxed flex-1 line-clamp-2">{project.description}</p>
          )}

          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
            {project.technologies?.slice(1, 4).map((tag) => (
              <span
                key={tag}
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${getTagStyle(tag)}`}
              >
                {tag}
              </span>
            ))}
            {project.technologies && project.technologies.length > 4 && (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          <Link
            href={`/mywork/${project.permalink}`}
            className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-900 text-slate-800 hover:text-white text-xs font-extrabold border border-slate-200 hover:border-slate-800 transition-all duration-300 group/btn shadow-xs hover:shadow-md cursor-pointer"
          >
            <span>View Case Study</span>
            <ArrowRight className="h-3.5 w-3.5 text-amber-500 group-hover/btn:text-amber-400 group-hover/btn:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>

      {modalOpen && <ProjectModal project={project} onClose={() => setModalOpen(false)} />}
    </>
  );
}

// ─── Fullscreen MacBook / Phone Modal ─────────────────────────────────────────

export function ProjectModal({ project, onClose }: { project: PortfolioProject; onClose: () => void }) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const mobileSrc = getImageSrc(project.fullMobileImage || project.mobileImage || project.image);
  const desktopSrc = getImageSrc(project.fullDesktopImage || project.image);


  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm px-4 overflow-y-auto py-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        {/* Desktop / Mobile toggle */}
        <div className="flex items-center gap-2 mb-5">
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${previewMode === 'desktop' ? 'bg-white text-slate-800' : 'text-white/60 hover:text-white border border-white/20'}`}
          >
            <Monitor className="h-3.5 w-3.5" /> Desktop Screenshot
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${previewMode === 'mobile' ? 'bg-white text-slate-800' : 'text-white/60 hover:text-white border border-white/20'}`}
          >
            <Smartphone className="h-3.5 w-3.5" /> Mobile Screenshot
          </button>
        </div>

        {previewMode === 'desktop' ? (
          <>
            {/* MacBook lid */}
            <div
              className="relative rounded-t-2xl rounded-b-lg overflow-hidden shadow-2xl"
              style={{ width: 'min(680px, 90vw)', background: 'linear-gradient(160deg,#d4d4d4 0%,#b8b8b8 40%,#c8c8c8 100%)', padding: '12px 12px 8px' }}
            >
              <div className="absolute top-3 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-slate-600/60 border border-slate-500/30" />
              <div className="rounded-lg overflow-hidden" style={{ marginTop: '8px', background: '#0a0a0a', padding: '4px' }}>
                <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#1a1a1a]">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <div className="flex-1 mx-3 h-6 rounded-full bg-[#2a2a2a] border border-white/10 flex items-center px-3 gap-1.5 overflow-hidden">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-[10px] font-mono text-white/40 truncate">{project.url || 'rowellblanca.dev'}</span>
                  </div>
                </div>
                <div className="relative" style={{ height: 'min(340px, 48vw)' }}>
                  <Image
                    src={desktopSrc}
                    alt={project.sitename}
                    fill
                    className="object-cover object-left-top"
                    sizes="680px"
                    unoptimized
                  />
                </div>
              </div>
            </div>
            {/* MacBook base */}
            <div
              className="relative"
              style={{ width: 'min(720px, 95vw)', height: '22px', background: 'linear-gradient(180deg,#c8c8c8 0%,#b0b0b0 100%)', borderRadius: '0 0 8px 8px', boxShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
            >
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-md" style={{ width: '100px', height: '12px', background: 'rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.1)' }} />
            </div>
            <div className="mt-2 rounded-full opacity-40" style={{ width: 'min(680px, 90vw)', height: '12px', background: 'radial-gradient(ellipse at center,rgba(0,0,0,0.6) 0%,transparent 70%)' }} />
          </>
        ) : (
          /* Phone mockup */
          <div className="relative" style={{ width: '220px', height: '420px' }}>
            <div className="absolute inset-0 rounded-[36px] shadow-2xl border-4 border-[#333]" style={{ background: 'linear-gradient(160deg,#2d2d2d 0%,#1a1a1a 100%)' }} />
            <div className="absolute inset-2 rounded-[28px] overflow-hidden bg-black">
              <div className="bg-[#111] px-4 py-2 flex items-center justify-between">
                <span className="text-[9px] text-white/60 font-mono">9:41</span>
                <div className="flex gap-1">
                  <div className="h-1.5 w-4 rounded-full bg-white/40" />
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
              </div>
              <div className="relative" style={{ height: 'calc(100% - 30px)' }}>
                <Image
                  src={mobileSrc}
                  alt={`${project.sitename} Mobile View`}
                  fill
                  className="object-cover object-left-top"
                  sizes="220px"
                  unoptimized
                />
              </div>
            </div>
            {/* Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 h-3.5 w-16 rounded-full bg-black z-10" />
            {/* Home bar */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 h-1 w-20 rounded-full bg-white/30 z-10" />
          </div>
        )}

        {/* Project label */}
        <div className="mt-6 text-center space-y-1">
          <p className="text-white font-bold text-lg">{project.sitename}</p>
          {project.url && <p className="text-white/50 text-sm font-mono">{project.url}</p>}
          <div className="flex items-center justify-center gap-3 mt-4">
            <Link
              href={`/mywork/${project.permalink}`}
              className="px-5 py-2 rounded-xl bg-[#F8C15F] text-black text-sm font-bold hover:bg-[#E7A737] transition-all"
              onClick={onClose}
            >
              Read More
            </Link>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-white/25 text-white text-sm font-semibold hover:bg-white/10 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WordPress Plugin Detail Preview ─────────────────────────────────────────

export function WordPressPluginDetailPreview({ project }: { project: PortfolioProject }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const getPluginScreenshots = () => {
    if (project.permalink === 'blanc-login-customizer') {
      return [
        { title: 'Screenshot 1 • Split-Panel Login Screen UI', desc: 'Custom dual-panel login interface with logo branding and responsive glassmorphism background.', tag: 'Login Screen UI' },
        { title: 'Screenshot 2 • Secret URL & Security Slug Rewriter', desc: 'Renames /wp-admin and /wp-login.php to custom secret URLs to prevent brute-force attacks.', tag: 'Security & Slugs' },
        { title: 'Screenshot 3 • Live Admin Branding Customizer', desc: 'Live admin preview for logo uploads, custom form positioning, button styling, and copyright footers.', tag: 'Branding Editor' },
        { title: 'Screenshot 4 • BuildForUser Dashboard Core Authorization', desc: 'Centralized BuildForUser core plugin authorization gate and shared asset manager.', tag: 'WP Core Gate' },
      ];
    } else if (project.permalink === 'blanc-leads-plugin') {
      return [
        { title: 'Screenshot 1 • Native WP CRM Kanban Board', desc: 'Drag-and-drop lead stage management (New, Contacted, Qualified, Proposal Sent, Won, Lost) inside WordPress.', tag: 'Kanban CRM' },
        { title: 'Screenshot 2 • Multi-Provider AI Nurturing Pipeline', desc: 'Connects to OpenAI, Claude, Gemini, and Ollama for 1-100 lead scoring and email draft generation.', tag: 'AI Engine' },
        { title: 'Screenshot 3 • Form Lead Capture & UTM Logger', desc: 'Captures form submissions (Kadence, WPForms, Contact Form 7) with referrer and user-agent data.', tag: 'Form Capture' },
        { title: 'Screenshot 4 • Human-in-the-Loop Review Dashboard', desc: 'Review AI-generated summaries and email drafts before manual approval and dispatch.', tag: 'Human Review' },
      ];
    } else if (project.permalink === 'blanc-chatbot-plugin') {
      return [
        { title: 'Screenshot 1 • Sitewide Floating AI Chat Widget', desc: 'Public interactive floating chat widget and inline shortcode [blanc_chatbox] with live responses.', tag: 'Chat Widget' },
        { title: 'Screenshot 2 • RAG Content & Document Importer', desc: 'Imports published WP pages, posts, CPTs, FAQs, and text files into a local vector knowledge index.', tag: 'RAG Knowledge' },
        { title: 'Screenshot 3 • Configurable LLM Backend Manager', desc: 'OpenAI GPT-4o and Ollama endpoint configuration with customizable persona prompts.', tag: 'LLM Settings' },
        { title: 'Screenshot 4 • Visitor Transcripts & Lead Alerts', desc: 'Admin SPA dashboard to review conversation logs, visitor emails, and automated alerts.', tag: 'Transcripts SPA' },
      ];
    } else {
      return [
        { title: 'Screenshot 1 • Visual Gutenberg Schema Builder', desc: 'Visual JSON-LD block editor directly inside the WordPress Gutenberg post editor.', tag: 'Gutenberg Editor' },
        { title: 'Screenshot 2 • SchemaGraphAssembler Engine', desc: 'Modular PHP pipeline merging site-wide schemas and per-post schemas into a single @graph script.', tag: 'Graph Assembly' },
        { title: 'Screenshot 3 • Live Admin AJAX JSON Preview', desc: 'Instant live preview of assembled JSON-LD script tags directly within admin settings.', tag: 'AJAX Preview' },
        { title: 'Screenshot 4 • Yoast & SEO Plugin Gate Coordination', desc: 'YoastSchemaGate pipeline avoiding duplicate schema markup conflicts with Yoast/RankMath.', tag: 'SEO Gate' },
      ];
    }
  };

  const screenshots = getPluginScreenshots();
  const mainImageSrc = getImageSrc(project.image || 'placeholder-portfolio.jpg');

  return (
    <div className="rounded-3xl border border-indigo-950/60 bg-gradient-to-b from-[#0d1527] via-[#09101d] to-[#040810] shadow-2xl overflow-hidden text-white flex flex-col relative">
      {/* Top Accent Gradient Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shrink-0" />

      {/* Chrome Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 bg-[#111927] border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="text-xs font-mono text-slate-300 ml-3 font-semibold">
            {project.url || 'wp-content/plugins/custom-plugin'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
            4 Feature Screenshots Gallery
          </span>

          <span className="text-xs font-black uppercase tracking-wider text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-indigo-400" />
            WordPress Plugin
          </span>
        </div>
      </div>

      {/* Code Spec & Interactive Showcase */}
      <div className="p-6 sm:p-10 space-y-6 overflow-y-auto max-h-[620px] scrollbar-thin">
        
        {/* Terminal Header */}
        <div className="bg-[#080d17] border border-slate-800 rounded-2xl p-5 font-mono text-xs text-slate-300 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-slate-500 border-b border-slate-800/80 pb-2 mb-2">
            <span className="text-purple-400 font-bold">&lt;?php {"// WordPress Plugin Architecture & Workflow Spec"}</span>
            <span className="text-emerald-400 font-bold">Tested &amp; Passed &bull; PHP 8.4</span>
          </div>
          <p className="text-cyan-300 font-bold text-sm">{"// "}{project.sitename}</p>
          <p className="text-slate-300 leading-relaxed font-sans text-xs whitespace-pre-wrap">{project.description}</p>
        </div>

        {/* ALWAYS-VISIBLE 4 SCREENSHOTS GALLERY SHOWCASE */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Interactive Plugin Screenshots Gallery (4 Screenshots)</span>
            </h4>
            <span className="text-[11px] font-mono font-bold text-slate-400">
              Slide {activeSlide + 1} of 4
            </span>
          </div>

          {/* 4 Clickable Screenshot Thumbnail Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {screenshots.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlide(idx)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                  activeSlide === idx
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-md ring-1 ring-amber-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className={`text-[10px] font-black uppercase tracking-wider font-mono ${activeSlide === idx ? 'text-amber-300' : 'text-slate-500'}`}>
                  Screenshot {idx + 1}
                </span>
                <span className="text-xs font-extrabold truncate block">{s.tag}</span>
              </button>
            ))}
          </div>

          {/* Featured Active Screenshot View Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 font-mono inline-block mb-1">
                  {screenshots[activeSlide].tag}
                </span>
                <h5 className="text-base sm:text-lg font-black text-white">{screenshots[activeSlide].title}</h5>
              </div>

              {/* Prev / Next Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : 3))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  title="Previous Screenshot"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSlide((prev) => (prev < 3 ? prev + 1 : 0))}
                  className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-colors cursor-pointer"
                  title="Next Screenshot"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {screenshots[activeSlide].desc}
            </p>

            {/* Feature Visual Graphic */}
            <div className="relative w-full h-[220px] sm:h-[280px] rounded-xl overflow-hidden border border-slate-800 bg-[#080d17] p-4 flex flex-col justify-between shadow-inner">
              <Image
                src={mainImageSrc}
                alt={screenshots[activeSlide].title}
                fill
                className="object-cover object-top opacity-30"
                unoptimized
              />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-cyan-300 ml-2 font-bold">{project.sitename} &bull; Screenshot {activeSlide + 1}</span>
                </div>
              </div>

              <div className="relative z-10 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-800/80 space-y-1">
                <p className="text-xs font-mono font-bold text-emerald-400">&gt; Executing {screenshots[activeSlide].tag} Module</p>
                <p className="text-xs text-slate-300">{screenshots[activeSlide].desc}</p>
              </div>
            </div>
          </div>

        </div>

        {/* How It Works Workflow Steps Panel */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>How This Plugin Works (Core Architecture Workflow)</span>
          </h4>

          {project.permalink === 'blanc-login-customizer' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-cyan-400 block font-mono">Step 1 &bull; Secret URL Rewriter</span>
                <p className="font-bold text-white text-xs">Custom Secret Login Slug</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Renames /wp-admin and /wp-login.php to custom secret URLs, blocking automated brute-force bot attacks.</p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-indigo-400 block font-mono">Step 2 &bull; Split-Panel Builder</span>
                <p className="font-bold text-white text-xs">Glassmorphic Dual Layout</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Renders modern dual-panel login screens with custom backgrounds, brand typography, and accent colors.</p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-purple-400 block font-mono">Step 3 &bull; Brand & Logo Editor</span>
                <p className="font-bold text-white text-xs">Live Admin Branding Customizer</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Live admin preview for logo uploads, custom form positioning, button styling, and copyright footers.</p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 block font-mono">Step 4 &bull; Admin Security Gate</span>
                <p className="font-bold text-white text-xs">BuildForUser Core Authorization</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Integrates with BuildForUser core dashboard plugins for centralized plugin authorization and asset management.</p>
              </div>
            </div>
          ) : project.permalink === 'blanc-leads-plugin' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-cyan-400 block font-mono">Step 1 &bull; Lead Capture</span>
                <p className="font-bold text-white text-xs">Form Hooks & Context Data</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Captures form submissions (Kadence, WPForms, Contact Form 7), logging referrer, UTM parameters, and user-agent.</p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-indigo-400 block font-mono">Step 2 &bull; WordPress CRM</span>
                <p className="font-bold text-white text-xs">Kanban & Task Management</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Manages lead records inside custom WP tables with Kanban stages, notes, tasks with due dates, and user assignment.</p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-purple-400 block font-mono">Step 3 &bull; Multi-AI Nurturing</span>
                <p className="font-bold text-white text-xs">LLM Pipeline & Scoring</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Connects to OpenAI, Claude, Gemini, DeepSeek, OpenRouter, or local Ollama for summaries, 1-100 scoring, and email drafts.</p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 block font-mono">Step 4 &bull; Safety First</span>
                <p className="font-bold text-white text-xs">Human-in-the-Loop Review</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">AI creates email drafts and suggestions, but emails are never sent automatically without human approval.</p>
              </div>
            </div>
          ) : project.permalink === 'blanc-chatbot-plugin' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-cyan-400 block font-mono">Step 1 &bull; RAG Source Import</span>
                <p className="font-bold text-white text-xs">WP Content & Document Indexing</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Imports published WP pages, posts, CPTs, FAQs, and uploaded text documents into a RAG knowledge index.</p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-indigo-400 block font-mono">Step 2 &bull; Configurable LLM</span>
                <p className="font-bold text-white text-xs">OpenAI & Ollama Backends</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Connects to OpenAI (GPT-4o) or local Ollama endpoints with custom system prompts and company brand personas.</p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-purple-400 block font-mono">Step 3 &bull; Frontend Widget</span>
                <p className="font-bold text-white text-xs">Floating Widget & Shortcode</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Renders sitewide floating widget or inline [blanc_chatbox] shortcode with visitor details capture.</p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 block font-mono">Step 4 &bull; Admin SPA</span>
                <p className="font-bold text-white text-xs">Conversation Storage & Alerts</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Full Admin SPA dashboard to review transcript summaries, manage FAQs, and trigger email alerts to site owners.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-cyan-400 block font-mono">Step 1 &bull; Visual Editor</span>
                <p className="font-bold text-white text-xs">Gutenberg & Global Builder</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Configure JSON-LD schema blocks directly inside the WordPress editor and global settings dashboard.</p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-indigo-400 block font-mono">Step 2 &bull; Graph Engine</span>
                <p className="font-bold text-white text-xs">SchemaGraphAssembler</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Modular PHP pipeline merges global and post schemas, deduplicating @id tags into a single valid @graph JSON-LD script.</p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-purple-400 block font-mono">Step 3 &bull; AJAX Preview</span>
                <p className="font-bold text-white text-xs">Instant Admin Preview</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Generates real-time previews of JSON-LD script tags directly within the admin editor without page reloads.</p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 block font-mono">Step 4 &bull; SEO Gate</span>
                <p className="font-bold text-white text-xs">Yoast & SEO Coordination</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">YoastSchemaGate coordinates output with Yoast SEO or All-in-One SEO to eliminate schema syntax conflicts.</p>
              </div>
            </div>
          )}

        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Plugin Capabilities
            </h4>
            <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed pl-2 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Custom WP Database Tables & Migration Hooks
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                AJAX & REST API Endpoint Controllers
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Nonces, Data Sanitization &amp; Escaping
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" /> Technology &amp; Integrations
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.technologies?.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-bold px-3 py-1 rounded-xl bg-indigo-950/80 text-indigo-200 border border-indigo-700/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Project Screenshot Gallery (dashboard / portal projects) ────────────────

export function ProjectGallery({ project }: { project: PortfolioProject }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const shots = project.screenshots?.filter(Boolean) || [];
  if (shots.length === 0) return null;

  const goPrev = () => setActiveSlide((prev) => (prev > 0 ? prev - 1 : shots.length - 1));
  const goNext = () => setActiveSlide((prev) => (prev < shots.length - 1 ? prev + 1 : 0));

  return (
    <div className="space-y-4 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-black text-[#0b1a30] flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-brand-amber" /> Project Gallery
        </h2>
        <span className="text-[11px] font-mono font-bold text-slate-400">
          {activeSlide + 1} / {shots.length}
        </span>
      </div>

      {/* Featured active screenshot */}
      <div className="relative w-full h-[280px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 group/gallery">
        <Image
          src={getImageSrc(shots[activeSlide])}
          alt={`${project.sitename} screenshot ${activeSlide + 1}`}
          fill
          className="object-contain cursor-zoom-in"
          sizes="(max-width: 768px) 100vw, 800px"
          unoptimized
          onClick={() => setLightboxOpen(true)}
        />

        {shots.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 text-white opacity-0 group-hover/gallery:opacity-100 hover:bg-slate-900/90 transition-all"
              title="Previous screenshot"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 text-white opacity-0 group-hover/gallery:opacity-100 hover:bg-slate-900/90 transition-all"
              title="Next screenshot"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {shots.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {shots.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => setActiveSlide(idx)}
              className={`relative h-16 rounded-lg overflow-hidden border transition-all ${
                activeSlide === idx ? 'border-brand-amber ring-1 ring-brand-amber' : 'border-slate-200 hover:border-slate-300'
              }`}
              title={`Screenshot ${idx + 1}`}
            >
              <Image
                src={getImageSrc(src)}
                alt={`${project.sitename} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="120px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm px-4 py-8"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={getImageSrc(shots[activeSlide])}
              alt={`${project.sitename} screenshot ${activeSlide + 1}`}
              fill
              className="object-contain"
              unoptimized
            />
            {shots.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Project Detail Preview ───────────────────────────────────────────────────

export function ProjectDetailPreview({ project }: { project: PortfolioProject }) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [modalOpen, setModalOpen] = useState(false);

  const isPlugin =
    project.url?.startsWith('wp-content') ||
    project.permalink?.includes('plugin') ||
    project.technologies?.some((t) => t.toLowerCase() === 'wordpress plugins');


  if (isPlugin) {
    return <WordPressPluginDetailPreview project={project} />;
  }

  const mobileSrc = getImageSrc(project.fullMobileImage || project.mobileImage || project.image);
  const desktopSrc = getImageSrc(project.fullDesktopImage || project.image);



  return (
    <>
      <BrowserChrome
        url={project.url}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        onMaximize={() => setModalOpen(true)}
        size="detail"
      >
        {previewMode === 'desktop' ? (
          <div className="relative w-full h-[440px] sm:h-[540px] md:h-[620px] overflow-y-auto bg-[#111] scrollbar-thin scrollbar-thumb-amber-500/40 hover:scrollbar-thumb-amber-500 group/scroll">
            <div className="relative w-full min-h-full">
              <Image
                src={desktopSrc}
                alt={project.sitename}
                width={1200}
                height={2400}
                className="w-full h-auto block object-top"
                unoptimized
              />
            </div>

            {/* Floating Scroll Indicator */}
            <div className="sticky bottom-4 right-4 ml-auto w-fit px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-white/20 text-white text-[11px] font-extrabold shadow-xl flex items-center gap-1.5 pointer-events-none group-hover/scroll:opacity-50 transition-opacity">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              Scroll to view full site ↓
            </div>
          </div>
        ) : (
          <div className="w-full h-[440px] sm:h-[540px] md:h-[620px] bg-[#111] flex items-center justify-center p-6">
            <div className="relative shadow-2xl" style={{ width: '220px', height: '420px' }}>
              <div className="absolute inset-0 rounded-[32px] bg-[#222] border-2 border-white/20" />
              <div className="absolute inset-2 rounded-[24px] overflow-hidden bg-black overflow-y-auto scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <Image
                  src={mobileSrc}
                  alt={`${project.sitename} Mobile`}
                  width={300}
                  height={600}
                  className="w-full h-auto block object-top"
                  unoptimized
                />
              </div>
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-3.5 w-16 rounded-full bg-[#222] z-10 pointer-events-none" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-16 rounded-full bg-white/30 z-10 pointer-events-none" />
            </div>
          </div>
        )}
      </BrowserChrome>

      {modalOpen && <ProjectModal project={project} onClose={() => setModalOpen(false)} />}
    </>
  );
}

