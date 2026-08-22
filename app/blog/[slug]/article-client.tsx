'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Check,
  Copy,
  Sparkles,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Tag,
  CheckCircle2,
  Layout,
  Cpu,
  ShoppingBag,
  Zap,
  Code2,
  Layers,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { ContactModal } from '@/components/ui/contact-modal';
import { SharedSidebar } from '@/components/ui/shared-sidebar';
import { ProjectEstimator } from '@/components/homepage/project-estimator';
import { EngagementModels } from '@/components/homepage/engagement-models';
import { SpeedRacerGame } from '@/components/interactive/speed-racer-game';

interface ArticleClientProps {
  slug: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  category?: string;
  tags: string[];
  author?: string;
  readingTime?: string;
  publishedAt: string;
}

const WP_SERVICES = [
  {
    icon: Layout,
    title: 'Bespoke WordPress Themes',
    description: 'Hand-coded PHP & Gutenberg block themes built without third-party page builder bloat.',
  },
  {
    icon: Cpu,
    title: 'Headless WP + Next.js',
    description: 'De-coupled architecture combining WP content agility with sub-second React speeds.',
  },
  {
    icon: ShoppingBag,
    title: 'WooCommerce Optimization',
    description: 'Custom payment gateways, database index tuning, and high-volume checkout flows.',
  },
  {
    icon: Zap,
    title: 'Page Speed & 95+ Core Web Vitals',
    description: 'Aggressive script deferral, image optimization, and Lighthouse score hardening.',
  },
];

const REACT_SERVICES = [
  {
    icon: Code2,
    title: 'Next.js 14 & React 19',
    description: 'Server Components (RSC), TypeScript strict safety, and streaming SSR performance.',
  },
  {
    icon: Layers,
    title: 'Full-Stack SaaS Portals',
    description: 'Custom lead CRM pipelines, financial portals, NeonDB PostgreSQL & Prisma ORM.',
  },
  {
    icon: Sparkles,
    title: 'Multi-Provider AI Agents',
    description: 'RAG knowledge search, Gemini 2.5, OpenAI GPT-4o, and local Ollama integrations.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise Architecture',
    description: 'Modular component refactoring, test coverage, and full GMT/BST availability.',
  },
];

export function ArticleClient({ slug }: ArticleClientProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [authorAvatar, setAuthorAvatar] = useState<string>('');

  const fetchArticle = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blog/${slug}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.post) {
          setPost(data.post);
          if (Array.isArray(data.relatedPosts)) setRelatedPosts(data.relatedPosts);
        }
      }
    } catch (e) {
      console.warn('Failed to load article details');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.authorAvatar) {
          setAuthorAvatar(data.settings.authorAvatar);
        }
      })
      .catch(() => {});
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] text-slate-900 flex items-center justify-center font-sans text-xs">
        <div className="flex items-center gap-2 font-bold text-amber-600">
          <Sparkles className="w-5 h-5 animate-pulse text-amber-500" />
          <span>Loading Article...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] text-slate-900 flex flex-col items-center justify-center font-sans text-center p-6 space-y-4">
        <h1 className="text-2xl font-black text-[#0b1a30]">Article Not Found</h1>
        <p className="text-xs text-slate-500">The requested blog post could not be found or has been moved.</p>
        <Link
          href="/blog"
          className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider"
        >
          Return to Blog Hub
        </Link>
      </div>
    );
  }

  // Detect service type based on article content/tags
  const textContent = `${post.title} ${post.category || ''} ${post.tags.join(' ')} ${post.content}`.toLowerCase();
  const isWp = textContent.includes('wordpress') || textContent.includes('gutenberg') || textContent.includes('php');
  const isReact = textContent.includes('react') || textContent.includes('next.js') || textContent.includes('nextjs');

  const showWpServices = isWp || (!isWp && !isReact);
  const showReactServices = isReact || (!isWp && !isReact);

  // Formatted markdown blocks renderer
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-4" />;

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl sm:text-2xl font-black text-[#0b1a30] pt-6 pb-2 border-b border-slate-200">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-2xl sm:text-3xl font-black text-[#0b1a30] pt-8 pb-3 border-b border-slate-200">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={idx} className="text-slate-700 text-sm leading-relaxed pl-2 list-disc list-inside space-y-1">
            {trimmed.replace(/^[-*]\s+/, '')}
          </li>
        );
      }
      if (trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ')) {
        return (
          <li key={idx} className="text-slate-700 text-sm leading-relaxed pl-2 list-decimal list-inside space-y-1">
            {trimmed.replace(/^\d+\.\s+/, '')}
          </li>
        );
      }

      return (
        <p key={idx} className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-slate-900 font-sans selection:bg-brand-amber selection:text-slate-950 overflow-x-hidden">
      {/* Header & Title Banner */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-indigo-950 via-slate-900 to-[#0b1a30] text-white">
        <div className="max-w-[1440px] mx-auto px-6 space-y-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog Hub
          </Link>

          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold text-slate-950 bg-amber-400 px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                {post.category || 'Engineering'}
              </span>
              <span className="text-xs font-mono text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {post.readingTime || '5 min read'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white max-w-4xl">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-3">
                {authorAvatar ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden relative border border-amber-400/40">
                    <Image src={authorAvatar} alt={post.author || 'Author'} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center font-bold text-amber-300">
                    RB
                  </div>
                )}
                <div>
                  <span className="font-extrabold text-white block">{post.author || 'Rowell Mark Blanca'}</span>
                  <span className="text-[10px] text-slate-400 block">Senior Full-Stack Engineer</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {new Date(post.publishedAt || Date.now()).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>

                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Copy Article Link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main 2-Column Layout */}
      <section className="py-16 max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* MAIN ARTICLE COLUMN (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
              {post.excerpt && (
                <div className="p-4 rounded-2xl bg-amber-50 border-l-4 border-amber-500 text-amber-900 text-sm font-medium leading-relaxed italic">
                  {post.excerpt}
                </div>
              )}

              <div className="space-y-4 font-sans text-slate-800 leading-relaxed pt-2">
                {renderFormattedContent(post.content)}
              </div>

              {/* Article Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="pt-8 border-t border-slate-200 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-amber-500" /> Tags:
                  </span>
                  {post.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* STICKY SIDEBAR COLUMN WITH SHARED SIDEBAR & RELATED ARTICLES (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <SharedSidebar
              defaultService={post.title ? `Inquiry regarding ${post.title}` : 'Custom Project'}
              serviceType={showWpServices ? 'wordpress' : showReactServices ? 'react' : 'both'}
            />

            {/* Related Articles in Sidebar */}
            {relatedPosts.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
                <h3 className="text-sm font-black text-[#0b1a30] flex items-center gap-2 pb-2 border-b border-slate-100">
                  <BookOpen className="w-4 h-4 text-amber-500" /> Related Articles
                </h3>

                <div className="space-y-3">
                  {relatedPosts.map((rel) => (
                    <div key={rel.id} className="space-y-1 group">
                      <span className="text-[9px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md inline-block">
                        {rel.category || 'Engineering'}
                      </span>
                      <h4 className="text-xs font-black text-[#0b1a30] group-hover:text-amber-600 transition-colors leading-snug">
                        <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                      </h4>
                      <Link
                        href={`/blog/${rel.slug}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 group-hover:text-[#1d63ed]"
                      >
                        <span>Read Article</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Scope & Architecture Estimator */}
      <div id="project-estimator" className="border-t border-slate-200">
        <ProjectEstimator />
      </div>

      {/* Transparent Engagement Models */}
      <EngagementModels />

      {/* Interactive Speed Racer Game */}
      <SpeedRacerGame />

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
