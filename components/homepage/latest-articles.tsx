'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, Calendar, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  tags: string[];
  readingTime?: string;
  publishedAt: string;
}

export function LatestArticlesSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLatestPosts() {
      try {
        const res = await fetch('/api/blog');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.posts)) {
            setPosts(data.posts.slice(0, 3));
          }
        }
      } catch (e) {
        console.warn('Failed to load homepage blog feed');
      } finally {
        setLoading(false);
      }
    }
    loadLatestPosts();
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section className="py-24 bg-[#FAFAF7] border-b border-slate-200/80">
      <div className="container mx-auto px-6 max-w-6xl space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-amber bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/80 inline-flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-brand-amber" />
            <span>Technical Blog & Engineering Insights</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
            Latest Articles & Case Studies
          </h2>
          <p className="text-base text-brand-slate font-medium">
            Deep dives into React, Next.js 14 App Router, bespoke WordPress architecture, and AI workflow integrations.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id || idx}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                    {post.category || 'Engineering'}
                  </span>
                  <span className="font-mono text-slate-500 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {post.readingTime || '5 min read'}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-brand-navy group-hover:text-brand-amber transition-colors leading-snug line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-brand-amber" />
                  {new Date(post.publishedAt || Date.now()).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-black text-brand-navy group-hover:text-brand-amber flex items-center gap-1 transition-all"
                >
                  <span>Read Article</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Blog Link */}
        <div className="text-center pt-2">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
          >
            <span>Explore All Blog Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
