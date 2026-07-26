'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Server, Layout, Cpu, Puzzle, CheckCircle2, Terminal, Code2, Layers, ShieldCheck, Zap } from 'lucide-react';

import { TrueFocus } from '../ui/true-focus';
import { AnimatedBlob } from '../ui/animated-blob';

const TECH_STATS = [
  { label: 'Full-Stack Engineering', value: '12+ Years', icon: Terminal, colorPreset: 'amber' as const },
  { label: 'Core Tech Stack', value: 'React / Next.js / Node / PHP', icon: Code2, colorPreset: 'sky' as const },
  { label: 'WordPress Engine Architecture', value: 'Zero-Bloat Custom Plugins', icon: Puzzle, colorPreset: 'violet' as const },
  { label: 'Production AI & RAG', value: 'LLM & Workflow Pipelines', icon: Cpu, colorPreset: 'emerald' as const },
];

const DOMAINS = [
  {
    title: 'WordPress & Headless Engine Architecture',
    subtitle: 'Custom PHP & Decoupled CMS',
    badgeText: 'Enterprise WordPress',
    color: 'from-amber-500 to-orange-600',
    border: 'border-t-brand-amber',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200/80',
    icon: Puzzle,
    description: 'Engineering high-concurrency, zero-bloat WordPress platforms without third-party page builders.',
    items: [
      'Bespoke Plugin Development: Object-oriented PHP (PSR-4), custom database tables & REST API extensions with zero bloat',
      'Native Gutenberg Block Engine: Hand-coded React/Gutenberg blocks providing seamless client editing without page builders',
      'Headless WordPress & GraphQL: Decoupled CMS architectures serving Next.js and React client frontends',
      'FCA & Enterprise Compliance: High-security data handling, custom user permission matrix, and automated audit logging',
      'Schema.org & JSON-LD Builders: Custom SEO graph assembly pipelines with Yoast & RankMath gate coordination',
    ],
  },
  {
    title: 'Backend Systems & Database Architecture',
    subtitle: 'APIs, Databases & Infrastructure',
    badgeText: 'Node.js / PHP / Postgres',
    color: 'from-violet-500 to-indigo-600',
    border: 'border-t-brand-violet',
    badgeBg: 'bg-violet-50 text-violet-800 border-violet-200/80',
    icon: Server,
    description: 'Designing resilient server architectures, scalable relational databases, and secure API layers.',
    items: [
      'Node.js & PHP Backend APIs: Express, RESTful endpoints, GraphQL, and real-time WebSocket communication',
      'Relational Databases & ORMs: NeonDB (Serverless PostgreSQL), MySQL, Prisma ORM, raw SQL query optimization & indexing',
      'Authentication & Security: JWT, OAuth 2.0, bcrypt password hashing, CSRF protection, and RBAC authorization',
      'CI/CD & DevOps: Docker containerization, Vercel deployments, GitHub Actions automation & environment configuration',
      'Automated E2E Testing: Playwright & Jest test suites for zero-regression production deployments',
    ],
  },
  {
    title: 'Frontend Engineering & Web Applications',
    subtitle: 'React, Next.js & Modern UI Architecture',
    badgeText: 'Next.js 14 / TypeScript',
    color: 'from-sky-500 to-blue-600',
    border: 'border-t-brand-sky',
    badgeBg: 'bg-sky-50 text-sky-800 border-sky-200/80',
    icon: Layout,
    description: 'Building lightning-fast, reactive web applications with state-of-the-art UI performance.',
    items: [
      'React & Next.js App Router: Server Components (RSC), Server Actions, SSR, ISR, and dynamic edge rendering',
      'Strict TypeScript Engineering: End-to-end type safety across client interfaces, props, and backend payload contracts',
      'Tailwind CSS & Design Systems: Tokenized design systems, responsive flex/grid layouts & micro-animations (Framer Motion)',
      'Core Web Vitals & Performance: 95+ Lighthouse optimization, image auto-scaling, dynamic lazy-loading & CLS control',
      'Cross-Browser Standards: Pixel-perfect Figma design implementation, accessibility (WCAG), and browser compatibility',
    ],
  },
  {
    title: 'AI Engineering & Automation Pipelines',
    subtitle: 'RAG Knowledge Bases & LLM Workflows',
    badgeText: 'OpenAI / RAG / n8n',
    color: 'from-emerald-500 to-teal-600',
    border: 'border-t-brand-emerald',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    icon: Cpu,
    description: 'Integrating intelligent AI agents, RAG vector retrieval, and automated business processing tools.',
    items: [
      'RAG & Vector Knowledge Base: Embedding site content, documents, and FAQs for contextual LLM responses',
      'LLM Integrations: OpenAI (GPT-4o), Google Gemini API, and local Ollama model integration with custom system prompts',
      'Automated Workflow Pipelines: n8n, Dify, webhooks, automated CRM lead capture, and Mailtrap notification dispatchers',
      'Interactive AI Widgets: Embeddable chat widgets with live streaming responses, lead collection & transcript auditing',
    ],
  },
];

export default function MyExpertise() {
  return (
    <section className="py-24 bg-brand-bg relative overflow-hidden">

      {/* Subtle Textured Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Pulsing Ambient Background Mesh Blobs */}
      <motion.div
        animate={{ opacity: [0.25, 0.5, 0.25], scale: [0.95, 1.08, 0.95] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-400/15 to-orange-300/10 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1.05, 0.95, 1.05] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-violet-400/15 to-indigo-300/10 blur-3xl pointer-events-none"
      />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-amber bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/80 inline-flex items-center gap-1.5 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Technical Capabilities & Engineering Mastery
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-brand-navy tracking-tight leading-tight">
            <TrueFocus sentence="Specialized Technical Expertise" borderColor="#d97706" glowColor="rgba(217, 119, 6, 0.4)" />
          </h2>
          <p className="text-base sm:text-lg text-brand-slate leading-relaxed">
            Specialized engineering capabilities refined over a decade of high-impact web development — building custom software architectures engineered for speed, security, and measurable business growth.
          </p>
        </div>

        {/* Highlight Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {TECH_STATS.map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <div key={idx} className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col items-center text-center space-y-2 group hover:border-amber-300 hover:shadow-md transition-all">
                <AnimatedBlob sizeClassName="w-12 h-12" colorPreset={stat.colorPreset}>
                  <StatIcon className="w-5 h-5 text-white" />
                </AnimatedBlob>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                <span className="text-sm sm:text-base font-black text-brand-navy">{stat.value}</span>
              </div>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DOMAINS.map((domain, index) => {
            const Icon = domain.icon;
            return (
              <div
                key={index}
                className={`bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 border-t-4 ${domain.border} flex flex-col justify-between group relative overflow-hidden`}
              >
                <div className="space-y-5">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <AnimatedBlob sizeClassName="w-14 h-14" gradient={domain.color}>
                      <Icon className="h-6 w-6 text-white" />
                    </AnimatedBlob>
                    <span className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${domain.badgeBg}`}>
                      {domain.badgeText}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-brand-navy leading-snug">
                      {domain.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 mt-1">
                      {domain.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium leading-relaxed">
                      {domain.description}
                    </p>
                  </div>

                  {/* Bullet list */}
                  <ul className="space-y-3 pt-3 border-t border-slate-100">
                    {domain.items.map((item, idx) => {
                      const [title, desc] = item.split(': ');
                      return (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>
                            <strong className="font-extrabold text-brand-navy">{title}:</strong> {desc}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}