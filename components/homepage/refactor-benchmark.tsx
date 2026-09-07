'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Gauge,
  FileCode,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface BenchmarkScenario {
  id: string;
  title: string;
  subtitle: string;
  problem: string;
  solution: string;
  metrics: {
    label: string;
    before: string;
    after: string;
    diff: string;
    isImprovement: boolean;
  }[];
  codeBeforeTitle: string;
  codeBefore: string;
  codeAfterTitle: string;
  codeAfter: string;
}

const SCENARIOS: BenchmarkScenario[] = [
  {
    id: 'wordpress-bloat',
    title: 'Custom Gutenberg vs Bloated Agency Page Builder',
    subtitle: 'High-Impact WordPress Re-Engineering',
    problem: 'Typical agencies assemble 15+ external plugins and visual builders (Elementor/Divi) resulting in 4MB+ assets and sluggish TTFB.',
    solution: 'Rowell engineers bespoke native React Gutenberg blocks compiled directly to HTML with custom indexed MySQL tables.',
    metrics: [
      { label: 'Page Weight', before: '4.2 MB', after: '120 KB', diff: '-97% Data Transfer', isImprovement: true },
      { label: 'Time To First Byte (TTFB)', before: '3.8s', after: '160ms', diff: '23x Faster', isImprovement: true },
      { label: 'Database Queries', before: '82 queries', after: '2 queries', diff: '-97% DB Load', isImprovement: true },
      { label: 'Core Web Vitals Score', before: '42 / 100', after: '99 / 100', diff: '+57 Points', isImprovement: true },
    ],
    codeBeforeTitle: 'Legacy: Heavy Dynamic Page Builder Join',
    codeBefore: `// ❌ Typical Page Builder / Heavy Plugin
function get_custom_roi_data($post_id) {
    // Spawns 15+ unindexed postmeta queries
    $meta = get_post_meta($post_id);
    $plugins = apply_filters('elementor/frontend/the_content', ...);
    $queries = run_dynamic_subqueries($meta);
    return render_heavy_visual_builder_json($queries);
}`,
    codeAfterTitle: 'Rowell Build: Clean PSR-4 Indexed SQL',
    codeAfter: `// ✅ Rowell Bespoke Zero-Bloat Engine
public function getRoiMetrics(int $id): array {
    // Single indexed query running in 8ms
    return $this->db->get_row(
        $this->db->prepare(
            "SELECT revenue_lift, ttfb_ms FROM {$this->table}
             WHERE project_id = %d LIMIT 1",
            $id
        ),
        ARRAY_A
    ) ?? [];
}`,
  },
  {
    id: 'nextjs-waterfall',
    title: 'Next.js 14 RSC vs Client Hydration Waterfall',
    subtitle: 'Modern Full-Stack Architecture Refactor',
    problem: 'Client-heavy single page apps trigger cascaded network requests (waterfalls) and ship megabytes of JavaScript before anything renders.',
    solution: 'Rowell leverages React Server Components (RSC) and parallel server actions with zero client JS overhead.',
    metrics: [
      { label: 'Client JS Bundle', before: '850 KB', after: '0 KB (RSC)', diff: 'Zero Bundle Bloat', isImprovement: true },
      { label: 'First Contentful Paint (FCP)', before: '2.4s', after: '0.4s', diff: '6x Faster Render', isImprovement: true },
      { label: 'API Roundtrips', before: '5 cascaded', after: '1 parallel', diff: 'No Waterfalls', isImprovement: true },
      { label: 'Lighthouse Performance', before: '56 / 100', after: '100 / 100', diff: 'Perfect Score', isImprovement: true },
    ],
    codeBeforeTitle: 'Legacy: Cascaded useEffect Client Waterfall',
    codeBefore: `// ❌ Cascaded Client Network Waterfall
useEffect(() => {
  fetch('/api/user').then(res => res.json()).then(u => {
    fetch('/api/org/' + u.orgId).then(res => res.json()).then(org => {
      fetch('/api/invoices/' + org.id).then(...); // 800ms+ lag
    });
  });
}, []);`,
    codeAfterTitle: 'Rowell Build: Parallel Server Action with Prisma Batch',
    codeAfter: `// ✅ Server Action with Parallel Fetch (38ms)
export async function getDashboardData(userId: string) {
  const [user, orgMetrics, activeInvoices] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.organization.findFirst({ where: { ownerId: userId } }),
    prisma.invoice.findMany({ where: { status: 'PENDING' }, take: 10 })
  ]);
  return { user, orgMetrics, activeInvoices };
}`,
  },
];

export function RefactorBenchmark() {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [viewCodeTab, setViewCodeTab] = useState<'both' | 'after'>('both');

  const scenario = SCENARIOS[activeScenarioIdx];

  return (
    <section id="refactor-benchmark" className="py-24 bg-white border-b border-slate-200/80 overflow-hidden font-sans">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 inline-flex items-center gap-1.5 shadow-2xs">
            <Gauge className="w-3.5 h-3.5 text-amber-600" /> Verifiable Engineering ROI
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0b1a30] tracking-tight leading-tight">
            Before & After Performance Bench
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Real architectural benchmarks comparing bloated standard agency code against Rowell’s zero-bloat, high-performance systems.
          </p>
        </div>

        {/* Scenario Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {SCENARIOS.map((sc, idx) => {
            const isSelected = activeScenarioIdx === idx;
            return (
              <button
                key={sc.id}
                onClick={() => setActiveScenarioIdx(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-[#0b1a30] text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {sc.title}
              </button>
            );
          })}
        </div>

        {/* Metric Comparison Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {scenario.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#FAFAF7] border border-slate-200/90 shadow-2xs hover:border-amber-400/50 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                  {metric.label}
                </span>
                
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs line-through text-slate-400 font-mono block">
                      {metric.before}
                    </span>
                    <span className="text-2xl font-black text-[#0b1a30] tracking-tight">
                      {metric.after}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                  {metric.diff}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
            </div>
          ))}
        </div>

        {/* Side-by-Side Code Diff Card */}
        <div className="rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-xl overflow-hidden">
          
          {/* Header Bar */}
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                Code Comparison · {scenario.subtitle}
              </span>
            </div>

            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-0.5 rounded">
              Verified Production Refactor
            </span>
          </div>

          {/* Side-by-Side Code Windows */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            
            {/* Left: Legacy Code */}
            <div className="p-6 bg-slate-950/90">
              <div className="flex items-center gap-2 mb-3 text-rose-400">
                <XCircle className="w-4 h-4 shrink-0" />
                <span className="text-xs font-mono font-bold">{scenario.codeBeforeTitle}</span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed font-medium">
                {scenario.problem}
              </p>
              <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] font-mono text-rose-200/90 overflow-x-auto leading-relaxed">
                <code>{scenario.codeBefore}</code>
              </pre>
            </div>

            {/* Right: Rowell's Solution */}
            <div className="p-6 bg-slate-950">
              <div className="flex items-center gap-2 mb-3 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="text-xs font-mono font-bold">{scenario.codeAfterTitle}</span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed font-medium">
                {scenario.solution}
              </p>
              <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] font-mono text-emerald-200/90 overflow-x-auto leading-relaxed">
                <code>{scenario.codeAfter}</code>
              </pre>
            </div>

          </div>

          {/* Footer Callout */}
          <div className="px-6 py-3.5 bg-slate-900/70 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Result: Sub-second load times & 99+ Core Web Vitals on mobile and desktop</span>
            <a href="#project-estimator" className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors">
              <span>Benchmark Your Site →</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
