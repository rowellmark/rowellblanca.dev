'use client';

import React, { useState } from 'react';
import { X, Sparkles, Loader2, Check, RefreshCw, AlertCircle } from 'lucide-react';

interface GeminiGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  initialData: {
    sitename: string;
    technologies: string[];
    description: string;
    client?: string;
    role?: string;
  };
  onApply: (generatedData: {
    category?: string;
    role?: string;
    duration?: string;
    challenge?: string;
    solution?: string;
    results?: string;
    content?: string;
  }) => void;
}

export default function GeminiGeneratorModal({
  open,
  onClose,
  initialData,
  onApply,
}: GeminiGeneratorModalProps) {
  const [customPrompt, setCustomPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any | null>(null);

  if (!open) return null;

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/admin/generate-case-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sitename: initialData.sitename,
          technologies: initialData.technologies,
          description: initialData.description,
          client: initialData.client,
          role: initialData.role,
          customPrompt,
        }),
      });

      const data = await res.json();
      if (data.success && data.caseStudy) {
        setResult(data.caseStudy);
      } else {
        setError(data.message || 'Failed to generate case study. Check your GEMINI_API_KEY.');
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
    <div className="fixed inset-0 z-[70] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0b1a30]">Gemini AI Case Study Generator</h3>
              <p className="text-xs text-slate-500 font-medium">
                Auto-create challenge, solution, key results & full HTML blog post using Gemini 2.5/1.5 Flash.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="space-y-5 overflow-y-auto pr-1 flex-1">
          {/* Context Info Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-700 font-bold">
              <span>Project Target:</span>
              <span className="text-brand-amber uppercase tracking-wider font-extrabold">
                {initialData.sitename || 'Untitled Project'}
              </span>
            </div>
            {initialData.technologies?.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {initialData.technologies.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-mono text-[10px]">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Prompt Tuning Field */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Custom Prompt Instructions (Optional)
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Focus on scalability, high concurrency, and automated deployment pipelines..."
              className="w-full p-3.5 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:border-brand-amber focus:ring-2 focus:ring-amber-500/10 outline-none transition-all"
              rows={2}
            />
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs font-medium">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Generation Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Generated Result Preview Box */}
          {result && (
            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-300/80 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                <span className="font-black text-[#0b1a30] uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" /> Case Study Draft Ready
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-brand-amber font-extrabold text-[10px]">
                  {result.category || 'Case Study'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="font-extrabold text-[#0b1a30] block mb-1">Challenge Summary</span>
                  <p className="leading-relaxed">{result.challenge}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="font-extrabold text-[#0b1a30] block mb-1">Technical Solution</span>
                  <p className="leading-relaxed">{result.solution}</p>
                </div>
              </div>

              {result.results && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700">
                  <span className="font-extrabold text-[#0b1a30] block mb-1">Key Results & Impact</span>
                  <p className="leading-relaxed">{result.results}</p>
                </div>
              )}

              {result.content && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-extrabold text-[#0b1a30] block">Generated HTML Blog Post Body</span>
                  <div className="max-h-40 overflow-y-auto p-2 bg-slate-900 text-amber-300 font-mono text-[11px] rounded-lg">
                    {result.content}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                Generating with Gemini AI...
              </>
            ) : result ? (
              <>
                <RefreshCw className="w-4 h-4 text-amber-400" />
                Regenerate Case Study
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                Generate Case Study
              </>
            )}
          </button>

          {result && (
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-3 rounded-2xl bg-brand-amber hover:bg-brand-amber-h text-brand-navy text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Apply Generated Data To Form
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
