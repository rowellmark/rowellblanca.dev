export interface FallbackProject {
  id: number;
  sitename: string;
  permalink: string;
  url: string;
  image: string;
  mobileImage?: string;
  fullDesktopImage?: string;
  fullMobileImage?: string;
  screenshots?: string[];
  description: string;
  content?: string;
  client?: string;
  role?: string;
  duration?: string;
  category?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  technologies: string[];
  featured: boolean;
  spotlight: boolean;
  active?: boolean;
}

export const FALLBACK_PROJECTS: FallbackProject[] = [
  {
    id: 1,
    sitename: 'BuildForUser Platform',
    permalink: 'buildforuser',
    url: 'buildforuser.com',
    image: 'buildforuser.png',
    mobileImage: '',
    description: 'SaaS platform for managing client websites at scale — automated WordPress and React deployments, centralized client management, and integrated billing, replacing manual agency ops with a single operational dashboard.',
    technologies: ['React/Nextjs', 'Prisma', 'NeonDB', 'TypeScript', 'Node.js'],
    featured: true,
    spotlight: false,
    active: true,
  },
  {
    id: 2,
    sitename: 'MacManus Asset Finance Portal',
    permalink: 'macmanus-portal',
    url: 'macmanusfd.finance',
    image: 'macmanus-portal.png',
    mobileImage: '',
    description: 'Enterprise asset finance platform built for a regulated UK lender — end-to-end CRM lead pipeline, funder product directory, document hub, and support ticketing unified in one system.',
    technologies: ['React/Nextjs', 'Prisma', 'NeonDB', 'TypeScript', 'CRM Pipeline'],
    featured: true,
    spotlight: true,
    active: true,
  },
  {
    id: 3,
    sitename: 'Juliette Hohnen Real Estate',
    permalink: 'juliette-hohnen',
    url: 'juliettehohnen.com',
    image: 'juliettehohnen.png',
    mobileImage: '',
    description: 'Luxury real estate platform for one of Beverly Hills\' top-producing agents — custom property galleries, curated listings, and a streamlined inquiry flow built to convert high-value buyers.',
    technologies: ['Wordpress', 'PHP', 'Real Estate API', 'JavaScript'],
    featured: true,
    spotlight: false,
    active: true,
  },
  {
    id: 4,
    sitename: 'Tower Fire',
    permalink: 'tower-fire',
    url: 'towerfire.co.uk',
    image: 'towerfire.png',
    mobileImage: '',
    description: 'Custom WordPress build powered by a hand-coded Gutenberg block library and a native Gutenberg blog engine — zero third-party page builders, full editorial control for the client\'s team.',
    technologies: ['Wordpress', 'PHP', 'Custom Gutenberg Blocks'],
    featured: true,
    spotlight: false,
    active: true,
  },
  {
    id: 5,
    sitename: 'MacManus Asset Finance Brokerage',
    permalink: 'macmanus-asset-finance',
    url: 'macmanusassetfinance.co.uk',
    image: 'macmanus.png',
    mobileImage: '',
    description: 'FCA-regulated business finance brokerage site covering asset finance, business loans, invoice financing, and VAT loans — built for compliance-first content and lead capture.',
    technologies: ['Wordpress', 'PHP', 'FCA-Regulated'],
    featured: true,
    spotlight: false,
    active: true,
  },
  {
    id: 6,
    sitename: 'MacManus Partner Portal',
    permalink: 'macmanus-partner-portal',
    url: 'partners.macmanusassetfinance.co.uk',
    image: 'partner-portal.png',
    mobileImage: '',
    description: 'Application and onboarding portal for commercial finance professionals pursuing MacManus Certified Individual status, streamlining a previously manual approval process.',
    technologies: ['Wordpress', 'PHP', 'Partner Portal'],
    featured: true,
    spotlight: false,
    active: true,
  },
  {
    id: 7,
    sitename: 'MacManus Supplier Portal',
    permalink: 'macmanus-supplier-portal',
    url: 'suppliers.macmanusassetfinance.co.uk',
    image: 'supplier-portal.png',
    mobileImage: '',
    description: 'Finance-enablement portal for vehicle, plant, equipment, and prestige car suppliers to offer point-of-sale asset financing directly to their customers.',
    technologies: ['Wordpress', 'PHP', 'Supplier Portal'],
    featured: true,
    spotlight: false,
    active: true,
  },
  {
    id: 8,
    sitename: 'MacManus Accountant Portal',
    permalink: 'macmanus-accountant-portal',
    url: 'accountants.macmanusassetfinance.co.uk',
    image: 'accountant-portal.png',
    mobileImage: '',
    description: 'Referral portal for accountancy firms and advisers to introduce SME clients to MacManus funding without taking on lending infrastructure themselves.',
    technologies: ['Wordpress', 'PHP', 'Accountant Portal'],
    featured: true,
    spotlight: false,
    active: true,
  },
  {
    id: 9,
    sitename: 'Rowell Blanca — Developer Portfolio',
    permalink: 'rowell-blanca-dev',
    url: 'rowellblanca.dev',
    image: 'rowellbanner.png',
    mobileImage: '',
    description: 'Personal portfolio showcasing full-stack engineering work across React/Next.js and Node.js/PHP backends, custom WordPress builds, and AI-driven automation workflows.',
    technologies: ['React/Nextjs', 'Prisma', 'NeonDB', 'TypeScript', 'Tailwind'],
    featured: true,
    spotlight: false,
    active: true,
  },
  {
    id: 10,
    sitename: 'Blanc Leads — WordPress CRM & Multi-AI Nurturing Plugin',
    permalink: 'blanc-leads-plugin',
    url: 'wp-content/plugins/buildforuser-leads',
    image: 'buildforuser.png',
    mobileImage: '',
    description: 'Bespoke WordPress CRM & AI Nurturing plugin capturing form submissions, lead pipelines, Kanban boards, and multi-provider AI nurturing.\n\nHOW IT WORKS:\n1. Form Lead Capture: Listens to WordPress form hooks (Kadence, WPForms, Contact Form 7), logging lead data, referrer, URL source, and user-agent.\n2. Native WP CRM: Manages lead records inside custom WP database tables with a Kanban board (New, Contacted, Qualified, Proposal Sent, Won, Lost), notes, tasks with due dates, and WP user owner assignments.\n3. Multi-Provider AI Nurturing: Connects to OpenAI, Claude, Gemini, DeepSeek, OpenRouter, or local Ollama to generate AI Lead Summaries, Suggested Next Actions, Context-Aware Email Drafts, 1-100 Lead Scoring, and Multi-Step Nurture Plans.\n4. Human-in-the-Loop Safety: AI creates drafts and insights, but all emails require human review before sending.',
    technologies: ['Wordpress Plugins', 'PHP', 'AI Integration', 'REST API', 'JavaScript'],
    featured: true,
    spotlight: false,
    active: true,
  },
  {
    id: 11,
    sitename: 'Blanc Schema LD Generator — WordPress SEO Plugin',
    permalink: 'blanc-schema-ld-generator',
    url: 'wp-content/plugins/buildforuser-schema-ld-generator',
    image: 'towerfire.png',
    mobileImage: '',
    description: 'Bespoke JSON-LD Structured Data & Schema Builder WordPress plugin featuring visual block editing, live AJAX previewing, and Yoast SEO graph assembly compatibility.\n\nHOW IT WORKS:\n1. Visual Schema Builder: Build and edit JSON-LD schema blocks directly inside the WordPress Gutenberg / Classic editor and site-wide global admin dashboard.\n2. SchemaGraphAssembler Engine: Modular PHP (PSR-4) pipeline merges global site schemas, per-post schemas, and defaults, deduplicating @id tags into a single valid @graph JSON-LD script.\n3. Live Admin AJAX Preview: Generates instant live previews of the exact JSON-LD script output directly within the admin dashboard without reloading.\n4. Yoast SEO Gate Coordination: Coordinates output with Yoast SEO or All in One SEO using YoastSchemaGate to prevent duplicate schema markup conflicts.',
    technologies: ['Wordpress Plugins', 'PHP', 'JSON-LD', 'SEO', 'JavaScript'],
    featured: true,
    spotlight: false,
    active: true,
  },
  {
    id: 12,
    sitename: 'Blanc Chatbot — WordPress AI Widget & RAG Knowledge Base Plugin',
    permalink: 'blanc-chatbot-plugin',
    url: 'wp-content/plugins/buildforuser-chatbox',
    image: 'buildforuser.png',
    mobileImage: '',
    description: 'Bespoke WordPress Chatbot & RAG Knowledge Base plugin featuring sitewide floating chat, shortcode embedding, WP post/page RAG import, FAQ builder, conversation history logging, and configurable LLM backends (OpenAI & local Ollama).\n\nHOW IT WORKS:\n1. RAG Knowledge Import: Imports published WordPress pages, posts, uploaded documents, or FAQs into a searchable local vector/knowledge chunk index.\n2. Configurable LLM Backend: Connects to OpenAI (GPT-4o) or local Ollama endpoints with customizable system prompts and company persona controls.\n3. Public Widget & Shortcode: Renders as a floating public widget or inline shortcode ([blanc_chatbox]) with contact details collection and instant streaming responses.\n4. Admin SPA & Transcripts: Full React/TypeScript Admin SPA to inspect visitor conversation logs, transcript summaries, and email notification alerts.',
    technologies: ['Wordpress Plugins', 'PHP', 'AI Integration', 'REST API', 'RAG Knowledge Base'],
    featured: true,
    spotlight: false,
    active: true,
  },
  {
    id: 13,
    sitename: 'BuildForUser Login Customizer — WordPress Plugin',
    permalink: 'buildforuser-login-customizer-plugin',
    url: 'wp-content/plugins/buildforuser-login-customizer',
    image: 'buildforuser.png',
    mobileImage: '',
    description: 'Bespoke WordPress login screen customizer featuring a premium split-panel interface, live logo/background/colour-scheme editing, and a secure login URL renaming tool to obscure the default wp-login.php path.\n\nHOW IT WORKS:\n1. Split-Panel Login UI: Replaces the default WordPress login screen with a branded split-panel design — left column shows a customizable hero/branding panel, right column shows the login form.\n2. Live Customizer Settings: Logo upload, background image/colour, accent colours, and tagline are all configurable from the WordPress admin dashboard without touching code.\n3. Secure Login URL Renaming: Registers a custom login slug (e.g. /admin-access) and redirects the default /wp-login.php to a 404 — reducing brute-force attack surface on the login page.\n4. Dashboard Integration: Settings surface is integrated into the BuildForUser Dashboard admin menu, sharing the same branding and UI shell as the rest of the plugin suite.',
    technologies: ['Wordpress Plugins', 'PHP', 'Security', 'Admin UI', 'JavaScript'],
    featured: true,
    spotlight: false,
    active: true,
  },
];
