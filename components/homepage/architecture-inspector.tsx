'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Server,
  Database,
  Cpu,
  ShieldCheck,
  Zap,
  Code2,
  Play,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  ArrowRight,
  Globe,
  Lock,
} from 'lucide-react';

interface ArchNode {
  id: string;
  name: string;
  role: string;
  badge: string;
  latency: string;
  icon: React.ComponentType<{ className?: string }>;
  specs: {
    technology: string;
    security: string;
    caching: string;
    details: string;
  };
  codeSnippet: string;
}

interface ArchPreset {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  totalLatency: string;
  description: string;
  nodes: ArchNode[];
}

const PRESETS: ArchPreset[] = [
  {
    id: 'nextjs-saas',
    title: 'Next.js 14 Full-Stack SaaS',
    tagline: 'App Router + Edge Auth + NeonDB PostgreSQL',
    badge: 'Enterprise SaaS',
    totalLatency: '38ms TTFB',
    description:
      'Server-driven architecture leveraging React Server Components for zero client JavaScript bundle bloat, edge middleware for sub-5ms auth verification, and NeonDB serverless PostgreSQL via Prisma ORM.',
    nodes: [
      {
        id: 'client-rsc',
        name: 'Client / RSC Layer',
        role: 'React Server Components',
        badge: '0 KB JS Payload',
        latency: '0ms (SSR/Edge)',
        icon: Globe,
        specs: {
          technology: 'React 19 RSC, Server Actions, Next.js 14 App Router',
          security: 'CSRF token rotation, strict CSP headers, input sanitization',
          caching: 'stale-while-revalidate, edge route segment config',
          details: 'Direct server rendering streams pre-rendered HTML without sending heavy client-side JavaScript hydration bundles.',
        },
        codeSnippet: `// app/dashboard/page.tsx
export default async function DashboardPage() {
  // Direct server-side data fetch with zero client JS
  const data = await prisma.userMetrics.findUniqueOrThrow({
    where: { organizationId: session.orgId },
    select: { activeUsers: true, mrr: true }
  });

  return <MetricsDashboard data={data} />;
}`,
      },
      {
        id: 'edge-auth',
        name: 'Edge API & Middleware',
        role: 'Session & Rate Limiting',
        badge: 'Edge Auth',
        latency: '4ms',
        icon: Lock,
        specs: {
          technology: 'Next.js Edge Runtime, Upstash Redis Rate Limiter',
          security: 'HTTP-only secure JWT cookies, PBKDF2 crypto hashing, IP throttling',
          caching: 'In-memory edge token validation',
          details: 'Validates cryptographic session tokens at edge nodes closest to the user before any database connections are spawned.',
        },
        codeSnippet: `// middleware.ts
export async function middleware(req: NextRequest) {
  const token = req.cookies.get('admin_session_token')?.value;
  if (!token || !verifySessionToken(token)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}`,
      },
      {
        id: 'server-actions',
        name: 'Server Actions & ORM',
        role: 'Transactional Business Logic',
        badge: 'Type-Safe',
        latency: '18ms',
        icon: Cpu,
        specs: {
          technology: 'TypeScript Server Actions, Prisma Client, Zod Schema Validation',
          security: 'Strict runtime schema validation, SQL injection prevention via parameterized queries',
          caching: 'revalidateTag / revalidatePath cache revalidation',
          details: 'Executes atomic ACID database mutations with end-to-end type safety shared across frontend and backend contracts.',
        },
        codeSnippet: `// actions/invoice.ts
'use server';

export async function createInvoice(payload: InvoiceInput) {
  const parsed = InvoiceSchema.parse(payload);
  const invoice = await prisma.invoice.create({
    data: parsed,
    include: { client: true }
  });
  revalidatePath('/admin/invoices');
  return { success: true, invoice };
}`,
      },
      {
        id: 'neondb-postgres',
        name: 'NeonDB PostgreSQL',
        role: 'Serverless Relational DB',
        badge: 'PostgreSQL',
        latency: '16ms',
        icon: Database,
        specs: {
          technology: 'NeonDB Serverless Postgres, PgBouncer Connection Pooling',
          security: 'SSL encrypted connections, Row Level Security, automatic point-in-time recovery',
          caching: 'Multi-AZ read replicas & pooled connections',
          details: 'Ultra-low latency serverless PostgreSQL autoscaling to zero when idle and instantly scaling to handle high concurrency bursts.',
        },
        codeSnippet: `// prisma/schema.prisma
model Lead {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  status    String   @default("NEW")
  createdAt DateTime @default(now())

  @@index([email, status])
}`,
      },
    ],
  },
  {
    id: 'headless-wp',
    title: 'Headless WordPress & GraphQL Engine',
    tagline: 'Decoupled Next.js Frontend + WPGraphQL + Redis',
    badge: 'Enterprise CMS',
    totalLatency: '45ms TTFB',
    description:
      'The best of both worlds: empowering marketing teams with intuitive content editing in WordPress while delivering sub-second edge-rendered Next.js performance and impenetrable security.',
    nodes: [
      {
        id: 'nextjs-frontend',
        name: 'Next.js 14 Frontend',
        role: 'Decoupled UI Layer',
        badge: '99 Web Vitals',
        latency: '12ms',
        icon: Globe,
        specs: {
          technology: 'Next.js Incremental Static Regeneration (ISR), React 19',
          security: 'No direct public access to WordPress admin database or PHP server',
          caching: 'ISR with 60s background revalidation',
          details: 'Statically pre-renders high-converting landing pages at edge nodes, ensuring 99+ Core Web Vitals and zero database strain on traffic spikes.',
        },
        codeSnippet: `// app/case-studies/[slug]/page.tsx
export const revalidate = 60; // ISR

export async function generateStaticParams() {
  const posts = await fetchAllSlugsFromGraphQL();
  return posts.map((p) => ({ slug: p.slug }));
}`,
      },
      {
        id: 'wpgraphql-layer',
        name: 'WPGraphQL Gateway',
        role: 'Schema & API Layer',
        badge: 'GraphQL',
        latency: '22ms',
        icon: Server,
        specs: {
          technology: 'WPGraphQL, Custom PHP Resolvers, Smart Cache Purge',
          security: 'API query depth limiting, authenticated mutations',
          caching: 'Redis Object Cache & GraphQL HTTP caching',
          details: 'Batches nested WordPress data requests into a single round-trip query, eliminating N+1 query performance bottlenecks.',
        },
        codeSnippet: `query GetProjectDetail($slug: ID!) {
  project(id: $slug, idType: SLUG) {
    title
    caseStudyFields {
      clientRoi
      lighthouseSpeed
      techStack
    }
  }
}`,
      },
      {
        id: 'custom-wp-core',
        name: 'Custom PHP Core',
        role: 'PSR-4 Zero-Bloat Engine',
        badge: 'PHP 8.2+',
        latency: '11ms',
        icon: Code2,
        specs: {
          technology: 'OOP PHP, PSR-4 Autoloading, Bedrock/Composer architecture',
          security: 'Restricted XML-RPC, non-standard login paths, strict sanitization',
          caching: 'Redis persistent object cache integration',
          details: 'Engineered without commercial visual builders. Pure object-oriented PHP plugins with custom database tables for maximum throughput.',
        },
        codeSnippet: `<?php
namespace RowellDev\\Engine;

class CustomPostTypeRegistry {
    public function register(): void {
        register_post_type('portfolio_project', [
            'public' => true,
            'show_in_graphql' => true,
            'graphql_single_name' => 'project',
            'graphql_plural_name' => 'projects',
        ]);
    }
}`,
      },
    ],
  },
  {
    id: 'gutenberg-engine',
    title: 'Zero-Bloat Custom Gutenberg Engine',
    tagline: 'Handcrafted React Block Editor without Page Builder Bloat',
    badge: 'High Performance WP',
    totalLatency: '60ms TTFB',
    description:
      'Traditional agencies load 15+ external plugins and Elementor/Divi bloat (4MB+ bundle). Rowell engineers native React Gutenberg blocks compiled directly into clean HTML markup.',
    nodes: [
      {
        id: 'react-block-editor',
        name: 'Native React Gutenberg Block',
        role: 'Editorial UI',
        badge: '0KB Frontend JS',
        latency: '0ms',
        icon: Globe,
        specs: {
          technology: 'WordPress Block API (@wordpress/blocks), React, JSX',
          security: 'Sanitized innerHTML and strict block attribute typing',
          caching: 'Compiled static HTML in database post_content',
          details: 'Content editors get a visual drag-and-drop experience, but the database saves pure semantic HTML with zero frontend JavaScript dependencies.',
        },
        codeSnippet: `// blocks/roi-calculator/edit.tsx
import { useBlockProps, RichText } from '@wordpress/block-editor';

export function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps({ className: 'roi-metric-block' });
  return (
    <div {...blockProps}>
      <RichText tagName="h3" value={attributes.title} />
    </div>
  );
}`,
      },
      {
        id: 'indexed-mysql',
        name: 'Clean MySQL Query Layer',
        role: 'Optimized Database Tier',
        badge: 'Indexed SQL',
        latency: '15ms',
        icon: Database,
        specs: {
          technology: 'MySQL 8.0, Custom Composite Indexes, InnoDB Engine',
          security: 'Prepared $wpdb statements, nonces, capability checks',
          caching: 'Transients API & Memcached query cache',
          details: 'Eliminates thousands of postmeta queries. Replaces heavy dynamic joins with single indexed queries that run in under 15 milliseconds.',
        },
        codeSnippet: `// Optimized Direct Query
global $wpdb;
$results = $wpdb->get_results(
  $wpdb->prepare(
    "SELECT p.ID, p.post_title, m.meta_value AS metric 
     FROM {$wpdb->posts} p 
     INNER JOIN {$wpdb->postmeta} m ON p.ID = m.post_id 
     WHERE p.post_status = 'publish' AND m.meta_key = %s 
     ORDER BY p.post_date DESC LIMIT 10",
    'client_roi'
  )
);`,
      },
    ],
  },
];

export function ArchitectureInspector() {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<number>(-1);
  const [copiedCode, setCopiedCode] = useState(false);

  const currentPreset = PRESETS[activePresetIndex];
  const currentNode = currentPreset.nodes[activeNodeIndex] || currentPreset.nodes[0];

  const handleSimulateFlow = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationStep(0);

    const interval = setInterval(() => {
      setSimulationStep((prev) => {
        if (prev >= currentPreset.nodes.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSimulating(false);
            setSimulationStep(-1);
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 550);
  };

  const copyCode = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(currentNode.codeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <section
      id="architecture-inspector"
      className="py-24 bg-[#0B132B] text-white relative overflow-hidden border-b border-slate-800"
    >
      {/* Precision CAD Engineering Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-amber-400 text-xs font-mono font-bold tracking-wider">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Request Flow Blueprint</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            System Architecture Inspector
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            Inspect the high-performance architectural patterns powering modern web apps and custom enterprise CMS platforms. Click any node to review security layers, latency budgets, and real code.
          </p>
        </div>

        {/* Preset Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {PRESETS.map((preset, idx) => {
            const isSelected = activePresetIndex === idx;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  setActivePresetIndex(idx);
                  setActiveNodeIndex(0);
                  setSimulationStep(-1);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{preset.title}</span>
              </button>
            );
          })}
        </div>

        {/* Architecture Canvas & Inspector Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Left Canvas: Architecture Diagram & Flow */}
          <div className="lg:col-span-7 bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
            <div>
              {/* Preset Header Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white">{currentPreset.title}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {currentPreset.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{currentPreset.tagline}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-1 rounded-lg">
                    {currentPreset.totalLatency}
                  </span>
                  <button
                    onClick={handleSimulateFlow}
                    disabled={isSimulating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Play className={`w-3 h-3 ${isSimulating ? 'animate-spin' : 'fill-slate-950'}`} />
                    <span>{isSimulating ? 'Tracing...' : 'Trace Flow'}</span>
                  </button>
                </div>
              </div>

              {/* Node Sequence List / Diagram */}
              <div className="py-6 space-y-4">
                {currentPreset.nodes.map((node, nodeIdx) => {
                  const isNodeActive = activeNodeIndex === nodeIdx;
                  const isNodeHighlighted = simulationStep === nodeIdx;
                  const NodeIcon = node.icon;

                  return (
                    <div key={node.id} className="relative">
                      {/* Connection Pipe Line */}
                      {nodeIdx > 0 && (
                        <div className="absolute -top-4 left-6 w-0.5 h-4 bg-slate-800">
                          {simulationStep >= nodeIdx && (
                            <motion.div
                              layoutId="pulse-pipe"
                              className="w-full h-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"
                            />
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => setActiveNodeIndex(nodeIdx)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isNodeActive
                            ? 'bg-slate-800/90 border-amber-400/80 shadow-lg'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                        } ${isNodeHighlighted ? 'ring-2 ring-amber-400 bg-amber-950/30' : ''}`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                              isNodeActive
                                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            <NodeIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{node.name}</span>
                              <span className="text-[10px] font-mono text-slate-400">
                                Layer {nodeIdx + 1}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400">{node.role}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                            {node.latency}
                          </span>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {node.badge}
                          </span>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Architecture Summary Footer */}
            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 leading-relaxed font-medium">
              💡 {currentPreset.description}
            </div>
          </div>

          {/* Right Panel: Active Node Inspector & Code Viewer */}
          <div className="lg:col-span-5 bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-5">
              
              {/* Node Inspector Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Node Inspector
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5">{currentNode.name}</h3>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                  {currentNode.badge}
                </span>
              </div>

              {/* Node Specifications Grid */}
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                    Core Technology & Framework
                  </span>
                  <span className="text-xs font-bold text-slate-200 block mt-0.5">
                    {currentNode.specs.technology}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                      Security Controls
                    </span>
                    <span className="text-[11px] font-medium text-slate-300 block mt-0.5">
                      {currentNode.specs.security}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                      Caching & Invalidation
                    </span>
                    <span className="text-[11px] font-medium text-slate-300 block mt-0.5">
                      {currentNode.specs.caching}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {currentNode.specs.details}
                </p>
              </div>

              {/* Real Code Snippet Box */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    <span>Implementation Snippet</span>
                  </div>
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-52">
                  <code>{currentNode.codeSnippet}</code>
                </pre>
              </div>

            </div>

            {/* Bottom Callout */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Production Tested</span>
              <a
                href="#project-estimator"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <span>Request Custom Architecture →</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
