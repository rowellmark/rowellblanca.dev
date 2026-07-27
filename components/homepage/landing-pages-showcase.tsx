"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, ArrowRight, Sparkles } from "lucide-react";

interface LandingPageItem {
  id: number;
  slug: string;
  badgeText?: string;
  heroTitle: string;
  heroSubtitle: string;
  active: boolean;
}

export function LandingPagesShowcase() {
  const [pages, setPages] = useState<LandingPageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPages() {
      try {
        const res = await fetch("/api/landing-pages");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.landingPages)) {
            setPages(data.landingPages.filter((p: LandingPageItem) => p.active !== false));
          }
        }
      } catch (e) {
        console.error("Failed to load landing pages:", e);
      } finally {
        setLoading(false);
      }
    }
    loadPages();
  }, []);

  if (loading || pages.length === 0) return null;

  return (
    <section className="py-24 bg-[#F8FAFC] border-t border-slate-200/60">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-amber bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
            Service Pages
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-brand-navy tracking-tight">
            Explore Targeted Case Studies
          </h2>
          <p className="text-base text-brand-slate">
            Dedicated pages built around specific tech stacks and client engagements — see proof, projects, and results.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page, idx) => {
            const isUkRoute = page.slug.startsWith("hire-");
            const path = isUkRoute ? `/${page.slug}` : `/landing/${page.slug}`;

            return (
              <motion.div
                key={page.id}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-brand-amber flex items-center justify-center">
                    <Globe className="h-5 w-5" />
                  </div>
                  {page.badgeText && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full inline-block">
                      {page.badgeText}
                    </span>
                  )}
                  <h3 className="text-lg font-extrabold text-brand-navy leading-snug">{page.heroTitle}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">
                    {page.heroSubtitle}
                  </p>
                </div>

                <Link
                  href={path}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-xs transition-all group"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>View Case Study</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
