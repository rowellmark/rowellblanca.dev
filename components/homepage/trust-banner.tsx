"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Clock, ArrowUpRight, Award, Code2, Globe2, Zap } from "lucide-react";

export function TrustBanner() {
  return (
    <section className="relative w-full py-10 bg-white border-y border-slate-200/80 overflow-hidden font-sans shadow-xs">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Top Eyebrow */}
        <div className="text-center mb-7">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
            Trusted by UK, US & Australian Businesses for Mission-Critical Engineering
          </p>
        </div>

        {/* Client Showcase & Trust Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-stretch text-center">
          {/* MacManus Finance */}
          <Link
            href="/mywork/macmanus-portal"
            className="group p-4 sm:p-5 rounded-2xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200/80 hover:border-amber-400/50 transition-all duration-300 flex flex-col items-center justify-between"
          >
            <div className="flex items-center gap-1 text-xs font-black text-[#0b1a30] group-hover:text-amber-800">
              <span>MacManus Finance</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-amber-600" />
            </div>
            <span className="text-[11px] text-slate-500 font-medium my-1.5">UK Asset Finance Portal</span>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
              98/100 Core Web Vitals
            </span>
          </Link>

          {/* BuildForUser SaaS */}
          <Link
            href="/mywork/buildforuser"
            className="group p-4 sm:p-5 rounded-2xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200/80 hover:border-amber-400/50 transition-all duration-300 flex flex-col items-center justify-between"
          >
            <div className="flex items-center gap-1 text-xs font-black text-[#0b1a30] group-hover:text-amber-800">
              <span>BuildForUser Platform</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-amber-600" />
            </div>
            <span className="text-[11px] text-slate-500 font-medium my-1.5">SaaS & Multi-Tenant Engine</span>
            <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
              Next.js & NeonDB
            </span>
          </Link>

          {/* Timezone Guarantee */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-between">
            <div className="flex items-center gap-1 text-xs font-black text-[#0b1a30]">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Full Timezone Overlap</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium my-1.5">UK (GMT), US (EST) & AU (AEST)</span>
            <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-full">
              Daily Standups & Slack
            </span>
          </div>

          {/* Direct Senior Dev Access */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-between">
            <div className="flex items-center gap-1 text-xs font-black text-[#0b1a30]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Senior Access</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium my-1.5">12+ Yrs Senior Engineering</span>
            <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
              Zero Junior Delegation
            </span>
          </div>
        </div>

        {/* Unified Key Stats & Highlights */}
        <div className="mt-8 pt-7 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-slate-100 max-md:divide-x-0">
          <div className="flex flex-col items-center justify-center space-y-0.5">
            <span className="text-2xl sm:text-3xl font-black text-[#0b1a30] tracking-tight">12+ Years</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Production Software</span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-0.5">
            <span className="text-2xl sm:text-3xl font-black text-[#0b1a30] tracking-tight">50+ Projects</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Across Global Clients</span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-0.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">Sub-Second</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">98+ Web Vitals Speed</span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-0.5">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">100% Success</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Top Rated Upwork & Direct</span>
          </div>
        </div>
      </div>
    </section>
  );
}
