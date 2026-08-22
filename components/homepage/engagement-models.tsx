"use client";

import React, { useState } from "react";
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Zap, Layers, RefreshCw, Wrench } from "lucide-react";
import { ContactModal } from "@/components/ui/contact-modal";

export function EngagementModels() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const handleSelectPackage = (packageName: string) => {
    setSelectedService(packageName);
    setIsModalOpen(true);
  };

  return (
    <section className="relative w-full py-16 sm:py-24 bg-white border-t border-slate-200/80 overflow-hidden font-sans">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-black uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Working Models & Engagement</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0b1a30] tracking-tight">
            How We Can Work Together
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Transparent, flexible engagement structures tailored for funded startups, agencies, and UK, US & Australian (AU) businesses looking for direct senior engineering without agency overhead.
          </p>
        </div>

        {/* 3 Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: Fixed Scope Sprint */}
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-800 text-[10px] font-black uppercase tracking-wider">
                <Zap className="w-3 h-3 text-amber-600" /> Milestone-Based
              </div>
              <h3 className="text-xl font-black text-[#0b1a30]">
                Fixed-Scope Project Sprint
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Best for ground-up MVP builds, custom web application development, or complete platform redesigns with well-defined specs.
              </p>

              <div className="pt-4 border-t border-slate-200/80 space-y-2.5 text-xs text-slate-700 font-bold">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Fixed upfront pricing & clear delivery timeline</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Full architecture design, UI integration & QA</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>98+ Core Web Vitals performance guarantee</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>30 days post-launch warranty & bug-free handover</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleSelectPackage("Fixed-Scope Project Sprint")}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#0b1a30] hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Scope Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Fractional Senior Dev (Highlighted) */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#0b1a30] to-slate-900 border-2 border-amber-400 text-white transition-all flex flex-col justify-between shadow-2xl relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Most Popular for Agencies & Startups
            </div>

            <div className="space-y-4 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                <RefreshCw className="w-3 h-3 text-amber-400" /> Dedicated Retainer
              </div>
              <h3 className="text-xl font-black text-white">
                Fractional Senior Engineer
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Dedicated 20–40+ hours per month for rapid feature iterations, ongoing technical leadership, and agency overflow with full UK, US & AU overlap.
              </p>

              <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-200 font-bold">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Direct Slack / Teams access & daily standups</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Full UK (GMT), US & Australian (AEST) timezone overlap</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Continuous PR reviews, CI/CD, and fast shipping</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>No recruitment fees, payroll taxes, or agency bloat</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleSelectPackage("Fractional Senior Engineer Retainer")}
                className="w-full py-4 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl"
              >
                <span>Hire Fractional Dev</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: Codebase Rescue & Speed Audit */}
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-800 text-[10px] font-black uppercase tracking-wider">
                <Wrench className="w-3 h-3 text-blue-600" /> Fast Turnaround
              </div>
              <h3 className="text-xl font-black text-[#0b1a30]">
                Codebase Rescue & Speed Audit
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                1–2 week intensive optimization for slow, legacy, or buggy Next.js/WordPress websites needing sub-second performance.
              </p>

              <div className="pt-4 border-t border-slate-200/80 space-y-2.5 text-xs text-slate-700 font-bold">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Comprehensive Core Web Vitals bottleneck audit</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Database query optimization & asset minification</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Security patches & plugin bloat cleanup</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Detailed before/after speed benchmarking report</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleSelectPackage("Codebase Rescue & Speed Audit")}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#0b1a30] hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Request Speed Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultService={selectedService}
      />
    </section>
  );
}
