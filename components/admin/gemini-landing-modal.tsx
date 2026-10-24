'use client';

import React, { useState } from 'react';
import { X, Sparkles, Loader2, Check, RefreshCw, AlertCircle } from 'lucide-react';

interface GeminiLandingModalProps {
  open: boolean;
  onClose: () => void;
  initialData: {
    slug: string;
    targetKeyword: string;
  };
  onApply: (generatedData: {
    badgeText?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    heroCtaText?: string;
    targetKeyword?: string;
    metaTitle?: string;
    metaDescription?: string;
  }) => void;
}

export default function GeminiLandingModal({ open, onClose, initialData, onApply }: GeminiLandingModalProps) {
  const [customPrompt, setCustomPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any | null>(null);

  if (!open) return null;

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/admin/generate-landing-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: initialData.slug,
          targetKeyword: initialData.targetKeyword,
          customPrompt,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = {};

      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const textResponse = await res.text();
        if (res.status === 401) {
          throw new Error('Admin session expired or unauthorized. Please log in to the admin dashboard.');
        }
        throw new Error(textResponse || `Server error (${res.status})`);
      }

      if (res.ok && data.success && data.copy) {
        setResult(data.copy);
      } else {
        setError(data.message || 'Failed to generate landing page copy. Check your GEMINI_API_KEY.');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error calling Gemini AI endpoint');
    } finally {
      setGenerating(false);
    }
  };

  const handleApply = () => {
    if (result) {
      onApply(result);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-sm relative my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-zinc-950">Gemini AI Landing Page Copywriter</h3>
              <p className="text-xs text-zinc-500 font-medium">
                Auto-generate hero copy, CTA, and SEO metadata using Gemini 2.5/1.5 Flash.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="space-y-5 overflow-y-auto pr-1 flex-1">
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-xs">
            <div className="flex justify-between items-center text-zinc-700 font-bold">
              <span>Target Keyword / Slug:</span>
              <span className="text-brand-amber uppercase tracking-wider font-semibold">
                {initialData.targetKeyword || initialData.slug || 'Untitled Page'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
              Custom Prompt Instructions (Optional)
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Focus on fintech clients, emphasize FCA-regulated project experience..."
              className="w-full p-3.5 border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:border-brand-amber focus:ring-2 focus:ring-amber-500/10 outline-none transition-all"
              rows={2}
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs font-medium">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Generation Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-300/80 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                <span className="font-semibold text-zinc-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" /> Landing Page Copy Ready
                </span>
              </div>

              <div className="space-y-2 text-zinc-700">
                <div className="p-3 bg-white rounded-xl border border-zinc-200">
                  <span className="font-semibold text-zinc-950 block mb-1">Badge</span>
                  <p className="leading-relaxed">{result.badgeText}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-zinc-200">
                  <span className="font-semibold text-zinc-950 block mb-1">Hero Title</span>
                  <p className="leading-relaxed font-bold">{result.heroTitle}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-zinc-200">
                  <span className="font-semibold text-zinc-950 block mb-1">Hero Subtitle</span>
                  <p className="leading-relaxed">{result.heroSubtitle}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-zinc-200">
                  <span className="font-semibold text-zinc-950 block mb-1">CTA</span>
                  <p className="leading-relaxed">{result.heroCtaText}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-zinc-200">
                  <span className="font-semibold text-zinc-950 block mb-1">Meta Title</span>
                  <p className="leading-relaxed">{result.metaTitle}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-zinc-200">
                  <span className="font-semibold text-zinc-950 block mb-1">Meta Description</span>
                  <p className="leading-relaxed">{result.metaDescription}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-zinc-100 pt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="px-5 py-3 rounded-xl bg-zinc-950 hover:from-zinc-800 hover:to-zinc-700 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                Generating with Gemini AI...
              </>
            ) : result ? (
              <>
                <RefreshCw className="w-4 h-4 text-amber-400" />
                Regenerate Copy
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                Generate Landing Page Copy
              </>
            )}
          </button>

          {result && (
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-3 rounded-xl bg-brand-amber hover:bg-brand-amber-h text-brand-navy text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Apply Generated Copy To Form
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
