'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ContactModal } from '@/components/ui/contact-modal';
import { SharedSidebar } from '@/components/ui/shared-sidebar';
import { ProjectEstimator } from '@/components/homepage/project-estimator';
import { EngagementModels } from '@/components/homepage/engagement-models';
import { SpeedRacerGame } from '@/components/interactive/speed-racer-game';

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
  featured?: boolean;
  publishedAt: string;
}

const CATEGORIES = [
  'All',
  'WordPress',
  'React & Next.js',
  'Gaming',
  'AI Engineering',
  'Frontend Performance',
  'Engineering Architecture',
];

export function BlogClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      try {
        const res = await fetch('/api/blog');
        const data = await res.json();
        if (data.success && Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      } catch (e) {
        console.warn('Failed to load blog posts from API');
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      post.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts.find((p) => p.featured) || filteredPosts[0];
  const regularPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id);

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-slate-900 font-sans selection:bg-brand-amber selection:text-slate-950 overflow-x-hidden">
      {/* Hero Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-indigo-950 via-slate-900 to-[#0b1a30] text-white">
        <div className="max-w-[1440px] mx-auto px-6 space-y-6 text-center">
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-extrabold tracking-wider uppercase"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Engineering Blog & Insights</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto"
          >
            Technical Articles & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200">Architecture Insights</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Deep-dives into React 19, Next.js 14 App Router, Headless WordPress, WebGL Gaming, and AI RAG implementations.
          </motion.p>

          {/* Search Bar & Categories */}
          <div className="pt-4 max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles by title, topic, or keyword (e.g. Next.js, Gaming, WordPress)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all shadow-inner"
              />
            </div>

            <div className="flex items-center justify-center gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main 2-Column Section (8 Cols Articles + 4 Cols Shared Sidebar) */}
      <section className="py-12 max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* MAIN ARTICLES COLUMN (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Featured Hero Article */}
            {featuredPost && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-xs font-extrabold uppercase text-amber-950 bg-amber-400 px-3 py-1 rounded-full">
                    ★ Featured Article
                  </span>
                  <span className="font-mono text-slate-500 text-xs">
                    {featuredPost.category || 'Engineering'}
                  </span>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#0b1a30] hover:text-amber-600 transition-colors leading-tight">
                    <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                  </h2>

                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 font-mono pt-2">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-amber-500" />
                      {featuredPost.author || 'Rowell Mark Blanca'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {featuredPost.readingTime || '5 min read'}
                    </span>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0b1a30] hover:bg-[#1d63ed] text-white font-extrabold text-xs shadow-md transition-all"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Articles Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <h3 className="text-xl font-black text-[#0b1a30]">
                  Published Articles ({filteredPosts.length})
                </h3>
              </div>

              {regularPosts.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs font-bold">
                  No articles found matching your criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {regularPosts.map((post, idx) => (
                    <motion.div
                      key={post.id || idx}
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-lg">
                            {post.category || 'Engineering'}
                          </span>
                          <span className="font-mono text-slate-500 text-[11px] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {post.readingTime || '5 min read'}
                          </span>
                        </div>

                        <h3 className="text-base font-black text-[#0b1a30] group-hover:text-amber-600 transition-colors leading-snug line-clamp-2">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400">
                          {new Date(post.publishedAt || Date.now()).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-black text-[#0b1a30] group-hover:text-[#1d63ed] transition-colors"
                        >
                          <span>Read Article</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* STICKY RIGHT SIDEBAR (4 Cols) */}
          <div className="lg:col-span-4">
            <SharedSidebar defaultService="Blog Inquiry — Custom Project" serviceType="both" />
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
