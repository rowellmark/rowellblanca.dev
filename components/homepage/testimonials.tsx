'use client';

import React, { useEffect, useState } from 'react';
import { Star, ChevronLeft, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
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

  // Auto-play slider every 5.5 seconds
  useEffect(() => {
    if (testimonials.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [testimonials.length, isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleDotClick = (idx: number) => {
    setCurrentIndex(idx);
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

  const current = testimonials[currentIndex];
  const authorName = current?.name || current?.author;
  const photo = getPhotoUrl(current?.avatarUrl);
  const pad = (n: number) => String(n).padStart(2, '0');

  const panel = dark ? 'bg-brand-ink-2 text-white border border-white/[0.08]' : 'bg-brand-cream text-brand-navy';
  const muted = dark ? 'text-slate-400' : 'text-brand-slate';
  const navBtn = `motion-btn h-[52px] w-[52px] rounded-full border flex items-center justify-center cursor-pointer ${
    dark ? 'border-white/15 hover:border-white/50 text-white' : 'border-brand-navy/20 hover:border-brand-navy text-brand-navy'
  }`;

  return (
    <section className={`px-4 sm:px-6 lg:px-10 py-24 lg:py-40 ${dark ? 'bg-brand-ink text-white' : 'text-brand-navy'} ${className}`}>
      <div className="mx-auto max-w-[1360px] flex flex-col gap-14 lg:gap-16">
        {showHeading && (
          <div className="motion-reveal flex flex-wrap items-end justify-between gap-8">
            <div className="flex flex-col gap-5 max-w-[860px]">
              <p className={`m-0 font-mono text-[13px] tracking-[0.08em] uppercase ${muted}`}>{badge}</p>
              <h2 className="m-0 font-extrabold tracking-[-0.045em] leading-[0.98] text-[clamp(40px,5.2vw,84px)]">{title}</h2>
            </div>
            {subtitle && <p className={`m-0 max-w-[420px] text-[17px] leading-relaxed ${muted}`}>{subtitle}</p>}
          </div>
        )}

        {loading ? (
          <div className={`rounded-[28px] min-h-[420px] flex items-center justify-center ${panel}`}>
            <div className="h-3 w-3 rounded-full bg-amber-500 animate-ping" />
          </div>
        ) : (
          <figure
            className={`motion-reveal m-0 rounded-[28px] p-7 sm:p-12 lg:p-16 flex flex-col gap-10 lg:gap-14 ${panel}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Rating, counter & controls */}
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div role="img" className="flex items-center gap-1" aria-label={`Rated ${current?.rating || 5} out of 5`}>
                  {Array.from({ length: current?.rating || 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" aria-hidden="true" />
                  ))}
                </div>
                {current?.featured && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full bg-amber-500 text-brand-ink">
                    <Sparkles className="w-3 h-3" aria-hidden="true" /> Featured
                  </span>
                )}
              </div>
              {testimonials.length > 1 && (
                <div className="flex items-center gap-4">
                  <span className={`font-mono text-sm tabular-nums ${muted}`} aria-live="polite">
                    <span className={dark ? 'text-white' : 'text-brand-navy'}>{pad(currentIndex + 1)}</span> / {pad(testimonials.length)}
                  </span>
                  <button type="button" onClick={handlePrev} className={navBtn} aria-label="Previous testimonial">
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={handleNext} className={navBtn} aria-label="Next testimonial">
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            {/* Quote — keyed so each change replays the rise-in */}
            <div key={currentIndex} className="flex flex-col gap-10 lg:gap-14 min-h-[260px]">
              <blockquote className="motion-fade m-0 font-semibold tracking-[-0.03em] leading-[1.18] text-[clamp(24px,3.1vw,48px)]">
                &ldquo;{current?.quote}&rdquo;
              </blockquote>

              <figcaption className="motion-fade motion-d2 mt-auto flex items-center gap-4">
                <span className="relative h-14 w-14 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-amber-500 text-brand-ink font-extrabold text-lg">
                  {photo ? (
                    <Image src={photo} alt={authorName || 'Client'} fill className="object-cover" sizes="56px" unoptimized />
                  ) : (
                    <span aria-hidden="true">{authorName?.charAt(0) || 'C'}</span>
                  )}
                </span>
                <span className="flex flex-col gap-0.5">
                  <strong className="text-base font-extrabold">{authorName}</strong>
                  <span className={`text-sm ${muted}`}>
                    {current?.role}
                    {current?.role && current?.company ? ' · ' : ''}
                    {current?.companyUrl ? (
                      <a
                        href={current.companyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`motion-underline font-semibold inline-flex items-center gap-1 ${dark ? 'text-amber-400' : 'text-amber-700'}`}
                      >
                        {current?.company}
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    ) : (
                      <span className={`font-semibold ${dark ? 'text-amber-400' : 'text-amber-700'}`}>{current?.company}</span>
                    )}
                  </span>
                </span>
              </figcaption>
            </div>

            {/* Segmented autoplay progress (doubles as pagination) */}
            {testimonials.length > 1 && (
              <div className={`flex gap-2 ${isPaused ? 'motion-progress-paused' : ''}`}>
                {testimonials.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDotClick(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    aria-current={idx === currentIndex}
                    className="group flex-1 py-3 cursor-pointer"
                  >
                    <span className={`block h-[3px] rounded-full overflow-hidden ${dark ? 'bg-white/15' : 'bg-brand-navy/15'}`}>
                      {idx < currentIndex && <span className={`block h-full ${dark ? 'bg-white/50' : 'bg-brand-navy/40'}`} />}
                      {idx === currentIndex && (
                        <span key={`${currentIndex}-${isPaused}`} className="motion-progress-fill block h-full bg-amber-500" />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </figure>
        )}
      </div>
    </section>
  );
}
