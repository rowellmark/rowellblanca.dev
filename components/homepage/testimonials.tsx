'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import Image from 'next/image';

export interface TestimonialItem {
  id?: number;
  name?: string;
  author?: string;
  role?: string;
  company?: string;
  companyUrl?: string;
  quote: string;
  avatarUrl?: string;
  rating?: number;
  featured?: boolean;
  active?: boolean;
}

export interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[];
  badge?: string;
  title?: string;
  subtitle?: string;
  dark?: boolean;
  showHeading?: boolean;
  className?: string;
}

export function TestimonialsSection({
  testimonials: initialTestimonials,
  badge = 'Client Feedback & Proof',
  title = 'Client Testimonials & Proven Results',
  subtitle = 'Trusted by agency partners, business owners, and tech leaders to deliver high-quality engineering.',
  dark = false,
  showHeading = true,
  className = '',
}: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials || []);
  const [loading, setLoading] = useState(!initialTestimonials || initialTestimonials.length === 0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (initialTestimonials && initialTestimonials.length > 0) {
      setTestimonials(initialTestimonials);
      setLoading(false);
      return;
    }

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
  }, [initialTestimonials]);

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
    if (!avatarUrl) return undefined;
    if (avatarUrl.includes('photo:')) {
      return avatarUrl.split('photo:')[1].split(',')[0];
    }
    if (avatarUrl.startsWith('http') || avatarUrl.startsWith('/')) {
      return avatarUrl;
    }
    return undefined;
  };

  if (!loading && testimonials.length === 0) return null;

  return (
    <section
      className={`py-24 border-y overflow-hidden relative ${
        dark
          ? 'bg-slate-950 border-slate-800 text-slate-100'
          : 'bg-[#F8FAFC] border-slate-200/60 text-brand-navy'
      } ${className}`}
    >
      {/* Background glow accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        {showHeading && (
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                dark
                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  : 'text-brand-amber bg-amber-50 border-amber-200/60'
              }`}
            >
              {badge}
            </span>
            <h2
              className={`text-4xl sm:text-5xl font-black tracking-tight ${
                dark ? 'text-white' : 'text-brand-navy'
              }`}
            >
              {title}
            </h2>
            {subtitle && (
              <p className={`text-base ${dark ? 'text-slate-400' : 'text-brand-slate'}`}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-3 w-3 rounded-full bg-brand-amber animate-ping" />
          </div>
        ) : (
          <div
            className="relative max-w-3xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Slider Controls (Prev & Next Buttons) */}
            {testimonials.length > 1 && (
              <>
                <div className="absolute top-1/2 -left-4 sm:-left-12 -translate-y-1/2 z-20">
                  <button
                    onClick={handlePrev}
                    className={`h-11 w-11 rounded-full border shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer ${
                      dark
                        ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                    title="Previous Testimonial"
                  >
                    <ChevronLeft className={`h-5 w-5 ${dark ? 'text-amber-400' : 'text-brand-navy'}`} />
                  </button>
                </div>

                <div className="absolute top-1/2 -right-4 sm:-right-12 -translate-y-1/2 z-20">
                  <button
                    onClick={handleNext}
                    className={`h-11 w-11 rounded-full border shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer ${
                      dark
                        ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                    title="Next Testimonial"
                  >
                    <ChevronRight className={`h-5 w-5 ${dark ? 'text-amber-400' : 'text-brand-navy'}`} />
                  </button>
                </div>
              </>
            )}

            {/* Testimonial Card Carousel Display */}
            <div className="overflow-hidden p-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className={`relative rounded-3xl p-8 sm:p-12 flex flex-col justify-between transition-all ${
                    dark
                      ? testimonials[currentIndex]?.featured
                        ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/40 border-2 border-amber-400/70 shadow-amber-500/10 shadow-2xl ring-1 ring-amber-400/30'
                        : 'bg-slate-900 border border-slate-800 shadow-xl'
                      : testimonials[currentIndex]?.featured
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
                      <Quote className={`h-10 w-10 ${dark ? 'text-amber-500/20' : 'text-amber-100'}`} />
                    </div>

                    {/* Quote Body */}
                    <p
                      className={`text-base sm:text-lg font-medium leading-relaxed italic ${
                        dark ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      &ldquo;{testimonials[currentIndex]?.quote}&rdquo;
                    </p>
                  </div>

                  {/* Author Info */}
                  <div
                    className={`flex items-center gap-4 pt-8 mt-8 border-t ${
                      dark ? 'border-slate-800' : 'border-slate-100'
                    }`}
                  >
                    <div className="relative h-14 w-14 rounded-full overflow-hidden bg-slate-800 shrink-0 border-2 border-amber-400/40 shadow-sm flex items-center justify-center">
                      {getPhotoUrl(testimonials[currentIndex]?.avatarUrl) ? (
                        <Image
                          src={getPhotoUrl(testimonials[currentIndex]?.avatarUrl)!}
                          alt={testimonials[currentIndex]?.name || testimonials[currentIndex]?.author || 'Client Testimonial'}
                          fill
                          className="object-cover"
                          sizes="56px"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-lg">
                          {(testimonials[currentIndex]?.name || testimonials[currentIndex]?.author)?.charAt(0) || 'C'}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4
                        className={`text-base font-extrabold leading-snug ${
                          dark ? 'text-white' : 'text-brand-navy'
                        }`}
                      >
                        {testimonials[currentIndex]?.name || testimonials[currentIndex]?.author}
                      </h4>
                      <p className={`text-xs sm:text-sm font-medium ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
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
                          <span className="text-brand-amber font-extrabold">
                            {testimonials[currentIndex]?.company}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Indicators (Dots) */}
            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentIndex
                        ? 'w-8 bg-brand-amber'
                        : dark
                        ? 'w-2.5 bg-slate-800 hover:bg-slate-700'
                        : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                    title={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
