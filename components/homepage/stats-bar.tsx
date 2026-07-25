'use client';

import React from 'react';
import { Award, Code2, Globe2, ShieldCheck } from 'lucide-react';

const STATS = [
  { icon: Award, label: '12+ Years', sub: 'Building Production Software' },
  { icon: Code2, label: '50+ Projects', sub: 'Across Startups & Enterprises' },
  { icon: ShieldCheck, label: '100% Success', sub: 'Job Success Rate on Upwork' },
  { icon: Globe2, label: 'Global Reach', sub: 'US, UK, Hong Kong & PH Clients' },
];

export function StatsBar() {
  return (
    <div className="bg-white border-y border-slate-200/80 py-8 relative z-20 shadow-sm">
      <h2 className="sr-only">Career Highlights & Client Results</h2>
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-slate-100 max-md:divide-x-0">
          {STATS.map(({ icon: Icon, label, sub }, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center p-2 space-y-1">
              <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-brand-amber mb-1">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
                {label}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
