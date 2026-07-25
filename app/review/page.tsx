'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, CheckCircle2, Send, Loader2, MessageSquareQuote, Building2, User, ArrowLeft, Sparkles } from 'lucide-react';

export default function SubmitReviewPage() {
  const [form, setForm] = useState({
    name: '',
    role: '',
    company: '',
    rating: 5,
    quote: '',
  });

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.quote.trim()) {
      setErrorMsg('Please fill in your name and review details.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/testimonials/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.message || 'Failed to submit review. Please try again.');
      }
    } catch (err) {
      setErrorMsg('An error occurred during submission. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeRating = hoverRating !== null ? hoverRating : form.rating;

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#0F172A] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center items-center">
      
      {/* Ambient background decoration */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-400/10 via-orange-300/10 to-indigo-300/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to rowellblanca.dev</span>
        </Link>

        {submitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200/80 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                Review Received
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                Thank You for Your Feedback!
              </h1>
              <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                Your testimonial has been submitted successfully. Thank you for taking the time to share your experience working with me!
              </p>
            </div>

            {/* Preview of submitted review */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 text-left space-y-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: form.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm italic text-slate-700 font-medium">"{form.quote}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center text-sm border border-amber-300">
                  {form.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="font-extrabold text-sm text-[#0F172A] block">{form.name}</span>
                  <span className="text-xs text-slate-500 font-medium">
                    {form.role} {form.company ? `· ${form.company}` : ''}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-4">
              <Link
                href="/"
                className="px-6 py-3 rounded-full bg-[#0b1a30] hover:bg-slate-800 text-white font-extrabold text-sm shadow-md transition-all hover:scale-105"
              >
                Return to Portfolio
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200/80 space-y-8">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-brand-amber bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Client Feedback & Review
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                Share Your Experience
              </h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your feedback helps showcase real client experiences and continuous quality improvements.
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Star Rating Selector */}
              <div className="space-y-2 text-center bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Overall Experience Rating *
                </label>
                <div className="flex items-center justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setForm((prev) => ({ ...prev, rating: star }))}
                      className="p-1.5 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= activeRating
                            ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                            : 'text-slate-300 fill-slate-100'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-600 block pt-1">
                  {activeRating === 5 && '★★★★★ Excellent (5/5)'}
                  {activeRating === 4 && '★★★★☆ Great (4/5)'}
                  {activeRating === 3 && '★★★☆☆ Good (3/5)'}
                  {activeRating === 2 && '★★☆☆☆ Fair (2/5)'}
                  {activeRating === 1 && '★☆☆☆☆ Poor (1/5)'}
                </span>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-500" /> Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Giles McManus"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Title / Role
                  </label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="e.g. Managing Director / Founder"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Company / Business Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-500" /> Company / Business Name
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="e.g. MacManus Asset Finance"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                />
              </div>

              {/* Testimonial / Review Text */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MessageSquareQuote className="w-3.5 h-3.5 text-amber-500" /> Testimonial & Review *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  placeholder="Share details about the project quality, communication, technical execution, and outcome..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Submitting Review...
                  </>
                ) : (
                  <>
                    <span>Submit Review</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
