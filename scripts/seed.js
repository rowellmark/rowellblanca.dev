const { PrismaClient } = require('../lib/generated/client');
require('dotenv').config();

const prisma = new PrismaClient();

const SEED_PROJECTS = [
  {
    sitename: 'BuildForUser Platform',
    permalink: 'buildforuser',
    url: 'buildforuser.com',
    image: '',
    description: 'SaaS platform for managing client websites at scale — automated WordPress and React deployments, centralized client management, and integrated billing, replacing manual agency ops with a single operational dashboard.',
    technologies: ['React/Nextjs', 'Prisma', 'NeonDB', 'TypeScript', 'Node.js'],
    featured: true,
  },
  {
    sitename: 'MacManus Asset Finance Portal',
    permalink: 'macmanus-portal',
    url: 'macmanusfd.finance',
    image: '',
    description: 'Enterprise asset finance platform built for a regulated UK lender — end-to-end CRM lead pipeline, funder product directory, document hub, and support ticketing unified in one system.',
    technologies: ['React/Nextjs', 'Prisma', 'NeonDB', 'TypeScript', 'CRM Pipeline'],
    featured: true,
  },
  {
    sitename: 'Juliette Hohnen Real Estate',
    permalink: 'juliette-hohnen',
    url: 'juliettehohnen.com',
    image: '',
    description: 'Luxury real estate platform for one of Beverly Hills\' top-producing agents — custom property galleries, curated listings, and a streamlined inquiry flow built to convert high-value buyers.',
    technologies: ['Wordpress', 'PHP', 'Real Estate API', 'JavaScript'],
    featured: true,
  },
  {
    sitename: 'Tower Fire',
    permalink: 'tower-fire',
    url: 'towerfire.co.uk',
    image: '',
    description: 'Custom WordPress build powered by a hand-coded Gutenberg block library and a native Gutenberg blog engine — zero third-party page builders, full editorial control for the client\'s team.',
    technologies: ['Wordpress', 'PHP', 'Custom Gutenberg Blocks'],
    featured: true,
  },
  {
    sitename: 'MacManus Asset Finance Brokerage',
    permalink: 'macmanus-asset-finance',
    url: 'macmanusassetfinance.co.uk',
    image: '',
    description: 'FCA-regulated business finance brokerage site covering asset finance, business loans, invoice financing, and VAT loans — built for compliance-first content and lead capture.',
    technologies: ['Wordpress', 'PHP', 'FCA-Regulated'],
    featured: true,
  },
  {
    sitename: 'MacManus Partner Portal',
    permalink: 'macmanus-partner-portal',
    url: 'partners.macmanusassetfinance.co.uk',
    image: '',
    description: 'Application and onboarding portal for commercial finance professionals pursuing MacManus Certified Individual status, streamlining a previously manual approval process.',
    technologies: ['Wordpress', 'PHP', 'Partner Portal'],
    featured: true,
  },
  {
    sitename: 'MacManus Supplier Portal',
    permalink: 'macmanus-supplier-portal',
    url: 'suppliers.macmanusassetfinance.co.uk',
    image: '',
    description: 'Finance-enablement portal for vehicle, plant, equipment, and prestige car suppliers to offer point-of-sale asset financing directly to their customers.',
    technologies: ['Wordpress', 'PHP', 'Supplier Portal'],
    featured: true,
  },
  {
    sitename: 'MacManus Accountant Portal',
    permalink: 'macmanus-accountant-portal',
    url: 'accountants.macmanusassetfinance.co.uk',
    image: '',
    description: 'Referral portal for accountancy firms and advisers to introduce SME clients to MacManus funding without taking on lending infrastructure themselves.',
    technologies: ['Wordpress', 'PHP', 'Accountant Portal'],
    featured: true,
  },

  {
    sitename: 'Rowell Blanca — Developer Portfolio',
    permalink: 'rowell-blanca-dev',
    url: 'rowellblanca.dev',
    image: '',
    technologies: ['React/Nextjs', 'Prisma', 'NeonDB', 'TypeScript', 'Tailwind'],
    featured: true,
  },
  {
    sitename: 'Blanc Leads — WordPress CRM & Multi-AI Nurturing Plugin',
    permalink: 'blanc-leads-plugin',
    url: 'wp-content/plugins/buildforuser-leads',
    image: '',
    description: 'Bespoke WordPress CRM & AI Nurturing plugin capturing form submissions, lead pipelines, Kanban boards, and multi-provider AI nurturing.\n\nHOW IT WORKS:\n1. Form Lead Capture: Listens to WordPress form hooks (Kadence, WPForms, Contact Form 7), logging lead data, referrer, URL source, and user-agent.\n2. Native WP CRM: Manages lead records inside custom WP database tables with a Kanban board (New, Contacted, Qualified, Proposal Sent, Won, Lost), notes, tasks with due dates, and WP user owner assignments.\n3. Multi-Provider AI Nurturing: Connects to OpenAI, Claude, Gemini, DeepSeek, OpenRouter, or local Ollama to generate AI Lead Summaries, Suggested Next Actions, Context-Aware Email Drafts, 1-100 Lead Scoring, and Multi-Step Nurture Plans.\n4. Human-in-the-Loop Safety: AI creates drafts and insights, but all emails require human review before sending.',
    technologies: ['Wordpress Plugins', 'PHP', 'AI Integration', 'REST API', 'JavaScript'],
    featured: true,
  },
  {
    sitename: 'Blanc Schema LD Generator — WordPress SEO Plugin',
    permalink: 'blanc-schema-ld-generator',
    url: 'wp-content/plugins/buildforuser-schema-ld-generator',
    image: '',
    description: 'Bespoke JSON-LD Structured Data & Schema Builder WordPress plugin featuring visual block editing, live AJAX previewing, and Yoast SEO graph assembly compatibility.\n\nHOW IT WORKS:\n1. Visual Schema Builder: Build and edit JSON-LD schema blocks directly inside the WordPress Gutenberg / Classic editor and site-wide global admin dashboard.\n2. SchemaGraphAssembler Engine: Modular PHP (PSR-4) pipeline merges global site schemas, per-post schemas, and defaults, deduplicating @id tags into a single valid @graph JSON-LD script.\n3. Live Admin AJAX Preview: Generates instant live previews of the exact JSON-LD script output directly within the admin dashboard without reloading.\n4. Yoast SEO Gate Coordination: Coordinates output with Yoast SEO or All in One SEO using YoastSchemaGate to prevent duplicate schema markup conflicts.',
    technologies: ['Wordpress Plugins', 'PHP', 'JSON-LD', 'SEO', 'JavaScript'],
    featured: true,
  },
  {
    sitename: 'Blanc Chatbot — WordPress AI Widget & RAG Knowledge Base Plugin',
    permalink: 'blanc-chatbot-plugin',
    url: 'wp-content/plugins/buildforuser-chatbox',
    image: '',
    description: 'Bespoke WordPress Chatbot & RAG Knowledge Base plugin featuring sitewide floating chat, shortcode embedding, WP post/page RAG import, FAQ builder, conversation history logging, and configurable LLM backends (OpenAI & local Ollama).\n\nHOW IT WORKS:\n1. RAG Knowledge Import: Imports published WordPress pages, posts, uploaded documents, or FAQs into a searchable local vector/knowledge chunk index.\n2. Configurable LLM Backend: Connects to OpenAI (GPT-4o) or local Ollama endpoints with customizable system prompts and company persona controls.\n3. Public Widget & Shortcode: Renders as a floating public widget or inline shortcode ([blanc_chatbox]) with contact details collection and instant streaming responses.\n4. Admin SPA & Transcripts: Full React/TypeScript Admin SPA to inspect visitor conversation logs, transcript summaries, and email notification alerts.',
    technologies: ['Wordpress Plugins', 'PHP', 'AI Integration', 'REST API', 'RAG Knowledge Base'],
    featured: true,
  },
  {
    sitename: 'Blanc Login Customizer — WordPress Admin & Security Plugin',
    permalink: 'blanc-login-customizer',
    url: 'wp-content/plugins/buildforuser-login-customizer',
    image: '',
    description: 'Bespoke WordPress Admin & Login Security plugin featuring a premium split-panel custom login interface, brand logo integration, and security slug rewriting (renaming /wp-admin login URL to protect against brute-force attacks).\n\nHOW IT WORKS:\n1. Custom Login URL Rewriter: Renames default /wp-admin and /wp-login.php URLs to custom secret slugs, blocking unauthorized automated brute-force bots.\n2. Split-Panel Interface Builder: Renders modern glassmorphism or dual-tone split login layouts with custom brand backgrounds, typography, and accent colors.\n3. Brand & Logo Customizer: Live admin preview for logo uploads, custom form positioning, button styling, and copyright footers.\n4. Admin Security & WP Dashboard Gate: Integrates seamlessly with BuildForUser / Blanc core dashboard plugins for centralized plugin authorization.',
    technologies: ['Wordpress Plugins', 'PHP', 'Security', 'Vite', 'React', 'JavaScript'],
    featured: true,
  },
  {
    sitename: 'MNMLST — Minimalist Dynamic Scroll Experience',
    permalink: 'minimalist-dynamic-scroll',
    url: 'minimalistdemo.rowellblanca.dev',
    image: '',
    description: 'Interactive minimalist digital studio showcase featuring kinetic dynamic scroll transitions, gesture and keyboard-driven slide navigation, and high-impact editorial typography built with Next.js 15 and React 19.',
    technologies: ['React/Nextjs', 'TypeScript', 'CSS Animations', 'Tailwind'],
    featured: true,
  },
  {
    sitename: 'Smooth Fruit — Dynamic Mobile App Landing Experience',
    permalink: 'smooth-fruit-standard',
    url: 'smoothfruitdemo.rowellblanca.dev',
    image: '',
    description: 'Vibrant interactive mobile app landing page for a smoothie & juice brand featuring 3D parallax tilt effects, floating interactive fruit elements, and instant App Store & Google Play conversion flows.',
    technologies: ['React/Nextjs', 'TypeScript', 'CSS 3D Parallax', 'Tailwind'],
    featured: true,
  },
];



async function main() {
  const isReset = process.argv.includes('--reset');
  console.log(`⚡ Starting NeonDB (PostgreSQL) Production Database Reset & Seed Script ${isReset ? '(RESET MODE)' : ''}...`);

  if (isReset) {
    console.log('🧹 Purging existing test records across Projects, Testimonials, Leads, and Messages...');
    await prisma.project.deleteMany({});
    await prisma.testimonial.deleteMany({});
    await prisma.lead.deleteMany({});
    await prisma.contactMessage.deleteMany({});
    console.log('✓ Purged test database tables successfully.');
  }

  let count = 0;
  for (const proj of SEED_PROJECTS) {
    const isSpotlight = proj.permalink === 'macmanus-portal';
    await prisma.project.upsert({
      where: { permalink: proj.permalink },
      update: {
        sitename: proj.sitename,
        url: proj.url,
        image: proj.image || '',
        mobileImage: proj.mobileImage || null,
        fullDesktopImage: proj.fullDesktopImage || null,
        fullMobileImage: proj.fullMobileImage || null,
        description: proj.description,
        technologies: proj.technologies,
        featured: proj.featured,
        spotlight: isSpotlight,
        active: true,
      },
      create: {
        sitename: proj.sitename,
        permalink: proj.permalink,
        url: proj.url,
        image: proj.image || '',
        mobileImage: proj.mobileImage || null,
        fullDesktopImage: proj.fullDesktopImage || null,
        fullMobileImage: proj.fullMobileImage || null,
        description: proj.description,
        technologies: proj.technologies,
        featured: proj.featured,
        spotlight: isSpotlight,
        active: true,
      },
    });
    count++;
  }

  console.log(`✓ ${count} Production Portfolio Projects successfully seeded into NeonDB!`);

  // Seed Client Testimonials
  const SEED_TESTIMONIALS = [
    {
      name: 'Giles McManus',
      role: 'Managing Director',
      company: 'MacManus Asset Finance',
      quote: 'Rowell engineered our entire broker, partner, supplier, and accountant portals with exceptional speed and precision. His expertise in full-stack web architecture transformed our operational workflow.',
      rating: 5,
      active: true,
    },
    {
      name: 'Tower Fire Solutions',
      role: 'Operations Team',
      company: 'Tower Fire UK',
      quote: 'The bespoke WordPress Gutenberg block engine Rowell built for our site allows us to publish clean, custom pages effortlessly without relying on slow page builders.',
      rating: 5,
      active: true,
    },
    {
      name: 'Juliette Hohnen',
      role: 'Principal Partner',
      company: 'Juliette Hohnen Real Estate',
      quote: 'Rowell created a sleek, high-performing luxury real estate portal that showcases Beverly Hills properties with high visual excellence.',
      rating: 5,
      active: true,
    },
  ];

  let testimonialCount = 0;
  for (const t of SEED_TESTIMONIALS) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name, company: t.company } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
      testimonialCount++;
    }
  }
  console.log(`✓ ${testimonialCount} Verified Client Testimonials seeded into NeonDB!`);
  console.log(`🚀 Database is clean, fully seeded, and ready for LIVE deployment!`);
}

main()
  .catch((e) => {
    console.error('✗ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
