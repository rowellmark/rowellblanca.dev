'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  id?: number;
  name: string;
  role: string;
  company: string;
  companyUrl?: string;
  quote: string;
  avatarUrl?: string;
  rating: number;
  featured?: boolean;
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          const rawList = Array.isArray(data.testimonials) ? data.testimonials : (Array.isArray(data) ? data : []);
          const activeList = rawList.filter((t: any) => t.active !== false);
          setTestimonials(activeList);
        }
      } catch (e) {
        console.error('Failed to load testimonials:', e);
      } finally {
        setLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  // Auto-play slider every 4.5 seconds
  useEffect(() => {
    if (testimonials.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [testimonials.length, isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getPhotoUrl = (avatarUrl?: string) => {
    if (!avatarUrl?.includes('photo:')) return undefined;
    return avatarUrl.split('photo:')[1].split(',')[0];
  };

  return (
    <section className="py-24 bg-[#F8FAFC] border-y border-slate-200/60 overflow-hidden relative">
      {/* Background glow accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-amber bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
            Client Feedback & Proof
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-brand-navy tracking-tight">
            Client Testimonials & Proven Results
          </h2>
          <p className="text-base text-brand-slate">
            Trusted by agency partners, business owners, and tech leaders to deliver high-quality engineering.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-3 w-3 rounded-full bg-brand-amber animate-ping" />
          </div>
        ) : testimonials.length === 0 ? null : (
          <div
            className="relative max-w-3xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Slider Controls (Prev & Next Buttons) */}
            <div className="absolute top-1/2 -left-4 sm:-left-12 -translate-y-1/2 z-20">
              <button
                onClick={handlePrev}
                className="h-11 w-11 rounded-full bg-white border border-slate-200 shadow-md hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all hover:scale-105"
                title="Previous Testimonial"
              >
                <ChevronLeft className="h-5 w-5 text-brand-navy" />
              </button>
            </div>

            <div className="absolute top-1/2 -right-4 sm:-right-12 -translate-y-1/2 z-20">
              <button
                onClick={handleNext}
                className="h-11 w-11 rounded-full bg-white border border-slate-200 shadow-md hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all hover:scale-105"
                title="Next Testimonial"
              >
                <ChevronRight className="h-5 w-5 text-brand-navy" />
              </button>
            </div>

            {/* Testimonial Card Carousel Display */}
            <div className="overflow-hidden p-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className={`relative rounded-3xl p-8 sm:p-12 flex flex-col justify-between transition-all ${
                    testimonials[currentIndex]?.featured
                      ? 'bg-gradient-to-b from-white via-white to-amber-50/50 border-2 border-amber-400/70 shadow-amber-500/10 shadow-2xl ring-1 ring-amber-400/30'
                      : 'bg-white border border-slate-200/90 shadow-xl'
                  }`}
                >
                  {/* Accent bar */}
                  <div className="absolute top-0 inset-x-12 h-1 bg-gradient-to-r from-brand-amber via-amber-500 to-amber-600 rounded-b-full" />

                  {testimonials[currentIndex]?.featured && (
                    <span className="absolute -top-3 right-8 text-[10px] font-black uppercase tracking-wider text-slate-950 bg-amber-400 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3 fill-slate-950" /> Featured
                    </span>
                  )}

                  <div className="space-y-6">
                    {/* Star Rating & Quote Icon */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: testimonials[currentIndex]?.rating || 5 }).map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <Quote className="h-10 w-10 text-amber-100" />
                    </div>

                    {/* Quote Body */}
                    <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed italic">
                      "{testimonials[currentIndex]?.quote}"
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 pt-8 mt-8 border-t border-slate-100">
                    <div className="relative h-14 w-14 rounded-full overflow-hidden bg-slate-100 shrink-0 border-2 border-amber-200 shadow-sm">
                      <Image
                        src={getPhotoUrl(testimonials[currentIndex]?.avatarUrl) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                        alt={testimonials[currentIndex]?.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                        unoptimized
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-brand-navy leading-snug">
                        {testimonials[currentIndex]?.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        {testimonials[currentIndex]?.role} ·{' '}
                        {testimonials[currentIndex]?.companyUrl ? (
                          <a
                            href={testimonials[currentIndex]?.companyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand-amber font-extrabold hover:underline inline-flex items-center gap-1"
                          >
                            {testimonials[currentIndex]?.company}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-brand-amber font-extrabold">{testimonials[currentIndex]?.company}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Indicators (Dots) */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-8 bg-brand-amber'
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  title={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
