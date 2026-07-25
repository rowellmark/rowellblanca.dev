'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Monitor, Smartphone, Maximize2, X, ExternalLink, ArrowRight } from 'lucide-react';

// ─── Shared Project Type ──────────────────────────────────────────────────────

export interface PortfolioProject {
  key?: number;
  url: string;
  image: string;
  mobileImage?: string;
  sitename: string;
  permalink: string;
  technologies: string[];
  description?: string;
}

// ─── Helper for image URL resolution ─────────────────────────────────────────

function getImageSrc(imgSrc?: string) {
  if (!imgSrc) return '/placeholder-portfolio.jpg';
  if (imgSrc.startsWith('http') || imgSrc.startsWith('/')) return imgSrc;
  return `/${imgSrc}`;
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
          src={getImageSrc(project.image)}
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
  const mobileSrc = getImageSrc(project.mobileImage || project.image);

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

export function PortfolioCard({ project }: { project: PortfolioProject }) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="group rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
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
        <div className="p-5 space-y-3 flex flex-col flex-1">
          <div>
            <p className="font-extrabold text-brand-navy text-base leading-snug">{project.sitename}</p>
          </div>

          {project.description && (
            <p className="text-xs text-brand-slate leading-relaxed flex-1 line-clamp-2">{project.description}</p>
          )}

          <div className="flex flex-wrap gap-1.5">
            {project.technologies?.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-end pt-1">
            <Link
              href={`/mywork/${project.permalink}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-amber hover:text-brand-amber-h hover:underline"
            >
              Read More <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
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

  const mobileSrc = getImageSrc(project.mobileImage || project.image);
  const desktopSrc = getImageSrc(project.image);

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

// ─── Project Detail Preview ───────────────────────────────────────────────────

export function ProjectDetailPreview({ project }: { project: PortfolioProject }) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [modalOpen, setModalOpen] = useState(false);

  const mobileSrc = getImageSrc(project.mobileImage || project.image);
  const desktopSrc = getImageSrc(project.image);

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
              <img
                src={desktopSrc}
                alt={project.sitename}
                className="w-full h-auto block object-top"
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
              <div className="absolute inset-2 rounded-[24px] overflow-hidden bg-black overflow-y-auto scrollbar-none">
                <img
                  src={mobileSrc}
                  alt={`${project.sitename} Mobile`}
                  className="w-full h-auto block object-top"
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
