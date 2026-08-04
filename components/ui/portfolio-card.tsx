'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Monitor, Smartphone, Maximize2, X, ExternalLink, ArrowRight, Package, Terminal, Code2, CheckCircle2, Cpu, Sparkles, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';


// ─── Shared Project Type ──────────────────────────────────────────────────────

export interface PortfolioProject {
  id?: number;
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
  content?: string;
  client?: string;
  role?: string;
  duration?: string;
  category?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  featured?: boolean;
  spotlight?: boolean;
  active?: boolean;
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

// ─── Blanc Leads Interactive Presentation ────────────────────────────────────

function BlancLeadsPresentation({ project }: { project: PortfolioProject }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'features' | 'ai' | 'integrations' | 'changelog'>('dashboard');

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', color: 'text-teal-400' },
    { id: 'features', label: '🧲 Features', color: 'text-indigo-400' },
    { id: 'ai', label: '🤖 AI Suite', color: 'text-purple-400' },
    { id: 'integrations', label: '🔌 Integrations', color: 'text-amber-400' },
    { id: 'changelog', label: '📋 Changelog', color: 'text-emerald-400' },
  ] as const;

  return (
    <div className="rounded-3xl border border-teal-900/40 bg-gradient-to-b from-[#0d1f24] via-[#091418] to-[#050c10] shadow-2xl overflow-hidden text-white flex flex-col">
      {/* Top Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 via-amber-500 to-teal-400 shrink-0" />

      {/* Chrome header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 bg-[#0c1a1f] border-b border-white/8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="text-xs font-mono text-slate-400 ml-3 font-semibold">blanc-leads — WordPress CRM Plugin</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-teal-300 bg-teal-500/15 border border-teal-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            v2.8.7 Production
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 rounded-full">
            WordPress Plugin
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-1 px-5 pt-4 pb-0 border-b border-white/5 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-3.5 py-2 text-[11px] font-extrabold rounded-t-xl border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? `${tab.color} border-current bg-white/5`
                : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/3'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="p-5 sm:p-7 space-y-5 overflow-y-auto max-h-[680px] scrollbar-thin scrollbar-thumb-teal-800/50">

        {/* ── DASHBOARD TAB ─────────────────── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-teal-400 mb-1">Dashboard Overview</p>
              <h3 className="text-lg font-black text-white">Everything in one <span className="text-teal-400">view</span></h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">The All Leads dashboard gives you live stats, AI insights, searchable filtered lists, and direct CRM record access.</p>
            </div>

            {/* Mock Panel */}
            <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-white/4 border-b border-white/7 px-4 py-3 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-mono text-slate-500 ml-2">Website Leads — All Leads · blanc-leads</span>
              </div>
              <div className="p-4 space-y-4">
                {/* Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { val: '148', label: 'Total Leads', color: 'text-teal-400' },
                    { val: '23', label: 'New', color: 'text-amber-400' },
                    { val: '7', label: 'Follow-ups Due', color: 'text-yellow-400' },
                    { val: '19', label: 'Converted', color: 'text-indigo-400' },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/4 border border-white/7 rounded-xl p-3 text-center">
                      <span className={`text-2xl font-black ${s.color} block`}>{s.val}</span>
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 mt-1 block">{s.label}</span>
                    </div>
                  ))}
                </div>
                {/* Mini table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="border-b border-white/6">
                        {['Date', 'Name', 'Contact', 'Form', 'Status', 'Score'].map(h => (
                          <th key={h} className="text-left py-2 px-2 text-[9px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { date: '2026-06-01', name: 'Sarah Mitchell', contact: 'sarah@example.com', form: 'Contact Us', status: 'Hot', statusColor: 'bg-amber-500/20 text-amber-400', score: 82, scoreColor: 'bg-teal-500/20 text-teal-400' },
                        { date: '2026-05-31', name: 'James Okafor', contact: 'j.okafor@biz.au', form: 'Finance Enquiry', status: 'Qualified', statusColor: 'bg-yellow-500/20 text-yellow-400', score: 91, scoreColor: 'bg-teal-500/20 text-teal-400' },
                        { date: '2026-05-30', name: 'Priya Nair', contact: 'priya.n@gmail.com', form: 'Get a Quote', status: 'New', statusColor: 'bg-teal-500/20 text-teal-400', score: 45, scoreColor: 'bg-yellow-500/20 text-yellow-400' },
                        { date: '2026-05-29', name: 'Tom Carver', contact: 'tcarver@co.nz', form: 'Kadence Form', status: 'Contacted', statusColor: 'bg-indigo-500/20 text-indigo-400', score: 60, scoreColor: 'bg-yellow-500/20 text-yellow-400' },
                      ].map((row) => (
                        <tr key={row.name} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                          <td className="py-2 px-2 text-slate-500">{row.date}</td>
                          <td className="py-2 px-2 font-bold text-white">{row.name}</td>
                          <td className="py-2 px-2 text-slate-400">{row.contact}</td>
                          <td className="py-2 px-2 text-slate-400">{row.form}</td>
                          <td className="py-2 px-2"><span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${row.statusColor}`}>{row.status}</span></td>
                          <td className="py-2 px-2"><span className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black ${row.scoreColor}`}>{row.score}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Kanban mini mock */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-teal-400 mb-3">Kanban Pipeline View</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { col: 'New Lead (4)', leads: ['Priya Nair · Score 45', 'Leo Fontaine · Score 30'] },
                  { col: 'Discovery (3)', leads: ['Sarah Mitchell · Score 82', 'Ana Torres · Score 68'] },
                  { col: 'Proposal Sent (2)', leads: ['James Okafor · Score 91', 'Mike Chen · Score 77'] },
                ].map((c) => (
                  <div key={c.col} className="bg-white/3 border border-white/6 rounded-xl p-3">
                    <div className="text-[9px] font-black uppercase tracking-wider text-slate-500 mb-2 pb-1.5 border-b border-white/6">{c.col}</div>
                    {c.leads.map(l => (
                      <div key={l} className="bg-white/4 border border-white/7 rounded-lg p-2 mb-1.5 last:mb-0">
                        <div className="text-[11px] font-semibold text-white/85 truncate">{l.split(' · ')[0]}</div>
                        <div className="text-[9px] text-slate-500">{l.split(' · ')[1]}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── FEATURES TAB ─────────────────── */}
        {activeTab === 'features' && (
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-indigo-400 mb-1">Core Features</p>
              <h3 className="text-lg font-black text-white">Built for real <span className="text-indigo-400">sales workflows</span></h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Every feature is purpose-built for managing website leads through their full lifecycle — from first capture to closed deal.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: '🧲', color: 'border-teal-500/20 bg-teal-500/8', hdr: 'Universal Form Capture', desc: 'Silently intercepts any form plugin or raw POST submission.', items: ['Contact Form 7 · WPForms · Gravity Forms', 'Kadence Blocks & Advanced Forms', 'Any generic HTML POST form', 'Browser, IP, referrer, UTM data captured'] },
                { icon: '📋', color: 'border-amber-500/20 bg-amber-500/8', hdr: 'Lead CRM Detail Page', desc: 'Full CRM record per lead with scoring, tasks, and follow-up scheduling.', items: ['Status & Kanban stage controls', 'Score (0–100) manual override', 'Next follow-up date picker', 'Notes + manual activity log entries'] },
                { icon: '📊', color: 'border-yellow-500/20 bg-yellow-500/8', hdr: 'Kanban Pipeline Board', desc: 'Visual stage-based board for team stand-ups and pipeline reviews.', items: ['Columns per nurture stage', 'Lead count & status badge per card', 'Assigned agent visible', 'Direct link to CRM detail page'] },
                { icon: '✅', color: 'border-indigo-500/20 bg-indigo-500/8', hdr: 'Task Management', desc: 'Create, assign, and track follow-up tasks per lead with notifications.', items: ['Task title, description, due date', 'Assign to any WordPress user', 'Email notification to assignee', 'AI-created nurture plan tasks'] },
                { icon: '📧', color: 'border-amber-500/20 bg-amber-500/8', hdr: 'Email System', desc: 'Send beautifully branded HTML emails directly from a lead CRM page.', items: ['Branded HTML email builder', 'Logo, colors, footer, social links', 'Template variable substitution', 'AI-drafted content injection'] },
                { icon: '💬', color: 'border-teal-500/20 bg-teal-500/8', hdr: 'SMS via Twilio', desc: 'Send SMS alongside emails when a lead has a phone number.', items: ['Twilio REST API integration', 'Send with or alongside email', 'SMS history per lead', 'Sent / Failed status tracking'] },
                { icon: '📅', color: 'border-yellow-500/20 bg-yellow-500/8', hdr: 'Digest Email Reports', desc: 'WP-Cron digest emails summarize leads, scores, and recent submissions.', items: ['Daily or weekly frequency', 'Configurable recipient email', 'Lead count + avg AI score', 'Up to 15 recent leads listed'] },
                { icon: '🕒', color: 'border-indigo-500/20 bg-indigo-500/8', hdr: 'Activity Timeline', desc: 'Every CRM action auto-logged — emails, SMS, tasks, score changes.', items: ['Auto-logged on every save', 'Actor (user) tracking', 'Typed entries (Status, Kanban, AI)', 'Email + SMS + Task events inline'] },
              ].map((f) => (
                <div key={f.hdr} className={`border ${f.color} rounded-2xl p-4 space-y-2 hover:-translate-y-0.5 transition-transform`}>
                  <div className="text-2xl">{f.icon}</div>
                  <h4 className="font-black text-white text-sm">{f.hdr}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                  <ul className="space-y-1 pt-1">
                    {f.items.map(item => (
                      <li key={item} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                        <span className="text-teal-400 mt-0.5 shrink-0">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── AI SUITE TAB ─────────────────── */}
        {activeTab === 'ai' && (
          <div className="space-y-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-purple-400 mb-1">AI Nurturing Suite</p>
              <h3 className="text-lg font-black text-white"><span className="text-purple-400">AI-powered</span> lead intelligence</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Connect any major AI provider to unlock summaries, scoring, email drafts, next actions, and full nurture plans — all without leaving WordPress.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: '📝', name: 'Lead Summary', desc: 'Concise AI overview of the lead for quick context.' },
                { icon: '🎯', name: 'Next Action', desc: 'Context-aware suggestion for the next follow-up step.' },
                { icon: '✉️', name: 'Email Draft', desc: 'Personalized email with subject + body, ready to review.' },
                { icon: '⭐', name: 'Lead Score', desc: 'AI evaluates lead quality 0–100 with explanation.' },
                { icon: '🗺️', name: 'Nurture Plan', desc: 'Multi-step plan (up to 8 steps) tailored to the lead.' },
                { icon: '📌', name: 'Create Tasks', desc: 'Convert nurture steps into assigned tasks instantly.' },
                { icon: '💡', name: 'Dashboard Insights', desc: 'Surface overdue follow-ups and idle hot leads.' },
                { icon: '🔒', name: 'Human Review Gate', desc: 'AI never sends emails automatically. Manual approval always required.' },
              ].map((a) => (
                <div key={a.name} className="bg-teal-500/7 border border-teal-500/20 rounded-xl p-3 space-y-1.5 hover:bg-teal-500/12 hover:scale-[1.02] transition-all">
                  <span className="text-xl block">{a.icon}</span>
                  <div className="text-xs font-black text-white">{a.name}</div>
                  <div className="text-[10px] text-slate-400 leading-relaxed">{a.desc}</div>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-purple-400 mb-3">Supported AI Providers</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'OpenAI — GPT-4o mini', local: false },
                  { name: 'Anthropic Claude — Haiku', local: false },
                  { name: 'Google Gemini 1.5 Flash', local: false },
                  { name: 'DeepSeek Chat', local: false },
                  { name: 'OpenRouter — Llama 3.1', local: false },
                  { name: 'Ollama — Local / self-hosted', local: true },
                ].map((p) => (
                  <div key={p.name} className="flex items-center gap-2 bg-white/4 border border-white/8 rounded-xl px-3 py-2 text-[11px] font-semibold text-white/80 hover:bg-white/8 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${p.local ? 'bg-amber-400 shadow-amber-400/50' : 'bg-teal-400 shadow-teal-400/50'} shadow-[0_0_6px]`} />
                    {p.name}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Each provider maintains its own API key and model setting. Ollama requires no API key.</p>
            </div>
          </div>
        )}

        {/* ── INTEGRATIONS TAB ─────────────────── */}
        {activeTab === 'integrations' && (
          <div className="space-y-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-amber-400 mb-1">Form Integrations</p>
              <h3 className="text-lg font-black text-white">Works with your <span className="text-amber-400">existing forms</span></h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Blanc Leads integrates silently in the background — no changes needed to existing forms. Just activate and capture.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                { icon: '📮', name: 'Contact Form 7', type: 'Form Plugin' },
                { icon: '📋', name: 'WPForms', type: 'Form Plugin' },
                { icon: '⚡', name: 'Gravity Forms', type: 'Form Plugin' },
                { icon: '🎨', name: 'Kadence Blocks', type: 'Page Builder' },
                { icon: '🔧', name: 'Kadence Advanced', type: 'Page Builder' },
                { icon: '🌐', name: 'Any HTML POST', type: 'Generic Form' },
                { icon: '📱', name: 'Twilio SMS', type: 'Messaging' },
                { icon: '🤖', name: 'OpenAI API', type: 'AI Provider' },
                { icon: '🤖', name: 'Anthropic Claude', type: 'AI Provider' },
                { icon: '🤖', name: 'Google Gemini', type: 'AI Provider' },
                { icon: '🤖', name: 'DeepSeek', type: 'AI Provider' },
                { icon: '🦙', name: 'Ollama / Llama', type: 'Local AI' },
                { icon: '🤖', name: 'Blanc Chatbot', type: 'CRM Upgrade', special: 'border-amber-500/35 bg-amber-500/6 text-amber-300' },
                { icon: '🚀', name: 'Blanc Campaigns', type: 'CRM Upgrade', special: 'border-teal-500/35 bg-teal-500/6 text-teal-300' },
              ].map((i) => (
                <div key={i.name} className={`border rounded-xl p-3 text-center transition-all hover:-translate-y-0.5 ${
                  (i as any).special
                    ? (i as any).special.includes('amber') ? 'border-amber-500/35 bg-amber-500/6' : 'border-teal-500/35 bg-teal-500/6'
                    : 'border-white/7 bg-white/3 hover:bg-teal-500/10 hover:border-teal-500/30'
                }`}>
                  <div className="text-2xl mb-1.5">{i.icon}</div>
                  <div className={`text-[11px] font-bold ${
                    (i as any).special?.includes('amber') ? 'text-amber-300' : (i as any).special?.includes('teal') ? 'text-teal-300' : 'text-white/80'
                  }`}>{i.name}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">{i.type}</div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* ── CHANGELOG TAB ─────────────────── */}
        {activeTab === 'changelog' && (
          <div className="space-y-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400 mb-1">🚀 What's New</p>
              <h3 className="text-lg font-black text-white">Version <span className="text-emerald-400">2.8.7</span> Upgrades</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">A full suite of new features, UI refinements, and bug fixes delivered in this release.</p>
            </div>
            {/* Timeline */}
            <div className="relative pl-6">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 to-teal-500/10 rounded" />
              {[
                { ver: 'v2.8.7', title: 'Blanc Leads Campaign Addon', desc: 'A standalone addon plugin that turns your CRM into a full email marketing platform with newsletter composer, segment filtering, AI copywriter, and campaign history log.', color: 'text-amber-400' },
                { ver: 'v2.8.7', title: 'Mobile App QR Connect', desc: 'Pair the Blanc CRM mobile companion app by scanning a one-time QR code with 5-minute signed auth token via WordPress transients.', color: 'text-teal-400' },
                { ver: 'v2.8.7', title: 'Mobile Panel Visibility Control', desc: 'Full admin control over when the mobile connect card is shown, with VISIBLE/HIDDEN status badges and an animated green dot indicator.', color: 'text-yellow-400' },
                { ver: 'v2.8.7', title: 'Premium Stat Cards UI Overhaul', desc: 'Dashboard summary cards received a visual upgrade with color-coded top borders, emoji icon tiles, and conditional color highlighting.', color: 'text-indigo-400' },
                { ver: 'v2.8.7', title: '🐛 Generic POST Capturer Fix', desc: 'Fixed WordPress Application Password generation being captured as leads. Added URL-based block for /wp-json/ requests and 25+ WordPress internal POST key signatures.', color: 'text-rose-400' },
                { ver: 'v2.8.6', title: 'Chatbot CRM Integration', desc: 'Blanc Chatbot integration syncing chat transcripts directly into Lead CRM timelines. Auto-capture visitor name, email, phone before chat begins.', color: 'text-teal-400' },
                { ver: 'v2.8.5', title: 'Upsell Banner Redesign', desc: 'Addon promotion banners redesigned from heavy dark cards to modern glassmorphic light panels with gradient pill CTA buttons and hover lift animations.', color: 'text-amber-400' },
                { ver: 'v2.8.0', title: 'CSV Export & Security Hardening', desc: 'Export current filtered lead list to CSV with all CRM fields. All queries use $wpdb->prepare() with placeholders. Sensitive field auto-redaction (passwords, CVV, PINs).', color: 'text-emerald-400' },
              ].map((c, i) => (
                <div key={i} className="relative mb-6 last:mb-0">
                  <div className="absolute -left-[26px] top-1.5 w-3 h-3 rounded-full bg-teal-500 border-2 border-[#091418] shadow-[0_0_0_3px_rgba(44,122,117,0.25)]" />
                  <code className={`text-[10px] font-bold ${c.color} font-mono`}>{c.ver}</code>
                  <h4 className="text-sm font-black text-white mt-0.5">{c.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── WordPress Plugin Detail Preview ─────────────────────────────────────────

export function WordPressPluginDetailPreview({ project }: { project: PortfolioProject }) {
  const [activeSlide, setActiveSlide] = useState(0);

  // Blanc Leads gets the full interactive presentation
  if (project.permalink === 'blanc-leads-plugin') {
    return <BlancLeadsPresentation project={project} />;
  }

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
          <div className="relative w-full h-[440px] sm:h-[540px] md:h-[797px] overflow-y-auto bg-[#111] scrollbar-thin scrollbar-thumb-amber-500/40 hover:scrollbar-thumb-amber-500 group/scroll">
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

export default PortfolioCard;

