import type { PortfolioProject } from '@/components/ui/portfolio-card';

export interface StackDef {
  slug: string;
  name: string;
  /** simple-icons export name, rendered by StackIcon. */
  icon: 'nextjs' | 'wordpress' | 'typescript' | 'postgresql' | 'php' | 'ai';
  /** Matched against each project's technologies. */
  match: RegExp;
  /** Matched against blog post titles, tags and categories. */
  articles: RegExp;
  service: 'react' | 'wordpress';
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  intro: string;
  capabilities: { title: string; body: string }[];
}

/**
 * The tech stack hubs at /work/[slug]. Each one lists the projects whose `technologies`
 * match, so new admin projects appear on the right pages automatically.
 */
export const STACKS: StackDef[] = [
  {
    slug: 'nextjs',
    name: 'Next.js & React',
    icon: 'nextjs',
    match: /next|react/i,
    articles: /next|react/i,
    service: 'react',
    seoTitle: 'Next.js & React Developer Portfolio',
    seoDescription:
      'Next.js and React projects by Rowell Mark Blanca: SaaS platforms, regulated finance portals and fast marketing sites, with live previews and case studies.',
    keywords: ['Next.js developer portfolio', 'React developer UK', 'Next.js SaaS developer', 'freelance Next.js developer'],
    intro:
      'SaaS dashboards, client portals and marketing sites built on the Next.js App Router: server components, typed data layers and fast first loads.',
    capabilities: [
      { title: 'SaaS platforms & portals', body: 'Multi-role dashboards, CRM pipelines, billing and document hubs with Prisma and PostgreSQL behind them.' },
      { title: 'Performance-first front ends', body: 'Server rendering, image and font optimisation and lean client bundles, tuned against Core Web Vitals.' },
      { title: 'Headless & API work', body: 'Next.js front ends on top of WordPress, REST and third-party APIs, deployed on Vercel.' },
    ],
  },
  {
    slug: 'wordpress',
    name: 'WordPress',
    icon: 'wordpress',
    match: /wordpress|gutenberg/i,
    articles: /wordpress|gutenberg/i,
    service: 'wordpress',
    seoTitle: 'Custom WordPress Developer Portfolio',
    seoDescription:
      'Custom WordPress builds by Rowell Mark Blanca: hand-coded Gutenberg blocks, partner portals and regulated-industry sites with no page builders.',
    keywords: ['WordPress developer portfolio', 'custom WordPress developer UK', 'Gutenberg block developer', 'WordPress portal developer'],
    intro:
      'Custom themes and hand-coded Gutenberg blocks with no page builders, from luxury real estate to FCA-regulated finance and partner portals.',
    capabilities: [
      { title: 'Custom Gutenberg blocks', body: 'Block libraries the client team can edit safely, instead of Elementor or Divi layouts.' },
      { title: 'Portals & integrations', body: 'Partner, supplier and accountant portals, CRM hand-offs and third-party APIs on WordPress.' },
      { title: 'Speed & maintainability', body: 'Lean themes, few plugins and clean PHP, so sites stay fast and easy to update.' },
    ],
  },
  {
    slug: 'wordpress-plugins',
    name: 'WordPress Plugins',
    icon: 'wordpress',
    match: /plugin/i,
    articles: /plugin|wordpress/i,
    service: 'wordpress',
    seoTitle: 'WordPress Plugin Developer Portfolio',
    seoDescription:
      'WordPress plugins by Rowell Mark Blanca: AI chatbots with RAG, lead CRM, JSON-LD schema and admin tools, built with PHP, REST and modern JavaScript.',
    keywords: ['WordPress plugin developer', 'custom WordPress plugin', 'AI WordPress plugin', 'WordPress SEO plugin developer'],
    intro:
      'Plugins built and maintained as products: AI chatbots with a RAG knowledge base, a lead CRM, schema generation and admin customisation.',
    capabilities: [
      { title: 'AI inside WordPress', body: 'Chat widgets and lead nurturing that call AI providers through the REST API, with your own content as context.' },
      { title: 'SEO & structured data', body: 'JSON-LD schema generation and SEO tooling that runs inside the editor.' },
      { title: 'Admin & security tools', body: 'Branded logins, settings screens and hardening, written to WordPress coding standards.' },
    ],
  },
  {
    slug: 'typescript',
    name: 'TypeScript',
    icon: 'typescript',
    match: /typescript/i,
    articles: /typescript|next|react/i,
    service: 'react',
    seoTitle: 'TypeScript Developer Portfolio',
    seoDescription:
      'TypeScript projects by Rowell Mark Blanca: strictly typed Next.js apps, Prisma data layers and APIs for SaaS and regulated finance platforms.',
    keywords: ['TypeScript developer', 'TypeScript Next.js developer', 'full-stack TypeScript developer'],
    intro: 'End-to-end typed applications: database schema, API routes and React components share one set of types.',
    capabilities: [
      { title: 'Typed data layers', body: 'Prisma models and generated types carried from the database to the UI.' },
      { title: 'Safe refactors', body: 'Strict compiler settings so large platforms can change without regressions.' },
      { title: 'Typed integrations', body: 'Third-party APIs wrapped in typed clients and validated at the edge of the system.' },
    ],
  },
  {
    slug: 'postgresql',
    name: 'PostgreSQL, Prisma & NeonDB',
    icon: 'postgresql',
    match: /postgres|prisma|neon/i,
    articles: /prisma|postgres|neon|database/i,
    service: 'react',
    seoTitle: 'PostgreSQL, Prisma & NeonDB Projects',
    seoDescription:
      'PostgreSQL projects by Rowell Mark Blanca: Prisma schemas on serverless NeonDB powering SaaS platforms, CRMs and finance portals.',
    keywords: ['Prisma developer', 'NeonDB developer', 'PostgreSQL Next.js developer'],
    intro: 'Relational data models on serverless Postgres (NeonDB) with Prisma, behind SaaS platforms, CRMs and finance portals.',
    capabilities: [
      { title: 'Schema design', body: 'Normalised models for leads, clients, invoices and permissions, migrated safely.' },
      { title: 'Serverless Postgres', body: 'NeonDB with pooled connections, sized for Vercel functions and edge rendering.' },
      { title: 'Query performance', body: 'Indexed queries, selective fields and caching so dashboards stay fast as data grows.' },
    ],
  },
  {
    slug: 'php',
    name: 'PHP',
    icon: 'php',
    match: /php/i,
    articles: /php|wordpress/i,
    service: 'wordpress',
    seoTitle: 'PHP Developer Portfolio',
    seoDescription:
      'PHP projects by Rowell Mark Blanca: custom WordPress themes, Gutenberg blocks, portals and plugins built over 12+ years.',
    keywords: ['PHP developer', 'PHP WordPress developer', 'freelance PHP developer'],
    intro: 'Server-side PHP behind custom WordPress themes, Gutenberg blocks, portals and plugins.',
    capabilities: [
      { title: 'WordPress internals', body: 'Hooks, custom post types, REST endpoints and block registration done the WordPress way.' },
      { title: 'Portal logic', body: 'Role-based access, forms and integrations for partner and client portals.' },
      { title: 'Modern PHP', body: 'Typed, namespaced PHP 8 code that is easy to maintain and test.' },
    ],
  },
  {
    slug: 'ai',
    name: 'AI Integrations',
    icon: 'ai',
    match: /\bai\b|\brag\b|gemini|openai|llm/i,
    articles: /\bai\b|\brag\b|gemini|chatbot/i,
    service: 'wordpress',
    seoTitle: 'AI Integration Projects: RAG & Chatbots',
    seoDescription:
      'AI integration projects by Rowell Mark Blanca: RAG chatbots, AI lead nurturing and assistants for WordPress and Next.js.',
    keywords: ['AI integration developer', 'RAG chatbot developer', 'AI WordPress plugin', 'Next.js AI developer'],
    intro: 'Practical AI features: chatbots that answer from your own content, AI lead scoring and nurturing, and in-app assistants.',
    capabilities: [
      { title: 'RAG chatbots', body: 'Assistants that answer from a site’s own pages and documents, not generic model knowledge.' },
      { title: 'Lead automation', body: 'AI classification and follow-up for inbound leads, wired into a CRM.' },
      { title: 'Provider choice', body: 'OpenAI, Claude, Gemini or a local Ollama model behind one interface, with keys kept server-side.' },
    ],
  },
];

export function getStack(slug: string) {
  return STACKS.find((s) => s.slug === slug) || null;
}

export function projectsForStack(stack: StackDef, projects: PortfolioProject[]) {
  return projects.filter((p) => p.technologies?.some((t) => stack.match.test(t)));
}

// Most specific first, so "Wordpress Plugins" links to the plugins hub rather than WordPress.
const CHIP_PRIORITY = ['wordpress-plugins', 'ai', 'postgresql', 'typescript', 'php', 'nextjs', 'wordpress'];

/** The stack hub a single technology chip should link to, if any. */
export function stackForTech(tech: string) {
  for (const slug of CHIP_PRIORITY) {
    const stack = getStack(slug);
    if (stack?.match.test(tech)) return stack;
  }
  return null;
}
