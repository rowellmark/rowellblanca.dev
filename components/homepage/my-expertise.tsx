'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Server, Layout, Cpu, Puzzle, CheckCircle2 } from 'lucide-react';

const DOMAINS = [
  {
    title: 'WordPress Development',
    subtitle: 'Custom Plugins & Headless CMS',
    color: 'from-amber-500 to-orange-600',
    border: 'border-t-brand-amber',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Puzzle,
    items: [
      'Custom Plugin Development: Bespoke, zero-bloat plugins built from scratch — no page builders, no dependency bloat',
      'Custom Theme Architecture: Bedrock/Sage frameworks, hand-coded Gutenberg block libraries & native blog engines',
      'Headless WordPress: WP as a decoupled CMS powering React & Next.js frontends via REST/GraphQL',
      'Enterprise & FCA-Regulated Builds: Secure, compliant WordPress platforms for regulated finance clients',
    ],
  },
  {
    title: 'Software Development',
    subtitle: 'Backend & Architecture',
    color: 'from-violet-500 to-indigo-600',
    border: 'border-t-brand-violet',
    badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
    icon: Server,
    items: [
      'Backend: Node.js (Express), PHP (Laravel & custom backend APIs)',
      'Database: NeonDB (PostgreSQL), MySQL, Redis schema design & query optimization',
      'Security: JWT, OAuth 2.0, role-based auth & FCA-aligned data handling',
      'API Architecture: RESTful, GraphQL & WebSocket integrations',
      'Testing & CI/CD: Playwright E2E, Docker, GitHub Actions deployment',
    ],
  },
  {
    title: 'Frontend Engineering',
    subtitle: 'UI/UX & Web Apps',
    color: 'from-sky-500 to-blue-600',
    border: 'border-t-brand-sky',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: Layout,
    items: [
      'Core Stacks: React, Next.js (App Router), TypeScript, ES6+',
      'Styling: Tailwind CSS, SASS/SCSS, Framer Motion animations',
      'Design Integration: Figma & Photoshop pixel-perfect conversion',
      'SEO & Performance: Core Web Vitals, Structured Data (JSON-LD), Schema.org',
      'Responsive Web: Cross-browser & device optimization',
    ],
  },
  {
    title: 'Automation & AI Integration',
    subtitle: 'Workflows & Chatbots',
    color: 'from-emerald-500 to-teal-600',
    border: 'border-t-brand-emerald',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Cpu,
    items: [
      'Workflow Automation: n8n, Dify, Webhooks & CRM data pipelines',
      'AI Integration: OpenAI ChatGPT, Google Gemini API, Llama LLM agents',
      'Automated Lead Nurturing: Chatbots, automated email triggers & notifications',
      'Cloud Deployment: Vercel, AWS, Azure serverless environments',
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
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-amber bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
            Skills & Technical Stack
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-navy tracking-tight">
            Core Technical Expertise
          </h2>
          <p className="text-base text-brand-slate">
            Specialized engineering capabilities refined over a decade of high-impact web development.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DOMAINS.map((domain, index) => {
            const Icon = domain.icon;
            return (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 border-t-4 ${domain.border} flex flex-col justify-between group`}
              >
                <div className="space-y-6">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${domain.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${domain.badgeBg}`}>
                      {domain.subtitle}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-brand-navy leading-snug">
                      {domain.title}
                    </h3>
                  </div>

                  {/* Bullet list */}
                  <ul className="space-y-3 pt-2">
                    {domain.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
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